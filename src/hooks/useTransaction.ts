"use client";

import { useTransactionStore } from "@/state/useTransactionStore";

export function useTransaction() {
  const {
    transactions,
    activeTxId,
    addTransaction,
    updateStatus,
    getRecentTransactions,
    clearCompleted,
  } = useTransactionStore();

  /**
   * Executes an asynchronous blockchain transaction with automated lifecycle state tracking
   */
  const executeWithTracking = async <T>(
    title: string,
    description: string,
    action: () => Promise<{ txHash: string; explorerUrl: string; data?: T }>
  ): Promise<T> => {
    const txId = addTransaction({
      title,
      description,
      status: "signing",
    });

    try {
      updateStatus(txId, "submitting");
      const result = await action();

      updateStatus(txId, "confirmed", {
        txHash: result.txHash,
        explorerUrl: result.explorerUrl,
      });

      return result.data as T;
    } catch (err: any) {
      updateStatus(txId, "failed", {
        error: err.message || "Transaction failed to execute on Stellar ledger",
      });
      throw err;
    }
  };

  return {
    transactions,
    activeTxId,
    executeWithTracking,
    getRecentTransactions,
    clearCompleted,
  };
}
