import Link from "next/link";
import { BarChart3, FileText, History, LayoutDashboard, Mic2 } from "lucide-react";
import type { ReactNode } from "react";
import { LogoutButton } from "@/components/layout/logout-button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/interview/new", label: "New interview", icon: Mic2 },
  { href: "/history", label: "History", icon: History },
  { href: "/profile", label: "Resume profile", icon: FileText },
];

export function AppShell({
  children,
  user,
}: {
  children: ReactNode;
  user: { name: string; email: string };
}) {
  return (
    <div className="min-h-screen bg-slate-950/30">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-800 bg-slate-950/80 p-5 backdrop-blur lg:block">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-teal-300/30 bg-teal-300/10">
            <BarChart3 className="h-5 w-5 text-teal-200" />
          </div>
          <div>
            <p className="font-semibold text-white">InterviewAI Lab</p>
            <p className="text-xs text-slate-500">Career cockpit</p>
          </div>
        </Link>
        <nav className="mt-8 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-900 hover:text-white"
            >
              <item.icon className="h-4 w-4 text-slate-500" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-5 left-5 right-5">
          <div className="mb-4 rounded-lg border border-slate-800 bg-slate-900/50 p-3">
            <p className="text-sm font-semibold text-white">{user.name}</p>
            <p className="truncate text-xs text-slate-500">{user.email}</p>
          </div>
          <LogoutButton />
        </div>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/80 px-5 py-4 backdrop-blur lg:hidden">
          <Link href="/dashboard" className="font-semibold text-white">
            InterviewAI Lab
          </Link>
        </header>
        <main className="mx-auto max-w-6xl px-5 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
