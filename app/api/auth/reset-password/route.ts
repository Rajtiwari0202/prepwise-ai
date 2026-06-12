import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { rateLimit } from "@/lib/security/rate-limit";
import { hashToken } from "@/lib/utils/crypto";
import { resetPasswordSchema } from "@/lib/validators/auth";
import { AuthTokenModel } from "@/models/AuthToken";
import { UserModel } from "@/models/User";

export async function POST(request: Request) {
  const limited = rateLimit(request, "auth-reset-password", 8, 60_000);

  if (limited) {
    return limited;
  }

  try {
    const body = resetPasswordSchema.parse(await request.json());
    await connectToDatabase();

    const token = await AuthTokenModel.findOne({
      tokenHash: hashToken(body.token),
      type: "password_reset",
      usedAt: { $exists: false },
      expiresAt: { $gt: new Date() },
    });

    if (!token) {
      return NextResponse.json({ error: "Reset link is invalid or expired." }, { status: 400 });
    }

    await UserModel.findByIdAndUpdate(token.userId, {
      passwordHash: await bcrypt.hash(body.password, 12),
    });
    token.usedAt = new Date();
    await token.save();

    return NextResponse.json({ message: "Password reset successful." });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to reset password." },
      { status: 400 },
    );
  }
}
