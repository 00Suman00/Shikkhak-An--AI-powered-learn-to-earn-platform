import { DiagnosticLevel, DiagnosticResult } from "@/types/ai";

export const aiPersonalizationService = {
  /**
   * Analyzes diagnostic quiz answers across fundamentals, smart contract architecture, and Stellar SDK
   * to classify learner into Beginner (1), Intermediate (2), or Advanced (3).
   */
  evaluateDiagnostic(answers: { scorePct: number; timeSpentSec: number; rawAnswers: number[] }): DiagnosticResult {
    const { scorePct } = answers;

    let level: DiagnosticLevel = 1;
    let levelName = "Foundation Scholar (Level 1)";
    let recommendedTrack = "Stellar Fundamentals & Rust Essentials";
    let strengths: string[] = [];
    let growthAreas: string[] = [];

    if (scorePct >= 80) {
      level = 3;
      levelName = "Advanced Soroban Architect (Level 3)";
      recommendedTrack = "Cross-Contract Invocations & Security Auditing";
      strengths = ["WASM Memory Layout", "Soroban Auth Framework", "Ledger TTL Management"];
      growthAreas = ["Multi-Contract Upgrade Patterns", "Formal Verification"];
    } else if (scorePct >= 50) {
      level = 2;
      levelName = "Intermediate Builder (Level 2)";
      recommendedTrack = "State Storage Models & Inter-Contract Calls";
      strengths = ["Blockchain Principles", "Rust Syntax Basics", "Stellar SDK"];
      growthAreas = ["Instance vs Persistent Storage", "Cross-Contract Auth Checks"];
    } else {
      level = 1;
      levelName = "Foundation Scholar (Level 1)";
      recommendedTrack = "Complete Comprehensive Soroban Journey";
      strengths = ["Eagerness to Learn Web3", "Curiosity in Blockchain"];
      growthAreas = ["Rust Borrow Checker", "Smart Contract Mechanics", "Ledger Keys"];
    }

    return {
      level,
      levelName,
      recommendedTrack,
      strengths,
      growthAreas,
      confidenceScore: Math.min(99, Math.floor(70 + (scorePct / 100) * 28)),
    };
  },

  /**
   * Dynamically arranges module sequence and unlocks based on level
   */
  generatePersonalizedPath(level: DiagnosticLevel): {
    sequence: number[];
    skipped: number[];
    bonusMultiplier: number;
  } {
    if (level === 3) {
      return {
        sequence: [3, 4, 5],
        skipped: [1, 2],
        bonusMultiplier: 1.5,
      };
    }
    if (level === 2) {
      return {
        sequence: [2, 3, 4, 5],
        skipped: [1],
        bonusMultiplier: 1.25,
      };
    }
    return {
      sequence: [1, 2, 3, 4, 5],
      skipped: [],
      bonusMultiplier: 1.0,
    };
  },
};
