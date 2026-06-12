import { NextResponse } from "next/server";
import { createAuthToken } from "@/lib/auth/tokens";
import { connectToDatabase } from "@/lib/db/mongoose";
import { sendEmail } from "@/lib/email/send";
import { rateLimit } from "@/lib/security/rate-limit";
import { forgotPasswordSchema } from "@/lib/validators/auth";
import { UserModel } from "@/models/User";

export async function POST(request: Request) {
  const limited = rateLimit(request, "auth-forgot-password", 6, 60_000);

  if (limited) {
    return limited;
  }

  try {
    const body = forgotPasswordSchema.parse(await request.json());
    await connectToDatabase();
    const user = await UserModel.findOne({ email: body.email });

    if (user) {
      const token = await createAuthToken(user._id.toString(), "password_reset");
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || request.headers.get("origin") || "http://localhost:3000";
      await sendEmail({
        to: user.email,
        subject: "Reset your Prepwise AI password",
        text: `Reset your password: ${appUrl}/auth/reset-password?token=${token}`,
      });
    }

    return NextResponse.json({
      message: "If that email exists, a reset link has been sent.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to request reset." },
      { status: 400 },
    );
  }
}
