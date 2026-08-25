import { FALLBACK } from "@/lib/sitios";
import { planKey } from "@/lib/precios";
import { getSupabase } from "@/lib/supabase";
import type { AnuncioCosto } from "@/lib/admin-costos";
import { SKOKKA_PLANES_WEB } from "@/lib/admin-costos";
import type { NivelId, PreciosPorNivel, Sitio, TablaPrecios } from "@/types/sitio";

export type SkokkaPromoModalidad = "diurno" | "madrugada";
export type SkokkaPromoPlan = (typeof SKOKKA_PLANES_WEB)[number];
export type SkokkaPromoHorarios = 1 | 2 | 3 | 4 | 5 | 6;

export const SKOKKA_PROMO_PLANES: SkokkaPromoPlan[] = ["TOP", "SUPERTOP", "FULL DESTACADO"];

export const SKOKKA_PROMO_PLAN_LABEL: Record<SkokkaPromoPlan, string> = {
  TOP: "TOP",
  SUPERTOP: "SUPER TOP",
  "FULL DESTACADO": "TOP ALL IN ONE",
};

/** Nivel en la tabla pública Skokka. */
export const SKOKKA_PROMO_PLAN_A_NIVEL: Record<SkokkaPromoPlan, string> = {
  TOP: "TOP",
  SUPERTOP: "SUPER TOP",
  "FULL DESTACADO": "TOP ALL IN ONE",
};

export const SKOKKA_PROMO_HORARIOS: SkokkaPromoHorarios[] = [1, 2, 3, 4, 5, 6];

export const SKOKKA_PROMO_COMBOS: {
  modalidad: SkokkaPromoModalidad;
  subidas: number;
  dias: number;
}[] = [
  { modalidad: "diurno", subidas: 3, dias: 1 },
  { modalidad: "diurno", subidas: 6, dias: 1 },
  { modalidad: "diurno", subidas: 3, dias: 3 },
  { modalidad: "diurno", subidas: 6, dias: 3 },
  { modalidad: "diurno", subidas: 3, dias: 7 },
  { modalidad: "diurno", subidas: 6, dias: 7 },
  { modalidad: "madrugada", subidas: 6, dias: 1 },
  { modalidad: "madrugada", subidas: 6, dias: 3 },
  { modalidad: "madrugada", subidas: 6, dias: 7 },
];

export const ADMIN_CONFIG_KEY_PROMOS_SKOKKA = "promos_pagina_skokka";

/** Ventas promo independientes de costos / cotizador público. */
export type SkokkaPromosConfig = {
  version: 1;
  /** clave: modalidad|subidas|dias → plan → horarios → CLP */
  ventas: Record<string, Partial<Record<SkokkaPromoPlan, Partial<Record<string, number>>>>>;
};

export function claveComboSkokka(
  modalidad: SkokkaPromoModalidad,
  subidas: number,
  dias: number
): string {
  return `${modalidad}|${subidas}|${dias}`;
}

export function etiquetaComboSkokka(subidas: number, dias: number): string {
  return `${subidas} SUBIDAS ${dias} DIAS`;
}

export function etiquetaComboSkokkaCorta(subidas: number, dias: number): string {
  return `${subidas} subidas · ${dias} día${dias > 1 ? "s" : ""}`;
}

/** Precio unitario (1 horario diurno / bloque madrugada) desde fallback público. */
export function precioPaginaUnitarioSkokka(
  modalidad: SkokkaPromoModalidad,
  subidas: number,
  dias: number,
  plan: SkokkaPromoPlan
): number | null {
  const sitio = FALLBACK.skokka;
  if (!sitio) return null;
  const tabla = modalidad === "diurno" ? sitio.diurno : sitio.madrugada;
  const fila = tabla[planKey(subidas, dias)];
  const nivel = SKOKKA_PROMO_PLAN_A_NIVEL[plan];
  const p = fila?.[nivel];
  return typeof p === "number" && p > 0 ? p : null;
}

export function valorPaginaSkokka(
  modalidad: SkokkaPromoModalidad,
  subidas: number,
  dias: number,
  plan: SkokkaPromoPlan,
  horarios: number
): number | null {
  const u = precioPaginaUnitarioSkokka(modalidad, subidas, dias, plan);
  if (u == null) return null;
  if (modalidad === "madrugada") return u;
  return u * horarios;
}

