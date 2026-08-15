"use client";

import React from "react";
import { useEventStream } from "@/hooks/useEventStream";
import { ShikkhakEventType } from "@/types/events";
import {
  Activity,
  Coins,
  Shield,
  Award,
  Zap,
  Radio,
  ExternalLink,
  Filter,
} from "lucide-react";

export default function ActivityFeedPage() {
  const { filteredEvents, isStreamingActive, toggleStreaming, selectedFilter, setFilter } =
    useEventStream();

  const filterOptions: { id: ShikkhakEventType | "all"; label: string }[] = [
    { id: "all", label: "All Events" },
    { id: "reward_minted", label: "Reward Mints" },
    { id: "module_completed", label: "Completions" },
    { id: "tokens_staked", label: "Staking" },
    { id: "credential_issued", label: "Credentials" },
  ];

  const getEventIcon = (type: ShikkhakEventType) => {
    switch (type) {
      case "reward_minted":
        return <Coins className="w-5 h-5 text-orange-400" />;
      case "module_completed":
        return <Zap className="w-5 h-5 text-yellow-400" />;
      case "tokens_staked":
        return <Shield className="w-5 h-5 text-cyan-400" />;
      case "credential_issued":
        return <Award className="w-5 h-5 text-purple-400" />;
      default:
        return <Activity className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Header with Streaming Status */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono font-bold text-orange-400 uppercase">
              Soroban RPC Event Stream
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Real-Time Protocol Activity
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Live on-chain events emitted by ShikkhakCore & ShikkhakToken contracts on Stellar.
          </p>
        </div>

        <button
          onClick={toggleStreaming}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            isStreamingActive
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
              : "bg-slate-800 text-slate-400 border border-slate-700"
          }`}
        >
          <Radio className={`w-4 h-4 ${isStreamingActive ? "animate-pulse" : ""}`} />
          <span>{isStreamingActive ? "Live Stream Active" : "Stream Paused"}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
        {filterOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setFilter(opt.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedFilter === opt.id
                ? "bg-orange-500 text-white shadow-sm shadow-orange-500/25"
                : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Event Stream List */}
      <div className="space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="p-12 glass-panel rounded-3xl border border-slate-800 text-center text-slate-400 text-sm">
            No events found for this filter. Waiting for new ledger transactions...
          </div>
        ) : (
          filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="p-5 glass-panel rounded-2xl border border-slate-800/80 hover:border-orange-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                  {getEventIcon(evt.type)}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-bold text-white">{evt.title}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      Ledger #{evt.ledgerSequence}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{evt.summary}</p>
                  <div className="mt-1 font-mono text-[11px] text-slate-500 truncate max-w-sm">
                    Account: {evt.account}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                {evt.amountSKK && (
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-orange-400">
                      +{evt.amountSKK} SKK
                    </span>
                  </div>
                )}

                <a
                  href={`https://stellar.expert/explorer/testnet/tx/${evt.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-mono transition-colors"
                >
                  <span>Tx: {evt.txHash.substring(0, 6)}...</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
