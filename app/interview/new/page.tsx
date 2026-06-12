import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { CreateInterviewForm } from "@/components/interview/create-interview-form";
import { getCurrentUser } from "@/lib/auth/require-user";

export default async function NewInterviewPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <AppShell user={user}>
      <p className="text-sm uppercase tracking-[0.22em] text-teal-200">Create interview</p>
      <h1 className="mt-3 text-4xl font-semibold text-white">Configure the next simulation</h1>
      <p className="mt-3 max-w-2xl text-slate-400">
        Choose the mode, target role, and difficulty. The interviewer will generate a focused question path.
      </p>
      <div className="mt-8">
        <CreateInterviewForm />
      </div>
    </AppShell>
  );
}
