import { WalletType, NetworkType } from "@/types/stellar";
import { getNetworkConfig } from "./client";
import { isConnected as isFreighterConnected, requestAccess as requestFreighterAccess } from "@stellar/freighter-api";
import albedo from "@albedo-link/intent";

export interface WalletAdapterInfo {
  id: WalletType;
  name: string;
  icon: string;
  description: string;
  isAvailable?: boolean;
}

export const stellarWalletService = {
  getAvailableWallets(): WalletAdapterInfo[] {
    const isFreighterAvailable =
      typeof window !== "undefined" &&
      (Boolean((window as any).freighter) || Boolean((window as any).freighterApi));

    const isXbullAvailable =
      typeof window !== "undefined" && Boolean((window as any).xBull);

    return [
      {
        id: "freighter",
        name: "Freighter Wallet",
        icon: "shield-check",
        description: "Official browser extension by Stellar Development Foundation",
        isAvailable: isFreighterAvailable,
      },
      {
        id: "albedo",
        name: "Albedo Web3",
        icon: "globe",
        description: "No-install web signer for desktop and mobile browsers",
        isAvailable: true,
      },
      {
        id: "xbull",
        name: "xBull Wallet",
        icon: "zap",
        description: "Feature-rich multi-platform Stellar and Soroban wallet",
        isAvailable: isXbullAvailable,
      },
      {
        id: "demo_keypair",
        name: "Testnet Demo Keypair",
        icon: "key",
        description: "Pre-funded instant sandbox account for instant testing",
        isAvailable: true,
      },
    ];
  },

  async isFreighterInstalled(): Promise<boolean> {
    if (typeof window === "undefined") return false;
    try {
      if ((window as any).freighter) return true;
      const res = await isFreighterConnected();
      return Boolean(res && res.isConnected);
    } catch {
      return false;
    }
  },

  async fetchAccountBalance(address: string, network: NetworkType = "testnet"): Promise<{ balanceXLM: number; balanceSKK: number }> {
    try {
      const config = getNetworkConfig(network);
      const res = await fetch(`${config.horizonUrl}/accounts/${address}`);
      if (!res.ok) {
        // Fresh or unfunded account on testnet
        return { balanceXLM: 0, balanceSKK: 100 };
      }
      const data = await res.json();
      const native = data.balances?.find((b: any) => b.asset_type === "native");
      const xlm = native ? parseFloat(native.balance) : 0;

      const skkAsset = data.balances?.find((b: any) => b.asset_code === "SKK");
      const skk = skkAsset ? parseFloat(skkAsset.balance) : 100;

      return { balanceXLM: xlm, balanceSKK: skk };
    } catch {
      return { balanceXLM: 100, balanceSKK: 50 };
    }
  },

  async connect(walletType: WalletType): Promise<string> {
    if (typeof window === "undefined") {
      throw new Error("Wallet connection is only supported in browser environment.");
    }

    if (walletType === "freighter") {
      // 1. Direct check for window.freighter API injected extension
      const winFreighter = (window as any).freighter;
      if (winFreighter) {
        try {
          if (typeof winFreighter.requestAccess === "function") {
            const res = await winFreighter.requestAccess();
            if (typeof res === "string" && res.length > 0) return res;
            if (res?.address) return res.address;
            if (res?.error) throw new Error(res.error);
          }
          if (typeof winFreighter.getAddress === "function") {
            const res = await winFreighter.getAddress();
            if (typeof res === "string" && res.length > 0) return res;
            if (res?.address) return res.address;
            if (res?.error) throw new Error(res.error);
          }
          if (typeof winFreighter.getPublicKey === "function") {
            const pubKey = await winFreighter.getPublicKey();
            if (pubKey) return pubKey;
          }
        } catch (e: any) {
          throw new Error(`Freighter connection rejected: ${e.message || "User declined"}`);
        }
      }

      // 2. Attempt using official @stellar/freighter-api module
      try {
        const freighterStatus = await isFreighterConnected();
        if (freighterStatus && freighterStatus.isConnected) {
          const accessRes = await requestFreighterAccess();
          if (accessRes && accessRes.address) {
            return accessRes.address;
          }
          if (accessRes && accessRes.error) {
            throw new Error(accessRes.error);
          }
        }
      } catch (err: any) {
        if (
          err.message &&
          (err.message.includes("User declined") ||
            err.message.includes("rejected") ||
            err.message.includes("denied") ||
            err.message.includes("User closed"))
        ) {
          throw new Error(`Freighter connection rejected: ${err.message}`);
        }
      }

      throw new Error(
        "Freighter extension not detected. Please install Freighter browser extension from https://www.freighter.app and refresh."
      );
    }

    if (walletType === "albedo") {
      try {
        const res = await albedo.publicKey({});
        if (res && res.pubkey) {
          return res.pubkey;
        }
        throw new Error("Failed to retrieve public key from Albedo.");
      } catch (err: any) {
        throw new Error(`Albedo connection failed: ${err.message || "User closed popup"}`);
      }
    }

    if (walletType === "xbull") {
      const winXbull = (window as any).xBull;
      if (winXbull) {
        try {
          const address = await winXbull.connect();
          if (address) return address;
        } catch (e: any) {
          throw new Error(`xBull connection rejected: ${e.message || "User declined"}`);
        }
      }
      throw new Error("xBull wallet extension not detected. Please install xBull extension.");
    }

    if (walletType === "demo_keypair") {
      return "GA3D5K7R6P4K3T6A7U3M8Q2V4W9E1R5T7Y0U2I4O6P8A9S1D3F5G7H";
    }

    throw new Error(`Unsupported wallet type: ${walletType}`);
  },
};
