"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/button";

export function VerifyEmailPanel({ token }: { token: string }) {
  const [status, setStatus] = useState(token ? "Verifying your email..." : "Verification token is missing.");

  useEffect(() => {
    async function verify() {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const result = await response.json();
      setStatus(response.ok ? result.message : result.error || "Unable to verify email.");
    }

    if (!token) {
      return;
    }

    verify();
  }, [token]);

  return (
    <div className="space-y-5">
      <div className="rounded-md border border-slate-800 bg-slate-900/50 p-4 text-sm text-slate-200">
        {status}
      </div>
      <ButtonLink href="/dashboard">Go to dashboard</ButtonLink>
      <p className="text-sm text-slate-500">
        Need to sign in again? <Link className="text-teal-200" href="/auth/login">Log in</Link>
      </p>
    </div>
  );
}
