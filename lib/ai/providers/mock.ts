import type {
  AIProvider,
  EvaluateAnswerInput,
  GeneratedQuestion,
  GenerateQuestionsInput,
  GenerateReportInput,
} from "@/lib/ai/types";

const dsaQuestions: GeneratedQuestion[] = [
  {
    text: "Explain how you would detect a cycle in a linked list, including time and space complexity.",
    type: "technical",
    topic: "Linked lists",
    expectedSignals: ["two pointers", "cycle proof", "O(n) time", "O(1) space"],
  },
  {
    text: "Given a stream of numbers, how would you maintain the median after each insertion?",
    type: "technical",
    topic: "Heaps",
    expectedSignals: ["two heaps", "rebalance", "peek roots", "complexity"],
  },
  {
    text: "When would you choose BFS over DFS, and what trade-offs matter in interviews?",
    type: "technical",
    topic: "Graphs",
    expectedSignals: ["shortest path", "memory", "visited set", "component traversal"],
  },
];

const hrQuestions: GeneratedQuestion[] = [
  {
    text: "Tell me about a time you took ownership of a difficult project with unclear requirements.",
    type: "behavioral",
    topic: "Ownership",
    expectedSignals: ["context", "action", "impact", "reflection"],
  },
  {
    text: "Describe a disagreement with a teammate and how you moved the work forward.",
    type: "behavioral",
    topic: "Collaboration",
    expectedSignals: ["empathy", "trade-offs", "resolution", "learning"],
  },
  {
    text: "Why are you interested in this role, and what makes you ready for it now?",
    type: "behavioral",
    topic: "Motivation",
    expectedSignals: ["role fit", "evidence", "trajectory", "specificity"],
  },
];

function resumeQuestions(role: string): GeneratedQuestion[] {
  return [
    {
      text: `Pick the strongest project from your resume and explain the technical decisions that would matter for a ${role} interview.`,
      type: "resume",
      topic: "Project depth",
      expectedSignals: ["constraints", "architecture", "ownership", "metrics"],
    },
    {
      text: "Which skill on your resume is most interview-ready, and what proof can you give?",
      type: "resume",
      topic: "Evidence",
      expectedSignals: ["specific example", "measurable result", "honest scope"],
    },
  ];
}

function clampScore(score: number) {
  return Math.max(35, Math.min(96, Math.round(score)));
}

function keywordScore(answer: string, signals: string[]) {
  const normalized = answer.toLowerCase();
  const hits = signals.filter((signal) => normalized.includes(signal.split(" ")[0].toLowerCase())).length;
  return hits * 9;
}

export const mockProvider: AIProvider = {
  async generateQuestions(input: GenerateQuestionsInput) {
    const roleIntro: GeneratedQuestion = {
      text: `For a ${input.role} ${input.difficulty} interview, introduce yourself in 90 seconds and frame the kind of engineering problems you enjoy solving.`,
      type: "behavioral",
      topic: "Communication",
      expectedSignals: ["structure", "role fit", "specific examples", "confidence"],
    };

    if (input.mode === "dsa") {
      return [roleIntro, ...dsaQuestions];
    }

    if (input.mode === "hr") {
      return [roleIntro, ...hrQuestions];
    }

    if (input.mode === "resume") {
      return [roleIntro, ...resumeQuestions(input.role), hrQuestions[0]];
    }

    return [roleIntro, dsaQuestions[0], hrQuestions[0], ...resumeQuestions(input.role), dsaQuestions[1]];
  },

  async evaluateAnswer(input: EvaluateAnswerInput) {
    const answerLength = input.answer.trim().split(/\s+/).length;
    const structureSignals = ["first", "second", "because", "trade", "complexity", "example", "impact"];
    const score = clampScore(48 + Math.min(answerLength, 120) * 0.22 + keywordScore(input.answer, structureSignals));

    const strengths = [
      answerLength > 45 ? "Gives enough detail for the interviewer to inspect reasoning." : "Keeps the answer concise.",
      input.answer.toLowerCase().includes("because")
        ? "Explains reasoning instead of only stating the final answer."
        : "Shows an initial direction that can be sharpened with reasoning.",
    ];

    const improvements = [
      "Use a clearer beginning-middle-end structure.",
      input.mode === "dsa"
        ? "State time and space complexity explicitly."
        : "Anchor the answer with a more measurable outcome.",
    ];

    return {
      summary: `The answer is ${score >= 75 ? "solid" : "developing"} for a ${input.role} ${input.difficulty} interview. It gives usable signal but can improve with sharper structure and more concrete evidence.`,
      score,
      strengths,
      improvements,
      followUpQuestion:
        score >= 78
          ? "What edge case or trade-off would you discuss if the interviewer pushed deeper?"
          : "Can you restate the answer using one concrete example and a measurable result?",
    };
  },

  async generateReport(input: GenerateReportInput) {
    const scores = input.transcript.map((item) => item.score);
    const average = scores.length ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;
    const overallScore = clampScore(average || 62);

    return {
      overallScore,
      communicationScore: clampScore(overallScore - 2),
      technicalScore: clampScore(input.mode === "hr" ? overallScore - 6 : overallScore + 3),
      confidenceScore: clampScore(overallScore - 7),
      strengths: [
        "Shows interview readiness by attempting structured answers.",
        "Provides enough material for follow-up evaluation.",
        "Maintains alignment with the selected role and difficulty.",
      ],
      weaknesses: [
        "Needs tighter answer framing under time pressure.",
        "Should make assumptions and trade-offs more explicit.",
        "Could use more role-specific examples and measurable outcomes.",
      ],
      missedConcepts:
        input.mode === "hr"
          ? ["STAR format", "impact quantification", "conflict resolution framing"]
          : ["complexity analysis", "edge cases", "trade-off comparison"],
      suggestedImprovements: [
        "Open with a one-sentence thesis before details.",
        "Use examples that include context, action, and impact.",
        "End technical answers with complexity, limitations, and one alternative.",
      ],
      recommendedTopics:
        input.mode === "hr"
          ? ["STAR storytelling", "project ownership examples", "motivation pitch"]
          : ["arrays and hashing", "graphs", "dynamic programming basics", "system design trade-offs"],
      sampleAnswers: input.transcript.slice(0, 3).map((item) => ({
        question: item.question,
        answer:
          "A stronger answer would start with the main approach, explain the reason behind it, cover trade-offs, then close with complexity or measurable impact.",
      })),
      transcript: input.transcript,
    };
  },
};
