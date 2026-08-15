import { create } from "zustand";
import { LiveContractEvent, ShikkhakEventType } from "@/types/events";

interface EventStoreState {
  events: LiveContractEvent[];
  selectedFilter: ShikkhakEventType | "all";
  isStreamingActive: boolean;
  addEvent: (event: Omit<LiveContractEvent, "id" | "timestamp">) => void;
  setFilter: (filter: ShikkhakEventType | "all") => void;
  toggleStreaming: () => void;
  getFilteredEvents: () => LiveContractEvent[];
}

const INITIAL_EVENTS: LiveContractEvent[] = [
  {
    id: "evt-01",
    type: "reward_minted",
    title: "Reward Minted",
    summary: "Learner GA3D...5G7H received 40 SKK for completing Module 1",
    timestamp: Date.now() - 1000 * 60 * 5,
    ledgerSequence: 104250,
    txHash: "9a2f7c41b8e4e937d55f9c6d3210459a72d3e18f28d8417c603b749651a5e128",
    account: "GA3D5K7R6P4K3T6A7U3M8Q2V4W9E1R5T7Y0U2I4O6P8A9S1D3F5G7H",
    amountSKK: 40,
    courseId: 1,
    moduleId: 1,
    score: 95,
  },
  {
    id: "evt-02",
    type: "tokens_staked",
    title: "Track Unlock Stake",
    summary: "Learner GB7X...9L1P staked 100 SKK for 1000 ledgers",
    timestamp: Date.now() - 1000 * 60 * 22,
    ledgerSequence: 104190,
    txHash: "4c3b8e72f91a5042d87e193c64a5f019b84e7239105a62f8319c745d0281be4a",
    account: "GB7X2K4N9P1A5E8T2U6M4Q9V1W3E7R0T5Y8U1I3O5P7A2S4D6F8G",
    amountSKK: 100,
  },
  {
    id: "evt-03",
    type: "credential_issued",
    title: "Tamper-Proof Credential Issued",
    summary: "Credential #a9d4f2... verified on-chain for Soroban Mastery",
    timestamp: Date.now() - 1000 * 60 * 45,
    ledgerSequence: 104120,
    txHash: "7b1e4c92a5038f19d64a27e831b045c92e718a39506f128d49a71e204b6c318a",
    account: "GC1M8P3Q5T7Y9U1I4O6P8A2S4D6F8G0H2J4K6L8Z1X3C5V7B9N0M",
    courseId: 1,
  },
];

export const useEventStore = create<EventStoreState>((set, get) => ({
  events: INITIAL_EVENTS,
  selectedFilter: "all",
  isStreamingActive: true,

  addEvent: (event) => {
    const newEvent: LiveContractEvent = {
      ...event,
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
    };
    set((state) => ({
      events: [newEvent, ...state.events.slice(0, 49)], // Keep up to 50 live events
    }));
  },

  setFilter: (selectedFilter) => set({ selectedFilter }),

  toggleStreaming: () =>
    set((state) => ({ isStreamingActive: !state.isStreamingActive })),

  getFilteredEvents: () => {
    const { events, selectedFilter } = get();
    if (selectedFilter === "all") return events;
    return events.filter((e) => e.type === selectedFilter);
  },
}));
