"use client";

import React, { useEffect, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { WalletType } from "@/types/stellar";
import { stellarWalletService } from "@/services/stellar/walletKit";
import { ShieldCheck, Globe, Zap, Key, X, AlertCircle, Download } from "lucide-react";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { connect, isConnecting, error, isConnected, availableWallets } = useWallet();
  const [freighterInstalled, setFreighterInstalled] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      stellarWalletService.isFreighterInstalled().then(setFreighterInstalled);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isConnected && isOpen) {
      onClose();
    }
  }, [isConnected, isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelectWallet = async (walletType: WalletType) => {
    await connect(walletType);
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

  const getBadge = (wallet: (typeof availableWallets)[0]) => {
    if (wallet.id === "freighter") {
      return freighterInstalled ? (
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Detected
        </span>
      ) : (
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
          Extension Needed
        </span>
      );
    }
    if (wallet.id === "albedo") {
      return (
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          Web Signer
        </span>
      );
    }
    if (wallet.id === "demo_keypair") {
      return (
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
          Sandbox
        </span>
      );
    }
    return (
      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
        External
      </span>
    );
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
            Stellar Multi-Wallet Connector
          </div>
          <h2 className="text-2xl font-bold text-white">Connect Your Wallet</h2>
          <p className="text-sm text-slate-400 mt-1">
            Connect your real Freighter or Web3 wallet to earn, stake, and interact on Stellar.
          </p>
        </div>

        {error && (
          <div className="p-3.5 mb-4 text-xs text-red-300 bg-red-950/60 border border-red-500/40 rounded-xl space-y-2">
            <div className="flex items-center gap-2 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>Connection Notice</span>
            </div>
            <p className="leading-relaxed">{error}</p>
            {error.toLowerCase().includes("freighter") && !freighterInstalled && (
              <a
                href="https://www.freighter.app"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 pt-1 text-orange-400 hover:text-orange-300 font-semibold underline underline-offset-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install Freighter Browser Extension &rarr;</span>
              </a>
            )}
          </div>
        )}

        <div className="space-y-3">
          {availableWallets.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => handleSelectWallet(wallet.id)}
              disabled={isConnecting}
              className="w-full flex items-center justify-between p-4 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/80 hover:border-orange-500/50 rounded-xl transition-all group text-left disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-700/60 group-hover:scale-105 transition-transform">
                  {getIcon(wallet.id)}
                </div>
                <div>
                  <div className="font-semibold text-white group-hover:text-orange-400 transition-colors flex items-center gap-2">
                    <span>{wallet.name}</span>
                  </div>
                  <div className="text-xs text-slate-400">{wallet.description}</div>
                </div>
              </div>
              <div className="shrink-0 ml-2">{getBadge(wallet)}</div>
            </button>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-500">
            Soroban Smart Contracts on Stellar Testnet &bull; Real Wallet Signing & Authorization
          </p>
        </div>
      </div>
    </div>
  );
}
