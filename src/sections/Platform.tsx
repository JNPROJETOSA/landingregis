"use client";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { AgendaDemo } from "@/components/platform/AgendaDemo";
import { MetricsDemo } from "@/components/platform/MetricsDemo";
import { IncidenceMapDemo } from "@/components/platform/IncidenceMapDemo";
import { ReportDemo } from "@/components/platform/ReportDemo";

/**
 * A Plataforma — grande vitrine tecnológica em azul profundo com light-sweep
 * discreto na moldura e transições fluidas via Framer Motion (layoutId +
 * AnimatePresence).
 */
const tabs = [
  {
    id: "agenda",
    label: "Agenda estratégica",
    benefit: "Seu planejamento organizado e ajustado à sua rotina.",
    desc: "Revisões programadas, blocos de estudo e caderno de erros organizados em um planejamento semanal atualizado junto com o seu mentor.",
  },
  {
    id: "metricas",
    label: "Evolução por tema",
    benefit: "Entenda sua evolução e identifique onde concentrar esforços.",
    desc: "Métricas de desempenho por assunto, histórico de exercícios e acompanhamento claro das áreas que já evoluíram e das que pedem reforço.",
  },
  {
    id: "incidencia",
    label: "Mapa de Incidência",
    benefit: "Visualize os assuntos mais recorrentes nas suas provas.",
    desc: "Análise de incidência por banca para ajudar você e o mentor a direcionar o tempo de estudo para os temas de maior relevância nos seus processos seletivos.",
  },
  {
    id: "relatorio",
    label: "Relatórios de evolução",
    benefit: "Indicadores claros para orientar as decisões da semana.",
    desc: "Mais do que gráficos: os relatórios reúnem progresso, pontos fortes e áreas de atenção para embasar os ajustes feitos na reunião semanal com o mentor.",
  },
] as const;

type TabId = (typeof tabs)[number]["id"];

const more = [
  {
    k: "Simulados e modo prova",
    d: "Acompanhe resultados em condições de prova e identifique oportunidades concretas de melhoria.",
  },
  {
    k: "Revisões programadas e flashcards",
    d: "Organize revisões, flashcards e pontos que precisam de atenção contínua na sua rotina.",
  },
  {
    k: "Caderno de erros",
    d: "Centralize questões desafiadoras e transforme erros recorrentes em revisões direcionadas.",
  },
  {
    k: "Check-ins de bem-estar",
    d: "Registre como você está vivenciando a rotina de estudos para que o mentor compreenda seu contexto ao ajustar o ritmo.",
  },
] as const;

const demoByTab: Record<TabId, () => React.ReactNode> = {
  agenda: () => <AgendaDemo />,
  metricas: () => <MetricsDemo />,
  incidencia: () => <IncidenceMapDemo />,
  relatorio: () => <ReportDemo />,
};

