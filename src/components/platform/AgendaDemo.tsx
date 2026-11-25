"use client";
import { useState } from "react";

/**
 * Demo interativa da agenda semanal — permite alternar entre dois cenários
 * ilustrativos ("Semana padrão" × "Semana com plantões") para demonstrar
 * conceitualmente como o mentor reorganiza a semana quando a rotina muda.
 */
type Task = { time: string; label: string; done?: boolean; shift?: boolean };
type Day = {
  name: string;
  date: string;
  badge?: "HOJE" | "Ajustado";
  done: number;
  total: number;
  tasks: Task[];
};

type ScenarioId = "padrao" | "plantoes";

const scenarios: Record<
  ScenarioId,
  {
    label: string;
    summaryTitle: string;
    summaryText: string;
    mentorCallout: string;
    days: Day[];
  }
> = {
  padrao: {
    label: "Semana padrão",
    summaryTitle: "Semana equilibrada",
    summaryText:
      "Blocos distribuídos ao longo dos dias úteis, simulado em modo prova no sábado e reunião semanal no domingo.",
    mentorCallout:
      "A semana anterior é o ponto de partida da próxima — você e o mentor revisam tudo na reunião semanal.",
    days: [
      {
        name: "Segunda",
        date: "23/11",
        badge: "HOJE",
        done: 3,
        total: 3,
        tasks: [
          { time: "07:00 – 08:30", label: "Revisão programada (50 cards)", done: true },
          { time: "09:00 – 11:30", label: "Bloco dirigido: Clínica Médica", done: true },
          { time: "15:30 – 17:30", label: "Análise no caderno de erros", done: true },
        ],
      },
      {
        name: "Terça",
        date: "24/11",
        done: 2,
        total: 2,
        tasks: [
          { time: "07:00 – 08:30", label: "Revisão programada", done: true },
          { time: "09:00 – 11:30", label: "Bloco dirigido: Cirurgia", done: true },
        ],
      },
      {
        name: "Quarta",
        date: "25/11",
        done: 2,
        total: 2,
        tasks: [
          { time: "07:00 – 08:30", label: "Revisão programada", done: true },
          { time: "09:00 – 11:00", label: "Bloco dirigido: GO", done: true },
        ],
      },
      {
        name: "Quinta",
        date: "26/11",
        done: 1,
        total: 2,
        tasks: [
          { time: "07:00 – 08:30", label: "Revisão programada", done: true },
          { time: "09:00 – 11:00", label: "Bloco dirigido: Pediatria", done: false },
        ],
      },
      {
        name: "Sexta",
        date: "27/11",
        done: 0,
        total: 2,
        tasks: [
          { time: "07:00 – 08:30", label: "Revisão programada", done: false },
          { time: "09:00 – 11:00", label: "Bloco dirigido: Preventiva", done: false },
        ],
      },
      {
        name: "Sábado",
        date: "28/11",
        done: 0,
        total: 1,
        tasks: [
          { time: "08:00 – 13:00", label: "Simulado em modo prova", done: false },
        ],
      },
      {
        name: "Domingo",
        date: "29/11",
        done: 0,
        total: 1,
        tasks: [
          { time: "17:00 – 18:00", label: "Reunião semanal com o mentor", done: false },
        ],
      },
    ],
  },
  plantoes: {
    label: "Semana com plantões",
    summaryTitle: "Reorganizada pelo mentor",
    summaryText:
      "Com plantões de 12h na terça e na quinta, o mentor protege o descanso, mantém revisões curtas e concentra blocos nos dias livres.",
    mentorCallout:
      "Simulação ilustrativa de como o mentor reorganiza o planejamento com você quando surgem plantões ou imprevistos.",
    days: [
      {
        name: "Segunda",
        date: "23/11",
        badge: "HOJE",
        done: 3,
        total: 3,
        tasks: [
          { time: "07:00 – 08:30", label: "Revisão programada (50 cards)", done: true },
          { time: "09:00 – 11:30", label: "Clínica Médica (antecipado)", done: true },
          { time: "15:00 – 17:00", label: "Caderno de erros prioritário", done: true },
        ],
      },
      {
        name: "Terça",
        date: "24/11",
        badge: "Ajustado",
        done: 1,
        total: 1,
        tasks: [
          { time: "07:00 – 19:00", label: "Plantão 12h · bloco remanejado", shift: true },
          { time: "20:00 – 20:30", label: "Revisão leve (20 cards)", done: true },
        ],
      },
      {
        name: "Quarta",
        date: "25/11",
        badge: "Ajustado",
        done: 2,
        total: 2,
        tasks: [
          { time: "09:30 – 11:30", label: "Cirurgia (trazido da terça)", done: true },
          { time: "14:00 – 16:00", label: "Bloco dirigido: GO", done: true },
        ],
      },
      {
        name: "Quinta",
        date: "26/11",
        badge: "Ajustado",
        done: 1,
        total: 1,
        tasks: [
          { time: "07:00 – 19:00", label: "Plantão 12h · descanso preservado", shift: true },
          { time: "20:00 – 20:30", label: "Revisão leve (20 cards)", done: true },
        ],
      },
      {
        name: "Sexta",
        date: "27/11",
        badge: "Ajustado",
        done: 0,
        total: 2,
        tasks: [
          { time: "09:00 – 11:00", label: "Pediatria (trazido da quinta)", done: false },
          { time: "14:00 – 15:30", label: "Preventiva · revisão objetiva", done: false },
        ],
      },
      {
        name: "Sábado",
        date: "28/11",
        done: 0,
        total: 1,
        tasks: [
          { time: "08:30 – 12:30", label: "Simulado em modo prova", done: false },
        ],
      },
      {
        name: "Domingo",
        date: "29/11",
        done: 0,
        total: 1,
        tasks: [
          { time: "17:00 – 18:00", label: "Reunião semanal com o mentor", done: false },
        ],
      },
    ],
  },
};

