"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCourseStore } from "@/state/useCourseStore";
import { useWallet } from "@/hooks/useWallet";
import { DiagnosticModal } from "@/components/ai/DiagnosticModal";
import {
  Brain,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Lock,
  ArrowRight,
  Coins,
  Shield,
  Layers,
  Award,
  Zap,
} from "lucide-react";

export default function DashboardPage() {
  const { courses, activeCourseId, diagnosticResult, pathState } = useCourseStore();
  const { balanceSKK, stakedSKK } = useWallet();
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);

  const activeCourse = courses.find((c) => c.id === activeCourseId) || courses[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Header Banner: Diagnostic Level & Rewards Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Diagnostic Path Status Card */}
        <div className="lg:col-span-2 p-6 glass-panel-glow rounded-3xl border border-orange-500/30 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-semibold border border-orange-500/30">
                <Brain className="w-3.5 h-3.5" />
                <span>AI Personalized Track Active</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {diagnosticResult ? diagnosticResult.levelName : "Standard Path"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                {diagnosticResult?.recommendedTrack || "Personalized module pacing according to your diagnostic skill assessment."}
              </p>
            </div>

            <button
              onClick={() => setIsDiagnosticOpen(true)}
              className="px-3 py-1.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white rounded-xl transition-colors shrink-0"
            >
              Retake Diagnostic
            </button>
          </div>

          {/* Strengths & Growth Areas */}
          {diagnosticResult && (
            <div className="mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block mb-1">Demonstrated Strengths:</span>
                <div className="flex flex-wrap gap-1.5">
                  {diagnosticResult.strengths.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 rounded">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block mb-1">Target Growth Focus:</span>
                <div className="flex flex-wrap gap-1.5">
                  {diagnosticResult.growthAreas.map((g, i) => (
                    <span key={i} className="px-2 py-0.5 bg-amber-950/60 text-amber-300 border border-amber-500/30 rounded">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Token Balance & Staking Summary */}
        <div className="p-6 glass-panel rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold uppercase tracking-wider">Your Earning Stats</span>
              <Coins className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-3xl font-black font-mono text-white">
              {balanceSKK} <span className="text-sm font-sans text-orange-400">SKK</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Staked: <span className="font-mono text-cyan-400 font-bold">{stakedSKK} SKK</span> (Unlocks Advanced Tracks)
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <Link
              href="/analytics"
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>View Earning Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Active Course Module Path */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-orange-400" />
              <span>{activeCourse.title}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{activeCourse.description}</p>
          </div>
          <div className="text-xs font-mono text-slate-400">
            {activeCourse.modules.filter((m) => m.isCompleted).length} / {activeCourse.totalModules} Completed
          </div>
        </div>

        {/* Modules List */}
        <div className="space-y-3">
          {activeCourse.modules.map((module) => {
            const isCompleted = module.isCompleted;

            return (
              <div
                key={module.id}
                className={`p-5 glass-panel rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isCompleted
                    ? "border-emerald-500/30 bg-slate-900/40"
                    : "border-slate-800 hover:border-orange-500/40"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isCompleted
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : "bg-slate-800 text-slate-300 border border-slate-700"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <span className="font-mono font-bold text-sm">{module.id}</span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-base font-bold text-white">{module.title}</h4>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {module.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 max-w-2xl">{module.description}</p>

                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {module.topics.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-mono px-2 py-0.5 bg-slate-900 text-slate-400 rounded border border-slate-800"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-orange-400">
                      +{module.baseRewardSKK} SKK
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {isCompleted ? `Score: ${module.completedScore}%` : `~${module.durationMinutes} mins`}
                    </div>
                  </div>

                  <Link
                    href={`/learn/${activeCourse.id}/${module.id}`}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isCompleted
                        ? "bg-slate-800 hover:bg-slate-700 text-slate-200"
                        : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md shadow-orange-500/20"
                    }`}
                  >
                    <span>{isCompleted ? "Review" : "Start Module"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <DiagnosticModal
        isOpen={isDiagnosticOpen}
        onClose={() => setIsDiagnosticOpen(false)}
      />
    </div>
  );
}
