import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { createSessionToken, setSessionCookie } from "@/lib/auth/session";
import { registerSchema } from "@/lib/validators/auth";
import { ProfileModel } from "@/models/Profile";
import { UserModel } from "@/models/User";

export async function POST(request: Request) {
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
