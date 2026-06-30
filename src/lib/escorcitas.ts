import { clp } from "@/lib/precios";

export type EscorcitasTipo = "mujer" | "trans" | "masculino";
export type EscorcitasDias = 1 | 3 | 7;
export type EscorcitasPlan = "TOP" | "PREMIUM" | "GOLD";

export const ESCORCITAS_TIPO_LABEL: Record<EscorcitasTipo, string> = {
  mujer: "Escort mujer",
  trans: "Escort trans",
  masculino: "Escort masculino",
};

export const ESCORCITAS_PRECIOS: Record<EscorcitasDias, Record<EscorcitasPlan, number>> = {
  1: { TOP: 2500, PREMIUM: 3500, GOLD: 4500 },
  3: { TOP: 5000, PREMIUM: 6000, GOLD: 8500 },
  7: { TOP: 8000, PREMIUM: 11000, GOLD: 16000 },
};

export const ESCORCITAS_PLAN_INFO: Record<
  EscorcitasPlan,
  { nombre: string; beneficio: string; icon: string; detalle: string }
> = {
  TOP: {
    nombre: "TOP",
    beneficio: "Etiqueta verde «TOP». Rotás en la categoría TOP.",
    icon: "★",
    detalle: "1 foto de perfil · hasta 8 fotos en el anuncio.",
  },
  PREMIUM: {
    nombre: "PREMIUM",
    beneficio: "Anuncio destacado en azul. Rotás arriba de los TOP.",
    icon: "◆",
    detalle: "2 fotos de perfil · hasta 10 fotos · 1 video (opcional).",
  },
  GOLD: {
    nombre: "GOLD",
    beneficio: "El más visible. Rotás en la parte más alta del listado.",
    icon: "👑",
    detalle:
      "Anuncio más grande · 3 fotos de portada · hasta 12 fotos · videos (opcional) · clave de acceso · estados e historias.",
  },
};

const PLAN_ORDER: EscorcitasPlan[] = ["TOP", "PREMIUM", "GOLD"];
const DIAS_ORDER: EscorcitasDias[] = [1, 3, 7];

export function planesEscorcitas(dias: EscorcitasDias) {
  return PLAN_ORDER.map((plan) => ({
    plan,
    precio: ESCORCITAS_PRECIOS[dias][plan],
    ...ESCORCITAS_PLAN_INFO[plan],
  }));
}

export function precioEscorcitas(dias: EscorcitasDias, plan: EscorcitasPlan): number {
  return ESCORCITAS_PRECIOS[dias][plan];
}

export function iterarOfertasEscorcitas() {
  const ofertas: { dias: EscorcitasDias; plan: EscorcitasPlan; precio: number }[] = [];
  for (const dias of DIAS_ORDER) {
    for (const plan of PLAN_ORDER) {
      ofertas.push({ dias, plan, precio: ESCORCITAS_PRECIOS[dias][plan] });
    }
  }
  return ofertas;
}

export { clp };
