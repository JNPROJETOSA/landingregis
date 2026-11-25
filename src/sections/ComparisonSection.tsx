import { Reveal } from "@/components/ui/Reveal";
import { CTA } from "@/components/ui/CTA";

type IconKind =
  | "compass"
  | "calendar"
  | "chart"
  | "layers"
  | "target"
  | "message"
  | "sliders"
  | "route";

type Criterion = {
  num: string;
  label: string;
  icon: IconKind;
  other: string;
  regisLead: string;
  regis: string;
};

/**
 * Comparação editorial entre experiências de preparação:
 * Preparação independente / outras mentorias vs. Mentoria Regisdência.
 * - Desktop: grade arquitetural de 3 colunas com destaque cromático e de
 *   profundidade para a Mentoria Regisdência.
 * - Mobile: legenda comparativa fixa no topo da grade + cards pareados por
 *   critério, permitindo comparar as duas experiências sem memorização.
 * - Linguagem honesta, sem superlativos absolutos, tabelas genéricas ou
 *   excesso de símbolos de marcação.
 */
const criteria: readonly Criterion[] = [
  {
    num: "01",
    label: "Planejamento individualizado",
    icon: "compass",
    other:
      "Cronogramas padronizados ou montados por conta própria, muitas vezes descolados do seu nível atual e da sua carga horária.",
    regisLead: "Construído do zero para você",
    regis:
      "Plano individualizado a partir do seu diagnóstico, disponibilidade real e provas pretendidas.",
  },
  {
    num: "02",
    label: "Organização da rotina de estudos",
    icon: "calendar",
    other:
      "Imprevistos no internato, plantões ou semanas acumuladas costumam exigir que você reorganize tudo sozinho.",
    regisLead: "Agenda dinâmica semanal",
    regis:
      "Sua semana é revista continuamente considerando compromissos, pendências e carga real.",
  },
  {
    num: "03",
    label: "Acompanhamento do desempenho",
    icon: "chart",
    other:
      "A leitura de acertos, erros e lacunas depende da sua própria interpretação, sem um olhar externo recorrente.",
    regisLead: "Indicadores e relatórios integrados",
    regis:
      "Métricas por tema, caderno de erros e evolução em simulados analisados junto ao mentor.",
  },
  {
    num: "04",
    label: "Estratégia de revisões",
    icon: "layers",
    other:
      "Revisões feitas de forma intuitiva ou atrasadas diante do volume de aulas, comprometendo a fixação.",
    regisLead: "Revisão orientada por dados",
    regis:
      "Revisões programadas e direcionadas às lacunas reais apontadas pelo seu histórico.",
  },
  {
    num: "05",
    label: "Priorização de conteúdos",
    icon: "target",
    other:
      "Tempo distribuído de maneira genérica entre assuntos, sem calibragem precisa para o perfil das bancas.",
    regisLead: "Foco no que pesa na sua prova",
    regis:
      "Priorização orientada pelo Mapa de Incidência e pelas exigências específicas das suas bancas.",
  },
  {
    num: "06",
    label: "Contato com o mentor",
    icon: "message",
    other:
      "Orientação pontual, em grupos amplos ou dependente de você buscar respostas por iniciativa própria.",
    regisLead: "Acesso direto pelo WhatsApp",
    regis:
      "Canal direto com o mentor para enviar dúvidas de estratégia e execução ao longo da semana.",
  },
  {
    num: "07",
    label: "Ajustes de estratégia",
    icon: "sliders",
    other:
      "Mudanças de rota costumam acontecer tarde, após simulados abaixo do esperado ou acúmulo de atrasos.",
    regisLead: "Calibragem a cada ciclo",
    regis:
      "Reuniões individuais semanais para auditar resultados e ajustar a rota antes que o atraso cresça.",
  },
  {
    num: "08",
    label: "Acompanhamento durante a preparação",
    icon: "route",
    other:
      "Condução solitária nas fases mais exigentes do ano, mantendo ritmo e decisões sem suporte contínuo.",
    regisLead: "Presença real até a prova",
    regis:
      "Acompanhamento próximo do início à reta final, integrando seus materiais, plataforma e decisões semanais.",
  },
];

