"use client";

import React, { useState } from "react";
import { useCourseStore } from "@/state/useCourseStore";
import { aiPersonalizationService } from "@/services/ai/personalization";
import { Sparkles, Brain, CheckCircle2, ArrowRight, X } from "lucide-react";

interface DiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DIAGNOSTIC_QUESTIONS = [
  {
    question: "What is your experience with Rust and WebAssembly (WASM)?",
    options: [
      "I am completely new to Rust syntax and memory ownership models",
      "I have written basic Rust code (structs, enums, match expressions)",
      "I have built production Rust microservices or compiled WASM applications",
    ],
  },
  {
    question: "How familiar are you with the Stellar Network & Soroban contracts?",
    options: [
      "I know what blockchain is, but haven't developed on Stellar or Soroban",
      "I understand Stellar accounts, Horizon, and basic smart contract calls",
      "I have written custom Soroban contracts with custom storage and multi-auth",
    ],
  },
  {
    question: "How do you prefer to handle smart contract storage costs and state rent?",
    options: [
      "What is state rent? I want the platform to explain it from scratch",
      "I know contracts pay for storage, but need practice with TTL extensions",
      "I actively optimize Persistent vs Temporary storage to minimize fee burns",
    ],
  },
];

export function DiagnosticModal({ isOpen, onClose }: DiagnosticModalProps) {
  const { setDiagnosticResult } = useCourseStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  if (!isOpen) return null;

  const handleSelectOption = (optionIndex: number) => {
    const nextAnswers = [...answers, optionIndex];
    setAnswers(nextAnswers);

    if (currentStep < DIAGNOSTIC_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate diagnostic level
      setIsCalculating(true);
      setTimeout(() => {
        const totalScore = nextAnswers.reduce((acc, curr) => acc + curr * 45, 10);
        const result = aiPersonalizationService.evaluateDiagnostic({
          scorePct: Math.min(100, totalScore),
          timeSpentSec: 25,
          rawAnswers: nextAnswers,
        });
        setDiagnosticResult(result);
        setIsCalculating(false);
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg p-6 glass-panel rounded-2xl border border-slate-700 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-2 text-xs font-semibold text-orange-400 bg-orange-950/60 rounded-full border border-orange-500/30">
            <Brain className="w-3.5 h-3.5" />
            <span>AI Diagnostic Profiler</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Personalize Your Learning Path</h2>
          <p className="text-sm text-slate-400 mt-1">
            Answer 3 quick questions. Our AI will curate your optimal module sequence and reward multipliers.
          </p>
        </div>

        {isCalculating ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin" />
              <Sparkles className="w-6 h-6 text-orange-400 absolute inset-0 m-auto" />
            </div>
            <div className="font-semibold text-white">AI Personalization Engine Running...</div>
            <p className="text-xs text-slate-400 max-w-xs">
              Synthesizing baseline knowledge, calculating skill vectors, and configuring smart contract reward bonuses.
            </p>
          </div>
        ) : (
          <div>
            {/* Progress indicator */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-4">
              <span>Question {currentStep + 1} of {DIAGNOSTIC_QUESTIONS.length}</span>
              <span>{Math.round(((currentStep + 1) / DIAGNOSTIC_QUESTIONS.length) * 100)}% Complete</span>
            </div>

            <div className="w-full h-1.5 bg-slate-800 rounded-full mb-6 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-300"
                style={{ width: `${((currentStep + 1) / DIAGNOSTIC_QUESTIONS.length) * 100}%` }}
              />
            </div>

            <h3 className="text-base font-semibold text-slate-100 mb-4">
              {DIAGNOSTIC_QUESTIONS[currentStep].question}
            </h3>

            <div className="space-y-3">
              {DIAGNOSTIC_QUESTIONS[currentStep].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className="w-full flex items-start gap-3 p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/80 hover:border-orange-500/50 rounded-xl transition-all text-left group"
                >
                  <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:border-orange-500 group-hover:bg-orange-500/10">
                    <span className="text-xs font-mono text-slate-400 group-hover:text-orange-400">
                      {String.fromCharCode(65 + idx)}
                    </span>
                  </div>
                  <span className="text-sm text-slate-300 group-hover:text-white leading-relaxed">
                    {opt}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
