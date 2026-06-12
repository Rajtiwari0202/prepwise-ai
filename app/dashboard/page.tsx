import { redirect } from "next/navigation";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { StatCard } from "@/components/ui/stat-card";
import { AppShell } from "@/components/layout/app-shell";
import { getCurrentUser } from "@/lib/auth/require-user";
import { connectToDatabase } from "@/lib/db/mongoose";
import { InterviewModel } from "@/models/Interview";
import { ProfileModel } from "@/models/Profile";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  await connectToDatabase();
  const [interviews, profile] = await Promise.all([
    InterviewModel.find({ userId: user.id }).sort({ createdAt: -1 }).limit(5).lean(),
    ProfileModel.findOne({ userId: user.id }).lean(),
  ]);

  const completed = interviews.filter((interview) => interview.status === "completed");
  const average =
    completed.reduce((sum, interview) => sum + (interview.summary?.overallScore || 0), 0) /
    Math.max(completed.length, 1);

  return (
    <AppShell user={user}>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-teal-200">Student dashboard</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Your interview command center</h1>
          <p className="mt-3 max-w-2xl text-slate-400">
            Track practice volume, inspect weak areas, and launch the next session with role context.
          </p>
        </div>
        <ButtonLink href="/interview/new">Start interview</ButtonLink>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <StatCard label="Sessions" value={String(interviews.length)} detail="Recent interviews loaded" />
        <StatCard label="Average" value={`${Math.round(average)}%`} detail="Completed session score" tone="amber" />
        <StatCard
          label="Target"
          value={profile?.targetRole || "SDE Intern"}
          detail={`${profile?.skills?.length || 0} skills in profile`}
          tone="rose"
        />
      </div>

      <section className="mt-8 rounded-xl border border-slate-800 bg-slate-950/55 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Recent interviews</h2>
            <p className="mt-1 text-sm text-slate-500">Your latest practice loops and report readiness.</p>
          </div>
          <ButtonLink href="/history" variant="secondary">
            View history
          </ButtonLink>
        </div>

        <div className="mt-5">
          {interviews.length === 0 ? (
            <EmptyState
              title="No interviews yet"
              description="Create your first DSA, HR, resume, or mixed interview and the cockpit will start tracking your progress."
              action={<ButtonLink href="/interview/new">Create first interview</ButtonLink>}
            />
          ) : (
            <div className="divide-y divide-slate-800">
              {interviews.map((interview) => (
                <div key={interview._id.toString()} className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-white">{interview.role}</p>
                    <p className="text-sm text-slate-500">
                      {interview.mode.toUpperCase()} • {interview.difficulty} • {interview.status}
                    </p>
                  </div>
                  <ButtonLink href={`/interview/${interview._id.toString()}`} variant="secondary">
                    Open
                  </ButtonLink>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </AppShell>
  );
}
