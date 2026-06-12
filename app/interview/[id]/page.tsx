import { redirect } from "next/navigation";
import { InterviewRoom } from "@/components/interview/interview-room";
import { AppShell } from "@/components/layout/app-shell";
import { getCurrentUser } from "@/lib/auth/require-user";
import { connectToDatabase } from "@/lib/db/mongoose";
import { AnswerModel } from "@/models/Answer";
import { FeedbackReportModel } from "@/models/FeedbackReport";
import { InterviewModel } from "@/models/Interview";
import { QuestionModel } from "@/models/Question";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function InterviewPage({ params }: PageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { id } = await params;
  await connectToDatabase();

  const [interview, questions, answers, report] = await Promise.all([
    InterviewModel.findOne({ _id: id, userId: user.id }).lean(),
    QuestionModel.find({ interviewId: id }).sort({ order: 1 }).lean(),
    AnswerModel.find({ interviewId: id }).sort({ createdAt: 1 }).lean(),
    FeedbackReportModel.findOne({ interviewId: id }).lean(),
  ]);

  if (!interview) {
    redirect("/dashboard");
  }

  return (
    <AppShell user={user}>
      <InterviewRoom
        interview={{
          id: interview._id.toString(),
          mode: interview.mode,
          role: interview.role,
          difficulty: interview.difficulty,
          status: interview.status,
          currentQuestionIndex: interview.currentQuestionIndex,
        }}
        questions={questions.map((question) => ({
          id: question._id.toString(),
          text: question.text,
          topic: question.topic,
          type: question.type,
          expectedSignals: question.expectedSignals,
          order: question.order,
        }))}
        answers={answers.map((answer) => ({
          id: answer._id.toString(),
          questionId: answer.questionId.toString(),
          text: answer.text,
          evaluation: answer.evaluation,
          score: answer.score,
          strengths: answer.strengths,
          improvements: answer.improvements,
        }))}
        reportId={report?._id.toString() || null}
      />
    </AppShell>
  );
}
