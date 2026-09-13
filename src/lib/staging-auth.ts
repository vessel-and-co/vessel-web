import { createHmac, timingSafeEqual } from "node:crypto";

export const STAGING_SESSION_COOKIE = "vessel_staging_session";

const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7;

function getSessionSecret(): string {
  const secret = process.env.STAGING_AUTH_SECRET;
  if (!secret) {
    throw new Error("STAGING_AUTH_SECRET no esta configurado.");
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("hex");
}

function timingSafeStringEqual(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) {
    return false;
  }
  return timingSafeEqual(bufferA, bufferB);
}

export function createSessionToken(): string {
  const expiresAt = String(Date.now() + SESSION_DURATION_MS);
  return `${expiresAt}.${sign(expiresAt)}`;
}

export function isValidSessionToken(token: string | undefined): boolean {
  if (!token) {
    return false;
  }

  const [expiresAt, signature] = token.split(".");
  if (!expiresAt || !signature) {
    return false;
  }

  if (!timingSafeStringEqual(signature, sign(expiresAt))) {
    return false;
  }

  const expiresAtMs = Number(expiresAt);
  return Number.isFinite(expiresAtMs) && expiresAtMs > Date.now();
}

export function verifyStagingCredentials(
  username: string,
  password: string
): boolean {
  const expectedUsername = process.env.STAGING_AUTH_USER ?? "";
  const expectedPassword = process.env.STAGING_AUTH_PASSWORD ?? "";

  if (!expectedUsername || !expectedPassword) {
    return false;
  }

  return (
    timingSafeStringEqual(username, expectedUsername) &&
    timingSafeStringEqual(password, expectedPassword)
  );
}