function CriterionIcon({ kind }: { kind: IconKind }) {
  const props = {
    viewBox: "0 0 20 20",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.45,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "size-4",
    "aria-hidden": true,
  };

  switch (kind) {
    case "compass":
      return (
        <svg {...props}>
          <circle cx="10" cy="10" r="7.2" />
          <polygon points="12.8,7.2 11.2,11.2 7.2,12.8 8.8,8.8" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...props}>
          <rect x="3" y="4.5" width="14" height="12.5" rx="2" />
          <path d="M6.5 2.8v3.2M13.5 2.8v3.2M3 8.5h14" />
        </svg>
      );
    case "chart":
      return (
        <svg {...props}>
          <path d="M3.5 16.5h13" />
          <path d="M5.5 13.5V9.5M10 13.5V5.5M14.5 13.5V7.8" />
        </svg>
      );
    case "layers":
      return (
        <svg {...props}>
          <path d="M10 3.2 16.8 6.8 10 10.4 3.2 6.8 10 3.2Z" />
          <path d="M3.2 10.2 10 13.8l6.8-3.6M3.2 13.4 10 17l6.8-3.6" />
        </svg>
      );
    case "target":
      return (
        <svg {...props}>
          <circle cx="10" cy="10" r="7.2" />
          <circle cx="10" cy="10" r="3.6" />
          <circle cx="10" cy="10" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      );
    case "message":
      return (
        <svg {...props}>
          <path d="M4 5.5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v6.5a2 2 0 0 1-2 2H8.5L4.5 17v-3H6a2 2 0 0 1-2-2V5.5Z" />
        </svg>
      );
    case "sliders":
      return (
        <svg {...props}>
          <path d="M3.5 6h13M3.5 14h13" />
          <circle cx="7.5" cy="6" r="1.8" fill="#081225" />
          <circle cx="12.5" cy="14" r="1.8" fill="#081225" />
        </svg>
      );
    case "route":
      return (
        <svg {...props}>
          <circle cx="5.2" cy="14.5" r="2" />
          <circle cx="14.8" cy="5.5" r="2" />
          <path d="M7.2 14.5h3.3a2.5 2.5 0 0 0 0-5h-1a2.5 2.5 0 0 1 0-5h3.3" />
        </svg>
      );
  }
}

