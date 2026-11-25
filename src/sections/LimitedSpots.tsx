"use client";
import { site } from "@/config/site";
import { Reveal } from "@/components/ui/Reveal";
import { CTA } from "@/components/ui/CTA";
import { InstitutionalSeals } from "@/components/ui/InstitutionalSeals";

/**
 * Matrículas 2027 — campanha institucional em azul profundo com revelação
 * progressiva do número 2027, limites reais de acompanhamento e selos
 * institucionais autorais da Regisdência.
 */
const reasons = [
  {
    k: "Acompanhamento individual",
    d: "Cada aluno conta com reunião semanal por chamada, contato direto pelo WhatsApp e planejamento atualizado conforme a sua semana.",
  },
  {
    k: "Capacidade real dos mentores",
    d: "O número de vagas acompanha a disponibilidade real para oferecer orientação profunda e individualizada — sem massificação.",
  },
  {
    k: "Candidatura transparente",
    d: "Sem urgência artificial. Você envia sua candidatura, conversa com nossa equipe e avalia com calma se a mentoria faz sentido para o seu momento.",
  },
] as const;

export function LimitedSpots() {
  return (
    <section
      className="section-overlap section-pad bg-year relative isolate overflow-hidden text-ondark"
      aria-labelledby="vagas-heading"
    >
      <div className="tech-grid" aria-hidden />

      <div className="shell-wide relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] lg:gap-16">
          <Reveal variant="scale" className="min-w-0">
            <p className="section-label on-ink">
              <span className="dot" aria-hidden />
              Matrículas {site.campaignYear}
            </p>
            <h2
              id="vagas-heading"
              className="type-display-year year-gradient mt-6 font-display font-semibold tabular-nums"
            >
              {site.campaignYear}
            </h2>
            <span
              className="mt-7 block h-1 w-24 rounded-full bg-brand-500"
              aria-hidden
            />
          </Reveal>

          <Reveal delay={100} className="min-w-0">
            <p className="font-display text-[1.7rem] font-normal leading-[1.2] tracking-tight text-ondark sm:text-[2.1rem]">
              Uma preparação construída para a sua realidade.
            </p>
            <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-ondark-soft">
              Na Regisdência, as vagas são limitadas pela capacidade real de
              acompanhamento dos mentores. É esse cuidado que sustenta o
              planejamento semanal e a atenção individual ao longo da sua
              preparação.
            </p>

            <div className="mt-9 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-7">
              <CTA
                href="#candidatura"
                variant="primary"
                arrow
                className="w-full shrink-0 sm:w-auto"
              >
                Quero fazer parte da mentoria
              </CTA>
              <p className="max-w-xs text-[13px] leading-relaxed text-ondark-soft">
                A candidatura não é uma matrícula — é o primeiro passo para
                conversar com a equipe sobre a sua preparação.
              </p>
            </div>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-8 lg:mt-24 lg:gap-12">
          {reasons.map((r, i) => (
            <Reveal key={r.k} delay={i * 80} className="min-w-0">
              <article className="group h-full border-t border-white/15 pt-6 transition-colors duration-300 hover:border-brand-400/60">
                <span className="font-body text-xs font-semibold tabular-nums text-brand-300">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="type-h3 mt-3 font-display font-medium italic text-ondark">
                  {r.k}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ondark-soft">
                  {r.d}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <InstitutionalSeals />
        </Reveal>
      </div>
    </section>
  );
}
