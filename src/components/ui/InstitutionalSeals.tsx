"use client";

/**
 * Selos institucionais proprietários — Padrão Mentoria Regisdência.
 * Família de emblemas vetoriais autorais desenhados sob medida em SVG,
 * inspirados em selos acadêmicos contemporâneos e chancelas editoriais:
 * - Base fosca em azul-marinho profundo (#0B162B) com anéis concêntricos finos.
 * - Tipografia radial integrada ao próprio emblema (<textPath> superior e inferior).
 * - Geometria exclusiva por pilar (sem medalhas douradas, estrelas, escudos
 *   clichês, brilhos neon ou alegações de certificação externa).
 */

type SealKind = "individual" | "weekly" | "strategy" | "technology";

type Seal = {
  roman: string;
  kind: SealKind;
  ringBottom: string;
  title: string;
  desc: string;
};

const seals: readonly Seal[] = [
  {
    roman: "I",
    kind: "individual",
    ringBottom: "ACOMPANHAMENTO 1:1",
    title: "Acompanhamento individual",
    desc: "Orientação construída sobre a sua rotina real, sem turmas genéricas.",
  },
  {
    roman: "II",
    kind: "weekly",
    ringBottom: "ENCONTROS SEMANAIS",
    title: "Encontros semanais",
    desc: "Reunião individual por chamada toda semana e contato direto pelo WhatsApp.",
  },
  {
    roman: "III",
    kind: "strategy",
    ringBottom: "ESTRATÉGIA SOB MEDIDA",
    title: "Estratégia personalizada",
    desc: "Planejamento dinâmico ajustado conforme sua evolução e provas pretendidas.",
  },
  {
    roman: "IV",
    kind: "technology",
    ringBottom: "TECNOLOGIA INTEGRADA",
    title: "Tecnologia integrada",
    desc: "Métricas, revisões, simulados em modo prova e Mapa de Incidência.",
  },
];

const outerTicks = Array.from({ length: 36 }, (_, idx) => idx * 10);
const weeklyTicks = Array.from({ length: 7 }, (_, idx) => idx * (360 / 7) - 90);

function SealCentralMark({ kind }: { kind: SealKind }) {
  switch (kind) {
    case "individual":
      // Dois círculos focais alinhados sobre eixo meridiano (relação 1 para 1)
      return (
        <g>
          <line
            x1="90"
            y1="56"
            x2="90"
            y2="124"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="0.85"
          />
          <circle
            cx="81"
            cy="90"
            r="15.5"
            fill="none"
            stroke="#E4EAF3"
            strokeWidth="1.25"
          />
          <circle
            cx="99"
            cy="90"
            r="15.5"
            fill="none"
            stroke="#6EC2B5"
            strokeWidth="1.25"
          />
          <circle cx="90" cy="90" r="2.7" fill="#42B0A2" />
        </g>
      );

    case "weekly":
      // Anel de cadência semanal com 7 marcadores e arco contínuo de ciclo
      return (
        <g>
          <circle
            cx="90"
            cy="90"
            r="22"
            fill="none"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="0.9"
          />
          <path
            d="M 90 73 A 17 17 0 1 1 75.3 98.5"
            fill="none"
            stroke="#6EC2B5"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <polygon points="73.5,95.5 78.2,97.2 74.5,101.2" fill="#6EC2B5" />
          {weeklyTicks.map((deg, idx) => {
            const rad = (deg * Math.PI) / 180;
            const x = 90 + 22 * Math.cos(rad);
            const y = 90 + 22 * Math.sin(rad);
            return (
              <circle
                key={deg}
                cx={x}
                cy={y}
                r={idx === 0 ? "2.4" : "1.5"}
                fill={idx === 0 ? "#42B0A2" : "#E4EAF3"}
              />
            );
          })}
          <circle cx="90" cy="90" r="2.2" fill="#E4EAF3" />
        </g>
      );

    case "strategy":
      // Retículo ortogonal com vetor direcional calibrado (estratégia por banca)
      return (
        <g>
          <line
            x1="64"
            y1="90"
            x2="116"
            y2="90"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="0.85"
          />
          <line
            x1="90"
            y1="64"
            x2="90"
            y2="116"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="0.85"
          />
          <polygon
            points="90,68 112,90 90,112 68,90"
            fill="none"
            stroke="rgba(255,255,255,0.38)"
            strokeWidth="1"
          />
          <line
            x1="77"
            y1="103"
            x2="105"
            y2="75"
            stroke="#6EC2B5"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <polyline
            points="97,75 105,75 105,83"
            fill="none"
            stroke="#6EC2B5"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="90" cy="90" r="2.5" fill="#E4EAF3" />
        </g>
      );

    case "technology":
      // Moldura octogonal de precisão com barras ascendentes de telemetria
      return (
        <g>
          <rect
            x="70"
            y="70"
            width="40"
            height="40"
            rx="4"
            fill="none"
            stroke="rgba(255,255,255,0.24)"
            strokeWidth="0.95"
          />
          <line
            x1="75"
            y1="102"
            x2="105"
            y2="102"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="0.9"
          />
          <line
            x1="80"
            y1="102"
            x2="80"
            y2="92"
            stroke="#E4EAF3"
            strokeWidth="2.1"
            strokeLinecap="round"
          />
          <line
            x1="86.7"
            y1="102"
            x2="86.7"
            y2="86"
            stroke="#E4EAF3"
            strokeWidth="2.1"
            strokeLinecap="round"
          />
          <line
            x1="93.3"
            y1="102"
            x2="93.3"
            y2="82"
            stroke="#6EC2B5"
            strokeWidth="2.1"
            strokeLinecap="round"
          />
          <line
            x1="100"
            y1="102"
            x2="100"
            y2="76"
            stroke="#42B0A2"
            strokeWidth="2.1"
            strokeLinecap="round"
          />
        </g>
      );
  }
}