export function ComparisonSection() {
  return (
    <section
      id="comparacao"
      className="section-overlap section-pad relative isolate overflow-x-clip bg-[#081225] text-ondark"
      aria-labelledby="comparacao-heading"
    >
      {/* Atmosfera luminosa direcionada para a coluna da Mentoria Regisdência */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-20 -z-10 h-[620px] w-[58%] opacity-80 blur-3xl"
        style={{
          background:
            "radial-gradient(62% 56% at 72% 42%, rgba(42,157,144,0.16), rgba(29,63,118,0.22) 55%, transparent 82%)",
        }}
      />

      <div className="shell-wide relative z-10">
        {/* Cabeçalho da seção */}
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-14">
            <div className="min-w-0 lg:col-span-7">
              <p className="section-label on-ink">
                <span className="dot" aria-hidden />
                Comparação de experiência
              </p>
              <h2
                id="comparacao-heading"
                className="type-h2 mt-5 font-display font-medium text-ondark"
              >
                O conteúdo pode ser o mesmo.{" "}
                <span className="italic text-brand-300">
                  O acompanhamento muda a preparação.
                </span>
              </h2>
            </div>

            <div className="min-w-0 lg:col-span-5 lg:pb-1">
              <p className="text-[15.5px] leading-relaxed text-ondark-soft sm:text-[16.5px]">
                Compare lado a lado o que muda na rotina entre conduzir os
                estudos por conta própria ou em formatos genéricos e ter
                direcionamento individual com a Mentoria Regisdência.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Legenda comparativa Mobile — estabelece contraste imediato antes dos critérios */}
        <div className="mt-10 grid grid-cols-2 gap-3 lg:hidden">
          <div className="rounded-ds-md border border-white/[0.08] bg-[#0B1528]/70 px-3.5 py-3">
            <p className="font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-navy-300">
              Experiência comum
            </p>
            <p className="mt-1 font-display text-[15px] font-medium leading-snug text-ondark/85">
              Preparação independente / outras mentorias
            </p>
          </div>
          <div className="relative overflow-hidden rounded-ds-md border border-brand-400/45 bg-gradient-to-b from-[#152D52] to-[#0E203D] px-3.5 py-3 shadow-subtle">
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-brand-500/40 via-brand-300 to-brand-500/40"
            />
            <p className="font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-300">
              Acompanhamento 1 a 1
            </p>
            <p className="mt-1 font-display text-[15px] font-medium leading-snug text-white">
              Mentoria Regisdência
            </p>
          </div>
        </div>

        {/* Cabeçalho comparativo Desktop */}
        <div className="mt-14 hidden lg:grid lg:grid-cols-[240px_minmax(0,0.92fr)_minmax(0,1.18fr)] lg:items-end lg:gap-6">
          <div className="pb-5">
            <span className="font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-navy-400">
              Dimensão da rotina
            </span>
          </div>

          <div className="rounded-t-ds-lg border border-b-0 border-white/[0.08] bg-[#0B1528]/65 px-7 py-6">
            <p className="font-body text-[10.5px] font-semibold uppercase tracking-[0.2em] text-navy-300">
              Experiência convencional
            </p>
            <h3 className="mt-2 font-display text-[21px] font-medium leading-snug text-ondark/85">
              Preparação independente / outras mentorias
            </h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-navy-300">
              Estrutura genérica ou autogerida, com decisões centralizadas em
              você.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-t-ds-lg border border-b-0 border-brand-400/45 bg-gradient-to-b from-[#163056] via-[#122647] to-[#0E203D] px-8 py-7 shadow-dark">
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand-300 to-transparent"
            />
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-400/10 px-3 py-1 font-body text-[10.5px] font-semibold uppercase tracking-[0.18em] text-brand-200">
                <span
                  className="size-1.5 rounded-full bg-brand-300"
                  aria-hidden
                />
                Acompanhamento 1 a 1 · Plataforma própria
              </span>
            </div>
            <h3 className="mt-3 font-display text-[27px] font-medium leading-tight tracking-tight text-white">
              Mentoria Regisdência
            </h3>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-brand-100/80">
              Estratégia individual por banca, reuniões semanais e leitura real
              da sua evolução.
            </p>
          </div>
        </div>

        {/* Linhas comparativas alinhadas (Desktop) + Pares integrados (Mobile) */}
        <div className="mt-5 space-y-3.5 lg:mt-0 lg:space-y-0">
          {criteria.map((row, idx) => {
            const isLast = idx === criteria.length - 1;
            return (
              <Reveal key={row.num} delay={idx * 35}>
                {/* DESKTOP ROW */}
                <div className="group/row hidden lg:grid lg:grid-cols-[240px_minmax(0,0.92fr)_minmax(0,1.18fr)] lg:items-stretch lg:gap-6">
                  {/* Coluna Critério */}
                  <div className="flex items-center gap-3.5 border-t border-white/[0.08] py-5 pr-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-ds-sm border border-white/[0.09] bg-white/[0.03] text-brand-300 transition-colors duration-200 group-hover/row:border-brand-400/35 group-hover/row:text-brand-200">
                      <CriterionIcon kind={row.icon} />
                    </span>
                    <div className="min-w-0">
                      <span className="block font-body text-[10.5px] font-semibold tabular-nums tracking-[0.14em] text-navy-400">
                        {row.num}
                      </span>
                      <span className="mt-0.5 block font-display text-[17.5px] font-medium leading-snug text-ondark">
                        {row.label}
                      </span>
                    </div>
                  </div>

                  {/* Coluna Experiência convencional (neutra e discreta) */}
                  <div
                    className={`flex items-center border-x border-t border-white/[0.07] bg-[#0B1528]/45 px-7 py-5 transition-colors duration-200 group-hover/row:bg-[#0B1528]/65 ${
                      isLast ? "rounded-b-ds-lg border-b" : ""
                    }`}
                  >
                    <p className="text-[14px] leading-relaxed text-ondark-soft/85">
                      {row.other}
                    </p>
                  </div>

                  {/* Coluna Mentoria Regisdência (protagonismo ciano + contraste superior) */}
                  <div
                    className={`relative flex items-center border-x border-t border-brand-400/30 bg-[#0E203D]/95 px-8 py-5 transition-colors duration-200 group-hover/row:bg-[#12274A] ${
                      isLast
                        ? "rounded-b-ds-lg border-b border-b-brand-400/45 shadow-dark"
                        : ""
                    }`}
                  >
                    <div
                      aria-hidden
                      className="absolute inset-y-4 left-0 w-[2px] rounded-full bg-brand-400/45 transition-colors duration-200 group-hover/row:bg-brand-300"
                    />
                    <div className="min-w-0">
                      <p className="font-body text-[13.5px] font-semibold tracking-tight text-brand-300">
                        {row.regisLead}
                      </p>
                      <p className="mt-1 text-[14.5px] leading-relaxed text-ondark">
                        {row.regis}
                      </p>
                    </div>
                  </div>
                </div>

                {/* MOBILE PAIR — comparação direta critério a critério */}
                <article className="overflow-hidden rounded-ds-lg border border-white/[0.1] bg-[#0A1529] lg:hidden">
                  <div className="flex items-center gap-3 border-b border-white/[0.08] bg-[#071122] px-4 py-3.5">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-ds-sm border border-white/[0.1] bg-white/[0.03] text-brand-300">
                      <CriterionIcon kind={row.icon} />
                    </span>
                    <div className="flex min-w-0 items-baseline gap-2">
                      <span className="font-body text-[11px] font-semibold tabular-nums text-navy-400">
                        {row.num}
                      </span>
                      <h3 className="font-display text-[17.5px] font-medium leading-snug text-white">
                        {row.label}
                      </h3>
                    </div>
                  </div>

                  <div>
                    {/* Bloco 1: Preparação independente / outras mentorias */}
                    <div className="px-4 py-4">
                      <p className="font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-navy-300">
                        Preparação independente / outras mentorias
                      </p>
                      <p className="mt-1.5 text-[13.5px] leading-relaxed text-ondark-soft/90">
                        {row.other}
                      </p>
                    </div>

                    {/* Bloco 2: Mentoria Regisdência (destaque imediato) */}
                    <div className="border-t border-brand-400/25 border-l-[3px] border-l-brand-400 bg-gradient-to-br from-[#132A4D] to-[#0D1E3B] px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="size-1.5 rounded-full bg-brand-300"
                          aria-hidden
                        />
                        <p className="font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-300">
                          Mentoria Regisdência · {row.regisLead}
                        </p>
                      </div>
                      <p className="mt-1.5 text-[14px] font-medium leading-relaxed text-white">
                        {row.regis}
                      </p>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        {/* Fechamento editorial + CTA */}
        <Reveal delay={100}>
          <div className="mt-10 flex flex-col gap-5 rounded-ds-lg border border-white/[0.1] bg-navy-950/75 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <p className="max-w-2xl text-xs leading-relaxed text-navy-300 sm:text-[13px]">
              Comparação baseada na diferença prática entre estudar sem suporte
              individualizado contínuo e o formato de acompanhamento semanal da
              Mentoria Regisdência — sem afirmações absolutas sobre outros
              programas do mercado.
            </p>
            <CTA
              href="#candidatura"
              variant="primary"
              arrow
              className="w-full shrink-0 sm:w-auto"
            >
              Quero fazer parte da mentoria
            </CTA>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
