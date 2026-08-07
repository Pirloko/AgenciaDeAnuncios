import { clp } from "@/lib/precios";

/** Plan único en Wenas (web pública). */
export type WenasPlan = "VIP";
export type WenasDias = 7 | 15 | 30;

/** Precio de venta web (CLP) por duración VIP. */
export const WENAS_PRECIOS: Record<WenasDias, number> = {
  7: 31900,
  15: 55900,
  30: 96900,
};

/** Costo agencia (CLP) — usado en seed admin. */
export const WENAS_COSTOS: Record<WenasDias, number> = {
  7: 26900,
  15: 49900,
  30: 89900,
};

export const WENAS_DIAS_ORDER: WenasDias[] = [7, 15, 30];

export const WENAS_PLAN_INFO = {
  VIP: {
    nombre: "VIP",
    beneficio: "Anuncio VIP destacado en wenas.cl durante el período contratado.",
    detalle: "Publicación VIP visible en el listado de Wenas por la cantidad de días elegida.",
  },
} as const;

export function precioWenas(dias: WenasDias): number {
  return WENAS_PRECIOS[dias];
}

/** Precio efectivo: admin gana sobre el fallback local. */
export function precioWenasEfectivo(
  dias: WenasDias,
  preciosAdmin?: Record<string, number> | null
): number {
  const admin = preciosAdmin?.[`general|VIP|x|${dias}`];
  if (admin != null && admin > 0) return admin;
  return precioWenas(dias);
}

export function planesWenas(preciosAdmin?: Record<string, number> | null) {
  return WENAS_DIAS_ORDER.map((dias) => ({
    dias,
    plan: "VIP" as const,
    precio: precioWenasEfectivo(dias, preciosAdmin),
    ...WENAS_PLAN_INFO.VIP,
  }));
}

export function iterarOfertasWenas() {
  return WENAS_DIAS_ORDER.map((dias) => ({
    dias,
    plan: "VIP" as const,
    precio: WENAS_PRECIOS[dias],
  }));
}

export { clp };
