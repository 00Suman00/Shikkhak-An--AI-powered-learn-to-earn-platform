import { NetworkConfig, NetworkType } from "@/types/stellar";

export const NETWORK_CONFIGS: Record<NetworkType, NetworkConfig> = {
  testnet: {
    network: "testnet",
    networkPassphrase: "Test SDF Network ; September 2015",
    horizonUrl: "https://horizon-testnet.stellar.org",
    rpcUrl: "https://soroban-testnet.stellar.org",
    coreContractId: "CCCORE9SHIKKHAK7VXZYTESTNETLEARNTOEARNPRODCONTRACT1",
    tokenContractId: "CCTOKEN9SHIKKHAK7VXZYTESTNETLEARNTOEARNPRODCONTRACT2",
  },
  mainnet: {
    network: "mainnet",
    networkPassphrase: "Public Global Stellar Network ; September 2015",
    horizonUrl: "https://horizon.stellar.org",
    rpcUrl: "https://mainnet.sorobanrpc.com",
    coreContractId: "CCCORE9SHIKKHAK7MAINNETCONTRACTPRODVERIFIED1",
    tokenContractId: "CCTOKEN9SHIKKHAK7MAINNETCONTRACTPRODVERIFIED2",
  },
  local: {
    network: "local",
    networkPassphrase: "Standalone Network ; February 2022",
    horizonUrl: "http://localhost:8000",
    rpcUrl: "http://localhost:8000/soroban/rpc",
    coreContractId: "CCCORELOCALDEVCONTRACT1111111111111111111111111111111",
    tokenContractId: "CCTOKENLOCALDEVCONTRACT2222222222222222222222222222222",
  },
};

export function getNetworkConfig(network: NetworkType = "testnet"): NetworkConfig {
  return NETWORK_CONFIGS[network] || NETWORK_CONFIGS.testnet;
}

export function truncateAddress(address: string, chars = 4): string {
  if (!address) return "";
  if (address.length <= chars * 2 + 2) return address;
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
}

export function getExplorerTxUrl(txHash: string, network: NetworkType = "testnet"): string {
  const netParam = network === "mainnet" ? "public" : network;
  return `https://stellar.expert/explorer/${netParam}/tx/${txHash}`;
}

export function getExplorerContractUrl(contractId: string, network: NetworkType = "testnet"): string {
  const netParam = network === "mainnet" ? "public" : network;
  return `https://stellar.expert/explorer/${netParam}/contract/${contractId}`;
}
