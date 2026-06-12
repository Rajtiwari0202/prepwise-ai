import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/require-user";
import { createInterview } from "@/lib/ai/interviewService";
import { connectToDatabase } from "@/lib/db/mongoose";
import { createInterviewSchema } from "@/lib/validators/interview";
import { idOf, toIso } from "@/lib/utils/serialize";
import { InterviewModel } from "@/models/Interview";
import { FeedbackReportModel } from "@/models/FeedbackReport";

export async function GET() {
  const { user, response } = await requireUser();

  if (!user) {
    return response;
  }

  await connectToDatabase();
  const interviews = await InterviewModel.find({ userId: user.id }).sort({ createdAt: -1 }).lean();
  const reports = await FeedbackReportModel.find({ userId: user.id }).select("interviewId overallScore").lean();
  const reportMap = new Map(reports.map((report) => [report.interviewId.toString(), report]));

  return NextResponse.json({
    interviews: interviews.map((interview) => ({
      id: idOf(interview),
      mode: interview.mode,
      role: interview.role,
      difficulty: interview.difficulty,
      status: interview.status,
      summary: interview.summary,
      createdAt: toIso(interview.createdAt),
      completedAt: toIso(interview.completedAt),
      reportId: reportMap.get(interview._id.toString())?._id.toString() || null,
    })),
  });
}

export async function POST(request: Request) {
  const { user, response } = await requireUser();

  if (!user) {
    return response;
  }

  try {
    const input = createInterviewSchema.parse(await request.json());
    const { interview, questions } = await createInterview(user.id, input);

    return NextResponse.json({
      interview: {
        id: idOf(interview),
        mode: interview.mode,
        role: interview.role,
        difficulty: interview.difficulty,
        status: interview.status,
        currentQuestionIndex: interview.currentQuestionIndex,
        summary: interview.summary,
      },
      questions: questions.map((question) => ({
        id: idOf(question),
        text: question.text,
        type: question.type,
        topic: question.topic,
        expectedSignals: question.expectedSignals,
        order: question.order,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create interview." },
      { status: 400 },
    );
  }
}
