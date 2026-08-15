import { describe, it, expect } from "vitest";
import { aiQuizService } from "@/services/ai/quizGenerator";

describe("AI Dynamic Quiz Generator", () => {
  it("should generate dynamic questions for module with anti-memorization randomized stems", () => {
    const questions = aiQuizService.generateQuizForModule(1);

    expect(questions.length).toBeGreaterThanOrEqual(3);
    questions.forEach((q) => {
      expect(q.id).toBeDefined();
      expect(q.question).toBeDefined();
      expect(q.options.length).toBe(4);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(4);
      expect(q.explanation).toBeDefined();
    });
  });
});
