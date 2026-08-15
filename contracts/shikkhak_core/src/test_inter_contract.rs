#![cfg(test)]

use super::*;
use shikkhak_token::{ShikkhakToken, ShikkhakTokenClient};
use soroban_sdk::{testutils::Address as _, Address, BytesN, Env, String};

#[test]
fn test_cross_contract_learn_and_earn_flow() {
    let env = Env::default();
    env.mock_all_auths();

    // 1. Deploy Token Contract
    let token_id = env.register_contract(None, ShikkhakToken);
    let token_client = ShikkhakTokenClient::new(&env, &token_id);

    // 2. Deploy Core Contract
    let core_id = env.register_contract(None, ShikkhakCore);
    let core_client = ShikkhakCoreClient::new(&env, &core_id);

    let admin = Address::generate(&env);
    let ai_oracle = Address::generate(&env);
    let learner = Address::generate(&env);

    // 3. Initialize Token with Core contract registered as authorized Minter
    token_client.initialize(
        &admin,
        &core_id, // Authorized minter is Core contract!
        &String::from_str(&env, "Shikkhak Token"),
        &String::from_str(&env, "SKK"),
        &7,
    );

    // 4. Initialize Core with Token contract address
    core_client.initialize(&admin, &token_id, &ai_oracle);

    // 5. Admin registers a course: 3 modules, 100 SKK base reward (100 * 10^7)
    let base_reward: i128 = 100_0000000;
    core_client.register_course(
        &1,
        &String::from_str(&env, "Rust & Soroban Smart Contracts"),
        &3,
        &base_reward,
    );

    // 6. Learner completes diagnostic (Level 2: Intermediate)
    core_client.record_diagnostic(&learner, &2);

    // 7. Learner completes Module 1 with score 90% and low fraud score (5/100)
    let proof_hash = BytesN::from_array(&env, &[1u8; 32]);
    let reward = core_client.complete_module(
        &learner,
        &1,          // course_id
        &1,          // module_id
        &90,         // score_pct: 90%
        &5,          // fraud_score: 5 (valid)
        &proof_hash, // proof_hash
    );

    // Expected reward = (100 * 0.90) + (level 2 * 1) = 90 + 2 = 92 SKK
    let expected_reward: i128 = (base_reward * 90) / 100 + (2 * 10_000_000);
    assert_eq!(reward, expected_reward);

    // Verify token balance of learner was minted via inter-contract call
    assert_eq!(token_client.balance(&learner), expected_reward);
    assert_eq!(token_client.total_supply(), expected_reward);

    // Verify core contract recorded module completion
    assert!(core_client.is_module_completed(&learner, &1, &1));

    let profile = core_client.get_profile(&learner);
    assert_eq!(profile.total_completed_modules, 1);
    assert_eq!(profile.total_earned, expected_reward);
}

#[test]
#[should_panic(expected = "Error(Contract, #7)")]
fn test_cross_contract_fraud_blocked() {
    let env = Env::default();
    env.mock_all_auths();

    let token_id = env.register_contract(None, ShikkhakToken);
    let token_client = ShikkhakTokenClient::new(&env, &token_id);
    let core_id = env.register_contract(None, ShikkhakCore);
    let core_client = ShikkhakCoreClient::new(&env, &core_id);

    let admin = Address::generate(&env);
    let ai_oracle = Address::generate(&env);
    let learner = Address::generate(&env);

    token_client.initialize(
        &admin,
        &core_id,
        &String::from_str(&env, "Shikkhak Token"),
        &String::from_str(&env, "SKK"),
        &7,
    );
    core_client.initialize(&admin, &token_id, &ai_oracle);
    core_client.register_course(
        &1,
        &String::from_str(&env, "Rust & Soroban Smart Contracts"),
        &3,
        &100_0000000,
    );

    // Attempting module completion with high fraud score (75 > 30) -> Should fail with FraudDetected (#7)
    let proof_hash = BytesN::from_array(&env, &[2u8; 32]);
    core_client.complete_module(
        &learner,
        &1,
        &1,
        &100,
        &75, // Fraudulent score!
        &proof_hash,
    );
}
