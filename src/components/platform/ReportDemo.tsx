"use client";

/**
 * "Relatório de ajuste" — visão do mentor sobre o aluno.
 * Dados ilustrativos, identificados na UI.
 */
const stats = [
  {
    k: "Progresso global",
    v: "78,9%",
    s: "2.169 acertos em 2.750 questões",
    tag: "Regular",
    tone: "amber",
  },
  {
    k: "Melhor área",
    v: "79,8%",
    s: "Ginecologia e Obstetrícia · 471/590",
    tag: "Ponto forte",
    tone: "brand",
  },
  {
    k: "Área de atenção",
    v: "77,7%",
    s: "Clínica Médica · 647/840",
    tag: "Focar revisão",
    tone: "warn",
  },
  {
    k: "Revisões hoje",
    v: "3",
    s: "tópicos programados pelo algoritmo SRS",
    tag: "Agenda SRS",
    tone: "neutral",
  },
] as const;

const toneClass: Record<(typeof stats)[number]["tone"], string> = {
  amber: "bg-amber-50 text-amber-900 ring-amber-300/70",
  brand: "bg-brand-50 text-brand-800 ring-brand-200",
  warn: "bg-red-50 text-red-800 ring-red-200",
  neutral: "bg-surface-muted text-smoke-700 ring-line",
};

export function ReportDemo() {
  return (
    <div>
      <div className="divide-y divide-line border-y border-line">
        {stats.map((c) => (
          <div
            key={c.k}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 py-4 sm:grid-cols-[12rem_minmax(0,1fr)_auto] sm:gap-4"
          >
            <p className="text-[13px] font-semibold text-smoke-600">
              {c.k}
            </p>
            <p className="order-3 col-span-2 font-body text-xl font-bold tabular-nums tracking-tight text-ink-800 sm:order-2 sm:col-span-1 sm:text-2xl">
              {c.v}
              <span className="mt-0.5 block text-[13px] font-medium tracking-normal text-smoke-600 sm:ml-3 sm:mt-0 sm:inline">
                {c.s}
              </span>
            </p>
            <span
              className={`order-2 justify-self-end rounded-md px-2.5 py-1 font-body text-xs font-semibold ring-1 sm:order-3 ${toneClass[c.tone]}`}
            >
              {c.tag}
            </span>
          </div>
        ))}
      </div>

      {/* Decisão da semana — navy institucional */}
      <div className="mt-6 rounded-card bg-ink-800 p-5 text-porcelain-50 sm:p-7">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="font-display text-lg font-medium text-white">
            Decisão da semana
          </p>
          <p className="text-xs font-medium text-ink-300">
            revisada no alinhamento de domingo · 17h
          </p>
        </div>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-100 sm:text-[16px]">
          Revisões de Clínica Médica movidas para a manhã de sexta; bloco de
          Ginecologia mantido em intensidade alta — a área está consolidando e o
          esforço compensa.
        </p>
        <p className="mt-4 font-body text-xs font-semibold text-brand-300">
          Próxima agenda gerada em 27/11
        </p>
      </div>

      <p className="mt-4 text-xs text-smoke-500">
        Demonstração ilustrativa — dados de exemplo, não pertencem a um aluno.
      </p>
    </div>
  );
}
