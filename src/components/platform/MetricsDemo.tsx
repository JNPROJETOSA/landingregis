"use client";
import { useState } from "react";

/**
 * Demo interativa de métricas — permite alternar entre três perspectivas:
 * "Evolução no tempo", "Por grande área" e "Simulados".
 * Todos os dados são explicitamente identificados como ilustrativos.
 */
type Perspective = "tempo" | "areas" | "simulados";

const points = [
  { d: "24/10", v: 70 },
  { d: "08/11", v: 72.5 },
  { d: "19/11", v: 76 },
  { d: "23/11", v: 80 },
];
const meta = 75;

const kpis = [
  { k: "Aproveitamento geral", v: "73,3%", s: "acertos / questões resolvidas" },
  { k: "Último bloco", v: "80,0%", s: "23/11/2026" },
  { k: "Total de questões", v: "195", s: "143 acertos · 52 erros" },
  { k: "Blocos resolvidos", v: "4", s: "histórico sequencial" },
];

const areasData = [
  { name: "Ginecologia e Obstetrícia", pct: 80, blocks: "12 blocos", tag: "Consolidando", tone: "brand" },
  { name: "Clínica Médica", pct: 78, blocks: "18 blocos", tag: "Foco de revisão", tone: "navy" },
  { name: "Medicina Preventiva", pct: 76, blocks: "10 blocos", tag: "Ritmo estável", tone: "brand" },
  { name: "Cirurgia Geral", pct: 73, blocks: "14 blocos", tag: "Priorizar na banca", tone: "amber" },
  { name: "Pediatria", pct: 69, blocks: "11 blocos", tag: "Caderno de erros", tone: "amber" },
] as const;

const simuladosData = [
  { name: "Simulado 01 · Geral", date: "18/10", score: "68%", time: "4h45", note: "Mapeamento inicial de ritmo e gestão de tempo." },
  { name: "Simulado 02 · Foco banca", date: "08/11", score: "74%", time: "4h20", note: "Evolução em Preventiva e GO; ajuste em Pediatria." },
  { name: "Simulado 03 · Modo prova", date: "22/11", score: "79%", time: "4h05", note: "Maior constância no último terço da prova." },
] as const;

