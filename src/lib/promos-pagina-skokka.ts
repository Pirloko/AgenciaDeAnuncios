import { FALLBACK } from "@/lib/sitios";
import { planKey } from "@/lib/precios";
import type { AnuncioCosto } from "@/lib/admin-costos";
import { SKOKKA_PLANES_WEB } from "@/lib/admin-costos";

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
