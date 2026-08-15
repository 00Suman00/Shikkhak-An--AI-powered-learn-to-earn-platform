import React from "react";
import Link from "next/link";
import { Sparkles, ExternalLink, Shield, Cpu, Code } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-md mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">SHIKKHAK</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-driven adaptive learning with cryptographic Stellar Soroban verification and anti-cheat token minting.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-orange-400/90 font-mono">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
              <span>Stellar Orange Belt (Level 3) Ready</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">Platform</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/dashboard" className="hover:text-orange-400 transition-colors">Curriculum & Path</Link></li>
              <li><Link href="/activity" className="hover:text-orange-400 transition-colors">Live Contract Feed</Link></li>
              <li><Link href="/transactions" className="hover:text-orange-400 transition-colors">Transaction Center</Link></li>
              <li><Link href="/analytics" className="hover:text-orange-400 transition-colors">Mastery Analytics</Link></li>
            </ul>
          </div>

          {/* Smart Contract Infrastructure */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">Soroban Protocol</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                <span>shikkhak_core Contract</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-orange-400 transition-colors">
                <Cpu className="w-3.5 h-3.5 text-orange-400" />
                <span>shikkhak_token (SEP-41)</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-purple-400 transition-colors">
                <Code className="w-3.5 h-3.5 text-purple-400" />
                <span>Inter-Contract Invocations</span>
              </li>
            </ul>
          </div>

          {/* Stellar Resources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">Stellar Ecosystem</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a
                  href="https://developers.stellar.org/docs/learn/smart-contract-internals"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  <span>Soroban Docs</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://stellar.expert/explorer/testnet"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  <span>Stellar Expert Explorer</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://developers.stellar.org/docs/tools/developer-tools/wallets-kit"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  <span>StellarWalletsKit</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>&copy; {new Date().getFullYear()} Shikkhak Protocol. Built for Stellar Orange Belt Level 3.</div>
          <div className="font-mono text-[11px] text-slate-500">Soroban SDK 21.4 &bull; Rust 2021 &bull; Next.js 15</div>
        </div>
      </div>
    </footer>
  );
}
