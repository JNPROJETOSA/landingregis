import Link from "next/link";
import { site } from "@/config/site";
import { Logo } from "@/components/ui/Logo";
import { CTA } from "@/components/ui/CTA";

/**
 * Footer (#091326) — identidade horizontal integrada e transição natural
 * após a seção de candidatura.
 */
export function Footer() {
  return (
    <footer className="section-overlap bg-footer relative overflow-x-clip text-ondark">
      <div className="shell-wide grid gap-10 pb-14 pt-20 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,0.85fr)_minmax(0,1.15fr)_minmax(0,1.25fr)] lg:gap-12 lg:pb-16">
        <div className="max-w-xs">
          <Link href="#topo" className="inline-flex" aria-label={site.name}>
            <Logo variant="horizontal" size={44} />
          </Link>
          <p className="mt-5 text-[14px] leading-relaxed text-ondark-soft">
            Mentoria individualizada para residência médica, com planejamento
            semanal, acompanhamento próximo e plataforma integrada de métricas,
            simulados e análise de incidência por banca.
          </p>
        </div>

        <nav aria-label="Navegação do rodapé" className="text-[14px]">
          <p className="font-body text-[13px] font-semibold text-white">
            Navegação
          </p>
          <ul className="mt-4 space-y-3">
            {[
              ["Método", "#metodo"],
              ["Plataforma", "#plataforma"],
              ["Mentor", "#mentor"],
              ["Perguntas", "#faq"],
              ["Candidatura", "#candidatura"],
            ].map(([label, href]) => (
              <li key={href}>
                <a
                  href={href}
                  className="link-underline text-ondark-soft transition-colors hover:text-white"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="text-[14px]">
          <p className="font-body text-[13px] font-semibold text-white">
            Candidatura
          </p>
          <ul className="mt-4 space-y-3">
            <li>
              <Link
                href="#candidatura"
                className="link-underline text-ondark-soft transition-colors hover:text-white"
              >
                Quero fazer parte da mentoria
              </Link>
            </li>
            <li>
              <CTA
                href="whatsapp"
                variant="outline"
                newTab
                className="on-ink btn-sm mt-1 px-4 text-xs"
              >
                Falar com SAC no WhatsApp
              </CTA>
            </li>
          </ul>
          <p className="mt-6 text-xs leading-relaxed text-navy-300">
            Matrículas {site.campaignYear}. Vagas limitadas pela capacidade real
            de acompanhamento individual.
          </p>
        </div>

        <div className="text-[14px]">
          <p className="font-body text-[13px] font-semibold text-white">
            Privacidade
          </p>
          <p className="mt-4 text-[13px] leading-relaxed text-navy-300">
            Ao enviar sua candidatura, seus dados são utilizados exclusivamente
            para o contato sobre a mentoria, em conformidade com a LGPD. Não
            compartilhamos nem revendemos suas informações.
          </p>
        </div>
      </div>

      <div className="rule-on-ink" />
      <div className="shell-wide flex flex-col items-start justify-between gap-3 py-6 sm:flex-row sm:items-center">
        <p className="text-xs text-navy-300">
          © {new Date().getFullYear()} {site.name}. Todos os direitos
          reservados.
        </p>
        <p className="text-xs text-navy-300">
          Materiais demonstrativos são ilustrativos.
        </p>
      </div>
    </footer>
  );
}
