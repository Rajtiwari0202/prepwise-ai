import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { createSessionToken, setSessionCookie } from "@/lib/auth/session";
import { createAuthToken } from "@/lib/auth/tokens";
import { sendEmail } from "@/lib/email/send";
import { rateLimit } from "@/lib/security/rate-limit";
import { registerSchema } from "@/lib/validators/auth";
import { ProfileModel } from "@/models/Profile";
import { UserModel } from "@/models/User";

export async function POST(request: Request) {
  const limited = rateLimit(request, "auth-register", 8, 60_000);

  if (limited) {
    return limited;
  }

  try {
    const body = registerSchema.parse(await request.json());

    await connectToDatabase();

    const existingUser = await UserModel.findOne({ email: body.email }).lean();

    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(body.password, 12);
    const user = await UserModel.create({
      name: body.name,
      email: body.email,
      passwordHash,
    });

    await ProfileModel.create({
      userId: user._id,
      targetRole: "SDE Intern",
      experienceLevel: "Student",
      skills: [],
      resumeText: "",
    });

    const token = await createSessionToken({ userId: user._id.toString(), email: user.email });
    await setSessionCookie(token);

    const verificationToken = await createAuthToken(user._id.toString(), "email_verification");
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || request.headers.get("origin") || "http://localhost:3000";
    await sendEmail({
      to: user.email,
      subject: "Verify your Prepwise AI account",
      text: `Verify your account: ${appUrl}/auth/verify?token=${verificationToken}`,
    });

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create account." },
      { status: 400 },
    );
  }
}
