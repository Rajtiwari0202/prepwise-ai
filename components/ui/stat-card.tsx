import { cn } from "@/lib/utils/cn";

type StatCardProps = {
  label: string;
  value: string;
  detail: string;
  tone?: "teal" | "amber" | "rose";
};

const tones = {
  teal: "border-teal-300/20 text-teal-200",
  amber: "border-amber-300/20 text-amber-200",
  rose: "border-rose-300/20 text-rose-200",
};

export function StatCard({ label, value, detail, tone = "teal" }: StatCardProps) {
  return (
    <div className={cn("rounded-lg border bg-slate-950/45 p-4", tones[tone])}>
      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-400">{detail}</p>
    </div>
  );
}
