import express from "express";
import { model } from "../config/gemini";

const router = express.Router();

router.post("/generate", async (req, res) => {
  const { role, company, level } = req.body;

  try {
    const prompt = `
Generate 5 interview questions for:
Role: ${role}
Company: ${company}
Difficulty: ${level}

Return only numbered questions.
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.json({
      success: true,
      source: "gemini",
      questions: response,
    });
  } catch (error) {
    console.error(error);

    const fallbackQuestions = [
      `Tell me about yourself for a ${role} role.`,
      `Why do you want to join ${company}?`,
      `Explain one project from your resume in depth.`,
      `What are your strongest technical skills for this role?`,
      `Describe a difficult problem you solved and how you approached it.`,
    ];

    res.json({
      success: true,
      source: "fallback",
      questions: fallbackQuestions,
      message: "Gemini quota unavailable, fallback questions used.",
    });
  }
});

export default router;