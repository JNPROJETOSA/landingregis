/**
 * Validação de candidatura (espelhada em cliente e servidor).
 * O servidor é a única fonte de verdade — o front apenas dá feedback.
 */

export type CandidaturaInput = {
  nome: string;
  whatsapp: string;
  email: string;
  situacao: string; // "graduado" | "interno" | "medico_atuante" | "outra"
  situacaoOutra?: string;
  provas: string[]; // ex.: ["ENARE", "SESP-PE"]
  dificuldade: string; // texto livre curto
  indicacao?: string; // código de indicação / cupom (manual)
  origem?: {
    ref?: string;
    cupom?: string;
    utm?: Record<string, string>;
    referrer?: string;
  };
  lgpd?: boolean;
};

export type FieldErrors = Partial<
  Record<
    | "nome"
    | "whatsapp"
    | "email"
    | "situacao"
    | "provas"
    | "dificuldade"
    | "lgpd",
    string
  >
>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizePhone(input: string): string {
  return input.replace(/\D/g, "");
}

export function getSituacaoLabel(value: string): string {
  return SITUACOES.find((s) => s.value === value)?.label ?? value;
}

export function validateCandidatura(input: CandidaturaInput): FieldErrors {
  const e: FieldErrors = {};

  const nome = input.nome?.trim() ?? "";
  if (nome.length < 3) e.nome = "Informe seu nome completo.";
  else if (nome.length > 120) e.nome = "Nome muito longo.";

  const phone = normalizePhone(input.whatsapp ?? "");
  if (phone.length < 8 || phone.length > 15)
    e.whatsapp = "Informe um número de WhatsApp válido (com DDD).";

  const email = input.email?.trim() ?? "";
  if (email && !EMAIL_RE.test(email))
    e.email = "Informe um e-mail válido.";

  const validSituacao = SITUACOES.some((s) => s.value === input.situacao);
  if (!input.situacao || !validSituacao)
    e.situacao = "Selecione sua situação acadêmica/profissional.";
  else if ((input.situacaoOutra?.trim() ?? "").length > 150)
    e.situacao = "Mantenha a descrição da situação mais curta.";

  const validProvas = Array.isArray(input.provas)
    ? input.provas.filter((p) => (PROVAS as readonly string[]).includes(p))
    : [];
  if (validProvas.length === 0)
    e.provas = "Escolha ao menos uma prova pretendida.";

  const dif = input.dificuldade?.trim() ?? "";
  if (dif.length < 3)
    e.dificuldade = "Conte em poucas palavras sua principal dificuldade.";
  else if (dif.length > 600) e.dificuldade = "Mantenha o campo mais curto.";

  return e;
}

export const SITUACOES = [
  { value: "graduado", label: "Recém-formado" },
  { value: "interno", label: "Estagiário em internato" },
  { value: "medico_atuante", label: "Médico que trabalha" },
  { value: "outra", label: "Outra" },
] as const;

export const PROVAS = [
  "ENARE",
  "SESP-PE",
  "USP-SP",
  "FESP-PE",
  "UNICAMP",
  "Outra",
] as const;
