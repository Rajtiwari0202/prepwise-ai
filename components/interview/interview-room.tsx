"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Mic, MicOff, Send, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";

type InterviewRoomProps = {
  interview: {
    id: string;
    mode: string;
    role: string;
    difficulty: string;
    status: string;
    currentQuestionIndex: number;
  };
  questions: Array<{
    id: string;
    text: string;
    topic: string;
    type: string;
    expectedSignals: string[];
    order: number;
  }>;
  answers: Array<{
    id: string;
    questionId: string;
    text: string;
    evaluation: string;
    score: number;
    strengths: string[];
    improvements: string[];
  }>;
  reportId?: string | null;
};

export function InterviewRoom({ interview, questions, answers, reportId }: InterviewRoomProps) {
  const router = useRouter();
  const speech = useSpeechRecognition();
  const voice = useSpeechSynthesis();
  const [answerText, setAnswerText] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [localAnswers, setLocalAnswers] = useState(answers);
  const [followUp, setFollowUp] = useState("");

  const answeredIds = useMemo(() => new Set(localAnswers.map((answer) => answer.questionId)), [localAnswers]);
  const currentQuestion = questions.find((question) => !answeredIds.has(question.id)) || questions[questions.length - 1];
  const progress = Math.round((localAnswers.length / Math.max(questions.length, 1)) * 100);

  function useVoiceTranscript() {
    setAnswerText(speech.transcript);
  }

  async function submitAnswer() {
    if (!currentQuestion) {
      return;
    }

    setError("");
    setIsSubmitting(true);

    const response = await fetch(`/api/interviews/${interview.id}/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionId: currentQuestion.id,
        text: answerText,
        transcriptSource: speech.transcript && speech.transcript === answerText ? "voice" : "text",
      }),
    });

    const result = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setError(result.error || "Unable to submit answer.");
      return;
    }

    setLocalAnswers((items) => [...items, result.answer]);
    setFollowUp(result.evaluation.followUpQuestion || "");
    setAnswerText("");
    speech.reset();
    router.refresh();
  }

  async function complete() {
    setError("");
    setIsCompleting(true);

    const response = await fetch(`/api/interviews/${interview.id}/complete`, {
      method: "POST",
    });

    const result = await response.json();
    setIsCompleting(false);

    if (!response.ok) {
      setError(result.error || "Unable to complete interview.");
      return;
    }

    router.push(`/reports/${result.report.id}`);
  }

  if (!currentQuestion) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-950/55 p-6">
        <h2 className="text-2xl font-semibold text-white">Question path is empty</h2>
        <p className="mt-2 text-slate-400">Create a new interview to generate questions.</p>
      </div>
    );
  }

  const isDone = localAnswers.length >= questions.length;

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
      <section className="rounded-xl border border-slate-800 bg-slate-950/55 p-5">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-5 md:flex-row md:items-start">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-teal-200">Live interview room</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">{interview.role}</h1>
            <p className="mt-2 text-sm text-slate-500">
              {interview.mode.toUpperCase()} • {interview.difficulty} • {localAnswers.length}/{questions.length} answered
            </p>
          </div>
          <div className="w-full max-w-xs">
            <div className="mb-2 flex justify-between text-xs text-slate-500">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-800">
              <div className="h-2 rounded-full bg-teal-300 transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-teal-300/20 bg-teal-300/5 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-teal-200">
                Question {Math.min(localAnswers.length + 1, questions.length)}
              </p>
              <p className="mt-3 text-xl leading-8 text-white">{currentQuestion.text}</p>
            </div>
            <Button
              variant="secondary"
              type="button"
              onClick={() => (voice.isSpeaking ? voice.stop() : voice.speak(currentQuestion.text))}
              disabled={!voice.isSupported}
              title="Read question aloud"
            >
              {voice.isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {currentQuestion.expectedSignals.map((signal) => (
              <span key={signal} className="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-400">
                {signal}
              </span>
            ))}
          </div>
        </div>

        {followUp && (
          <div className="mt-4 rounded-lg border border-amber-300/20 bg-amber-300/5 p-4 text-sm text-amber-100">
            Follow-up prompt: {followUp}
          </div>
        )}

        <div className="mt-5">
          <Textarea
            label="Your answer"
            value={answerText}
            onChange={(event) => setAnswerText(event.target.value)}
            placeholder="Answer like you would in a real interview. State assumptions, reason through trade-offs, and close with complexity or impact."
            rows={8}
          />
          {speech.isSupported && speech.transcript && (
            <div className="mt-3 rounded-md border border-slate-800 bg-slate-900/50 p-3 text-sm text-slate-300">
              Voice transcript ready. Review it before submitting.
            </div>
          )}
          {error && <div className="mt-3 rounded-md border border-rose-300/30 bg-rose-400/10 p-3 text-sm text-rose-100">{error}</div>}
          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={speech.isListening ? speech.stop : speech.start}
              disabled={!speech.isSupported}
              title={speech.isSupported ? "Toggle voice input" : "Speech recognition is not supported in this browser"}
            >
              {speech.isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              {speech.isListening ? "Stop voice" : "Voice answer"}
            </Button>
            {speech.transcript && (
              <Button type="button" variant="secondary" onClick={useVoiceTranscript}>
                Use transcript
              </Button>
            )}
            <Button type="button" onClick={submitAnswer} disabled={isSubmitting || isDone || answerText.trim().length < 8}>
              <Send className="h-4 w-4" />
              {isSubmitting ? "Evaluating..." : "Submit answer"}
            </Button>
            <Button type="button" variant="secondary" onClick={complete} disabled={isCompleting || localAnswers.length === 0}>
              <CheckCircle2 className="h-4 w-4" />
              {isCompleting ? "Building report..." : isDone ? "Generate report" : "End early"}
            </Button>
            {reportId && (
              <Button type="button" variant="secondary" onClick={() => router.push(`/reports/${reportId}`)}>
                Open report
              </Button>
            )}
          </div>
        </div>
      </section>

      <aside className="rounded-xl border border-slate-800 bg-slate-950/55 p-5">
        <h2 className="text-lg font-semibold text-white">Answer log</h2>
        <div className="mt-4 space-y-4">
          {localAnswers.length === 0 ? (
            <p className="text-sm leading-6 text-slate-500">Your evaluated answers will appear here after each submission.</p>
          ) : (
            localAnswers.map((answer, index) => (
              <div key={answer.id} className="rounded-lg border border-slate-800 bg-slate-900/45 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-white">Answer {index + 1}</p>
                  <span className="rounded-md bg-teal-300/10 px-2 py-1 text-xs font-semibold text-teal-100">
                    {answer.score}%
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-400">{answer.evaluation}</p>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}
