import { describe, it, expect } from "vitest";
import { aiPersonalizationService } from "@/services/ai/personalization";

describe("AI Personalization Service", () => {
  it("should evaluate a high score as Advanced level (Level 3)", () => {
    const result = aiPersonalizationService.evaluateDiagnostic({
      scorePct: 90,
      timeSpentSec: 40,
      rawAnswers: [2, 2, 2],
    });

    expect(result.level).toBe(3);
    expect(result.levelName).toContain("Level 3");
    expect(result.confidenceScore).toBeGreaterThan(80);
    expect(result.strengths.length).toBeGreaterThan(0);
  });

  it("should evaluate a moderate score as Intermediate level (Level 2)", () => {
    const result = aiPersonalizationService.evaluateDiagnostic({
      scorePct: 65,
      timeSpentSec: 35,
      rawAnswers: [1, 1, 1],
    });

    expect(result.level).toBe(2);
    expect(result.levelName).toContain("Level 2");
  });

  it("should evaluate a low score as Beginner level (Level 1)", () => {
    const result = aiPersonalizationService.evaluateDiagnostic({
      scorePct: 30,
      timeSpentSec: 20,
      rawAnswers: [0, 0, 0],
    });

    expect(result.level).toBe(1);
    expect(result.levelName).toContain("Level 1");
  });

  it("should generate proper personalized module sequence and skips", () => {
    const advancedPath = aiPersonalizationService.generatePersonalizedPath(3);
    expect(advancedPath.skipped).toEqual([1, 2]);
    expect(advancedPath.bonusMultiplier).toBe(1.5);

    const beginnerPath = aiPersonalizationService.generatePersonalizedPath(1);
    expect(beginnerPath.skipped).toEqual([]);
    expect(beginnerPath.bonusMultiplier).toBe(1.0);
  });
});
