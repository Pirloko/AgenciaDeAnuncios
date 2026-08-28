// ============================================================
//  SEO — CONFIGURACIÓN CENTRAL
//  Dominio: https://publicacionesescort.cl
// ============================================================

export const SITE_NAME = "Publicaciones Escort Chile";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://publicacionesescort.cl";

export const SITE_DESCRIPTION =
  "Publicaciones escort y anuncios escort en Chile. Agencia desde 2015: cotiza avisos destacados en Skokka, Locanto, Chimbis, Escorcitas, SimpleEscorts, Wenas y Gemidos. Textos que venden, difuminado de rostro y packs por presupuesto.";

export const SITE_LOGO = `${SITE_URL}/logo-agencia.png`;

/** Keywords globales (home + base). La meta keywords es secundaria; el contenido manda. */
export const SITE_KEYWORDS: string[] = [
  "publicaciones escort",
  "publiescort",
  "anuncios escort",
  "escort chile",
  "publicaciones escort chile",
  "anuncios escort chile",
  "agencia publicaciones escort",
  "avisos destacados escort chile",
  "cotizar aviso escort",
  "publicar escort chile",
  "skokka",
  "locanto",
  "chimbis",
  "escorcitas",
  "simpleescort",
  "wenas",
  "gemidos",
  // Búsquedas relacionadas (no ofrecemos arriendo de piezas; solo publicaciones)
  "habitaciones para escort",
  "piezas para escort",
  "alcoba",
  "alcoba.cl",
  "comunidad escort",
  "comunidadescort.cl",
];

export const KEYWORDS: Record<string, string[]> = {
  skokka: [
    "skokka chile",
    "publicar en skokka",
    "precios skokka chile",
    "anuncio destacado skokka",
    "escort anuncios skokka",
    "top super top skokka",
    "publicaciones escort skokka",
  ],
  chimbis: [
    "chimbis chile",
    "publicar en chimbis",
    "precios chimbis chile",
    "anuncio destacado chimbis",
    "escort anuncios chimbis",
    "publicaciones escort chimbis",
  ],
  locanto: [
    "locanto chile",
    "publicar en locanto",
    "precios locanto chile",
    "anuncio destacado locanto",
    "escort anuncios locanto",
    "publicaciones escort locanto",
  ],
  simpleescort: [
    "simpleescort",
    "simpleescorts chile",
    "super turbo simpleescorts",
    "publicar en simpleescorts",
    "precios simpleescorts chile",
    "publicaciones escort simpleescorts",
  ],
  escorcitas: [
    "escorcitas chile",
    "publicar en escorcitas",
    "precios escorcitas chile",
    "anuncios escort escorcitas",
    "publicaciones escort escorcitas",
  ],
  wenas: [
    "wenas chile",
    "wenas.cl",
    "publicar en wenas",
    "precios wenas vip",
    "anuncios escort wenas",
  ],
  gemidos: [
    "gemidos chile",
    "gemidos.tv",
    "publicar en gemidos",
    "precios gemidos.tv",
    "anuncios escort gemidos",
  ],
};

export const SEO_OVERRIDES: Record<
  string,
  { title?: string; description?: string }
> = {
  skokka: {
    title: "Skokka Chile: precios de avisos destacados (TOP, Súper Top, All in One)",
    description:
      "Cotiza publicaciones escort en Skokka Chile: TOP, Súper Top y Top All in One por horarios, subidas y días. Precio al instante y packs con madrugada.",
  },
  chimbis: {
    title: "Chimbis Chile: precios de avisos destacados (TOP, Destacado, Historias)",
    description:
      "Cotiza anuncios escort en Chimbis Chile: Santiago/RM o regiones. Planes TOP, Destacado e Historias por días y subidas.",
  },
  locanto: {
    title: "Locanto Chile: precios TOP y Galería (7 días)",
    description:
      "Cotiza anuncios escort en Locanto Chile: TOP, Galería o ambos por 7 días, visibles 24 hrs.",
  },
  simpleescort: {
    title: "SimpleEscorts Chile: Super Turbo 5X — precios por horario",
    description:
      "Cotiza Super Turbo en SimpleEscorts Chile: foto más grande, etiqueta y 5 subidas por horario. Precio al instante.",
  },
  escorcitas: {
    title: "Escorcitas Chile: precios TOP, PREMIUM y GOLD",
    description:
      "Cotiza publicaciones escort en Escorcitas Chile: TOP, PREMIUM y GOLD por 1, 3 o 7 días.",
  },
  wenas: {
    title: "Wenas Chile: precios VIP (7, 15 y 30 días)",
    description:
      "Cotiza tu aviso VIP en Wenas Chile (wenas.cl): 7, 15 o 30 días con precio al instante.",
  },
  gemidos: {
    title: "Gemidos.tv Chile: precios Classic, Gold, Platinum y más",
    description:
      "Cotiza publicaciones en Gemidos.tv Chile: Classic, Gold, Platinum, Diamond, Diamond VIP y Black Rose.",
  },
};

/** Landings SEO indexables (además de cotizadores / guías / valores). */
export const SEO_LANDINGS = [
  {
    path: "/publicaciones-escort-chile",
    title: "Publicaciones escort Chile | Publiescort y avisos destacados",
    description:
      "Publicaciones escort y publiescort en todo Chile. Cotiza anuncios escort en Skokka, Locanto, Chimbis, Escorcitas, SimpleEscorts, Wenas y Gemidos. Agencia desde 2015.",
    priority: 0.98,
  },
  {
    path: "/anuncios-escort-chile",
    title: "Anuncios escort Chile | Cotiza y publica en las mejores páginas",
    description:
      "Anuncios escort en Chile con precio al instante. Publicamos y destacamos tu aviso en Skokka, Locanto, Chimbis y más. Textos que venden y packs por presupuesto.",
    priority: 0.97,
  },
  {
    path: "/donde-publicar-escort-chile",
    title: "Dónde publicar escort en Chile | Skokka, Locanto, Chimbis y más",
    description:
      "Guía para elegir dónde publicar escort en Chile: Skokka, Locanto, Chimbis, Escorcitas, SimpleEscorts, Wenas, Gemidos y el panorama del mercado (Alcoba, Comunidad Escort).",
    priority: 0.96,
  },
] as const;

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

/** JSON-LD Organization / Service para Chile. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    alternateName: ["Publicaciones Escort", "Publiescort Chile", "Agencia de Publicaciones para Escort"],
    url: SITE_URL,
    logo: SITE_LOGO,
    image: SITE_LOGO,
    description: SITE_DESCRIPTION,
    areaServed: { "@type": "Country", name: "Chile" },
    knowsAbout: [
      "publicaciones escort",
      "anuncios escort",
      "Skokka",
      "Locanto",
      "Chimbis",
      "Escorcitas",
      "SimpleEscorts",
      "Wenas",
      "Gemidos",
    ],
  };
}
