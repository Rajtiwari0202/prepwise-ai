export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="mt-2 text-slate-400">Sign in to continue your interview prep.</p>

        <form className="mt-8 space-y-4">
          <input className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none" placeholder="Email" />
          <input className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none" placeholder="Password" type="password" />

          <button className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950">
            Sign In
          </button>
        </form>
      </div>
    </main>
  );
}