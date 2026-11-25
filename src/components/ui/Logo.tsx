import Image from "next/image";
import { site } from "@/config/site";

type LogoVariant = "horizontal" | "stacked" | "icon";

/**
 * Identidade visual oficial — Mentoria Regisdência.
 * Combina o mascote oficial (PNG transparente, sem distorção) com tipografia
 * renderizada em código para nitidez máxima, kerning controlado e grafia
 * correta ("REGISDÊNCIA", palavra única sem hífen).
 */
export function Logo({
  variant = "icon",
  onLight = false,
  size = 42,
  className = "",
}: {
  variant?: LogoVariant;
  /** true quando aplicado sobre fundos claros */
  onLight?: boolean;
  /** dimensão do emblema do mascote em px (para variant="icon" ou "horizontal") */
  size?: number;
  className?: string;
}) {
  const mascotBadge = (
    <span
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ height: size }}
    >
      <Image
        src={site.brand.mascot}
        alt={variant === "icon" ? `${site.name} — mascote oficial` : ""}
        aria-hidden={variant !== "icon"}
        width={1024}
        height={849}
        sizes={`${Math.round(size * 1.3)}px`}
        quality={95}
        className="block h-full w-auto object-contain"
        priority={variant === "horizontal"}
      />
    </span>
  );

  if (variant === "icon") {
    return (
      <span className={`inline-flex shrink-0 ${className}`} title={site.name}>
        {mascotBadge}
      </span>
    );
  }

  if (variant === "stacked") {
    return (
      <span
        className={`inline-flex flex-col items-center text-center select-none ${className}`}
        title={site.name}
      >
        <span className="relative flex w-[138px] items-end justify-center sm:w-[162px]">
          <Image
            src={site.brand.mascot}
            alt="Mascote oficial da Mentoria Regisdência"
            width={1024}
            height={849}
            sizes="162px"
            quality={95}
            className="block h-auto w-full object-contain"
          />
        </span>
        <span
          className="mt-1 block h-px w-full max-w-[230px] bg-gradient-to-r from-transparent via-white/20 to-transparent"
          aria-hidden
        />
        <span className="mt-3.5 block font-body text-[11px] font-semibold uppercase tracking-[0.34em] text-ondark/85 sm:text-[12px]">
          Mentoria
        </span>
        <span className="mt-0.5 block font-body text-[24px] font-bold uppercase leading-none tracking-[0.06em] text-brand-400 sm:text-[28px]">
          Regisdência
        </span>
      </span>
    );
  }

  // variant === "horizontal" — otimizada para header e footer
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-3 select-none ${className}`}
      title={site.name}
    >
      {mascotBadge}
      <span className="flex flex-col justify-center leading-none">
        <span
          className={`font-body text-[10px] font-semibold uppercase tracking-[0.26em] ${
            onLight ? "text-smoke-600" : "text-ondark/75"
          }`}
        >
          Mentoria
        </span>
        <span
          className={`mt-1 font-body text-[16px] font-bold uppercase tracking-[0.05em] sm:text-[17px] ${
            onLight ? "text-navy-800" : "text-brand-400"
          }`}
        >
          Regisdência
        </span>
      </span>
    </span>
  );
}
