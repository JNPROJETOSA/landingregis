"use client";
import { useMemo, useState } from "react";

/**
 * "Mapa de Incidência" — análise de como cada assunto aparece em cada banca/prova.
 * Dados ilustrativos, identificados na UI.
 */
type Topic = { name: string; incidence: number; delta: number };

const bancos = ["ENARE", "SES-PE", "USP-SP", "UNICAMP"] as const;

const data: Record<(typeof bancos)[number], Topic[]> = {
  ENARE: [
    { name: "Cardiologia", incidence: 92, delta: 4 },
    { name: "Gastroenterologia", incidence: 84, delta: -2 },
    { name: "Pneumologia", incidence: 78, delta: 6 },
    { name: "Nefrologia", incidence: 71, delta: 1 },
    { name: "Hematologia", incidence: 58, delta: -3 },
    { name: "Reumatologia", incidence: 44, delta: 2 },
  ],
  "SES-PE": [
    { name: "Clínica Geral", incidence: 88, delta: 3 },
    { name: "Geriatria", incidence: 74, delta: 5 },
    { name: "Hepatologia", incidence: 69, delta: -1 },
    { name: "Endocrinologia", incidence: 63, delta: 2 },
    { name: "Neurologia", incidence: 55, delta: -4 },
    { name: "Pediatria", incidence: 49, delta: 1 },
  ],
  "USP-SP": [
    { name: "Emergência", incidence: 95, delta: 2 },
    { name: "Urgência / TCE", incidence: 81, delta: -1 },
    { name: "Dermatologia", incidence: 67, delta: 4 },
    { name: "Oftalmologia", incidence: 59, delta: 0 },
    { name: "Ginecologia", incidence: 52, delta: 3 },
    { name: "OTORR", incidence: 41, delta: -2 },
  ],
  UNICAMP: [
    { name: "Imunologia", incidence: 86, delta: 1 },
    { name: "Infecção / Infectologia", incidence: 79, delta: 5 },
    { name: "Gastroenterologia", incidence: 70, delta: -3 },
    { name: "Nefrologia", incidence: 64, delta: 2 },
    { name: "Pneumologia", incidence: 57, delta: -1 },
    { name: "Reumatologia", incidence: 45, delta: 3 },
  ],
};

export function IncidenceMapDemo() {
  const [bank, setBank] = useState<(typeof bancos)[number]>("ENARE");
  const topics = useMemo(
    () => [...data[bank]].sort((a, b) => b.incidence - a.incidence),
    [bank],
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-display text-xl font-medium text-ink-800">
          O que pesa na {bank}
        </p>
        <div className="flex flex-wrap gap-2">
          {bancos.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBank(b)}
              aria-pressed={bank === b}
              className={`rounded-lg px-3.5 py-2 font-body text-xs font-semibold transition-colors ${bank === b
                ? "bg-ink-800 text-porcelain-50"
                : "border border-line bg-porcelain-50 text-smoke-700 hover:border-ink-800/30 hover:bg-white"
                }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 divide-y divide-line border-y border-line">
        {topics.map((t, i) => (
          <div
            key={t.name}
            className="grid grid-cols-[1.75rem_minmax(0,1fr)_3.5rem] items-center gap-2.5 py-3.5 sm:grid-cols-[2.25rem_minmax(0,1fr)_4.5rem] sm:gap-4"
          >
            <span className="font-body text-sm font-semibold tabular-nums text-smoke-400">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <div className="flex items-baseline justify-between gap-3">
                <span className="truncate font-body text-[15px] font-semibold text-ink-800">
                  {t.name}
                </span>
                <span
                  className={`shrink-0 font-body text-xs font-semibold tabular-nums ${t.delta > 0 ? "text-brand-700" : "text-smoke-500"
                    }`}
                >
                  {t.delta > 0
                    ? `▲ ${t.delta}`
                    : t.delta < 0
                      ? `▼ ${Math.abs(t.delta)}`
                      : "estável"}
                </span>
              </div>
              <div
                className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-muted"
                role="meter"
                aria-label={`Incidência de ${t.name} em ${bank}: ${t.incidence}%`}
                aria-valuenow={t.incidence}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className={`bar-grow h-full rounded-full ${i === 0
                    ? "bg-brand-700"
                    : i === 1
                      ? "bg-brand-500"
                      : "bg-ink-400/70"
                    }`}
                  style={{ width: `${t.incidence}%` }}
                />
              </div>
            </div>
            <span className="text-right font-body text-lg font-bold tabular-nums tracking-tight text-ink-800">
              {t.incidence}
              <span className="ml-0.5 text-xs font-semibold text-smoke-500">%</span>
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-card bg-ink-800 px-5 py-4 text-[14px] leading-relaxed text-ink-100">
        <span
          className="mt-1.5 size-2 shrink-0 rounded-full bg-brand-400"
          aria-hidden
        />
        <span>
          O mentor usa o mapa para direcionar blocos de questões e revisões ao
          que realmente pesa na banca que você busca — esforço onde ele rende.
        </span>
      </div>

      <p className="mt-4 text-xs text-smoke-500">
        Demonstração ilustrativa — percentuais de exemplo, não são dados reais
        de nenhuma banca.
      </p>
    </div>
  );
}
