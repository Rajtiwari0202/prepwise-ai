"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setError("");
    setIsLoading(true);

    const payload =
      mode === "register"
        ? {
            name: String(formData.get("name") || ""),
            email: String(formData.get("email") || ""),
            password: String(formData.get("password") || ""),
          }
        : {
            email: String(formData.get("email") || ""),
            password: String(formData.get("password") || ""),
          };

    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    setIsLoading(false);

    if (!response.ok) {
      setError(result.error || "Something went wrong.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form action={onSubmit} className="space-y-4">
      {mode === "register" && <Input label="Full name" name="name" placeholder="Raj Tiwari" required />}
      <Input label="Email" name="email" type="email" placeholder="you@example.com" required />
      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="At least 8 characters"
        minLength={mode === "register" ? 8 : undefined}
        required
      />
      {error && <div className="rounded-md border border-rose-300/30 bg-rose-400/10 p-3 text-sm text-rose-100">{error}</div>}
      <Button className="w-full" disabled={isLoading}>
        {isLoading ? "Working..." : mode === "register" ? "Create cockpit" : "Enter cockpit"}
        <ArrowRight className="h-4 w-4" />
      </Button>
      <p className="text-center text-sm text-slate-500">
        {mode === "register" ? "Already have an account?" : "New to InterviewAI Lab?"}{" "}
        <Link className="font-medium text-teal-200" href={mode === "register" ? "/auth/login" : "/auth/register"}>
          {mode === "register" ? "Log in" : "Create account"}
        </Link>
      </p>
      {mode === "login" && (
        <p className="text-center text-sm">
          <Link className="font-medium text-slate-400 hover:text-teal-200" href="/auth/forgot-password">
            Forgot password?
          </Link>
        </p>
      )}
    </form>
  );
}
