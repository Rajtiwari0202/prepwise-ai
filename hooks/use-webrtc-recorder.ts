"use client";

import { useRef, useState } from "react";

export function useWebRtcRecorder() {
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const [isSupported] = useState(() => typeof window !== "undefined" && "MediaRecorder" in window);
  const [isArmed, setIsArmed] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState("");

  async function arm() {
    setError("");

    if (!isSupported) {
      setError("Your browser does not support MediaRecorder. Use Chrome or Edge for real-time practice.");
      return;
    }

    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsArmed(true);
    } catch {
      setError("Microphone permission was blocked. Allow microphone access and try again.");
    }
  }

  async function start() {
    if (!streamRef.current) {
      await arm();
    }

    if (!streamRef.current) {
      return;
    }

    const recorder = new MediaRecorder(streamRef.current);
    recorderRef.current = recorder;
    recorder.start();
    setIsRecording(true);
    recorder.onstop = () => setIsRecording(false);
  }

  function stop() {
    recorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setIsArmed(false);
    setIsRecording(false);
  }

  return { isSupported, isArmed, isRecording, error, arm, start, stop };
}
