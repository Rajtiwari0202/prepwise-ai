import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { ShareReport } from "@/components/reports/share-report";
import { ScorePanel } from "@/components/reports/score-panel";
import { ButtonLink } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/require-user";
import { connectToDatabase } from "@/lib/db/mongoose";
import { FeedbackReportModel } from "@/models/FeedbackReport";
import { InterviewModel } from "@/models/Interview";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ReportPage({ params }: PageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { id } = await params;
  await connectToDatabase();

  const report = await FeedbackReportModel.findOne({ _id: id, userId: user.id }).lean();

  if (!report) {
    redirect("/history");
  }

  const interview = await InterviewModel.findById(report.interviewId).lean();

  return (
    <AppShell user={user}>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-teal-200">Feedback report</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">
            {interview?.role || "Interview"} readiness analysis
          </h1>
          <p className="mt-3 text-slate-400">
            {interview?.mode.toUpperCase()} / {interview?.difficulty} / Structured feedback from the session transcript
          </p>
        </div>
        <ButtonLink href="/interview/new" variant="secondary">
          Practice again
        </ButtonLink>
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-4">
        <ScorePanel label="Overall" score={report.overallScore} detail="Weighted readiness across the session." />
        <ScorePanel label="Communication" score={report.communicationScore} detail="Structure, clarity, and pacing." />
        <ScorePanel label="Technical" score={report.technicalScore} detail="Concept depth and trade-off handling." />
        <ScorePanel label="Confidence" score={report.confidenceScore} detail="Specificity and answer control." />
      </section>

      <section className="mt-8">
        <ShareReport
          reportId={report._id.toString()}
          initialShareId={report.publicShareId || ""}
          initialIsPublic={report.isPublic}
        />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <ReportList title="Strengths" items={report.strengths} />
        <ReportList title="Weaknesses" items={report.weaknesses} tone="rose" />
        <ReportList title="Missed concepts" items={report.missedConcepts} tone="amber" />
        <ReportList title="Recommended revision" items={report.recommendedTopics} />
      </section>

      <section className="mt-8 rounded-xl border border-slate-800 bg-slate-950/55 p-5">
        <h2 className="text-xl font-semibold text-white">Suggested improvements</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {report.suggestedImprovements.map((item) => (
            <div key={item} className="rounded-lg border border-slate-800 bg-slate-900/45 p-4 text-sm leading-6 text-slate-300">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-slate-800 bg-slate-950/55 p-5">
        <h2 className="text-xl font-semibold text-white">Better sample answers</h2>
        <div className="mt-4 space-y-4">
          {report.sampleAnswers.map((item) => (
            <div key={item.question} className="rounded-lg border border-slate-800 bg-slate-900/45 p-4">
              <p className="font-medium text-white">{item.question}</p>
              <p className="mt-3 text-sm leading-6 text-slate-400">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-slate-800 bg-slate-950/55 p-5">
        <h2 className="text-xl font-semibold text-white">Interview transcript</h2>
        <div className="mt-4 space-y-4">
          {report.transcript.map((item, index) => (
            <div key={`${item.question}-${index}`} className="rounded-lg border border-slate-800 bg-slate-900/45 p-4">
              <div className="flex items-start justify-between gap-4">
                <p className="font-medium text-white">{item.question}</p>
                <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300">{item.score}%</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-400">{item.answer}</p>
              <p className="mt-3 border-t border-slate-800 pt-3 text-sm leading-6 text-teal-100">{item.evaluation}</p>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}

function ReportList({
  title,
  items,
  tone = "teal",
}: {
  title: string;
  items: string[];
  tone?: "teal" | "rose" | "amber";
}) {
  const toneClass = {
    teal: "border-teal-300/20 text-teal-100",
    rose: "border-rose-300/20 text-rose-100",
    amber: "border-amber-300/20 text-amber-100",
  }[tone];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/55 p-5">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <div key={item} className={`rounded-md border bg-slate-900/35 px-3 py-2 text-sm ${toneClass}`}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
