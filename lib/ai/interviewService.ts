import { AnswerModel } from "@/models/Answer";
import { FeedbackReportModel } from "@/models/FeedbackReport";
import { InterviewModel } from "@/models/Interview";
import { ProfileModel } from "@/models/Profile";
import { QuestionModel } from "@/models/Question";
import { connectToDatabase } from "@/lib/db/mongoose";
import type { CreateInterviewInput, SubmitAnswerInput } from "@/lib/validators/interview";
import { geminiProvider } from "@/lib/ai/providers/gemini";
import { mockProvider } from "@/lib/ai/providers/mock";
import type { AIProvider } from "@/lib/ai/types";

function getProvider(): AIProvider {
  if (process.env.AI_PROVIDER === "gemini") {
    return geminiProvider;
  }

  return mockProvider;
}

function ensureSummary(interview: {
  summary?: {
    overallScore?: number;
    totalQuestions?: number;
    completedAnswers?: number;
  } | null;
}): {
  overallScore: number;
  totalQuestions: number;
  completedAnswers: number;
} {
  interview.summary ??= {
    overallScore: 0,
    totalQuestions: 0,
    completedAnswers: 0,
  };

  interview.summary.overallScore ??= 0;
  interview.summary.totalQuestions ??= 0;
  interview.summary.completedAnswers ??= 0;
  return interview.summary as {
    overallScore: number;
    totalQuestions: number;
    completedAnswers: number;
  };
}

export async function createInterview(userId: string, input: CreateInterviewInput) {
  await connectToDatabase();

  const profile = await ProfileModel.findOne({ userId }).lean();
  const provider = getProvider();
  const questions = await provider.generateQuestions({
    ...input,
    resumeText: profile?.resumeText || "",
  });

  const interview = await InterviewModel.create({
    userId,
    mode: input.mode,
    role: input.role,
    difficulty: input.difficulty,
    status: "active",
    currentQuestionIndex: 0,
    summary: {
      overallScore: 0,
      totalQuestions: questions.length,
      completedAnswers: 0,
    },
  });

  const questionDocs = await QuestionModel.insertMany(
    questions.map((question, index) => ({
      interviewId: interview._id,
      text: question.text,
      type: question.type,
      topic: question.topic,
      expectedSignals: question.expectedSignals,
      order: index,
    })),
  );

  return { interview, questions: questionDocs };
}

export async function submitInterviewAnswer(userId: string, interviewId: string, input: SubmitAnswerInput) {
  await connectToDatabase();

  const interview = await InterviewModel.findOne({ _id: interviewId, userId });

  if (!interview) {
    throw new Error("Interview not found.");
  }

  if (interview.status === "completed") {
    throw new Error("This interview is already completed.");
  }

  const question = await QuestionModel.findOne({ _id: input.questionId, interviewId });

  if (!question) {
    throw new Error("Question not found.");
  }

  const provider = getProvider();
  const evaluation = await provider.evaluateAnswer({
    question: question.text,
    answer: input.text,
    mode: interview.mode,
    role: interview.role,
    difficulty: interview.difficulty,
  });

  const answer = await AnswerModel.create({
    interviewId,
    questionId: question._id,
    text: input.text,
    transcriptSource: input.transcriptSource,
    evaluation: evaluation.summary,
    score: evaluation.score,
    strengths: evaluation.strengths,
    improvements: evaluation.improvements,
  });

  const completedAnswers = await AnswerModel.countDocuments({ interviewId });
  const allAnswers = await AnswerModel.find({ interviewId }).select("score").lean();
  const average =
    allAnswers.reduce((sum, item) => sum + item.score, 0) / Math.max(allAnswers.length, 1);

  const summary = ensureSummary(interview);
  interview.currentQuestionIndex = Math.min(completedAnswers, summary.totalQuestions);
  summary.completedAnswers = completedAnswers;
  summary.overallScore = Math.round(average);
  await interview.save();

  return { answer, evaluation };
}

export async function completeInterview(userId: string, interviewId: string) {
  await connectToDatabase();

  const interview = await InterviewModel.findOne({ _id: interviewId, userId });

  if (!interview) {
    throw new Error("Interview not found.");
  }

  const existingReport = await FeedbackReportModel.findOne({ interviewId }).lean();

  if (existingReport) {
    return existingReport;
  }

  const questions = await QuestionModel.find({ interviewId }).sort({ order: 1 }).lean();
  const answers = await AnswerModel.find({ interviewId }).lean();

  const transcript = questions.map((question) => {
    const answer = answers.find((item) => item.questionId.toString() === question._id.toString());

    return {
      question: question.text,
      answer: answer?.text || "No answer submitted.",
      evaluation: answer?.evaluation || "No evaluation available.",
      score: answer?.score || 0,
    };
  });

  const report = await getProvider().generateReport({
    mode: interview.mode,
    role: interview.role,
    difficulty: interview.difficulty,
    transcript,
  });

  const createdReport = await FeedbackReportModel.create({
    ...report,
    userId,
    interviewId,
  });

  interview.status = "completed";
  interview.completedAt = new Date();
  ensureSummary(interview).overallScore = createdReport.overallScore;
  await interview.save();

  return createdReport;
}
