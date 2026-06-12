"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ResetPasswordForm({ token }: { token: string }) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setMessage("");
    setError("");
    setIsLoading(true);

    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password: formData.get("password") }),
    });
    const result = await response.json();
    setIsLoading(false);

    if (!response.ok) {
      setError(result.error || "Unable to reset password.");
      return;
    }

    setMessage(result.message);
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <Input label="New password" name="password" type="password" minLength={8} required />
      {message && (
        <div className="rounded-md border border-teal-300/30 bg-teal-400/10 p-3 text-sm text-teal-100">
          {message} <Link className="font-semibold underline" href="/auth/login">Log in</Link>
        </div>
      )}
      {error && <div className="rounded-md border border-rose-300/30 bg-rose-400/10 p-3 text-sm text-rose-100">{error}</div>}
      <Button className="w-full" disabled={isLoading || !token}>
        {isLoading ? "Resetting..." : "Reset password"}
      </Button>
    </form>
  );
}
