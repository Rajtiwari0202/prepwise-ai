import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/require-user";
import { submitInterviewAnswer } from "@/lib/ai/interviewService";
import { submitAnswerSchema } from "@/lib/validators/interview";
import { idOf } from "@/lib/utils/serialize";

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: Params) {
  const { user, response } = await requireUser();

  if (!user) {
    return response;
  }

  try {
    const { id } = await params;
    const input = submitAnswerSchema.parse(await request.json());
    const { answer, evaluation } = await submitInterviewAnswer(user.id, id, input);

    return NextResponse.json({
      answer: {
        id: idOf(answer),
        questionId: answer.questionId.toString(),
        text: answer.text,
        evaluation: answer.evaluation,
        score: answer.score,
        strengths: answer.strengths,
        improvements: answer.improvements,
      },
      evaluation,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to submit answer." },
      { status: 400 },
    );
  }
}
