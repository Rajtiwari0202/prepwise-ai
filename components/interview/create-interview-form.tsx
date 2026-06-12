"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { interviewDifficulties, interviewModes, interviewRoles } from "@/data/interview-options";

export function CreateInterviewForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setError("");
    setIsLoading(true);

    const response = await fetch("/api/interviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: formData.get("mode"),
        role: formData.get("role"),
        difficulty: formData.get("difficulty"),
      }),
    });

    const result = await response.json();
    setIsLoading(false);

    if (!response.ok) {
      setError(result.error || "Unable to create interview.");
      return;
    }

    router.push(`/interview/${result.interview.id}`);
    router.refresh();
  }

  return (
    <form action={onSubmit} className="rounded-xl border border-slate-800 bg-slate-950/55 p-5">
      <div className="grid gap-5 md:grid-cols-3">
        <Select
          label="Interview mode"
          name="mode"
          options={interviewModes.map((mode) => ({ value: mode.value, label: mode.label }))}
        />
        <Select label="Target role" name="role" options={interviewRoles.map((role) => ({ value: role, label: role }))} />
        <Select
          label="Difficulty"
          name="difficulty"
          defaultValue="intermediate"
          options={interviewDifficulties}
        />
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-4">
        {interviewModes.map((mode) => (
          <div key={mode.value} className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
            <p className="font-semibold text-white">{mode.label}</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">{mode.description}</p>
          </div>
        ))}
      </div>

      {error && <div className="mt-5 rounded-md border border-rose-300/30 bg-rose-400/10 p-3 text-sm text-rose-100">{error}</div>}

      <div className="mt-6 flex justify-end">
        <Button disabled={isLoading}>
          {isLoading ? "Preparing interviewer..." : "Launch room"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
