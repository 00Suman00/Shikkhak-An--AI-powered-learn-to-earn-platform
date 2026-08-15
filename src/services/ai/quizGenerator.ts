import { QuizQuestion } from "@/types/ai";

const QUESTION_BANK: Record<number, QuizQuestion[]> = {
  1: [
    {
      id: "q-1-1",
      question: "Which WebAssembly (WASM) execution engine powers Soroban on Stellar?",
      options: [
        "Wasmer JIT engine",
        "Deterministic Rust-based Soroban Host Environment",
        "Google V8 JavaScript VM",
        "Ethereum EVM Bytecode Interpreter",
      ],
      correctIndex: 1,
      explanation: "Soroban runs within a deterministic host environment implemented in Rust, ensuring uniform gas metering and secure execution across nodes.",
      difficulty: "beginner",
      conceptTag: "Soroban Architecture",
    },
    {
      id: "q-1-2",
      question: "What is the primary role of the `Env` parameter passed to Soroban contract functions?",
      options: [
        "It stores private keys directly in contract memory",
        "It provides access to ledger state, storage, cryptographic host functions, and events",
        "It sends HTTP requests to external web APIs",
        "It generates HTML templates for frontend display",
      ],
      correctIndex: 1,
      explanation: "`Env` represents the contract execution context and provides safe access to ledger entries, storage, auth verification, and event emission.",
      difficulty: "beginner",
      conceptTag: "Soroban SDK",
    },
    {
      id: "q-1-3",
      question: "How are authentication checks natively verified in Soroban without custom signature parsing?",
      options: [
        "Calling `account.require_auth()` directly on the Address",
        "Parsing raw ECDSA signatures in contract loops",
        "Relying solely on frontend password checks",
        "Comparing strings of public keys without cryptographic verification",
      ],
      correctIndex: 0,
      explanation: "Soroban provides declarative authentication via `address.require_auth()`, allowing both standard ed25519 accounts and custom smart wallets.",
      difficulty: "beginner",
      conceptTag: "Authentication",
    },
  ],
  2: [
    {
      id: "q-2-1",
      question: "Which storage type is best suited for storing user token balances and credential proofs that must persist long-term?",
      options: [
        "Temporary Storage",
        "Instance Storage",
        "Persistent Storage",
        "Volatile Memory Cache",
      ],
      correctIndex: 2,
      explanation: "Persistent storage is designed for user balances and credentials. It allows granular state entries with individual TTL bump extensions.",
      difficulty: "intermediate",
      conceptTag: "Storage Models",
    },
    {
      id: "q-2-2",
      question: "What happens if a Temporary Storage entry's Time-To-Live (TTL) expires without being bumped?",
      options: [
        "The entire contract is permanently destroyed",
        "The temporary entry is safely evicted by the ledger, reducing ledger bloat",
        "The transaction reverts retroactively from previous blocks",
        "The contract pauses execution until admin unfreezes it",
      ],
      correctIndex: 1,
      explanation: "Temporary storage entries are pruned upon TTL expiration, making them cost-effective for nonces, flash states, and temporary session proofs.",
      difficulty: "intermediate",
      conceptTag: "State Rent & TTL",
    },
    {
      id: "q-2-3",
      question: "Where should global contract metadata, such as the Admin address and Token Decimals, usually be stored?",
      options: [
        "Instance Storage",
        "Temporary Storage",
        "Off-chain IPFS only",
        "In the transaction memo field",
      ],
      correctIndex: 0,
      explanation: "Instance storage is loaded and bundled alongside the contract executable instance, ideal for global settings and admin parameters.",
      difficulty: "intermediate",
      conceptTag: "Instance Storage",
    },
  ],
  3: [
    {
      id: "q-3-1",
      question: "How does one Soroban contract synchronously call another contract on-chain?",
      options: [
        "By issuing an HTTP REST POST request to Horizon",
        "Using generated Soroban Client bindings (e.g. `ShikkhakTokenClient::new(&env, &token_address)`)",
        "By writing to a temporary file on the node filesystem",
        "Cross-contract calls are forbidden on Soroban",
      ],
      correctIndex: 1,
      explanation: "Soroban generates strongly-typed client structs for contracts, allowing seamless, type-safe cross-contract invocations on-chain.",
      difficulty: "intermediate",
      conceptTag: "Inter-Contract Calls",
    },
    {
      id: "q-3-2",
      question: "In the Shikkhak protocol, why does `ShikkhakCore` invoke `ShikkhakToken` via inter-contract call?",
      options: [
        "To check the current weather in London",
        "To autonomously mint verified learning reward tokens to the student upon anti-cheat pass",
        "To reboot the Stellar ledger",
        "To delete the student's wallet",
      ],
      correctIndex: 1,
      explanation: "When a module is completed genuinely, `ShikkhakCore` calls `ShikkhakToken::mint_reward`, demonstrating cross-contract RBAC execution.",
      difficulty: "intermediate",
      conceptTag: "Cross-Contract Execution",
    },
  ],
};

export const aiQuizService = {
  /**
   * Generates dynamic assessment questions with anti-memorization randomized shuffling
   */
  generateQuizForModule(moduleId: number): QuizQuestion[] {
    const questions = QUESTION_BANK[moduleId] || QUESTION_BANK[1];

    // Shuffle questions and options dynamically to prevent static memorization
    return questions.map((q) => {
      const optionsWithIndices = q.options.map((opt, idx) => ({
        text: opt,
        isCorrect: idx === q.correctIndex,
      }));

      // Shuffle options randomly
      const shuffled = [...optionsWithIndices].sort(() => Math.random() - 0.5);
      const newCorrectIndex = shuffled.findIndex((item) => item.isCorrect);

      return {
        ...q,
        id: `dyn-${q.id}-${Date.now()}`,
        options: shuffled.map((s) => s.text),
        correctIndex: newCorrectIndex,
      };
    });
  },
};
