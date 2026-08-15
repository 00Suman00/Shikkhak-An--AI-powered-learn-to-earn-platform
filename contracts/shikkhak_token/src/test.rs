#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::{Address as _, Ledger}, Address, Env, String};

#[test]
fn test_initialize_and_metadata() {
    let env = Env::default();
    let contract_id = env.register_contract(None, ShikkhakToken);
    let client = ShikkhakTokenClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let minter = Address::generate(&env);

    client.initialize(
        &admin,
        &minter,
        &String::from_str(&env, "Shikkhak Token"),
        &String::from_str(&env, "SKK"),
        &7,
    );

    assert_eq!(client.name(), String::from_str(&env, "Shikkhak Token"));
    assert_eq!(client.symbol(), String::from_str(&env, "SKK"));
    assert_eq!(client.decimals(), 7);
    assert_eq!(client.admin(), admin);
    assert_eq!(client.minter(), minter);
    assert_eq!(client.total_supply(), 0);
}

#[test]
fn test_mint_reward_by_minter() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, ShikkhakToken);
    let client = ShikkhakTokenClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let minter = Address::generate(&env);
    let learner = Address::generate(&env);

    client.initialize(
        &admin,
        &minter,
        &String::from_str(&env, "Shikkhak Token"),
        &String::from_str(&env, "SKK"),
        &7,
    );

    // Minter awards reward tokens
    client.mint_reward(&minter, &learner, &500_000_000);

    assert_eq!(client.balance(&learner), 500_000_000);
    assert_eq!(client.total_supply(), 500_000_000);
}

#[test]
fn test_transfer_and_burn() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, ShikkhakToken);
    let client = ShikkhakTokenClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let minter = Address::generate(&env);
    let user_a = Address::generate(&env);
    let user_b = Address::generate(&env);

    client.initialize(
        &admin,
        &minter,
        &String::from_str(&env, "Shikkhak Token"),
        &String::from_str(&env, "SKK"),
        &7,
    );

    client.mint_reward(&admin, &user_a, &1_000_000_000);
    assert_eq!(client.balance(&user_a), 1_000_000_000);

    client.transfer(&user_a, &user_b, &400_000_000);
    assert_eq!(client.balance(&user_a), 600_000_000);
    assert_eq!(client.balance(&user_b), 400_000_000);

    client.burn(&user_b, &100_000_000);
    assert_eq!(client.balance(&user_b), 300_000_000);
    assert_eq!(client.total_supply(), 900_000_000);
}

#[test]
fn test_stake_and_unstake_with_timelock() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, ShikkhakToken);
    let client = ShikkhakTokenClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let minter = Address::generate(&env);
    let user = Address::generate(&env);

    client.initialize(
        &admin,
        &minter,
        &String::from_str(&env, "Shikkhak Token"),
        &String::from_str(&env, "SKK"),
        &7,
    );

    client.mint_reward(&admin, &user, &1000);

    // Stake 500 tokens for 100 ledgers
    client.stake(&user, &500, &100);
    assert_eq!(client.balance(&user), 500);
    assert_eq!(client.total_staked(), 500);

    let (staked_amt, _, lock_period) = client.get_stake(&user);
    assert_eq!(staked_amt, 500);
    assert_eq!(lock_period, 100);

    // Advance ledger beyond 100
    env.ledger().set_sequence_number(200);

    // Unstake
    client.unstake(&user, &500);
    assert_eq!(client.balance(&user), 1000);
    assert_eq!(client.total_staked(), 0);
}
