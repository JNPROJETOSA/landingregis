/**
 * Notificações após candidatura salva: E-MAIL e TELEGRAM, independentes.
 * - Envios separados: falha de um não derruba o outro.
 * - Registro de status por canal + tentativas de reenvio.
 * - Prevenção de duplicatas (a candidatura já é única por chave de dedup).
 * - A FALHA de notificação NUNCA perde a candidatura: o insert acontece antes
 *   e é commitado; aqui apenas marcamos o status de cada canal.
 *
 * Segredos vivem apenas no backend (ver .env.example).
 */

import { site } from "@/config/site";

export type Channel = "email" | "telegram";
export type ChannelStatus = "sent" | "failed" | "skipped";

export type NotificationPayload = {
  id: string;
  nome: string;
  whatsapp: string;
  email?: string;
  situacao: string;
  provas: string[];
  dificuldade: string;
  indicacao?: string;
  origem?: Record<string, string | undefined>;
  createdAt: string;
};

export type ChannelResult = {
  channel: Channel;
  status: ChannelStatus;
  attempts: number;
  detail?: string;
};

const MAX_ATTEMPTS = 3;

function adminUrl(): string {
  return process.env.ADMIN_APP_URL || "http://localhost:3000/admin";
}

function buildEmailText(p: NotificationPayload): string {
  return [
    `Nova candidatura — ${site.name}`,
    "",
    `Nome: ${p.nome}`,
    `WhatsApp: ${p.whatsapp}`,
    p.email ? `E-mail: ${p.email}` : "",
    `Situação: ${p.situacao}`,
    `Provas pretendidas: ${p.provas.join(", ")}`,
    `Dificuldade principal: ${p.dificuldade}`,
    p.indicacao ? `Código: ${p.indicacao}` : "",
    p.origem ? `Origem: ${JSON.stringify(p.origem)}` : "",
    "",
    `Recebida em: ${new Date(p.createdAt).toLocaleString("pt-BR")}`,
    "",
    `Painel: ${adminUrl()}`,
  ]
    .filter(Boolean)
    .join("\n");
}

async function sendEmail(p: NotificationPayload, attempt: number): Promise<ChannelResult> {
  const { provider, token, from, to } = site.email;
  if (!provider || !token || !to)
    return { channel: "email", status: "skipped", attempts: 0, detail: "email não configurado" };

  // Resend (padrão) — troque para o provedor desejado mantendo a mesma assinatura.
  const res = await fetch(
    provider === "resend"
      ? "https://api.resend.com/emails"
      : "https://api.postmarkserver.com/1.1/messages/email",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(provider === "resend"
          ? { Authorization: `Bearer ${token}` }
          : { "X-Postmark-Server-Token": token }),
      },
      body: JSON.stringify({
        from,
        to,
        subject: `Nova candidatura — ${p.nome} (${site.name})`,
        raw: buildEmailText(p),
        message_html: buildEmailText(p).replace(/\n/g, "<br/>"),
      }),
    },
  );

  if (!res.ok) {
    const detail = `HTTP ${res.status}`;
    if (attempt < MAX_ATTEMPTS) {
      await new Promise((r) => setTimeout(r, 1000 * attempt));
      return sendEmail(p, attempt + 1);
    }
    return { channel: "email", status: "failed", attempts: attempt, detail };
  }
  return { channel: "email", status: "sent", attempts: attempt };
}

async function sendTelegram(p: NotificationPayload, attempt: number): Promise<ChannelResult> {
  const { token, chatId } = site.telegram;
  if (!token || !chatId)
    return { channel: "telegram", status: "skipped", attempts: 0, detail: "telegram não configurado" };

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: buildEmailText(p),
      disable_web_page_preview: true,
    }),
  });

  const ok = res.ok && (await res.json().then((j) => j.ok).catch(() => false));
  if (!ok) {
    const detail = `HTTP ${res.status}`;
    if (attempt < MAX_ATTEMPTS) {
      await new Promise((r) => setTimeout(r, 1000 * attempt));
      return sendTelegram(p, attempt + 1);
    }
    return { channel: "telegram", status: "failed", attempts: attempt, detail };
  }
  return { channel: "telegram", status: "sent", attempts: attempt };
}

/**
 * Dispara e-mail e telegram de forma independente. Retorna o status por canal
 * para persistência. Nenhuma falha aqui propaga para o chamador (a
 * candidatura já está salva).
 */
export async function notifyAll(
  p: NotificationPayload,
): Promise<Record<Channel, ChannelResult>> {
  const [email, telegram] = await Promise.allSettled([
    sendEmail(p, 1),
    sendTelegram(p, 1),
  ]);
  return {
    email:
      email.status === "fulfilled" ? email.value : { channel: "email", status: "failed", attempts: MAX_ATTEMPTS, detail: "erro inesperado" },
    telegram:
      telegram.status === "fulfilled"
        ? telegram.value
        : { channel: "telegram", status: "failed", attempts: MAX_ATTEMPTS, detail: "erro inesperado" },
  };
}
