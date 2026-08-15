# Shikkhak Architecture & System Design Document

## 1. System Overview
**Shikkhak** is an AI-powered learn-to-earn decentralized platform deployed on the **Stellar Network** using **Soroban Smart Contracts**. It combines adaptive AI curriculum modeling, dynamic assessment generation, fraud telemetry analysis, and on-chain credentialing to make educational achievements provably verifiable and economically rewarding.

---

## 2. High-Level System Architecture

```mermaid
graph TB
    subgraph "Learner Client Tier (Next.js 15 App Router)"
        UI[Tailwind + Radix UI Client Interface]
        SWK[StellarWalletsKit Multi-Wallet Adapter]
        ZState[Zustand State Store]
        EventStreamer[Real-Time Event Streamer Hook]
    end

    subgraph "AI Intelligence Layer"
        DiagEngine[AI Diagnostic & Personalization Engine]
        QuizGen[Dynamic Anti-Memorization Quiz Generator]
        FraudEngine[Fraud & Telemetry Anti-Cheat Detector]
        MentorBot[Context-Aware Tutor & Mentor Agent]
    end

    subgraph "Verification & Blockchain Orchestration"
        ContractClient[Soroban RPC & Stellar SDK Client]
        TxCenter[Transaction Lifecycle & State Tracker]
    end

    subgraph "Soroban Smart Contracts (Stellar Network)"
        CoreContract["shikkhak_core Contract<br/>• Student Registry<br/>• Path Verification<br/>• Credential Proofs<br/>• Fraud Attestation"]
        TokenContract["shikkhak_token Contract (SKK)<br/>• SEP-41 Token Standard<br/>• Staking Locks<br/>• Dynamic Reward Minting<br/>• RBAC & Slashing"]
    end

    subgraph "Stellar Infrastructure"
        Horizon[Stellar Horizon / RPC Node]
        Ledger[(Stellar Ledger Storage)]
    end

    UI --> SWK
    UI --> ZState
    UI --> DiagEngine
    UI --> QuizGen
    UI --> MentorBot
    UI --> FraudEngine
    FraudEngine --> ContractClient
    ContractClient --> TxCenter
    TxCenter --> Horizon
    Horizon --> CoreContract
    CoreContract -.->|Inter-Contract Call: mint_reward / lock_stake| TokenContract
    CoreContract --> Ledger
    TokenContract --> Ledger
    Horizon --> EventStreamer
    EventStreamer --> UI
```

---

## 3. Soroban Smart Contract Architecture & Inter-Contract Communication

```mermaid
sequenceDiagram
    autonumber
    actor Learner as Learner (Wallet)
    participant UI as Frontend App
    participant AI as AI Fraud & Verification Engine
    participant Core as shikkhak_core Contract
    participant Token as shikkhak_token Contract
    participant Ledger as Stellar Ledger

    Learner->>UI: Completes Module Assessment
    UI->>AI: Send Answer Telemetry & Timing Metrics
    AI-->>UI: Validate genuine attempt (Fraud Score < Threshold) + Issue Signed Proof
    UI->>Core: invoke complete_module(learner, course_id, module_id, score, proof)
    Core->>Core: Verify caller auth, check anti-replay nonce & proof validity
    Core->>Core: Record on-chain completion & issue Credential Record
    Note over Core,Token: Inter-Contract Call (Cross-Contract Invocation)
    Core->>Token: invoke mint_reward(to: learner, amount: calculated_tokens)
    Token->>Token: Check caller is authorized Core Contract
    Token->>Token: Mint SKK tokens to Learner address
    Token-->>Core: Success (token_tx_hash)
    Core->>Ledger: Emit Event "module_completed" (learner, course, reward)
    Core-->>UI: Transaction Confirmed
    UI->>Learner: UI updates balance & displays Verifiable Credential
```

---

## 4. Multi-Contract Security & Access Control (RBAC)

1. **`shikkhak_token` Contract**:
   - **Role ADMIN**: Configures staking APR, authorized minters, and contract metadata.
   - **Role MINTER**: Only authorized `shikkhak_core` contracts can invoke `mint_reward`.
   - **Role USER**: Can transfer, approve allowances, stake tokens for premium course access, or unstake.
2. **`shikkhak_core` Contract**:
   - **Role ADMIN**: Adds courses, sets module token reward multipliers, and manages fraud Oracle keys.
   - **Role ORACLE/AI_ATTESTER**: Attests quiz validity and anti-cheat passing parameters.
   - **Role LEARNER**: Enrolls, records diagnostic baseline levels, and submits verified quiz proofs.
