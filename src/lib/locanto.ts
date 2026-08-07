import { clp } from "@/lib/precios";

export type LocantoPlan = "TOP" | "GALERIA" | "TOP_GALERIA";

export const LOCANTO_DIAS = 7;

export const LOCANTO_PRECIOS: Record<LocantoPlan, number> = {
  TOP: 17500,
  GALERIA: 16000,
  TOP_GALERIA: 30000,
};

export const LOCANTO_PLAN_INFO: Record<
  LocantoPlan,
  { nombre: string; beneficio: string; icon: string }
> = {
  TOP: {
    nombre: "TOP 7 días",
    beneficio: "Rotás en los primeros lugares de la categoría TOP.",
    icon: "★",
  },
  GALERIA: {
    nombre: "Galería 7 días",
    beneficio: "Rotás en los primeros lugares de la categoría Galería.",
    icon: "🖼",
  },
  TOP_GALERIA: {
    nombre: "TOP + Galería",
    beneficio: "Una sola publicación en ambas categorías (TOP y Galería).",
    icon: "★+",
  },
};

const PLAN_ORDER: LocantoPlan[] = ["TOP", "GALERIA", "TOP_GALERIA"];

export function planesLocanto(preciosAdmin?: Record<string, number> | null) {
  return PLAN_ORDER.map((plan) => ({
    plan,
    precio: precioLocantoEfectivo(plan, preciosAdmin),
    ...LOCANTO_PLAN_INFO[plan],
  }));
}

export function precioLocanto(plan: LocantoPlan): number {
  return LOCANTO_PRECIOS[plan];
}

export function precioLocantoEfectivo(
  plan: LocantoPlan,
  preciosAdmin?: Record<string, number> | null
): number {
  const admin = preciosAdmin?.[`general|${plan}|x|${LOCANTO_DIAS}`];
  if (admin != null && admin > 0) return admin;
  return precioLocanto(plan);
}

export function iterarOfertasLocanto() {
  return PLAN_ORDER.map((plan) => ({
    plan,
    precio: LOCANTO_PRECIOS[plan],
    nombre: LOCANTO_PLAN_INFO[plan].nombre,
  }));
}

export { clp };
