type ScorePanelProps = {
  label: string;
  score: number;
  detail: string;
};

export function ScorePanel({ label, score, detail }: ScorePanelProps) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/55 p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white">{label}</p>
        <span className="rounded-md bg-teal-300/10 px-2 py-1 text-xs font-semibold text-teal-100">{score}%</span>
      </div>
      <div className="mt-4 h-2 rounded-full bg-slate-800">
        <div className="h-2 rounded-full bg-teal-300" style={{ width: `${score}%` }} />
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-500">{detail}</p>
    </div>
  );
}
