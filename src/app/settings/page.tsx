"use client";

import React, { useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useContract } from "@/hooks/useContract";
import { getNetworkConfig } from "@/services/stellar/client";
import { NetworkType } from "@/types/stellar";
import {
  Settings,
  Globe,
  Coins,
  Shield,
  Key,
  Layers,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function SettingsPage() {
  const { network, setNetwork, address, walletType, balanceSKK, stakedSKK } = useWallet();
  const { stake, unstake } = useContract();

  const [stakeAmount, setStakeAmount] = useState("50");
  const [unstakeAmount, setUnstakeAmount] = useState("25");
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const config = getNetworkConfig(network);

  const handleStake = async () => {
    const amount = Number(stakeAmount);
    if (!amount || amount <= 0) return;
    setIsProcessing(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await stake(amount, 1000);
      setSuccessMsg(`Successfully staked ${amount} SKK on ShikkhakToken contract!`);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to stake tokens.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUnstake = async () => {
    const amount = Number(unstakeAmount);
    if (!amount || amount <= 0) return;
    setIsProcessing(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await unstake(amount);
      setSuccessMsg(`Successfully unstaked ${amount} SKK to wallet balance!`);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to unstake tokens.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Settings className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-mono font-bold text-orange-400 uppercase">
              Configuration & Staking
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Settings</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your Stellar network RPC, view contract addresses, and manage token staking.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 rounded-2xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-950/50 border border-red-500/30 text-red-300 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Network Switcher */}
      <div className="p-6 glass-panel rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">Stellar Network Environment</h3>
        </div>
        <p className="text-xs text-slate-400">
          Select target network. Transactions and contract interactions will use the corresponding Soroban RPC.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {(["testnet", "mainnet", "local"] as NetworkType[]).map((net) => (
            <button
              key={net}
              onClick={() => setNetwork(net)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                network === net
                  ? "bg-orange-500/15 border-orange-500 text-white shadow-md shadow-orange-500/20"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm capitalize">{net}</span>
                {network === net && <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />}
              </div>
              <div className="text-[11px] font-mono text-slate-400 truncate">
                {net === "testnet" ? "soroban-testnet.stellar.org" : net === "mainnet" ? "mainnet.sorobanrpc.com" : "localhost:8000"}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Staking & Token Utility Management */}
      <div className="p-6 glass-panel rounded-3xl border border-slate-800 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Coins className="w-5 h-5 text-orange-400" />
            <h3 className="text-lg font-bold text-white">Token Staking Management</h3>
          </div>
          <p className="text-xs text-slate-400">
            Stake your earned SKK tokens to unlock advanced curriculum tracks and earn staking badges.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Stake Form */}
          <div className="p-5 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <ArrowUpRight className="w-4 h-4 text-orange-400" />
                <span>Stake Tokens</span>
              </span>
              <span className="text-xs font-mono text-slate-400">Available: {balanceSKK} SKK</span>
            </div>

            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-orange-500"
              placeholder="Amount to stake"
            />

            <button
              onClick={handleStake}
              disabled={isProcessing || Number(stakeAmount) > balanceSKK}
              className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors"
            >
              {isProcessing ? "Executing On-Chain..." : `Stake ${stakeAmount} SKK`}
            </button>
          </div>

          {/* Unstake Form */}
          <div className="p-5 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <ArrowDownLeft className="w-4 h-4 text-cyan-400" />
                <span>Unstake Tokens</span>
              </span>
              <span className="text-xs font-mono text-slate-400">Staked: {stakedSKK} SKK</span>
            </div>

            <input
              type="number"
              value={unstakeAmount}
              onChange={(e) => setUnstakeAmount(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
              placeholder="Amount to unstake"
            />

            <button
              onClick={handleUnstake}
              disabled={isProcessing || Number(unstakeAmount) > stakedSKK}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 hover:text-white font-bold rounded-xl text-xs transition-colors border border-slate-700"
            >
              {isProcessing ? "Executing On-Chain..." : `Unstake ${unstakeAmount} SKK`}
            </button>
          </div>
        </div>
      </div>

      {/* Deployed Contract IDs Inspector */}
      <div className="p-6 glass-panel rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-bold text-white">Deployed Smart Contract References</h3>
        </div>

        <div className="space-y-3 font-mono text-xs">
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-slate-400">shikkhak_core Contract:</span>
            <span className="text-orange-400 truncate">{config.coreContractId}</span>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-slate-400">shikkhak_token (SEP-41) Contract:</span>
            <span className="text-cyan-400 truncate">{config.tokenContractId}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
