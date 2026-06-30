import type { LocantoPlan } from "@/lib/locanto";

export interface LocantoEjemplo {
  src: string;
  alt: string;
  label: string;
  width: number;
  height: number;
}

const TOP_EJEMPLO: LocantoEjemplo = {
  src: "/locanto/top-ejemplo.png",
  alt: "Ejemplo de aviso TOP en Locanto",
  label: "TOP",
  width: 898,
  height: 930,
};

const GALERIA_EJEMPLO: LocantoEjemplo = {
  src: "/locanto/galeria-ejemplo.png",
  alt: "Ejemplo de aviso Galería en Locanto",
  label: "Galería",
  width: 997,
  height: 883,
};

export const LOCANTO_EJEMPLOS: Record<LocantoPlan, LocantoEjemplo[]> = {
  TOP: [TOP_EJEMPLO],
  GALERIA: [GALERIA_EJEMPLO],
  TOP_GALERIA: [TOP_EJEMPLO, GALERIA_EJEMPLO],
};

export function ejemplosLocanto(plan: LocantoPlan): LocantoEjemplo[] {
  return LOCANTO_EJEMPLOS[plan] ?? [];
}
