"use client";

import { useEffect, useRef, useState } from "react";

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

export function useSpeechRecognition() {
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const [isSupported] = useState(
    () =>
      typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window),
  );
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const win = window as typeof window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const Recognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!Recognition) {
      return;
    }

    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      const text = Array.from(event.results)
        .map((result) => result[0]?.transcript || "")
        .join(" ");
      setTranscript(text);
      setError("");
    };
    recognition.onerror = (event) => {
      setIsListening(false);

      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setError("Microphone permission was blocked. Allow microphone access in the browser and try again.");
        return;
      }

      if (event.error === "no-speech") {
        setError("No speech was detected. Try again in a quieter place or answer with text.");
        return;
      }

      setError("Voice input stopped. Try Chrome or Edge with microphone permission enabled.");
    };
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
  }, []);

  function start() {
    setError("");

    try {
      recognitionRef.current?.start();
      setIsListening(true);
    } catch {
      setIsListening(false);
      setError("Voice input could not start. Refresh the page and try again, or answer with text.");
    }
  }

  function stop() {
    recognitionRef.current?.stop();
    setIsListening(false);
  }

  function reset() {
    setTranscript("");
  }

  return { isSupported, isListening, transcript, error, start, stop, reset, setTranscript };
}
