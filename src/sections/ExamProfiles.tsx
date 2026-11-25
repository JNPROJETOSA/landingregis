"use client";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { site } from "@/config/site";
import { CTA } from "@/components/ui/CTA";
import { Reveal } from "@/components/ui/Reveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

/**
 * Seção de Estratégia & Provas (#provas).
 * Ato 1: Ilustração em vídeo em loop silencioso simbolizando estratégia e
 *        antecipação + seletor interativo de processos seletivos (sincronizado
 *        com ExamMarquee).
 * Ato 2: Competitividade com dados oficiais verificados (Ebserh / MEC — ENARE).
 *
 * Sem "Exemplo de mapeamento", sem porcentagens inventadas e sem alegações
 * de parceria institucional.
 */
type ExamItem = {
  id: string;
  name: string;
  scope: string;
  focusTitle: string;
  focusDesc: string;
  mentorSteps: readonly string[];
};

const exams: readonly ExamItem[] = [
  {
    id: "enare",
    name: "ENARE",
    scope: "Exame Nacional de Residência",
    focusTitle: "Abrangência nacional com priorização cirúrgica",
    focusDesc:
      "Quando o objetivo envolve o ENARE, o mentor ajuda você a equilibrar as cinco grandes áreas com atenção aos temas mais recorrentes e ao ritmo de resolução em provas extensas.",
    mentorSteps: [
      "Mapeamento de temas recorrentes pelo Mapa de Incidência",
      "Simulados em modo prova calibrados para resistência e gestão de tempo",
      "Revisões semanais orientadas às lacunas reais do seu histórico",
    ],
  },
  {
    id: "enamed",
    name: "ENAMED",
    scope: "Exame Nacional de Avaliação da Formação Médica",
    focusTitle: "Base clínica sólida e constância semanal",
    focusDesc:
      "Para candidatos que incluem o ENAMED no horizonte, o planejamento combina consolidação das grandes áreas com acompanhamento próximo da evolução em exercícios e revisões.",
    mentorSteps: [
      "Diagnóstico inicial de pontos fortes e lacunas prioritárias",
      "Agenda semanal ajustada à carga do internato ou do trabalho",
      "Caderno de erros revisitado com o mentor a cada ciclo",
    ],
  },
  {
    id: "ses-pe",
    name: "SES-PE",
    scope: "Secretaria Estadual de Saúde de Pernambuco",
    focusTitle: "Direcionamento adaptado ao perfil regional",
    focusDesc:
      "Na preparação voltada à SES-PE, a estratégia considera o perfil histórico da prova e organiza seus blocos de estudo para que o tempo disponível renda onde mais importa.",
    mentorSteps: [
      "Priorização de assuntos com maior peso na prova pretendida",
      "Integração com os materiais e cursinho que você já utiliza",
      "Ajuste semanal conforme desempenho em blocos e simulados",
    ],
  },
  {
    id: "usp-sp",
    name: "USP-SP",
    scope: "Universidade de São Paulo",
    focusTitle: "Profundidade clínica e raciocínio aplicado",
    focusDesc:
      "Provas de alta exigência como a USP-SP pedem mais do que volume de leitura. O acompanhamento semanal direciona revisões, aprofundamento e análise criteriosa de cada erro.",
    mentorSteps: [
      "Foco em raciocínio clínico e revisão aprofundada do caderno de erros",
      "Distribuição realista entre teoria, questões e simulados",
      "Reunião semanal para recalibrar prioridades conforme sua curva",
    ],
  },
  {
    id: "sus-sp",
    name: "SUS-SP",
    scope: "Sistema Único de Saúde · São Paulo",
    focusTitle: "Ritmo constante e objetividade nos temas-chave",
    focusDesc:
      "Para quem busca o SUS-SP, o mentor estrutura uma rotina executável que mantém constância de revisões e direciona sua energia aos assuntos mais cobrados na banca.",
    mentorSteps: [
      "Organização semanal compatível com plantões ou internato",
      "Flashcards e revisões programadas para fixação contínua",
      "Acompanhamento de métricas por tema a cada semana",
    ],
  },
  {
    id: "unicamp",
    name: "UNICAMP",
    scope: "Universidade Estadual de Campinas",
    focusTitle: "Estratégia equilibrada entre áreas e prática",
    focusDesc:
      "Ao mirar a UNICAMP, seu planejamento é ajustado para contemplar as exigências específicas da prova sem perder de vista sua disponibilidade real durante a semana.",
    mentorSteps: [
      "Alinhamento semanal de metas conforme o calendário de provas",
      "Análise de desempenho por área para corrigir desequilíbrios cedo",
      "Contato direto pelo WhatsApp para dúvidas da preparação",
    ],
  },
  {
    id: "amrigs",
    name: "AMRIGS",
    scope: "Associação Médica do Rio Grande do Sul",
    focusTitle: "Planejamento estruturado para processos seletivos do Sul",
    focusDesc:
      "Na preparação para a AMRIGS, o mentor adapta o foco das revisões e simulados ao estilo da prova, garantindo clareza sobre o que priorizar em cada etapa do ano.",
    mentorSteps: [
      "Priorização guiada pelo perfil das provas pretendidas",
      "Revisões espaçadas para sustentar memória até a data da prova",
      "Relatórios de evolução discutidos na chamada semanal",
    ],
  },
  {
    id: "iamspe",
    name: "IAMSPE",
    scope: "Instituto de Assistência Médica ao Servidor Público Estadual",
    focusTitle: "Foco direcionado mesmo em semanas corridas",
    focusDesc:
      "Se o IAMSPE está entre suas prioridades, o planejamento considera suas provas paralelas e organiza a semana para que você avance com método, sem sobrecarga desnecessária.",
    mentorSteps: [
      "Conciliação estratégica quando você presta mais de uma banca",
      "Agenda dinâmica reconstruída sempre que a rotina muda",
      "Acompanhamento contínuo da evolução em exercícios e simulados",
    ],
  },
  {
    id: "outras",
    name: "Diversas outras",
    scope: "Processos seletivos estaduais, federais e particulares",
    focusTitle: "Estratégia sob medida para qualquer banca do país",
    focusDesc:
      "Vai prestar outros processos seletivos além das bancas listadas? O mentor mapeia o edital, o perfil histórico de questões e os temas de maior peso da sua prova para montar um planejamento exclusivo.",
    mentorSteps: [
      "Análise personalizada do edital e do histórico de cobrança da banca",
      "Priorização dos assuntos com maior retorno de nota no seu tempo disponível",
      "Conciliação inteligente quando você presta múltiplas instituições no mesmo ano",
    ],
  },
];

