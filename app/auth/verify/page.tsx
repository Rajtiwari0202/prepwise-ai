import Link from "next/link";
import { VerifyEmailPanel } from "@/components/auth/verify-email-panel";

type PageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function VerifyPage({ searchParams }: PageProps) {
  const { token = "" } = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center px-5 py-10">
      <section className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-950/70 p-6 shadow-2xl shadow-black/30">
        <Link href="/" className="text-sm font-semibold text-teal-200">Prepwise AI</Link>
        <h1 className="mt-6 text-3xl font-semibold text-white">Email verification</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          We are checking your verification link.
        </p>
        <div className="mt-6">
          <VerifyEmailPanel token={token} />
        </div>
      </section>
    </main>
  );
}
