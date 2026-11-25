"use client";
import { type ReactNode } from "react";
import { site } from "@/config/site";
import { buildWhatsAppUrl } from "@/lib/tracking";

type Props = {
  /** Âncora interna (ex.: #candidatura) ou "whatsapp". */
  href: string;
  children: ReactNode;
  variant?: "primary" | "ink" | "light" | "outline" | "teal";
  className?: string;
  /** Abre em nova aba (padrão para whatsapp). */
  newTab?: boolean;
  /** Rótulo visível para acessibilidade em links de WhatsApp. */
  ariaLabel?: string;
  /** Seta com deslocamento sutil no hover. */
  arrow?: boolean;
  /** Mensagem personalizada pré-preenchida quando href === "whatsapp". */
  whatsappMessage?: string;
};

export function CTA({
  href,
  children,
  variant = "ink",
  className = "",
  newTab,
  ariaLabel,
  arrow,
  whatsappMessage,
}: Props) {
  const isWhatsApp = href === "whatsapp";
  const finalHref = isWhatsApp ? buildWhatsAppUrl(whatsappMessage) : href;
  const configured = !isWhatsApp || Boolean(site.whatsapp.number);

  const base: Record<NonNullable<Props["variant"]>, string> = {
    primary: "btn-primary",
    ink: "btn-ink",
    light: "btn-light",
    outline: "btn-outline",
    teal: "btn-teal",
  };

  const ext = isWhatsApp ? "WhatsApp (abre em nova aba)" : undefined;

  return (
    <a
      href={configured ? finalHref : "#candidatura"}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
      aria-label={ariaLabel ?? ext}
      className={`${base[variant]} ${className} ${!configured ? "cursor-pointer" : ""}`}
      onClick={(e) => {
        if (!configured && isWhatsApp) {
          // Sem número configurado: direciona ao formulário de candidatura.
          e.preventDefault();
        }
      }}
    >
      {children}
      {arrow && (
        <svg
          className="arrow"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <path
            d="M5 12h14M13 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </a>
  );
}
