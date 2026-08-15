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
      const pubKey = await stellarWalletService.connect(selectedWalletType);
      setConnected(pubKey, selectedWalletType);
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
