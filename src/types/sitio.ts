// Tipos del dominio. Una sola forma para todos los sitios.

export type Modalidad = "diurno" | "madrugada";

export type NivelId = string; // "TOP" | "SUPER TOP" | "TOP ALL IN ONE" | ...

export interface Nivel {
  id: NivelId;
  nombre: string;     // nombre amigable mostrado al usuario
  beneficio: string;  // explicación corta en lenguaje simple
}

// precios por nivel, ej: { "TOP": 6000, "SUPER TOP": 8000, ... }
export type PreciosPorNivel = Record<NivelId, number>;

// tabla de precios indexada por "subidas-dias", ej: "6-3" -> { TOP: 6000, ... }
// En diurno el valor es POR HORARIO. En madrugada es el valor TOTAL (plano).
export type TablaPrecios = Record<string, PreciosPorNivel>;

export interface Faq {
  q: string;
  a: string;
}

export interface Sitio {
  slug: string;
  nombre: string;
  dominio: string;
  desde?: number;
  slogan: string;
  color: string;       // color de marca (botones, acentos)
  accent: string;      // color secundario (selección de horarios)
  disponible: boolean;
  descripcion: string[];
  niveles: Nivel[];
  horarios: string[];  // franjas diurnas, ej: "06–09"
  diurno: TablaPrecios;
  madrugada: TablaPrecios;
  faq: Faq[];
}
