"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { sorobanContractService } from "@/services/stellar/contractClient";
import { CredentialData } from "@/types/credential";
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Share2,
  Download,
  ArrowLeft,
  Sparkles,
  Lock,
} from "lucide-react";

export default function CredentialVerificationPage() {
  const params = useParams();
  const credentialId = (params?.id as string) || "0x89f41a0b36c2e718d94a10f92b7c41e8392a01f56e9c4b7a1d3e8f0a2c5b7e91";

  const [credential, setCredential] = useState<CredentialData | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    sorobanContractService.verifyCredentialOnChain(credentialId).then((data) => {
      setCredential(data);
    });
  }, [credentialId]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (!credential) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
        <div className="text-white font-semibold">Verifying On-Chain Credential with Soroban RPC...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </Link>

      {/* Verification Status Banner */}
      <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 rounded-xl">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>Cryptographically Verified On-Chain</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xs text-emerald-300/80">
              Verified by Soroban smart contract `ShikkhakCore` on Stellar Testnet.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-700 hover:border-slate-600 rounded-xl text-xs font-semibold text-slate-200 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{isCopied ? "Link Copied!" : "Share Verification"}</span>
          </button>
        </div>
      </div>

      {/* Verifiable Certificate Canvas */}
      <div className="p-8 sm:p-12 glass-panel-glow rounded-3xl border border-orange-500/30 space-y-8 relative overflow-hidden">
        {/* Certificate Watermark & Border */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
              <Award className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider">
                Provable Proof of Learning
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Certificate of Technical Mastery
              </h2>
            </div>
          </div>

          <div className="text-left sm:text-right font-mono text-xs text-slate-400">
            <div>Ledger #{credential.issuedAtLedger}</div>
            <div>{new Date(credential.issuedTimestamp).toLocaleDateString()}</div>
          </div>
        </div>

        {/* Recipient Details */}
        <div className="space-y-4 text-center sm:text-left">
          <div className="text-xs text-slate-400">This certifies that</div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {credential.recipientAddress}
          </div>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            has successfully completed the comprehensive curriculum and proven genuine competence in{" "}
            <span className="font-bold text-orange-400">{credential.courseTitle}</span> with an average assessment score of{" "}
            <span className="font-bold text-emerald-400">{credential.averageScorePct}%</span> under real-time AI anti-cheat telemetry monitoring.
          </p>
        </div>

        {/* Verified Competencies */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Skills & Competencies Verified:
          </div>
          <div className="flex flex-wrap gap-2">
            {credential.skillsVerified.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-slate-900 text-slate-200 border border-slate-700/80 rounded-lg text-xs font-medium"
              >
                &bull; {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Cryptographic Signature Block */}
        <div className="pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 block">Credential Proof Hash (SHA-256):</span>
            <span className="text-orange-400 break-all text-[11px]">{credential.signatureProof}</span>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-slate-500 block">Total Rewards Minted:</span>
              <span className="text-emerald-400 font-bold text-sm">+{credential.totalTokensEarned} SKK</span>
            </div>
            <a
              href={credential.stellarExplorerUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-orange-400 hover:text-orange-300 font-sans font-semibold text-xs"
            >
              <span>Verify on Explorer</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
