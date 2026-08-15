use soroban_sdk::{contracttype, Address, BytesN, Env, String, Vec};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Admin,
    TokenContract,
    AiOracle,
    Course(u32),
    CourseCount,
    LearnerProfile(Address),
    ModuleCompletion(CompletionKey),
    Credential(BytesN<32>),
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CompletionKey {
    pub learner: Address,
    pub course_id: u32,
    pub module_id: u32,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Course {
    pub id: u32,
    pub title: String,
    pub total_modules: u32,
    pub base_reward_per_module: i128,
    pub is_active: bool,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct LearnerProfile {
    pub enrolled_courses: Vec<u32>,
    pub diagnostic_level: u32, // 1: Beginner, 2: Intermediate, 3: Advanced
    pub total_earned: i128,
    pub total_completed_modules: u32,
    pub trust_score: u32,      // 0-100 anti-cheat trust score
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ModuleCompletion {
    pub completed_at_ledger: u32,
    pub score_pct: u32,
    pub fraud_score: u32,
    pub reward_minted: i128,
    pub proof_hash: BytesN<32>,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CredentialProof {
    pub credential_id: BytesN<32>,
    pub learner: Address,
    pub course_id: u32,
    pub issued_at_ledger: u32,
    pub average_score: u32,
    pub total_reward: i128,
    pub is_valid: bool,
}

pub fn has_admin(env: &Env) -> bool {
    env.storage().instance().has(&DataKey::Admin)
}

pub fn get_admin(env: &Env) -> Address {
    env.storage().instance().get(&DataKey::Admin).expect("Admin not set")
}

pub fn set_admin(env: &Env, admin: &Address) {
    env.storage().instance().set(&DataKey::Admin, admin);
}

pub fn get_token_contract(env: &Env) -> Address {
    env.storage().instance().get(&DataKey::TokenContract).expect("Token contract not set")
}

pub fn set_token_contract(env: &Env, token_address: &Address) {
    env.storage().instance().set(&DataKey::TokenContract, token_address);
}

pub fn get_ai_oracle(env: &Env) -> Address {
    env.storage().instance().get(&DataKey::AiOracle).expect("AI Oracle not set")
}

pub fn set_ai_oracle(env: &Env, oracle: &Address) {
    env.storage().instance().set(&DataKey::AiOracle, oracle);
}

pub fn get_course(env: &Env, course_id: u32) -> Option<Course> {
    env.storage().persistent().get(&DataKey::Course(course_id))
}

pub fn set_course(env: &Env, course: &Course) {
    env.storage().persistent().set(&DataKey::Course(course.id), course);
}

pub fn get_course_count(env: &Env) -> u32 {
    env.storage().instance().get(&DataKey::CourseCount).unwrap_or(0)
}

pub fn set_course_count(env: &Env, count: u32) {
    env.storage().instance().set(&DataKey::CourseCount, &count);
}

pub fn get_learner_profile(env: &Env, learner: &Address) -> Option<LearnerProfile> {
    env.storage().persistent().get(&DataKey::LearnerProfile(learner.clone()))
}

pub fn set_learner_profile(env: &Env, learner: &Address, profile: &LearnerProfile) {
    env.storage().persistent().set(&DataKey::LearnerProfile(learner.clone()), profile);
}

pub fn get_completion(
    env: &Env,
    learner: &Address,
    course_id: u32,
    module_id: u32,
) -> Option<ModuleCompletion> {
    let key = CompletionKey {
        learner: learner.clone(),
        course_id,
        module_id,
    };
    env.storage().persistent().get(&DataKey::ModuleCompletion(key))
}

pub fn set_completion(
    env: &Env,
    learner: &Address,
    course_id: u32,
    module_id: u32,
    completion: &ModuleCompletion,
) {
    let key = CompletionKey {
        learner: learner.clone(),
        course_id,
        module_id,
    };
    env.storage().persistent().set(&DataKey::ModuleCompletion(key), completion);
}

pub fn get_credential(env: &Env, credential_id: &BytesN<32>) -> Option<CredentialProof> {
    env.storage().persistent().get(&DataKey::Credential(credential_id.clone()))
}

pub fn set_credential(env: &Env, credential_id: &BytesN<32>, cred: &CredentialProof) {
    env.storage().persistent().set(&DataKey::Credential(credential_id.clone()), cred);
}
