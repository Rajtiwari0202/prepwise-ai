"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ResumeUpload() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function upload() {
    const file = fileRef.current?.files?.[0];

    if (!file) {
      setError("Choose a TXT, PDF, or DOCX resume first.");
      return;
    }

    setError("");
    setMessage("");
    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/profile/resume/parse", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    setIsLoading(false);

    if (!response.ok) {
      setError(result.error || "Unable to parse resume.");
      return;
    }

    setMessage("Resume parsed and saved to your profile.");
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/55 p-5">
      <h2 className="text-lg font-semibold text-white">Resume upload</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Upload TXT, PDF, or DOCX. The extracted text is saved into your resume context.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          ref={fileRef}
          type="file"
          accept=".txt,.pdf,.docx,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="w-full rounded-md border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-slate-800 file:px-3 file:py-1.5 file:text-slate-200"
        />
        <Button type="button" onClick={upload} disabled={isLoading} className="shrink-0">
          <Upload className="h-4 w-4" />
          {isLoading ? "Parsing..." : "Parse resume"}
        </Button>
      </div>
      {message && <div className="mt-3 rounded-md border border-teal-300/30 bg-teal-400/10 p-3 text-sm text-teal-100">{message}</div>}
      {error && <div className="mt-3 rounded-md border border-rose-300/30 bg-rose-400/10 p-3 text-sm text-rose-100">{error}</div>}
    </div>
  );
}
