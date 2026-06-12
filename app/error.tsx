"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center px-5">
      <section className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-950/70 p-6 text-center">
        <p className="text-sm uppercase tracking-[0.22em] text-rose-200">Runtime error</p>
        <h1 className="mt-4 text-3xl font-semibold text-white">Something needs another pass</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          The app hit an unexpected state. You can retry the view or return to the dashboard.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button type="button" onClick={reset}>
            Try again
          </Button>
          <ButtonLink href="/dashboard" variant="secondary">
            Dashboard
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
