"use client";

import { useWalletStore } from "@/state/useWalletStore";
import { useCourseStore } from "@/state/useCourseStore";
import { useEventStore } from "@/state/useEventStore";
import { useTransaction } from "./useTransaction";
import { CompleteModuleParams, sorobanContractService, StakeParams } from "@/services/stellar/contractClient";

export function useContract() {
  const { address, network, balanceSKK, stakedSKK, balanceXLM, setBalances } = useWalletStore();
  const { markModuleCompleted } = useCourseStore();
  const { addEvent } = useEventStore();
  const { executeWithTracking } = useTransaction();

  const submitModuleCompletion = async (params: Omit<CompleteModuleParams, "learnerAddress" | "network">) => {
    if (!address) throw new Error("Wallet not connected");

    const result = await executeWithTracking(
      `Complete Module #${params.moduleId}`,
      `Verifying anti-cheat proof and minting reward on Stellar ledger`,
      async () => {
        const res = await sorobanContractService.completeModule({
          ...params,
          learnerAddress: address,
          network,
        });

        // Update local balances & course completion
        const earned = res.data?.rewardEarned || 45;
        setBalances(balanceSKK + earned, stakedSKK, balanceXLM);
        markModuleCompleted(params.courseId, params.moduleId, params.scorePct, earned);

        // Emit local live event
        addEvent({
          type: "reward_minted",
          title: "Module Reward Minted",
          summary: `Minted ${earned} SKK for completing Module #${params.moduleId} (Score: ${params.scorePct}%)`,
          ledgerSequence: res.ledgerSequence,
          txHash: res.txHash,
          account: address,
          amountSKK: earned,
          courseId: params.courseId,
          moduleId: params.moduleId,
          score: params.scorePct,
        });

        return res;
      }
    );

    return result;
  };

  const stake = async (amountSKK: number, lockLedgers: number) => {
    if (!address) throw new Error("Wallet not connected");
    if (balanceSKK < amountSKK) throw new Error("Insufficient SKK balance for staking");

    return await executeWithTracking(
      `Stake ${amountSKK} SKK`,
      `Locking ${amountSKK} SKK tokens for ${lockLedgers} ledgers to unlock advanced tracks`,
      async () => {
        const res = await sorobanContractService.stakeTokens({
          accountAddress: address,
          amountSKK,
          lockLedgers,
          network,
        });

        setBalances(balanceSKK - amountSKK, stakedSKK + amountSKK, balanceXLM);

        addEvent({
          type: "tokens_staked",
          title: "Tokens Staked",
          summary: `Staked ${amountSKK} SKK for advanced course tracks`,
          ledgerSequence: res.ledgerSequence,
          txHash: res.txHash,
          account: address,
          amountSKK,
        });

        return res;
      }
    );
  };

  const unstake = async (amountSKK: number) => {
    if (!address) throw new Error("Wallet not connected");
    if (stakedSKK < amountSKK) throw new Error("Insufficient staked balance");

    return await executeWithTracking(
      `Unstake ${amountSKK} SKK`,
      `Releasing ${amountSKK} SKK tokens back to available balance`,
      async () => {
        const res = await sorobanContractService.unstakeTokens(address, amountSKK, network);

        setBalances(balanceSKK + amountSKK, stakedSKK - amountSKK, balanceXLM);

        addEvent({
          type: "tokens_unstaked",
          title: "Tokens Unstaked",
          summary: `Unstaked ${amountSKK} SKK to wallet balance`,
          ledgerSequence: res.ledgerSequence,
          txHash: res.txHash,
          account: address,
          amountSKK,
        });

        return res;
      }
    );
  };

  return {
    submitModuleCompletion,
    stake,
    unstake,
  };
}
