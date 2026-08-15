import { NextRequest, NextResponse } from "next/server";
import { aiPersonalizationService } from "@/services/ai/personalization";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = aiPersonalizationService.evaluateDiagnostic({
      scorePct: body.scorePct || 80,
      timeSpentSec: body.timeSpentSec || 30,
      rawAnswers: body.rawAnswers || [1, 2, 2],
    });
    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
