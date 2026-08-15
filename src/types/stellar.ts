export type NetworkType = "testnet" | "mainnet" | "local";

export interface NetworkConfig {
  network: NetworkType;
  networkPassphrase: string;
  horizonUrl: string;
  rpcUrl: string;
  coreContractId: string;
  tokenContractId: string;
}

export type WalletType = "freighter" | "albedo" | "xbull" | "demo_keypair";

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  walletType: WalletType | null;
  balanceSKK: number;
  stakedSKK: number;
  balanceXLM: number;
  network: NetworkType;
  isConnecting: boolean;
  error: string | null;
}

export type TransactionStatus = "idle" | "signing" | "submitting" | "confirmed" | "failed";

export interface TransactionRecord {
  id: string;
  title: string;
  description: string;
  status: TransactionStatus;
  txHash?: string;
  submittedAt: number;
  completedAt?: number;
  error?: string;
  explorerUrl?: string;
  retryAction?: () => Promise<void>;
}
