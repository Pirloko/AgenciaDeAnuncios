import type { Sitio, Modalidad, NivelId } from "@/types/sitio";

export const clp = (n: number) =>
  "$" + new Intl.NumberFormat("es-CL").format(n);

export const planLabel = (subidas: number, dias: number) =>
  `${subidas} subida${subidas > 1 ? "s" : ""} · ${dias} día${dias > 1 ? "s" : ""}`;

export const planKey = (subidas: number, dias: number) => `${subidas}-${dias}`;

export function tablaDe(sitio: Sitio, modalidad: Modalidad) {
  return modalidad === "diurno" ? sitio.diurno : sitio.madrugada;
}

export function precioUnitario(
  sitio: Sitio,
  modalidad: Modalidad,
  subidas: number,
  dias: number,
  nivel: NivelId
): number {
  return tablaDe(sitio, modalidad)[planKey(subidas, dias)][nivel];
}

// total = precio por horario × horarios (diurno)  |  precio plano (madrugada)
export function calcularTotal(
  sitio: Sitio,
  modalidad: Modalidad,
  subidas: number,
  dias: number,
  nivel: NivelId,
  cantidadHorarios: number
): number {
  const u = precioUnitario(sitio, modalidad, subidas, dias, nivel);
  return modalidad === "diurno" ? u * cantidadHorarios : u;
}