/** Costo agencia de referencia (1 horario / bloque) desde filas de costos admin. */
export function costoUnitarioDesdeCostos(
  costos: AnuncioCosto[],
  modalidad: SkokkaPromoModalidad,
  subidas: number,
  dias: number,
  plan: SkokkaPromoPlan
): number | null {
  const row = costos.find(
    (c) =>
      c.sitio === "skokka" &&
      c.categoria === modalidad &&
      c.plan === plan &&
      c.subidas === subidas &&
      c.dias === dias
  );
  if (!row) return null;
  return row.costo_agencia;
}

export function costoSkokkaRef(
  costos: AnuncioCosto[],
  modalidad: SkokkaPromoModalidad,
  subidas: number,
  dias: number,
  plan: SkokkaPromoPlan,
  horarios: number
): number | null {
  const u = costoUnitarioDesdeCostos(costos, modalidad, subidas, dias, plan);
  if (u == null) return null;
  if (modalidad === "madrugada") return u;
  return Math.round(u * horarios);
}

export function ventaPromoSkokka(
  config: SkokkaPromosConfig | null,
  modalidad: SkokkaPromoModalidad,
  subidas: number,
  dias: number,
  plan: SkokkaPromoPlan,
  horarios: number
): number | null {
  const clave = claveComboSkokka(modalidad, subidas, dias);
  const stored = config?.ventas?.[clave]?.[plan]?.[String(horarios)];
  if (typeof stored === "number" && stored >= 0) return stored;
  return valorPaginaSkokka(modalidad, subidas, dias, plan, horarios);
}

export function setVentaPromo(
  config: SkokkaPromosConfig,
  modalidad: SkokkaPromoModalidad,
  subidas: number,
  dias: number,
  plan: SkokkaPromoPlan,
  horarios: number,
  venta: number
): SkokkaPromosConfig {
  const clave = claveComboSkokka(modalidad, subidas, dias);
  const ventas = { ...config.ventas };
  const combo = { ...(ventas[clave] ?? {}) };
  const planMap = { ...(combo[plan] ?? {}) };
  planMap[String(horarios)] = Math.round(venta);
  combo[plan] = planMap;
  ventas[clave] = combo;
  return { version: 1, ventas };
}

/** Seed inicial: venta = valor página (sin descuento). */
export function seedSkokkaPromosConfig(): SkokkaPromosConfig {
  const ventas: SkokkaPromosConfig["ventas"] = {};
  for (const c of SKOKKA_PROMO_COMBOS) {
    const clave = claveComboSkokka(c.modalidad, c.subidas, c.dias);
    const planes: Partial<Record<SkokkaPromoPlan, Partial<Record<string, number>>>> = {};
    for (const plan of SKOKKA_PROMO_PLANES) {
      const map: Partial<Record<string, number>> = {};
      const maxH = c.modalidad === "madrugada" ? 1 : 6;
      for (let h = 1; h <= maxH; h++) {
        const v = valorPaginaSkokka(c.modalidad, c.subidas, c.dias, plan, h);
        if (v != null) map[String(h)] = v;
      }
      planes[plan] = map;
    }
    ventas[clave] = planes;
  }
  return { version: 1, ventas };
}

export function normalizarSkokkaPromosConfig(raw: unknown): SkokkaPromosConfig {
  const base = seedSkokkaPromosConfig();
  if (!raw || typeof raw !== "object") return base;
  const obj = raw as { version?: number; ventas?: SkokkaPromosConfig["ventas"] };
  if (!obj.ventas || typeof obj.ventas !== "object") return base;
  return {
    version: 1,
    ventas: { ...base.ventas, ...obj.ventas },
  };
}

export function combosFiltrados(opts: {
  modalidad: SkokkaPromoModalidad | "all";
  dias: number | "all";
  subidas: number | "all";
}) {
  return SKOKKA_PROMO_COMBOS.filter((c) => {
    if (opts.modalidad !== "all" && c.modalidad !== opts.modalidad) return false;
    if (opts.dias !== "all" && c.dias !== opts.dias) return false;
    if (opts.subidas !== "all" && c.subidas !== opts.subidas) return false;
    return true;
  });
}

/** Nivel público (TOP / SUPER TOP / …) → plan admin de promos. */
export function planDesdeNivelPublico(nivelId: string): SkokkaPromoPlan | null {
  for (const plan of SKOKKA_PROMO_PLANES) {
    if (SKOKKA_PROMO_PLAN_A_NIVEL[plan] === nivelId) return plan;
  }
  return null;
}

/**
 * Lee la config de promos Skokka para el sitio público.
 * Requiere política RLS de lectura anónima sobre esa key (ver supabase/13-…).
 */
