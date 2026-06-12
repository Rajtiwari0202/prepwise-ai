import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-5">
      <section className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-950/70 p-6 text-center">
        <p className="text-sm uppercase tracking-[0.22em] text-teal-200">404</p>
        <h1 className="mt-4 text-3xl font-semibold text-white">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          This route is not part of the interview cockpit.
        </p>
        <div className="mt-6">
          <ButtonLink href="/dashboard">Back to dashboard</ButtonLink>
        </div>
      </section>
    </main>
  );
}
