import { NextResponse, type NextRequest } from "next/server";
import { timingSafeEqual } from "node:crypto";
import {
  adminConfigured,
  createAdminToken,
  adminCookieOptions,
  ADMIN_COOKIE,
} from "@/lib/admin/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ATTEMPTS = new Map<string, { n: number; until: number }>();
const LOCK_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 10;

function ipOf(req: NextRequest): string {
  return (req.headers.get("x-forwarded-for") ?? "").split(",")[0]?.trim() || "unknown";
}

export async function POST(req: NextRequest) {
  if (!adminConfigured()) {
    return NextResponse.json(
      { ok: false, pending: true, message: "Painel ainda não configurado (defina ADMIN_PASSWORD)." },
      { status: 503 },
    );
  }

  const ip = ipOf(req);
  const entry = ATTEMPTS.get(ip);
  if (entry && entry.n >= MAX_ATTEMPTS && Date.now() < entry.until) {
    return NextResponse.json(
      { ok: false, message: "Muitas tentativas. Tente novamente em instantes." },
      { status: 429 },
    );
  }

  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  if (typeof password !== "string" || password.length < 8) {
    return NextResponse.json(
      { ok: false, errors: { password: "Informe a senha do painel." } },
      { status: 400 },
    );
  }

  // Deriva o token de cada lado e compara em tempo constante:
  // o resultado só casa quando `password` é a senha correta.
  const expected = createAdminToken(process.env.ADMIN_PASSWORD!);
  const actual = createAdminToken(password);
  const match = timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(actual, "hex"));

  if (!match) {
    const prev = ATTEMPTS.get(ip);
    ATTEMPTS.set(ip, { n: (prev?.n ?? 0) + 1, until: Date.now() + LOCK_MS });
    return NextResponse.json(
      { ok: false, errors: { password: "Senha incorreta." } },
      { status: 401 },
    );
  }

  ATTEMPTS.delete(ip);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, expected, adminCookieOptions());
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", { ...adminCookieOptions(), maxAge: 0 });
  return res;
}
