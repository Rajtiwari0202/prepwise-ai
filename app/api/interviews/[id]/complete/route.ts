import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/require-user";
import { completeInterview } from "@/lib/ai/interviewService";
import { idOf } from "@/lib/utils/serialize";

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(_: Request, { params }: Params) {
  const { user, response } = await requireUser();

  if (!user) {
    return response;
  }

  try {
    const { id } = await params;
    const report = await completeInterview(user.id, id);

    return NextResponse.json({
      report: {
        id: idOf(report),
        interviewId: report.interviewId.toString(),
        overallScore: report.overallScore,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to complete interview." },
      { status: 400 },
    );
  }
}
