import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <main className="grid min-h-screen place-items-center px-5 py-10">
      <section className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-950/70 p-6 shadow-2xl shadow-black/30">
        <Link href="/" className="text-sm font-semibold text-teal-200">Prepwise AI</Link>
        <h1 className="mt-6 text-3xl font-semibold text-white">Reset your password</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Enter your account email and we will send a reset link if the account exists.
        </p>
        <div className="mt-6">
          <ForgotPasswordForm />
        </div>
      </section>
    </main>
  );
}
