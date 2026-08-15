use soroban_sdk::{contracttype, Address, Env, String};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Admin,
    Minter,
    Name,
    Symbol,
    Decimals,
    Balance(Address),
    Allowance(AllowanceKey),
    Stake(Address),
    TotalSupply,
    TotalStaked,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct AllowanceKey {
    pub from: Address,
    pub spender: Address,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct StakeInfo {
    pub amount: i128,
    pub start_ledger: u32,
    pub lock_period_ledgers: u32,
}

pub fn has_admin(env: &Env) -> bool {
    env.storage().instance().has(&DataKey::Admin)
}

pub fn get_admin(env: &Env) -> Address {
    env.storage()
        .instance()
        .get(&DataKey::Admin)
        .expect("Admin not set")
}

pub fn set_admin(env: &Env, admin: &Address) {
    env.storage().instance().set(&DataKey::Admin, admin);
}

pub fn get_minter(env: &Env) -> Address {
    env.storage()
        .instance()
        .get(&DataKey::Minter)
        .expect("Minter not set")
}

pub fn set_minter(env: &Env, minter: &Address) {
    env.storage().instance().set(&DataKey::Minter, minter);
}

pub fn get_balance(env: &Env, account: &Address) -> i128 {
    env.storage()
        .persistent()
        .get(&DataKey::Balance(account.clone()))
        .unwrap_or(0)
}

pub fn set_balance(env: &Env, account: &Address, amount: i128) {
    env.storage()
        .persistent()
        .set(&DataKey::Balance(account.clone()), &amount);
}

pub fn get_total_supply(env: &Env) -> i128 {
    env.storage().instance().get(&DataKey::TotalSupply).unwrap_or(0)
}

pub fn set_total_supply(env: &Env, total: i128) {
    env.storage().instance().set(&DataKey::TotalSupply, &total);
}

pub fn get_stake_info(env: &Env, account: &Address) -> Option<StakeInfo> {
    env.storage()
        .persistent()
        .get(&DataKey::Stake(account.clone()))
}

pub fn set_stake_info(env: &Env, account: &Address, stake: &StakeInfo) {
    env.storage()
        .persistent()
        .set(&DataKey::Stake(account.clone()), stake);
}

pub fn remove_stake_info(env: &Env, account: &Address) {
    env.storage()
        .persistent()
        .remove(&DataKey::Stake(account.clone()));
}

pub fn get_total_staked(env: &Env) -> i128 {
    env.storage().instance().get(&DataKey::TotalStaked).unwrap_or(0)
}

pub fn set_total_staked(env: &Env, total: i128) {
    env.storage().instance().set(&DataKey::TotalStaked, &total);
}

pub fn get_name(env: &Env) -> String {
    env.storage().instance().get(&DataKey::Name).unwrap()
}

pub fn get_symbol(env: &Env) -> String {
    env.storage().instance().get(&DataKey::Symbol).unwrap()
}

pub fn get_decimals(env: &Env) -> u32 {
    env.storage().instance().get(&DataKey::Decimals).unwrap()
}
