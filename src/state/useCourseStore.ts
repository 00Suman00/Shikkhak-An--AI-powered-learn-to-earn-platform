import { create } from "zustand";
import { Course, CourseModule, LearnerPathState } from "@/types/course";
import { DiagnosticResult } from "@/types/ai";

const INITIAL_COURSES: Course[] = [
  {
    id: 1,
    title: "Soroban Smart Contracts & Stellar Rust Architecture",
    slug: "soroban-stellar-rust",
    description: "Master Soroban smart contract development in Rust. Learn custom storage types, cross-contract calls, event broadcasting, and security patterns.",
    category: "rust",
    totalModules: 5,
    estimatedHours: 8,
    totalRewardSKK: 250,
    requiredStakeSKK: 0,
    icon: "code-2",
    modules: [
      {
        id: 1,
        title: "1. Introduction to Soroban Environment & CLI",
        description: "Set up the Soroban environment, understand WASM bytecodes, and run local sandbox tests.",
        contentMarkdown: `## Soroban Architecture Overview\nSoroban is Stellar's smart contracts platform designed for scalability, predictability, and safety. Unlike EVM, Soroban uses WebAssembly (WASM) and Rust.\n\n### Key Concepts:\n- **Environment (Env)**: The gateway to ledger state, host functions, cryptographic primitives, and storage.\n- **Storage Tiers**: Instance storage, Persistent storage, and Temporary storage with automatic TTL management.\n- **Authentication**: Native declarative multi-auth model without re-entrancy vulnerabilities.\n\n### Why Rust for Smart Contracts?\nRust provides zero-cost abstractions, strict memory safety without garbage collection pauses, and compact WASM outputs.`,
        durationMinutes: 15,
        baseRewardSKK: 40,
        difficulty: "beginner",
        topics: ["Soroban SDK", "WASM", "Rust Toolchain", "Stellar CLI"],
        isLocked: false,
        isCompleted: true,
        completedScore: 95,
        completedAtLedger: 104250,
      },
      {
        id: 2,
        title: "2. State Management & Storage Models",
        description: "Master Temporary, Instance, and Persistent storage, TTL extensions, and ledger serialization.",
        contentMarkdown: `## Deep Dive into Soroban Storage\nSoroban isolates contract storage into three specific domains to optimize ledger rent and execution costs:\n\n1. **Instance Storage**: Stored alongside the contract's executable code. Ideal for admin addresses, token decimals, and global configs.\n2. **Persistent Storage**: Retained across ledger bumps with rent fees. Ideal for user balances, credential proofs, and user profiles.\n3. **Temporary Storage**: Cheap, ephemeral data that expires if not renewed. Ideal for signatures, replay prevention nonces, and session tokens.`,
        durationMinutes: 20,
        baseRewardSKK: 45,
        difficulty: "intermediate",
        topics: ["Instance vs Persistent", "Data Keys", "Rent & TTL", "Serialization"],
        isLocked: false,
        isCompleted: false,
      },
      {
        id: 3,
        title: "3. Inter-Contract Invocations & Cross-Contract Calls",
        description: "Learn how to orchestrate synchronous contract-to-contract calls, propagate auth, and handle returns.",
        contentMarkdown: `## Cross-Contract Architecture\nSoroban contracts can invoke other deployed contracts synchronously using generated client bindings:\n\n\`\`\`rust\nlet token_client = ShikkhakTokenClient::new(&env, &token_address);\ntoken_client.mint_reward(&core_address, &learner, &reward_amount);\n\`\`\`\n\n### Security Considerations:\n- Ensure caller authorization is validated before triggering state modifications.\n- Prevent circular dependency deadlocks.\n- Verify gas limits for multi-contract transaction pipelines.`,
        durationMinutes: 25,
        baseRewardSKK: 55,
        difficulty: "intermediate",
        topics: ["Client Bindings", "Cross-Contract Auth", "Call Stacks", "Error Propagation"],
        isLocked: false,
        isCompleted: false,
      },
      {
        id: 4,
        title: "4. Stellar Events & Live Horizon Streaming",
        description: "Publish structured contract topics/data events and capture them in real-time on frontend clients.",
        contentMarkdown: `## Publishing Events in Soroban\nEvents notify off-chain indexers and client dashboards about state changes in real-time:\n\n\`\`\`rust\nenv.events().publish(\n    (symbol_short!("mod_done"), learner.clone()),\n    (course_id, module_id, reward, score),\n);\n\`\`\`\n\n### Event Indexing with Stellar RPC:\nClients can subscribe to topic filters via Soroban RPC \`getEvents\` endpoint to deliver real-time UI updates without polling.`,
        durationMinutes: 20,
        baseRewardSKK: 50,
        difficulty: "intermediate",
        topics: ["Topic Filters", "Symbol Short", "Soroban RPC getEvents", "Event Streams"],
        isLocked: false,
        isCompleted: false,
      },
      {
        id: 5,
        title: "5. Upgradability, Security Auditing & RBAC",
        description: "Implement safe WASM bytecode replacement, multi-sig administration, and formal verification.",
        contentMarkdown: `## Upgradable Contracts & Security Hardening\nSoroban supports atomic contract code upgrades via \`env.deployer().update_current_contract_wasm(new_wasm_hash)\`.\n\n### Defense-in-Depth:\n- Use Role-Based Access Control (RBAC) with designated admin keys.\n- Guard against integer underflow/overflow using \`checked_add\` and \`checked_sub\`.\n- Implement anti-replay nonce tracking and signature verification.`,
        durationMinutes: 30,
        baseRewardSKK: 60,
        difficulty: "advanced",
        topics: ["WASM Update", "RBAC", "Access Control", "Security Auditing"],
        isLocked: false,
        isCompleted: false,
      },
    ],
  },
  {
    id: 2,
    title: "AI Prompt Engineering & Anti-Cheat Heuristics",
    slug: "ai-prompt-heuristics",
    description: "Build intelligent educational agents, anti-cheat telemetry pipelines, and dynamic assessment generators.",
    category: "ai",
    totalModules: 3,
    estimatedHours: 5,
    totalRewardSKK: 180,
    requiredStakeSKK: 50,
    icon: "sparkles",
    modules: [
      {
        id: 1,
        title: "1. Anti-Memorization Dynamic Prompting",
        description: "Synthesize unique quiz questions with parameterized variable injections and anti-cheat distractors.",
        contentMarkdown: `## Dynamic Question Generation\nStandard quiz banks suffer from answer leakages. By leveraging LLM prompt chaining with contextual syllabus boundaries, Shikkhak dynamically crafts randomized assessment stems.`,
        durationMinutes: 15,
        baseRewardSKK: 50,
        difficulty: "beginner",
        topics: ["Prompt Chaining", "Few-Shot Synthesis", "Anti-Leak Measures"],
        isLocked: false,
        isCompleted: false,
      },
      {
        id: 2,
        title: "2. Real-Time Telemetry & Anomaly Detection",
        description: "Analyze learner response pace, clipboard events, and focus transitions to calculate fraud scores.",
        contentMarkdown: `## Client-Side Telemetry Modeling\nLearner activity is continuously scored across 4 vectors: Keystroke cadence, tab visibility changes, question completion time vs reading length, and answer variance.`,
        durationMinutes: 25,
        baseRewardSKK: 60,
        difficulty: "intermediate",
        topics: ["Telemetry Signals", "Pace Scoring", "Clipboard Tracking"],
        isLocked: false,
        isCompleted: false,
      },
      {
        id: 3,
        title: "3. Verifiable AI Attestation & Merkle Proofs",
        description: "Anchor AI fraud assessment signatures and Merkle leaf hashes directly onto the Stellar ledger.",
        contentMarkdown: `## Cryptographic Proof of Learning\nOnce the AI model validates an assessment, it produces a SHA-256 hash digest of the telemetry dataset. This digest is submitted on-chain to make fraud audits transparent.`,
        durationMinutes: 30,
        baseRewardSKK: 70,
        difficulty: "advanced",
        topics: ["Merkle Trees", "SHA-256 Digests", "On-Chain Signatures"],
        isLocked: false,
        isCompleted: false,
      },
    ],
  },
];

