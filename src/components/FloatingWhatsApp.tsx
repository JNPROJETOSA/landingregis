"use client";
import { site } from "@/config/site";
import { buildWhatsAppUrl } from "@/lib/tracking";

/**
 * Botão flutuante de WhatsApp. Somente quando há número configurado;
 * caso contrário, esconde-se (nunca mostra um link vazio).
 */
export function FloatingWhatsApp() {
  if (!site.whatsapp.number) return null;
  return (
    <a
      href={buildWhatsAppUrl(site.whatsapp.messages.floating)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com SAC no WhatsApp"
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-full bg-ink-900 p-3 pl-4 text-porcelain-50 shadow-deep ring-1 ring-brand-500/40 transition-all duration-300 hover:-translate-y-0.5 hover:ring-brand-400 sm:bottom-6 sm:right-6"
    >
      <span className="hidden max-w-0 items-center overflow-hidden whitespace-nowrap text-sm font-semibold opacity-0 transition-all duration-300 group-hover:max-w-[15rem] group-hover:opacity-100 sm:flex">
        Falar com SAC no WhatsApp
      </span>
      <span className="flex size-6 items-center justify-center rounded-full bg-brand-500 text-ink-950">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.2-1.37a9.9 9.9 0 004.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.83 9.83 0 0012.04 2zm0 18.02h-.01a8.2 8.2 0 01-4.19-1.15l-.3-.18-3.08.8.83-3.01-.2-.31a8.23 8.23 0 01-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 012.41 5.83c0 4.54-3.7 8.23-8.23 8.23zm4.52-6.16c-.25-.13-1.47-.72-1.7-.8-.23-.09-.4-.13-.56.12-.16.25-.63.8-.77.97-.14.16-.33.18-.58.06-.25-.13-1.05-.39-2-1.27-.74-.68-1.24-1.52-1.38-1.77-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.09-.16.04-.31-.03-.43-.06-.13-.56-1.34-.76-1.83-.2-.47-.4-.42-.56-.42h-.48c-.16 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.16 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.53.59.19.85.16 1.17.1.35-.08 1.05-.43 1.2-.84.15-.41.15-.76.11-.84-.05-.07-.2-.11-.45-.24z" />
        </svg>
      </span>
    </a>
  );
}
