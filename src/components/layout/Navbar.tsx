"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet } from "@/hooks/useWallet";
import { WalletModal } from "./WalletModal";
import { truncateAddress } from "@/services/stellar/client";
import {
  Sparkles,
  Wallet,
  Activity,
  Layers,
  BarChart3,
  Settings,
  ShieldCheck,
  Award,
  ChevronDown,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { isConnected, address, balanceSKK, stakedSKK, network, setNetwork, disconnect } = useWallet();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: Layers },
    { href: "/activity", label: "Live Feed", icon: Activity },
    { href: "/transactions", label: "Tx Center", icon: ShieldCheck },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/credentials/0x89f41a0b36c2e718d94a10f92b7c41e8392a01f56e9c4b7a1d3e8f0a2c5b7e91", label: "Credentials", icon: Award },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 p-0.5 shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-orange-400" />
                </div>
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white">
                  SHIKKHAK<span className="text-orange-500">.</span>
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  Soroban L3
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-orange-500/15 text-orange-400 border border-orange-500/30"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action: Network & Wallet Controls */}
          <div className="flex items-center gap-3">
            {/* Network Selector */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 capitalize">{network}</span>
            </div>

            {/* Wallet Display / Connector */}
            {isConnected && address ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 px-3.5 py-1.5 bg-slate-900/90 hover:bg-slate-850 border border-slate-700/80 hover:border-orange-500/50 rounded-xl transition-all shadow-sm"
                >
                  <div className="flex flex-col text-right">
                    <span className="text-xs font-bold text-orange-400 font-mono">
                      {balanceSKK} SKK
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {truncateAddress(address)}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 p-3 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 animate-fade-in">
                    <div className="p-2 border-b border-slate-800 mb-2">
                      <div className="text-xs text-slate-400">Connected Wallet</div>
                      <div className="font-mono text-xs text-white truncate">{address}</div>
                    </div>
                    <div className="space-y-1.5 text-xs text-slate-300">
                      <div className="flex justify-between py-1 px-2 rounded bg-slate-800/40">
                        <span>Reward Tokens:</span>
                        <span className="font-bold text-orange-400">{balanceSKK} SKK</span>
                      </div>
                      <div className="flex justify-between py-1 px-2 rounded bg-slate-800/40">
                        <span>Staked Tokens:</span>
                        <span className="font-bold text-cyan-400">{stakedSKK} SKK</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        disconnect();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full mt-3 py-1.5 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-lg transition-colors border border-red-900/40"
                    >
                      Disconnect Wallet
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsWalletModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-orange-500/25 transition-all hover:scale-105 active:scale-95"
              >
                <Wallet className="w-4 h-4" />
                <span>Connect Wallet</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
    </>
  );
}
