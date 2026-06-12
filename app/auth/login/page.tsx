import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center px-5 py-10">
      <section className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-950/70 p-6 shadow-2xl shadow-black/30">
        <Link href="/" className="text-sm font-semibold text-teal-200">
          InterviewAI Lab
        </Link>
        <h1 className="mt-6 text-3xl font-semibold text-white">Welcome back.</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Pick up your practice history, reports, and role-specific interview prep.
        </p>
        <div className="mt-6">
          <AuthForm mode="login" />
        </div>
      </section>
    </main>
  );
}