export function Platform() {
  const [active, setActive] = useState<TabId>("agenda");
  const current = tabs.find((t) => t.id === active)!;
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="plataforma"
      className="section-overlap section-pad bg-platform relative isolate overflow-x-clip text-ondark"
      aria-labelledby="plataforma-heading"
    >
      <div className="tech-grid" aria-hidden />
      <div className="shell-wide relative z-10">
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-14">
            <div className="min-w-0 lg:col-span-8">
              <p className="section-label on-ink">
                <span className="dot" aria-hidden />
                Plataforma integrada
              </p>
              <h2
                id="plataforma-heading"
                className="type-h2-lg mt-6 font-display font-medium text-ondark"
              >
                Uma plataforma completa para{" "}
                <span className="italic text-navy-300">
                  acompanhar cada decisão.
                </span>
              </h2>
            </div>
            <div className="min-w-0 lg:col-span-4 lg:pb-2">
              <p className="text-[16px] leading-relaxed text-ondark-soft">
                A plataforma fornece organização, métricas e visão clara do seu
                progresso. O mentor interpreta essas informações com você e
                transforma dados em direcionamento prático toda semana.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:mt-16 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[350px_minmax(0,1fr)]">
          {/* Trilho de módulos — desktop */}
          <div className="hidden lg:block">
            <div
              role="tablist"
              aria-orientation="vertical"
              aria-label="Funcionalidades da plataforma"
              className="flex flex-col gap-2 lg:sticky lg:top-28"
            >
              {tabs.map((t, i) => {
                const isActive = active === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActive(t.id)}
                    className={`group relative overflow-hidden rounded-ds-md border px-5 py-4 text-left transition-colors duration-200 ${
                      isActive
                        ? "border-white/15 bg-navy-750 shadow-dark"
                        : "border-transparent hover:border-white/10 hover:bg-white/[0.04]"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="platform-active-bar"
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 36,
                        }}
                        aria-hidden
                        className="absolute inset-y-3 left-0 w-[3px] rounded-full bg-brand-400"
                      />
                    )}
                    <span className="flex items-center justify-between gap-3">
                      <span
                        className={`font-display text-[19px] font-medium tracking-tight transition-colors ${
                          isActive
                            ? "text-white"
                            : "text-ondark-soft group-hover:text-white"
                        }`}
                      >
                        {t.label}
                      </span>
                      <span
                        className={`font-body text-[11px] font-semibold tabular-nums ${
                          isActive ? "text-brand-300" : "text-navy-400"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </span>
                    <span
                      className={`mt-1.5 block text-[13px] leading-snug transition-colors ${
                        isActive ? "text-ondark-soft" : "text-navy-400"
                      }`}
                    >
                      {t.benefit}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chips — mobile / tablet */}
          <div
            className="flex min-w-0 gap-2 overflow-x-auto pb-1 lg:hidden"
            role="tablist"
            aria-label="Funcionalidades da plataforma"
          >
            {tabs.map((t) => {
              const isActive = active === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(t.id)}
                  className={`min-h-[44px] shrink-0 rounded-ds-md border px-4 py-2.5 font-body text-[13px] font-semibold transition-colors ${
                    isActive
                      ? "border-brand-400/50 bg-navy-750 text-white"
                      : "border-white/10 bg-white/[0.04] text-ondark-soft hover:bg-white/[0.08]"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Janela de produto com light-sweep sutil */}
          <Reveal variant="scale" delay={60} className="min-w-0">
            <div className="relative">
              <div
                aria-hidden
                className="glow-blue pointer-events-none absolute -inset-8 -z-10 opacity-80"
              />
              <div className="relative overflow-hidden rounded-ds-xl border border-white/[0.12] bg-surface-light shadow-dark">
                {/* Light sweep sutil percorrendo a barra superior da janela */}
                <div className="relative flex flex-wrap items-center justify-between gap-3 overflow-hidden border-b border-white/10 bg-navy-900 px-5 py-3.5 sm:px-7">
                  <div
                    aria-hidden
                    className="animate-sweep pointer-events-none absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent"
                  />
                  <div className="relative flex items-center gap-3">
                    <span className="flex gap-1.5" aria-hidden>
                      <span className="size-2.5 rounded-full bg-white/15" />
                      <span className="size-2.5 rounded-full bg-white/15" />
                      <span className="size-2.5 rounded-full bg-white/15" />
                    </span>
                    <span className="font-body text-xs font-medium text-navy-300">
                      regisdencia · seu painel
                    </span>
                  </div>
                  <span className="relative font-body text-xs font-semibold text-brand-300">
                    {current.label}
                  </span>
                </div>

                <div
                  role="tabpanel"
                  aria-label={current.label}
                  className="p-5 text-navy-800 sm:p-8 lg:p-10"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active}
                      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
                      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="mb-7 flex flex-col gap-2 border-b border-line pb-6 xl:flex-row xl:items-baseline xl:justify-between xl:gap-10">
                        <div>
                          <span className="inline-block font-body text-[11px] font-semibold uppercase tracking-wider text-brand-700">
                            Módulo interativo · {current.label}
                          </span>
                          <h3 className="mt-1 font-display text-xl font-medium text-navy-800 sm:text-2xl">
                            {current.benefit}
                          </h3>
                        </div>
                        <p className="max-w-xl text-[15px] leading-relaxed text-smoke-600">
                          {current.desc}
                        </p>
                      </div>
                      {demoByTab[active]()}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={80}>
          <div className="mt-16 border-t border-white/10 pt-9 lg:mt-20">
            <p className="font-display text-xl font-medium italic text-ondark">
              Também integrado à plataforma
            </p>
            <div className="mt-7 grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
              {more.map((m) => (
                <div key={m.k} className="min-w-0">
                  <h3 className="flex items-center gap-2.5 font-body text-[15px] font-semibold text-ondark">
                    <span
                      className="size-1.5 shrink-0 rounded-full bg-brand-400"
                      aria-hidden
                    />
                    {m.k}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-ondark-soft">
                    {m.d}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
