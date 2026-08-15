# Build a Production-Ready Stellar Orange Belt (Level 3) Application

You are a senior Stellar ecosystem engineer, Soroban smart contract expert, DevOps engineer, and product architect.

Before writing any code, thoroughly study and follow:
https://developers.stellar.org/llms.txt

Use the official Stellar recommendations, SDKs, Soroban architecture patterns, testing methodologies, deployment workflows, security practices, and production infrastructure guidance described there.

---

## Project Idea
Build: [ Shikkhak-An  AI powered learn to earn platform]

Description: [# Shikkhak — AI-Powered Learn-to-Earn Platform



## 1. The Problem



Online learning today has three core failures:



- **Low completion rates** — most people who start an online course quit within the first few weeks because there's nothing real motivating them to finish.

- **Meaningless proof of learning** — a certificate is just a PDF. Anyone can screenshot, edit, or fake one. Employers can't easily trust it.

- **One-size-fits-all content** — everyone gets the same course in the same order, regardless of what they already know or where they're struggling, so people get bored or overwhelmed and drop off.



## 2. The Solution



Shikkhak fixes all three by combining **AI personalization**, **token-based rewards**, and **blockchain-verified proof of learning**.



In short: you learn → AI adapts the course to you and checks your understanding → you earn real, tradeable tokens for genuine progress → your achievement is permanently and verifiably recorded on-chain.



## 3. Core Features



**A. AI-personalized learning path**

The platform doesn't give everyone the same fixed course. AI looks at your quiz results and pace, figures out your weak spots, and reorders/adjusts upcoming modules to target exactly what you need — skipping what you already know, slowing down where you're struggling.



**B. AI-generated assessments**

Instead of a static, reusable question bank (which people just memorize answers to), AI generates fresh quiz questions from the course material each time. This makes cheating and answer-sharing far less effective.



**C. Token rewards for verified learning**

Completing a module or passing a quiz mints tokens for you. Reward size isn't fixed — AI weighs difficulty and how much you actually improved, so harder, more meaningful progress earns more.



**D. Fraud & cheating detection**

Before any reward is minted, AI checks for suspicious behavior — finishing a long module in seconds, copy-pasted answers, abnormal patterns — and blocks rewards for that activity. This protects the token economy from being gamed.



**E. AI mentor / doubt-solving chatbot**

A built-in assistant that understands exactly which module/topic you're on and can answer questions in context, instead of a generic chatbot with no course awareness.



**F. Blockchain-based credential record**

Every completion, quiz score, and reward is written to the blockchain. This becomes a tamper-proof "proof of learning" — far stronger than a certificate PDF, and instantly verifiable by anyone (like an employer) without contacting the platform.



**G. Token utility**

Earned tokens aren't just for show — they can be:

- Redeemed for real rewards (discounts, marketplace perks, or cash-out)

- Staked to unlock advanced/premium courses

- Used in optional leaderboards or peer challenges to add a competitive/social layer



## 4. How It Works — User Flow



1. **Sign up** and pick a course/topic.

2. **AI assesses your starting level** with a quick diagnostic quiz.

3. **Personalized path is generated** — modules ordered and paced based on your results.

4. **You study a module**, then take an **AI-generated quiz** to prove understanding.

5. **AI fraud-check runs** in the background (time spent, answer patterns, etc.).

6. **If genuine**, a **smart contract mints tokens** as your reward, and the completion + score is **recorded on-chain**.

7. **You can spend, stake, or hold tokens**, and your on-chain learning record can be shared as verifiable proof to employers, colleges, or peers.

8. **AI mentor** is available at any point if you're stuck on a concept.



## 5. System Architecture (High Level)



- **Frontend**: Learner dashboard — course view, quizzes, wallet/token balance, leaderboard, chatbot interface.

- **AI Layer**: 

  - Personalization engine (adapts course path)

  - Quiz generator (creates fresh questions from content)

  - Fraud detection model (flags suspicious activity)

  - Chatbot/mentor (context-aware Q&A)

- **Backend**: Manages courses, user progress, triggers AI calls, talks to the blockchain layer.

- **Blockchain Layer**: 

  - Smart contract for minting/burning tokens

  - On-chain record of completions and scores

  - Token staking logic for premium unlocks



## 6. Why It's Unique



Most "learn-to-earn" ideas just tie a fixed token reward to course completion — that's the basic version. Shikkhak's edge is that **AI decides what you should learn next, how you're tested, how much you deserve, and whether you actually earned it** — making the whole loop personalized and fraud-resistant instead of a static checklist. That combination (AI personalization + AI-driven anti-cheat + blockchain-verified proof) is what sets it apart from a plain token-for-completion platform.



## 7. Possible Tech Stack (suggestion)



- **Frontend**: React

- **Backend**: Node.js / Python (FastAPI)

- **AI**: Claude/GPT API for quiz generation, chatbot, and personalization logic

- **Blockchain**: Solidity smart contracts on Ethereum-compatible chain (or a testnet like Polygon Mumbai/Sepolia for a student project — cheaper and faster to demo)

- **Storage**: IPFS or a database for course content; on-chain only stores hashes/records, not full content (keeps gas costs low)



---      ]