function DayCard({ day, featured }: { day: Day; featured: boolean }) {
  return (
    <div
      className={`flex h-full flex-col rounded-card border p-4 transition-colors duration-200 ${
        featured
          ? "border-navy-800 bg-navy-800 text-porcelain-50 shadow-subtle"
          : day.badge === "Ajustado"
            ? "border-brand-300/80 bg-brand-50/35"
            : "border-line bg-porcelain-50/70"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-baseline gap-2">
          <span
            className={`font-body text-[14px] font-semibold ${
              featured ? "text-white" : "text-navy-800"
            }`}
          >
            {day.name}
          </span>
          <span
            className={`text-xs tabular-nums ${
              featured ? "text-navy-300" : "text-smoke-500"
            }`}
          >
            {day.date}
          </span>
        </div>
        {day.badge === "HOJE" ? (
          <span className="rounded bg-brand-400/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-200">
            Hoje
          </span>
        ) : day.badge === "Ajustado" ? (
          <span className="rounded bg-brand-700 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
            Ajustado
          </span>
        ) : (
          <span
            className={`text-xs font-medium tabular-nums ${
              featured ? "text-navy-300" : "text-smoke-500"
            }`}
          >
            {day.done}/{day.total}
          </span>
        )}
      </div>

      <ul className="mt-3.5 space-y-2">
        {day.tasks.map((t) => (
          <li
            key={`${t.time}-${t.label}`}
            className={`flex items-start gap-2.5 rounded-lg px-3 py-2.5 ${
              t.shift
                ? "border border-dashed border-navy-800/25 bg-navy-800/[0.04]"
                : featured
                  ? t.done
                    ? "bg-white/10"
                    : "bg-white/[0.05]"
                  : t.done
                    ? "border border-brand-200/80 bg-brand-50/75"
                    : "border border-line bg-white"
            }`}
          >
            {!t.shift && (
              <span
                className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full ${
                  featured
                    ? t.done
                      ? "bg-brand-400 text-navy-950"
                      : "ring-1 ring-navy-400"
                    : t.done
                      ? "bg-brand-700 text-white"
                      : "ring-1 ring-smoke-300"
                }`}
                aria-hidden
              >
                {t.done && (
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12l5 5L20 7"
                      stroke="currentColor"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
            )}
            <span className="min-w-0">
              <span
                className={`block text-[11px] font-medium tabular-nums ${
                  featured ? "text-navy-300" : "text-smoke-500"
                }`}
              >
                {t.time}
              </span>
              <span
                className={`mt-0.5 block text-[13px] font-medium leading-snug ${
                  t.shift
                    ? "text-navy-700"
                    : featured
                      ? "text-porcelain-50"
                      : t.done
                        ? "text-navy-800"
                        : "text-smoke-700"
                }`}
              >
                {t.label}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AgendaDemo() {
  const [scenario, setScenario] = useState<ScenarioId>("padrao");
  const [activeDay, setActiveDay] = useState(0);
  const current = scenarios[scenario];
  const isToday = current.days[activeDay].badge === "HOJE";

  return (
    <div>
      {/* Seletor de cenário conceitual */}
      <div className="mb-6 flex flex-col gap-3 rounded-card border border-line bg-white p-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-body text-xs font-semibold text-smoke-600">
            Simular cenário de rotina:
          </span>
          <div
            role="radiogroup"
            aria-label="Cenário ilustrativo de rotina semanal"
            className="inline-flex w-full rounded-lg bg-surface-muted p-1 sm:w-auto"
          >
            {(["padrao", "plantoes"] as const).map((id) => {
              const on = scenario === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setScenario(id)}
                  className={`min-h-[38px] flex-1 rounded-md px-3 py-1.5 text-center font-body text-xs font-semibold transition-all duration-200 sm:min-h-0 sm:flex-none sm:px-3.5 ${
                    on
                      ? "bg-navy-800 text-white shadow-subtle"
                      : "text-smoke-600 hover:text-navy-800"
                  }`}
                >
                  {scenarios[id].label}
                </button>
              );
            })}
          </div>
        </div>
        <p className="text-xs font-medium text-brand-700">
          {scenario === "plantoes"
            ? "Blocos remanejados pelo mentor nos dias livres"
            : "Experimente alternar para “Semana com plantões”"}
        </p>
      </div>

      {/* Mobile: régua de dias */}
      <div
        className="flex gap-2 overflow-x-auto pb-3 lg:hidden"
        role="tablist"
        aria-label="Dias da semana"
      >
        {current.days.map((d, i) => (
          <button
            key={d.name}
            type="button"
            role="tab"
            aria-selected={activeDay === i}
            onClick={() => setActiveDay(i)}
            className={`shrink-0 rounded-lg px-3.5 py-2 font-body text-[13px] font-semibold transition-colors ${
              activeDay === i
                ? "bg-navy-800 text-white"
                : d.badge === "Ajustado"
                  ? "border border-brand-300 bg-brand-50 text-brand-800"
                  : "border border-line bg-white text-smoke-600"
            }`}
          >
            {d.name.slice(0, 3)}
            <span
              className={`ml-1.5 text-[11px] font-normal tabular-nums ${
                activeDay === i ? "text-navy-300" : "text-smoke-500"
              }`}
            >
              {d.date}
            </span>
          </button>
        ))}
      </div>

      {/* Mobile: cartão do dia ativo */}
      <div key={`m-${scenario}-${activeDay}`} className="panel-enter lg:hidden">
        <DayCard day={current.days[activeDay]} featured={isToday} />
        <p className="mt-3 text-xs leading-relaxed text-smoke-600">
          {current.mentorCallout}
        </p>
      </div>

      {/* Desktop: grade 4×2 equilibrada */}
      <div key={`d-${scenario}`} className="panel-enter hidden lg:block">
        <div className="grid grid-cols-4 gap-3.5">
          {current.days.map((d) => (
            <div key={d.name} className="min-w-0">
              <DayCard day={d} featured={d.badge === "HOJE"} />
            </div>
          ))}

          {/* 8ª célula: resumo contextual do cenário */}
          <div className="flex flex-col justify-between rounded-card border border-line-blue bg-surface-blue/75 p-4">
            <div>
              <span className="inline-block font-body text-[11px] font-semibold uppercase tracking-wide text-brand-700">
                {current.label}
              </span>
              <p className="mt-2 font-display text-xl font-semibold leading-snug text-navy-800">
                {current.summaryTitle}
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-smoke-600">
                {current.summaryText}
              </p>
            </div>
            <p className="mt-4 border-t border-line-blue pt-3 text-xs leading-relaxed text-smoke-600">
              {current.mentorCallout}
            </p>
          </div>
        </div>
      </div>

      <p className="mt-5 text-xs text-smoke-500">
        Demonstração conceitual ilustrativa — o ajuste semanal é conduzido pelo
        mentor junto com você.
      </p>
    </div>
  );
}
