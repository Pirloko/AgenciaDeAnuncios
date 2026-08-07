// ============================================================
//  SEO — CONFIGURACIÓN CENTRAL
//  Este es EL lugar para editar palabras clave y textos de SEO.
// ============================================================

export const SITE_NAME = "Agencia de Publicaciones para Escort";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://tudominio.cl";

// Descripción general del sitio (home / fallback)
export const SITE_DESCRIPTION =
  "Agencia de publicaciones para escort en Chile. Escort anuncios y anuncios escort en Skokka, Chimbis, Locanto, SimpleEscorts, Escorcitas y Wenas. Desde 2015: títulos que venden, difuminado de rostro y cobertura de tatuajes. Cotiza tu aviso destacado al instante.";

// ============================================================
//  PALABRAS CLAVE GLOBALES  ←  EDITÁ ACÁ
//  Se usan en home, layout y como base en todas las páginas.
// ============================================================
export const SITE_KEYWORDS: string[] = [
  "escort anuncios",
  "anuncios escort",
  "scort anuncios",
  "publicaciones para escort",
  "publicaciones escort",
  "habitaciones para escort",
  "piezas para escort",
  "habitaciones escort",
  "sexosur",
  "avisos destacados escort chile",
  "agencia publicaciones escort",
  "cotizar aviso escort",
];

// ============================================================
//  PALABRAS CLAVE POR SITIO  ←  EDITÁ ACÁ
//  Se suman a SITE_KEYWORDS en cotizador, guías y valores.
// ============================================================
export const KEYWORDS: Record<string, string[]> = {
  skokka: [
    "skokka",
    "destacar aviso en skokka",
    "publicar en skokka chile",
    "anuncio destacado skokka",
    "escort anuncios skokka",
    "precios skokka top super top",
    "subir aviso skokka primeros lugares",
    "publicaciones escort skokka",
  ],
  chimbis: [
    "chimbis",
    "destacar aviso en chimbis",
    "publicar en chimbis chile",
    "anuncio destacado chimbis",
    "escort anuncios chimbis",
    "precios chimbis top destacado historias",
    "subir aviso chimbis primeros lugares",
    "publicaciones para escort chimbis",
  ],
  locanto: [
    "locanto",
    "destacar aviso en locanto",
    "publicar en locanto chile",
    "anuncio destacado locanto",
    "escort anuncios locanto",
    "precios locanto top galeria",
    "aviso top locanto 7 dias",
    "publicaciones escort locanto",
  ],
  simpleescort: [
    "simpleescorts",
    "simple escorts",
    "super turbo simpleescorts",
    "super turbo 5x simpleescorts",
    "destacar aviso simpleescorts",
    "anuncio super turbo simpleescorts chile",
    "escort anuncios simpleescorts",
    "precios simpleescorts por horario",
    "publicaciones para escort simpleescorts",
  ],
  escorcitas: [
    "escorcitas",
    "publicar en escorcitas",
    "anuncio escort escorcitas chile",
    "escort anuncios escorcitas",
    "precios escorcitas top premium gold",
    "publicacion escort mujer trans masculino",
    "avisos destacados escorcitas",
    "publicaciones escort escorcitas",
  ],
  wenas: [
    "wenas.cl",
    "wenas escort",
    "publicar en wenas chile",
    "anuncios escort wenas",
    "publicaciones para escort wenas",
    "precios wenas vip",
    "aviso vip wenas",
  ],
  gemidos: [
    "gemidos.tv",
    "gemidos escort",
    "publicar en gemidos chile",
    "anuncios escort gemidos",
    "precios gemidos classic gold platinum",
    "diamond vip gemidos",
    "black rose gemidos",
    "verificacion perfil gemidos",
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
      "Cotiza tu aviso destacado en Skokka al tiro: escort anuncios con TOP, Súper Top y Top All in One por horario, subidas y días. Publicaciones para escort con precio al instante.",
  },
  chimbis: {
    title: "Precios de avisos destacados en Chimbis (TOP, Destacado, Historias)",
    description:
      "Cotiza tu anuncio escort en Chimbis: Santiago/RM u otras ciudades. Planes TOP, Destacado e Historias por días y subidas. Publicaciones escort con fotos reales comprobables.",
  },
  locanto: {
    title: "Precios de avisos destacados en Locanto (TOP, Galería, 7 días)",
    description:
      "Cotiza tu aviso destacado en Locanto: TOP, Galería o ambos por 7 días. Anuncios escort visibles 24 hrs, rotación dentro de cada categoría.",
  },
  simpleescort: {
    title: "Super Turbo en SimpleEscorts — precios por horario",
    description:
      "Cotiza Super Turbo en SimpleEscorts: publicaciones para escort con foto 2,5× más grande, etiqueta y color distintivo. 5 subidas por horario.",
  },
  escorcitas: {
    title: "Precios de publicación en Escorcitas (TOP, PREMIUM, GOLD)",
    description:
      "Cotiza tu publicación escort en Escorcitas: mujer, trans o masculino. Planes TOP, PREMIUM y GOLD por 1, 3 o 7 días. Anuncios escort con rotación por categoría.",
  },
  wenas: {
    title: "Precios VIP en Wenas (7, 15 y 30 días)",
    description:
      "Cotiza tu publicación VIP en Wenas: 7, 15 o 30 días en wenas.cl. Anuncios escort destacados con precio al instante.",
  },
  gemidos: {
    title: "Precios en Gemidos.tv (Classic, Gold, Platinum, Diamond)",
    description:
      "Cotiza tu publicación en Gemidos.tv: Classic, Gold, Platinum, Diamond, Diamond VIP y Black Rose. Precios por días al instante.",
  },
};

function dedupeKeywords(lista: string[]): string[] {
  const visto = new Set<string>();
  const out: string[] = [];
  for (const k of lista) {
    const norm = k.trim().toLowerCase();
    if (!norm || visto.has(norm)) continue;
    visto.add(norm);
    out.push(k.trim());
  }
  return out;
}

/** Palabras clave para meta tags. Sin slug = globales (home). Con slug = globales + sitio. */
export function getKeywords(slug?: string): string[] {
  if (!slug) return SITE_KEYWORDS;
  return dedupeKeywords([...SITE_KEYWORDS, ...(KEYWORDS[slug] ?? [])]);
}
