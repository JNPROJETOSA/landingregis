import type { Metadata, Viewport } from "next";
import { DM_Sans, Newsreader } from "next/font/google";
import { site } from "@/config/site";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { TrackingCapture } from "@/components/TrackingCapture";

/**
 * Tipografia editorial contemporânea:
 *  - Newsreader (serif editorial com optical size automático) — títulos e prosa
 *    com sobriedade contemporânea e credibilidade médica.
 *  - DM Sans (sans geométrica-humanista de alta legibilidade) — corpo, UI, dados e marca.
 */
const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
  adjustFontFallback: false,
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  keywords: [
    "mentoria residência médica",
    "Mentoria Regisdência",
    "Regisdência",
    "preparação residência médica",
    "ENARE",
    "SES-PE",
    "USP-SP",
    "residência médica 2027",
  ],
  alternates: { canonical: site.url },
};

export const viewport: Viewport = {
  themeColor: "#0D1930",
  width: "device-width",
  initialScale: 1,
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${newsreader.variable} ${dmSans.variable} font-body`}>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-500 focus:px-4 focus:py-2.5 focus:font-body focus:text-sm focus:font-semibold focus:text-navy-950"
      >
        Pular para o conteúdo
      </a>
      <Navigation />
      <main id="conteudo">{children}</main>
      <Footer />
      <FloatingWhatsApp />
      {/* Captura de origem (ref, cupom e UTM) no primeiro carregamento. */}
      <TrackingCapture />
    </div>
  );
}