This must feel like a real startup product, not a tutorial.

---

## Non-negotiables
- Start from a fresh git repo (no copy/paste from old projects).
- Generate production-ready code (no pseudo-code).
- Generate files one-by-one with exact file paths.
- Follow Orange Belt requirements:
  - Advanced Soroban smart contracts (custom storage, access control, ownership, RBAC, validation, state transitions, upgrade strategy)
  - Inter-contract communication (>=2 contracts with real contract-to-contract calls)
  - Real-time events (emit events + frontend subscription + activity feed + live UI updates)
  - Production transaction lifecycle UI (pending/processing/confirmed/failed + hash + explorer link + retry)
  - StellarWalletsKit integration (multi-wallet, connect/disconnect, persistence, account + network switching, human errors)
  - Frontend: Next.js 15 + TypeScript + Tailwind + shadcn/ui + React Query + Zustand
  - Feature-based architecture (service/hooks/ui/contract/state layers; no blockchain logic in components)
  - Mobile responsive
  - Security practices documented
  - Tests: 3+ contract tests, 3+ frontend tests (Vitest + RTL), and integration tests
  - CI/CD with GitHub Actions: PR checks + deploy on main merge
  - Deployment scripts: local + testnet + init + upgrade + store metadata
  - Observability: logging + error tracking abstraction + tx/event monitoring

---

## Deliverables
1) Repo structure
2) Soroban contracts (>=2) + inter-contract calls
3) Contract tests
4) Next.js frontend with required pages:
   - Landing
   - Dashboard
   - Activity Feed (real-time)
   - Transaction Center
   - Settings
   - Analytics
5) Frontend tests
6) Integration tests
7) GitHub Actions workflows
8) Deployment scripts + docs
9) .env.example
10) Production-grade README with:
   - Product overview + problem statement
   - Mermaid architecture diagram
   - Smart contract design
   - Inter-contract communication flow diagram
   - Features + tech stack
   - Local dev + env vars + testing
   - CI/CD + deployment steps
   - Security considerations
   - Screenshots section
   - Contract addresses section (must be populated after deployment)
   - Demo placeholders

---

## Required output format
Work in phases. For each phase:
- Explain what you’re about to generate.
- Then output files one-by-one with:
  - File path
  - Full file contents
- After generating files for a phase, list the exact commands to run.

Phases:
1) Plan + architecture (diagrams + folder structure)
2) Smart contracts (>=2) + tests
3) Frontend scaffold + wallet + contract interaction layer
4) Event streaming + activity feed + transaction center
5) Remaining pages (settings/analytics) + state mgmt
6) Testing suite (frontend + integration)
7) CI/CD workflows
8) Deployment scripts (local + testnet) + upgrade strategy
9) README + docs

---

## Deployment requirement (must not be skipped)
- Provide step-by-step instructions to deploy BOTH contracts to Stellar testnet.
- After deployment, update README placeholders with:
  - Actual contract addresses
  - At least one real transaction hash
  - Explorer links

If you can’t actually deploy from within your environment, generate scripts that the user can run locally to deploy, and instruct the user exactly how to paste the resulting contract addresses/tx hashes back into README.