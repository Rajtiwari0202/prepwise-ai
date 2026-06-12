import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

const variants = {
  primary: "bg-teal-300 text-slate-950 hover:bg-teal-200",
  secondary: "border border-slate-700 bg-slate-900/70 text-slate-100 hover:border-slate-500",
  ghost: "text-slate-300 hover:bg-slate-800/80 hover:text-white",
};

type BaseProps = {
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
};

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ children, variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-teal-300/60 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

type ButtonLinkProps = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

export function ButtonLink({ children, variant = "primary", className, href, ...props }: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-teal-300/60",
        variants[variant],
        className,
      )}
      href={href}
      {...props}
    >
      {children}
    </Link>
  );
}
