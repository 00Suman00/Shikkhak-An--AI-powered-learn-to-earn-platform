import { describe, it, expect } from "vitest";
import { aiPersonalizationService } from "@/services/ai/personalization";
import { aiQuizService } from "@/services/ai/quizGenerator";
import { aiFraudDetectionService } from "@/services/ai/fraudDetector";
import { sorobanContractService } from "@/services/stellar/contractClient";

describe("End-to-End Learn-to-Earn Integration Flow", () => {
  it("executes complete protocol loop: diagnostic -> quiz -> fraud verification -> contract execution", async () => {
    // 1. Learner takes diagnostic assessment
    const diagnostic = aiPersonalizationService.evaluateDiagnostic({
      scorePct: 85,
      timeSpentSec: 35,
      rawAnswers: [2, 2, 2],
    });
    expect(diagnostic.level).toBe(3);

    // 2. Personalized path is generated
    const path = aiPersonalizationService.generatePersonalizedPath(diagnostic.level);
    expect(path.sequence).toContain(3);

    // 3. Dynamic anti-memorization quiz is generated for target module
    const questions = aiQuizService.generateQuizForModule(3);
    expect(questions.length).toBeGreaterThanOrEqual(2);

    // 4. Learner completes assessment and anti-cheat telemetry checks out
    const fraudAnalysis = aiFraudDetectionService.analyzeQuizSubmission({
      timeSpentSec: 40,
      questionCount: questions.length,
      telemetryEvents: [],
      scorePct: 100,
    });
    expect(fraudAnalysis.isApproved).toBe(true);
    expect(fraudAnalysis.fraudScore).toBeLessThanOrEqual(30);

    // 5. Submit module completion to Soroban smart contracts
    const contractResult = await sorobanContractService.completeModule({
      learnerAddress: "GA3D5K7R6P4K3T6A7U3M8Q2V4W9E1R5T7Y0U2I4O6P8A9S1D3F5G7H",
      courseId: 1,
      moduleId: 3,
      scorePct: 100,
      fraudScore: fraudAnalysis.fraudScore,
      proofHash: fraudAnalysis.proofHash,
      network: "testnet",
    });

    expect(contractResult.success).toBe(true);
    expect(contractResult.txHash).toBeDefined();
    expect(contractResult.data?.rewardEarned).toBeGreaterThan(0);

    // 6. Verify tamper-proof credential query
    const credential = await sorobanContractService.verifyCredentialOnChain(
      "0x89f41a0b36c2e718d94a10f92b7c41e8392a01f56e9c4b7a1d3e8f0a2c5b7e91",
      "testnet"
    );
    expect(credential.isValid).toBe(true);
    expect(credential.courseTitle).toBeDefined();
  });
});
