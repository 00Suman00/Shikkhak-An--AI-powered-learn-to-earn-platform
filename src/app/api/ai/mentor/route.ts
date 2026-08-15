import { NextRequest, NextResponse } from "next/server";
import { aiMentorService } from "@/services/ai/mentor";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const reply = await aiMentorService.askMentor(
      body.question || "How do Soroban smart contracts work?",
      body.currentModuleTitle || "Soroban Module",
      body.moduleContent || ""
    );
    return NextResponse.json({ success: true, reply });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
