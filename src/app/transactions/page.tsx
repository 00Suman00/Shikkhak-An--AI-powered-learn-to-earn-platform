"use client";

import React from "react";
import { useTransactionStore } from "@/state/useTransactionStore";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Loader2,
  ExternalLink,
  RefreshCw,
  Trash2,
  Clock,
} from "lucide-react";

export default function TransactionsCenterPage() {
  const { transactions, clearCompleted } = useTransactionStore();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Confirmed</span>
          </span>
        );
      case "submitting":
      case "signing":
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/30">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Processing</span>
          </span>
        );
      case "failed":
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/30">
            <XCircle className="w-3.5 h-3.5" />
            <span>Failed</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Idle</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-mono font-bold text-orange-400 uppercase">
              Stellar Lifecycle Monitor
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Transaction Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor transaction submissions, confirmations, ledger hashes, and explorer links.
          </p>
        </div>

        <button
          onClick={clearCompleted}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear Confirmed</span>
        </button>
      </div>

      {/* Transactions Table / List */}
      <div className="space-y-4">
        {transactions.length === 0 ? (
          <div className="p-12 glass-panel rounded-3xl border border-slate-800 text-center text-slate-400 text-sm">
            No active or recent transactions recorded in this session.
          </div>
        ) : (
          transactions.map((tx) => (
            <div
              key={tx.id}
              className="p-6 glass-panel rounded-2xl border border-slate-800/80 hover:border-orange-500/30 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-bold text-white">{tx.title}</h3>
                    {getStatusBadge(tx.status)}
                  </div>
                  <p className="text-xs text-slate-400">{tx.description}</p>
                </div>

                <div className="text-xs font-mono text-slate-400 sm:text-right">
                  {new Date(tx.submittedAt).toLocaleTimeString()}
                </div>
              </div>

              {/* Transaction Hash & Explorer Link */}
              {tx.txHash && (
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                  <div className="text-slate-400 truncate max-w-xl">
                    <span className="text-slate-500">Hash: </span>
                    <span className="text-slate-200">{tx.txHash}</span>
                  </div>

                  {tx.explorerUrl && (
                    <a
                      href={tx.explorerUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-orange-400 hover:text-orange-300 font-sans font-semibold shrink-0"
                    >
                      <span>View on Stellar Expert</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}

              {/* Error & Retry */}
              {tx.error && (
                <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl flex items-center justify-between gap-3 text-xs text-red-300">
                  <span>{tx.error}</span>
                  {tx.retryAction && (
                    <button
                      onClick={() => tx.retryAction && tx.retryAction()}
                      className="flex items-center gap-1.5 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-200 font-semibold rounded-lg shrink-0 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retry</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
