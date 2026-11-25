/**
 * Identidade e integrações — única fonte de verdade.
 *
 * Preencha os valores reais antes de publicar. Os campos vazios deixam a
 * funcionalidade correspondente em modo "preparado" (o código segue sem
 * simular dados reais):
 *  - whatsapp.vazio -> CTAs de WhatsApp usam "em breve" ou link placeholder.
 *  - supabase.vazio -> candidaturas e notificações reportam status "pendente".
 */

export const site = {
  name: "Mentoria Regisdência",
  shortName: "Regisdência",
  tagline: "Mentoria individualizada para residência médica",
  campaignYear: 2027,
  locale: "pt-BR",

  description:
    "Mentoria individualizada para residência médica, com planejamento semanal, reuniões individuais com o mentor, contato direto pelo WhatsApp e uma plataforma completa para orientar cada etapa da preparação.",

  url: process.env.NEXT_PUBLIC_SITE_URL || "https://mentoria-regisdencia.com.br",

  // Identidade visual (assets oficiais fornecidos pelo cliente).
  brand: {
    logo: "/assets/logo-regisdencia-dark.png",
    logoLight: "/assets/logo-regisdencia-light.png",
    mascot: "/assets/mascot-regisdencia.png",
    // Fotografia oficial do mentor principal (Régis) — usada exclusivamente na seção do Mentor.
    mentorPhoto: "/assets/mentor-regis.jpg",
    mentorPhotoReady: true,
    // Assets autorais de direção de arte (estratégia & medicina).
    strategyKnight: "/assets/strategy-knight.jpg",
    strategyVideo: "/assets/strategy-loop.mp4",
    medicalAnatomy: "/assets/medical-anatomy.jpg",
    medicalAnatomyVideo: "/assets/brain-loop.mp4",
  },

  whatsapp: {
    // Formato internacional, somente dígitos. Ex.: "5511999999999".
    number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
    // Mensagem padrão pré-preenchida (o código de indicação/cupom é anexado pelo front-end).
    defaultMessage:
      "Olá! Quero saber mais sobre a Mentoria Regisdência (matrículas 2027).",
  },

  // Prazo de resposta — exibir somente quando confirmado/configurado.
  contactResponseSla: {
    enabled: false,
    text: "Nossa equipe responde em até 24h úteis.",
  },

  // Supabase (client-side, somente URL + anon key). Nunca exponha a service role.
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    isConfigured:
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  },

  // Telegram (somente backend — nunca publique o token).
  telegram: {
    token: process.env.TELEGRAM_BOT_TOKEN || "",
    chatId: process.env.TELEGRAM_CHAT_ID || "",
    isConfigured:
      Boolean(process.env.TELEGRAM_BOT_TOKEN) &&
      Boolean(process.env.TELEGRAM_CHAT_ID),
  },

  // E-mail de notificação (backend). Prefira provedor transacional (Resend, Postmark, SES).
  email: {
    provider: process.env.MAIL_PROVIDER || "",
    token: process.env.MAIL_TOKEN || "",
    from: process.env.MAIL_FROM || "equipe@mentoria-regisdencia.com.br",
    to: process.env.MAIL_TO || "",
    isConfigured:
      Boolean(process.env.MAIL_PROVIDER) &&
      Boolean(process.env.MAIL_TOKEN) &&
      Boolean(process.env.MAIL_TO),
  },

  // Depoimentos e aprovações REAIS. Inserir somente após autorização confirmada.
  // Enquanto estiver vazio, a seção permanece oculta na página pública.
  testimonials: {
    approvals: [] as string[],
    quotes: [] as {
      name: string;
      context: string;
      quote: string;
      approval?: string;
    }[],
    enabled: true,
  },
} as const;

export type SiteConfig = typeof site;
