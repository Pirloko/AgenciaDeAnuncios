import {
  type AnuncioCosto,
  calcularGananciaLocal,
  calcularMargenLocal,
} from "@/lib/admin-costos";
import { precioChimbis, type ChimbisPlan } from "@/lib/chimbis";
import { precioLocanto, type LocantoPlan } from "@/lib/locanto";
import { planKey, tablaDe } from "@/lib/precios";
import type { Modalidad, Sitio } from "@/types/sitio";

/** Mapeo de planes admin → nivel Skokka en la web pública. */
const SKOKKA_PLAN_A_NIVEL: Record<string, string> = {
  TOP: "TOP",
  SUPERTOP: "SUPER TOP",
  "FULL DESTACADO": "TOP ALL IN ONE",
};

/** Mapeo de categoría admin → región Chimbis en la web pública. */
const CHIMBIS_CATEGORIA_A_REGION: Record<string, "santiago" | "ciudades"> = {
  santiago: "santiago",
  regiones: "ciudades",
};

export interface PrecioVentaWebContext {
  skokka: Sitio | null;
}

function precioSkokkaWeb(
  sitio: Sitio,
  categoria: string,
  plan: string,
  subidas: number,
  dias: number
): number | null {
  if (categoria === "especial") return null;
  const modalidad: Modalidad = categoria === "madrugada" ? "madrugada" : "diurno";
  const nivel = SKOKKA_PLAN_A_NIVEL[plan];
  if (!nivel) return null;

  const fila = tablaDe(sitio, modalidad)[planKey(subidas, dias)];
  const precio = fila?.[nivel];
  return typeof precio === "number" && precio > 0 ? precio : null;
}

/** Precio de venta visible en la web pública para una fila de costos admin. */
export function precioVentaWebDesdeCosto(
  costo: AnuncioCosto,
  ctx: PrecioVentaWebContext
): number | null {
  try {
    switch (costo.sitio) {
      case "skokka": {
        if (!ctx.skokka || costo.subidas == null) return null;
        return precioSkokkaWeb(
          ctx.skokka,
          costo.categoria,
          costo.plan,
          costo.subidas,
          costo.dias
        );
      }
      case "chimbis": {
        if (costo.subidas == null) return null;
        const region = CHIMBIS_CATEGORIA_A_REGION[costo.categoria];
        if (!region) return null;
        return precioChimbis(
          region,
          costo.dias,
          costo.subidas,
          costo.plan as ChimbisPlan
        );
      }
      case "locanto": {
        const precio = precioLocanto(costo.plan as LocantoPlan);
        return typeof precio === "number" && precio > 0 ? precio : null;
      }
      default:
        return null;
    }
  } catch {
    return null;
  }
}

/** Completa precio_venta desde la web pública solo si aún no hay valor en BD. */
export function aplicarPreciosVentaWeb(
  costos: AnuncioCosto[],
  ctx: PrecioVentaWebContext
): AnuncioCosto[] {
  return costos.map((c) => {
    if (c.precio_venta != null && c.precio_venta > 0) {
      return {
        ...c,
        ganancia: calcularGananciaLocal(c.costo_agencia, c.precio_venta),
        margen_pct: calcularMargenLocal(c.costo_agencia, c.precio_venta),
      };
    }
    const venta = precioVentaWebDesdeCosto(c, ctx);
    if (venta == null || venta <= 0) return c;
    return {
      ...c,
      precio_venta: venta,
      ganancia: calcularGananciaLocal(c.costo_agencia, venta),
      margen_pct: calcularMargenLocal(c.costo_agencia, venta),
    };
  });
}