function ProprietarySeal({ seal }: { seal: Seal }) {
  const topArcId = `regis-seal-top-${seal.roman}`;
  const bottomArcId = `regis-seal-bot-${seal.roman}`;

  return (
    <svg
      viewBox="0 0 180 180"
      className="size-[136px] shrink-0 sm:size-[148px]"
      aria-hidden
    >
      <defs>
        {/* Arco superior (esquerda -> direita por cima, texto externo ao raio 61) */}
        <path id={topArcId} d="M 29,90 A 61,61 0 0,1 151,90" />
        {/* Arco inferior (esquerda -> direita por baixo, leitura ereta) */}
        <path id={bottomArcId} d="M 23.5,90 A 66.5,66.5 0 0,0 156.5,90" />
      </defs>

      {/* Corpo circular fosco do selo */}
      <circle
        cx="90"
        cy="90"
        r="85"
        fill="#0A152A"
        stroke="rgba(255, 255, 255, 0.14)"
        strokeWidth="1"
      />

      {/* Anel externo de calibração — micro-rotação discreta ao passar o cursor */}
      <g className="origin-center transition-transform duration-700 ease-soft group-hover:rotate-[8deg]">
        <circle
          cx="90"
          cy="90"
          r="78"
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="0.75"
        />
        {outerTicks.map((deg) => {
          const isCardinal = deg % 90 === 0;
          const isSub = deg % 30 === 0;
          return (
            <line
              key={deg}
              x1="90"
              y1={isCardinal ? "6.5" : isSub ? "8" : "9.5"}
              x2="90"
              y2="12"
              stroke={
                isCardinal
                  ? "#42B0A2"
                  : isSub
                    ? "rgba(255,255,255,0.32)"
                    : "rgba(255,255,255,0.14)"
              }
              strokeWidth={isCardinal ? "1.3" : "0.75"}
              strokeLinecap="round"
              transform={`rotate(${deg} 90 90)`}
            />
          );
        })}
      </g>

      {/* Anel intermediário da faixa tipográfica */}
      <circle
        cx="90"
        cy="90"
        r="52"
        fill="#081122"
        stroke="rgba(66, 176, 162, 0.42)"
        strokeWidth="1"
      />
      <circle
        cx="90"
        cy="90"
        r="46"
        fill="none"
        stroke="rgba(255, 255, 255, 0.08)"
        strokeWidth="0.75"
        strokeDasharray="2 3"
      />

      {/* Marcadores losangulares laterais separando a tipografia radial */}
      <polygon points="23,90 25.5,87.8 28,90 25.5,92.2" fill="#42B0A2" />
      <polygon points="152,90 154.5,87.8 157,90 154.5,92.2" fill="#42B0A2" />

      {/* Tipografia radial integrada ao selo */}
      <text
        fill="#DCE4F0"
        fontSize="7.1"
        fontWeight="600"
        letterSpacing="2.05"
        fontFamily="var(--font-body), ui-sans-serif, sans-serif"
      >
        <textPath href={`#${topArcId}`} startOffset="50%" textAnchor="middle">
          MENTORIA REGISDÊNCIA
        </textPath>
      </text>

      <text
        fill="#6EC2B5"
        fontSize="6.6"
        fontWeight="600"
        letterSpacing="1.6"
        fontFamily="var(--font-body), ui-sans-serif, sans-serif"
      >
        <textPath
          href={`#${bottomArcId}`}
          startOffset="50%"
          textAnchor="middle"
        >
          {seal.ringBottom}
        </textPath>
      </text>

      {/* Símbolo geométrico exclusivo do pilar */}
      <SealCentralMark kind={seal.kind} />
    </svg>
  );
}

export function InstitutionalSeals() {
  return (
    <div
      className="mt-20 border-t border-white/10 pt-14 lg:mt-24 lg:pt-16"
      aria-label="Pilares do Padrão Mentoria Regisdência"
    >
      <div className="mb-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-body text-xs font-semibold uppercase tracking-[0.22em] text-brand-300">
            Padrão Mentoria Regisdência
          </p>
          <h3 className="mt-2 font-display text-2xl font-medium tracking-tight text-ondark sm:text-[28px]">
            Compromissos de método que sustentam cada preparação.
          </h3>
        </div>
        <p className="max-w-sm text-[13.5px] leading-relaxed text-navy-300">
          Quatro selos próprios que definem o padrão de entrega em cada ciclo de
          acompanhamento individual.
        </p>
      </div>

      {/* Friso editorial sem caixas retangulares genéricas */}
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-white/[0.08]">
        {seals.map((seal) => (
          <article
            key={seal.roman}
            className="group flex flex-col items-start border-t border-white/[0.08] pt-8 first:border-t-0 first:pt-0 sm:border-t-0 sm:pt-0 lg:px-7 first:lg:pl-0 last:lg:pr-0"
          >
            <ProprietarySeal seal={seal} />

            <div className="mt-5 lg:mt-6">
              <h4 className="font-display text-[20px] font-medium leading-snug text-ondark transition-colors duration-200 group-hover:text-white">
                {seal.title}
              </h4>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ondark-soft">
                {seal.desc}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
