"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useWallet } from "@/hooks/useWallet";
import { WalletModal } from "@/components/layout/WalletModal";
import { DiagnosticModal } from "@/components/ai/DiagnosticModal";
import {
  Sparkles,
  Shield,
  Coins,
  Cpu,
  Brain,
  ArrowRight,
  CheckCircle2,
  Lock,
  Flame,
  Award,
  Zap,
  Play,
} from "lucide-react";

export default function LandingPage() {
  const { isConnected } = useWallet();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);

  return (
    <div className="relative overflow-hidden">
      {/* Dynamic Background Image of Teacher Teaching Students with Dark Gradient Overlay */}
      <div className="absolute inset-0 top-0 h-[750px] w-full overflow-hidden pointer-events-none -z-20">
        <Image
          src="/images/teacher-background.jpg"
          alt="Teacher mentoring students with AI and Stellar blockchain network"
          fill
          priority
          className="object-cover object-center opacity-25 filter contrast-125 brightness-90"
        />
        {/* Seamless Radial & Vertical Vignettes */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080c14]/60 via-[#080c14]/85 to-[#080c14]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080c14]/90 via-transparent to-[#080c14]/90" />
      </div>

      {/* Ambient Lighting Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-orange-500/20 via-amber-500/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-cyan-500/15 blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16 text-center">
        {/* Stellar Orange Belt Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border-orange-500/40 text-xs font-semibold text-orange-400 mb-8 animate-fade-in shadow-lg shadow-orange-500/10">
          <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
          <span>Stellar Soroban L3 &bull; AI Adaptive Learn-to-Earn</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
          Learn Faster. Earn Real Tokens.{" "}
          <span className="gradient-text-orange">Provably Verifiable.</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
          AI personalizes your curriculum, generates anti-memorization quizzes, and validates genuine learning with real-time fraud telemetry — while Soroban smart contracts mint on-chain rewards.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-base rounded-xl shadow-xl shadow-orange-500/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Start Learning & Earning</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <button
            onClick={() => setIsDiagnosticOpen(true)}
            className="w-full sm:w-auto px-8 py-4 glass-panel hover:bg-slate-850 text-slate-100 hover:text-white font-bold text-base rounded-xl border border-slate-700/90 hover:border-orange-500/60 transition-all flex items-center justify-center gap-2 backdrop-blur-xl"
          >
            <Brain className="w-5 h-5 text-orange-400" />
            <span>Take AI Diagnostic Assessment</span>
          </button>
        </div>

        {/* Live Protocol Metrics */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="p-4 glass-panel rounded-2xl border border-slate-800/80 backdrop-blur-xl">
            <div className="text-2xl font-mono font-bold text-white">450 SKK</div>
            <div className="text-xs text-slate-400 mt-0.5">Base Reward Pool / Course</div>
          </div>
          <div className="p-4 glass-panel rounded-2xl border border-slate-800/80 backdrop-blur-xl">
            <div className="text-2xl font-mono font-bold text-orange-400">99.4%</div>
            <div className="text-xs text-slate-400 mt-0.5">AI Anti-Cheat Accuracy</div>
          </div>
          <div className="p-4 glass-panel rounded-2xl border border-slate-800/80 backdrop-blur-xl">
            <div className="text-2xl font-mono font-bold text-cyan-400">&lt; 3.5s</div>
            <div className="text-xs text-slate-400 mt-0.5">Soroban Tx Finality</div>
          </div>
          <div className="p-4 glass-panel rounded-2xl border border-slate-800/80 backdrop-blur-xl">
            <div className="text-2xl font-mono font-bold text-purple-400">2 Contracts</div>
            <div className="text-xs text-slate-400 mt-0.5">Inter-Contract Architecture</div>
          </div>
        </div>
      </section>

      {/* Featured Classroom Showcase Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-orange-500/30 overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-semibold border border-orange-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Learn-to-Earn Classroom</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Empowered by AI Mentorship & Stellar Smart Contracts
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Shikkhak combines real-time interactive pedagogy with on-chain cryptographic proofs. As you solve challenges and master Web3 concepts with our AI tutor, smart contracts autonomously issue verifiable tokens directly into your wallet.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Real-time doubt resolution</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-orange-400 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Anti-cheat verified rewards</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Tamper-proof Stellar credentials</span>
                </div>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl group">
              <Image
                src="/images/teacher-background.jpg"
                alt="Teacher explaining Soroban and Stellar smart contracts"
                width={800}
                height={450}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <span className="text-xs font-mono text-slate-200">
                  Live Classroom: Rust, Soroban Architecture & AI Heuristics
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 3 Core Failures & Shikkhak Solution */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Why Traditional Online Learning Fails
          </h2>
          <p className="mt-3 text-slate-400 text-sm">
            Most online courses suffer from low motivation, easily forged PDF certificates, and static one-size-fits-all content.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 glass-panel rounded-2xl border border-slate-800 relative overflow-hidden group hover:border-orange-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Brain className="w-6 h-6 text-orange-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">AI-Personalized Learning Path</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No generic fixed modules. AI pinpoints your weak spots from real-time quizzes and dynamically paces modules to your skill level.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 glass-panel rounded-2xl border border-slate-800 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Anti-Cheat Fraud Telemetry</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bots and copy-paste shortcuts are blocked by continuous response-pace analysis, window focus tracking, and cryptographic proofs.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 glass-panel rounded-2xl border border-slate-800 relative overflow-hidden group hover:border-purple-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Coins className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Soroban On-Chain Rewards</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Genuine milestones trigger inter-contract calls from `ShikkhakCore` to `ShikkhakToken`, minting real tradeable and stakeable SKK tokens.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Steps Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-white tracking-tight">How It Works</h2>
          <p className="mt-3 text-slate-400 text-sm">Four seamless steps from diagnostic assessment to on-chain credentials.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { step: "01", title: "Diagnostic Assessment", desc: "Take a 3-question evaluation to establish your skill vector." },
            { step: "02", title: "Study & Practice", desc: "Learn Soroban concepts with contextual help from the AI Mentor." },
            { step: "03", title: "Dynamic Quiz", desc: "AI synthesizes unique anti-memorization questions to test mastery." },
            { step: "04", title: "Token Mint & Credential", desc: "Contracts record completion & mint SKK reward directly on Stellar." },
          ].map((item, idx) => (
            <div key={idx} className="p-5 glass-panel rounded-2xl border border-slate-800">
              <div className="text-2xl font-mono font-black text-orange-500/60 mb-2">{item.step}</div>
              <h4 className="text-base font-bold text-white mb-1">{item.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Modals */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
      <DiagnosticModal
        isOpen={isDiagnosticOpen}
        onClose={() => setIsDiagnosticOpen(false)}
      />
    </div>
  );
}
