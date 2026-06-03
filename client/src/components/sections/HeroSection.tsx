export function HeroSection() {
  return (
    <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 pt-20 text-center">
      <p className="mb-4 rounded-full border border-cyan-400/30 px-4 py-2 text-sm text-cyan-300">
        AI Mock Interview Platform
      </p>

      <h2 className="max-w-4xl text-5xl font-bold tracking-tight md:text-7xl">
        Practice interviews like you are already in the room.
      </h2>

      <p className="mt-6 max-w-2xl text-lg text-slate-300">
        Upload your resume, choose a role, answer AI-generated questions,
        and receive detailed feedback to improve your interview performance.
      </p>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <button className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-300">
          Start Mock Interview
        </button>

        <button className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-200 hover:bg-slate-900">
          View Demo
        </button>
      </div>
    </section>
  );
}