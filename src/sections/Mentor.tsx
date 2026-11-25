import Image from "next/image";
import { site } from "@/config/site";
import { CTA } from "@/components/ui/CTA";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Apresentação editorial do Mentor Principal (Régis).
 * - Preserva integralmente a fotografia original (/assets/mentor-regis.jpg),
 *   os textos existentes e a superfície clara (bg-light-mentor) em contraste
 *   com as seções escuras adjacentes.
 * - Composição editorial assimétrica em duas camadas:
 *   1) Cabeçalho institucional de página inteira (mastead) com assinatura à direita.
 *   2) Coluna fotográfica autoral com moldura arquitetônica em filetes e placa
 *      de identificação sobreposta em azul-marinho profundo + coluna narrativa
 *      com contraste de escala tipográfica entre apresentação, credencial e método.
 */

const leadCredential = {
  num: "01",
  tag: "Credencial & direção",
  title: "Papel na Regisdência",
  text: "Mentor principal e idealizador da metodologia — responsável por conduzir e assegurar o padrão individual de acompanhamento, em uma estrutura preparada para incorporar outros profissionais mantendo o mesmo critério.",
} as const;

const methodologyPillars = [
  {
    num: "02",
    tag: "Experiência prática",
    title: "Filosofia do acompanhamento",
    text: "Acompanhamento próximo da trajetória real de cada aluno: rotina de plantões, internato, base teórica e adaptação contínua à medida que os indicadores evoluem.",
  },
  {
    num: "03",
    tag: "Contato contínuo",
    title: "Proximidade no dia a dia",
    text: "Reuniões semanais individuais por chamada e contato direto pelo WhatsApp para orientar ajustes de rota e decisões pontuais durante toda a preparação.",
  },
] as const;

