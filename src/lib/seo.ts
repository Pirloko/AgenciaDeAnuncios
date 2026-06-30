// ============================================================
//  SEO — CONFIGURACIÓN CENTRAL
//  Este es EL lugar para editar palabras clave y textos de SEO.
// ============================================================

export const SITE_NAME = "Destacados"; // 👈 cambiá por el nombre de tu agencia
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://tudominio.cl";

// Descripción general del sitio (home / fallback)
export const SITE_DESCRIPTION =
  "Cotiza y contrata avisos destacados en los principales sitios de clasificados de Chile. Precios claros por horario, subidas y días.";

// ============================================================
//  PALABRAS CLAVE POR SITIO  ←  EDITÁ ACÁ
//  Agregá/quita las que vos quieras posicionar en Google.
//  Se usan en <meta keywords>, en el título y en el contenido SEO.
// ============================================================
export const KEYWORDS: Record<string, string[]> = {
  skokka: [
    "destacar aviso en skokka",
    "publicar en skokka chile",
    "anuncio destacado skokka",
    "precios skokka top super top",
    "subir aviso skokka primeros lugares",
    // 👇 agregá tus palabras clave acá
  ],
  chimbis: [
    "destacar aviso en chimbis",
    "publicar en chimbis chile",
    "anuncio destacado chimbis",
    "precios chimbis top super top",
    "subir aviso chimbis primeros lugares",
  ],
  // locanto: [...],
  // simpleescort: [...],
};

// Título/description por sitio (opcional; si no, se generan automáticamente)
export const SEO_OVERRIDES: Record<
  string,
  { title?: string; description?: string }
> = {
  skokka: {
    title: "Precios de avisos destacados en Skokka (TOP, Súper Top, All in One)",
    description:
      "Cotiza tu aviso destacado en Skokka en segundos: TOP, Súper Top y Top All in One por horario, subidas y días. Valores actualizados, fácil y rápido.",
  },
  chimbis: {
    title: "Precios de avisos destacados en Chimbis (TOP, Destacado, Historias)",
    description:
      "Cotiza tu aviso destacado en Chimbis: Santiago/RM u otras ciudades. Planes TOP, Destacado e Historias por días y subidas. Fotos reales comprobables.",
  },
};

export function getKeywords(slug: string): string[] {
  return KEYWORDS[slug] ?? [];
}
