import { site } from "@/config/site";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Resultados e depoimentos reais.
 * Enquanto não houver aprovações ou depoimentos confirmados em site.ts,
 * a seção permanece oculta na página pública — sem placeholders improvisados.
 */
export function SocialProof() {
  const { approvals, quotes, enabled } = site.testimonials;
  const hasContent = enabled && (approvals.length > 0 || quotes.length > 0);

  if (!hasContent) {
    return null;
  }

  return (
    <section
      className="section-overlap section-pad-compact bg-results relative isolate text-ondark"
      aria-labelledby="resultados-heading"
    >
      <div className="shell-wide relative z-10">
        <Reveal>
          <div className="max-w-3xl">
            <p className="section-label on-ink">
              <span className="dot" aria-hidden />
              Resultados de alunos
            </p>
            <h2
              id="resultados-heading"
              className="type-h2 mt-6 font-display font-medium text-ondark"
            >
              Quem passou pela Regisdência
            </h2>
          </div>
        </Reveal>

        {approvals.length > 0 && (
          <Reveal>
            <div className="mt-9 flex max-w-4xl flex-wrap gap-2.5">
              {approvals.map((a) => (
                <span
                  key={a}
                  className="rounded-ds-md border border-white/[0.12] bg-white/[0.05] px-4 py-2 font-body text-sm font-semibold text-ondark"
                >
                  {a}
                </span>
              ))}
            </div>
          </Reveal>
        )}

        {quotes.length > 0 && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {quotes.map((q, i) => (
              <Reveal key={q.name} delay={i * 70} className="min-w-0">
                <figure className="h-full rounded-ds-lg border border-white/10 bg-navy-850/80 p-6 transition-colors hover:border-white/20 sm:p-8">
                  <blockquote className="font-display text-[20px] font-medium italic leading-relaxed text-ondark">
                    “{q.quote}”
                  </blockquote>
                  <figcaption className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4 text-sm">
                    <span className="font-body font-bold text-ondark">
                      {q.name}
                    </span>
                    <span className="text-ondark-soft">· {q.context}</span>
                    {q.approval && (
                      <span className="rounded-ds-sm bg-brand-500/15 px-2.5 py-0.5 font-body text-xs font-semibold text-brand-300">
                        {q.approval}
                      </span>
                    )}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
