import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Sessão do painel admin (sem dependências externas):
 * token = HMAC-SHA256(segredo, "admin:ADMIN_PASSWORD").
 * - A senha nunca é armazenada; o token prova a posse dela.
 * - Cookie httpOnly, path /admin, 12h de vida.
 */

const COOKIE = "regisdencia_admin";
const SESSION_HOURS = 12;

export type AdminCookie = {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax" | "strict" | "none";
  path: string;
  maxAge: number;
};

export function adminCookieOptions(): AdminCookie {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: SESSION_HOURS * 3600,
  };
}

function secret(): string {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.ADMIN_PASSWORD || "";
}

export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

function hmac(value: string): Buffer {
  return createHmac("sha256", secret()).update(`admin:${value}`).digest();
}

export function createAdminToken(password: string): string {
  return hmac(password).toString("hex");
}

/** Compara em tempo constante (evita timing attack). */
export function verifyAdminToken(token: string | undefined, password?: string): boolean {
  if (!token || !adminConfigured() || secret() === "") return false;
  const candidate = password ?? process.env.ADMIN_PASSWORD!;
  const expected = hmac(candidate);
  const actual = Buffer.from(token, "hex");
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

/** Lê o cookie de sessão a partir de um mapa de cookies. */
export function readAdminCookie(cookies: Record<string, string | undefined>): boolean {
  return verifyAdminToken(cookies[COOKIE]);
}

export { COOKIE as ADMIN_COOKIE };
