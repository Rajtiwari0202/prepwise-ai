"use client";

import { useEffect, useState } from "react";

export function useSpeechSynthesis() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    setIsSupported("speechSynthesis" in window);
  }, []);

  function speak(text: string) {
    if (!isSupported) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.96;
    utterance.pitch = 0.92;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }

  function stop() {
    if (!isSupported) {
      return;
    }

    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }

  return { isSupported, isSpeaking, speak, stop };
}
