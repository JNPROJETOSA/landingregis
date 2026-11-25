"use client";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * Parallax extremamente discreto: deslocamento vertical de poucos pixels,
 * apenas em desktop e sem prefers-reduced-motion. Uma única leitura de scroll
 * por frame (requestAnimationFrame), apenas transform.
 */
export function Parallax({
  children,
  speed = 0.05,
  max = 36,
  className = "",
}: {
  children: ReactNode;
  speed?: number;
  max?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
    );
    if (!mq.matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = Math.min(window.scrollY * speed, max);
      el.style.transform = `translate3d(0, ${-y}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed, max]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
