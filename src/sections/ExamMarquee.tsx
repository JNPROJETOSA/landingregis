"use client";
import Image from "next/image";
import { Marquee } from "@/components/ui/Marquee";

/**
 * Faixa institucional contínua de provas e instituições contempladas.
 * - Logomarcas oficiais verificadas (SVG/PNG provenientes dos portais oficiais
 *   ou Wikimedia Commons) acondicionadas em leitos ópticos padronizados, com
 *   altura óptica normalizada individualmente por proporção e área ocupada.
 * - Para certames sem identidade autônoma pública confiável (SES-PE e AMRIGS),
 *   emprega assinatura tipográfica institucional (zero criação artificial).
 * - Cliques em certames com perfil em #provas rolam e selecionam a banca.
 * - Não sugere parceria, certificação, convênio ou endosso institucional.
 */

type ExamItem = {
  id: string;
  name: string;
  sub: string;
  interactive: boolean;
  logoSrc?: string;
  logoAlt?: string;
  logoW?: number;
  logoH?: number;
  /** Classe de altura óptica normalizada para equilibrar logos horizontais vs brasões */
  logoClass?: string;
};

const marqueeExams: ExamItem[] = [
  {
    id: "enare",
    name: "ENARE",
    sub: "Exame Nacional de Residência",
    interactive: true,
    logoSrc: "/assets/exams/enare.png",
    logoAlt: "Logomarca oficial do ENARE",
    logoW: 157,
    logoH: 50,
    logoClass: "h-[24px] w-auto max-w-[96px]",
  },
  {
    id: "enamed",
    name: "ENAMED",
    sub: "Avaliação Nacional · INEP / MEC",
    interactive: true,
    logoSrc: "/assets/exams/inep.svg",
    logoAlt: "Logomarca do INEP, órgão realizador do ENAMED",
    logoW: 500,
    logoH: 288,
    logoClass: "h-[26px] w-auto max-w-[84px]",
  },
  {
    id: "usp-sp",
    name: "USP-SP",
    sub: "Universidade de São Paulo · FMUSP",
    interactive: true,
    logoSrc: "/assets/exams/usp.svg",
    logoAlt: "Logomarca oficial da Universidade de São Paulo",
    logoW: 985,
    logoH: 399,
    logoClass: "h-[25px] w-auto max-w-[78px]",
  },
  {
    id: "unicamp",
    name: "UNICAMP",
    sub: "Faculdade de Ciências Médicas · Campinas",
    interactive: true,
    logoSrc: "/assets/exams/unicamp.svg",
    logoAlt: "Logomarca oficial da Unicamp",
    logoW: 240,
    logoH: 269,
    logoClass: "h-[38px] w-auto max-w-[64px]",
  },
  {
    id: "sus-sp",
    name: "SUS-SP",
    sub: "Secretaria Estadual · São Paulo",
    interactive: true,
    logoSrc: "/assets/exams/sus.svg",
    logoAlt: "Símbolo oficial do Sistema Único de Saúde",
    logoW: 640,
    logoH: 340,
    logoClass: "h-[34px] w-auto max-w-[82px]",
  },
  {
    id: "iamspe",
    name: "IAMSPE",
    sub: "Instituto de Assistência Médica · SP",
    interactive: true,
    logoSrc: "/assets/exams/iamspe.png",
    logoAlt: "Logomarca oficial do Iamspe",
    logoW: 600,
    logoH: 600,
    logoClass: "h-[46px] w-auto max-w-[76px]",
  },
  {
    id: "ses-pe",
    name: "SES-PE",
    sub: "Secretaria Estadual de Saúde · PE",
    interactive: true,
  },
  {
    id: "amrigs",
    name: "AMRIGS",
    sub: "Exame Unificado · RS",
    interactive: true,
  },
  {
    id: "unifesp",
    name: "UNIFESP",
    sub: "Universidade Federal de São Paulo · EPM",
    interactive: false,
    logoSrc: "/assets/exams/unifesp.png",
    logoAlt: "Logomarca oficial da Unifesp",
    logoW: 755,
    logoH: 755,
    logoClass: "h-[58px] w-auto max-w-[92px]",
  },
  {
    id: "usp-rp",
    name: "USP-RP",
    sub: "Faculdade de Medicina de Ribeirão Preto",
    interactive: false,
    logoSrc: "/assets/exams/fmrp-usp.png",
    logoAlt: "Brasão oficial da FMRP-USP",
    logoW: 320,
    logoH: 320,
    logoClass: "h-[46px] w-auto max-w-[72px]",
  },
];

