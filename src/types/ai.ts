export type DiagnosticLevel = 1 | 2 | 3; // 1: Beginner, 2: Intermediate, 3: Advanced

export interface DiagnosticResult {
  level: DiagnosticLevel;
  levelName: string;
  recommendedTrack: string;
  strengths: string[];
  growthAreas: string[];
  confidenceScore: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  conceptTag: string;
}

export interface TelemetryEvent {
  eventType: "tab_blur" | "copy_paste" | "rapid_click" | "long_idle" | "time_drift";
  timestamp: number;
  details?: string;
}

export interface FraudAnalysisResult {
  fraudScore: number; // 0 to 100
  isApproved: boolean;
  flags: string[];
  timeSpentSec: number;
  paceConfidence: number; // 0.0 to 1.0
  telemetrySummary: {
    tabSwitches: number;
    clipboardEvents: number;
    averageSecondsPerQuestion: number;
  };
  proofHash: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai" | "system";
  text: string;
  timestamp: number;
  suggestedActions?: string[];
}
