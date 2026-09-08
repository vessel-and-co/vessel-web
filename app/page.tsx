import { VesselIsotipo } from "@/components/logo/VesselIsotipo";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-brand-green">
      <VesselIsotipo className="h-auto w-[clamp(120px,32vw,280px)]" />
      <p className="text-[clamp(0.75rem,2.2vw,1rem)] font-medium tracking-[0.35em] text-brand-gold">
        COMING SOON
      </p>
    </div>
  );
}
