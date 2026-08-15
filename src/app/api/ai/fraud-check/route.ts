import { NextRequest, NextResponse } from "next/server";
import { aiFraudDetectionService } from "@/services/ai/fraudDetector";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = aiFraudDetectionService.analyzeQuizSubmission({
      timeSpentSec: body.timeSpentSec || 15,
      questionCount: body.questionCount || 3,
      telemetryEvents: body.telemetryEvents || [],
      scorePct: body.scorePct || 100,
    });
    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
