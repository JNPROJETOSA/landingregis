"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export type JourneyStep = {
  id: "avaliacao" | "estrategia" | "execucao" | "acompanhamento";
  k: string;
  t: string;
  d: string;
  mentorRole: string;
  platformRole: string;
  previewTitle: string;
  previewBadge: string;
};

/**
 * Visualização dedicada e distinta para cada uma das 4 etapas:
 * 01 Avaliação inicial -> Mapeamento diagnóstico em 4 categorias reais
 * 02 Construção da estratégia -> Priorização por bancas e áreas
 * 03 Execução do planejamento -> Rotina semanal na agenda + ferramentas
 * 04 Acompanhamento semanal -> Evolução acompanhada e ajuste de rota
 */
function StageIllustration({ step }: { step: JourneyStep }) {
  if (step.id === "avaliacao") {
    const axes = [
      { label: "Objetivos", value: "Provas e bancas pretendidas", pct: 90 },
      { label: "Rotina", value: "Internato, plantões e trabalho", pct: 84 },
      { label: "Disponibilidade", value: "Horas semanais reais mapeadas", pct: 78 },
      { label: "Dificuldades", value: "Lacunas e pontos de atenção", pct: 72 },
    ];
    return (
      <div className="space-y-3">
        <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-300">
          Leitura inicial individual (ilustrativo)
        </p>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {axes.map((a, idx) => (
            <div
              key={a.label}
              className="rounded-ds-md border border-white/[0.1] bg-[#0B172E] p-3.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-body text-xs font-semibold text-white">
                  {a.label}
                </span>
                <span className="font-body text-[10px] font-bold tabular-nums text-brand-300">
                  0{idx + 1}
                </span>
              </div>
              <p className="mt-1 text-xs leading-snug text-navy-300">{a.value}</p>
              <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-brand-400"
                  style={{ width: `${a.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (step.id === "estrategia") {
    const priorities = [
      { area: "Clínica Médica", weight: "Prioridade alta", pct: 86 },
      { area: "Preventiva e Saúde Coletiva", weight: "Incidência frequente", pct: 76 },
      { area: "Ginecologia e Obstetrícia", weight: "Revisão estruturada", pct: 70 },
      { area: "Cirurgia e Pediatria", weight: "Blocos equilibrados", pct: 64 },
    ];
    return (
      <div className="space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-300">
            Planejamento sob medida por banca (ilustrativo)
          </p>
          <span className="rounded bg-white/[0.08] px-2 py-0.5 font-body text-[10px] font-semibold text-ondark-soft">
            Integrado ao seu cursinho
          </span>
        </div>
        <div className="space-y-2.5 rounded-ds-md border border-white/[0.1] bg-[#0B172E] p-4">
          {priorities.map((p) => (
            <div key={p.area}>
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-body text-xs font-semibold text-white">
                  {p.area}
                </span>
                <span className="font-body text-[11px] text-brand-300">
                  {p.weight}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-300"
                  style={{ width: `${p.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (step.id === "execucao") {
    const blocks = [
      { slot: "07:00 – 08:30", task: "Revisões programadas e flashcards", status: "Concluído" },
      { slot: "09:00 – 11:30", task: "Bloco dirigido de Clínica Médica", status: "Concluído" },
      { slot: "15:30 – 17:00", task: "Caderno de erros · questões selecionadas", status: "Em foco" },
      { slot: "Sábado · 08:00", task: "Simulado em modo prova cronometrado", status: "Agendado" },
    ];
    return (
      <div className="space-y-3">
        <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-300">
          Execução acompanhada na plataforma (ilustrativo)
        </p>
        <ul className="divide-y divide-white/[0.09] rounded-ds-md border border-white/[0.1] bg-[#0B172E] px-4">
          {blocks.map((b) => (
            <li key={b.task} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <span className="block font-body text-[11px] tabular-nums text-navy-300">
                  {b.slot}
                </span>
                <span className="block truncate font-body text-[13px] font-semibold text-white">
                  {b.task}
                </span>
              </div>
              <span
                className={`shrink-0 rounded px-2 py-0.5 font-body text-[10px] font-semibold ${
                  b.status === "Concluído"
                    ? "bg-brand-500/20 text-brand-300"
                    : b.status === "Em foco"
                      ? "bg-white/15 text-white"
                      : "bg-white/[0.06] text-navy-300"
                }`}
              >
                {b.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between gap-2">
        <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-300">
          Reunião semanal e ajuste contínuo (ilustrativo)
        </p>
        <span className="font-body text-xs font-bold tabular-nums text-brand-300">
          70% → 80%
        </span>
      </div>
      <div className="rounded-ds-md border border-white/[0.1] bg-[#0B172E] p-4">
        <svg
          viewBox="0 0 360 100"
          className="h-auto w-full"
          role="img"
          aria-label="Curva ilustrativa de evolução acompanhada nas reuniões semanais"
        >
          <defs>
            <linearGradient id="step-curve" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#42b0a2" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#42b0a2" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line
            x1="16"
            x2="344"
            y1="52"
            y2="52"
            stroke="rgba(255,255,255,0.16)"
            strokeDasharray="4 4"
          />
          <path
            d="M16,74 L126,64 L236,46 L344,24 L344,92 L16,92 Z"
            fill="url(#step-curve)"
          />
          <path
            d="M16,74 L126,64 L236,46 L344,24"
            fill="none"
            stroke="#42b0a2"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {[
            [16, 74],
            [126, 64],
            [236, 46],
            [344, 24],
          ].map(([cx, cy]) => (
            <circle
              key={`${cx}-${cy}`}
              cx={cx}
              cy={cy}
              r="4.5"
              fill="#0B172E"
              stroke="#6ec2b5"
              strokeWidth="2"
            />
          ))}
        </svg>
        <div className="mt-3 grid grid-cols-3 gap-2 border-t border-white/[0.08] pt-3 text-center">
          <div>
            <p className="font-body text-[10px] uppercase tracking-wider text-navy-300">
              Reunião
            </p>
            <p className="mt-0.5 font-body text-xs font-semibold text-white">
              Semanal individual
            </p>
          </div>
          <div>
            <p className="font-body text-[10px] uppercase tracking-wider text-navy-300">
              Indicadores
            </p>
            <p className="mt-0.5 font-body text-xs font-semibold text-white">
              Por tema e área
            </p>
          </div>
          <div>
            <p className="font-body text-[10px] uppercase tracking-wider text-navy-300">
              Próxima semana
            </p>
            <p className="mt-0.5 font-body text-xs font-semibold text-brand-300">
              Agenda recalibrada
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepVisualPanel({
  step,
  index,
}: {
  step: JourneyStep;
  index: number;
}) {
  return (
    <div className="overflow-hidden rounded-ds-xl border border-navy-800/[0.14] bg-[#081224] text-ondark shadow-[0_28px_72px_-26px_rgba(9,19,38,0.45)]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.09] bg-[#060E1E] px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-7 items-center justify-center rounded-ds-sm bg-brand-500/20 font-body text-xs font-bold tabular-nums text-brand-300 ring-1 ring-brand-400/35">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-300">
              {step.previewTitle}
            </p>
            <p className="font-display text-lg font-medium leading-tight text-white">
              {step.t}
            </p>
          </div>
        </div>
        <span className="rounded-ds-sm border border-white/10 bg-white/[0.05] px-2.5 py-1 font-body text-[11px] font-medium text-ondark-soft">
          {step.previewBadge}
        </span>
      </div>

      <div className="p-4 sm:p-6">
        <StageIllustration step={step} />

        <div className="mt-5 grid gap-4 border-t border-white/[0.09] pt-5 sm:grid-cols-2">
          <div>
            <p className="font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-300">
              Papel do mentor
            </p>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-ondark-soft">
              {step.mentorRole}
            </p>
          </div>
          <div>
            <p className="font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-navy-300">
              Apoio da plataforma
            </p>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-ondark-soft">
              {step.platformRole}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StepsTimeline({ steps }: { steps: readonly JourneyStep[] }) {
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let raf = 0;
    const syncActiveOnScroll = () => {
      raf = 0;
      const focalY = window.innerHeight * 0.4;
      let bestIdx = 0;
      let bestDist = Infinity;

      stepRefs.current.forEach((el, idx) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const dist = Math.abs(centerY - focalY);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = idx;
        }
      });

      setActive((prev) => (prev === bestIdx ? prev : bestIdx));
    };

    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(syncActiveOnScroll);
    };

    syncActiveOnScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [steps.length]);

  const scrollToStep = (idx: number) => {
    setActive(idx);
    stepRefs.current[idx]?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "center",
    });
  };

  const progress = active / Math.max(steps.length - 1, 1);
  const current = steps[active];

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
      {/* Coluna esquerda: capítulos conduzidos pela rolagem */}
      <div className="relative min-w-0 lg:col-span-5">
        <div
          aria-hidden
          className="absolute bottom-10 left-[17px] top-6 w-[2px] bg-navy-800/12 sm:left-[21px]"
        >
          <div
            className="h-full w-full origin-top bg-brand-600 transition-transform duration-500 ease-soft"
            style={{ transform: `scaleY(${progress})` }}
          />
        </div>

        <ol className="relative space-y-8 lg:space-y-12">
          {steps.map((s, i) => {
            const isActive = active === i;
            const isPassed = i <= active;
            return (
              <li
                key={s.id}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                data-step-index={i}
                className="relative pl-11 sm:pl-16 lg:min-h-[196px]"
              >
                <button
                  type="button"
                  onClick={() => scrollToStep(i)}
                  aria-current={isActive ? "step" : undefined}
                  className={`w-full rounded-ds-lg border p-4 text-left transition-all duration-300 ease-soft sm:p-6 ${
                    isActive
                      ? "border-navy-800/30 bg-white shadow-warm"
                      : "border-navy-800/[0.08] bg-white/55 opacity-70 hover:border-navy-800/20 hover:bg-white/95 hover:opacity-100"
                  }`}
                >
                  <span
                    className={`absolute left-0 top-5 flex size-9 items-center justify-center rounded-ds-md border font-body text-xs font-bold tabular-nums transition-all duration-300 sm:size-11 sm:text-sm ${
                      isActive
                        ? "border-brand-700 bg-navy-800 text-white shadow-lift ring-4 ring-brand-500/20"
                        : isPassed
                          ? "border-navy-800/35 bg-white text-navy-800"
                          : "border-navy-800/15 bg-white/85 text-navy-800/50"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={`font-body text-xs font-semibold uppercase tracking-wider ${
                        isActive ? "text-brand-700" : "text-smoke-500"
                      }`}
                    >
                      {s.k}
                    </span>
                    <span
                      className={`font-body text-[11px] font-semibold ${
                        isActive ? "text-brand-700" : "text-smoke-400"
                      }`}
                    >
                      {isActive ? "Etapa ativa" : ""}
                    </span>
                  </div>

                  <h3 className="type-h3 mt-2 font-display font-medium text-navy-800">
                    {s.t}
                  </h3>
                  <p className="mt-2.5 text-[14.5px] leading-relaxed text-smoke-600 sm:text-[15px]">
                    {s.d}
                  </p>
                </button>

                {/* Mobile: painel visual distinto logo abaixo de cada etapa */}
                <div className="-ml-11 mt-4 sm:ml-0 lg:hidden">
                  <StepVisualPanel step={s} index={i} />
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Coluna direita (desktop): palco sticky que muda completamente conforme a rolagem */}
      <div className="hidden lg:sticky lg:top-28 lg:col-span-7 lg:block">
        <div className="mb-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {steps.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => scrollToStep(idx)}
                aria-label={`Ir para etapa ${idx + 1}: ${s.t}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === active
                    ? "w-10 bg-brand-600"
                    : "w-3 bg-navy-800/20 hover:bg-navy-800/40"
                }`}
              />
            ))}
          </div>
          <span className="font-body text-xs font-semibold tabular-nums text-smoke-600">
            Etapa {String(active + 1).padStart(2, "0")} de 04
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <StepVisualPanel step={current} index={active} />
          </motion.div>
        </AnimatePresence>

        <p className="mt-3 text-right text-xs text-smoke-500">
          Role a página para avançar entre as etapas — ou clique em qualquer etapa
          para ir diretamente até ela.
        </p>
      </div>
    </div>
  );
}
