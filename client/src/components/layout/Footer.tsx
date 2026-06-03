export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-10 text-center md:flex-row md:text-left">
        
        <div>
          <h2 className="text-2xl font-bold">
            PrepWise<span className="text-cyan-400"> AI</span>
          </h2>

          <p className="mt-2 max-w-md text-sm text-slate-400">
            AI-powered mock interviews, resume analysis, and personalized
            interview preparation for modern candidates.
          </p>
        </div>

        <div className="flex gap-6 text-sm text-slate-400">
          <a href="#" className="hover:text-white">
            Features
          </a>

          <a href="#" className="hover:text-white">
            Dashboard
          </a>

          <a href="#" className="hover:text-white">
            GitHub
          </a>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-sm text-slate-500">
        © 2026 PrepWise AI. Built with Next.js, Tailwind, and AI.
      </div>
    </footer>
  );
}