export async function cargarPromosSkokkaPublicas(): Promise<SkokkaPromosConfig> {
  const sb = getSupabase();
  if (!sb) return seedSkokkaPromosConfig();

  const { data, error } = await sb
    .from("admin_config")
    .select("value")
    .eq("key", ADMIN_CONFIG_KEY_PROMOS_SKOKKA)
    .maybeSingle();

  if (error) {
    console.error("promos_skokka public:", error.message);
    return seedSkokkaPromosConfig();
  }
  if (!data?.value) return seedSkokkaPromosConfig();
  return normalizarSkokkaPromosConfig(data.value);
}

/**
 * Reemplaza las tablas públicas de Skokka con los precios promo (1 horario / bloque).
 * Esas son las únicas filas que ve el cotizador y la tabla de valores.
 */
export function aplicarPromosSkokkaASitio(
  sitio: Sitio,
  config: SkokkaPromosConfig
): Sitio {
  const diurno: TablaPrecios = {};
  const madrugada: TablaPrecios = {};

  for (const c of SKOKKA_PROMO_COMBOS) {
    const key = planKey(c.subidas, c.dias);
    const precios: PreciosPorNivel = {} as PreciosPorNivel;
    for (const plan of SKOKKA_PROMO_PLANES) {
      const nivel = SKOKKA_PROMO_PLAN_A_NIVEL[plan] as NivelId;
      const p = ventaPromoSkokka(config, c.modalidad, c.subidas, c.dias, plan, 1);
      if (p != null) precios[nivel] = p;
    }
    if (Object.keys(precios).length === 0) continue;
    if (c.modalidad === "diurno") diurno[key] = precios;
    else madrugada[key] = precios;
  }

  return { ...sitio, diurno, madrugada };
}

/** Precio unitario (1 horario / bloque madrugada) desde promos. */
export function precioUnitarioPromoSkokka(
  config: SkokkaPromosConfig,
  modalidad: SkokkaPromoModalidad,
  subidas: number,
  dias: number,
  nivelId: string
): number | null {
  const plan = planDesdeNivelPublico(nivelId);
  if (!plan) return null;
  return ventaPromoSkokka(config, modalidad, subidas, dias, plan, 1);
}

/** Total exacto según N horarios (respeta descuentos por pack del admin). */
export function totalPromoSkokka(
  config: SkokkaPromosConfig,
  modalidad: SkokkaPromoModalidad,
  subidas: number,
  dias: number,
  nivelId: string,
  cantidadHorarios: number
): number | null {
  const plan = planDesdeNivelPublico(nivelId);
  if (!plan) return null;
  const h = modalidad === "madrugada" ? 1 : Math.max(1, cantidadHorarios);
  return ventaPromoSkokka(config, modalidad, subidas, dias, plan, h);
}

/**
 * Filas de Skokka para Armar promoción / catálogo público.
 * Usa precio de 1 horario (día) o bloque madrugada — mismos valores del panel de promos.
 */
export function costosSkokkaDesdePromos(config: SkokkaPromosConfig): AnuncioCosto[] {
  const out: AnuncioCosto[] = [];
  let orden = 0;
  for (const c of SKOKKA_PROMO_COMBOS) {
    for (const plan of SKOKKA_PROMO_PLANES) {
      const precio = ventaPromoSkokka(config, c.modalidad, c.subidas, c.dias, plan, 1);
      if (precio == null || precio <= 0) continue;
      const planLabel = SKOKKA_PROMO_PLAN_LABEL[plan];
      const modLabel = c.modalidad === "madrugada" ? "Madrugada" : "Diurno";
      out.push({
        id: `promo-skokka-${c.modalidad}-${plan}-${c.subidas}-${c.dias}`,
        sitio: "skokka",
        categoria: c.modalidad,
        plan,
        subidas: c.subidas,
        dias: c.dias,
        etiqueta: `${planLabel} · ${modLabel} · ${c.subidas} sub · ${c.dias}d`,
        valor_plataforma: null,
        creditos: null,
        costo_agencia: 0,
        precio_venta: precio,
        ganancia: null,
        margen_pct: null,
        orden: orden++,
        activo: true,
        updated_at: "",
      });
    }
  }
  return out;
}

/** Quita Skokka viejo del catálogo y pone los precios del panel Promociones Skokka. */
export function fusionarCostosConPromosSkokka(
  costos: AnuncioCosto[],
  config: SkokkaPromosConfig
): AnuncioCosto[] {
  return [...costos.filter((c) => c.sitio !== "skokka"), ...costosSkokkaDesdePromos(config)];
}
