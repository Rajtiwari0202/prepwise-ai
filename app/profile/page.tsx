import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { ProfileForm } from "@/components/profile/profile-form";
import { getCurrentUser } from "@/lib/auth/require-user";
import { connectToDatabase } from "@/lib/db/mongoose";
import { ProfileModel } from "@/models/Profile";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  await connectToDatabase();
  const profile = await ProfileModel.findOne({ userId: user.id }).lean();

  return (
    <AppShell user={user}>
      <p className="text-sm uppercase tracking-[0.22em] text-teal-200">Resume profile</p>
      <h1 className="mt-3 text-4xl font-semibold text-white">Tune your interview context</h1>
      <p className="mt-3 max-w-2xl text-slate-400">
        Resume-based interviews pull from this profile, so keep it honest, specific, and project-heavy.
      </p>
      <div className="mt-8">
        <ProfileForm
          profile={{
            targetRole: profile?.targetRole || "SDE Intern",
            experienceLevel: profile?.experienceLevel || "Student",
            skills: profile?.skills || [],
            resumeText: profile?.resumeText || "",
          }}
        />
      </div>
    </AppShell>
  );
}
