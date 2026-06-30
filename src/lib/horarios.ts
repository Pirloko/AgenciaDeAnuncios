export interface FranjaDiurna {
  corto: string;
  reloj: string;
  texto: string;
}

export const FRANJAS_DIURNAS: FranjaDiurna[] = [
  { corto: "06–09", reloj: "06:00 a 09:00 hrs", texto: "6 de la mañana a 9 de la mañana" },
  { corto: "09–12", reloj: "09:00 a 12:00 hrs", texto: "9 de la mañana a 12 del mediodía" },
  { corto: "12–15", reloj: "12:00 a 15:00 hrs", texto: "12 del día a 3 de la tarde" },
  { corto: "15–18", reloj: "15:00 a 18:00 hrs", texto: "3 de la tarde a 6 de la tarde" },
  { corto: "18–21", reloj: "18:00 a 21:00 hrs", texto: "6 de la tarde a 9 de la noche" },
  { corto: "21–00", reloj: "21:00 a 00:00 hrs", texto: "9 de la noche a 12 de la noche" },
];

const POR_CORTO = Object.fromEntries(FRANJAS_DIURNAS.map((f) => [f.corto, f]));

export function franjaDiurnaPorIndice(idx: number): FranjaDiurna {
  return FRANJAS_DIURNAS[idx] ?? { corto: String(idx), reloj: "", texto: "" };
}

export function franjaDiurnaPorEtiqueta(etiqueta: string): FranjaDiurna {
  return POR_CORTO[etiqueta] ?? { corto: etiqueta, reloj: etiqueta, texto: "" };
}

export function resumenHorarios(indices: number[]): string {
  return [...indices]
    .sort((a, b) => a - b)
    .map((i) => {
      const f = franjaDiurnaPorIndice(i);
      return `${f.reloj} (${f.texto})`;
    })
    .join("; ");
}
