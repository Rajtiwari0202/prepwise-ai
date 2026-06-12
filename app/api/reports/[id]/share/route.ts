import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/require-user";
import { connectToDatabase } from "@/lib/db/mongoose";
import { createShareId } from "@/lib/utils/crypto";
import { FeedbackReportModel } from "@/models/FeedbackReport";

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(_: Request, { params }: Params) {
  const { user, response } = await requireUser();

  if (!user) {
    return response;
  }

  const { id } = await params;
  await connectToDatabase();

  const report = await FeedbackReportModel.findOne({ _id: id, userId: user.id });

  if (!report) {
    return NextResponse.json({ error: "Report not found." }, { status: 404 });
  }

  report.isPublic = true;
  report.publicShareId ||= createShareId();
  await report.save();

  return NextResponse.json({ publicShareId: report.publicShareId });
}

export async function DELETE(_: Request, { params }: Params) {
  const { user, response } = await requireUser();

  if (!user) {
    return response;
  }

  const { id } = await params;
  await connectToDatabase();

  await FeedbackReportModel.findOneAndUpdate(
    { _id: id, userId: user.id },
    { isPublic: false },
  );

  return NextResponse.json({ ok: true });
}
