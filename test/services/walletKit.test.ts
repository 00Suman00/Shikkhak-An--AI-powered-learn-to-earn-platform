import { describe, it, expect, vi, beforeEach } from "vitest";
import { stellarWalletService } from "@/services/stellar/walletKit";

vi.mock("@stellar/freighter-api", () => ({
  isConnected: vi.fn().mockResolvedValue({ isConnected: false }),
  requestAccess: vi.fn().mockResolvedValue({ error: "Not installed" }),
  getAddress: vi.fn().mockResolvedValue({ error: "Not installed" }),
}));

describe("Stellar Wallet Service (WalletKit)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("lists all available wallet providers with correct default descriptions", () => {
    const wallets = stellarWalletService.getAvailableWallets();
    expect(wallets.length).toBe(4);
    expect(wallets.map((w) => w.id)).toEqual(["freighter", "albedo", "xbull", "demo_keypair"]);
  });

  it("connects to demo keypair explicitly when selected", async () => {
    const pubKey = await stellarWalletService.connect("demo_keypair");
    expect(pubKey).toBe("GA3D5K7R6P4K3T6A7U3M8Q2V4W9E1R5T7Y0U2I4O6P8A9S1D3F5G7H");
  });

  it("throws clear error when Freighter extension is not installed in environment", async () => {
    delete (global as any).freighter;
    await expect(stellarWalletService.connect("freighter")).rejects.toThrow(
      /Freighter extension not detected/i
    );
  });

  it("connects using window.freighter when extension is injected", async () => {
    const mockPublicKey = "GCTESTFREIGHTERADDRESS123456789012345678901234567890";
    (global as any).freighter = {
      requestAccess: vi.fn().mockResolvedValue({ address: mockPublicKey }),
    };

    const pubKey = await stellarWalletService.connect("freighter");
    expect(pubKey).toBe(mockPublicKey);

    delete (global as any).freighter;
  });

  it("handles user rejection from window.freighter cleanly", async () => {
    (global as any).freighter = {
      requestAccess: vi.fn().mockRejectedValue(new Error("User declined connection")),
    };

    await expect(stellarWalletService.connect("freighter")).rejects.toThrow(
      /Freighter connection rejected/i
    );

    delete (global as any).freighter;
  });
});
