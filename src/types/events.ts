export type ShikkhakEventType =
  | "module_completed"
  | "reward_minted"
  | "tokens_staked"
  | "tokens_unstaked"
  | "tokens_transferred"
  | "credential_issued"
  | "fraud_flagged";

export interface LiveContractEvent {
  id: string;
  type: ShikkhakEventType;
  title: string;
  summary: string;
  timestamp: number;
  ledgerSequence: number;
  txHash: string;
  account: string;
  amountSKK?: number;
  courseId?: number;
  moduleId?: number;
  score?: number;
  details?: Record<string, any>;
}
