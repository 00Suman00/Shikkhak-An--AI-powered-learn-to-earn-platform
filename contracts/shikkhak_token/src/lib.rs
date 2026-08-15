#![no_std]

mod storage;

#[cfg(test)]
mod test;

use soroban_sdk::{
    contract, contracterror, contractimpl, panic_with_error, symbol_short, Address, BytesN, Env,
    String, Symbol,
};
use storage::*;

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    AlreadyInitialized = 1,
    NotInitialized = 2,
    NotAuthorized = 3,
    InsufficientBalance = 4,
    InsufficientAllowance = 5,
    NegativeAmount = 6,
    StakeLockActive = 7,
    NoActiveStake = 8,
}

#[contract]
pub struct ShikkhakToken;

#[contractimpl]
impl ShikkhakToken {
    /// Initialize the reward token with name, symbol, decimals, admin, and initial minter (e.g. ShikkhakCore)
    pub fn initialize(
        env: Env,
        admin: Address,
        minter: Address,
        name: String,
        symbol: String,
        decimals: u32,
    ) {
        if has_admin(&env) {
            panic_with_error!(&env, Error::AlreadyInitialized);
        }
        admin.require_auth();

        set_admin(&env, &admin);
        set_minter(&env, &minter);
        env.storage().instance().set(&DataKey::Name, &name);
        env.storage().instance().set(&DataKey::Symbol, &symbol);
        env.storage().instance().set(&DataKey::Decimals, &decimals);
        set_total_supply(&env, 0);
        set_total_staked(&env, 0);

        env.events().publish(
            (symbol_short!("init"), admin),
            (name, symbol, decimals),
        );
    }

    /// Admin can update the authorized minter contract address (e.g. ShikkhakCore)
    pub fn set_minter(env: Env, new_minter: Address) {
        let admin = get_admin(&env);
        admin.require_auth();
        storage::set_minter(&env, &new_minter);

        env.events().publish(
            (symbol_short!("set_mint"), admin),
            new_minter,
        );
    }

    /// Mint reward tokens to a learner. Can ONLY be invoked by the authorized Minter (e.g. ShikkhakCore contract) or Admin.
    pub fn mint_reward(env: Env, caller: Address, to: Address, amount: i128) {
        if amount <= 0 {
            panic_with_error!(&env, Error::NegativeAmount);
        }
        caller.require_auth();

        let minter = get_minter(&env);
        let admin = get_admin(&env);

        if caller != minter && caller != admin {
            panic_with_error!(&env, Error::NotAuthorized);
        }

        let balance = get_balance(&env, &to);
        let new_balance = balance.checked_add(amount).expect("Balance overflow");
        set_balance(&env, &to, new_balance);

        let total_supply = get_total_supply(&env);
        set_total_supply(&env, total_supply.checked_add(amount).expect("Supply overflow"));

        env.events().publish(
            (symbol_short!("mint"), to.clone()),
            (caller, amount),
        );
    }

    /// Standard transfer of tokens between accounts
    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
        if amount <= 0 {
            panic_with_error!(&env, Error::NegativeAmount);
        }
        from.require_auth();

        let from_balance = get_balance(&env, &from);
        if from_balance < amount {
            panic_with_error!(&env, Error::InsufficientBalance);
        }

        let to_balance = get_balance(&env, &to);
        set_balance(&env, &from, from_balance - amount);
        set_balance(&env, &to, to_balance.checked_add(amount).expect("Balance overflow"));

