"use client";

import React from "react";
import { useWallet } from "@/hooks/useWallet";
import { WalletType } from "@/types/stellar";
import { ShieldCheck, Globe, Zap, Key, X, AlertCircle } from "lucide-react";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { connect, isConnecting, error, availableWallets } = useWallet();

  if (!isOpen) return null;

  const handleSelectWallet = async (walletType: WalletType) => {
    await connect(walletType);
    if (!error) {
      onClose();
    }
  };

  const getIcon = (id: string) => {
    switch (id) {
      case "freighter":
        return <ShieldCheck className="w-6 h-6 text-orange-400" />;
      case "albedo":
        return <Globe className="w-6 h-6 text-cyan-400" />;
      case "xbull":
        return <Zap className="w-6 h-6 text-purple-400" />;
      case "demo_keypair":
        return <Key className="w-6 h-6 text-emerald-400" />;
      default:
        return <Key className="w-6 h-6 text-orange-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md p-6 glass-panel rounded-2xl border border-slate-700 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="inline-block px-3 py-1 mb-2 text-xs font-semibold tracking-wider text-orange-400 uppercase bg-orange-950/60 rounded-full border border-orange-500/30">
            Stellar Multi-Wallet Kit
          </div>
          <h2 className="text-2xl font-bold text-white">Connect Stellar Wallet</h2>
          <p className="text-sm text-slate-400 mt-1">
            Choose your preferred Stellar signer or use the pre-funded sandbox keypair.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 text-sm text-red-300 bg-red-950/50 border border-red-500/30 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-3">
          {availableWallets.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => handleSelectWallet(wallet.id)}
              disabled={isConnecting}
              className="w-full flex items-center justify-between p-4 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/80 hover:border-orange-500/50 rounded-xl transition-all group text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-700/60 group-hover:scale-105 transition-transform">
                  {getIcon(wallet.id)}
                </div>
                <div>
                  <div className="font-semibold text-white group-hover:text-orange-400 transition-colors">
                    {wallet.name}
                  </div>
                  <div className="text-xs text-slate-400">{wallet.description}</div>
                </div>
              </div>
              <div className="text-xs font-mono text-slate-500 group-hover:text-slate-300">
                {wallet.id === "demo_keypair" ? "Instant" : "External"}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-500">
            Soroban Smart Contracts on Stellar Testnet &bull; Zero-gas testnet execution
          </p>
        </div>
      </div>
    </div>
  );
}
