// Landings de publicidad escort por región / Chile

export type PublicidadLanding = {
  slug: string;
  path: string;
  title: string;
  description: string;
  h1: string;
  regionLabel: string;
  cities: string[];
  intro: string[];
  destacado: string;
  faqs: { q: string; a: string }[];
  priority: number;
};

export const PUBLICIDAD_LANDINGS: PublicidadLanding[] = [
  {
    slug: "chile",
    path: "/publicidad-escort-chile",
    title: "Publicidad escort Chile | Agencia de publicaciones desde 2015",
    description:
      "Publicidad escort y publicidad para escort en todo Chile. Cotiza avisos destacados en Skokka, Chimbis, Escorcitas, Locanto, Wenas y Gemidos. Sur, centro y regiones.",
    h1: "Publicidad escort en Chile",
    regionLabel: "Todo Chile",
    cities: [],
    intro: [
      "Somos una agencia de publicidad para escort y publicaciones destacadas en Chile. Desde 2015 armamos textos que venden, difuminamos rostro si lo necesitas y publicamos en las páginas que más buscan.",
      "Cotizas al instante por sitio o armas un pack por presupuesto. Atendemos Santiago, sur, centro-sur y regiones: Los Lagos, Araucanía, Biobío, Maule, O'Higgins y más.",
    ],
    destacado:
      "Si buscas publicidad escort con precio claro y acompañamiento real, aquí eliges la página (Skokka, Chimbis, Escorcitas, etc.), marcas días y horarios, y ves el total antes de escribir por WhatsApp.",
    faqs: [
      {
        q: "¿Qué es la publicidad escort que ofrecen?",
        a: "Publicamos y destacamos tu aviso en portales de anuncios escort en Chile: redacción del texto, opción de difuminar rostro o cubrir tatuajes, y planes TOP, VIP o destacados según cada sitio.",
      },
      {
        q: "¿Atienden fuera de Santiago?",
        a: "Sí. Trabajamos en todo Chile. Tenemos guías por región (sur, Araucanía, Biobío, Maule, O'Higgins, Valparaíso) con las ciudades que más nos consultan.",
      },
      {
        q: "¿Publicidad escort y publiescort es lo mismo?",
        a: "En la práctica sí: publicidad para escort, publicaciones escort y publiescort apuntan a destacar tu aviso en las páginas correctas. Nosotros cotizamos y publicamos; no arrendamos habitaciones.",
      },
    ],
    priority: 0.99,
  },
  {
    slug: "sur-los-lagos",
    path: "/publicidad-escort-sur-los-lagos",
    title: "Publicidad escort Sur y Los Lagos | Castro, Puerto Montt, Osorno",
    description:
      "Publicidad para escort en el sur de Chile: Castro, Ancud, Puerto Montt, Puerto Varas, Osorno y Aysén. Cotiza Skokka, Chimbis, Escorcitas y más con agencia desde 2015.",
    h1: "Publicidad escort en el sur y Los Lagos",
    regionLabel: "Sur y Los Lagos",
    cities: ["Castro", "Ancud", "Puerto Montt", "Puerto Varas", "Osorno", "Aysén"],
    intro: [
      "Publicidad escort para el sur de Chile y la región de Los Lagos. Cotizamos y publicamos en Skokka, Chimbis, Escorcitas, Locanto, Wenas y Gemidos con precio al instante.",
      "Atendemos Castro, Ancud, Puerto Montt, Puerto Varas, Osorno y zona Aysén. En Chimbis el valor cambia entre Santiago/RM y regiones; en el cotizador lo marcas y ves el total.",
    ],
    destacado:
      "En el sur muchas clientas combinan Chimbis (regiones) con Skokka o Escorcitas para más visibilidad. Te armamos el texto y el pack según tu presupuesto.",
    faqs: [
      {
        q: "¿Publican en Puerto Montt y Castro?",
        a: "Sí. Trabajamos publicidad escort en Castro, Ancud, Puerto Montt, Puerto Varas, Osorno, Aysén y demás ciudades del sur. Cotiza la página que uses y zona si aplica.",
      },
      {
        q: "¿Qué páginas convienen en el sur?",
        a: "Depende de tu ciudad y horario. Chimbis diferencia regiones; Skokka funciona bien con franjas horarias; Escorcitas y Gemidos también tienen demanda. Compara en el cotizador o arma un pack.",
      },
    ],
    priority: 0.94,
  },
  {
    slug: "araucania",
    path: "/publicidad-escort-araucania",
    title: "Publicidad escort Araucanía | Temuco, Pucón y Villarrica",
    description:
      "Publicidad para escort en la Araucanía: Temuco, Pucón y Villarrica. Cotiza avisos destacados en Skokka, Chimbis, Escorcitas y más. Agencia desde 2015.",
    h1: "Publicidad escort en la Araucanía",
    regionLabel: "Araucanía",
    cities: ["Temuco", "Pucón", "Villarrica"],
    intro: [
      "Agencia de publicidad escort en la Araucanía: Temuco, Pucón y Villarrica. Cotizas destacados en las páginas que más usan en la zona y ves el precio al tiro.",
      "Te ayudamos con título, textos que venden y publicación en Skokka, Chimbis, Escorcitas, Locanto, Wenas o Gemidos.",
    ],
    destacado:
      "En temporada alta (Pucón y Villarrica) conviene planificar franjas en Skokka o packs de varios días en Chimbis regiones.",
    faqs: [
      {
        q: "¿Hacen publicidad escort en Temuco?",
        a: "Sí. Cotizamos y publicamos para Temuco, Pucón, Villarrica y alrededores. Indica zona en Chimbis cuando el asistente lo pida.",
      },
      {
        q: "¿Puedo armar un pack para varias páginas?",
        a: "Sí. En Armar promoción eliges presupuesto, días y mínimo dos sitios; te mostramos opciones para enviar por WhatsApp.",
      },
    ],
    priority: 0.93,
  },
  {
    slug: "biobio",
    path: "/publicidad-escort-biobio",
    title: "Publicidad escort Biobío | Concepción, Talcahuano, Chillán",
    description:
      "Publicidad para escort en el Biobío: Concepción, Talcahuano, Chillán y Los Ángeles. Cotiza Skokka, Chimbis, Escorcitas y más. Publicaciones desde 2015.",
    h1: "Publicidad escort en el Biobío",
    regionLabel: "Biobío",
    cities: ["Concepción", "Talcahuano", "Chillán", "Los Ángeles"],
    intro: [
      "Publicidad escort en Concepción, Talcahuano, Chillán y Los Ángeles. Somos agencia de publicaciones y avisos destacados para todo el Biobío.",
      "Cotiza por página o arma una promoción según tu presupuesto. Trabajamos Skokka, Chimbis, Escorcitas, Locanto, Wenas y Gemidos.",
    ],
    destacado:
      "En Concepción y Talcahuano suele rendir combinar Skokka (franjas) con Chimbis regiones o Escorcitas según el estilo de aviso.",
    faqs: [
      {
        q: "¿Publican en Concepción y Chillán?",
        a: "Sí. Atendemos Concepción, Talcahuano, Chillán, Los Ángeles y el resto del Biobío. El cotizador muestra el valor según sitio y plan.",
      },
      {
        q: "¿Qué incluye la publicidad para escort?",
        a: "Textos orientados a vender, cotización clara, opción de difuminar rostro y publicación o destacado en la página que elijas.",
      },
    ],
    priority: 0.93,
  },
  {
    slug: "maule",
    path: "/publicidad-escort-maule",
    title: "Publicidad escort Maule | Talca, Curicó y Linares",
    description:
      "Publicidad para escort en el Maule: Talca, Curicó y Linares. Cotiza avisos en Skokka, Chimbis, Escorcitas y más. Agencia de publicaciones desde 2015.",
    h1: "Publicidad escort en el Maule",
    regionLabel: "Maule",
    cities: ["Talca", "Curicó", "Linares"],
    intro: [
      "Publicidad escort en Talca, Curicó y Linares. Cotizamos destacados en las páginas de anuncios más usadas en el Maule.",
      "Desde 2015 ayudamos a publicar con textos que venden y precio al instante en Skokka, Chimbis, Escorcitas y el resto de portales.",
    ],
    destacado:
      "En ciudades del Maule muchas eligen Chimbis (regiones) o Skokka según horarios; compara en el cotizador antes de decidir.",
    faqs: [
      {
        q: "¿Atienden Talca y Curicó?",
        a: "Sí. Hacemos publicidad para escort en Talca, Curicó, Linares y zonas cercanas. Cotiza el sitio que uses.",
      },
    ],
    priority: 0.92,
  },
  {
    slug: "ohiggins",
    path: "/publicidad-escort-ohiggins",
    title: "Publicidad escort O'Higgins | Rancagua, San Fernando, Santa Cruz",
    description:
      "Publicidad para escort en O'Higgins: Rancagua, San Fernando y Santa Cruz. Cotiza avisos destacados con agencia desde 2015.",
    h1: "Publicidad escort en O'Higgins",
    regionLabel: "O'Higgins",
    cities: ["Rancagua", "San Fernando", "Santa Cruz"],
    intro: [
      "Publicidad escort en Rancagua, San Fernando y Santa Cruz. Agencia de publicaciones y avisos destacados para la región de O'Higgins.",
      "Cotiza Skokka, Chimbis, Escorcitas, Locanto, Wenas o Gemidos y arma packs por presupuesto si lo necesitas.",
    ],
    destacado:
      "En Rancagua y el valle de Colchagua conviene revisar tablas de valores de cada sitio y elegir franjas según tu disponibilidad.",
    faqs: [
      {
        q: "¿Hacen publicidad escort en Rancagua?",
        a: "Sí. Publicamos y destacamos avisos en Rancagua, San Fernando, Santa Cruz y alrededores.",
      },
    ],
    priority: 0.92,
  },
  {
    slug: "valparaiso",
    path: "/publicidad-escort-valparaiso",
    title: "Publicidad escort Valparaíso | Los Andes y zona cordillera",
    description:
      "Publicidad para escort en la región de Valparaíso: Los Andes y zona cordillera. Cotiza Skokka, Chimbis, Escorcitas y más.",
    h1: "Publicidad escort en Valparaíso y Los Andes",
    regionLabel: "Valparaíso",
    cities: ["Los Andes"],
    intro: [
      "Publicidad escort en Los Andes y la región de Valparaíso. Cotizamos avisos destacados en Skokka, Chimbis, Escorcitas, Locanto, Wenas y Gemidos.",
      "Te armamos el texto, difuminamos rostro si hace falta y publicamos con precio claro desde 2015.",
    ],
    destacado:
      "En Los Andes y zona cordillera muchas combinan Chimbis regiones con Skokka para cubrir búsquedas locales y nacionales.",
    faqs: [
      {
        q: "¿Publican en Los Andes?",
        a: "Sí. Atendemos publicidad para escort en Los Andes y la región de Valparaíso. Usa el cotizador de cada página para ver el total.",
      },
    ],
    priority: 0.91,
  },
];

const bySlug = new Map(PUBLICIDAD_LANDINGS.map((l) => [l.slug, l]));

export function getPublicidadLanding(slug: string): PublicidadLanding | undefined {
  return bySlug.get(slug);
}

export function listPublicidadSlugs(): string[] {
  return PUBLICIDAD_LANDINGS.map((l) => l.slug);
}

/** Todas las ciudades priorizadas (para home y schema). */
export function todasLasCiudadesSeo(): string[] {
  const set = new Set<string>();
  for (const l of PUBLICIDAD_LANDINGS) {
    for (const c of l.cities) set.add(c);
  }
  return [...set];
}
