import Image from "next/image";
import { HeroVideo } from "@/components/HeroVideo";
import { NavLinks } from "@/components/NavLinks";
import { SoundToggle } from "@/components/SoundToggle";
import { LiveClock } from "@/components/LiveClock";
import { Footer } from "@/components/Footer";

export default function LandingPage() {
  return (
    <main className="w-full">
      <section className="relative h-screen w-full overflow-hidden">
        <HeroVideo />
        <div className="pointer-events-none absolute inset-0 bg-black/50" />

        <div className="absolute right-6 top-6 z-10">
          <SoundToggle />
        </div>

        <div className="pointer-events-none relative z-10 flex h-full flex-col items-center justify-center gap-8 px-6">
          <Image src="/logo.png" alt="Logo" width={220} height={80} priority className="h-auto w-[180px] sm:w-[220px]" />
          <NavLinks />
        </div>

        <div className="absolute bottom-6 left-6 z-10">
          <LiveClock />
        </div>
      </section>

      <Footer />
    </main>
  );
}