// ============================================================
//  SEO — CONFIGURACIÓN CENTRAL
//  Dominio: https://publicacionesescort.cl
// ============================================================

export const SITE_NAME = "Publicaciones Escort Chile";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://publicacionesescort.cl";

export const SITE_DESCRIPTION =
  "Publicidad escort y publicaciones escort en Chile. Agencia desde 2015: cotiza avisos destacados en Skokka, Locanto, Chimbis, Escorcitas, SimpleEscorts, Wenas y Gemidos. Sur, centro y regiones.";

export const SITE_LOGO = `${SITE_URL}/logo-agencia.png`;

/** Keywords globales (home + base). La meta keywords es secundaria; el contenido manda. */
export const SITE_KEYWORDS: string[] = [
  "publicidad escort",
  "publicidad para escort",
  "agencia publicidad escort chile",
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
  "publicar escort puerto montt",
  "publicar escort concepcion",
  "publicar escort temuco",
  "publicidad escort sur chile",
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
    title: "Publicar en Skokka Chile — cotiza avisos destacados | Agencia desde 2015",
    description:
      "Publicidad escort en Skokka Chile. Cotiza TOP, Súper Top y All in One por horarios, subidas y días. Precio al instante. Publicamos en todo Chile.",
  },
  chimbis: {
    title: "Publicar en Chimbis Chile — cotiza TOP y Destacado | Santiago y regiones",
    description:
      "Publicidad para escort en Chimbis Chile. Cotiza anuncios en Santiago/RM o regiones: TOP, Destacado e Historias. Agencia de publicaciones desde 2015.",
  },
  locanto: {
    title: "Publicar en Locanto Chile — precios TOP y Galería (7 días)",
    description:
      "Publicidad escort en Locanto Chile. Cotiza TOP, Galería o ambos por 7 días. Precio al instante con agencia desde 2015.",
  },
  simpleescort: {
    title: "Publicar en SimpleEscorts Chile — Super Turbo 5X por horario",
    description:
      "Publicidad para escort en SimpleEscorts Chile. Cotiza Super Turbo: más visibilidad y 5 subidas por horario. Precio al instante.",
  },
  escorcitas: {
    title: "Publicar en Escorcitas Chile — cotiza TOP, PREMIUM y GOLD",
    description:
      "Publicidad escort en Escorcitas.cl. Cotiza anuncios destacados por 1, 3 o 7 días. Agencia de publicaciones desde 2015 en todo Chile.",
  },
  wenas: {
    title: "Publicar en Wenas Chile (wenas.cl) — planes VIP con precio al instante",
    description:
      "Publicidad para escort en Wenas Chile. Cotiza aviso VIP 7, 15 o 30 días. Agencia desde 2015. Atendemos Santiago y regiones.",
  },
  gemidos: {
    title: "Publicar en Gemidos.tv Chile — Classic, Gold, Platinum y más",
    description:
      "Publicidad escort en Gemidos.tv Chile. Cotiza Classic, Gold, Platinum, Diamond y Black Rose. Precio al instante.",
  },
};

/** Landings SEO indexables (además de cotizadores / guías / valores). */
export const SEO_LANDINGS = [
  {
    path: "/publicidad-escort-chile",
    title: "Publicidad escort Chile | Agencia de publicaciones desde 2015",
    description:
      "Publicidad escort y publicidad para escort en todo Chile. Cotiza avisos en Skokka, Chimbis, Escorcitas y más. Sur, centro y regiones.",
    priority: 0.99,
  },
  {
    path: "/publicaciones-escort-chile",
    title: "Publicaciones escort Chile | Publiescort y avisos destacados",
    description:
      "Publicaciones escort y publiescort en todo Chile. Publicidad para escort en Skokka, Locanto, Chimbis, Escorcitas, SimpleEscorts, Wenas y Gemidos. Agencia desde 2015.",
    priority: 0.98,
  },
  {
    path: "/anuncios-escort-chile",
    title: "Anuncios escort Chile | Cotiza y publica en las mejores páginas",
    description:
      "Anuncios escort en Chile con precio al instante. Publicidad escort en Skokka, Locanto, Chimbis y más. Textos que venden y packs por presupuesto.",
    priority: 0.97,
  },
  {
    path: "/donde-publicar-escort-chile",
    title: "Dónde publicar escort en Chile | Skokka, Locanto, Chimbis y más",
    description:
      "Guía para elegir dónde publicar escort en Chile: Skokka, Locanto, Chimbis, Escorcitas, SimpleEscorts, Wenas, Gemidos y el panorama del mercado.",
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
      "publicidad escort",
      "publicidad para escort",
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
