"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ForgotPasswordForm() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setMessage("");
    setError("");
    setIsLoading(true);

    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.get("email") }),
    });
    const result = await response.json();
    setIsLoading(false);

    if (!response.ok) {
      setError(result.error || "Unable to request reset.");
      return;
    }

    setMessage(result.message);
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <Input label="Email" name="email" type="email" placeholder="you@example.com" required />
      {message && <div className="rounded-md border border-teal-300/30 bg-teal-400/10 p-3 text-sm text-teal-100">{message}</div>}
      {error && <div className="rounded-md border border-rose-300/30 bg-rose-400/10 p-3 text-sm text-rose-100">{error}</div>}
      <Button className="w-full" disabled={isLoading}>
        {isLoading ? "Sending..." : "Send reset link"}
      </Button>
    </form>
  );
}
