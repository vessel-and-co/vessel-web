"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  STAGING_SESSION_COOKIE,
  createSessionToken,
  verifyStagingCredentials,
} from "@/lib/staging-auth";

const SESSION_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
const DEFAULT_REDIRECT_PATH = "/";

export type LoginState = {
  error: string | null;
};

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "");

  if (!verifyStagingCredentials(username, password)) {
    return { error: "Usuario o contraseña incorrectos." };
  }

  const cookieStore = await cookies();
  cookieStore.set(STAGING_SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_COOKIE_MAX_AGE_SECONDS,
  });

  redirect(redirectTo.startsWith("/") ? redirectTo : DEFAULT_REDIRECT_PATH);
}
