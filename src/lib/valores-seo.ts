export const VALORES_SITIOS = [
  "skokka",
  "chimbis",
  "locanto",
  "simpleescort",
  "escorcitas",
  "wenas",
  "gemidos",
] as const;

export type ValoresSitioSlug = (typeof VALORES_SITIOS)[number];

export function esValoresSitio(slug: string): slug is ValoresSitioSlug {
  return (VALORES_SITIOS as readonly string[]).includes(slug);
}

export function rutaValores(sitioSlug: string): string {
  return `/${sitioSlug}-valores`;
}

/** Texto introductorio por sitio en la página de valores. */
export const VALORES_INTRO: Record<ValoresSitioSlug, string> = {
  skokka:
    "En Skokka eliges el pack (subidas y días) y ves la imagen con todos los precios por horarios. De día marcas las franjas que quieras; la madrugada es un bloque aparte de 00:00 a 06:00.",
  chimbis:
    "En Chimbis el precio depende de la zona (Santiago/RM u otras ciudades), los días, cuántas subidas quieres y el plan. Toca cada zona para ver su tabla completa.",
  locanto:
    "En Locanto todos los avisos son por 7 días, visibles las 24 horas. Eliges TOP, Galería o ambos. Tu anuncio rota dentro de su categoría.",
  simpleescort:
    "En SimpleEscorts contratas Super Turbo 5X: defines los días y las franjas horarias. Cada franja incluye 5 subidas. Puedes marcar una, varias o las 4 (precio full).",
  escorcitas:
    "En Escorcitas eliges el tipo de escort, los días (1, 3 o 7) y el plan TOP, PREMIUM o GOLD. El precio es el mismo para mujer, trans o masculino.",
  wenas:
    "En Wenas el plan es VIP: eliges 7, 15 o 30 días y tu aviso queda destacado en wenas.cl durante ese período.",
  gemidos:
    "En Gemidos.tv eliges el plan (Classic, Gold, Platinum, Diamond, Diamond VIP o Black Rose) y la duración disponible. La verificación de perfil es obligatoria.",
};
