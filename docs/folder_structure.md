# Shikkhak Project Folder Structure

```
shikkhak-learn-to-earn/
├── .github/
│   └── workflows/
│       ├── ci.yml                 # CI workflow for linting, type-checking, contract & frontend tests
│       └── deploy.yml             # Automated deployment to Stellar testnet & hosting
├── contracts/                     # Soroban Smart Contracts (Rust)
│   ├── Cargo.toml                 # Cargo workspace config
│   ├── shikkhak_token/            # Reward Token & Staking Contract (SEP-41)
│   │   ├── Cargo.toml
│   │   └── src/
│   │       ├── lib.rs             # Token contract implementation & RBAC
│   │       ├── storage.rs         # Data keys and Soroban storage helpers
│   │       └── test.rs            # Unit tests for token minting, transfers, and staking
│   └── shikkhak_core/             # Core Course, Credential & Fraud Attestation Contract
│       ├── Cargo.toml
│       └── src/
│           ├── lib.rs             # Core logic & cross-contract invocation to shikkhak_token
│           ├── storage.rs         # Storage keys (courses, learner profiles, credentials)
│           ├── test.rs            # Core contract unit tests
│           └── test_inter_contract.rs # Cross-contract invocation tests
├── docs/
│   ├── architecture.md            # Architecture specs and sequence diagrams
│   └── folder_structure.md        # Detailed directory and module layout
├── scripts/
│   ├── deploy_testnet.js          # Stellar testnet deployment script (Node/Stellar SDK)
│   ├── init_contracts.js          # Initialization and cross-contract authorization script
│   └── upgrade_contract.js        # Soroban contract bytecode upgrade script
├── src/                           # Next.js 15 Frontend Application
│   ├── app/                       # App Router
│   │   ├── layout.tsx             # Root layout with providers, toast & navigation
│   │   ├── globals.css            # Global CSS variables, custom dark theme, glassmorphism
│   │   ├── page.tsx               # High-converting Landing Page
│   │   ├── dashboard/
│   │   │   └── page.tsx           # Personalized Learning Path & Diagnostic overview
│   │   ├── learn/
│   │   │   └── [courseId]/
│   │   │       └── [moduleId]/
│   │   │           └── page.tsx   # Interactive lesson, live anti-cheat & AI mentor
│   │   ├── credentials/
│   │   │   └── [id]/
│   │   │       └── page.tsx       # On-chain tamper-proof credential verification
│   │   ├── activity/
│   │   │   └── page.tsx           # Live real-time event streaming activity feed
│   │   ├── transactions/
│   │   │   └── page.tsx           # Production Transaction Center lifecycle UI
│   │   ├── analytics/
│   │   │   └── page.tsx           # Learner mastery radar & token reward metrics
│   │   ├── settings/
│   │   │   └── page.tsx           # Wallet, network selection & AI parameters
│   │   └── api/                   # Server API routes for AI & simulation
│   │       ├── ai/diagnostic/route.ts
│   │       ├── ai/quiz/route.ts
│   │       ├── ai/fraud-check/route.ts
│   │       └── ai/mentor/route.ts
│   ├── components/                # UI and Feature Components
│   │   ├── ui/                    # Reusable primitives (Buttons, Cards, Badges, Modals, Progress)
│   │   ├── layout/                # Navbar, Footer, Sidebar, WalletModal
│   │   ├── ai/                    # MentorChatbot, FraudTelemetryMonitor, DiagnosticModal
│   │   ├── course/                # CourseCard, ModuleItem, LearningPathTree
│   │   ├── web3/                  # TxStatusBadge, CredentialCertificate, WalletButton
│   │   └── telemetry/             # Real-time event toast & feed items
│   ├── features/                  # Feature domain logic
│   │   ├── auth/
│   │   ├── learning/
│   │   ├── fraud/
│   │   └── tokens/
│   ├── hooks/                     # Custom React Hooks
│   │   ├── useWallet.ts
│   │   ├── useContract.ts
│   │   ├── useTelemetryTracker.ts
│   │   ├── useEventStream.ts
│   │   └── useTransaction.ts
│   ├── services/                  # Business & Blockchain Services
│   │   ├── ai/                    # AI Personalization, Quiz Gen, Anti-Cheat, Mentor
│   │   │   ├── personalization.ts
│   │   │   ├── quizGenerator.ts
│   │   │   ├── fraudDetector.ts
│   │   │   └── mentor.ts
│   │   └── stellar/               # Soroban RPC Client, WalletKit integration
│   │       ├── client.ts
│   │       ├── contractClient.ts
│   │       ├── eventStreamer.ts
│   │       └── walletKit.ts
│   ├── state/                     # Zustand State Stores
│   │   ├── useWalletStore.ts
│   │   ├── useCourseStore.ts
│   │   ├── useTransactionStore.ts
│   │   ├── useEventStore.ts
│   │   └── useQuizStore.ts
│   └── types/                     # TypeScript definitions
│       ├── ai.ts
│       ├── course.ts
│       ├── credential.ts
│       ├── events.ts
│       └── stellar.ts
├── test/                          # Frontend & Integration Test Suites
│   ├── setup.ts
│   ├── services/
│   │   ├── aiPersonalization.test.ts
│   │   ├── fraudDetector.test.ts
│   │   └── quizGenerator.test.ts
│   ├── hooks/
│   │   └── useTransaction.test.ts
│   ├── components/
│   │   └── QuizWorkspace.test.tsx
│   └── integration/
│       └── learnToEarnFlow.test.ts
├── .env.example
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
└── README.md
```
