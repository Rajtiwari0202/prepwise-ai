"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

type ProfileFormProps = {
  profile: {
    targetRole: string;
    experienceLevel: string;
    skills: string[];
    resumeText: string;
  };
};

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setError("");
    setSaved(false);
    setIsLoading(true);

    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targetRole: formData.get("targetRole"),
        experienceLevel: formData.get("experienceLevel"),
        skills: String(formData.get("skills") || "")
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        resumeText: formData.get("resumeText"),
      }),
    });

    const result = await response.json();
    setIsLoading(false);

    if (!response.ok) {
      setError(result.error || "Unable to save profile.");
      return;
    }

    setSaved(true);
    router.refresh();
  }

  return (
    <form action={onSubmit} className="space-y-5 rounded-xl border border-slate-800 bg-slate-950/55 p-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Input label="Target role" name="targetRole" defaultValue={profile.targetRole} required />
        <Input label="Experience level" name="experienceLevel" defaultValue={profile.experienceLevel} required />
      </div>
      <Input
        label="Skills"
        name="skills"
        helper="Comma-separated: React, Node.js, MongoDB, DSA"
        defaultValue={profile.skills.join(", ")}
      />
      <Textarea
        label="Resume text"
        name="resumeText"
        helper="Paste your resume or project notes. This stays in your database and helps resume-based interviews."
        defaultValue={profile.resumeText}
        rows={12}
      />
      {error && <div className="rounded-md border border-rose-300/30 bg-rose-400/10 p-3 text-sm text-rose-100">{error}</div>}
      {saved && <div className="rounded-md border border-teal-300/30 bg-teal-400/10 p-3 text-sm text-teal-100">Profile saved.</div>}
      <Button disabled={isLoading}>
        <Save className="h-4 w-4" />
        {isLoading ? "Saving..." : "Save profile"}
      </Button>
    </form>
  );
}
