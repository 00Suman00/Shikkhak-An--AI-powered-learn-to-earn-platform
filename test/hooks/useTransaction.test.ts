import { describe, it, expect, beforeEach } from "vitest";
import { useTransactionStore } from "@/state/useTransactionStore";

describe("Transaction Lifecycle Store & Tracking", () => {
  beforeEach(() => {
    useTransactionStore.setState({ transactions: [], activeTxId: null });
  });

  it("should record a new transaction with pending state", () => {
    const store = useTransactionStore.getState();
    const id = store.addTransaction({
      title: "Mint 50 SKK Reward",
      description: "Inter-contract reward minting on Stellar",
      status: "signing",
    });

    expect(id).toBeDefined();
    const active = useTransactionStore.getState().transactions.find((t) => t.id === id);
    expect(active?.status).toBe("signing");
  });

  it("should update status to confirmed with txHash and explorer url", () => {
    const store = useTransactionStore.getState();
    const id = store.addTransaction({
      title: "Stake 100 SKK",
      description: "Locking tokens for course access",
      status: "submitting",
    });

    store.updateStatus(id, "confirmed", {
      txHash: "0xabcdef123456",
      explorerUrl: "https://stellar.expert/explorer/testnet/tx/0xabcdef123456",
    });

    const tx = useTransactionStore.getState().transactions.find((t) => t.id === id);
    expect(tx?.status).toBe("confirmed");
    expect(tx?.txHash).toBe("0xabcdef123456");
    expect(tx?.explorerUrl).toContain("stellar.expert");
  });
});
