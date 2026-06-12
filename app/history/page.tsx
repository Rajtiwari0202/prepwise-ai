import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getCurrentUser } from "@/lib/auth/require-user";
import { connectToDatabase } from "@/lib/db/mongoose";
import { FeedbackReportModel } from "@/models/FeedbackReport";
import { InterviewModel } from "@/models/Interview";

export default async function HistoryPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  await connectToDatabase();
  const [interviews, reports] = await Promise.all([
    InterviewModel.find({ userId: user.id }).sort({ createdAt: -1 }).lean(),
    FeedbackReportModel.find({ userId: user.id }).select("interviewId overallScore").lean(),
  ]);
  const reportMap = new Map(reports.map((report) => [report.interviewId.toString(), report]));

  return (
    <AppShell user={user}>
      <p className="text-sm uppercase tracking-[0.22em] text-teal-200">Interview history</p>
      <h1 className="mt-3 text-4xl font-semibold text-white">Practice archive</h1>
      <p className="mt-3 max-w-2xl text-slate-400">
        Review previous simulations, reopen unfinished rooms, and inspect generated reports.
      </p>

      <section className="mt-8 rounded-xl border border-slate-800 bg-slate-950/55 p-5">
        {interviews.length === 0 ? (
          <EmptyState
            title="No history yet"
            description="Your completed and in-progress interviews will appear here."
            action={<ButtonLink href="/interview/new">Start interview</ButtonLink>}
          />
        ) : (
          <div className="divide-y divide-slate-800">
            {interviews.map((interview) => {
              const report = reportMap.get(interview._id.toString());

              return (
                <div key={interview._id.toString()} className="grid gap-4 py-5 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <p className="text-lg font-semibold text-white">{interview.role}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {interview.mode.toUpperCase()} • {interview.difficulty} • {interview.status} • Score{" "}
                      {interview.summary?.overallScore || 0}%
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <ButtonLink href={`/interview/${interview._id.toString()}`} variant="secondary">
                      Room
                    </ButtonLink>
                    {report && (
                      <ButtonLink href={`/reports/${report._id.toString()}`}>
                        Report
                      </ButtonLink>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </AppShell>
  );
}
