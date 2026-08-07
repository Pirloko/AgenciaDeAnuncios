import type { AnuncioCosto, SitioAdmin } from "@/lib/admin-costos";
import { getSupabase } from "@/lib/supabase";
import type { Sitio, TablaPrecios } from "@/types/sitio";

/** Fila pública: solo lo que puede ver el cotizador (sin costo/margen). */
export interface PrecioPublico {
  sitio: string;
  categoria: string;
  plan: string;
  subidas: number | null;
  dias: number;
  etiqueta: string;
  precio_venta: number;
  orden: number;
}

const SKOKKA_PLAN_A_NIVEL: Record<string, string> = {
  TOP: "TOP",
  SUPERTOP: "SUPER TOP",
  "FULL DESTACADO": "TOP ALL IN ONE",
};

/** Carga precios de venta desde admin (vista pública). Fallback [] si no hay BD. */
export async function cargarPreciosPublicos(): Promise<PrecioPublico[]> {
  const sb = getSupabase();
  if (!sb) return [];

  const { data, error } = await sb
    .from("precios_publicos")
    .select("sitio,categoria,plan,subidas,dias,etiqueta,precio_venta,orden")
    .order("orden", { ascending: true });

  if (error || !data) {
    if (error) console.error("precios_publicos:", error.message);
    return [];
  }

  return data.map((r) => ({
    sitio: String(r.sitio),
    categoria: String(r.categoria),
    plan: String(r.plan),
    subidas: r.subidas == null ? null : Number(r.subidas),
    dias: Number(r.dias),
    etiqueta: String(r.etiqueta ?? ""),
    precio_venta: Number(r.precio_venta),
    orden: Number(r.orden ?? 0),
  })).filter((r) => Number.isFinite(r.precio_venta) && r.precio_venta > 0);
}

export function clavePrecioPublico(opts: {
  plan: string;
  dias: number;
  subidas?: number | null;
  categoria?: string;
}): string {
  const sub = opts.subidas == null ? "x" : String(opts.subidas);
  const cat = opts.categoria ?? "general";
  return `${cat}|${opts.plan}|${sub}|${opts.dias}`;
}

/** Mapa rápido sitio → clave → precio_venta */
export function mapaPreciosPorSitio(
  rows: PrecioPublico[],
  sitio: string
): Record<string, number> {
  const map: Record<string, number> = {};
  for (const r of rows) {
    if (r.sitio !== sitio) continue;
    map[
      clavePrecioPublico({
        plan: r.plan,
        dias: r.dias,
        subidas: r.subidas,
        categoria: r.categoria,
      })
    ] = r.precio_venta;
  }
  return map;
}

export function lookupPrecio(
  map: Record<string, number> | null | undefined,
  opts: { plan: string; dias: number; subidas?: number | null; categoria?: string }
): number | null {
  if (!map) return null;
  const v = map[clavePrecioPublico(opts)];
  return v != null && v > 0 ? v : null;
}

/**
 * Convierte filas públicas a forma AnuncioCosto mínima para el catálogo de promos.
 * Solo incluye precio_venta (costo 0); el público no ve márgenes.
 */
export function preciosPublicosComoCostos(rows: PrecioPublico[]): AnuncioCosto[] {
  return rows.map((r, i) => ({
    id: `pub-${r.sitio}-${r.plan}-${r.subidas ?? "x"}-${r.dias}-${i}`,
    sitio: r.sitio as SitioAdmin,
    categoria: r.categoria,
    plan: r.plan,
    subidas: r.subidas,
    dias: r.dias,
    etiqueta: r.etiqueta,
    valor_plataforma: null,
    creditos: null,
    costo_agencia: 0,
    precio_venta: r.precio_venta,
    ganancia: null,
    margen_pct: null,
    orden: r.orden,
    activo: true,
    updated_at: "",
  }));
}

/** Aplica precio_venta admin sobre las tablas Skokka del sitio. */
export function aplicarPreciosAdminSkokka(
  sitio: Sitio,
  rows: PrecioPublico[]
): Sitio {
  const skokka = rows.filter((r) => r.sitio === "skokka");
  if (!skokka.length) return sitio;

  const diurno: TablaPrecios = { ...sitio.diurno };
  const madrugada: TablaPrecios = { ...sitio.madrugada };

  for (const r of skokka) {
    if (r.subidas == null) continue;
    const nivel = SKOKKA_PLAN_A_NIVEL[r.plan];
    if (!nivel) continue;
    const key = `${r.subidas}-${r.dias}`;
    const esMadrugada = r.categoria === "madrugada";
    const tabla = esMadrugada ? madrugada : diurno;
    const fila = tabla[key];
    if (!fila) continue;
    tabla[key] = { ...fila, [nivel]: r.precio_venta };
  }

  return { ...sitio, diurno, madrugada };
}
