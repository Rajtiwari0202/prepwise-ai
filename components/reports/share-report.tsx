"use client";

import { useState } from "react";
import { Copy, Link2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

type ShareReportProps = {
  reportId: string;
  initialShareId?: string;
  initialIsPublic?: boolean;
};

export function ShareReport({ reportId, initialShareId, initialIsPublic }: ShareReportProps) {
  const [shareId, setShareId] = useState(initialShareId || "");
  const [isPublic, setIsPublic] = useState(Boolean(initialIsPublic && initialShareId));
  const [message, setMessage] = useState("");
  const [origin] = useState(() => (typeof window === "undefined" ? "" : window.location.origin));
  const shareUrl = shareId && origin ? `${origin}/share/${shareId}` : "";

  async function enableShare() {
    setMessage("");
    const response = await fetch(`/api/reports/${reportId}/share`, { method: "POST" });
    const result = await response.json();

    if (response.ok) {
      setShareId(result.publicShareId);
      setIsPublic(true);
      setMessage("Public report link is ready.");
    } else {
      setMessage(result.error || "Unable to create share link.");
    }
  }

  async function disableShare() {
    setMessage("");
    await fetch(`/api/reports/${reportId}/share`, { method: "DELETE" });
    setIsPublic(false);
    setMessage("Public report link disabled.");
  }

  async function copyLink() {
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl);
      setMessage("Link copied.");
    }
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/55 p-5">
      <h2 className="text-lg font-semibold text-white">Public report link</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Share a read-only report with mentors, recruiters, or friends.
      </p>
      {isPublic && shareUrl && (
        <div className="mt-4 rounded-md border border-slate-800 bg-slate-900/50 p-3 text-sm text-slate-300">
          {shareUrl}
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-3">
        {isPublic ? (
          <>
            <Button type="button" onClick={copyLink}>
              <Copy className="h-4 w-4" />
              Copy link
            </Button>
            <Button type="button" variant="secondary" onClick={disableShare}>
              <Lock className="h-4 w-4" />
              Disable
            </Button>
          </>
        ) : (
          <Button type="button" onClick={enableShare}>
            <Link2 className="h-4 w-4" />
            Create public link
          </Button>
        )}
      </div>
      {message && <p className="mt-3 text-sm text-slate-400">{message}</p>}
    </div>
  );
}
