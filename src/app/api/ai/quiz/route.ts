import { NextRequest, NextResponse } from "next/server";
import { aiQuizService } from "@/services/ai/quizGenerator";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const moduleId = Number(searchParams.get("moduleId")) || 1;
  const questions = aiQuizService.generateQuizForModule(moduleId);
  return NextResponse.json({ success: true, questions });
}
