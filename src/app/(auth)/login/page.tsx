import type { Metadata } from "next";

import { VesselIsotipo } from "@/components/logo/VesselIsotipo";

import { LoginForm } from "./__components/LoginForm";

export const metadata: Metadata = {
  title: "Acceso privado",
};

const DEFAULT_REDIRECT_PATH = "/";

type LoginPageProps = PageProps<"/login">;

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextParam = params.next;
  const redirectTo =
    typeof nextParam === "string" && nextParam.startsWith("/")
      ? nextParam
      : DEFAULT_REDIRECT_PATH;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 px-6">
      <div className="flex flex-col items-center gap-4">
        <VesselIsotipo className="h-auto w-[clamp(96px,22vw,160px)]" />
        <p className="text-[clamp(0.7rem,2vw,0.85rem)] font-medium tracking-[0.35em] text-brand-gold">
          STAGING
        </p>
      </div>
      <LoginForm redirectTo={redirectTo} />
    </div>
  );
}
