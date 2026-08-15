#![no_std]

mod storage;

#[cfg(test)]
mod test;
#[cfg(test)]
mod test_inter_contract;

use shikkhak_token::ShikkhakTokenClient;
use soroban_sdk::{
    contract, contracterror, contractimpl, panic_with_error, symbol_short, Address, BytesN, Env,
    String, Vec,
};
use storage::*;

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum CoreError {
    AlreadyInitialized = 1,
    NotInitialized = 2,
    NotAuthorized = 3,
    CourseNotFound = 4,
    CourseInactive = 5,
    ModuleAlreadyCompleted = 6,
    FraudDetected = 7,
    PassingScoreRequired = 8,
    CredentialNotFound = 9,
    InvalidModuleId = 10,
}

#[contract]
pub struct ShikkhakCore;

#[contractimpl]
impl ShikkhakCore {
    /// Initialize the core platform contract with admin, token reward contract, and AI Oracle address
    pub fn initialize(
        env: Env,
        admin: Address,
        token_contract: Address,
        ai_oracle: Address,
    ) {
        if has_admin(&env) {
            panic_with_error!(&env, CoreError::AlreadyInitialized);
        }
        admin.require_auth();

        set_admin(&env, &admin);
        set_token_contract(&env, &token_contract);
        set_ai_oracle(&env, &ai_oracle);
        set_course_count(&env, 0);

        env.events().publish(
            (symbol_short!("core_init"), admin),
            (token_contract, ai_oracle),
        );
    }

    /// Admin registers a new course
    pub fn register_course(
        env: Env,
        id: u32,
        title: String,
        total_modules: u32,
        base_reward_per_module: i128,
    ) {
        let admin = get_admin(&env);
        admin.require_auth();

        let course = Course {
            id,
            title,
            total_modules,
            base_reward_per_module,
            is_active: true,
        };

        set_course(&env, &course);
        let count = get_course_count(&env);
        if id >= count {
            set_course_count(&env, id + 1);
        }

        env.events().publish(
            (symbol_short!("new_crs"), id),
            (total_modules, base_reward_per_module),
        );
    }

    /// Admin updates the Token Contract address
    pub fn set_token_contract(env: Env, new_token: Address) {
        let admin = get_admin(&env);
        admin.require_auth();
        storage::set_token_contract(&env, &new_token);
    }

    /// Admin updates the AI Oracle address
    pub fn set_ai_oracle(env: Env, new_oracle: Address) {
        let admin = get_admin(&env);
        admin.require_auth();
        storage::set_ai_oracle(&env, &new_oracle);
    }

    /// Enroll or record diagnostic level for a learner
    pub fn record_diagnostic(env: Env, learner: Address, diagnostic_level: u32) {
        learner.require_auth();

        let mut profile = get_learner_profile(&env, &learner).unwrap_or(LearnerProfile {
            enrolled_courses: Vec::new(&env),
            diagnostic_level: 1,
            total_earned: 0,
            total_completed_modules: 0,
            trust_score: 100,
        });

        profile.diagnostic_level = diagnostic_level;
        set_learner_profile(&env, &learner, &profile);

        env.events().publish(
            (symbol_short!("diag_set"), learner),
            diagnostic_level,
        );
    }

