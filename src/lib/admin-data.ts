import { type AnuncioCosto, type LocantoDolarConfig, type SkokkaCreditosConfig, normalizarCosto } from "@/lib/admin-costos";
import { createClient } from "@/lib/supabase/server";

export async function cargarCostosAdmin() {
  const supabase = await createClient();
  const { data: costos, error } = await supabase
    .from("anuncio_costos")
    .select("*")
    .order("orden", { ascending: true });

  if (error) throw error;

  const { data: skokkaConfig } = await supabase
    .from("admin_config")
    .select("value")
    .eq("key", "skokka_creditos")
    .maybeSingle();

  const { data: locantoConfig } = await supabase
    .from("admin_config")
    .select("value")
    .eq("key", "locanto_dolar")
    .maybeSingle();

  return {
    costos: (costos ?? []).map((c) => normalizarCosto(c as AnuncioCosto)),
    skokkaCreditos: (skokkaConfig?.value ?? null) as SkokkaCreditosConfig | null,
    locantoDolar: (locantoConfig?.value ?? null) as LocantoDolarConfig | null,
  };
}
