import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Cliente para lectura pública del catálogo (usa SOLO la anon key).
// Devuelve null si no hay credenciales, para que la app funcione con datos
// de respaldo (fallback) antes de conectar Supabase.

let _client: SupabaseClient | null | undefined;

export function getSupabase(): SupabaseClient | null {
  if (_client !== undefined) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  _client = url && key ? createClient(url, key) : null;
  return _client;
}
