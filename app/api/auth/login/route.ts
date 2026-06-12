import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { createSessionToken, setSessionCookie } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/db/mongoose";
import { loginSchema } from "@/lib/validators/auth";
import { UserModel } from "@/models/User";

export async function POST(request: Request) {
  try {
    const body = loginSchema.parse(await request.json());

    await connectToDatabase();

    const user = await UserModel.findOne({ email: body.email });

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const isValidPassword = await bcrypt.compare(body.password, user.passwordHash);

    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

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
      { error: error instanceof Error ? error.message : "Unable to log in." },
      { status: 400 },
    );
  }
}
