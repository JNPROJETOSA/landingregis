"use client";
import type { ReactNode } from "react";

type MarqueeProps = {
  children: ReactNode;
  /** Duração de um ciclo completo em segundos */
  duration?: number;
  /** Pausa ao passar o mouse ou focar via teclado */
  pauseOnHover?: boolean;
  className?: string;
  ariaLabel?: string;
};

/**
 * Marquee infinito contínuo (adaptado do padrão 21st.dev para Tailwind v3):
 * - Looping contínuo sem saltos com tradução de -50% sobre duas pistas idênticas.
 * - Segunda pista oculta da árvore de acessibilidade (aria-hidden) para não duplicar anúncios.
 * - Pausa em hover e focus-within; respeita prefers-reduced-motion com fallback estático.
 */
export function Marquee({
  children,
  duration = 38,
  pauseOnHover = true,
  className = "",
  ariaLabel,
}: MarqueeProps) {
  return (
    <div
      aria-label={ariaLabel}
      className={`relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] ${
        pauseOnHover ? "marquee-group" : ""
      } ${className}`}
    >
      {/* Fallback acessível para movimento reduzido */}
      <div className="hidden motion-reduce:flex motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-3">
        {children}
      </div>

      {/* Pista animada contínua (oculta em prefers-reduced-motion) */}
      <div
        className="marquee-track flex w-max shrink-0 items-center animate-marquee motion-reduce:hidden"
        style={
          {
            "--marquee-duration": `${duration}s`,
          } as React.CSSProperties
        }
      >
        <div className="flex shrink-0 items-center gap-4 pr-4 sm:gap-5 sm:pr-5">
          {children}
        </div>
        <div
          aria-hidden="true"
          className="flex shrink-0 items-center gap-4 pr-4 sm:gap-5 sm:pr-5"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
