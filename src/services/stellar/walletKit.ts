import { WalletType } from "@/types/stellar";

export interface WalletAdapter {
  id: WalletType;
  name: string;
  icon: string;
  isAvailable: boolean;
  connect: () => Promise<string>;
}

export const stellarWalletService = {
  getAvailableWallets(): { id: WalletType; name: string; icon: string; description: string }[] {
    return [
      {
        id: "freighter",
        name: "Freighter Wallet",
        icon: "shield-check",
        description: "Official browser extension by Stellar Development Foundation",
      },
      {
        id: "albedo",
        name: "Albedo Web3",
        icon: "globe",
        description: "No-install browser signer for web and mobile",
      },
      {
        id: "xbull",
        name: "xBull Wallet",
        icon: "zap",
        description: "Feature-rich multi-platform Stellar and Soroban wallet",
      },
      {
        id: "demo_keypair",
        name: "Testnet Demo Keypair",
        icon: "key",
        description: "Pre-funded instant sandbox account with 450 SKK & 10,000 test XLM",
      },
    ];
  },

  async connect(walletType: WalletType): Promise<string> {
    // If browser extension like Freighter is selected
    if (walletType === "freighter") {
      if (typeof window !== "undefined" && (window as any).freighter) {
        try {
          const pubKey = await (window as any).freighter.getPublicKey();
          return pubKey;
        } catch (e: any) {
          throw new Error(`Freighter connection rejected: ${e.message || "User declined"}`);
        }
      }
      // Return a simulated active testnet key if extension is not installed
      return "GC4Z9N7Q2R5K1T8M3P6A0V4W9E2R7T5Y8U1I3O5P7A2S4D6F8G9H";
    }

    if (walletType === "albedo" || walletType === "xbull") {
      return "GB7X2K4N9P1A5E8T2U6M4Q9V1W3E7R0T5Y8U1I3O5P7A2S4D6F8G";
    }

    // Default testnet demo address
    return "GA3D5K7R6P4K3T6A7U3M8Q2V4W9E1R5T7Y0U2I4O6P8A9S1D3F5G7H";
  },
};
