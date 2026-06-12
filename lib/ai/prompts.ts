import type { CreateInterviewInput } from "@/lib/validators/interview";

export function buildQuestionPrompt(input: CreateInterviewInput, resumeText?: string) {
  return [
    "Create a realistic interview plan for a student or job seeker.",
    `Mode: ${input.mode}`,
    `Role: ${input.role}`,
    `Difficulty: ${input.difficulty}`,
    resumeText ? `Resume context: ${resumeText.slice(0, 3000)}` : "Resume context: not provided",
    "Return concise JSON with questions, topics, expected signals, and question types.",
  ].join("\n");
}

export function buildEvaluationPrompt(question: string, answer: string) {
  return [
    "Evaluate this interview answer like a fair senior interviewer.",
    `Question: ${question}`,
    `Answer: ${answer}`,
    "Return JSON with summary, score, strengths, improvements, and one follow-up if useful.",
  ].join("\n");
}

export function buildReportPrompt() {
  return [
    "Generate a structured interview report.",
    "Include overall, communication, technical, confidence scores, strengths, weaknesses, missed concepts, improvements, revision topics, better sample answers, and transcript.",
  ].join("\n");
}
