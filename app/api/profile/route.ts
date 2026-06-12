import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/require-user";
import { connectToDatabase } from "@/lib/db/mongoose";
import { profileSchema } from "@/lib/validators/profile";
import { ProfileModel } from "@/models/Profile";

export async function GET() {
  const { user, response } = await requireUser();

  if (!user) {
    return response;
  }

  await connectToDatabase();
  const profile = await ProfileModel.findOne({ userId: user.id }).lean();

  return NextResponse.json({
    profile: profile
      ? {
          id: profile._id.toString(),
          targetRole: profile.targetRole,
          experienceLevel: profile.experienceLevel,
          skills: profile.skills,
          resumeText: profile.resumeText,
        }
      : null,
  });
}

export async function PUT(request: Request) {
  const { user, response } = await requireUser();

  if (!user) {
    return response;
  }

  try {
    const body = profileSchema.parse(await request.json());

    await connectToDatabase();
    const profile = await ProfileModel.findOneAndUpdate(
      { userId: user.id },
      { ...body, userId: user.id },
      { new: true, upsert: true },
    ).lean();

    return NextResponse.json({
      profile: {
        id: profile._id.toString(),
        targetRole: profile.targetRole,
        experienceLevel: profile.experienceLevel,
        skills: profile.skills,
        resumeText: profile.resumeText,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update profile." },
      { status: 400 },
    );
  }
}
