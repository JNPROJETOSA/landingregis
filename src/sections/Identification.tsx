import { Reveal } from "@/components/ui/Reveal";

/**
 * Desafios — azul-grafite. Composição editorial contemplando estudantes,
 * internos, recém-formados e médicos que trabalham (sem dramatização).
 */
const realities = [
  {
    t: "Conciliar estudo e vida real",
    d: "Faculdade, internato, plantões, trabalho e compromissos pessoais não cabem em planilhas rígidas. O planejamento precisa respeitar sua disponibilidade real e se adaptar quando ela muda.",
  },
  {
    t: "Revisar com critério e constância",
    d: "Acumular conteúdo sem método de revisão faz você refazer o mesmo esforço. Um sistema organizado define o que retomar, quando revisar e onde aprofundar.",
  },
  {
    t: "Priorizar o que pesa nas suas provas",
    d: "Estudar muitas horas sem clareza sobre a incidência de cada tema nas bancas pretendidas gera desgaste e pouco avanço. Estratégia direciona onde o esforço rende mais.",
  },
  {
    t: "Sustentar o ritmo ao longo da preparação",
    d: "Sem acompanhamento próximo, imprevistos viram pendências acumuladas. Ter um mentor revendo a rota toda semana transforma organização em continuidade.",
  },
] as const;

export function Identification() {
  return (
    <section
      className="section-overlap section-pad bg-challenge relative isolate overflow-x-clip text-ondark"
      aria-labelledby="ident"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-20 -z-10 h-[420px] w-[420px] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(42,157,144,0.12), transparent 76%)",
        }}
      />
      <div className="shell-wide relative z-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="min-w-0 lg:col-span-6">
            <Reveal>
              <div className="lg:sticky lg:top-32">
                <p className="section-label on-ink">
                  <span className="dot" aria-hidden />
                  A realidade de quem se prepara
                </p>
                <h2
                  id="ident"
                  className="type-h2 mt-6 font-display font-medium text-ondark"
                >
                  A vida real não segue um cronograma ideal — e a sua preparação
                  precisa considerar isso.
                </h2>
                <p className="mt-7 max-w-lg text-[16px] leading-relaxed text-ondark-soft sm:text-[17px]">
                  Seja na graduação, no internato ou já atuando como médico, um
                  plano engessado se desfaz na primeira semana difícil. A
                  Regisdência constrói a estratégia sobre a sua realidade — e
                  ajusta o caminho junto com você.
                </p>
                <div className="mt-8 border-l-2 border-brand-400/60 pl-4">
                  <p className="text-[13px] font-medium text-navy-300">
                    Direção prática semanal, não roteiros estáticos.
                  </p>
                  <a
                    href="#como-funciona"
                    className="mt-1.5 inline-flex items-center gap-1.5 font-body text-sm font-semibold text-brand-300 transition-colors hover:text-brand-200"
                  >
                    Ver como o acompanhamento funciona →
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          <ol className="min-w-0 border-b border-white/10 lg:col-span-6">
            {realities.map((r, i) => (
              <Reveal key={r.t} as="li" delay={i * 80} variant="right">
                <article className="group grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 border-t border-white/10 py-8 transition-colors duration-300 hover:border-brand-400/60 sm:gap-x-8 sm:py-9">
                  <span className="font-display text-[3.2rem] font-light leading-[0.9] tabular-nums text-white/20 transition-colors duration-300 group-hover:text-brand-400 sm:text-[4.2rem]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 transition-transform duration-300 ease-soft group-hover:translate-x-1">
                    <h3 className="type-h3 font-display font-medium text-ondark">
                      {r.t}
                    </h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-ondark-soft">
                      {r.d}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
