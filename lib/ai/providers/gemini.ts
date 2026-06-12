import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildEvaluationPrompt, buildQuestionPrompt, buildReportPrompt } from "@/lib/ai/prompts";
import type {
  AIProvider,
  EvaluateAnswerInput,
  GeneratedQuestion,
  GenerateQuestionsInput,
  GeneratedReport,
  GenerateReportInput,
} from "@/lib/ai/types";
import { mockProvider } from "@/lib/ai/providers/mock";

function getModel() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return null;
  }

  const client = new GoogleGenerativeAI(apiKey);
  return client.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-1.5-flash" });
}

function extractJson<T>(text: string): T {
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned) as T;
}

export const geminiProvider: AIProvider = {
  async generateQuestions(input: GenerateQuestionsInput) {
    const model = getModel();

    if (!model) {
      return mockProvider.generateQuestions(input);
    }

    const result = await model.generateContent(buildQuestionPrompt(input, input.resumeText));
    return extractJson<GeneratedQuestion[]>(result.response.text());
  },

  async evaluateAnswer(input: EvaluateAnswerInput) {
    const model = getModel();

    if (!model) {
      return mockProvider.evaluateAnswer(input);
    }

    const result = await model.generateContent(buildEvaluationPrompt(input.question, input.answer));
    return extractJson(result.response.text());
  },

  async generateReport(input: GenerateReportInput) {
    const model = getModel();

    if (!model) {
      return mockProvider.generateReport(input);
    }

    const result = await model.generateContent(
      `${buildReportPrompt()}\n\nInput JSON:\n${JSON.stringify(input, null, 2)}`,
    );
    return extractJson<GeneratedReport>(result.response.text());
  },
};
