import { create } from "zustand";
import { NetworkType, WalletState, WalletType } from "@/types/stellar";

interface WalletStoreState extends WalletState {
  setConnecting: (isConnecting: boolean) => void;
  setConnected: (address: string, walletType: WalletType) => void;
  setDisconnected: () => void;
  setBalances: (skk: number, stakedSkk: number, xlm: number) => void;
  setNetwork: (network: NetworkType) => void;
  setError: (error: string | null) => void;
  connectDemoWallet: () => void;
}

const DEFAULT_DEMO_ADDRESS = "GA3D5K7R6P4K3T6A7U3M8Q2V4W9E1R5T7Y0U2I4O6P8A9S1D3F5G7H";

export const useWalletStore = create<WalletStoreState>((set) => ({
  isConnected: false,
  address: null,
  walletType: null,
  balanceSKK: 0,
  stakedSKK: 0,
  balanceXLM: 0,
  network: "testnet",
  isConnecting: false,
  error: null,

  setConnecting: (isConnecting) => set({ isConnecting, error: null }),
  setConnected: (address, walletType) =>
    set({
      isConnected: true,
      address,
      walletType,
      isConnecting: false,
      error: null,
    }),
  setDisconnected: () =>
    set({
      isConnected: false,
      address: null,
      walletType: null,
      balanceSKK: 0,
      stakedSKK: 0,
      balanceXLM: 0,
    }),
  setBalances: (balanceSKK, stakedSKK, balanceXLM) =>
    set({ balanceSKK, stakedSKK, balanceXLM }),
  setNetwork: (network) => set({ network }),
  setError: (error) => set({ error, isConnecting: false }),
  connectDemoWallet: () =>
    set({
      isConnected: true,
      address: DEFAULT_DEMO_ADDRESS,
      walletType: "demo_keypair",
      balanceSKK: 450,
      stakedSKK: 100,
      balanceXLM: 9942.5,
      isConnecting: false,
      error: null,
    }),
}));
