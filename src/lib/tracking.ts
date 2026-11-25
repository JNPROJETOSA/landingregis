/**
 * Rastreio de origem e códigos.
 * - ?ref=  -> código de indicação
 * - ?cupom=-> cupom
 * - UTM (utm_source/medium/campaign/term/content) -> origem
 *
 * Preserva a origem durante a navegação (sessão) e a registra na candidatura.
 * Diferencia clique, candidatura e matrícula (status no banco).
 */

const KEY = "regisdencia.origin.v1";

export type Utm = {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
};

export type Origin = {
  ref?: string;
  cupom?: string;
  utm: Utm;
  referral?: string;
};

const UTM_KEYS: [string, keyof Utm][] = [
  ["utm_source", "source"],
  ["utm_medium", "medium"],
  ["utm_campaign", "campaign"],
  ["utm_term", "term"],
  ["utm_content", "content"],
];

export function parseOriginFromUrl(url: URL): Origin {
  const utm: Utm = {};
  for (const [k, v] of UTM_KEYS) {
    const raw = url.searchParams.get(k);
    if (raw) utm[v] = raw;
  }
  return {
    ref: url.searchParams.get("ref") ?? undefined,
    cupom: url.searchParams.get("cupom") ?? undefined,
    utm,
  };
}

export function captureOrigin(): void {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  const origin = parseOriginFromUrl(url);
  if (!origin.ref && !origin.cupom && Object.keys(origin.utm).length === 0) {
    // Navegação interna sem parâmetros: mantém a origem anterior da sessão.
    return;
  }
  try {
    sessionStorage.setItem(KEY, JSON.stringify(origin));
  } catch {
    /* modo privado / storage indisponível */
  }
}

export function getStoredOrigin(): Origin {
  if (typeof window === "undefined") return { utm: {} };
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw) return { utm: {}, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  // Fallback: lê da URL atual (cobre refresh sem sessão).
  return parseOriginFromUrl(new URL(window.location.href));
}

/** Remove parâmetros de rastreameno da URL, preservando âncoras. */
export function stripTrackingParams(url: string): string {
  if (typeof window === "undefined") return url;
  const u = new URL(url, window.location.origin);
  const keep = new URLSearchParams(u.searchParams);
  UTM_KEYS.forEach(([k]) => keep.delete(k));
  keep.delete("ref");
  keep.delete("cupom");
  const q = keep.toString();
  return `${u.pathname}${q ? `?${q}` : ""}${u.hash}`;
}

import { site } from "@/config/site";

/** Monta link de WhatsApp com código de indicação/cupom anexado quando disponível. */
export function buildWhatsAppUrl(message?: string, origin?: Origin): string {
  const o = origin ?? getStoredOrigin();
  const parts: string[] = [message ?? site.whatsapp.defaultMessage];

  const codes: string[] = [];
  if (o.ref) codes.push(`Indicação: ${o.ref}`);
  if (o.cupom) codes.push(`Cupom: ${o.cupom}`);
  if (codes.length) parts.push(`\n\n${codes.join(" • ")}`);

  if (site.whatsapp.number) {
    const text = encodeURIComponent(parts.join(" "));
    return `https://wa.me/${site.whatsapp.number}?text=${text}`;
  }
  // Número não configurado: mantém a mensagem disponível mas aponta para o link genérico.
  return `https://wa.me/?text=${encodeURIComponent(parts.join(" "))}`;
}
