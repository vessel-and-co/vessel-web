import { VesselIsotipo } from "@/components/logo/VesselIsotipo";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-green">
      <VesselIsotipo className="h-auto w-[clamp(120px,32vw,280px)]" />
    </div>
  );
}
