import { LiveContractEvent, ShikkhakEventType } from "@/types/events";

export class SorobanEventStreamer {
  private intervalId: NodeJS.Timeout | null = null;
  private onEventCallback: ((event: Omit<LiveContractEvent, "id" | "timestamp">) => void) | null = null;

  start(callback: (event: Omit<LiveContractEvent, "id" | "timestamp">) => void, intervalMs = 12000) {
    this.onEventCallback = callback;
    if (this.intervalId) clearInterval(this.intervalId);

    this.intervalId = setInterval(() => {
      this.simulateIncomingEvent();
    }, intervalMs);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private simulateIncomingEvent() {
    if (!this.onEventCallback) return;

    const mockPool: {
      type: ShikkhakEventType;
      title: string;
      summary: string;
      amount?: number;
      score?: number;
    }[] = [
      {
        type: "module_completed",
        title: "Module Completed",
        summary: "Learner completed 'Inter-Contract Invocations' with score 92%",
        amount: 55,
        score: 92,
      },
      {
        type: "reward_minted",
        title: "Reward Minted via Inter-Contract Call",
        summary: "ShikkhakCore minted 60 SKK to learner wallet",
        amount: 60,
      },
      {
        type: "tokens_staked",
        title: "Course Track Stake",
        summary: "Learner staked 50 SKK for Advanced Track access",
        amount: 50,
      },
      {
        type: "tokens_transferred",
        title: "Peer Reward Transfer",
        summary: "Learner transferred 25 SKK reward to study group",
        amount: 25,
      },
    ];

    const pick = mockPool[Math.floor(Math.random() * mockPool.length)];
    const mockAccounts = [
      "GA7N4K3T2U5M9P1A8E2R6T0Y4U1I7O3P5A9S1D3F5G8H",
      "GB3M8P2Q5T7Y9U1I4O6P8A2S4D6F8G0H2J4K6L8Z1X3C",
      "GC9X1K4N7P2A5E8T1U6M3Q9V2W4E6R0T8Y1U3I5O7P2A",
    ];
    const account = mockAccounts[Math.floor(Math.random() * mockAccounts.length)];
    const txHash = Array.from({ length: 64 }, () =>
      "0123456789abcdef"[Math.floor(Math.random() * 16)]
    ).join("");

    this.onEventCallback({
      type: pick.type,
      title: pick.title,
      summary: `${pick.summary} (${account.substring(0, 4)}...${account.substring(account.length - 4)})`,
      ledgerSequence: Math.floor(104350 + Math.random() * 50),
      txHash,
      account,
      amountSKK: pick.amount,
      score: pick.score,
      courseId: 1,
    });
  }
}

export const eventStreamer = new SorobanEventStreamer();
