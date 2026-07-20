import type { AnuncioCosto } from "@/lib/admin-costos";
import {
  ESCORCITAS_PRECIOS,
  type EscorcitasDias,
  type EscorcitasPlan,
} from "@/lib/escorcitas";
import {
  SIMPLEESCORT_DIAS,
  SIMPLEESCORT_HORARIOS_TOTAL,
  calcularTotalSimpleEscort,
  type SimpleEscortDias,
} from "@/lib/simpleescort";

export type FilaCostoNueva = Omit<
  AnuncioCosto,
  "id" | "ganancia" | "margen_pct" | "updated_at" | "activo"
> & { activo?: boolean };

/** Filas iniciales SimpleEscort (precios web). */
export function filasSeedSimpleEscort(): FilaCostoNueva[] {
  const out: FilaCostoNueva[] = [];
  let orden = 200;

  for (const dias of SIMPLEESCORT_DIAS) {
    const d = dias as SimpleEscortDias;
    const full = calcularTotalSimpleEscort(d, SIMPLEESCORT_HORARIOS_TOTAL);
    out.push({
      sitio: "simpleescort",
      categoria: "general",
      plan: "SUPER_TURBO_FULL",
      subidas: 20,
      dias: d,
      etiqueta: `Super Turbo 5X · 4 horarios (full) · ${d}d`,
      valor_plataforma: null,
      creditos: null,
      costo_agencia: 0,
      precio_venta: full,
      orden: orden++,
    });
    for (const horarios of [1, 2, 3] as const) {
      const precio = calcularTotalSimpleEscort(d, horarios);
      if (precio >= full) continue;
      out.push({
        sitio: "simpleescort",
        categoria: "general",
        plan: `SUPER_TURBO_${horarios}H`,
        subidas: 5 * horarios,
        dias: d,
        etiqueta: `Super Turbo 5X · ${horarios} horario${horarios > 1 ? "s" : ""} · ${d}d`,
        valor_plataforma: null,
        creditos: null,
        costo_agencia: 0,
        precio_venta: precio,
        orden: orden++,
      });
    }
  }
  return out;
}

/** Filas iniciales Escorcitas (precios web). */
export function filasSeedEscorcitas(): FilaCostoNueva[] {
  const out: FilaCostoNueva[] = [];
  let orden = 300;
  const planes: EscorcitasPlan[] = ["TOP", "PREMIUM", "GOLD"];
  const diasList: EscorcitasDias[] = [1, 3, 7];

  for (const dias of diasList) {
    for (const plan of planes) {
      out.push({
        sitio: "escorcitas",
        categoria: "general",
        plan,
        subidas: null,
        dias,
        etiqueta: `${plan} · ${dias} día${dias > 1 ? "s" : ""}`,
        valor_plataforma: null,
        creditos: null,
        costo_agencia: 0,
        precio_venta: ESCORCITAS_PRECIOS[dias][plan],
        orden: orden++,
      });
    }
  }
  return out;
}

/** Solo VIP 7 / 15 / 30 — cualquier otra fila de Wenas se elimina. */
export const WENAS_DIAS_VIP = [7, 15, 30] as const;

export function esWenasVipCanonico(row: { sitio: string; plan: string; dias: number }): boolean {
  return (
    row.sitio === "wenas" &&
    row.plan === "VIP" &&
    (WENAS_DIAS_VIP as readonly number[]).includes(row.dias)
  );
}

export function filasSeedWenas(): FilaCostoNueva[] {
  const planes = [
    { plan: "VIP", dias: 7, costo: 26900, venta: 31900, orden: 400 },
    { plan: "VIP", dias: 15, costo: 49900, venta: 55900, orden: 401 },
    { plan: "VIP", dias: 30, costo: 89900, venta: 96900, orden: 402 },
  ];

  return planes.map((p) => ({
    sitio: "wenas" as const,
    categoria: "general",
    plan: p.plan,
    subidas: null,
    dias: p.dias,
    etiqueta: `VIP · ${p.dias} días`,
    valor_plataforma: null,
    creditos: null,
    costo_agencia: p.costo,
    precio_venta: p.venta,
    orden: p.orden,
  }));
}

export function filasSeedSitiosNuevos(): FilaCostoNueva[] {
  return [...filasSeedSimpleEscort(), ...filasSeedEscorcitas(), ...filasSeedWenas()];
}

/** Clave estable para saber si ya existe la fila en BD. */
export function claveCosto(row: {
  sitio: string;
  categoria: string;
  plan: string;
  subidas: number | null;
  dias: number;
}): string {
  return `${row.sitio}|${row.categoria}|${row.plan}|${row.subidas ?? "x"}|${row.dias}`;
}
