export default function Loading() {
  return (
    <main className="grid min-h-screen place-items-center px-5">
      <div className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-950/70 p-5">
        <div className="h-2 w-24 rounded-full bg-teal-300/60" />
        <div className="mt-5 space-y-3">
          <div className="h-4 rounded bg-slate-800" />
          <div className="h-4 w-5/6 rounded bg-slate-800" />
          <div className="h-4 w-2/3 rounded bg-slate-800" />
        </div>
      </div>
    </main>
  );
}
