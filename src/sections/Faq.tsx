"use client";
import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { CTA } from "@/components/ui/CTA";

/**
 * Perguntas Frequentes — revisão editorial objetiva e natural,
 * sem redundâncias, sem preços ou garantias inventadas.
 */
const faqs = [
  {
    q: "Para quem a Mentoria Regisdência é indicada?",
    a: "Para estudantes de Medicina, internos, médicos recém-formados, médicos que trabalham e realizam plantões, e candidatos que já prestaram residência e buscam uma estratégia individualizada com acompanhamento próximo.",
  },
  {
    q: "Médicos formados que trabalham e dão plantões podem participar?",
    a: "Sim. A mentoria não é restrita ao internato. O planejamento é construído a partir da sua disponibilidade real e ajustado semanalmente considerando escalas de plantão, trabalho e compromissos pessoais.",
  },
  {
    q: "Preciso utilizar um cursinho específico?",
    a: "Não. A Regisdência pode trabalhar junto com os materiais e o cursinho que você já utiliza. Você não precisa abandonar seus recursos atuais — a mentoria ajuda a organizá-los e aproveitá-los com mais estratégia.",
  },
  {
    q: "Como funciona o planejamento semanal?",
    a: "A partir da avaliação inicial, seu mentor constrói a estratégia de acordo com suas provas pretendidas (como ENARE, SES-PE, USP-SP e outros processos seletivos), dificuldades e tempo disponível. Toda semana a agenda é revisada e atualizada conforme sua evolução e mudanças na rotina.",
  },
  {
    q: "Como acontecem as reuniões e o contato com o mentor?",
    a: "Você realiza uma reunião individual semanal por chamada com seu mentor para avaliar o progresso, revisar a execução do planejamento e ajustar prioridades. Além dos encontros, há contato direto pelo WhatsApp para tirar dúvidas ao longo da preparação.",
  },
  {
    q: "O que está incluído na plataforma integrada?",
    a: "A plataforma reúne agenda personalizada, planejamento semanal, revisões programadas, flashcards, caderno de erros, métricas de desempenho, relatórios de evolução, simulados em modo prova, Mapa de Incidência por banca e check-ins de bem-estar para apoiar o contexto da sua rotina.",
  },
  {
    q: "Como funciona a candidatura e como conheço valores e condições?",
    a: "Você preenche o formulário de candidatura em menos de dois minutos. Nossa equipe entra em contato para conversar sobre sua preparação, esclarecer dúvidas e apresentar os detalhes, valores e condições da mentoria.",
  },
] as const;

function Item({
  q,
  a,
  open,
  onToggle,
  id,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
  id: string;
}) {
  return (
    <div
      className={`border-t transition-colors duration-300 first:border-t-0 ${open ? "border-navy-800/30" : "border-line hover:border-navy-800/20"
        }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        className="group flex w-full items-center justify-between gap-5 py-5 text-left transition-colors sm:py-6"
      >
        <span
          className={`flex-1 font-display text-[19px] font-medium leading-snug tracking-tight transition-colors sm:text-[21px] ${open ? "text-navy-800" : "text-smoke-700 group-hover:text-navy-800"
            }`}
        >
          {q}
        </span>
        <span
          className={`flex size-8 shrink-0 items-center justify-center rounded-lg border transition-all duration-200 ${open
            ? "border-navy-800 bg-navy-800 text-porcelain-50"
            : "border-line bg-white text-smoke-600 group-hover:border-navy-800/40 group-hover:text-navy-800"
            }`}
          aria-hidden
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            className={`transition-transform duration-200 ${open ? "rotate-45" : ""}`}
          >
            <path
              d="M12 5v14M5 12h14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </button>

      <div
        id={`${id}-panel`}
        role="region"
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-soft ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
      >
        <div className="overflow-hidden">
          <p className="max-w-2xl pb-6 pr-8 text-[15px] leading-relaxed text-smoke-600 sm:text-[16px]">
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

export function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section
      id="faq"
      className="section-overlap section-pad bg-light-faq relative isolate overflow-hidden text-navy-800"
      aria-labelledby="faq-heading"
    >
      <div className="tech-grid-light" aria-hidden />
      <div className="shell-wide relative z-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="min-w-0 lg:col-span-4">
            <Reveal>
              <div className="lg:sticky lg:top-28">
                <p className="section-label">
                  <span className="dot" aria-hidden />
                  Perguntas frequentes
                </p>
                <h2
                  id="faq-heading"
                  className="type-h2 mt-5 font-display font-medium text-navy-800"
                >
                  Dúvidas comuns antes da candidatura
                </h2>

                <div className="mt-8 border-t border-line pt-6">
                  <p className="text-[15px] leading-relaxed text-smoke-600">
                    Prefere conversar agora sobre a sua situação?
                  </p>
                  <CTA
                    href="whatsapp"
                    variant="outline"
                    newTab
                    className="btn-sm mt-4"
                  >
                    Falar com SAC no WhatsApp
                  </CTA>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="min-w-0 lg:col-span-8">
            <Reveal delay={60}>
              <div className="rounded-ds-xl border border-navy-800/[0.09] bg-white px-6 py-2 shadow-subtle sm:px-9 sm:py-3">
                {faqs.map((f, i) => (
                  <Item
                    key={f.q}
                    id={`faq-${i}`}
                    q={f.q}
                    a={f.a}
                    open={open === i}
                    onToggle={() => setOpen(open === i ? -1 : i)}
                  />
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