    /// Complete a module with AI fraud attestation and trigger cross-contract reward minting
    pub fn complete_module(
        env: Env,
        learner: Address,
        course_id: u32,
        module_id: u32,
        score_pct: u32,
        fraud_score: u32,
        proof_hash: BytesN<32>,
    ) -> i128 {
        learner.require_auth();

        let course = get_course(&env, course_id)
            .unwrap_or_else(|| panic_with_error!(&env, CoreError::CourseNotFound));

        if !course.is_active {
            panic_with_error!(&env, CoreError::CourseInactive);
        }

        if module_id == 0 || module_id > course.total_modules {
            panic_with_error!(&env, CoreError::InvalidModuleId);
        }

        // Check if module already completed
        if get_completion(&env, &learner, course_id, module_id).is_some() {
            panic_with_error!(&env, CoreError::ModuleAlreadyCompleted);
        }

        // Anti-cheat verification: Fraud score must be <= 30 (0 is perfect, 100 is high risk)
        if fraud_score > 30 {
            panic_with_error!(&env, CoreError::FraudDetected);
        }

        // Learner must achieve passing score (e.g. >= 60%)
        if score_pct < 60 {
            panic_with_error!(&env, CoreError::PassingScoreRequired);
        }

        let mut profile = get_learner_profile(&env, &learner).unwrap_or(LearnerProfile {
            enrolled_courses: Vec::new(&env),
            diagnostic_level: 1,
            total_earned: 0,
            total_completed_modules: 0,
            trust_score: 100,
        });

        // Calculate dynamic reward: Base Reward * (Score / 100) + Level Bonus
        let base_reward = course.base_reward_per_module;
        let score_multiplier = score_pct as i128;
        let base_earned = (base_reward * score_multiplier) / 100;
        let level_bonus = (profile.diagnostic_level as i128) * 10_000_000; // 1 extra SKK per level
        let total_reward = base_earned + level_bonus;

        let current_ledger = env.ledger().sequence();

        // 1. Record on-chain completion
        let completion = ModuleCompletion {
            completed_at_ledger: current_ledger,
            score_pct,
            fraud_score,
            reward_minted: total_reward,
            proof_hash: proof_hash.clone(),
        };
        set_completion(&env, &learner, course_id, module_id, &completion);

        // 2. Update Learner Profile
        profile.total_earned += total_reward;
        profile.total_completed_modules += 1;
        // Update trust score dynamically: slightly decay if fraud_score was elevated
        if fraud_score > 10 && profile.trust_score > 50 {
            profile.trust_score -= 2;
        }
        set_learner_profile(&env, &learner, &profile);

        // 3. INTER-CONTRACT CALL: Mint reward tokens via shikkhak_token contract
        let token_address = get_token_contract(&env);
        let token_client = ShikkhakTokenClient::new(&env, &token_address);
        let core_contract_address = env.current_contract_address();
        token_client.mint_reward(&core_contract_address, &learner, &total_reward);

        // 4. Emit on-chain event
        env.events().publish(
            (symbol_short!("mod_done"), learner.clone()),
            (course_id, module_id, total_reward, score_pct),
        );

        total_reward
    }

    /// Issue a verifiable, tamper-proof credential proof when course is finished
    pub fn issue_credential(
        env: Env,
        learner: Address,
        course_id: u32,
        credential_id: BytesN<32>,
        average_score: u32,
        total_reward: i128,
    ) {
        let admin = get_admin(&env);
        admin.require_auth();

        let current_ledger = env.ledger().sequence();
        let credential = CredentialProof {
            credential_id: credential_id.clone(),
            learner: learner.clone(),
            course_id,
            issued_at_ledger: current_ledger,
            average_score,
            total_reward,
            is_valid: true,
        };

        set_credential(&env, &credential_id, &credential);

        env.events().publish(
            (symbol_short!("cred_iss"), learner),
            (course_id, credential_id),
        );
    }

    /// Verify a credential on-chain
    pub fn verify_credential(env: Env, credential_id: BytesN<32>) -> CredentialProof {
        get_credential(&env, &credential_id)
            .unwrap_or_else(|| panic_with_error!(&env, CoreError::CredentialNotFound))
    }

    /// Get Learner Profile
    pub fn get_profile(env: Env, learner: Address) -> LearnerProfile {
        get_learner_profile(&env, &learner).unwrap_or(LearnerProfile {
            enrolled_courses: Vec::new(&env),
            diagnostic_level: 1,
            total_earned: 0,
            total_completed_modules: 0,
            trust_score: 100,
        })
    }

    /// Get Course Details
    pub fn get_course_details(env: Env, course_id: u32) -> Course {
        get_course(&env, course_id)
            .unwrap_or_else(|| panic_with_error!(&env, CoreError::CourseNotFound))
    }

    /// Check if module completed
    pub fn is_module_completed(
        env: Env,
        learner: Address,
        course_id: u32,
        module_id: u32,
    ) -> bool {
        get_completion(&env, &learner, course_id, module_id).is_some()
    }

    /// Contract bytecode upgrade
    pub fn upgrade(env: Env, new_wasm_hash: BytesN<32>) {
        let admin = get_admin(&env);
        admin.require_auth();
        env.deployer().update_current_contract_wasm(new_wasm_hash);
    }
}