        env.events().publish(
            (symbol_short!("transfer"), from),
            (to, amount),
        );
    }

    /// Stake tokens to unlock advanced/premium course tracks
    pub fn stake(env: Env, account: Address, amount: i128, lock_period_ledgers: u32) {
        if amount <= 0 {
            panic_with_error!(&env, Error::NegativeAmount);
        }
        account.require_auth();

        let balance = get_balance(&env, &account);
        if balance < amount {
            panic_with_error!(&env, Error::InsufficientBalance);
        }

        let current_ledger = env.ledger().sequence();
        let existing_stake = get_stake_info(&env, &account);

        let new_staked_amount = match existing_stake {
            Some(prev) => prev.amount.checked_add(amount).expect("Stake overflow"),
            None => amount,
        };

        set_balance(&env, &account, balance - amount);
        set_stake_info(
            &env,
            &account,
            &StakeInfo {
                amount: new_staked_amount,
                start_ledger: current_ledger,
                lock_period_ledgers,
            },
        );

        let total_staked = get_total_staked(&env);
        set_total_staked(&env, total_staked.checked_add(amount).expect("Total staked overflow"));

        env.events().publish(
            (symbol_short!("stake"), account),
            (amount, lock_period_ledgers),
        );
    }

    /// Unstake tokens after lock period has elapsed
    pub fn unstake(env: Env, account: Address, amount: i128) {
        if amount <= 0 {
            panic_with_error!(&env, Error::NegativeAmount);
        }
        account.require_auth();

        let stake_info = get_stake_info(&env, &account)
            .unwrap_or_else(|| panic_with_error!(&env, Error::NoActiveStake));

        if amount > stake_info.amount {
            panic_with_error!(&env, Error::InsufficientBalance);
        }

        let current_ledger = env.ledger().sequence();
        if current_ledger < stake_info.start_ledger + stake_info.lock_period_ledgers {
            panic_with_error!(&env, Error::StakeLockActive);
        }

        let remaining_stake = stake_info.amount - amount;
        if remaining_stake == 0 {
            remove_stake_info(&env, &account);
        } else {
            set_stake_info(
                &env,
                &account,
                &StakeInfo {
                    amount: remaining_stake,
                    start_ledger: stake_info.start_ledger,
                    lock_period_ledgers: stake_info.lock_period_ledgers,
                },
            );
        }

        let balance = get_balance(&env, &account);
        set_balance(&env, &account, balance.checked_add(amount).expect("Balance overflow"));

        let total_staked = get_total_staked(&env);
        set_total_staked(&env, total_staked - amount);

        env.events().publish(
            (symbol_short!("unstake"), account),
            amount,
        );
    }

    /// Burn tokens
    pub fn burn(env: Env, from: Address, amount: i128) {
        if amount <= 0 {
            panic_with_error!(&env, Error::NegativeAmount);
        }
        from.require_auth();

        let balance = get_balance(&env, &from);
        if balance < amount {
            panic_with_error!(&env, Error::InsufficientBalance);
        }

        set_balance(&env, &from, balance - amount);
        let total_supply = get_total_supply(&env);
        set_total_supply(&env, total_supply - amount);

        env.events().publish(
            (symbol_short!("burn"), from),
            amount,
        );
    }

    /// Read-only queries
    pub fn balance(env: Env, account: Address) -> i128 {
        get_balance(&env, &account)
    }

    pub fn total_supply(env: Env) -> i128 {
        get_total_supply(&env)
    }

    pub fn total_staked(env: Env) -> i128 {
        get_total_staked(&env)
    }

    pub fn get_stake(env: Env, account: Address) -> (i128, u32, u32) {
        match get_stake_info(&env, &account) {
            Some(info) => (info.amount, info.start_ledger, info.lock_period_ledgers),
            None => (0, 0, 0),
        }
    }

    pub fn name(env: Env) -> String {
        get_name(&env)
    }

    pub fn symbol(env: Env) -> String {
        get_symbol(&env)
    }

    pub fn decimals(env: Env) -> u32 {
        get_decimals(&env)
    }

    pub fn admin(env: Env) -> Address {
        get_admin(&env)
    }

    pub fn minter(env: Env) -> Address {
        get_minter(&env)
    }

    /// Upgrade contract bytecode
    pub fn upgrade(env: Env, new_wasm_hash: BytesN<32>) {
        let admin = get_admin(&env);
        admin.require_auth();
        env.deployer().update_current_contract_wasm(new_wasm_hash);
    }
}
