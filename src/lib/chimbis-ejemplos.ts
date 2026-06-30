import type { ChimbisPlan } from "@/lib/chimbis";

export interface ChimbisEjemplo {
  src: string;
  alt: string;
  label: string;
  width: number;
  height: number;
}

export const CHIMBIS_EJEMPLOS: Record<ChimbisPlan, ChimbisEjemplo> = {
  TOP: {
    src: "/chimbis/top-ejemplo.png",
    alt: "Ejemplo de aviso TOP en Chimbis",
    label: "TOP",
    width: 1014,
    height: 602,
  },
  TOP_DESTACADO: {
    src: "/chimbis/top-destacado-ejemplo.png",
    alt: "Ejemplo de aviso TOP + Destacado en Chimbis",
    label: "TOP + Destacado",
    width: 1010,
    height: 615,
  },
  TOP_HISTORIAS: {
    src: "/chimbis/top-historias-ejemplo.png",
    alt: "Ejemplo de aviso TOP + Historias en Chimbis",
    label: "TOP + Historias",
    width: 1050,
    height: 609,
  },
  TOP_DESTACADO_HISTORIA: {
    src: "/chimbis/top-destacado-historias-ejemplo.png",
    alt: "Ejemplo de aviso TOP + Destacado + Historia en Chimbis",
    label: "TOP + Destacado + Historia",
    width: 1052,
    height: 604,
  },
};

export function ejemploChimbis(plan: ChimbisPlan): ChimbisEjemplo {
  return CHIMBIS_EJEMPLOS[plan];
}
