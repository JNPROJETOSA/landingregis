"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { STATUS_LABELS, type Candidatura, type CandidaturaStatus } from "@/lib/types";

type ListResponse =
  | { ok: true; items: Candidatura[]; total: number }
  | { ok: false; pending?: boolean; items?: Candidatura[]; message?: string };

type ChannelState = {
  status: "sent" | "failed" | "skipped" | "pending";
  attempts: number;
  lastAttempt?: string;
  detail?: string;
};

const STATUSES = Object.keys(STATUS_LABELS) as CandidaturaStatus[];

function fmtDate(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

/** Monta o link do WhatsApp com o número já salvo. */
function waLink(number: string): string {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}

export default function AdminPanel() {
  const [authed, setAuthed] = useState<boolean | null>(null); // null = checando
  const [pendingBackend, setPendingBackend] = useState(false);
  const [backendMsg, setBackendMsg] = useState<string | null>(null);

  // Login
  const [password, setPassword] = useState("");
  const [loginErr, setLoginErr] = useState<string | null>(null);
  const [loginBusy, setLoginBusy] = useState(false);

  // Dados
  const [items, setItems] = useState<Candidatura[]>([]);
  const [total, setTotal] = useState(0);

  // Filtros
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"" | CandidaturaStatus>("");
  const [channel, setChannel] = useState<"" | "email_failed" | "telegram_failed" | "pending">("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [busyId, setBusyId] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  const clearFlash = useCallback(() => {
    setFlash(null);
    const t = setTimeout(() => setFlash(null), 4000);
    return () => clearTimeout(t);
  }, []);

  const fetchList = useCallback(async () => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (status) params.set("status", status);
    if (channel) params.set("channel", channel);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const qs = params.toString();
    const res = await fetch(`/api/admin/candidaturas${qs ? `?${qs}` : ""}`, {
      headers: { Accept: "application/json" },
    });
    const body = (await res.json().catch(() => ({}))) as ListResponse & { ok: boolean };

    if (res.status === 401) {
      setAuthed(false);
      return;
    }
    setAuthed(true);

    if (body.ok === false) {
      setItems(body.items ?? []);
      setTotal(0);
      setPendingBackend(Boolean(body.pending));
      setBackendMsg(body.message ?? "Banco não configurado.");
    } else {
      setItems(body.items ?? []);
      setTotal(body.total ?? 0);
      setPendingBackend(false);
      setBackendMsg(null);
    }
  }, [q, status, channel, from, to]);

  // Primeira checagem de sessão + (re)carregamento quando filtros mudam.
  useEffect(() => {
    setAuthed(null);
    fetchList();
  }, [fetchList]);

  const login = async () => {
    setLoginBusy(true);
    setLoginErr(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const body = (await res.json().catch(() => ({}))) as { ok: boolean; message?: string };
    if (res.status === 503) {
      setLoginErr(
        body.message ??
          "Painel ainda não configurado. Defina ADMIN_PASSWORD no ambiente antes de entrar.",
      );
      setLoginBusy(false);
      return;
    }
    if (!body.ok) {
      const err = (body as { errors?: { password?: string } }).errors?.password;
      setLoginErr(err ?? "Não foi possível entrar. Tente novamente.");
      setLoginBusy(false);
      return;
    }
    setPassword("");
    setAuthed(true);
    await fetchList();
    setLoginBusy(false);
  };

  const logout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    setAuthed(false);
    setItems([]);
  };

  const changeStatus = async (id: string, s: CandidaturaStatus) => {
    setBusyId(id);
    const res = await fetch("/api/admin/candidaturas", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: s }),
    });
    const body = (await res.json().catch(() => ({}))) as { ok: boolean; message?: string };
    setFlash(body.ok ? "Status atualizado." : body.message ?? "Falha ao atualizar.");
    if (body.ok) await fetchList();
    setBusyId(null);
    clearFlash();
  };

  const resend = async (id: string, ch: "email" | "telegram" | "all") => {
    setBusyId(id);
    const res = await fetch("/api/admin/candidaturas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, channel: ch }),
    });
    const body = (await res.json().catch(() => ({}))) as { ok: boolean; message?: string };
    setFlash(body.ok ? "Notificação reenviada." : body.message ?? "Falha no reenvio.");
    setBusyId(null);
    clearFlash();
  };

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const s of STATUSES) c[s] = 0;
    for (const it of items) c[it.status] = (c[it.status] ?? 0) + 1;
    return c;
  }, [items]);

  // ── Tela de login ────────────────────────────────────────────────────────
  if (authed === false) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
        <div className="rounded-2xl border border-ink-100 bg-white p-8 shadow-panel">
          <div className="mb-6 flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-brand-500" />
            <h1 className="text-lg font-semibold tracking-tightest text-ink-900">
              Painel de Candidaturas
            </h1>
          </div>
          <label className="mb-1.5 block text-2xs font-medium uppercase tracking-wider2 text-graphite-200">
            Senha do painel
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            autoFocus
            placeholder="••••••••"
            className="mb-3 w-full rounded-lg border border-ink-200 bg-paper-50 px-3 py-2.5 text-sm text-ink-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
          {loginErr && <p className="mb-3 text-xs text-red-600">{loginErr}</p>}
          <button
            onClick={login}
            disabled={loginBusy || password.length < 8}
            className="w-full rounded-lg bg-ink-900 px-4 py-2.5 text-sm font-medium text-white transition enabled:hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loginBusy ? "Entrando…" : "Entrar"}
          </button>
        </div>
        <p className="mt-4 text-center text-xs text-graphite-100">
          A senha nunca é armazenada — a sessão é validada por token derivado.
        </p>
      </div>
    );
  }

  // ── Tela carregando ──────────────────────────────────────────────────────
  if (authed === null) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-graphite-100">
        Carregando painel…
      </div>
    );
  }

  // ── Painel autenticado ───────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tightest text-ink-900">
            Candidaturas
          </h1>
          <p className="text-sm text-graphite-100">
            {pendingBackend
              ? backendMsg ?? "Banco de candidaturas ainda não configurado."
              : `${total} candidatura${total === 1 ? "" : "s"} na visão atual`}
          </p>
        </div>
        <button
          onClick={logout}
          className="rounded-lg border border-ink-200 bg-white px-3.5 py-2 text-xs font-medium text-graphite-300 transition hover:border-ink-300 hover:text-ink-900"
        >
          Sair
        </button>
      </header>

      {flash && (
        <div className="mb-4 rounded-lg border border-brand-100 bg-brand-50 px-4 py-2.5 text-sm text-brand-700">
          {flash}
        </div>
      )}

      {/* Filtros */}
      <div className="mb-5 grid gap-3 rounded-xl border border-ink-100 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block text-2xs font-medium uppercase tracking-wider2 text-graphite-200">
          Buscar
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="nome, whatsapp, email, código…"
            className="mt-1.5 w-full rounded-lg border border-ink-200 bg-paper-50 px-3 py-2 text-sm normal-case tracking-normal text-ink-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </label>
        <label className="block text-2xs font-medium uppercase tracking-wider2 text-graphite-200">
          Status
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "" | CandidaturaStatus)}
            className="mt-1.5 w-full rounded-lg border border-ink-200 bg-paper-50 px-3 py-2 text-sm normal-case tracking-normal text-ink-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          >
            <option value="">Todos</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-2xs font-medium uppercase tracking-wider2 text-graphite-200">
          Canal
          <select
            value={channel}
            onChange={(e) =>
              setChannel(e.target.value as "" | "email_failed" | "telegram_failed" | "pending")
            }
            className="mt-1.5 w-full rounded-lg border border-ink-200 bg-paper-50 px-3 py-2 text-sm normal-case tracking-normal text-ink-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          >
            <option value="">Todos</option>
            <option value="pending">Notificação pendente</option>
            <option value="email_failed">E-mail falhou</option>
            <option value="telegram_failed">Telegram falhou</option>
          </select>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-2xs font-medium uppercase tracking-wider2 text-graphite-200">
            De
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-ink-200 bg-paper-50 px-2.5 py-2 text-sm normal-case tracking-normal text-ink-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </label>
          <label className="block text-2xs font-medium uppercase tracking-wider2 text-graphite-200">
            Até
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-ink-200 bg-paper-50 px-2.5 py-2 text-sm normal-case tracking-normal text-ink-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </label>
        </div>
      </div>

      {/* Contadores por status */}
      {!pendingBackend && (
        <div className="mb-5 flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(status === s ? "" : s)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                status === s
                  ? "border-ink-900 bg-ink-900 text-white"
                  : "border-ink-200 bg-white text-graphite-300 hover:border-ink-300"
              }`}
            >
              {STATUS_LABELS[s]} · {counts[s] ?? 0}
            </button>
          ))}
        </div>
      )}

      {/* Lista */}
      <div className="space-y-3">
        {pendingBackend ? (
          <div className="rounded-xl border border-dashed border-ink-200 bg-white p-10 text-center">
            <p className="text-sm text-graphite-100">
              Nenhuma candidatura disponível ainda. Configure o Supabase (URL + keys) e a tabela
              <code className="mx-1 rounded bg-paper-100 px-1.5 py-0.5 font-mono text-xs">
                candidaturas
              </code>
              em <code className="rounded bg-paper-100 px-1.5 py-0.5 font-mono text-xs">supabase/schema.sql</code>{" "}
              para começar a receber.
            </p>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-ink-200 bg-white p-10 text-center text-sm text-graphite-100">
            Nenhuma candidatura encontrada com os filtros atuais.
          </div>
        ) : (
          items.map((it) => (
            <article
              key={it.id}
              className="rounded-xl border border-ink-100 bg-white p-4 transition hover:shadow-lift"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-sm font-semibold text-ink-900">{it.nome}</h3>
                    <span className="rounded bg-paper-100 px-1.5 py-0.5 text-[11px] text-graphite-300">
                      {fmtDate(it.created_at)}
                    </span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-graphite-100">
                    <span>{it.situacao}</span>
                    <span>Provas: {(it.provas ?? []).join(", ") || "—"}</span>
                    <span>Dificuldade: {it.dificuldade}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                    <a
                      href={waLink(it.whatsapp)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand-600 hover:text-brand-700 hover:underline"
                    >
                      {it.whatsapp}
                    </a>
                    {it.email && <span className="text-graphite-100">{it.email}</span>}
                    {(it.codigo || it.ref || it.cupom) && (
                      <span className="text-graphite-100">
                        Origem: {it.codigo ?? it.ref ?? it.cupom}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <select
                    value={it.status}
                    disabled={busyId === it.id}
                    onChange={(e) => changeStatus(it.id, e.target.value as CandidaturaStatus)}
                    className="rounded-lg border border-ink-200 bg-paper-50 px-2.5 py-1.5 text-xs font-medium text-ink-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100 disabled:opacity-50"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-2 text-[11px]">
                    <ChannelBadge label="E-mail" state={it.email_channel as ChannelState | null | undefined} />
                    <ChannelBadge label="Telegram" state={it.telegram_channel as ChannelState | null | undefined} />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => resend(it.id, "email")}
                      disabled={busyId === it.id}
                      className="rounded-md border border-ink-200 px-2 py-1 text-[11px] font-medium text-graphite-300 transition enabled:hover:border-ink-300 enabled:hover:text-ink-900 disabled:opacity-50"
                    >
                      Reenviar e-mail
                    </button>
                    <button
                      onClick={() => resend(it.id, "all")}
                      disabled={busyId === it.id}
                      className="rounded-md border border-ink-200 px-2 py-1 text-[11px] font-medium text-graphite-300 transition enabled:hover:border-ink-300 enabled:hover:text-ink-900 disabled:opacity-50"
                    >
                      Ambos
                    </button>
                  </div>
                </div>
              </div>
              {it.obs && (
                <p className="mt-2 rounded-lg bg-paper-50 px-3 py-2 text-xs text-graphite-300">
                  Obs.: {it.obs}
                </p>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  );
}

function ChannelBadge({ label, state }: { label: string; state: ChannelState | null | undefined }) {
  const s = state?.status ?? "pending";
  const tone: Record<ChannelState["status"], string> = {
    sent: "bg-brand-50 text-brand-700",
    failed: "bg-red-50 text-red-600",
    skipped: "bg-paper-100 text-graphite-100",
    pending: "bg-paper-100 text-graphite-100",
  };
  const text: Record<ChannelState["status"], string> = {
    sent: "enviado",
    failed: "falhou",
    skipped: "pulado",
    pending: "pendente",
  };
  return (
    <span className={`rounded px-1.5 py-0.5 font-medium ${tone[s]}`}>
      {label} · {text[s]}
      {state && state.attempts > 0 ? ` (${state.attempts})` : ""}
    </span>
  );
}
