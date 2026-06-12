import { notFound } from "next/navigation";
import { ScorePanel } from "@/components/reports/score-panel";
import { connectToDatabase } from "@/lib/db/mongoose";
import { FeedbackReportModel } from "@/models/FeedbackReport";
import { InterviewModel } from "@/models/Interview";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function PublicReportPage({ params }: PageProps) {
  const { id } = await params;
  await connectToDatabase();

  const report = await FeedbackReportModel.findOne({ publicShareId: id, isPublic: true }).lean();

  if (!report) {
    notFound();
  }

  const interview = await InterviewModel.findById(report.interviewId).lean();

  return (
    <main className="min-h-screen px-5 py-10">
      <section className="mx-auto max-w-6xl">
        <p className="text-sm uppercase tracking-[0.22em] text-teal-200">Shared Prepwise report</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">
          {interview?.role || "Interview"} readiness analysis
        </h1>
        <p className="mt-3 text-slate-400">
          Read-only interview feedback shared by the candidate.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <ScorePanel label="Overall" score={report.overallScore} detail="Weighted readiness." />
          <ScorePanel label="Communication" score={report.communicationScore} detail="Clarity and structure." />
          <ScorePanel label="Technical" score={report.technicalScore} detail="Concept depth." />
          <ScorePanel label="Confidence" score={report.confidenceScore} detail="Answer control." />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <PublicList title="Strengths" items={report.strengths} />
          <PublicList title="Weaknesses" items={report.weaknesses} />
          <PublicList title="Recommended revision" items={report.recommendedTopics} />
          <PublicList title="Missed concepts" items={report.missedConcepts} />
        </div>
      </section>
    </main>
  );
}

function PublicList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/55 p-5">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <div key={item} className="rounded-md border border-slate-800 bg-slate-900/35 px-3 py-2 text-sm text-slate-300">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
