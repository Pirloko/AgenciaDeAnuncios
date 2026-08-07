import { clp } from "@/lib/precios";

export const SIMPLEESCORT_SUBIDAS = 5;
export const SIMPLEESCORT_HORARIOS_TOTAL = 4;

export interface FranjaSimpleEscort {
  id: string;
  reloj: string;
  texto: string;
}

export const FRANJAS_SIMPLEESCORT: FranjaSimpleEscort[] = [
  { id: "manana", reloj: "06:00 a 12:00 hrs", texto: "Mañana · 6 de la mañana a 12 del mediodía" },
  { id: "tarde", reloj: "12:00 a 18:00 hrs", texto: "Tarde · 12 del mediodía a 6 de la tarde" },
  { id: "noche", reloj: "18:00 a 00:00 hrs", texto: "Noche · 6 de la tarde a 12 de la noche" },
  { id: "madrugada", reloj: "00:00 a 06:00 hrs", texto: "Madrugada · 12 de la noche a 6 de la mañana" },
];

export const SIMPLEESCORT_DIAS = [1, 3, 5, 7] as const;
export type SimpleEscortDias = (typeof SIMPLEESCORT_DIAS)[number];

/** Precio plano con los 4 horarios (20 subidas diarias: 5 por franja). */
const PRECIOS_FULL: Record<SimpleEscortDias, number> = {
  1: 7000,
  3: 12000,
  5: 18000,
  7: 22000,
};

/** Precio por cada horario elegido (5 subidas en esa franja). */
const PRECIOS_POR_HORARIO: Record<SimpleEscortDias, number> = {
  1: 3500,
  3: 5500,
  5: 6500,
  7: 8000,
};

export function franjaSimpleEscortPorIndice(idx: number): FranjaSimpleEscort {
  return FRANJAS_SIMPLEESCORT[idx] ?? { id: String(idx), reloj: "", texto: "" };
}

export function resumenHorariosSimpleEscort(indices: number[]): string {
  return [...indices]
    .sort((a, b) => a - b)
    .map((i) => {
      const f = franjaSimpleEscortPorIndice(i);
      return `${f.reloj} (${f.texto})`;
    })
    .join("; ");
}

export function calcularTotalSimpleEscort(dias: SimpleEscortDias, cantidadHorarios: number): number {
  if (cantidadHorarios >= SIMPLEESCORT_HORARIOS_TOTAL) {
    return PRECIOS_FULL[dias];
  }
  return PRECIOS_POR_HORARIO[dias] * cantidadHorarios;
}

export function calcularTotalSimpleEscortEfectivo(
  dias: SimpleEscortDias,
  cantidadHorarios: number,
  preciosAdmin?: Record<string, number> | null
): number {
  if (cantidadHorarios >= SIMPLEESCORT_HORARIOS_TOTAL) {
    const admin = preciosAdmin?.[`general|SUPER_TURBO_FULL|20|${dias}`];
    if (admin != null && admin > 0) return admin;
    return PRECIOS_FULL[dias];
  }
  const plan = `SUPER_TURBO_${cantidadHorarios}H`;
  const subidas = 5 * cantidadHorarios;
  const admin = preciosAdmin?.[`general|${plan}|${subidas}|${dias}`];
  if (admin != null && admin > 0) return admin;
  return PRECIOS_POR_HORARIO[dias] * cantidadHorarios;
}

export function iterarOfertasSimpleEscort() {
  const out: { dias: SimpleEscortDias; tipo: string; precio: number }[] = [];
  for (const dias of SIMPLEESCORT_DIAS) {
    out.push({
      dias,
      tipo: "Super Turbo 5X · 4 horarios (full)",
      precio: PRECIOS_FULL[dias],
    });
    out.push({
      dias,
      tipo: "Super Turbo 5X · por horario",
      precio: PRECIOS_POR_HORARIO[dias],
    });
  }
  return out;
}

export { clp };
