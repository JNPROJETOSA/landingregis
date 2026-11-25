/** Tipos compartilhados entre API pública, painel admin e notificações. */

export type CandidaturaStatus =
  | "novo"
  | "contato_iniciado"
  | "em_atendimento"
  | "matriculado"
  | "nao_convertido";

export const STATUS_LABELS: Record<CandidaturaStatus, string> = {
  novo: "Novo",
  contato_iniciado: "Contato iniciado",
  em_atendimento: "Em atendimento",
  matriculado: "Matriculado",
  nao_convertido: "Não convertido",
};

export type NotificationChannelState = {
  status: "sent" | "failed" | "skipped" | "pending";
  attempts: number;
  lastAttempt?: string;
  detail?: string;
};

export type Candidatura = {
  id: string;
  created_at: string;
  nome: string;
  whatsapp: string;
  email?: string | null;
  situacao: string;
  situacao_outra?: string | null;
  provas: string[];
  dificuldade: string;
  codigo?: string | null; // ref manual
  ref?: string | null; // origem
  cupom?: string | null; // origem
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
  referrer?: string | null;
  lgpd?: boolean | null;
  status: CandidaturaStatus;
  obs?: string | null;
  dedup_key?: string | null;
  email_channel?: NotificationChannelState | null;
  telegram_channel?: NotificationChannelState | null;
};

export type CandidaturaRow = Candidatura & {
  updated_at: string;
};

export function statusToWhatsAppLabel(s: CandidaturaStatus): string {
  return STATUS_LABELS[s];
}
