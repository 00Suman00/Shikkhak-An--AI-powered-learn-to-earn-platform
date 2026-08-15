import { FraudAnalysisResult, TelemetryEvent } from "@/types/ai";

export interface TelemetryAnalysisInput {
  timeSpentSec: number;
  questionCount: number;
  telemetryEvents: TelemetryEvent[];
  scorePct: number;
}

export const aiFraudDetectionService = {
  /**
   * Analyzes student interaction telemetry to detect automated bots, copy-paste answers,
   * unrealistically fast guessing, and window backgrounding.
   */
  analyzeQuizSubmission(input: TelemetryAnalysisInput): FraudAnalysisResult {
    const { timeSpentSec, questionCount, telemetryEvents, scorePct } = input;
    let fraudScore = 0;
    const flags: string[] = [];

    const minExpectedTimeSec = questionCount * 4; // At least 4 seconds per question to read and evaluate
    const avgSecPerQuestion = questionCount > 0 ? timeSpentSec / questionCount : 0;

    // 1. Pace Analysis (Rapid completion detection)
    if (timeSpentSec < minExpectedTimeSec) {
      fraudScore += 45;
      flags.push(`Suspicious speed: Quiz completed in only ${timeSpentSec}s (${avgSecPerQuestion.toFixed(1)}s/question, expected >= 4s)`);
    } else if (timeSpentSec < questionCount * 7) {
      fraudScore += 15;
      flags.push("High pace detected: Faster than typical reading speed");
    }

    // 2. Tab Switches & Focus Loss
    const tabBlurs = telemetryEvents.filter((e) => e.eventType === "tab_blur").length;
    if (tabBlurs >= 3) {
      fraudScore += 25;
      flags.push(`Frequent window switching: Learner unfocused the tab ${tabBlurs} times`);
    } else if (tabBlurs >= 1) {
      fraudScore += 8;
    }

    // 3. Clipboard events (Copy / Pasting into external search or LLMs)
    const clipboardEvents = telemetryEvents.filter((e) => e.eventType === "copy_paste").length;
    if (clipboardEvents >= 2) {
      fraudScore += 30;
      flags.push(`Clipboard activity flagged: ${clipboardEvents} copy/paste events detected during quiz`);
    }

    // 4. Abnormal Perfect Score with Zero Reading Time
    if (scorePct === 100 && timeSpentSec < minExpectedTimeSec) {
      fraudScore += 35;
      flags.push("Anomaly: 100% score achieved with sub-human response latency");
    }

    // Clamp fraud score to 0..100
    const finalFraudScore = Math.min(100, Math.max(0, fraudScore));
    const isApproved = finalFraudScore <= 30; // 30 is on-chain tolerance threshold

    // Generate cryptographic telemetry proof hash (simulated SHA-256 hex digest)
    const proofRaw = `telemetry-${Date.now()}-${timeSpentSec}-${finalFraudScore}-${isApproved}`;
    let proofHash = "";
    const hexChars = "0123456789abcdef";
    for (let i = 0; i < 64; i++) {
      const charCode = (proofRaw.charCodeAt(i % proofRaw.length) + i * 17) % 16;
      proofHash += hexChars[charCode];
    }

    return {
      fraudScore: finalFraudScore,
      isApproved,
      flags,
      timeSpentSec,
      paceConfidence: Math.max(0.1, Number((1 - finalFraudScore / 100).toFixed(2))),
      telemetrySummary: {
        tabSwitches: tabBlurs,
        clipboardEvents,
        averageSecondsPerQuestion: Number(avgSecPerQuestion.toFixed(1)),
      },
      proofHash: `0x${proofHash}`,
    };
  },
};
