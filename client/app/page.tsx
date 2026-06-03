import { Footer } from "@/src/components/layout/Footer";
import { Navbar } from "@/src/components/layout/Navbar";
import { FeaturesSection } from "@/src/components/sections/FeaturesSection";
import { HeroSection } from "@/src/components/sections/HeroSection";
import { HowItWorksSection } from "@/src/components/sections/HowItWorksSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <Footer />
    </main>
  );
}