function PlaqueContent({ item }: { item: ExamItem }) {
  return (
    <div className="flex h-[74px] items-stretch overflow-hidden rounded-ds-md border border-white/[0.11] bg-[#0B162C]/90 transition-all duration-200 group-hover:border-brand-400/50 group-hover:bg-navy-850 sm:h-[80px]">
      {/* Leito óptico padronizado para a marca */}
      {item.logoSrc && item.logoW && item.logoH ? (
        <div className="relative flex w-[112px] shrink-0 items-center justify-center bg-[#F6F8FB] px-3 py-2 sm:w-[122px]">
          <Image
            src={item.logoSrc}
            alt={item.logoAlt || item.name}
            width={item.logoW}
            height={item.logoH}
            sizes="122px"
            unoptimized={item.logoSrc.endsWith(".svg")}
            className={`${item.logoClass} object-contain select-none`}
            loading="eager"
          />
        </div>
      ) : (
        <div className="flex w-[112px] shrink-0 flex-col items-center justify-center border-r border-white/[0.08] bg-navy-900/95 px-3 text-center sm:w-[122px]">
          <span className="font-display text-[17px] font-semibold tracking-tight text-white">
            {item.name}
          </span>
          <span className="mt-0.5 block h-px w-8 bg-brand-400/50" aria-hidden />
        </div>
      )}

      {/* Identificação editorial */}
      <div className="flex min-w-[168px] items-center justify-between gap-3 px-4 sm:min-w-[188px] sm:px-5">
        <div className="text-left">
          <p className="font-display text-[17px] font-medium leading-tight tracking-tight text-ondark transition-colors group-hover:text-white sm:text-[18px]">
            {item.name}
          </p>
          <p className="mt-0.5 font-body text-[11px] font-medium leading-tight text-navy-300 transition-colors group-hover:text-ondark-soft">
            {item.sub}
          </p>
        </div>

        {item.interactive && (
          <span
            aria-hidden
            className="text-xs font-semibold text-navy-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-brand-300"
          >
            →
          </span>
        )}
      </div>
    </div>
  );
}

export function ExamMarquee() {
  const selectExam = (id: string) => {
    window.dispatchEvent(new CustomEvent("regisdencia:select-exam", { detail: id }));
    const target = document.getElementById("provas");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      aria-label="Provas e instituições contempladas pela estratégia de preparação"
      className="relative overflow-hidden border-y border-white/[0.08] bg-[#060E1F] py-11 text-ondark sm:py-14"
    >
      <div className="shell-wide mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
        <div>
          <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">
            Abrangência de preparação
          </p>
          <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-ondark sm:text-[28px]">
            Preparação direcionada às provas que fazem parte do seu objetivo.
          </h2>
        </div>
        <p className="max-w-xl text-[14px] leading-relaxed text-ondark-soft sm:text-[15px]">
          Dos certames nacionais unificados às residências tradicionais do país,
          selecione abaixo uma banca contemplada para visualizar como o
          planejamento se adapta ao perfil da prova.
        </p>
      </div>

      <Marquee
        duration={48}
        pauseOnHover
        ariaLabel="Lista contínua de provas e instituições contempladas"
      >
        {marqueeExams.map((item) =>
          item.interactive ? (
            <button
              key={item.id}
              type="button"
              onClick={() => selectExam(item.id)}
              aria-label={`Explorar estratégia de preparação para ${item.name} (${item.sub})`}
              className="group rounded-ds-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#060E1F]"
            >
              <PlaqueContent item={item} />
            </button>
          ) : (
            <div key={item.id} className="opacity-90">
              <PlaqueContent item={item} />
            </div>
          ),
        )}
      </Marquee>
    </section>
  );
}
