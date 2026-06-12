import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/require-user";
import { connectToDatabase } from "@/lib/db/mongoose";
import { idOf, toIso } from "@/lib/utils/serialize";
import { FeedbackReportModel } from "@/models/FeedbackReport";
import { InterviewModel } from "@/models/Interview";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: Params) {
  const { user, response } = await requireUser();

  if (!user) {
    return response;
  }

  const { id } = await params;
  await connectToDatabase();

  const report = await FeedbackReportModel.findOne({ _id: id, userId: user.id }).lean();

  if (!report) {
    return NextResponse.json({ error: "Report not found." }, { status: 404 });
  }

  const interview = await InterviewModel.findById(report.interviewId).lean();

  return NextResponse.json({
    report: {
      id: idOf(report),
      interviewId: report.interviewId.toString(),
      overallScore: report.overallScore,
      communicationScore: report.communicationScore,
      technicalScore: report.technicalScore,
      confidenceScore: report.confidenceScore,
      strengths: report.strengths,
      weaknesses: report.weaknesses,
      missedConcepts: report.missedConcepts,
      suggestedImprovements: report.suggestedImprovements,
      recommendedTopics: report.recommendedTopics,
      sampleAnswers: report.sampleAnswers,
      transcript: report.transcript,
      createdAt: toIso(report.createdAt),
    },
    interview: interview
      ? {
          id: idOf(interview),
          mode: interview.mode,
          role: interview.role,
          difficulty: interview.difficulty,
          completedAt: toIso(interview.completedAt),
        }
      : null,
  });
}
