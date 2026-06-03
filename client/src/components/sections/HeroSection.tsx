export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute left-1/2 top-40 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 pt-20 text-center">
        <p className="mb-4 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300 backdrop-blur">
          AI Mock Interview Platform
        </p>

        <h2 className="max-w-5xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
          Crack Interviews With
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            {" "}
            AI-Powered{" "}
          </span>
          Practice
        </h2>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
          Upload your resume, practice company-specific interviews,
          receive AI-generated feedback, and improve your confidence before
          real interviews.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <button className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:scale-105 hover:bg-cyan-300">
            Start Mock Interview
          </button>

          <button className="rounded-xl border border-slate-700 bg-white/5 px-6 py-3 font-semibold text-slate-200 backdrop-blur transition hover:bg-slate-900">
            View Demo
          </button>
        </div>
      </div>
    </section>
  );
}