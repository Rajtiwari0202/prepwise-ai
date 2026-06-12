import type { CreateInterviewInput } from "@/lib/validators/interview";
import type { AnswerEvaluation, QuestionType, ReportTranscriptItem } from "@/types/interview";

export type GeneratedQuestion = {
  text: string;
  type: QuestionType;
  topic: string;
  expectedSignals: string[];
};

export type GenerateQuestionsInput = CreateInterviewInput & {
  resumeText?: string;
};

export type EvaluateAnswerInput = {
  question: string;
  answer: string;
  mode: string;
  role: string;
  difficulty: string;
};

export type GenerateReportInput = {
  mode: string;
  role: string;
  difficulty: string;
  transcript: ReportTranscriptItem[];
};

export type GeneratedReport = {
  overallScore: number;
  communicationScore: number;
  technicalScore: number;
  confidenceScore: number;
  strengths: string[];
  weaknesses: string[];
  missedConcepts: string[];
  suggestedImprovements: string[];
  recommendedTopics: string[];
  sampleAnswers: Array<{ question: string; answer: string }>;
  transcript: ReportTranscriptItem[];
};

export type AIProvider = {
  generateQuestions(input: GenerateQuestionsInput): Promise<GeneratedQuestion[]>;
  evaluateAnswer(input: EvaluateAnswerInput): Promise<AnswerEvaluation>;
  generateReport(input: GenerateReportInput): Promise<GeneratedReport>;
};
