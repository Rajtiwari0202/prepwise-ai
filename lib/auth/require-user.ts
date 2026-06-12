import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { getSession } from "@/lib/auth/session";
import { UserModel } from "@/models/User";

export async function getCurrentUser() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  await connectToDatabase();
  const user = await UserModel.findById(session.userId).select("name email createdAt role emailVerified").lean();

  if (!user) {
    return null;
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
  };
}

export function isAdmin(user: { email: string; role?: string }) {
  return user.role === "admin" || Boolean(process.env.ADMIN_EMAIL && user.email === process.env.ADMIN_EMAIL);
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      user: null,
      response: NextResponse.json({ error: "Authentication required." }, { status: 401 }),
    };
  }

  return { user, response: null };
}
