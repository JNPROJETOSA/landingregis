import { site } from "@/config/site";
import { Reveal } from "@/components/ui/Reveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

/**
 * A Mentoria — azul profundo (#0B162C).
 * Incorpora a ilustração em vídeo em loop silencioso
 * conectando raciocínio clínico, revisão espaçada e acompanhamento humano.
 */
const pillars = [
  {
    k: "Avaliação inicial individualizada",
    t: "O ponto de partida é a sua realidade",
    d: "Desde o ingresso, você passa por uma avaliação com o mentor para mapear rotina, tempo disponível, provas pretendidas, histórico de preparação, pontos fortes e lacunas de conhecimento.",
  },
  {
    k: "Estratégia sob medida",
    t: "Sem cronogramas padronizados",
    d: "O planejamento considera seus objetivos, dificuldades e a incidência dos assuntos nas provas que você pretende prestar — como ENARE, SES-PE, USP-SP e outros processos seletivos.",
  },
  {
    k: "Agenda semanal dinâmica",
    t: "Reconstruída conforme a rotina muda",
    d: "O planejamento não é definido apenas uma vez. A agenda é ajustada toda semana levando em conta plantões, provas, compromissos, pendências e a sua evolução recente.",
  },
  {
    k: "Acompanhamento contínuo",
    t: "Reuniões semanais e contato direto",
    d: "Você realiza uma reunião individual semanal por chamada com o mentor para avaliar resultados e recalibrar prioridades, além de contar com WhatsApp direto para dúvidas ao longo da preparação.",
  },
] as const;

const spans = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7"];

function Panel({
  p,
  i,
  accent,
}: {
  p: (typeof pillars)[number];
  i: number;
  accent?: boolean;
}) {
  return (
    <SpotlightCard
      className={`group h-full rounded-ds-lg border p-7 transition-colors duration-300 sm:p-9 lg:p-10 ${
        accent
          ? "border-brand-400/35 bg-gradient-to-br from-navy-750 to-navy-800 hover:border-brand-400/55"
          : "border-white/10 bg-navy-800/75 hover:border-white/20"
      }`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-2 -top-6 font-display text-[9rem] font-light leading-none text-white/[0.04] transition-colors duration-500 group-hover:text-white/[0.07]"
      >
        {String(i + 1).padStart(2, "0")}
      </span>
      <p className="relative font-body text-[13px] font-semibold text-brand-300">
        {p.k}
      </p>
      <h3 className="type-h3-lg relative mt-4 font-display font-medium italic text-ondark">
        {p.t}
      </h3>
      <p className="relative mt-4 max-w-xl text-[15px] leading-relaxed text-ondark-soft sm:text-[16px]">
        {p.d}
      </p>
    </SpotlightCard>
  );
}

function Open({ p, i }: { p: (typeof pillars)[number]; i: number }) {
  return (
    <article className="group h-full border-t border-white/15 pt-7 transition-colors duration-300 hover:border-brand-400/60 sm:pt-8">
      <div className="flex items-center justify-between gap-4">
        <p className="font-body text-[13px] font-semibold text-brand-300">
          {p.k}
        </p>
        <span className="font-body text-xs font-medium tabular-nums text-navy-400">
          {String(i + 1).padStart(2, "0")}
        </span>
      </div>
      <h3 className="type-h3-lg mt-4 font-display font-medium italic text-ondark">
        {p.t}
      </h3>
      <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ondark-soft sm:text-[16px]">
        {p.d}
      </p>
    </article>
  );
}

export function Methodology() {
  return (
    <section
      id="metodo"
      className="section-overlap section-pad bg-mentoria relative isolate overflow-hidden text-ondark"
      aria-labelledby="metodo-heading"
    >
      <div className="shell-wide relative z-10">
        {/* Abertura editorial + Figura anatômica de precisão clínica */}
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
          <Reveal className="min-w-0 lg:col-span-7">
            <p className="section-label on-ink">
              <span className="dot" aria-hidden />
              A mentoria · ciência e direcionamento
            </p>
            <h2
              id="metodo-heading"
              className="type-h2-lg mt-6 font-display font-medium text-ondark"
            >
              Uma mentoria que conhece sua rotina.{" "}
              <span className="italic text-navy-300">
                Uma estratégia que acompanha sua evolução.
              </span>
            </h2>
            <p className="mt-6 max-w-2xl border-l border-brand-400/60 pl-5 text-[16px] leading-relaxed text-ondark-soft sm:text-[17px]">
              Na Regisdência, você contrata acompanhamento humano individual —
              orientação, consolidação de memória com revisões programadas e
              ajustes semanais. A plataforma integrada sustenta esse trabalho com
              clareza e precisão clínica.
            </p>
          </Reveal>

          <Reveal variant="scale" delay={80} className="min-w-0 lg:col-span-5">
            <figure className="relative mx-auto max-w-[520px]">
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-6 -z-10 rounded-full opacity-75"
                style={{
                  background:
                    "radial-gradient(closest-side, rgba(42,157,144,0.14), transparent 72%)",
                }}
              />
              <div className="relative overflow-hidden rounded-ds-xl border border-white/[0.08] bg-[#0B162C] shadow-dark">
                <div className="relative aspect-video w-full overflow-hidden bg-[#060E1F]">
                  <video
                    src={site.brand.medicalAnatomyVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    disablePictureInPicture
                    aria-label="Ilustração animada representando raciocínio clínico, memória e consolidação do aprendizado médico"
                    className="block h-full w-full object-cover"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 50%, transparent 62%, rgba(11,22,44,0.55) 100%)",
                    }}
                  />
                </div>
                <figcaption className="border-t border-white/[0.08] bg-[#0B162C]/90 px-5 py-4">
                  <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-300">
                    Retenção e método
                  </p>
                  <p className="mt-0.5 text-xs text-ondark-soft">
                    Revisões programadas, caderno de erros e acompanhamento
                    contínuo até a prova.
                  </p>
                </figcaption>
              </div>
            </figure>
          </Reveal>
        </div>

        {/* Grade assimétrica 7/5 · 5/7 dos 4 pilares */}
        <div className="mt-14 grid gap-5 sm:gap-6 lg:mt-20 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-10">
          {pillars.map((p, i) => (
            <Reveal
              key={p.k}
              delay={i * 70}
              className={`min-w-0 ${spans[i]}`}
              variant={i % 2 === 0 ? "left" : "right"}
            >
              {i === 0 || i === 3 ? (
                <Panel p={p} i={i} accent={i === 3} />
              ) : (
                <Open p={p} i={i} />
              )}
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-14 flex flex-col gap-5 border-t border-white/10 pt-8 lg:mt-20 lg:flex-row lg:items-center lg:justify-between">
            <p className="max-w-2xl text-[15px] leading-relaxed text-ondark-soft sm:text-[16px]">
              <span className="font-display text-[18px] font-medium text-white">
                Integrada aos materiais que você já utiliza.
              </span>{" "}
              Você não precisa abandonar seu cursinho ou seus recursos de estudo
              — a mentoria ajuda a organizar e aproveitar melhor o que você já
              tem.
            </p>
            <p className="shrink-0 text-[13px] leading-relaxed text-navy-300 lg:max-w-xs lg:text-right">
              Idealizada por Régis, mentor principal, em uma estrutura dedicada
              ao acompanhamento individual
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
