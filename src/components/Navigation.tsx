"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { site } from "@/config/site";
import { CTA } from "@/components/ui/CTA";
import { Logo } from "@/components/ui/Logo";

const links = [
  { label: "Provas", href: "#provas" },
  { label: "Método", href: "#metodo" },
  { label: "Plataforma", href: "#plataforma" },
  { label: "Mentor", href: "#mentor" },
  { label: "Perguntas", href: "#faq" },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Indicador de seção ativa
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const ids = ["topo", ...links.map((l) => l.href.slice(1))];
    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Trava o scroll e escuta Escape quando o menu mobile está aberto.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) {
      return () => {
        document.body.style.overflow = "";
      };
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header
      className={`header-in fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled || open
          ? "border-white/10 bg-navy-950/85 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav
        className="shell-wide flex h-[76px] items-center justify-between gap-4 sm:gap-6"
        aria-label="Principal"
      >
        <Link
          href="#topo"
          className="flex shrink-0 items-center rounded-ds-md py-1 transition-opacity hover:opacity-95"
          aria-label={site.name}
        >
          <Logo variant="horizontal" size={42} />
        </Link>

        <ul className="hidden items-center gap-9 lg:flex">
          {links.map((l) => {
            const isActive = active === l.href.slice(1);
            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  data-active={isActive}
                  aria-current={isActive ? "true" : undefined}
                  className={`link-underline py-1 font-body text-[14px] font-medium transition-colors ${
                    isActive ? "text-white" : "text-ondark-soft hover:text-white"
                  }`}
                >
                  {l.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="hidden shrink-0 lg:block">
          <CTA href="#candidatura" variant="primary" className="btn-sm px-5">
            Quero fazer parte da mentoria
          </CTA>
        </div>

        <button
          type="button"
          className="flex size-11 items-center justify-center rounded-ds-md border border-white/15 bg-white/[0.04] text-ondark transition-colors hover:border-white/30 hover:bg-white/[0.08] lg:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden>
            {open ? (
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Menu mobile */}
      {open && (
        <div className="lg:hidden">
          <div
            className="fixed inset-0 top-[76px] z-40 bg-navy-950/70"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="relative z-50 max-h-[calc(100dvh-76px)] overflow-y-auto border-b border-white/10 bg-navy-900 pb-7 shadow-deep">
            <ul className="shell-wide flex flex-col">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between border-b border-white/10 py-4 font-display text-[22px] font-medium text-ondark transition-colors hover:text-brand-300"
                  >
                    {l.label}
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                      className="text-navy-400"
                    >
                      <path
                        d="M9 6l6 6-6 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
            <div className="shell-wide mt-6" onClick={() => setOpen(false)}>
              <CTA href="#candidatura" variant="primary" className="w-full">
                Quero fazer parte da mentoria
              </CTA>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
