const features = [
  {
    title: "AI Interview Questions",
    description:
      "Generate realistic interview questions tailored to your role and company.",
  },
  {
    title: "Resume-Based Interviews",
    description:
      "Upload your resume and receive personalized technical and HR questions.",
  },
  {
    title: "Instant AI Feedback",
    description:
      "Get performance analysis, strengths, weaknesses, and improvement tips.",
  },
  {
    title: "Voice & Coding Rounds",
    description:
      "Practice speaking rounds and solve coding challenges in real time.",
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="mx-auto max-w-6xl px-6 py-24"
    >
      <div className="mb-14 text-center">
        <p className="text-cyan-400">FEATURES</p>

        <h2 className="mt-3 text-4xl font-bold">
          Everything needed to crack interviews
        </h2>

        <p className="mt-4 text-slate-400">
          Built like a modern AI-powered interview preparation platform.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur"
          >
            <h3 className="text-2xl font-semibold">
              {feature.title}
            </h3>

            <p className="mt-4 text-slate-400">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}