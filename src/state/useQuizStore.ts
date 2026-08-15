import { create } from "zustand";
import { ChatMessage, FraudAnalysisResult, QuizQuestion, TelemetryEvent } from "@/types/ai";

interface QuizStoreState {
  currentQuestions: QuizQuestion[];
  currentQuestionIndex: number;
  userAnswers: Record<number, number>; // questionIndex -> selectedOptionIndex
  telemetryEvents: TelemetryEvent[];
  startTime: number | null;
  isEvaluating: boolean;
  evaluationResult: FraudAnalysisResult | null;
  mentorMessages: ChatMessage[];
  isMentorTyping: boolean;

  setQuestions: (questions: QuizQuestion[]) => void;
  selectAnswer: (questionIndex: number, optionIndex: number) => void;
  recordTelemetry: (event: Omit<TelemetryEvent, "timestamp">) => void;
  startQuiz: (questions: QuizQuestion[]) => void;
  resetQuiz: () => void;
  setEvaluating: (isEvaluating: boolean) => void;
  setEvaluationResult: (result: FraudAnalysisResult | null) => void;
  addMentorMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
  setMentorTyping: (isTyping: boolean) => void;
}

export const useQuizStore = create<QuizStoreState>((set) => ({
  currentQuestions: [],
  currentQuestionIndex: 0,
  userAnswers: {},
  telemetryEvents: [],
  startTime: null,
  isEvaluating: false,
  evaluationResult: null,
  mentorMessages: [
    {
      id: "mentor-init",
      sender: "ai",
      text: "Hello! I am your Shikkhak AI Mentor. I am tracking your active lesson in real-time. Ask me anything about Soroban, storage keys, or contract auth whenever you get stuck!",
      timestamp: Date.now(),
      suggestedActions: [
        "Explain Instance vs Persistent storage",
        "How do cross-contract calls work?",
        "Why did my anti-cheat check fail?",
      ],
    },
  ],
  isMentorTyping: false,

  setQuestions: (questions) =>
    set({
      currentQuestions: questions,
      currentQuestionIndex: 0,
      userAnswers: {},
      telemetryEvents: [],
      startTime: Date.now(),
      evaluationResult: null,
    }),

  selectAnswer: (questionIndex, optionIndex) =>
    set((state) => ({
      userAnswers: { ...state.userAnswers, [questionIndex]: optionIndex },
    })),

  recordTelemetry: (event) =>
    set((state) => ({
      telemetryEvents: [
        ...state.telemetryEvents,
        { ...event, timestamp: Date.now() },
      ],
    })),

  startQuiz: (questions) =>
    set({
      currentQuestions: questions,
      currentQuestionIndex: 0,
      userAnswers: {},
      telemetryEvents: [],
      startTime: Date.now(),
      evaluationResult: null,
    }),

  resetQuiz: () =>
    set({
      currentQuestions: [],
      currentQuestionIndex: 0,
      userAnswers: {},
      telemetryEvents: [],
      startTime: null,
      isEvaluating: false,
      evaluationResult: null,
    }),

  setEvaluating: (isEvaluating) => set({ isEvaluating }),
  setEvaluationResult: (evaluationResult) => set({ evaluationResult }),

  addMentorMessage: (msg) =>
    set((state) => ({
      mentorMessages: [
        ...state.mentorMessages,
        {
          ...msg,
          id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          timestamp: Date.now(),
        },
      ],
    })),

  setMentorTyping: (isMentorTyping) => set({ isMentorTyping }),
}));
