"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCourseStore } from "@/state/useCourseStore";
import { useQuizStore } from "@/state/useQuizStore";
import { useContract } from "@/hooks/useContract";
import { useTelemetryTracker } from "@/hooks/useTelemetryTracker";
import { aiQuizService } from "@/services/ai/quizGenerator";
import { aiFraudDetectionService } from "@/services/ai/fraudDetector";
import { MentorChatbot } from "@/components/ai/MentorChatbot";
import { FraudTelemetryMonitor } from "@/components/ai/FraudTelemetryMonitor";
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  Coins,
  Send,
} from "lucide-react";

export default function LearnModulePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params?.courseId) || 1;
  const moduleId = Number(params?.moduleId) || 1;

  const { courses, getActiveModule } = useCourseStore();
  const currentModule = getActiveModule(courseId, moduleId) || courses[0]?.modules[0];

  const {
    currentQuestions,
    currentQuestionIndex,
    userAnswers,
    telemetryEvents,
    startTime,
    isEvaluating,
    evaluationResult,
    startQuiz,
    selectAnswer,
    setEvaluating,
    setEvaluationResult,
    resetQuiz,
  } = useQuizStore();

  const { submitModuleCompletion } = useContract();

  const [activeTab, setActiveTab] = useState<"study" | "quiz">("study");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isSubmittingOnChain, setIsSubmittingOnChain] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize Dynamic AI Quiz
  useEffect(() => {
    const questions = aiQuizService.generateQuizForModule(moduleId);
    startQuiz(questions);

    return () => {
      resetQuiz();
    };
  }, [moduleId, startQuiz, resetQuiz]);

  // Telemetry Tracker Hook
  useTelemetryTracker(activeTab === "quiz" && !evaluationResult);

  // Elapsed timer
  useEffect(() => {
    if (activeTab !== "quiz" || evaluationResult) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeTab, evaluationResult]);

  // Submit Quiz for AI Fraud Analysis & On-Chain Verification
  const handleEvaluateAndSubmit = async () => {
    if (!currentQuestions.length) return;

    setEvaluating(true);
    setErrorMessage(null);

    // 1. Calculate Score
    let correctCount = 0;
    currentQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });
    const scorePct = Math.round((correctCount / currentQuestions.length) * 100);

    // 2. Run AI Fraud Detection Engine
    const analysis = aiFraudDetectionService.analyzeQuizSubmission({
      timeSpentSec: Math.max(1, elapsedSeconds),
      questionCount: currentQuestions.length,
      telemetryEvents,
      scorePct,
    });

    setEvaluationResult(analysis);
    setEvaluating(false);

    // 3. If genuine (Approved) and passing score (>= 60%), execute on-chain contract call
    if (analysis.isApproved && scorePct >= 60) {
      setIsSubmittingOnChain(true);
      try {
        await submitModuleCompletion({
          courseId,
          moduleId,
          scorePct,
          fraudScore: analysis.fraudScore,
          proofHash: analysis.proofHash,
        });
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to submit transaction to Stellar ledger.");
      } finally {
        setIsSubmittingOnChain(false);
      }
    }
  };

  const handleRetake = () => {
    const newQuestions = aiQuizService.generateQuizForModule(moduleId);
    startQuiz(newQuestions);
    setElapsedSeconds(0);
    setEvaluationResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Curriculum Dashboard</span>
        </Link>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>Module #{moduleId}</span> &bull; <span>Reward: +{currentModule?.baseRewardSKK || 45} SKK</span>
        </div>
      </div>

      {/* Module Title & Tab Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold font-mono text-orange-400 uppercase">Lesson Workspace</span>
            <span className="text-xs text-slate-500">&bull;</span>
            <span className="text-xs text-slate-400 capitalize">{currentModule?.difficulty} Track</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{currentModule?.title}</h1>
        </div>

        {/* Tab Toggle */}
        <div className="flex p-1 bg-slate-900/90 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab("study")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === "study"
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            1. Lesson Content
          </button>
          <button
            onClick={() => setActiveTab("quiz")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "quiz"
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>2. Dynamic AI Quiz</span>
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Lesson or Quiz */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === "study" ? (
            /* Study Material View */
            <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
              <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                {currentModule?.contentMarkdown}
              </div>

              <div className="pt-6 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setActiveTab("quiz")}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2"
                >
                  <span>Proceed to AI Assessment</span>
                  <Play className="w-4 h-4 fill-white" />
                </button>
              </div>
            </div>
          ) : (
            /* Dynamic AI Quiz Workspace */
            <div className="space-y-6">
              {!evaluationResult ? (
                <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <div className="text-xs font-mono text-orange-400">AI-Generated Assessment</div>
                      <h3 className="text-lg font-bold text-white">Prove Your Mastery</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono text-slate-400">
                        Answered {Object.keys(userAnswers).length} / {currentQuestions.length}
                      </span>
                    </div>
                  </div>

                  {/* Question items */}
                  <div className="space-y-6">
                    {currentQuestions.map((q, qIdx) => (
                      <div key={q.id} className="p-5 bg-slate-900/50 rounded-2xl border border-slate-800/80 space-y-3">
                        <div className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5 border border-slate-700">
                            {qIdx + 1}
                          </span>
                          <h4 className="text-sm font-semibold text-white leading-relaxed">{q.question}</h4>
                        </div>

                        <div className="space-y-2 pl-9">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = userAnswers[qIdx] === optIdx;
                            return (
                              <button
                                key={optIdx}
                                onClick={() => selectAnswer(qIdx, optIdx)}
                                className={`w-full text-left p-3 rounded-xl text-xs transition-all flex items-start gap-3 border ${
                                  isSelected
                                    ? "bg-orange-500/15 border-orange-500/50 text-orange-300 font-medium"
                                    : "bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white"
                                }`}
                              >
                                <span className="font-mono text-slate-500">{String.fromCharCode(65 + optIdx)}.</span>
                                <span>{opt}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-slate-800 flex justify-end">
                    <button
                      onClick={handleEvaluateAndSubmit}
                      disabled={Object.keys(userAnswers).length < currentQuestions.length || isEvaluating}
                      className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{isEvaluating ? "Analyzing Telemetry..." : "Submit & Claim Rewards"}</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Evaluation & Proof Result View */
                <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
                  <div className="text-center space-y-2">
                    {evaluationResult.isApproved ? (
                      <div className="inline-flex p-3 bg-emerald-500/20 text-emerald-400 rounded-full mb-2">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                    ) : (
                      <div className="inline-flex p-3 bg-red-500/20 text-red-400 rounded-full mb-2">
                        <ShieldAlert className="w-8 h-8" />
                      </div>
                    )}
                    <h3 className="text-2xl font-bold text-white">
                      {evaluationResult.isApproved
                        ? "Verified Genuine Progress!"
                        : "Anti-Cheat Alert: Reward Blocked"}
                    </h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      {evaluationResult.isApproved
                        ? "Your telemetry passed anti-cheat validation. Reward tokens minted on Stellar ledger."
                        : "Suspicious activity detected (rapid pace or clipboard events). Please retake genuinely."}
                    </p>
                  </div>

                  {/* Flags */}
                  {evaluationResult.flags.length > 0 && (
                    <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-2xl space-y-2">
                      <div className="text-xs font-bold text-red-400">Flagged Telemetry Anomalies:</div>
                      <ul className="text-xs text-red-300 space-y-1 list-disc pl-4">
                        {evaluationResult.flags.map((flag, idx) => (
                          <li key={idx}>{flag}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Cryptographic Proof Hash */}
                  <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1 font-mono text-xs">
                    <div className="text-slate-400 text-[11px]">On-Chain Merkle / Telemetry Digest:</div>
                    <div className="text-orange-400 break-all">{evaluationResult.proofHash}</div>
                  </div>

                  {errorMessage && (
                    <div className="p-3 bg-red-950/50 text-red-300 border border-red-500/30 rounded-xl text-xs">
                      {errorMessage}
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-4 pt-4">
                    <button
                      onClick={handleRetake}
                      className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Retake Dynamic Assessment</span>
                    </button>

                    <Link
                      href="/dashboard"
                      className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
                    >
                      <span>Return to Dashboard</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Live Anti-Cheat Monitor & Telemetry Stats */}
        <div className="space-y-6">
          <FraudTelemetryMonitor
            telemetryEvents={telemetryEvents}
            elapsedSeconds={elapsedSeconds}
            questionCount={currentQuestions.length}
            lastAnalysis={evaluationResult}
          />

          <div className="p-5 glass-panel rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Coins className="w-4 h-4 text-orange-400" />
              <span>Smart Contract Rewards</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Passing this module calls the Soroban `ShikkhakCore` contract which mints +{currentModule?.baseRewardSKK || 45} SKK tokens directly to your wallet.
            </p>
            <div className="pt-2 text-[11px] font-mono text-slate-500">
              Contract: CCCORE9...PRODCONTRACT1
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Context-Aware AI Mentor Sidekick */}
      <MentorChatbot
        currentModuleTitle={currentModule?.title || "Soroban Module"}
        moduleContent={currentModule?.contentMarkdown || ""}
      />
    </div>
  );
}
