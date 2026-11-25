import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import {
  notifyAll,
  type ChannelResult,
  type NotificationPayload,
} from "@/lib/notifications";
import {
  getSituacaoLabel,
  PROVAS,
  validateCandidatura,
  type CandidaturaInput,
  type FieldErrors,
} from "@/lib/validation";
import type { CandidaturaStatus } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const json = (status: number, body: unknown) =>
  NextResponse.json(body, { status });

// ── Rate limiting & anti-duplicidade em memória (por instância) ──────────
const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };
const buckets = new Map<string, number[]>();
const inFlightPhones = new Set<string>();
const recentSubmissions = new Map<string, number>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (buckets.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT.windowMs,
  );
  buckets.set(ip, [...hits, now]);
  return hits.length >= RATE_LIMIT.max;
}

function normalizePhone(p: string): string {
  return p.replace(/\D/g, "");
}

function dedupKey(phone: string): string {
  return `cand:${normalizePhone(phone)}:${new Date().toISOString().slice(0, 10)}`;
}

type GoogleBridgeResult =
  | { ok: true; responseId?: string; duplicate?: boolean }
  | { ok: false; message: string };

async function submitToGoogleAppsScript(payload: {
  nome: string;
  whatsapp: string;
  email: string;
  situacaoLabel: string;
  situacaoOutra: string;
  provas: string[];
  dificuldade: string;
  indicacao: string;
  origemResumo: string;
  lgpd: boolean;
  dedupKey: string;
}): Promise<GoogleBridgeResult> {
  const url = process.env.GOOGLE_APPS_SCRIPT_URL?.trim();
  const secret = process.env.GOOGLE_APPS_SCRIPT_SECRET?.trim();
  if (!url || !secret) {
    return {
      ok: false,
      message: "Integração com Google Forms não configurada no servidor.",
    };
  }

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, secret }),
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    return {
      ok: false,
      message:
        "Não foi possível confirmar o registro agora por instabilidade na conexão. Seus dados foram mantidos para nova tentativa.",
    };
  }

  type GoogleBridgeResponse = {
    ok?: boolean;
    responseId?: string;
    duplicate?: boolean;
    error?: string;
  };

  let data: GoogleBridgeResponse | null = null;
  try {
    data = (await res.json()) as GoogleBridgeResponse;
  } catch {
    data = null;
  }

  if (
    !res.ok ||
    !data ||
    data.ok !== true ||
    (!data.responseId && !data.duplicate)
  ) {
    return {
      ok: false,
      message:
        data?.error ||
        "Não foi possível confirmar o registro da sua candidatura. Tente novamente em instantes.",
    };
  }

  return {
    ok: true,
    responseId: data.responseId,
    duplicate: data.duplicate,
  };
}

