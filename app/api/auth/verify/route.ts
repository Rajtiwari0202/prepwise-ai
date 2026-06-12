import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { hashToken } from "@/lib/utils/crypto";
import { AuthTokenModel } from "@/models/AuthToken";
import { UserModel } from "@/models/User";

export async function POST(request: Request) {
  try {
    const { token: rawToken } = (await request.json()) as { token?: string };

    if (!rawToken) {
      return NextResponse.json({ error: "Verification token is required." }, { status: 400 });
    }

    await connectToDatabase();
    const token = await AuthTokenModel.findOne({
      tokenHash: hashToken(rawToken),
      type: "email_verification",
      usedAt: { $exists: false },
      expiresAt: { $gt: new Date() },
    });

    if (!token) {
      return NextResponse.json({ error: "Verification link is invalid or expired." }, { status: 400 });
    }

    await UserModel.findByIdAndUpdate(token.userId, { emailVerified: true });
    token.usedAt = new Date();
    await token.save();

    return NextResponse.json({ message: "Email verified." });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to verify email." },
      { status: 400 },
    );
  }
}
