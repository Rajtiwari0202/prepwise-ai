import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/require-user";
import { connectToDatabase } from "@/lib/db/mongoose";
import { idOf, toIso } from "@/lib/utils/serialize";
import { AnswerModel } from "@/models/Answer";
import { FeedbackReportModel } from "@/models/FeedbackReport";
import { InterviewModel } from "@/models/Interview";
import { QuestionModel } from "@/models/Question";

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

  const interview = await InterviewModel.findOne({ _id: id, userId: user.id }).lean();

  if (!interview) {
    return NextResponse.json({ error: "Interview not found." }, { status: 404 });
  }

  const [questions, answers, report] = await Promise.all([
    QuestionModel.find({ interviewId: id }).sort({ order: 1 }).lean(),
    AnswerModel.find({ interviewId: id }).lean(),
    FeedbackReportModel.findOne({ interviewId: id }).lean(),
  ]);

  return NextResponse.json({
    interview: {
      id: idOf(interview),
      mode: interview.mode,
      role: interview.role,
      difficulty: interview.difficulty,
      status: interview.status,
      currentQuestionIndex: interview.currentQuestionIndex,
      summary: interview.summary,
      createdAt: toIso(interview.createdAt),
      completedAt: toIso(interview.completedAt),
      reportId: report?._id.toString() || null,
    },
    questions: questions.map((question) => ({
      id: idOf(question),
      text: question.text,
      type: question.type,
      topic: question.topic,
      expectedSignals: question.expectedSignals,
      order: question.order,
    })),
    answers: answers.map((answer) => ({
      id: idOf(answer),
      questionId: answer.questionId.toString(),
      text: answer.text,
      transcriptSource: answer.transcriptSource,
      evaluation: answer.evaluation,
      score: answer.score,
      strengths: answer.strengths,
      improvements: answer.improvements,
      createdAt: toIso(answer.createdAt),
    })),
  });
}
