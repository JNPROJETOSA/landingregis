"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** atraso em ms para cascata (stagger) */
  delay?: number;
  as?: "div" | "section" | "li" | "article";
  variant?: "up" | "left" | "right" | "scale" | "fade";
};

/**
 * Revelação discreta ao rolar (opacity + transform). Se o IntersectionObserver
 * não existir, o conteúdo aparece imediatamente — nada fica oculto.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  as = "div",
  variant = "up",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as as "div";
  return (
    <Tag
      ref={ref}
      data-v={variant}
      className={`reveal ${shown ? "is-in" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
