import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type FieldProps = {
  label: string;
  helper?: string;
  error?: string;
};

export function Input({
  label,
  helper,
  error,
  className,
  ...props
}: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-200">{label}</span>
      <input
        className={cn(
          "mt-2 h-11 w-full rounded-md border border-slate-700 bg-slate-950/70 px-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-teal-300",
          error && "border-rose-300",
          className,
        )}
        {...props}
      />
      {(helper || error) && <span className="mt-1 block text-xs text-slate-500">{error || helper}</span>}
    </label>
  );
}

export function Textarea({
  label,
  helper,
  error,
  className,
  ...props
}: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-200">{label}</span>
      <textarea
        className={cn(
          "mt-2 min-h-32 w-full resize-y rounded-md border border-slate-700 bg-slate-950/70 px-3 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-teal-300",
          error && "border-rose-300",
          className,
        )}
        {...props}
      />
      {(helper || error) && <span className="mt-1 block text-xs text-slate-500">{error || helper}</span>}
    </label>
  );
}
