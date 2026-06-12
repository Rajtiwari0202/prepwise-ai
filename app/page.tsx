import { ArrowRight, AudioLines, BrainCircuit, FileText, LineChart, ShieldCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";

const capabilities = [
  {
    icon: BrainCircuit,
    title: "Adaptive AI interviewer",
    copy: "Question paths respond to mode, role, difficulty, resume signals, and previous answers.",
  },
  {
    icon: AudioLines,
    title: "Voice-first practice",
    copy: "Browser-native speech input and output today, with a clean boundary for WebRTC tomorrow.",
  },
  {
    icon: LineChart,
    title: "Weakness analysis",
    copy: "Reports surface missed concepts, communication gaps, confidence signals, and revision topics.",
  },
  {
    icon: FileText,
    title: "Resume-aware sessions",
    copy: "Upload profile context and generate role-specific questions grounded in the candidate story.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <section className="career-grid relative border-b border-slate-800/80">
        <div className="mx-auto flex min-h-[92vh] max-w-7xl flex-col px-6 py-6 lg:px-8">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md border border-teal-300/30 bg-teal-300/10">
                <ShieldCheck className="h-5 w-5 text-teal-200" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">InterviewAI Lab</p>
                <p className="text-xs text-slate-500">Open-source career cockpit</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ButtonLink href="/auth/login" variant="ghost">
                Log in
              </ButtonLink>
              <ButtonLink href="/auth/register" variant="secondary">
                Create account
              </ButtonLink>
            </div>
          </nav>

          <div className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-[0.96fr_1.04fr]">
            <div>
              <div className="mb-6 inline-flex rounded-md border border-teal-300/20 bg-teal-300/10 px-3 py-2 text-sm text-teal-100">
                DSA, HR, resume-based, and mixed interview simulations
              </div>
              <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] text-white md:text-7xl">
                Practice interviews like you are already in the final round.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                A production-grade simulator that asks sharper questions, listens to spoken answers,
                evaluates signals, and turns every session into a focused revision plan.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/auth/register">
                  Start a mock interview <ArrowRight className="h-4 w-4" />
                </ButtonLink>
                <ButtonLink href="/dashboard" variant="secondary">
                  View dashboard
                </ButtonLink>
              </div>
            </div>

            <div className="rounded-xl border border-slate-700/70 bg-slate-950/70 p-4 shadow-2xl shadow-black/30 backdrop-blur">
              <div className="rounded-lg border border-slate-800 bg-[#0b1018] p-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <p className="text-sm font-semibold text-white">Live interview room</p>
                    <p className="text-xs text-slate-500">Backend SDE Intern • Medium • Question 3/7</p>
                  </div>
                  <span className="rounded-md bg-rose-400/10 px-2.5 py-1 text-xs font-semibold text-rose-200">
                    Recording voice
                  </span>
                </div>
                <div className="mt-5 rounded-lg border border-teal-300/20 bg-teal-300/5 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-teal-200">Interviewer</p>
                  <p className="mt-3 text-lg leading-7 text-white">
                    Walk me through how you would design a rate limiter for a public API. What data
                    structure would you use and why?
                  </p>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <StatCard label="Technical" value="82" detail="Strong trade-off framing" />
                  <StatCard label="Clarity" value="76" detail="Tighten examples" tone="amber" />
                  <StatCard label="Confidence" value="69" detail="Reduce filler words" tone="rose" />
                </div>
                <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900/60 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Weakness radar</p>
                  <div className="mt-4 space-y-3">
                    {["Token bucket edge cases", "Concurrency under burst traffic", "Communication structure"].map(
                      (item, index) => (
                        <div key={item}>
                          <div className="mb-1 flex justify-between text-sm">
                            <span className="text-slate-300">{item}</span>
                            <span className="text-slate-500">{72 - index * 14}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-800">
                            <div
                              className="h-2 rounded-full bg-teal-300"
                              style={{ width: `${72 - index * 14}%` }}
                            />
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-6 py-16 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {capabilities.map((capability) => (
          <div key={capability.title} className="rounded-lg border border-slate-800 bg-slate-950/55 p-5">
            <capability.icon className="h-5 w-5 text-teal-200" />
            <h2 className="mt-5 text-lg font-semibold text-white">{capability.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">{capability.copy}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
