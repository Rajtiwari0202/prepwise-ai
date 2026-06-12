"use client";

import Link from "next/link";
import { FileText, History, LayoutDashboard, Mic2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/interview/new", label: "Practice", icon: Mic2 },
  { href: "/history", label: "History", icon: History },
  { href: "/profile", label: "Profile", icon: FileText },
];

function isActive(pathname: string, href: string) {
  if (href === "/interview/new") {
    return pathname.startsWith("/interview");
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav className="mt-8 space-y-1">
      {navItems.map((item) => {
        const active = isActive(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-slate-900 hover:text-white",
              active && "border border-teal-300/20 bg-teal-300/10 text-white",
            )}
          >
            <item.icon className={cn("h-4 w-4 text-slate-500", active && "text-teal-200")} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-4 rounded-lg border border-slate-800 bg-slate-950/95 p-1 shadow-2xl shadow-black/40 backdrop-blur lg:hidden">
      {navItems.map((item) => {
        const active = isActive(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex min-h-14 flex-col items-center justify-center gap-1 rounded-md text-[11px] font-medium text-slate-500 transition",
              active ? "bg-teal-300/10 text-teal-100" : "hover:bg-slate-900 hover:text-slate-200",
            )}
          >
            <item.icon className={cn("h-4 w-4", active ? "text-teal-200" : "text-slate-500")} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
