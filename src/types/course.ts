export interface CourseModule {
  id: number;
  title: string;
  description: string;
  contentMarkdown: string;
  durationMinutes: number;
  baseRewardSKK: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  topics: string[];
  isLocked: boolean;
  isCompleted: boolean;
  completedScore?: number;
  completedAtLedger?: number;
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  category: "blockchain" | "rust" | "defi" | "ai";
  totalModules: number;
  estimatedHours: number;
  totalRewardSKK: number;
  requiredStakeSKK: number;
  modules: CourseModule[];
  icon: string;
}

export interface LearnerPathState {
  currentModuleId: number;
  personalizedSequence: number[];
  skippedModuleIds: number[];
  adaptiveBonusMultiplier: number;
}
