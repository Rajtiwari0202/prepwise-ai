import { Navbar } from "@/src/components/layout/Navbar";
import { HeroSection } from "@/src/components/sections/HeroSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <HeroSection />
    </main>
  );
}