interface CourseStoreState {
  courses: Course[];
  activeCourseId: number;
  diagnosticResult: DiagnosticResult | null;
  pathState: LearnerPathState;
  hasTakenDiagnostic: boolean;
  totalTokensEarned: number;
  completedModulesCount: number;
  trustScore: number;
  setDiagnosticResult: (result: DiagnosticResult) => void;
  setActiveCourse: (courseId: number) => void;
  markModuleCompleted: (courseId: number, moduleId: number, score: number, reward: number) => void;
  getCourse: (id: number) => Course | undefined;
  getActiveModule: (courseId: number, moduleId: number) => CourseModule | undefined;
}

export const useCourseStore = create<CourseStoreState>((set, get) => ({
  courses: INITIAL_COURSES,
  activeCourseId: 1,
  diagnosticResult: {
    level: 2,
    levelName: "Intermediate Builder",
    recommendedTrack: "Rust Smart Contracts & Soroban Architecture",
    strengths: ["Blockchain Foundations", "Smart Contract Basics"],
    growthAreas: ["WASM Memory Layout", "Cross-Contract Invocations"],
    confidenceScore: 88,
  },
  pathState: {
    currentModuleId: 2,
    personalizedSequence: [1, 2, 3, 4, 5],
    skippedModuleIds: [],
    adaptiveBonusMultiplier: 1.25,
  },
  hasTakenDiagnostic: true,
  totalTokensEarned: 135,
  completedModulesCount: 1,
  trustScore: 98,

  setDiagnosticResult: (result) =>
    set({
      diagnosticResult: result,
      hasTakenDiagnostic: true,
      pathState: {
        currentModuleId: result.level === 3 ? 3 : result.level === 2 ? 2 : 1,
        personalizedSequence: result.level === 3 ? [3, 4, 5] : [1, 2, 3, 4, 5],
        skippedModuleIds: result.level === 3 ? [1, 2] : [],
        adaptiveBonusMultiplier: result.level === 3 ? 1.5 : result.level === 2 ? 1.2 : 1.0,
      },
    }),

  setActiveCourse: (activeCourseId) => set({ activeCourseId }),

  markModuleCompleted: (courseId, moduleId, score, reward) => {
    set((state) => {
      const updatedCourses = state.courses.map((course) => {
        if (course.id !== courseId) return course;
        const updatedModules = course.modules.map((mod) => {
          if (mod.id === moduleId) {
            return {
              ...mod,
              isCompleted: true,
              completedScore: score,
              completedAtLedger: Math.floor(104000 + Math.random() * 5000),
            };
          }
          return mod;
        });
        return { ...course, modules: updatedModules };
      });

      return {
        courses: updatedCourses,
        totalTokensEarned: state.totalTokensEarned + reward,
        completedModulesCount: state.completedModulesCount + 1,
      };
    });
  },

  getCourse: (id) => get().courses.find((c) => c.id === id),

  getActiveModule: (courseId, moduleId) => {
    const course = get().courses.find((c) => c.id === courseId);
    return course?.modules.find((m) => m.id === moduleId);
  },
}));
