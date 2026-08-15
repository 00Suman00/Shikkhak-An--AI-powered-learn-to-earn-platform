import { ChatMessage } from "@/types/ai";

export const aiMentorService = {
  /**
   * Generates a context-aware tutoring response tailored to the active module topics
   */
  async askMentor(
    userQuestion: string,
    currentModuleTitle: string,
    moduleContextMarkdown: string
  ): Promise<ChatMessage> {
    // Simulate natural AI thinking latency
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const lower = userQuestion.toLowerCase();
    let replyText = "";
    let suggestedActions: string[] = [];

    if (lower.includes("storage") || lower.includes("instance") || lower.includes("persistent")) {
      replyText = `In **${currentModuleTitle}**, storage selection directly impacts transaction fees and data durability:\n\n- **Instance Storage**: Stored with the contract code. Perfect for config data (Admin, Minter, Decimals).\n- **Persistent Storage**: Retained across ledger bumps with rent fees. Used for user balances and credentials.\n- **Temporary Storage**: Cheap, expires if TTL is not renewed. Perfect for nonces and flash states.`;
      suggestedActions = ["How do I bump TTL?", "What happens if rent expires?"];
    } else if (lower.includes("cross") || lower.includes("inter-contract") || lower.includes("mint")) {
      replyText = `Cross-contract calls in Soroban are synchronous! In Shikkhak, **ShikkhakCore** generates a client binding to **ShikkhakToken**:\n\n\`\`\`rust\nlet token_client = ShikkhakTokenClient::new(&env, &token_address);\ntoken_client.mint_reward(&core_contract_address, &learner, &reward);\n\`\`\`\n\nAuth is checked so only authorized Core contracts can trigger minting.`;
      suggestedActions = ["Show me how auth is validated", "Can contracts call multiple tokens?"];
    } else if (lower.includes("fraud") || lower.includes("anti-cheat") || lower.includes("blocked")) {
      replyText = `The **Anti-Cheat Engine** monitors four live telemetry signals:\n1. **Pace**: Taking less than 4 seconds per question flags suspicious guessing or bot activity.\n2. **Focus Changes**: Unfocusing the window or opening external tabs.\n3. **Clipboard Activity**: Rapid copy/pasting.\n\nKeep your score under 30 to claim on-chain rewards!`;
      suggestedActions = ["How is the proof hash created?", "Retake the assessment"];
    } else {
      replyText = `Great question regarding **${currentModuleTitle}**! Soroban smart contracts use Rust and compile directly to WASM. Keep in mind that all state operations are metered by the Stellar host environment. Would you like me to walk through the code implementation for this step?`;
      suggestedActions = ["Explain the code line-by-line", "Show quiz hints", "Run anti-cheat test"];
    }

    return {
      id: `ai-reply-${Date.now()}`,
      sender: "ai",
      text: replyText,
      timestamp: Date.now(),
      suggestedActions,
    };
  },
};
