import { createBrowserClient } from "@supabase/ssr";
import { site } from "@/config/site";

/** Cliente de browser (anon key). Nunca expõe a service role. */
export function createClient() {
  return createBrowserClient(
    site.supabase.url || "http://localhost:54321",
    site.supabase.anonKey || "public-anon",
  );
}
