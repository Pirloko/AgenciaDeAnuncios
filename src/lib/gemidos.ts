import { clp } from "@/lib/precios";

export type GemidosPlan =
  | "CLASSIC"
  | "GOLD"
  | "PLATINUM"
  | "DIAMOND"
  | "DIAMOND_VIP"
  | "BLACK_ROSE";

export type GemidosDias = 3 | 7 | 30;

export interface GemidosOferta {
  plan: GemidosPlan;
  dias: GemidosDias;
  precio: number;
}

export const GEMIDOS_PLAN_INFO: Record<
  GemidosPlan,
  { nombre: string; beneficio: string }
> = {
  CLASSIC: {
    nombre: "Classic",
    beneficio: "Publicación estándar en Gemidos.tv.",
  },
  GOLD: {
    nombre: "Gold",
    beneficio: "Mayor visibilidad que Classic.",
  },
  PLATINUM: {
    nombre: "Platinum",
    beneficio: "Posicionamiento alto en el listado.",
  },
  DIAMOND: {
    nombre: "Diamond",
    beneficio: "Alta prioridad y presencia destacada.",
  },
  DIAMOND_VIP: {
    nombre: "Diamond VIP",
    beneficio: "El plan Diamond más exclusivo.",
  },
  BLACK_ROSE: {
    nombre: "Black Rose",
    beneficio: "Plan premium de máxima exposición (3 o 7 días).",
  },
};

/** Precios oficiales (CLP) según informacionGemidos.md */
export const GEMIDOS_OFERTAS: GemidosOferta[] = [
  { plan: "CLASSIC", dias: 30, precio: 45000 },
  { plan: "GOLD", dias: 7, precio: 25000 },
  { plan: "GOLD", dias: 30, precio: 61000 },
  { plan: "PLATINUM", dias: 7, precio: 38000 },
  { plan: "PLATINUM", dias: 30, precio: 82000 },
  { plan: "DIAMOND", dias: 7, precio: 56000 },
  { plan: "DIAMOND", dias: 30, precio: 121000 },
  { plan: "DIAMOND_VIP", dias: 7, precio: 120000 },
  { plan: "DIAMOND_VIP", dias: 30, precio: 205000 },
  { plan: "BLACK_ROSE", dias: 3, precio: 220000 },
  { plan: "BLACK_ROSE", dias: 7, precio: 330000 },
];

export const GEMIDOS_PLAN_ORDER: GemidosPlan[] = [
  "CLASSIC",
  "GOLD",
  "PLATINUM",
  "DIAMOND",
  "DIAMOND_VIP",
  "BLACK_ROSE",
];

/** Días en la tabla de valores. 3 días solo aplica a Black Rose. */
export const GEMIDOS_DIAS_TABLA: GemidosDias[] = [3, 7, 30];

export function precioGemidos(plan: GemidosPlan, dias: GemidosDias): number | null {
  return GEMIDOS_OFERTAS.find((o) => o.plan === plan && o.dias === dias)?.precio ?? null;
}

/** Precio efectivo: admin (mapa) gana sobre el fallback local. */
export function precioGemidosEfectivo(
  plan: GemidosPlan,
  dias: GemidosDias,
  preciosAdmin?: Record<string, number> | null
): number | null {
  const admin = preciosAdmin?.[`general|${plan}|x|${dias}`];
  if (admin != null && admin > 0) return admin;
  return precioGemidos(plan, dias);
}

export function ofertasGemidosEfectivas(
  preciosAdmin?: Record<string, number> | null
): GemidosOferta[] {
  return GEMIDOS_OFERTAS.map((o) => ({
    ...o,
    precio: precioGemidosEfectivo(o.plan, o.dias, preciosAdmin) ?? o.precio,
  }));
}

export function ofertasGemidosPorPlan(
  plan: GemidosPlan,
  preciosAdmin?: Record<string, number> | null
): GemidosOferta[] {
  return ofertasGemidosEfectivas(preciosAdmin).filter((o) => o.plan === plan);
}

export function iterarOfertasGemidos() {
  return GEMIDOS_OFERTAS.map((o) => ({
    ...o,
    nombre: GEMIDOS_PLAN_INFO[o.plan].nombre,
  }));
}

export const GEMIDOS_VERIFICACION = [
  "Foto de tu documento (DNI o cédula): frente y dorso.",
  "Foto tuya con el rostro descubierto, tocándote el cuello con un dedo.",
  'Video real diciendo: “Hola, me quiero publicar en Gemidos”, mostrando tu cara, tu cuerpo completo al natural, mencionando la fecha y hora del día, y dejando ver tus tatuajes (si los tienes).',
];

export const GEMIDOS_PAUSA = [
  "Duración máxima de 10 días.",
  "Pasado ese plazo, el aviso se activa automáticamente.",
  "No se descuentan días mientras está en pausa.",
  "Aviso semanal: 1 pausa disponible.",
  "Aviso mensual: 2 pausas disponibles.",
];

export const GEMIDOS_VACACIONES = [
  "Puedes activarlo por el tiempo que desees.",
  "Sí se descuentan los días mientras está activo.",
  "Tu perfil sigue visible y mantiene posicionamiento, lugar e imagen en la página.",
];

export { clp };
