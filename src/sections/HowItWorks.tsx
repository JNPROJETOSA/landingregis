import { Reveal } from "@/components/ui/Reveal";
import { CTA } from "@/components/ui/CTA";
import { StepsTimeline, type JourneyStep } from "@/components/ui/StepsTimeline";

/**
 * Como funciona — Scroll Storytelling natural com progressão real entre 4 etapas
 * visualmente distintas (Avaliação -> Estratégia -> Execução -> Acompanhamento).
 */
const steps: readonly JourneyStep[] = [
  {
    id: "avaliacao",
    k: "Etapa 01 · Avaliação inicial",
    t: "Conhecemos sua realidade",
    d: "Avaliação individual de objetivos, rotina acadêmica ou profissional, dificuldades, lacunas e disponibilidade real de estudo.",
    mentorRole:
      "Conduz a avaliação inicial individual para compreender seu histórico, sua carga horária real e suas metas de prova.",
    platformRole:
      "Centraliza seu perfil, provas pretendidas e pontos de atenção que orientam o início da preparação.",
    previewTitle: "Avaliação inicial",
    previewBadge: "Ponto de partida",
  },
  {
    id: "estrategia",
    k: "Etapa 02 · Construção da estratégia",
    t: "Construímos sua rota",
    d: "Planejamento personalizado de acordo com suas provas pretendidas, prioridades por incidência e os materiais que você já utiliza.",
    mentorRole:
      "Define prioridades por banca, ritmo de revisões e como aproveitar melhor o cursinho e materiais que você já usa.",
    platformRole:
      "Reúne o Mapa de Incidência e estrutura sua primeira agenda semanal de forma clara e executável.",
    previewTitle: "Estratégia sob medida",
    previewBadge: "Sem cronograma pronto",
  },
  {
    id: "execucao",
    k: "Etapa 03 · Execução do planejamento",
    t: "Você estuda com direcionamento",
    d: "Rotina conduzida com apoio do mentor e da plataforma: agenda semanal, revisões programadas, flashcards, simulados e caderno de erros.",
    mentorRole:
      "Fica acessível pelo WhatsApp para tirar dúvidas ao longo da semana e orientar decisões pontuais na rotina.",
    platformRole:
      "Organiza agenda do dia, revisões programadas, flashcards, caderno de erros e simulados em modo prova.",
    previewTitle: "Execução acompanhada",
    previewBadge: "Dia a dia guiado",
  },
  {
    id: "acompanhamento",
    k: "Etapa 04 · Acompanhamento e ajustes semanais",
    t: "Acompanhamos e ajustamos",
    d: "Encontros semanais individuais por chamada, análise de indicadores de desempenho e atualização contínua do planejamento.",
    mentorRole:
      "Analisa seus resultados na reunião semanal por chamada e reconstrói a agenda da semana seguinte com você.",
    platformRole:
      "Consolida métricas por tema, relatórios de evolução e check-ins de bem-estar para embasar cada ajuste.",
    previewTitle: "Ciclo de ajuste semanal",
    previewBadge: "Continuidade",
  },
];

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="section-overlap section-pad bg-light-editorial relative isolate overflow-x-clip text-navy-800"
      aria-labelledby="como-funciona-heading"
    >
      <div className="tech-grid-light" aria-hidden />

      <div className="shell-wide relative z-10">
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-14">
            <div className="min-w-0 lg:col-span-7">
              <p className="section-label">
                <span className="dot" aria-hidden />
                Como funciona · acompanhamento contínuo
              </p>
              <h2
                id="como-funciona-heading"
                className="type-h2-lg mt-6 font-display font-medium text-navy-800"
              >
                Acompanhamento contínuo, não a entrega isolada de um cronograma
              </h2>
            </div>
            <div className="min-w-0 lg:col-span-5 lg:pb-2">
              <p className="max-w-lg text-[16px] leading-relaxed text-smoke-600 sm:text-[17px]">
                Role pelas quatro etapas abaixo para acompanhar como o ciclo se
                renova a cada semana: você executa, a plataforma organiza os
                indicadores e o mentor recalibra a rota com você.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-12 sm:mt-16">
          <StepsTimeline steps={steps} />
        </div>

        <Reveal delay={100} variant="scale">
          <div className="relative mt-14 overflow-hidden rounded-ds-xl bg-navy-800 p-7 text-ondark shadow-lift sm:mt-16 sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:px-12 lg:py-11">
            <div
              aria-hidden
              className="glow-blue pointer-events-none absolute -right-24 -top-24 size-72 opacity-70"
            />
            <p className="relative max-w-2xl text-[17px] leading-relaxed text-ondark sm:text-[19px]">
              É na revisão semanal que a estratégia ganha vida. Quando a sua
              rotina ou o seu desempenho mudam, o planejamento muda junto com
              você.
            </p>
            <CTA
              href="#candidatura"
              variant="primary"
              arrow
              className="relative mt-7 w-full shrink-0 sm:w-auto lg:mt-0"
            >
              Quero fazer parte da mentoria
            </CTA>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
