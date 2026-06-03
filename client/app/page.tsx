import { Navbar } from "@/src/components/layout/Navbar";
import { HeroSection } from "@/src/components/sections/HeroSection";
import { FeaturesSection } from "@/src/components/sections/FeaturesSection";
import { HowItWorksSection } from "@/src/components/sections/HowItWorksSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
    </main>
  );
}