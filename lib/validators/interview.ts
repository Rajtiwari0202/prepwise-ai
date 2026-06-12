import { z } from "zod";

export const createInterviewSchema = z.object({
  mode: z.enum(["dsa", "hr", "resume", "mixed"]),
  role: z.string().trim().min(2).max(80),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
});

export const submitAnswerSchema = z.object({
  questionId: z.string().min(1),
  text: z.string().trim().min(8, "Give the interviewer enough signal to evaluate.").max(8000),
  transcriptSource: z.enum(["text", "voice"]).default("text"),
});

export type CreateInterviewInput = z.infer<typeof createInterviewSchema>;
export type SubmitAnswerInput = z.infer<typeof submitAnswerSchema>;