const enareOfficialStats = [
  {
    edition: "ENARE 2024/2025",
    label: "Inscrições homologadas (Residência Médica)",
    applicants: "53.171",
    vacancies: "4.874 vagas",
    ratio: "~10,9 candidatos por vaga",
    barPct: 61,
  },
  {
    edition: "ENARE 2025/2026",
    label: "Inscrições homologadas (Residência Médica)",
    applicants: "87.040",
    vacancies: "~6.900 vagas",
    ratio: "~12,6 candidatos por vaga",
    barPct: 100,
  },
] as const;

export function ExamProfiles() {
  const [selectedId, setSelectedId] = useState<string>(exams[0].id);
  const current = exams.find((e) => e.id === selectedId) ?? exams[0];
  const reduceMotion = useReducedMotion();

  const knightRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: knightRef,
    offset: ["start end", "end start"],
  });
  const knightY = useTransform(scrollYProgress, [0, 1], [18, -18]);

  // Sincroniza seleção disparada pela faixa animada ExamMarquee
  useEffect(() => {
    const onSelect = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (exams.some((item) => item.id === id)) {
        setSelectedId(id);
      }
    };
    window.addEventListener("regisdencia:select-exam", onSelect);
    return () =>
      window.removeEventListener("regisdencia:select-exam", onSelect);
  }, []);

  return (
    <section
      id="provas"
      className="section-overlap section-pad relative isolate overflow-hidden bg-navy-950 text-ondark"
      aria-labelledby="provas-heading"
    >
      <div className="tech-grid" aria-hidden />

      <div className="shell-wide relative z-10">
        {/* Ato 1: Ilustração em vídeo (Estratégia) + Seletor de Provas */}
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Coluna esquerda: Ilustração animada em loop contínuo (sem áudio) */}
          <div ref={knightRef} className="min-w-0 lg:col-span-5">
            <Reveal variant="scale">
              <div className="relative mx-auto max-w-[520px]">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -inset-6 -z-10 rounded-full opacity-70"
                  style={{
                    background:
                      "radial-gradient(closest-side, rgba(42,157,144,0.16), transparent 72%)",
                  }}
                />
                <motion.div
                  style={reduceMotion ? undefined : { y: knightY }}
                  className="relative overflow-hidden rounded-ds-xl border border-white/[0.08] bg-navy-950 shadow-dark"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-[#060E1F]">
                    <video
                      src={site.brand.strategyVideo}
                      autoPlay={!reduceMotion}
                      loop={!reduceMotion}
                      muted
                      playsInline
                      preload="metadata"
                      disablePictureInPicture
                      aria-label="Ilustração animada representando estratégia e antecipação na preparação"
                      className="block h-full w-full object-cover"
                    />
                    {/* Vinheta radial sutil para integração contínua ao fundo #091326 */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(circle at 50% 50%, transparent 62%, rgba(9,19,38,0.55) 100%)",
                      }}
                    />
                  </div>
                  <div className="border-t border-white/[0.08] bg-navy-950/90 px-5 py-4">
                    <p className="font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-300">
                      Estratégia antes do volume
                    </p>
                    <p className="mt-1 font-display text-[17px] italic text-ondark">
                      Antecipação, priorização e decisões semanais pensadas para
                      as suas provas.
                    </p>
                  </div>
                </motion.div>
              </div>
            </Reveal>
          </div>

          {/* Coluna direita: Headline + Seletor interativo de processos seletivos */}
          <div className="min-w-0 lg:col-span-7">
            <Reveal>
              <p className="section-label on-ink">
                <span className="dot" aria-hidden />
                Sua prova, sua estratégia
              </p>
              <h2
                id="provas-heading"
                className="type-h2 mt-5 font-display font-medium text-ondark"
              >
                Na residência, cada decisão importa.{" "}
                <span className="italic text-brand-300">
                  Sua preparação também precisa de estratégia.
                </span>
              </h2>
              <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-ondark-soft">
                Não existe uma rota única igual para todas as bancas nem para
                todos os alunos. Selecione um processo seletivo abaixo para ver
                como o mentor adapta prioridades e acompanhamento:
              </p>
            </Reveal>

            {/* Seletor tipográfico de provas */}
            <div
              role="tablist"
              aria-label="Processos seletivos de residência médica"
              className="mt-8 flex flex-wrap gap-2"
            >
              {exams.map((exam) => {
                const active = exam.id === selectedId;
                return (
                  <button
                    key={exam.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedId(exam.id)}
                    className={`rounded-ds-md border px-4 py-2.5 font-display text-[17px] font-medium tracking-tight transition-all duration-200 ${
                      active
                        ? "border-brand-400/60 bg-navy-800 text-white shadow-subtle"
                        : "border-white/[0.1] bg-navy-900/60 text-ondark-soft hover:border-white/25 hover:text-white"
                    }`}
                  >
                    {exam.name}
                  </button>
                );
              })}
            </div>

            {/* Painel da prova selecionada */}
            <SpotlightCard className="mt-6 rounded-ds-xl border border-white/[0.12] bg-navy-900/80 shadow-dark">
              <div
                role="tabpanel"
                aria-label={`Estratégia para ${current.name}`}
                className="p-6 sm:p-8"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
                    transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/10 pb-4">
                      <div>
                        <span className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-300">
                          Direcionamento estratégico · {current.name}
                        </span>
                        <h3 className="mt-1 font-display text-2xl font-medium text-white">
                          {current.focusTitle}
                        </h3>
                      </div>
                      <span className="font-body text-xs font-medium text-navy-300">
                        {current.scope}
                      </span>
                    </div>

                    <p className="mt-4 text-[15px] leading-relaxed text-ondark-soft">
                      {current.focusDesc}
                    </p>

                    <ul className="mt-5 space-y-2.5">
                      {current.mentorSteps.map((step) => (
                        <li
                          key={step}
                          className="flex items-start gap-3 text-[14px] leading-snug text-ondark"
                        >
                          <span
                            className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-400"
                            aria-hidden
                          />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <CTA
                        href="#candidatura"
                        variant="primary"
                        arrow
                        className="w-full sm:w-auto"
                      >
                        Quero fazer parte da mentoria
                      </CTA>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </SpotlightCard>
          </div>
        </div>

        {/* Ato 2: Competitividade real com dados oficiais verificados (Ebserh / MEC) */}
        <Reveal delay={80}>
          <div className="mt-20 border-t border-white/10 pt-14 lg:mt-24 lg:pt-16">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
              <div className="min-w-0 lg:col-span-5">
                <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">
                  Competitividade nos certames
                </p>
                <h3 className="type-h3-lg mt-3 font-display font-medium text-ondark">
                  Quando cada ponto importa, estudar com direção faz diferença.
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed text-ondark-soft">
                  Nos principais processos seletivos do país, o volume de
                  candidatos disputando as vagas exige mais do que horas de
                  leitura — exige saber onde priorizar o esforço e ajustar a
                  rota cedo.
                </p>
              </div>

              <div className="min-w-0 lg:col-span-7">
                <div className="grid gap-4 sm:grid-cols-2">
                  {enareOfficialStats.map((stat, idx) => (
                    <SpotlightCard
                      key={stat.edition}
                      className="rounded-ds-lg border border-white/[0.1] bg-navy-900/75 p-5 sm:p-6"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-body text-xs font-semibold uppercase tracking-wider text-brand-300">
                          {stat.edition}
                        </span>
                        <span className="rounded bg-white/[0.06] px-2 py-0.5 font-body text-[11px] font-medium tabular-nums text-navy-200">
                          {stat.ratio}
                        </span>
                      </div>
                      <p className="mt-4 font-display text-4xl font-semibold tabular-nums tracking-tight text-white sm:text-[42px]">
                        {stat.applicants}
                      </p>
                      <p className="mt-1 text-xs font-medium text-ondark-soft">
                        {stat.label}
                      </p>

                      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                        <div
                          style={{ width: `${stat.barPct}%` }}
                          className={`bar-grow h-full rounded-full ${
                            idx === 1 ? "bg-brand-400" : "bg-navy-400"
                          }`}
                        />
                      </div>
                      <p className="mt-3 text-xs tabular-nums text-navy-300">
                        Oferta oficial no certame: {stat.vacancies}
                      </p>
                    </SpotlightCard>
                  ))}
                </div>

                <p className="mt-4 text-[11px] leading-relaxed text-navy-300">
                  Fonte: Ebserh / MEC — dados oficiais consolidados de
                  Residência Médica do ENARE (enare.ebserh.gov.br). Os números
                  refletem a média geral do exame; concorrência e notas variam
                  por especialidade, instituição e edital.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
