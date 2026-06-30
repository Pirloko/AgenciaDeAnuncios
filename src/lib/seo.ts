// ============================================================
//  SEO — CONFIGURACIÓN CENTRAL
//  Este es EL lugar para editar palabras clave y textos de SEO.
// ============================================================

export const SITE_NAME = "Agencia de Publicaciones para Escort";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://tudominio.cl";

// Descripción general del sitio (home / fallback)
export const SITE_DESCRIPTION =
  "Agencia de Publicaciones para Escort. Desde 2015 en el rubro: creamos títulos y textos que venden, difuminamos rostro y cubrimos tatuajes. Cotiza tu aviso destacado al instante.";

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
  locanto: [
    "destacar aviso en locanto",
    "publicar en locanto chile",
    "anuncio destacado locanto",
    "precios locanto top galeria",
    "aviso top locanto 7 dias",
  ],
  simpleescort: [
    "super turbo simpleescorts",
    "super turbo 5x simpleescorts",
    "destacar aviso simpleescorts",
    "anuncio super turbo simpleescorts chile",
    "precios simpleescorts por horario",
    "subidas simpleescorts",
  ],
  escorcitas: [
    "publicar en escorcitas",
    "anuncio escort escorcitas chile",
    "precios escorcitas top premium gold",
    "publicacion escort mujer trans masculino",
    "avisos destacados escorcitas",
  ],
};

// Título/description por sitio (opcional; si no, se generan automáticamente)
export const SEO_OVERRIDES: Record<
  string,
  { title?: string; description?: string }
> = {
  skokka: {
    title: "Precios de avisos destacados en Skokka (TOP, Súper Top, All in One)",
    description:
      "Cotiza tu aviso destacado en Skokka al tiro: TOP, Súper Top y Top All in One por horario, subidas y días. Toca, define y te damos el precio.",
  },
  chimbis: {
    title: "Precios de avisos destacados en Chimbis (TOP, Destacado, Historias)",
    description:
      "Cotiza tu aviso destacado en Chimbis: Santiago/RM u otras ciudades. Planes TOP, Destacado e Historias por días y subidas. Fotos reales comprobables.",
  },
  locanto: {
    title: "Precios de avisos destacados en Locanto (TOP, Galería, 7 días)",
    description:
      "Cotiza tu aviso destacado en Locanto: TOP, Galería o ambos por 7 días. Visible 24 hrs, rotación dentro de cada categoría.",
  },
  simpleescort: {
    title: "Super Turbo en SimpleEscorts — precios por horario",
    description:
      "Cotiza Super Turbo en SimpleEscorts: foto 2,5× más grande, etiqueta y color distintivo. 5 subidas por horario. Hasta 20× más contactos según franjas y días.",
  },
  escorcitas: {
    title: "Precios de publicación en Escorcitas (TOP, PREMIUM, GOLD)",
    description:
      "Cotiza tu publicación en Escorcitas: escort mujer, trans o masculino. Planes TOP, PREMIUM y GOLD por 1, 3 o 7 días. Rotación dentro de cada categoría.",
  },
};

export function getKeywords(slug: string): string[] {
  return KEYWORDS[slug] ?? [];
}
