import { requireUser } from "@/lib/auth/require-user";
import { submitInterviewAnswer } from "@/lib/ai/interviewService";
import { submitAnswerSchema } from "@/lib/validators/interview";
import { idOf } from "@/lib/utils/serialize";

type Params = {
  params: Promise<{ id: string }>;
};

function encodeEvent(event: string, data: unknown) {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function POST(request: Request, { params }: Params) {
  const { user, response } = await requireUser();

  if (!user) {
    return response;
  }

  try {
    const { id } = await params;
    const input = submitAnswerSchema.parse(await request.json());
    const { answer, evaluation } = await submitInterviewAnswer(user.id, id, input);

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        const words = evaluation.summary.split(" ");

        for (let index = 0; index < words.length; index += 8) {
          const chunk = words.slice(index, index + 8).join(" ");
          controller.enqueue(encoder.encode(encodeEvent("chunk", { text: `${chunk} ` })));
          await new Promise((resolve) => setTimeout(resolve, 35));
        }

        controller.enqueue(
          encoder.encode(
            encodeEvent("done", {
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
            }),
          ),
        );
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unable to submit answer." },
      { status: 400 },
    );
  }
}
