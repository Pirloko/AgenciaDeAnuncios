import type { EscorcitasPlan } from "@/lib/escorcitas";

export interface EscorcitasEjemplo {
  src: string;
  alt: string;
  label: string;
  width: number;
  height: number;
}

export const ESCORCITAS_EJEMPLOS: Record<EscorcitasPlan, EscorcitasEjemplo> = {
  TOP: {
    src: "/escorcitas/top-ejemplo.png",
    alt: "Ejemplo de anuncio TOP en Escorcitas",
    label: "TOP",
    width: 776,
    height: 1026,
  },
  PREMIUM: {
    src: "/escorcitas/premium-ejemplo.png",
    alt: "Ejemplo de anuncio PREMIUM en Escorcitas",
    label: "PREMIUM",
    width: 542,
    height: 1141,
  },
  GOLD: {
    src: "/escorcitas/gold-ejemplo.png",
    alt: "Ejemplo de anuncio GOLD en Escorcitas",
    label: "GOLD",
    width: 604,
    height: 1204,
  },
};

export function ejemploEscorcitas(plan: EscorcitasPlan): EscorcitasEjemplo {
  return ESCORCITAS_EJEMPLOS[plan];
}
