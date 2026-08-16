"use client";

import { useWalletStore } from "@/state/useWalletStore";
import { stellarWalletService } from "@/services/stellar/walletKit";
import { WalletType } from "@/types/stellar";

export function useWallet() {
  const {
    isConnected,
    address,
    walletType,
    balanceSKK,
    stakedSKK,
    balanceXLM,
    network,
    isConnecting,
    error,
    setConnecting,
    setConnected,
    setDisconnected,
    setBalances,
    setNetwork,
    setError,
    connectDemoWallet,
  } = useWalletStore();

  const connect = async (selectedWalletType: WalletType) => {
    setConnecting(true);
    try {
      if (selectedWalletType === "demo_keypair") {
        connectDemoWallet();
        return;
      }

      const pubKey = await stellarWalletService.connect(selectedWalletType);
      setConnected(pubKey, selectedWalletType);

      // Fetch real account balance from Stellar Horizon network
      try {
        const balances = await stellarWalletService.fetchAccountBalance(pubKey, network);
        setBalances(balances.balanceSKK, 0, balances.balanceXLM);
      } catch {
        // Fallback default balances
        setBalances(100, 0, 100);
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect Stellar wallet");
    }
  };

  const disconnect = () => {
    setDisconnected();
  };

  return {
    isConnected,
    address,
    walletType,
    balanceSKK,
    stakedSKK,
    balanceXLM,
    network,
    isConnecting,
    error,
    connect,
    disconnect,
    setNetwork,
    setBalances,
    connectDemoWallet,
    availableWallets: stellarWalletService.getAvailableWallets(),
  };
}