export function Mentor() {
  return (
    <section
      id="mentor"
      className="section-overlap section-pad bg-light-mentor relative isolate overflow-x-clip text-navy-900"
      aria-labelledby="mentor-heading"
    >
      <div className="tech-grid-light" aria-hidden />

      <div className="shell-wide relative z-10">
        {/* 1. Cabeçalho Editorial de Abertura (Masthead) */}
        <Reveal>
          <header className="grid gap-6 border-b border-navy-800/15 pb-8 lg:grid-cols-12 lg:items-end lg:pb-10">
            <div className="min-w-0 lg:col-span-8">
              <p className="section-label">
                <span className="dot" aria-hidden />
                Presença humana · liderança metodológica
              </p>
              <h2
                id="mentor-heading"
                className="type-h2 mt-4 font-display font-medium text-navy-900"
              >
                Um acompanhamento que conhece{" "}
                <span className="italic text-brand-700">sua trajetória.</span>
              </h2>
            </div>

            <div className="min-w-0 border-l-2 border-brand-600/70 pl-4 lg:col-span-4 lg:border-l-0 lg:border-r-2 lg:pl-0 lg:pr-5 lg:text-right">
              <p className="font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-navy-700">
                Mentoria Regisdência
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-smoke-600">
                Direção individual · contato humano contínuo
              </p>
            </div>
          </header>
        </Reveal>

        {/* 2. Composição Editorial Assimétrica: Retrato Autoral + Narrativa Hierarquizada */}
        <div className="mt-10 grid items-start gap-12 lg:mt-14 lg:grid-cols-12 lg:gap-14">
          {/* Coluna Esquerda (5 cols): Fotografia com Moldura Arquitetônica & Placa Sobreposta */}
          <Reveal variant="scale" className="min-w-0 lg:col-span-5">
            <div className="relative mx-auto max-w-[440px] lg:max-w-none">
              {/* Filete editorial deslocado atrás do canto superior esquerdo */}
              <div
                aria-hidden
                className="pointer-events-none absolute -left-3 -top-3 bottom-14 right-6 hidden border border-navy-800/15 sm:block"
              />

              {/* Bloco arquitetônico de profundidade atrás do canto inferior direito */}
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-3 -right-3 left-10 top-12 hidden bg-navy-900/[0.06] sm:block"
              />

              <figure className="relative">
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-navy-950 shadow-[0_28px_64px_-24px_rgba(9,19,38,0.42)]">
                  <Image
                    src={site.brand.mentorPhoto}
                    alt="Régis — Mentor principal e idealizador da Mentoria Regisdência"
                    fill
                    sizes="(max-width: 1024px) 92vw, 40vw"
                    className="object-cover object-[50%_14%]"
                    loading="lazy"
                    decoding="async"
                  />

                  {/* Vinheta discreta apenas na base para sustentar a sobreposição da placa */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(9,19,38,0.06) 0%, transparent 25%, transparent 62%, rgba(9,19,38,0.72) 100%)",
                    }}
                  />

                  {/* Filete técnico interno */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-3 border border-white/[0.14] sm:inset-4"
                  />
                </div>

                {/* Placa Tipográfica Sobreposta — Protagonismo do Nome e Função */}
                <figcaption className="relative z-20 mx-3 -mt-12 border-l-[3px] border-l-brand-400 bg-navy-900 px-6 py-5 text-ondark shadow-lift sm:mx-5 sm:px-7 sm:py-6 lg:ml-6 lg:-mr-5">
                  <p className="font-body text-[10.5px] font-semibold uppercase tracking-[0.22em] text-brand-300">
                    Mentor principal e idealizador
                  </p>

                  <p className="mt-1.5 font-display text-[36px] font-medium italic leading-none tracking-tight text-white sm:text-[42px]">
                    Régis
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/[0.1] pt-3">
                    <span className="font-body text-[10.5px] font-semibold uppercase tracking-[0.2em] text-ondark-soft">
                      Mentoria Regisdência
                    </span>
                    <span
                      className="h-px w-8 bg-brand-400/60"
                      aria-hidden
                    />
                  </div>
                </figcaption>
              </figure>
            </div>
          </Reveal>

          {/* Coluna Direita (7 cols): Hierarquia Tipográfica por Escalas & Papéis */}
          <div className="min-w-0 lg:col-span-7 lg:pl-6">
            {/* Camada 1: Apresentação Pessoal (Escala Editorial de Abertura) */}
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="h-[2px] w-9 bg-brand-600" aria-hidden />
                <span className="font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-700">
                  Apresentação
                </span>
              </div>

              <p className="mt-4 font-display text-[21px] font-normal leading-[1.44] tracking-[-0.01em] text-navy-900 sm:text-[24px] lg:text-[26px]">
                Existe uma pessoa real por trás da estratégia. Na Regisdência, a
                tecnologia organiza indicadores e agenda, mas quem escuta a sua
                rotina, ajusta o ritmo e conduz as decisões de rota toda semana é
                o mentor ao seu lado.
              </p>
            </Reveal>

            {/* Camada 2: Credencial & Relação com a Regisdência (Destaque Principal) */}
            <Reveal delay={70}>
              <article className="mt-9 border-t-2 border-navy-900 pt-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="flex items-baseline gap-3">
                    <span className="font-body text-xs font-bold tabular-nums tracking-wider text-brand-700">
                      {leadCredential.num}
                    </span>
                    <h3 className="font-display text-[22px] font-medium leading-snug text-navy-900 sm:text-[24px]">
                      {leadCredential.title}
                    </h3>
                  </div>
                  <span className="font-body text-[10.5px] font-semibold uppercase tracking-[0.2em] text-smoke-500">
                    {leadCredential.tag}
                  </span>
                </div>

                <p className="mt-3 max-w-2xl text-[15.5px] leading-[1.7] text-navy-800/85 sm:text-[16px]">
                  {leadCredential.text}
                </p>
              </article>
            </Reveal>

            {/* Camada 3: Experiência & Filosofia de Acompanhamento (Duas Colunas Editoriais) */}
            <Reveal delay={120}>
              <div className="mt-8 grid gap-7 border-t border-navy-800/15 pt-7 sm:grid-cols-2 sm:gap-9">
                {methodologyPillars.map((item) => (
                  <article key={item.num} className="min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-body text-xs font-bold tabular-nums tracking-wider text-brand-700">
                        {item.num}
                      </span>
                      <span className="font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-smoke-500">
                        {item.tag}
                      </span>
                    </div>
                    <h3 className="mt-2 font-display text-[19.5px] font-medium leading-snug text-navy-900 sm:text-[21px]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[14.5px] leading-[1.68] text-smoke-600">
                      {item.text}
                    </p>
                  </article>
                ))}
              </div>
            </Reveal>

            {/* Camada 4: Fechamento & Ações */}
            <Reveal delay={160}>
              <div className="mt-9 border-t border-navy-800/12 pt-7">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <CTA
                    href="#candidatura"
                    variant="ink"
                    arrow
                    className="w-full sm:w-auto"
                  >
                    Quero fazer parte da mentoria
                  </CTA>
                  <CTA
                    href="whatsapp"
                    variant="outline"
                    newTab
                    className="w-full sm:w-auto"
                  >
                    Falar com SAC no WhatsApp
                  </CTA>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-smoke-600">
                  Acompanhamento individualizado com modelo estruturado para
                  escalar com qualidade e preservar proximidade real.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