export function MetricsDemo() {
  const [perspective, setPerspective] = useState<Perspective>("tempo");

  const W = 820;
  const H = 260;
  const pad = { t: 20, b: 36, l: 48, r: 24 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const x = (i: number) => pad.l + (i / (points.length - 1)) * iw;
  const y = (v: number) => pad.t + (1 - (v - 60) / 40) * ih;

  const line = points.map((p, i) => `${i ? "L" : "M"}${x(i)},${y(p.v)}`).join(" ");
  const area = `${line} L${x(points.length - 1)},${y(60)} L${x(0)},${y(60)} Z`;

  return (
    <div>
      {/* Seletor de perspectiva */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Perspectiva de métricas"
          className="inline-flex flex-wrap rounded-lg bg-surface-muted p-1"
        >
          {[
            { id: "tempo", label: "Evolução no tempo" },
            { id: "areas", label: "Por grande área" },
            { id: "simulados", label: "Simulados" },
          ].map((tab) => {
            const on = perspective === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setPerspective(tab.id as Perspective)}
                className={`rounded-md px-3.5 py-1.5 font-body text-xs font-semibold transition-all duration-200 ${
                  on
                    ? "bg-navy-800 text-white shadow-subtle"
                    : "text-smoke-600 hover:text-navy-800"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-md bg-brand-50 px-3 py-1 font-body text-xs font-semibold text-brand-800 ring-1 ring-brand-200">
          Base para decisão com o mentor
        </span>
      </div>

      {perspective === "tempo" && (
        <div key="tempo" className="panel-enter">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="rounded-md bg-navy-800 px-3 py-1 font-body text-xs font-semibold text-white">
              Clínica Médica
            </span>
            <h4 className="font-display text-xl font-medium tracking-tight text-navy-800">
              Insuficiência Renal Aguda e Glomerulopatias
            </h4>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-5 border-y border-line py-5 sm:grid-cols-4">
            {kpis.map((k) => (
              <div key={k.k} className="min-w-0">
                <p className="text-xs font-medium text-smoke-600">{k.k}</p>
                <p className="mt-1.5 font-body text-2xl font-bold tabular-nums tracking-tight text-navy-800 sm:text-[28px]">
                  {k.v}
                </p>
                <p className="mt-0.5 text-xs text-smoke-500">{k.s}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-card border border-line bg-white p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-body text-sm font-semibold text-navy-800">
                Curva de evolução
              </p>
              <p className="flex items-center gap-5 text-xs font-medium text-smoke-600">
                <span className="inline-flex items-center gap-2">
                  <span className="h-0.5 w-4 rounded-full bg-brand-600" aria-hidden />
                  Aproveitamento
                </span>
                <span className="inline-flex items-center gap-2">
                  <span
                    className="h-0 w-4 border-t border-dashed border-navy-500"
                    aria-hidden
                  />
                  Meta {meta}%
                </span>
              </p>
            </div>

            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="mt-4 h-auto w-full"
              role="img"
              aria-label="Gráfico ilustrativo de evolução de aproveitamento: de 70% em 24/10 a 80% em 23/11"
            >
              <defs>
                <linearGradient id="mgrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2a9d90" stopOpacity="0.16" />
                  <stop offset="100%" stopColor="#2a9d90" stopOpacity="0" />
                </linearGradient>
              </defs>

              {[0, 10, 15, 20, 30, 40].map((g) => {
                const val = 60 + g;
                const isMeta = val === meta;
                if (!isMeta && val % 10 !== 0) return null;
                return (
                  <g key={g}>
                    <line
                      x1={pad.l}
                      x2={W - pad.r}
                      y1={y(val)}
                      y2={y(val)}
                      stroke={isMeta ? "#176E65" : "#E3E7EB"}
                      strokeDasharray={isMeta ? "5 5" : undefined}
                      strokeWidth={isMeta ? 1.25 : 1}
                    />
                    <text
                      x={pad.l - 10}
                      y={y(val) + 4}
                      textAnchor="end"
                      fontSize="12"
                      fill={isMeta ? "#176E65" : "#647485"}
                      fontFamily="var(--font-body), ui-sans-serif, system-ui"
                    >
                      {val}%
                    </text>
                  </g>
                );
              })}

              <path d={area} fill="url(#mgrad)" />
              <path
                d={line}
                fill="none"
                stroke="#1E8277"
                strokeWidth="2.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {points.map((p, i) => (
                <circle
                  key={i}
                  cx={x(i)}
                  cy={y(p.v)}
                  r="5"
                  fill="#ffffff"
                  stroke="#176E65"
                  strokeWidth="2.5"
                />
              ))}
              {points.map((p, i) => (
                <text
                  key={i}
                  x={x(i)}
                  y={H - 10}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#536273"
                  fontFamily="var(--font-body), ui-sans-serif, system-ui"
                >
                  {p.d}
                </text>
              ))}
            </svg>
          </div>
        </div>
      )}

      {perspective === "areas" && (
        <div key="areas" className="panel-enter space-y-3">
          {areasData.map((a) => (
            <div
              key={a.name}
              className="rounded-card border border-line bg-white p-4 sm:px-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-body text-[15px] font-semibold text-navy-800">
                    {a.name}
                  </p>
                  <p className="text-xs text-smoke-500">{a.blocks} registrados</p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                      a.tone === "brand"
                        ? "bg-brand-50 text-brand-800"
                        : a.tone === "navy"
                          ? "bg-navy-50 text-navy-800"
                          : "bg-amber-50 text-amber-900"
                    }`}
                  >
                    {a.tag}
                  </span>
                  <span className="font-body text-xl font-bold tabular-nums text-navy-800">
                    {a.pct}%
                  </span>
                </div>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-muted">
                <div
                  className={`bar-grow h-full rounded-full ${
                    a.pct >= 76 ? "bg-brand-600" : "bg-navy-700"
                  }`}
                  style={{ width: `${a.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {perspective === "simulados" && (
        <div key="simulados" className="panel-enter grid gap-4 md:grid-cols-3">
          {simuladosData.map((s) => (
            <div
              key={s.name}
              className="flex flex-col justify-between rounded-card border border-line bg-white p-5"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-brand-700">
                    {s.date}
                  </span>
                  <span className="rounded bg-surface-muted px-2 py-0.5 text-[11px] font-medium tabular-nums text-smoke-600">
                    Tempo: {s.time}
                  </span>
                </div>
                <p className="mt-2 font-body text-[15px] font-semibold text-navy-800">
                  {s.name}
                </p>
                <p className="mt-3 font-display text-4xl font-semibold tabular-nums text-navy-800">
                  {s.score}
                </p>
              </div>
              <p className="mt-4 border-t border-line pt-3 text-xs leading-relaxed text-smoke-600">
                {s.note}
              </p>
            </div>
          ))}
        </div>
      )}

      <p className="mt-5 text-xs text-smoke-500">
        Demonstração ilustrativa — dados de exemplo, não pertencem a um aluno.
      </p>
    </div>
  );
}
