"use client";

import React from "react";
import { useTransactionStore } from "@/state/useTransactionStore";
import { CheckCircle2, XCircle, Loader2, ExternalLink, RefreshCw, X } from "lucide-react";

export function TxStatusModal() {
  const { transactions, activeTxId, updateStatus } = useTransactionStore();

  const activeTx = transactions.find((t) => t.id === activeTxId);
  if (!activeTx) return null;

  const handleClose = () => {
    // Dismiss
    updateStatus(activeTx.id, activeTx.status);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 w-96 max-w-[calc(100vw-2rem)] glass-panel-glow p-4 rounded-2xl border border-orange-500/30 shadow-2xl animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {activeTx.status === "submitting" || activeTx.status === "signing" ? (
            <div className="p-2 bg-orange-500/20 rounded-xl">
              <Loader2 className="w-5 h-5 text-orange-400 animate-spin" />
            </div>
          ) : activeTx.status === "confirmed" ? (
            <div className="p-2 bg-emerald-500/20 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
          ) : (
            <div className="p-2 bg-red-500/20 rounded-xl">
              <XCircle className="w-5 h-5 text-red-400" />
            </div>
          )}

          <div>
            <h4 className="text-sm font-bold text-white">{activeTx.title}</h4>
            <p className="text-xs text-slate-400 capitalize">{activeTx.status}...</p>
          </div>
        </div>

        <button onClick={handleClose} className="text-slate-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
        {activeTx.description}
      </div>

      {activeTx.txHash && (
        <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-800">
          <span className="font-mono text-[11px] text-slate-400">
            Hash: {activeTx.txHash.substring(0, 8)}...{activeTx.txHash.substring(activeTx.txHash.length - 6)}
          </span>
          {activeTx.explorerUrl && (
            <a
              href={activeTx.explorerUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-orange-400 hover:text-orange-300 font-semibold"
            >
              <span>Explorer</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      {activeTx.status === "failed" && activeTx.retryAction && (
        <button
          onClick={() => activeTx.retryAction && activeTx.retryAction()}
          className="mt-3 w-full py-1.5 flex items-center justify-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Transaction</span>
        </button>
      )}
    </div>
  );
}
