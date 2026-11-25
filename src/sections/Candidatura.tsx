"use client";
import { useEffect, useRef, useState } from "react";
import { site } from "@/config/site";
import {
  PROVAS,
  SITUACOES,
  validateCandidatura,
  type CandidaturaInput,
  type FieldErrors,
} from "@/lib/validation";
import { getStoredOrigin, type Origin } from "@/lib/tracking";
import { Reveal } from "@/components/ui/Reveal";
import { CTA } from "@/components/ui/CTA";

type Status = "idle" | "submitting" | "success" | "error";

export function Candidatura() {
  const [form, setForm] = useState({
    nome: "",
    whatsapp: "",
    email: "",
    situacao: "",
    situacaoOutra: "",
    provas: [] as string[],
    dificuldade: "",
    indicacao: "",
    lgpd: false,
    website: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMsg, setServerMsg] = useState<string | null>(null);
  const [origin, setOrigin] = useState<Origin>({ utm: {} });
  const submittingRef = useRef(false);

  useEffect(() => {
    setOrigin(getStoredOrigin());
  }, []);

  const update = (k: keyof typeof form, v: unknown) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (k in errors) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[k as keyof FieldErrors];
        return next;
      });
    }
  };

  const toggleProva = (p: string) => {
    setForm((f) => {
      const has = f.provas.includes(p);
      let provas = has ? f.provas.filter((x) => x !== p) : [...f.provas, p];
      if (p === "Outra") {
        // "Outra" é exclusiva: ao marcar, remove as demais; ao desmarcar, mantém as outras.
        if (!has) provas = ["Outra"];
      } else {
        provas = provas.filter((x) => x !== "Outra");
      }
      return { ...f, provas };
    });
    if (errors.provas) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.provas;
        return next;
      });
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;

    const clientErrors = validateCandidatura({
      nome: form.nome,
      whatsapp: form.whatsapp,
      email: form.email,
      situacao: form.situacao,
      situacaoOutra: form.situacaoOutra,
      provas: form.provas,
      dificuldade: form.dificuldade,
      indicacao: form.indicacao,
    });
    if (!form.lgpd) {
      clientErrors.lgpd = "É necessário autorizar o tratamento dos dados (LGPD).";
    }
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      setStatus("error");
      setServerMsg("Confira os campos destacados abaixo antes de enviar.");
      return;
    }

    submittingRef.current = true;
    setStatus("submitting");
    setErrors({});
    setServerMsg(null);

    // Código manual tem precedência sobre o capturado na origem.
    const manualCode = form.indicacao.trim();
    const ref = manualCode || origin.ref;
    const cupom = manualCode ? undefined : origin.cupom;

    const payload: CandidaturaInput = {
      nome: form.nome,
      whatsapp: form.whatsapp,
      email: form.email,
      situacao: form.situacao,
      situacaoOutra: form.situacaoOutra,
      provas: form.provas,
      dificuldade: form.dificuldade,
      indicacao: manualCode || undefined,
      origem: {
        ref: origin.ref,
        cupom: origin.cupom,
        utm: origin.utm,
        referrer: typeof document !== "undefined" ? document.referrer : "",
      },
    };
    // Garante que o código manual não se perca na origem.
    if (manualCode) payload.origem = { ...payload.origem, ref: manualCode };

    try {
      const res = await fetch("/api/candidatura", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          ref,
          cupom,
          lgpd: form.lgpd,
          website: form.website,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok === true) {
        setStatus("success");
        setServerMsg(data.message ?? null);
      } else {
        if (data.errors) {
          setErrors(data.errors as FieldErrors);
        }
        setStatus("error");
        setServerMsg(
          data.message ??
            (data.errors
              ? "Confira os campos destacados abaixo antes de enviar."
              : "Não foi possível enviar agora. Seus dados foram preservados — tente novamente ou fale pelo WhatsApp."),
        );
      }
    } catch {
      setStatus("error");
      setServerMsg(
        "Falha de conexão ao enviar sua candidatura. Seus dados foram mantidos — tente novamente ou fale pelo WhatsApp.",
      );
    } finally {
      submittingRef.current = false;
    }
  };

  const sla = site.contactResponseSla.enabled ? site.contactResponseSla.text : null;

  /* Estilos refinados do formulário integrado à superfície clara sobre azul profundo */
  const inputBase =
    "min-h-[46px] w-full rounded-lg border border-line bg-white px-4 py-2.5 font-body text-[16px] font-medium text-ink-800 placeholder:text-smoke-400 outline-none transition-all duration-200 focus:border-brand-700 focus:ring-2 focus:ring-brand-500/20 sm:text-[15px]";

  const chip = (selected: boolean) =>
    `min-h-[44px] rounded-lg px-3.5 py-2 font-body text-[13px] font-semibold transition-all duration-150 sm:min-h-[40px] ${
      selected
        ? "bg-navy-800 text-white ring-1 ring-navy-800 shadow-subtle"
        : "border border-line bg-white text-smoke-700 hover:border-navy-800/35 hover:text-navy-800"
    }`;

  const label = "mb-2 block font-body text-[13px] font-semibold text-navy-800";

  return (
    <section
      id="candidatura"
      className="section-overlap section-pad bg-apply relative isolate overflow-x-clip text-ondark"
      aria-labelledby="candidatura-heading"
    >
      <div className="shell-wide relative z-10">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          {/* Coluna editorial de contexto */}
          <Reveal className="min-w-0">
            <div className="lg:sticky lg:top-28">
              <p className="section-label on-ink">
                <span className="dot" aria-hidden />
                Candidatura
              </p>
              <h2
                id="candidatura-heading"
                className="type-h2 mt-6 font-display font-medium text-ondark"
              >
                Quero fazer parte da mentoria.
              </h2>
              <p className="mt-5 max-w-md text-[16px] leading-relaxed text-ondark-soft sm:text-[17px]">
                A candidatura é o primeiro passo para conversar com a nossa
                equipe sobre sua preparação. Preencha em menos de dois minutos
                para entendermos sua rotina e seus objetivos.
              </p>

              <ul className="mt-9 space-y-4 border-t border-white/[0.12] pt-8 text-[14px] leading-relaxed text-ondark-soft">
                {[
                  "Sem burocracia: os dados abaixo bastam para iniciarmos a conversa.",
                  "Se veio por indicação ou cupom, o código já foi identificado — ou você pode digitá-lo.",
                  "Seus dados são tratados em conformidade com a LGPD, exclusivamente para este atendimento.",
                ].map((t, i) => (
                  <li key={t} className="flex gap-4">
                    <span
                      className="pt-0.5 font-body text-xs font-bold tabular-nums text-brand-300"
                      aria-hidden
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-9 border-t border-white/[0.12] pt-8">
                <p className="font-body text-[14px] font-medium text-ondark-soft">
                  Prefere conversar agora? Fale com nossa equipe pelo WhatsApp.
                </p>
                <CTA
                  href="whatsapp"
                  variant="outline"
                  className="on-ink btn-sm mt-3.5"
                  newTab
                  whatsappMessage={site.whatsapp.messages.candidaturaDirect}
                  ariaLabel="Falar com SAC no WhatsApp"
                >
                  Falar com SAC no WhatsApp
                </CTA>
              </div>
            </div>
          </Reveal>

          {/* Formulário integrado */}
          <Reveal delay={80} className="min-w-0">
            {status === "success" ? (
              <div
                role="status"
                aria-live="polite"
                className="rounded-ds-xl border border-white/20 bg-surface-light p-8 text-navy-800 shadow-dark sm:p-10"
              >
                <div className="flex items-center gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-700 text-white">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 12l5 5L20 7"
                        stroke="currentColor"
                        strokeWidth="2.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <h3 className="font-display text-2xl font-medium text-navy-800">
                    Recebemos sua candidatura!
                  </h3>
                </div>
                <p className="mt-4 text-[15px] leading-relaxed text-smoke-600">
                  Nossa equipe entrará em contato para conversar sobre sua
                  preparação.
                  {sla ? ` ${sla}` : ""}
                </p>
                <p className="mt-2 text-sm text-smoke-600">
                  Prefere conversar agora? Fale com nossa equipe pelo WhatsApp —
                  seu código de indicação, quando houver, já acompanha a
                  mensagem.
                </p>
                <div className="mt-7">
                  <CTA
                    href="whatsapp"
                    variant="ink"
                    newTab
                    whatsappMessage={site.whatsapp.messages.candidaturaSuccess}
                    className="w-full sm:w-auto"
                  >
                    Falar com SAC no WhatsApp
                  </CTA>
                </div>
              </div>
            ) : (
              <form
                onSubmit={submit}
                noValidate
                className="rounded-ds-xl border border-white/20 bg-surface-light p-5 text-navy-800 shadow-dark sm:p-9 lg:p-10"
              >
                {/* Campo honeypot invisível para proteção anti-spam */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={form.website}
                  onChange={(e) => update("website", e.target.value)}
                  className="sr-only"
                />
                {status === "error" && serverMsg && (
                  <p
                    role="alert"
                    className="mb-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 font-body text-sm font-medium text-red-800"
                  >
                    {serverMsg}
                  </p>
                )}

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="nome" className={label}>
                      Nome completo <span className="text-brand-700">*</span>
                    </label>
                    <input
                      id="nome"
                      type="text"
                      autoComplete="name"
                      value={form.nome}
                      onChange={(e) => update("nome", e.target.value)}
                      className={`${inputBase} ${errors.nome ? "border-red-400 ring-2 ring-red-300/40" : ""}`}
                      placeholder="Seu nome"
                      aria-invalid={Boolean(errors.nome)}
                    />
                    {errors.nome && (
                      <p className="mt-1.5 text-xs font-medium text-red-700">
                        {errors.nome}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="whatsapp" className={label}>
                      WhatsApp <span className="text-brand-700">*</span>
                    </label>
                    <input
                      id="whatsapp"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={form.whatsapp}
                      onChange={(e) => update("whatsapp", e.target.value)}
                      className={`${inputBase} ${errors.whatsapp ? "border-red-400 ring-2 ring-red-300/40" : ""}`}
                      placeholder="(11) 90000-0000"
                      aria-invalid={Boolean(errors.whatsapp)}
                    />
                    {errors.whatsapp && (
                      <p className="mt-1.5 text-xs font-medium text-red-700">
                        {errors.whatsapp}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className={label}>
                      E-mail{" "}
                      <span className="font-normal text-smoke-500">
                        (opcional)
                      </span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      className={inputBase}
                      placeholder="voce@email.com"
                      aria-invalid={Boolean(errors.email)}
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-xs font-medium text-red-700">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="border-t border-line pt-5 sm:col-span-2">
                    <span className={label}>
                      Sua situação <span className="text-brand-700">*</span>
                    </span>
                    <div
                      className="flex flex-wrap gap-2"
                      role="radiogroup"
                      aria-label="Situação acadêmica ou profissional"
                    >
                      {SITUACOES.map((s) => (
                        <button
                          key={s.value}
                          type="button"
                          role="radio"
                          aria-checked={form.situacao === s.value}
                          onClick={() => update("situacao", s.value)}
                          className={chip(form.situacao === s.value)}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                    {form.situacao === "outra" && (
                      <input
                        type="text"
                        value={form.situacaoOutra}
                        onChange={(e) =>
                          update("situacaoOutra", e.target.value)
                        }
                        className={`${inputBase} mt-3`}
                        placeholder="Descreva sua situação"
                        aria-label="Descreva sua situação"
                      />
                    )}
                    {errors.situacao && (
                      <p className="mt-1.5 text-xs font-medium text-red-700">
                        {errors.situacao}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <span className={label}>
                      Provas pretendidas{" "}
                      <span className="text-brand-700">*</span>
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {PROVAS.map((p) => (
                        <button
                          key={p}
                          type="button"
                          aria-pressed={form.provas.includes(p)}
                          onClick={() => toggleProva(p)}
                          className={`${chip(form.provas.includes(p))} tabular-nums`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                    {errors.provas && (
                      <p className="mt-1.5 text-xs font-medium text-red-700">
                        {errors.provas}
                      </p>
                    )}
                  </div>

                  <div className="border-t border-line pt-5 sm:col-span-2">
                    <label htmlFor="dificuldade" className={label}>
                      Sua principal dificuldade{" "}
                      <span className="text-brand-700">*</span>
                    </label>
                    <textarea
                      id="dificuldade"
                      rows={3}
                      value={form.dificuldade}
                      onChange={(e) => update("dificuldade", e.target.value)}
                      className={`${inputBase} min-h-[96px] resize-none py-3 ${errors.dificuldade ? "border-red-400 ring-2 ring-red-300/40" : ""}`}
                      placeholder="Ex.: conciliar estudos com plantões, organizar revisões, priorizar matérias para minha banca…"
                      aria-invalid={Boolean(errors.dificuldade)}
                    />
                    {errors.dificuldade && (
                      <p className="mt-1.5 text-xs font-medium text-red-700">
                        {errors.dificuldade}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="indicacao" className={label}>
                      Código de indicação ou cupom{" "}
                      <span className="font-normal text-smoke-500">
                        (opcional)
                      </span>
                    </label>
                    <input
                      id="indicacao"
                      type="text"
                      value={form.indicacao}
                      onChange={(e) => update("indicacao", e.target.value)}
                      className={inputBase}
                      placeholder={
                        origin.ref || origin.cupom
                          ? `Detectado: ${origin.ref || origin.cupom}`
                          : "Digite aqui se você tiver um"
                      }
                    />
                    {(origin.ref || origin.cupom) && (
                      <p className="mt-1.5 text-xs text-smoke-600">
                        Código{" "}
                        <span className="font-semibold text-brand-700">
                          {origin.ref || origin.cupom}
                        </span>{" "}
                        já identificado — ele será incluído na candidatura e no
                        WhatsApp.
                      </p>
                    )}
                  </div>
                </div>

                <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-lg border border-line bg-white p-4 transition-colors hover:border-smoke-300">
                  <input
                    type="checkbox"
                    checked={form.lgpd}
                    onChange={(e) => update("lgpd", e.target.checked)}
                    className="mt-0.5 size-4 shrink-0 accent-[#176E65]"
                  />
                  <span className="text-xs leading-relaxed text-smoke-600">
                    Autorizo o tratamento dos meus dados para contato sobre a
                    mentoria, em conformidade com a LGPD, exclusivamente para
                    este atendimento.
                  </span>
                </label>
                {errors.lgpd && (
                  <p className="mt-1.5 text-xs font-medium text-red-700">
                    {errors.lgpd}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="btn-primary mt-6 w-full py-4 text-[15px]"
                >
                  {status === "submitting" ? (
                    <span className="inline-flex items-center gap-2.5">
                      <span
                        className="size-4 animate-spin rounded-full border-2 border-navy-950/30 border-t-navy-950"
                        aria-hidden
                      />
                      Enviando sua candidatura…
                    </span>
                  ) : (
                    "Enviar minha candidatura"
                  )}
                </button>

                <p className="mt-4 text-center text-xs text-smoke-500">
                  Sem pagamento nesta etapa. Ao enviar, você concorda em ser
                  contactado pela equipe da {site.name}.
                </p>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
