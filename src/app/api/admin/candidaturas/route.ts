import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createServerSupabase, supabaseReady } from "@/lib/supabase/server";
import { readAdminCookie } from "@/lib/admin/session";
import { notifyAll, type ChannelResult, type NotificationPayload } from "@/lib/notifications";
import type { Candidatura, CandidaturaStatus, NotificationChannelState } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_STATUSES: CandidaturaStatus[] = [
  "novo",
  "contato_iniciado",
  "em_atendimento",
  "matriculado",
  "nao_convertido",
];

async function authed() {
  const store = await cookies();
  const map: Record<string, string | undefined> = {};
  for (const c of store.getAll()) map[c.name] = c.value;
  return readAdminCookie(map);
}

const json = (status: number, body: unknown) => NextResponse.json(body, { status });

export async function GET(req: NextRequest) {
  if (!(await authed())) return json(401, { ok: false, message: "Não autenticado." });
  const db = createServerSupabase();
  if (!supabaseReady() || !db) {
    return json(200, { ok: false, pending: true, items: [], message: "Banco de candidaturas ainda não configurado." });
  }

  const params = req.nextUrl.searchParams;
  const q = params.get("q")?.trim() || "";
  const status = params.get("status") || "";
  const channel = params.get("channel") || "";
  const from = params.get("from") || "";
  const to = params.get("to") || "";

  let query = db.from("candidaturas").select("*").order("created_at", { ascending: false }).limit(500);

  if (q) {
    // Busca por nome, whatsapp, email, código — via ilike no nome/whatsapp/email.
    query = query.or(
      `nome.ilike.%${q}%,whatsapp.ilike.%${q}%,email.ilike.%${q}%,codigo.ilike.%${q}%,ref.ilike.%${q}%,cupom.ilike.%${q}%`,
    );
  }
  if (status && VALID_STATUSES.includes(status as CandidaturaStatus)) {
    query = query.eq("status", status);
  }
  if (channel === "email_failed") {
    query = query.filter("email_channel->>status", "eq", "failed");
  } else if (channel === "telegram_failed") {
    query = query.filter("telegram_channel->>status", "eq", "failed");
  } else if (channel === "pending") {
    query = query.or("email_channel->>status.is.null,telegram_channel->>status.is.null,email_channel->>status.eq.skipped,telegram_channel->>status.eq.skipped");
  }
  if (from) query = query.gte("created_at", from);
  if (to) query = query.lte("created_at", to);

  const { data, error } = await query;
  if (error) return json(500, { ok: false, message: "Falha ao listar candidaturas.", detail: error.message });

  const items = (data ?? []) as Candidatura[];
  return json(200, { ok: true, items, total: items.length });
}

export async function PATCH(req: NextRequest) {
  if (!(await authed())) return json(401, { ok: false, message: "Não autenticado." });
  const db = createServerSupabase();
  if (!supabaseReady() || !db) return json(503, { ok: false, pending: true, message: "Banco não configurado." });

  const { id, status, obs } = (await req.json().catch(() => ({}))) as {
    id?: string;
    status?: CandidaturaStatus;
    obs?: string;
  };

  if (!id || !VALID_STATUSES.includes(status as CandidaturaStatus)) {
    return json(400, { ok: false, message: "Informe um id e um status válido." });
  }

  const { error } = await db
    .from("candidaturas")
    .update({ status, ...(obs !== undefined ? { obs } : {}) })
    .eq("id", id);

  if (error) return json(500, { ok: false, message: "Falha ao atualizar status.", detail: error.message });
  return json(200, { ok: true, message: "Status atualizado." });
}

export async function POST(req: NextRequest) {
  if (!(await authed())) return json(401, { ok: false, message: "Não autenticado." });
  const db = createServerSupabase();
  if (!supabaseReady() || !db) return json(503, { ok: false, pending: true, message: "Banco não configurado." });

  const { id, channel } = (await req.json().catch(() => ({}))) as {
    id?: string;
    channel?: "email" | "telegram" | "all";
  };
  if (!id) return json(400, { ok: false, message: "Informe o id da candidatura." });

  const { data: row, error: fetchErr } = await db
    .from("candidaturas")
    .select("*")
    .eq("id", id)
    .single();
  if (fetchErr || !row) return json(404, { ok: false, message: "Candidatura não encontrada." });

  const cand = row as Candidatura;
  const payload: NotificationPayload = {
    id: cand.id,
    nome: cand.nome,
    whatsapp: cand.whatsapp,
    email: cand.email ?? undefined,
    situacao: cand.situacao,
    provas: cand.provas ?? [],
    dificuldade: cand.dificuldade,
    indicacao: cand.codigo ?? cand.ref ?? cand.cupom ?? undefined,
    origem: {
      ref: cand.ref ?? undefined,
      cupom: cand.cupom ?? undefined,
      utm_source: cand.utm_source ?? undefined,
      utm_medium: cand.utm_medium ?? undefined,
      utm_campaign: cand.utm_campaign ?? undefined,
      referrer: cand.referrer ?? undefined,
    },
    createdAt: cand.created_at,
  };

  const results = await notifyAll(payload);
  const target: ("email" | "telegram")[] =
    channel === "all" || !channel ? ["email", "telegram"] : [channel];

  const updates: Partial<Record<"email_channel" | "telegram_channel", NotificationChannelState>> = {};
  for (const ch of target) {
    const r = results[ch as "email" | "telegram"] as ChannelResult;
    updates[ch === "email" ? "email_channel" : "telegram_channel"] = {
      status: r.status,
      attempts: (cand[ch === "email" ? "email_channel" : "telegram_channel"]?.attempts ?? 0) + 1,
      lastAttempt: new Date().toISOString(),
      detail: r.detail,
    };
  }

  const { error: updErr } = await db
    .from("candidaturas")
    .update(updates)
    .eq("id", id);
  if (updErr) return json(500, { ok: false, message: "Notificação disparada, mas falhou ao registrar.", detail: updErr.message });

  return json(200, {
    ok: true,
    results: results,
    message: "Notificação reenviada e status atualizado.",
  });
}
