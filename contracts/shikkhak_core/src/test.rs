#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, BytesN, Env, String};

#[test]
fn test_core_initialization_and_course_registration() {
    let env = Env::default();
    env.mock_all_auths();

    let core_id = env.register_contract(None, ShikkhakCore);
    let client = ShikkhakCoreClient::new(&env, &core_id);

    let admin = Address::generate(&env);
    let token_address = Address::generate(&env);
    let ai_oracle = Address::generate(&env);

    client.initialize(&admin, &token_address, &ai_oracle);

    client.register_course(
        &1,
        &String::from_str(&env, "Stellar Blockchain & Soroban Mastery"),
        &5,
        &50_000_000,
    );

    let course = client.get_course_details(&1);
    assert_eq!(course.id, 1);
    assert_eq!(course.total_modules, 5);
    assert_eq!(course.base_reward_per_module, 50_000_000);
    assert!(course.is_active);
}

#[test]
fn test_diagnostic_level_recording() {
    let env = Env::default();
    env.mock_all_auths();

    let core_id = env.register_contract(None, ShikkhakCore);
    let client = ShikkhakCoreClient::new(&env, &core_id);

    let admin = Address::generate(&env);
    let token_address = Address::generate(&env);
    let ai_oracle = Address::generate(&env);
    let learner = Address::generate(&env);

    client.initialize(&admin, &token_address, &ai_oracle);

    // Initial diagnostic sets level to 2 (Intermediate)
    client.record_diagnostic(&learner, &2);

    let profile = client.get_profile(&learner);
    assert_eq!(profile.diagnostic_level, 2);
    assert_eq!(profile.trust_score, 100);
    assert_eq!(profile.total_completed_modules, 0);
}

#[test]
fn test_credential_issuance_and_verification() {
    let env = Env::default();
    env.mock_all_auths();

    let core_id = env.register_contract(None, ShikkhakCore);
    let client = ShikkhakCoreClient::new(&env, &core_id);

    let admin = Address::generate(&env);
    let token_address = Address::generate(&env);
    let ai_oracle = Address::generate(&env);
    let learner = Address::generate(&env);

    client.initialize(&admin, &token_address, &ai_oracle);

    let cred_id = BytesN::from_array(&env, &[7u8; 32]);
    client.issue_credential(&learner, &1, &cred_id, &95, &250_000_000);

    let verified = client.verify_credential(&cred_id);
    assert_eq!(verified.learner, learner);
    assert_eq!(verified.course_id, 1);
    assert_eq!(verified.average_score, 95);
    assert!(verified.is_valid);
}
