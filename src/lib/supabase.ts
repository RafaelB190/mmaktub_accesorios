import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && serviceRoleKey);

export const isStoreConfigured =
  isSupabaseConfigured && Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN?.trim());

let client: SupabaseClient | null = null;

/**
 * Server-only client. The service role key bypasses RLS, so this module must
 * never be imported from a client component.
 */
export function getSupabase() {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Supabase no está configurado. Completá NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  client ??= createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return client;
}

export const MEDIA_BUCKET = "media";
