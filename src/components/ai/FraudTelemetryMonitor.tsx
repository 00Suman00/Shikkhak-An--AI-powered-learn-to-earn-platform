"use client";

import React from "react";
import { Shield, ShieldAlert, ShieldCheck, Clock, Copy, Eye } from "lucide-react";
import { FraudAnalysisResult, TelemetryEvent } from "@/types/ai";

interface FraudTelemetryMonitorProps {
  telemetryEvents: TelemetryEvent[];
  elapsedSeconds: number;
  questionCount: number;
  lastAnalysis?: FraudAnalysisResult | null;
}

export function FraudTelemetryMonitor({
  telemetryEvents,
  elapsedSeconds,
  questionCount,
  lastAnalysis,
}: FraudTelemetryMonitorProps) {
  const tabBlurs = telemetryEvents.filter((e) => e.eventType === "tab_blur").length;
  const clipboardCopies = telemetryEvents.filter((e) => e.eventType === "copy_paste").length;
  const avgSecPerQ = questionCount > 0 ? (elapsedSeconds / questionCount).toFixed(1) : "0.0";

  // Calculate live dynamic risk
  let liveRisk = 0;
  if (tabBlurs > 0) liveRisk += tabBlurs * 12;
  if (clipboardCopies > 0) liveRisk += clipboardCopies * 20;
  if (elapsedSeconds < questionCount * 4 && questionCount > 0) liveRisk += 25;
  liveRisk = Math.min(100, liveRisk);

  return (
    <div className="p-4 glass-panel rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {liveRisk > 30 ? (
            <ShieldAlert className="w-5 h-5 text-red-400 animate-pulse" />
          ) : (
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          )}
          <div>
            <h4 className="text-sm font-bold text-white">AI Anti-Cheat Telemetry</h4>
            <p className="text-[11px] text-slate-400">Continuous biometric & pace monitoring</p>
          </div>
        </div>
        <div className="text-right">
          <span
            className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
              liveRisk > 30
                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
            }`}
          >
            {liveRisk > 30 ? "Risk Flagged" : "Genuine Learner"}
          </span>
        </div>
      </div>

      {/* Telemetry Metrics Grid */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 text-center">
          <Clock className="w-4 h-4 text-orange-400 mx-auto mb-1" />
          <div className="text-xs font-mono font-bold text-white">{avgSecPerQ}s</div>
          <div className="text-[10px] text-slate-400">Pace / Question</div>
        </div>
        <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 text-center">
          <Eye className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
          <div className="text-xs font-mono font-bold text-white">{tabBlurs}</div>
          <div className="text-[10px] text-slate-400">Tab Switches</div>
        </div>
        <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 text-center">
          <Copy className="w-4 h-4 text-purple-400 mx-auto mb-1" />
          <div className="text-xs font-mono font-bold text-white">{clipboardCopies}</div>
          <div className="text-[10px] text-slate-400">Clipboard Events</div>
        </div>
      </div>

      {/* Risk Gauge Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] font-mono text-slate-400">
          <span>Anti-Cheat Fraud Score</span>
          <span className={liveRisk > 30 ? "text-red-400 font-bold" : "text-emerald-400"}>
            {liveRisk}/100 (Max allowed: 30)
          </span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              liveRisk > 30 ? "bg-red-500" : "bg-gradient-to-r from-emerald-500 to-amber-500"
            }`}
            style={{ width: `${liveRisk}%` }}
          />
        </div>
      </div>

      {lastAnalysis?.proofHash && (
        <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800 font-mono text-[10px] text-slate-400 truncate">
          <span className="text-orange-400">Attestation Proof: </span>
          {lastAnalysis.proofHash}
        </div>
      )}
    </div>
  );
}
