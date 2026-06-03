const steps = [
  {
    number: "01",
    title: "Upload Resume",
    description:
      "Upload your resume to personalize interview questions based on your skills and experience.",
  },
  {
    number: "02",
    title: "Choose Role",
    description:
      "Select company, job role, interview difficulty, and interview category.",
  },
  {
    number: "03",
    title: "Practice Interview",
    description:
      "Answer AI-generated technical and HR questions through text or voice.",
  },
  {
    number: "04",
    title: "Receive Feedback",
    description:
      "Get AI evaluation, performance analysis, strengths, weaknesses, and improvement suggestions.",
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="mx-auto max-w-6xl px-6 py-24"
    >
      <div className="mb-14 text-center">
        <p className="text-cyan-400">HOW IT WORKS</p>

        <h2 className="mt-3 text-4xl font-bold">
          Simple process. Serious preparation.
        </h2>

        <p className="mt-4 text-slate-400">
          Practice interviews in minutes with AI-powered guidance.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {steps.map((step) => (
          <div
            key={step.number}
            className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur"
          >
            <p className="text-5xl font-black text-cyan-400/40">
              {step.number}
            </p>

            <h3 className="mt-4 text-2xl font-semibold">
              {step.title}
            </h3>

            <p className="mt-4 text-slate-400">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}