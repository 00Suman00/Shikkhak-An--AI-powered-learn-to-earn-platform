import { describe, it, expect } from "vitest";
import { aiFraudDetectionService } from "@/services/ai/fraudDetector";

describe("AI Anti-Cheat Fraud Detection Engine", () => {
  it("should approve a genuine learner with normal pace and zero window blurs", () => {
    const analysis = aiFraudDetectionService.analyzeQuizSubmission({
      timeSpentSec: 45,
      questionCount: 3,
      telemetryEvents: [],
      scorePct: 100,
    });

    expect(analysis.isApproved).toBe(true);
    expect(analysis.fraudScore).toBeLessThanOrEqual(30);
    expect(analysis.flags.length).toBe(0);
    expect(analysis.proofHash).toMatch(/^0x[0-9a-f]{64}$/);
  });

  it("should flag and block sub-human rapid guessing (< 4s per question)", () => {
    const analysis = aiFraudDetectionService.analyzeQuizSubmission({
      timeSpentSec: 3,
      questionCount: 3,
      telemetryEvents: [],
      scorePct: 100,
    });

    expect(analysis.isApproved).toBe(false);
    expect(analysis.fraudScore).toBeGreaterThan(30);
    expect(analysis.flags.some((f) => f.includes("Suspicious speed"))).toBe(true);
  });

  it("should penalize multiple window blur and clipboard copy events", () => {
    const analysis = aiFraudDetectionService.analyzeQuizSubmission({
      timeSpentSec: 15,
      questionCount: 3,
      telemetryEvents: [
        { eventType: "tab_blur", timestamp: 1 },
        { eventType: "tab_blur", timestamp: 2 },
        { eventType: "tab_blur", timestamp: 3 },
        { eventType: "copy_paste", timestamp: 4 },
        { eventType: "copy_paste", timestamp: 5 },
      ],
      scorePct: 100,
    });

    expect(analysis.isApproved).toBe(false);
    expect(analysis.fraudScore).toBeGreaterThan(50);
  });
});
