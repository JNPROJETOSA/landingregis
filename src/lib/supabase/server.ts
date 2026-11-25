import { createServerClient } from "@supabase/ssr";
import { site } from "@/config/site";

/**
 * Cliente com service role — SOMENTE em servidor (API routes / painel).
 * O .env.example deixa explícito que esta chave nunca deve ser exposta.
 */
export function createServerSupabase() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key || !site.supabase.url) return null;
  return createServerClient(site.supabase.url, key, {
    auth: { persistSession: false },
  });
}

export function supabaseReady(): boolean {
  return Boolean(
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
      site.supabase.url &&
      site.supabase.anonKey,
  );
}
