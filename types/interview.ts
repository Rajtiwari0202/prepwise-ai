export type InterviewMode = "dsa" | "hr" | "resume" | "mixed";

export type InterviewDifficulty = "beginner" | "intermediate" | "advanced";

export type InterviewStatus = "draft" | "active" | "completed";

export type TranscriptSource = "text" | "voice";

export type QuestionType = "technical" | "behavioral" | "resume" | "follow_up";

export type InterviewRole =
  | "Frontend Engineer"
  | "Backend Engineer"
  | "Full-stack Engineer"
  | "SDE Intern"
  | "Data Structures Specialist"
  | "Product Engineer";

export type AnswerEvaluation = {
  summary: string;
  score: number;
  strengths: string[];
  improvements: string[];
  followUpQuestion?: string;
};

export type ReportTranscriptItem = {
  question: string;
  answer: string;
  evaluation: string;
  score: number;
};
