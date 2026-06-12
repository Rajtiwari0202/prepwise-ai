import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { StatCard } from "@/components/ui/stat-card";
import { getCurrentUser, isAdmin } from "@/lib/auth/require-user";
import { connectToDatabase } from "@/lib/db/mongoose";
import { AnswerModel } from "@/models/Answer";
import { FeedbackReportModel } from "@/models/FeedbackReport";
import { InterviewModel } from "@/models/Interview";
import { UserModel } from "@/models/User";

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  if (!isAdmin(user)) {
    redirect("/dashboard");
  }

  await connectToDatabase();
  const [users, interviews, completed, reports, answers, recentInterviews] = await Promise.all([
    UserModel.countDocuments(),
    InterviewModel.countDocuments(),
    InterviewModel.countDocuments({ status: "completed" }),
    FeedbackReportModel.countDocuments(),
    AnswerModel.countDocuments(),
    InterviewModel.find().sort({ createdAt: -1 }).limit(8).populate("userId", "name email").lean(),
  ]);

  return (
    <AppShell user={user}>
      <p className="text-sm uppercase tracking-[0.22em] text-teal-200">Admin analytics</p>
      <h1 className="mt-3 text-4xl font-semibold text-white">Platform health</h1>
      <p className="mt-3 max-w-2xl text-slate-400">
        Lightweight product analytics for usage, completion, and report generation.
      </p>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <StatCard label="Users" value={String(users)} detail="Registered accounts" />
        <StatCard label="Interviews" value={String(interviews)} detail={`${completed} completed`} tone="amber" />
        <StatCard label="Reports" value={String(reports)} detail={`${answers} answers evaluated`} tone="rose" />
      </section>

      <section className="mt-8 rounded-xl border border-slate-800 bg-slate-950/55 p-5">
        <h2 className="text-xl font-semibold text-white">Recent interviews</h2>
        <div className="mt-4 divide-y divide-slate-800">
          {recentInterviews.map((interview) => {
            const owner = interview.userId as unknown as { name?: string; email?: string };

            return (
              <div key={interview._id.toString()} className="grid gap-2 py-4 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="font-semibold text-white">{interview.role}</p>
                  <p className="text-sm text-slate-500">
                    {owner?.email || "Unknown user"} / {interview.mode} / {interview.difficulty}
                  </p>
                </div>
                <span className="rounded-md border border-slate-700 px-2.5 py-1 text-xs text-slate-300">
                  {interview.status}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </AppShell>
  );
}
