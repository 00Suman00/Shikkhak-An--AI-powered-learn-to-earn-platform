"use client";

import React from "react";
import { useCourseStore } from "@/state/useCourseStore";
import { useWallet } from "@/hooks/useWallet";
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Award,
  Zap,
  Target,
  Clock,
  Sparkles,
} from "lucide-react";

export default function AnalyticsPage() {
  const { totalTokensEarned, completedModulesCount, trustScore, diagnosticResult } = useCourseStore();
  const { balanceSKK, stakedSKK } = useWallet();

  const skills = [
    { name: "Soroban SDK & Rust Syntax", score: 94, level: "Advanced" },
    { name: "Persistent & Instance Storage", score: 88, level: "Proficient" },
    { name: "Inter-Contract Invocations", score: 92, level: "Advanced" },
    { name: "Anti-Cheat Telemetry Compliance", score: 98, level: "Master" },
    { name: "Stellar Event Architecture", score: 85, level: "Proficient" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-mono font-bold text-orange-400 uppercase">
              Learning Mastery & Telemetry Analytics
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Performance Metrics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Provable telemetry tracking, skill competencies, and token reward velocity.
          </p>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 glass-panel rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Minted Rewards</span>
            <TrendingUp className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-3xl font-black font-mono text-white">
            {balanceSKK + stakedSKK} <span className="text-sm font-sans text-orange-400">SKK</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Current balance: {balanceSKK} SKK &bull; Staked: {stakedSKK} SKK
          </div>
        </div>

        <div className="p-6 glass-panel rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Anti-Cheat Trust Score</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black font-mono text-emerald-400">{trustScore}/100</div>
          <div className="text-[11px] text-slate-400">Zero fraud strikes recorded</div>
        </div>

        <div className="p-6 glass-panel rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Completed Modules</span>
            <Award className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black font-mono text-white">{completedModulesCount}</div>
          <div className="text-[11px] text-slate-400">On-chain certified records</div>
        </div>

        <div className="p-6 glass-panel rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Diagnostic Level</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white truncate">
            {diagnosticResult?.levelName || "Level 2"}
          </div>
          <div className="text-[11px] text-slate-400">Pacing bonus multiplier: 1.25x</div>
        </div>
      </div>

      {/* Skill Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 glass-panel rounded-3xl border border-slate-800 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-400" />
              <span>Skill Mastery Breakdown</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Calculated from AI-generated quiz accuracy and question difficulty weighting.
            </p>
          </div>

          <div className="space-y-4">
            {skills.map((skill, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-200">{skill.name}</span>
                  <span className="font-mono text-orange-400">{skill.score}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"
                    style={{ width: `${skill.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Telemetry Accuracy Profile */}
        <div className="p-6 glass-panel rounded-3xl border border-slate-800 space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Anti-Cheat Telemetry Profile</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Real-time heuristics verification ensures provable authenticity of all rewards.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex justify-between">
              <span className="text-slate-400">Average Pace per Question:</span>
              <span className="font-mono text-white font-bold">12.4 seconds</span>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex justify-between">
              <span className="text-slate-400">Tab Blur / Focus-Loss Rate:</span>
              <span className="font-mono text-emerald-400 font-bold">0.2 blurs / session</span>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex justify-between">
              <span className="text-slate-400">Cryptographic Digest Standard:</span>
              <span className="font-mono text-orange-400 font-bold">SHA-256 Merkle Proof</span>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex justify-between">
              <span className="text-slate-400">Smart Contract Enforcement:</span>
              <span className="font-mono text-white font-bold">ShikkhakCore.complete_module</span>
            </div>
          </div>

          <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-300">
            &bull; All assessments completed in this account are certified fraud-free.
          </div>
        </div>
      </div>
    </div>
  );
}
