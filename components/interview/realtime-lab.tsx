"use client";

import { Radio, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWebRtcRecorder } from "@/hooks/use-webrtc-recorder";

export function RealtimeLab() {
  const recorder = useWebRtcRecorder();

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/55 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Real-time lab</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            WebRTC-ready microphone session controls for future live interview streaming.
          </p>
        </div>
        <span className="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-400">
          {recorder.isRecording ? "Recording" : recorder.isArmed ? "Mic ready" : "Idle"}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        {recorder.isRecording ? (
          <Button type="button" variant="secondary" onClick={recorder.stop}>
            <Square className="h-4 w-4" />
            Stop
          </Button>
        ) : (
          <Button type="button" variant="secondary" onClick={recorder.start} disabled={!recorder.isSupported}>
            <Radio className="h-4 w-4" />
            Arm mic
          </Button>
        )}
      </div>
      {recorder.error && (
        <div className="mt-3 rounded-md border border-amber-300/30 bg-amber-400/10 p-3 text-sm text-amber-100">
          {recorder.error}
        </div>
      )}
    </div>
  );
}
