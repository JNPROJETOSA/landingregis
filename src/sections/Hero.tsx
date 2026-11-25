"use client";
import { type PointerEvent, useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { site } from "@/config/site";
import { CTA } from "@/components/ui/CTA";

/**
 * Hero — Peça Autoral de Direção de Arte Editorial & Medicina de Alta Precisão.
 *
 * Princípios de Direção de Arte:
 * - ZERO interfaces de software ou prints de agendas: a mentoria é uma experiência
 *   de alto valor humano e estratégico, não um aplicativo de tarefas.
 * - ZERO ilustrações genéricas de IA ou cérebros 3D artificiais.
 * - Tipografia editorial magistral: Newsreader (serifa nobre com itálicos expressivos)
 *   em tensão harmoniosa com DM Sans (rigor técnico e legibilidade cirúrgica).
 * - O Astrolábio de Precisão Médica: peça vetorial cinética construída em SVG com
 *   escalas micrométricas, círculos graduados, coordenadas de bancas (USP, ENARE, UNICAMP),
 *   emblema central de Asclépio/Hélice e 5 nós orbitais representando os grandes pilares clínicos.
 * - Iluminação cinematográfica em azul-marinho profundo (#091326), turquesa cirúrgico
 *   (#2A9D90 / #42B0A2) e micro-detalhes em ouro nobre (#D4AF37).
 */

const ease = [0.22, 1, 0.36, 1] as const;

/* ---------- Traçado Cirúrgico de ECG ---------- */
function buildEcgPath() {
  const beat = (x: number) =>
    `H${x} l10 -7 l10 7 h32 l7 -16 l9 -58 l12 116 l10 -58 h38 l14 -14 l16 14`;
  let d = "M0 110";
  [140, 460, 780, 1100].forEach((x) => {
    d += ` ${beat(x)}`;
  });
  d += " H1340 L1440 45";
  return d;
}
const ECG_PATH = buildEcgPath();

function EcgLine({ reduce }: { reduce: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 220"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 bottom-6 -z-10 h-[100px] w-full opacity-60 sm:bottom-8 sm:h-[140px]"
    >
      <defs>
        <linearGradient id="hero-ecg-fade" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#2A9D90" stopOpacity="0" />
          <stop offset="15%" stopColor="#2A9D90" stopOpacity="0.45" />
          <stop offset="85%" stopColor="#6EC2B5" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#6EC2B5" stopOpacity="0.1" />
        </linearGradient>
        <filter id="hero-ecg-glow" x="-10%" y="-40%" width="120%" height="180%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      <motion.path
        d={ECG_PATH}
        fill="none"
        stroke="url(#hero-ecg-fade)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        initial={reduce ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.5 }}
        transition={{ duration: 2.4, delay: 0.4, ease: "easeInOut" }}
      />
      {!reduce && (
        <motion.path
          d={ECG_PATH}
          fill="none"
          stroke="#A7E8DD"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          pathLength={1}
          strokeDasharray="0.04 0.96"
          filter="url(#hero-ecg-glow)"
          initial={{ strokeDashoffset: 0.04, opacity: 0 }}
          animate={{ strokeDashoffset: -1, opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 5.6,
            delay: 2.8,
            ease: "linear",
            repeat: Infinity,
            repeatDelay: 1.8,
          }}
        />
      )}
    </svg>
  );
}

/* ---------- Astrolábio & Instrumento de Precisão Médica (Peça de Arte) ---------- */
function MedicalPrecisionAstrolabe({ reduce }: { reduce: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax 3D suave com mola ao mover o cursor sobre a área do astrolábio
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
    stiffness: 140,
    damping: 24,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), {
    stiffness: 140,
    damping: 24,
  });

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handlePointerLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const orbitalPillars = [
    { label: "Clínica Médica", deg: 270, tag: "Raciocínio & Diagnóstico" },
    { label: "Cirurgia Geral", deg: 342, tag: "Conduta Crítica" },
    { label: "Ginecologia & Obs.", deg: 54, tag: "Alto Peso em Prova" },
    { label: "Pediatria", deg: 126, tag: "Protocolos Atualizados" },
    { label: "Preventiva & SUS", deg: 198, tag: "Precisão Máxima" },
  ];

  const pentagonPoints = orbitalPillars
    .map((p) => {
      const rad = (p.deg * Math.PI) / 180;
      return `${(300 + 194 * Math.cos(rad)).toFixed(1)},${(300 + 194 * Math.sin(rad)).toFixed(1)}`;
    })
    .join(" ");

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative mx-auto flex w-full max-w-[580px] items-center justify-center py-6 lg:max-w-none lg:py-10"
      style={{ perspective: 1200 }}
    >
      {/* Halo de luz atmosférica de fundo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-10 -z-10 rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(42,157,144,0.20) 0%, rgba(23,35,64,0.32) 45%, transparent 72%)",
        }}
      />

      <motion.div
        style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative flex aspect-square w-full max-w-[480px] items-center justify-center sm:max-w-[520px]"
      >
        {/* SVG Central — Bússola de Precisão Médica */}
        <svg
          viewBox="0 0 600 600"
          className="size-full overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="compass-dial-bg" cx="50%" cy="46%" r="54%">
              <stop offset="0%" stopColor="#122342" stopOpacity="0.92" />
              <stop offset="58%" stopColor="#0B162C" stopOpacity="0.94" />
              <stop offset="100%" stopColor="#071021" stopOpacity="0.98" />
            </radialGradient>

            <radialGradient id="astrolabe-core-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#42B0A2" stopOpacity="0.24" />
              <stop offset="45%" stopColor="#2A9D90" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#091326" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="compass-platinum-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F0F5FB" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#A5B4CC" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#42B0A2" stopOpacity="0.7" />
            </linearGradient>

            <linearGradient id="astrolabe-teal-grad" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#2A9D90" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#42B0A2" stopOpacity="0.88" />
              <stop offset="100%" stopColor="#E6FBF7" stopOpacity="0.98" />
            </linearGradient>

            <filter id="astrolabe-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <path id="compass-bezel-top" d="M 58,300 A 242,242 0 0,1 542,300" />
            <path id="compass-bezel-bottom" d="M 52,300 A 248,248 0 0,0 548,300" />
          </defs>

          {/* Halo externo suave */}
          <circle cx="300" cy="300" r="286" fill="url(#astrolabe-core-glow)" />

          {/* Mostrador principal em azul-marinho fosco */}
          <circle
            cx="300"
            cy="300"
            r="272"
            fill="url(#compass-dial-bg)"
            stroke="rgba(255, 255, 255, 0.14)"
            strokeWidth="1.2"
          />
          <circle
            cx="300"
            cy="300"
            r="258"
            fill="none"
            stroke="rgba(66, 176, 162, 0.24)"
            strokeWidth="0.75"
          />
          <circle
            cx="300"
            cy="300"
            r="230"
            fill="none"
            stroke="rgba(255, 255, 255, 0.09)"
            strokeWidth="0.9"
          />

          {/* Escala horológica de 72 divisões (5° por traço) */}
          {Array.from({ length: 72 }).map((_, i) => {
            const angle = i * 5;
            const isCardinal = i % 18 === 0;
            const isMajor = i % 6 === 0;
            const r1 = isCardinal ? 256 : isMajor ? 261 : 265;
            const r2 = 270;
            const rad = (angle * Math.PI) / 180;
            const x1 = 300 + r1 * Math.cos(rad);
            const y1 = 300 + r1 * Math.sin(rad);
            const x2 = 300 + r2 * Math.cos(rad);
            const y2 = 300 + r2 * Math.sin(rad);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={
                  isCardinal
                    ? "#42B0A2"
                    : isMajor
                      ? "rgba(220, 229, 242, 0.45)"
                      : "rgba(255, 255, 255, 0.15)"
                }
                strokeWidth={isCardinal ? "1.6" : isMajor ? "1.05" : "0.75"}
                strokeLinecap="round"
              />
            );
          })}

          {/* Marcadores losangulares laterais na faixa da coroa */}
          <polygon points="52,300 55.5,296.5 59,300 55.5,303.5" fill="#42B0A2" />
          <polygon points="541,300 544.5,296.5 548,300 544.5,303.5" fill="#42B0A2" />

          {/* Tipografia radial das 5 grandes áreas na coroa externa */}
          <text
            fill="rgba(228, 234, 243, 0.72)"
            fontSize="8.2"
            fontWeight="600"
            letterSpacing="0.22em"
            fontFamily="var(--font-body), sans-serif"
          >
            <textPath href="#compass-bezel-top" startOffset="50%" textAnchor="middle">
              CLÍNICA MÉDICA · CIRURGIA · PREVENTIVA
            </textPath>
          </text>
          <text
            fill="rgba(110, 194, 181, 0.78)"
            fontSize="8.2"
            fontWeight="600"
            letterSpacing="0.22em"
            fontFamily="var(--font-body), sans-serif"
          >
            <textPath href="#compass-bezel-bottom" startOffset="50%" textAnchor="middle">
              GINECOLOGIA &amp; OBSTETRÍCIA · PEDIATRIA
            </textPath>
          </text>

          {/* Anel 02 (Cinético: rotação sutil e contínua) */}
          <motion.g
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            style={{ originX: "300px", originY: "300px" }}
          >
            <circle
              cx="300"
              cy="300"
              r="214"
              fill="none"
              stroke="rgba(66, 176, 162, 0.28)"
              strokeWidth="1"
              strokeDasharray="4 10 1.5 10"
            />
            <circle
              cx="300"
              cy="300"
              r="214"
              fill="none"
              stroke="url(#compass-platinum-grad)"
              strokeWidth="1.6"
              strokeDasharray="36 320"
              strokeDashoffset="18"
            />
            <circle
              cx="300"
              cy="300"
              r="214"
              fill="none"
              stroke="url(#compass-platinum-grad)"
              strokeWidth="1.6"
              strokeDasharray="36 320"
              strokeDashoffset="198"
            />
          </motion.g>

          {/* Pentágono geométrico conectando os 5 grandes pilares */}
          <polygon
            points={pentagonPoints}
            fill="rgba(42, 157, 144, 0.035)"
            stroke="rgba(110, 194, 181, 0.22)"
            strokeWidth="0.9"
          />

          {/* Anel 03 (Contra-rotação suave com pontos nodais) */}
          <motion.g
            animate={reduce ? undefined : { rotate: -360 }}
            transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
            style={{ originX: "300px", originY: "300px" }}
          >
            <circle
              cx="300"
              cy="300"
              r="154"
              fill="none"
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="0.9"
            />
            <circle
              cx="300"
              cy="300"
              r="154"
              fill="none"
              stroke="url(#astrolabe-teal-grad)"
              strokeWidth="1.8"
              strokeDasharray="28 190"
              strokeDashoffset="40"
            />
            <circle cx="300" cy="146" r="3" fill="#42B0A2" />
            <circle cx="300" cy="454" r="3" fill="#42B0A2" />
            <circle cx="146" cy="300" r="2.4" fill="rgba(228, 234, 243, 0.65)" />
            <circle cx="454" cy="300" r="2.4" fill="rgba(228, 234, 243, 0.65)" />
          </motion.g>

          {/* Retículo ortogonal de referência */}
          <line
            x1="300"
            y1="72"
            x2="300"
            y2="528"
            stroke="rgba(255, 255, 255, 0.07)"
            strokeWidth="0.8"
            strokeDasharray="3 7"
          />
          <line
            x1="72"
            y1="300"
            x2="528"
            y2="300"
            stroke="rgba(255, 255, 255, 0.07)"
            strokeWidth="0.8"
            strokeDasharray="3 7"
          />

          {/* Traçado dos 5 Pilares Orbitais */}
          {orbitalPillars.map((p, idx) => {
            const rad = (p.deg * Math.PI) / 180;
            const rInner = 74;
            const rOuter = 194;
            const x1 = 300 + rInner * Math.cos(rad);
            const y1 = 300 + rInner * Math.sin(rad);
            const x2 = 300 + rOuter * Math.cos(rad);
            const y2 = 300 + rOuter * Math.sin(rad);

            return (
              <g key={idx}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(66, 176, 162, 0.22)"
                  strokeWidth="0.8"
                  strokeDasharray="2 4"
                />
                <circle
                  cx={x2}
                  cy={y2}
                  r="6.5"
                  fill="#0A1529"
                  stroke="rgba(66, 176, 162, 0.55)"
                  strokeWidth="1.2"
                />
                <circle cx={x2} cy={y2} r="2.2" fill="#E6FBF7" />
              </g>
            );
          })}

          {/* Agulha minimalista de bússola com micro-oscilação calibrada */}
          <motion.g
            animate={reduce ? undefined : { rotate: [-7, 7, -7] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            style={{ originX: "300px", originY: "300px" }}
          >
            {/* Ponteiro Norte (Direção / Rumo) */}
            <polygon points="300,154 291,300 300,300" fill="#E6FBF7" opacity="0.92" />
            <polygon points="300,154 309,300 300,300" fill="#42B0A2" opacity="0.92" />
            {/* Contrapeso Sul */}
            <polygon
              points="300,446 291,300 300,300"
              fill="rgba(165, 180, 204, 0.28)"
            />
            <polygon
              points="300,446 309,300 300,300"
              fill="rgba(13, 25, 48, 0.9)"
              stroke="rgba(255, 255, 255, 0.16)"
              strokeWidth="0.7"
            />
          </motion.g>

          {/* Anel interno de precisão ao redor do medalhão central */}
          <circle
            cx="300"
            cy="300"
            r="106"
            fill="none"
            stroke="rgba(66, 176, 162, 0.3)"
            strokeWidth="0.9"
          />
          <circle
            cx="300"
            cy="300"
            r="74"
            fill="#081224"
            stroke="url(#compass-platinum-grad)"
            strokeWidth="1.4"
          />
          <circle
            cx="300"
            cy="300"
            r="66"
            fill="#0A162C"
            stroke="rgba(66, 176, 162, 0.36)"
            strokeWidth="0.9"
          />

          {/* Emblema Central: Vara de Asclépio refinada */}
          <g transform="translate(300, 300)" filter="url(#astrolabe-glow)">
            <line
              x1="0"
              y1="-38"
              x2="0"
              y2="40"
              stroke="#DCE5F2"
              strokeWidth="2.1"
              strokeLinecap="round"
            />
            <polygon points="0,-43 3.2,-39.5 0,-36 -3.2,-39.5" fill="#42B0A2" />

            <path
              d="M 0,-30 C 16,-26 16,-15 0,-10 C -16,-5 -16,5 0,10 C 16,15 16,26 0,32"
              fill="none"
              stroke="url(#astrolabe-teal-grad)"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <circle cx="9" cy="-21" r="1.8" fill="#E6FBF7" />
            <circle cx="-9" cy="0" r="1.8" fill="#E6FBF7" />
            <circle cx="9" cy="21" r="1.8" fill="#E6FBF7" />
          </g>
        </svg>

        {/* Badge 2: Base Esquerda · Acompanhamento Individual */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease }}
          className="absolute bottom-2 left-0 sm:-left-6 sm:bottom-10"
        >
          <div className="group rounded-ds-lg border border-white/[0.14] bg-[#0A1428]/90 p-3 shadow-[0_20px_45px_-15px_rgba(2,6,18,0.85)] backdrop-blur-md transition-all duration-300 hover:border-brand-400/40 sm:p-4">
            <div className="flex items-center gap-2">
              <span className="flex size-2 rounded-full bg-brand-400 shadow-[0_0_8px_#42B0A2]" />
              <p className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-300">
                Acompanhamento 1 a 1
              </p>
            </div>
            <p className="mt-1 font-display text-[15px] font-medium tracking-tight text-white sm:text-base">
              Decisões Semanais com Mentor
            </p>
            <p className="mt-0.5 font-body text-[11px] text-navy-300">
              Auditoria de pontos cegos e calibração de rota
            </p>
          </div>
        </motion.div>

        {/* Badge 3: Selo Central Inferior · Rigor Metodológico */}
        <div className="pointer-events-none absolute bottom-0 z-10 hidden sm:block">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-[#0D1930]/80 px-3.5 py-1 text-[11px] font-medium text-navy-200 backdrop-blur-sm">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-brand-300">
              <path
                d="M12 2L15 9H22L16.5 13.5L18.5 20.5L12 16L5.5 20.5L7.5 13.5L2 9H9L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-body text-[10.5px] uppercase tracking-wider text-white/80">
              Rigor Científico · Retenção Ativa
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ---------- Headline com Revelação Editorial Palavra por Palavra ---------- */
function EditorialWord({
  children,
  delay,
  reduce,
  className = "",
}: {
  children: string;
  delay: number;
  reduce: boolean;
  className?: string;
}) {
  return (
    <span className="mr-[0.24em] inline-block overflow-hidden pb-[0.12em] align-bottom">
      <motion.span
        className={`inline-block ${className}`}
        initial={reduce ? false : { y: "115%", rotate: 2 }}
        animate={{ y: "0%", rotate: 0 }}
        transition={{ duration: 0.75, delay, ease }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function Hero() {
  const reduceMotion = !!useReducedMotion();

  // Holofote cinemático interativo ao movimentar o mouse
  const mouseX = useMotionValue(65);
  const mouseY = useMotionValue(35);
  const spotlight = useMotionTemplate`radial-gradient(650px circle at ${mouseX}% ${mouseY}%, rgba(42,157,144,0.13), transparent 65%)`;

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(((e.clientX - rect.left) / rect.width) * 100);
    mouseY.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  const line1 = ["Residência", "médica"];
  const line2 = ["não", "se", "conquista", "com"];
  const line3 = ["um"];

  return (
    <section
      id="topo"
      onPointerMove={onMove}
      className="bg-hero relative isolate overflow-x-clip pb-20 pt-[104px] sm:pb-28 sm:pt-[124px] lg:pb-32 lg:pt-[134px]"
    >
      {/* Camada Aurora Cinemática de Fundo */}
      <div
        aria-hidden
        className="aurora-layer animate-aurora pointer-events-none absolute -inset-x-24 -top-24 h-[840px] opacity-80"
      />

      {/* Holofote que responde ao ponteiro do mouse */}
      {!reduceMotion && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 hidden lg:block"
          style={{ background: spotlight }}
        />
      )}

      {/* Traçado Cirúrgico de ECG conectando a abertura */}
      <EcgLine reduce={reduceMotion} />

      <div className="shell-wide relative z-10">
        {/* Grid Editorial Principal: 12 Colunas */}
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Coluna Esquerda: Manifesto Tipográfico & Autoridade (7 Colunas) */}
          <div className="min-w-0 lg:col-span-7">
            {/* Tag de Campanha Oficial */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05, ease }}
              className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.14] bg-white/[0.04] px-4 py-1.5 font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-300 backdrop-blur-md"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-400/60 motion-reduce:hidden" />
                <span className="relative inline-flex size-2 rounded-full bg-brand-400" />
              </span>
              Matrículas {site.campaignYear} · Mentoria Regisdência
            </motion.div>

            {/* Headline H1 Editorial: Grandiosa, Equilibrada, Sem Poluição Visual */}
            <h1 className="mt-7 font-display text-[clamp(1.95rem,8.4vw,2.5rem)] font-medium leading-[1.04] tracking-[-0.03em] text-ondark sm:text-[clamp(2.3rem,4.7vw,4.4rem)]">
              <span className="sr-only">
                Residência médica não se conquista com um cronograma qualquer.
              </span>
              <span aria-hidden className="block">
                {line1.map((w, i) => (
                  <EditorialWord key={w} delay={0.15 + i * 0.07} reduce={reduceMotion}>
                    {w}
                  </EditorialWord>
                ))}
              </span>
              <span aria-hidden className="block">
                {line2.map((w, i) => (
                  <EditorialWord key={w} delay={0.38 + i * 0.07} reduce={reduceMotion}>
                    {w}
                  </EditorialWord>
                ))}
              </span>
              <span aria-hidden className="block">
                {line3.map((w, i) => (
                  <EditorialWord key={w} delay={0.68 + i * 0.07} reduce={reduceMotion}>
                    {w}
                  </EditorialWord>
                ))}
                <span className="mr-[0.24em] inline-block overflow-hidden pb-[0.12em] align-bottom">
                  <motion.span
                    className="inline-block bg-gradient-to-r from-brand-300 via-white to-brand-300 bg-[length:220%_100%] bg-clip-text font-normal italic text-transparent"
                    initial={reduceMotion ? false : { y: "115%", rotate: 2 }}
                    animate={
                      reduceMotion
                        ? { y: "0%", rotate: 0 }
                        : {
                          y: "0%",
                          rotate: 0,
                          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                        }
                    }
                    transition={{
                      y: { duration: 0.8, delay: 0.72, ease },
                      rotate: { duration: 0.8, delay: 0.72, ease },
                      backgroundPosition: {
                        duration: 7,
                        delay: 1.6,
                        repeat: Infinity,
                        ease: "linear",
                      },
                    }}
                  >
                    cronograma qualquer.
                  </motion.span>
                </span>
              </span>
            </h1>

            {/* Subtítulo Editorial: Autoridade, Clareza e Posicionamento Premium */}
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.95, ease }}
              className="mt-7 max-w-[37rem] text-[16.5px] leading-[1.68] text-ondark-soft sm:text-[18.5px]"
            >
              Mentoria individualizada para estudantes que disputam as vagas mais concorridas
              do país. Estratégia cirúrgica por banca, reuniões individuais semanais e
              acompanhamento direto com quem domina as provas de residência, atrelado à melhor
              plataforma de preparação.
            </motion.p>

            {/* CTAs de Alta Conversão & Padrão Visual Premium */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 1.1, ease }}
              className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center"
            >
              <CTA
                href="#candidatura"
                variant="primary"
                arrow
                className="w-full sm:w-auto"
              >
                Quero fazer parte da mentoria
              </CTA>
              <CTA
                href="#metodo"
                variant="outline"
                className="on-ink w-full sm:w-auto"
              >
                Conhecer a metodologia
              </CTA>
            </motion.div>

            {/* Micro-aviso de exclusividade e rigor */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.25, ease }}
              className="mt-6 flex items-center gap-2 font-body text-[12px] text-navy-300"
            >
              <span className="size-1 rounded-full bg-brand-400" />
              <span>Vagas restritas por mentor · Processo seletivo por candidatura prévia</span>
            </motion.div>
          </div>

          {/* Coluna Direita: Peça Autoral de Direção de Arte (5 Colunas) */}
          <div className="min-w-0 lg:col-span-5">
            <MedicalPrecisionAstrolabe reduce={reduceMotion} />
          </div>
        </div>

        {/* 3 Monólitos Arquiteturais Editoriais (Base do Hero) */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.35, ease }}
          className="mt-16 grid grid-cols-1 gap-4 border-t border-white/[0.1] pt-8 md:grid-cols-3 md:gap-6 lg:mt-20"
        >
          {/* Monólito 1 */}
          <div className="relative rounded-ds-lg border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur-sm transition-all duration-300 hover:border-white/[0.16] hover:bg-white/[0.04]">
            <div className="flex items-center justify-between">
              <span className="font-display text-sm font-medium italic text-brand-300">
                01 · Individualidade
              </span>
              <span className="size-1.5 rounded-full bg-brand-400" />
            </div>
            <h3 className="mt-2.5 font-display text-lg font-medium text-white">
              Sem turmas em massa
            </h3>
            <p className="mt-1.5 font-body text-[13px] leading-relaxed text-navy-300">
              Cada plano de estudo é calibrado exclusivamente para sua rotina real, suas deficiências cognitivas e suas instituições prioritárias.
            </p>
          </div>

          {/* Monólito 2 */}
          <div className="relative rounded-ds-lg border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur-sm transition-all duration-300 hover:border-white/[0.16] hover:bg-white/[0.04]">
            <div className="flex items-center justify-between">
              <span className="font-display text-sm font-medium italic text-[#E5C97A]">
                02 · Engenharia
              </span>
              <span className="size-1.5 rounded-full bg-[#D4AF37]" />
            </div>
            <h3 className="mt-2.5 font-display text-lg font-medium text-white">
              Precisão por Banca
            </h3>
            <p className="mt-1.5 font-body text-[13px] leading-relaxed text-navy-300">
              Análise estatística e engenharia reversa de USP, ENARE, UNICAMP e SUS-SP. Estude o que a sua prova realmente cobra.
            </p>
          </div>

          {/* Monólito 3 */}
          <div className="relative rounded-ds-lg border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur-sm transition-all duration-300 hover:border-white/[0.16] hover:bg-white/[0.04]">
            <div className="flex items-center justify-between">
              <span className="font-display text-sm font-medium italic text-brand-300">
                03 · Decisão
              </span>
              <span className="size-1.5 rounded-full bg-brand-400" />
            </div>
            <h3 className="mt-2.5 font-display text-lg font-medium text-white">
              Encontros Semanais
            </h3>
            <p className="mt-1.5 font-body text-[13px] leading-relaxed text-navy-300">
              Chamadas 1 a 1 todo domingo para auditar o caderno de erros, mensurar o avanço e definir os próximos passos com o mentor.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Degradê de fusão suave com a seção seguinte */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#060E1F]"
      />
    </section>
  );
}