export async function POST(req: NextRequest) {
  const ip =
    (req.headers.get("x-forwarded-for") ?? "").split(",")[0]?.trim() ||
    "unknown";
  if (rateLimited(ip)) {
    return json(429, {
      ok: false,
      message:
        "Muitas candidaturas em pouco tempo. Tente novamente em alguns minutos ou fale direto pelo WhatsApp.",
    });
  }

  let body: CandidaturaInput & { lgpd?: boolean; website?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return json(400, { ok: false, message: "Payload inválido." });
  }

  // Honeypot anti-spam: bots que preenchem o campo invisível são bloqueados.
  if (typeof body.website === "string" && body.website.trim().length > 0) {
    return json(400, {
      ok: false,
      message: "Não foi possível processar a solicitação.",
    });
  }

  // Validação no servidor (fonte de verdade).
  const errors = validateCandidatura(body);
  if (!body.lgpd) {
    errors.lgpd = "É necessário autorizar o tratamento dos dados (LGPD).";
  }
  if (Object.keys(errors).length > 0) {
    return json(400, { ok: false, errors: errors as FieldErrors });
  }

  const phone = normalizePhone(body.whatsapp);
  const key = dedupKey(phone);

  if (inFlightPhones.has(phone)) {
    return json(409, {
      ok: false,
      message:
        "Sua candidatura já está sendo processada. Aguarde alguns segundos.",
    });
  }

  const recentAt = recentSubmissions.get(key);
  if (recentAt && Date.now() - recentAt < 60 * 60 * 1000) {
    return json(200, {
      ok: true,
      duplicate: true,
      message:
        "Recebemos sua candidatura! Já havíamos registrado seu envio hoje e nossa equipe entrará em contato.",
    });
  }

  const code =
    body.indicacao?.trim().slice(0, 80) ||
    body.origem?.ref?.trim().slice(0, 80) ||
    body.origem?.cupom?.trim().slice(0, 80) ||
    "";

  const validProvas = body.provas.filter((p) =>
    (PROVAS as readonly string[]).includes(p),
  );

  const origemParts = [
    body.origem?.ref ? `ref=${body.origem.ref}` : "",
    body.origem?.cupom ? `cupom=${body.origem.cupom}` : "",
    body.origem?.utm?.source ? `utm_source=${body.origem.utm.source}` : "",
    body.origem?.utm?.medium ? `utm_medium=${body.origem.utm.medium}` : "",
    body.origem?.utm?.campaign
      ? `utm_campaign=${body.origem.utm.campaign}`
      : "",
    body.origem?.referrer ? `referrer=${body.origem.referrer}` : "",
  ].filter(Boolean);

  const googleConfigured = Boolean(
    process.env.GOOGLE_APPS_SCRIPT_URL?.trim() &&
      process.env.GOOGLE_APPS_SCRIPT_SECRET?.trim(),
  );

  // Prioridade principal: ponte oficial Google Apps Script -> Google Forms -> Google Sheets
  if (googleConfigured) {
    inFlightPhones.add(phone);
    try {
      const bridgeResult = await submitToGoogleAppsScript({
        nome: body.nome.trim(),
        whatsapp: body.whatsapp.trim(),
        email: body.email?.trim() || "",
        situacaoLabel: getSituacaoLabel(body.situacao),
        situacaoOutra:
          body.situacao === "outra"
            ? body.situacaoOutra?.trim().slice(0, 150) || ""
            : "",
        provas: validProvas,
        dificuldade: body.dificuldade.trim(),
        indicacao: code,
        origemResumo: origemParts.join(" | ").slice(0, 400),
        lgpd: Boolean(body.lgpd),
        dedupKey: key,
      });

      if (!bridgeResult.ok) {
        return json(502, {
          ok: false,
          message: bridgeResult.message,
        });
      }

      recentSubmissions.set(key, Date.now());

      if (bridgeResult.duplicate) {
        return json(200, {
          ok: true,
          duplicate: true,
          message:
            "Recebemos sua candidatura! Já havíamos registrado seu contato hoje e nossa equipe entrará em contato.",
        });
      }

      return json(200, {
        ok: true,
        id: bridgeResult.responseId,
        message: "Recebemos sua candidatura! Nossa equipe entrará em contato.",
      });
    } finally {
      inFlightPhones.delete(phone);
    }
  }

  // Fallback legado (Supabase), caso Google Apps Script não esteja configurado
  const db = createServerSupabase();
  if (!db) {
    return json(503, {
      ok: false,
      pending: true,
      message:
        "O sistema de candidaturas ainda está sendo conectado ao Google Forms. Se preferir, fale conosco pelo WhatsApp para não perder o contato.",
    });
  }

  const row = {
    nome: body.nome.trim(),
    whatsapp: phone,
    email: body.email?.trim() || null,
    situacao: body.situacao,
    situacao_outra: body.situacaoOutra?.trim() || null,
    provas: validProvas,
    dificuldade: body.dificuldade.trim(),
    codigo: code || null,
    ref: body.origem?.ref ?? null,
    cupom: body.origem?.cupom ?? null,
    utm_source: body.origem?.utm?.source ?? null,
    utm_medium: body.origem?.utm?.medium ?? null,
    utm_campaign: body.origem?.utm?.campaign ?? null,
    utm_term: body.origem?.utm?.term ?? null,
    utm_content: body.origem?.utm?.content ?? null,
    referrer: body.origem?.referrer ?? null,
    lgpd: Boolean(body.lgpd),
    status: "novo" as CandidaturaStatus,
    dedup_key: key,
  };

  const { data: inserted, error: insertErr } = await db
    .from("candidaturas")
    .insert(row)
    .select()
    .single();

  if (insertErr || !inserted) {
    const { data: dup } = await db
      .from("candidaturas")
      .select("id")
      .eq("dedup_key", row.dedup_key)
      .maybeSingle();

    if (dup) {
      const { error: updErr } = await db
        .from("candidaturas")
        .update({
          nome: row.nome,
          whatsapp: row.whatsapp,
          email: row.email,
          situacao: row.situacao,
          situacao_outra: row.situacao_outra,
          provas: row.provas,
          dificuldade: row.dificuldade,
          codigo: row.codigo,
          ref: row.ref,
          cupom: row.cupom,
          updated_at: new Date().toISOString(),
        })
        .eq("id", dup.id);
      if (!updErr) {
        return json(200, {
          ok: true,
          duplicate: true,
          message:
            "Recebemos sua candidatura! Já havíamos registrado seu contato — atualizamos os dados e nossa equipe entrará em contato.",
        });
      }
    }
    return json(500, {
      ok: false,
      message:
        "Não foi possível registrar sua candidatura agora. Fale pelo WhatsApp para não perder o contato.",
      detail: insertErr?.message,
    });
  }

  const payload: NotificationPayload = {
    id: inserted.id,
    nome: row.nome,
    whatsapp: row.whatsapp,
    email: row.email ?? undefined,
    situacao: row.situacao,
    provas: row.provas,
    dificuldade: row.dificuldade,
    indicacao: code || undefined,
    origem: {
      ref: row.ref ?? undefined,
      cupom: row.cupom ?? undefined,
      utm_source: row.utm_source ?? undefined,
      utm_medium: row.utm_medium ?? undefined,
      utm_campaign: row.utm_campaign ?? undefined,
      referrer: row.referrer ?? undefined,
    },
    createdAt: inserted.created_at,
  };

  const results = await notifyAll(payload);

  const toChannelState = (r: ChannelResult) => ({
    status: r.status,
    attempts: r.attempts,
    lastAttempt: new Date().toISOString(),
    detail: r.detail,
  });

  await db
    .from("candidaturas")
    .update({
      email_channel: toChannelState(results.email),
      telegram_channel: toChannelState(results.telegram),
      updated_at: new Date().toISOString(),
    })
    .eq("id", inserted.id);

  return json(200, {
    ok: true,
    id: inserted.id,
    notifications: {
      email: results.email.status,
      telegram: results.telegram.status,
    },
    message: "Recebemos sua candidatura! Nossa equipe entrará em contato.",
  });
}
