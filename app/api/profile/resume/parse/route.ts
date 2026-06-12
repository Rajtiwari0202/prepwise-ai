import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/require-user";
import { connectToDatabase } from "@/lib/db/mongoose";
import { rateLimit } from "@/lib/security/rate-limit";
import { ProfileModel } from "@/models/Profile";

export const runtime = "nodejs";

const maxBytes = 3 * 1024 * 1024;

async function parseResume(file: File) {
  if (file.size > maxBytes) {
    throw new Error("Resume file must be 3MB or smaller.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const name = file.name.toLowerCase();

  if (file.type === "text/plain" || name.endsWith(".txt")) {
    return buffer.toString("utf8");
  }

  if (
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    name.endsWith(".docx")
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  if (file.type === "application/pdf" || name.endsWith(".pdf")) {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();
    return result.text;
  }

  throw new Error("Upload a TXT, PDF, or DOCX resume.");
}

export async function POST(request: Request) {
  const limited = rateLimit(request, "resume-parse", 8, 60_000);

  if (limited) {
    return limited;
  }

  const { user, response } = await requireUser();

  if (!user) {
    return response;
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Resume file is required." }, { status: 400 });
    }

    const resumeText = (await parseResume(file)).trim().slice(0, 12000);

    await connectToDatabase();
    await ProfileModel.findOneAndUpdate(
      { userId: user.id },
      { userId: user.id, resumeText },
      { upsert: true },
    );

    return NextResponse.json({ resumeText });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to parse resume." },
      { status: 400 },
    );
  }
}
