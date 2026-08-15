import { create } from "zustand";
import { TransactionRecord, TransactionStatus } from "@/types/stellar";

interface TransactionStoreState {
  transactions: TransactionRecord[];
  activeTxId: string | null;
  addTransaction: (tx: Omit<TransactionRecord, "id" | "submittedAt">) => string;
  updateStatus: (id: string, status: TransactionStatus, details?: { txHash?: string; error?: string; explorerUrl?: string }) => void;
  getRecentTransactions: (limit?: number) => TransactionRecord[];
  clearCompleted: () => void;
}

const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  {
    id: "tx-init-01",
    title: "Claim Module 1 Completion Reward",
    description: "Minted 40 SKK for completing 'Intro to Soroban Environment'",
    status: "confirmed",
    txHash: "9a2f7c41b8e4e937d55f9c6d3210459a72d3e18f28d8417c603b749651a5e128",
    submittedAt: Date.now() - 3600000 * 2,
    completedAt: Date.now() - 3600000 * 2 + 4200,
    explorerUrl: "https://stellar.expert/explorer/testnet/tx/9a2f7c41b8e4e937d55f9c6d3210459a72d3e18f28d8417c603b749651a5e128",
  },
  {
    id: "tx-init-02",
    title: "Stake 100 SKK for Advanced Track",
    description: "Locked 100 SKK for 1000 ledgers to unlock AI Prompt Heuristics",
    status: "confirmed",
    txHash: "4c3b8e72f91a5042d87e193c64a5f019b84e7239105a62f8319c745d0281be4a",
    submittedAt: Date.now() - 3600000 * 24,
    completedAt: Date.now() - 3600000 * 24 + 3800,
    explorerUrl: "https://stellar.expert/explorer/testnet/tx/4c3b8e72f91a5042d87e193c64a5f019b84e7239105a62f8319c745d0281be4a",
  },
];

export const useTransactionStore = create<TransactionStoreState>((set, get) => ({
  transactions: INITIAL_TRANSACTIONS,
  activeTxId: null,

  addTransaction: (tx) => {
    const id = `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newTx: TransactionRecord = {
      ...tx,
      id,
      submittedAt: Date.now(),
    };
    set((state) => ({
      transactions: [newTx, ...state.transactions],
      activeTxId: id,
    }));
    return id;
  },

  updateStatus: (id, status, details) => {
    set((state) => ({
      transactions: state.transactions.map((tx) => {
        if (tx.id !== id) return tx;
        return {
          ...tx,
          status,
          txHash: details?.txHash ?? tx.txHash,
          error: details?.error,
          explorerUrl: details?.explorerUrl ?? tx.explorerUrl,
          completedAt: status === "confirmed" || status === "failed" ? Date.now() : tx.completedAt,
        };
      }),
      activeTxId: status === "confirmed" || status === "failed" ? null : state.activeTxId,
    }));
  },

  getRecentTransactions: (limit = 10) => get().transactions.slice(0, limit),

  clearCompleted: () =>
    set((state) => ({
      transactions: state.transactions.filter((tx) => tx.status !== "confirmed"),
    })),
}));
