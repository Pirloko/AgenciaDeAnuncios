import type { Sitio, TablaPrecios } from "@/types/sitio";
import { getSupabase } from "@/lib/supabase";

// ============================================================
//  DATOS DE RESPALDO (FALLBACK)
//  La app funciona con esto aunque Supabase no esté conectado.
//  Cuando conectes Supabase, estos datos se reemplazan por los de la BD.
// ============================================================
export const FALLBACK: Record<string, Sitio> = {
  skokka: {
    slug: "skokka",
    nombre: "skokka",
    dominio: "skokka.com",
    desde: 2015,
    slogan: "Nuestros anuncios venden",
    color: "#E5167B",
    accent: "#2E9BE5",
    disponible: true,
    descripcion: [
      "El aviso destacado en Skokka funciona por subidas y horarios. Una subida es cada vez que tu aviso vuelve a los primeros lugares del listado. Mientras más subidas, más veces aparece arriba durante el día.",
      "Los horarios son las franjas en que quieres que el aviso se vea destacado: puedes marcar de 1 a 6 franjas diurnas (06:00 a 00:00). El valor diurno es por horario y se multiplica por la cantidad de franjas. La madrugada (00:00 a 06:00) tiene un valor propio.",
    ],
    niveles: [
      { id: "TOP", nombre: "TOP", beneficio: "Aparece en los primeros lugares." },
      { id: "SUPER TOP", nombre: "Súper Top", beneficio: "Más arriba y con más prioridad que TOP." },
      { id: "TOP ALL IN ONE", nombre: "Top All in One", beneficio: "Lo máximo: fondo de color, etiqueta «Novedad» y sale en Súper Top." },
    ],
    horarios: ["06–09", "09–12", "12–15", "15–18", "18–21", "21–00"],
    diurno: {
      "3-1": { TOP: 3000, "SUPER TOP": 4000, "TOP ALL IN ONE": 5000 },
      "6-1": { TOP: 4000, "SUPER TOP": 5000, "TOP ALL IN ONE": 6000 },
      "3-3": { TOP: 5000, "SUPER TOP": 7000, "TOP ALL IN ONE": 8500 },
      "6-3": { TOP: 6000, "SUPER TOP": 8000, "TOP ALL IN ONE": 10000 },
      "3-7": { TOP: 8000, "SUPER TOP": 11500, "TOP ALL IN ONE": 15500 },
      "6-7": { TOP: 10000, "SUPER TOP": 14000, "TOP ALL IN ONE": 18500 },
    },
    madrugada: {
      "6-1": { TOP: 3500, "SUPER TOP": 4500, "TOP ALL IN ONE": 5500 },
      "6-3": { TOP: 5500, "SUPER TOP": 6500, "TOP ALL IN ONE": 8500 },
      "6-7": { TOP: 9000, "SUPER TOP": 12000, "TOP ALL IN ONE": 15000 },
    },
    faq: [
      { q: "¿Cómo funciona un aviso destacado en Skokka?", a: "Tu aviso se muestra en los primeros lugares del listado. Defines cuántas veces sube al día (subidas), en qué horarios y por cuántos días. Mientras más subidas y horarios, más visibilidad." },
      { q: "¿Qué significan las «subidas»?", a: "Una subida es cada vez que tu aviso vuelve automáticamente a los primeros puestos durante el día. Puedes elegir 3 o 6 subidas diarias." },
      { q: "¿Qué diferencia hay entre TOP, Súper Top y Top All in One?", a: "TOP aparece en los primeros lugares. Súper Top tiene más prioridad de posición. Top All in One es lo máximo: sale en Súper Top, con fondo de color y etiqueta «Novedad»." },
      { q: "¿Cuánto cuesta destacar un aviso en Skokka?", a: "Depende de la modalidad (día o madrugada), los días, las subidas, el nivel y la cantidad de horarios. En el cotizador ves el precio exacto al tiro." },
      { q: "¿Puedo destacar mi aviso en la madrugada?", a: "Sí. La franja de madrugada (00:00 a 06:00) tiene un valor plano propio, con 6 subidas incluidas." },
    ],
  },
  chimbis: {
    slug: "chimbis",
    nombre: "Chimbis",
    dominio: "chimbis.com",
    desde: 2010,
    slogan: "Anuncios que llegan",
    color: "#13b8a6",
    accent: "#0d9488",
    disponible: true,
    descripcion: [
      "En Chimbis los avisos destacados funcionan por zona (Santiago/RM u otras ciudades), días, subidas y plan (TOP, Destacado e Historias).",
      "Solo se publican avisos con fotos 100% reales comprobables. También puedes subir videos.",
    ],
    niveles: [
      { id: "TOP", nombre: "TOP", beneficio: "Primeros lugares del listado." },
      { id: "TOP_DESTACADO", nombre: "TOP + Destacado", beneficio: "TOP con mayor visibilidad destacada." },
      { id: "TOP_HISTORIAS", nombre: "TOP + Historias", beneficio: "TOP más publicación en historias." },
      { id: "TOP_DESTACADO_HISTORIA", nombre: "TOP + Destacado + Historia", beneficio: "Plan completo." },
    ],
    horarios: [],
    diurno: {},
    madrugada: {},
    faq: [
      { q: "¿Cómo funciona un aviso destacado en Chimbis?", a: "Tocas si publicas en Santiago/Región Metropolitana u otra ciudad del norte o sur de Chile. Luego defines los días, las subidas (cuántas veces sube a los primeros lugares) y el plan: TOP, TOP + Destacado, TOP + Historias o la combinación completa." },
      { q: "¿Qué significan las «subidas» en Chimbis?", a: "Cada subida es una vez que tu aviso vuelve a los primeros puestos del listado durante el período contratado. Puedes elegir distintas cantidades según la zona y los días." },
      { q: "¿Qué diferencia hay entre TOP, Destacado e Historias?", a: "TOP te lleva a los primeros lugares. Destacado agrega mayor visibilidad en el listado. Historias incluye publicación en historias. Puedes combinarlos según el plan que definas." },
      { q: "¿Puedo subir fotos y videos?", a: "Sí. En Chimbis solo se aceptan avisos destacados con fotos 100% reales y comprobables. También puedes subir videos." },
      { q: "¿Los precios son distintos en Santiago y en otras ciudades?", a: "Sí. Santiago/RM y las demás ciudades del norte o sur tienen tablas de precios diferentes. El cotizador te muestra el valor exacto según lo que marques." },
    ],
  },
  locanto: {
    slug: "locanto",
    nombre: "Locanto",
    dominio: "locanto.cl",
    slogan: "Anuncios en Chile",
    color: "#f0901e",
    accent: "#e67e22",
    disponible: true,
    descripcion: [
      "En Locanto los avisos destacados son por 7 días, visibles las 24 horas de cada día. Puedes elegir TOP, Galería o ambos.",
      "Tu anuncio rota dentro de su categoría: los TOP compiten entre TOP y van destacándose arriba de forma rotativa.",
    ],
    niveles: [
      { id: "TOP", nombre: "TOP", beneficio: "Rotación en categoría TOP." },
      { id: "GALERIA", nombre: "Galería", beneficio: "Rotación en categoría Galería." },
      { id: "TOP_GALERIA", nombre: "TOP + Galería", beneficio: "Una publicación en ambas categorías." },
    ],
    horarios: [],
    diurno: {},
    madrugada: {},
    faq: [
      { q: "¿Cuántos días dura un aviso destacado en Locanto?", a: "Los avisos destacados en Locanto son por 7 días. Durante ese período tu anuncio está visible las 24 horas de cada día." },
      { q: "¿Cómo funciona la rotación en Locanto?", a: "Los anuncios se mueven dentro de su propia categoría. Los TOP rotan entre los TOP: periódicamente uno sube arriba y van turnándose. Lo mismo ocurre en Galería. Tu aviso sigue visible todo el día." },
      { q: "¿Qué diferencia hay entre TOP, Galería y TOP + Galería?", a: "TOP te ubica en la categoría TOP. Galería en la categoría Galería. TOP + Galería es una sola publicación que aparece en ambas categorías." },
      { q: "¿Cuánto cuesta destacar en Locanto?", a: "TOP 7 días: $17.500. Galería 7 días: $16.000. TOP + Galería: $30.000. El cotizador te muestra el precio al tiro." },
    ],
  },
  simpleescort: {
    slug: "simpleescort",
    nombre: "SimpleEscorts",
    dominio: "simpleescorts.com",
    slogan: "Super Turbo",
    color: "#6c5ce7",
    accent: "#5b4cdb",
    disponible: true,
    descripcion: [
      "El Super Turbo en SimpleEscorts te permite recibir hasta 20 veces más llamadas y contactos. Defines las franjas horarias y la duración que quieras.",
      "Tu aviso se muestra con foto 2,5 veces más grande, etiqueta Super Turbo, un color que lo diferencia del resto y sube 5 veces en cada horario contratado.",
    ],
    niveles: [
      {
        id: "SUPER_TURBO_5X",
        nombre: "Super Turbo 5X",
        beneficio: "Foto 2,5× más grande, etiqueta Super Turbo, color distintivo y 5 subidas por horario.",
      },
    ],
    horarios: [],
    diurno: {},
    madrugada: {},
    faq: [
      {
        q: "¿Qué es Super Turbo en SimpleEscorts?",
        a: "Es el plan más visible de SimpleEscorts. Tu aviso lleva foto 2,5 veces más grande, etiqueta Super Turbo y un color distintivo que lo separa del resto. Además sube 5 veces en cada franja horaria que contrates, volviendo a los primeros lugares del listado.",
      },
      {
        q: "¿Qué significa que sube 5 veces?",
        a: "En cada horario que definas, tu aviso vuelve automáticamente a los primeros puestos 5 veces al día. Con los 4 horarios son 20 subidas diarias en total.",
      },
      {
        q: "¿Qué ventajas visuales tiene el Super Turbo?",
        a: "Foto 2,5 veces más grande que un aviso normal, etiqueta Super Turbo sobre la imagen y un color diferente que hace que tu anuncio destaque en el listado.",
      },
      {
        q: "¿Cuáles son los horarios?",
        a: "Mañana (06:00–12:00), Tarde (12:00–18:00), Noche (18:00–00:00) y Madrugada (00:00–06:00). Puedes marcar uno o más, o los 4 con precio full.",
      },
      {
        q: "¿Cuánto cuesta?",
        a: "Depende de los días (1, 3, 5 o 7) y si marcas full horarios o por franja. El cotizador te da el precio exacto al tiro.",
      },
    ],
  },
  escorcitas: {
    slug: "escorcitas",
    nombre: "Escorcitas",
    dominio: "escorcitas.cl",
    slogan: "Agencia de publicaciones",
    color: "#922B5C",
    accent: "#C9A227",
    disponible: true,
    descripcion: [
      "En Escorcitas publicas por tipo de escort (mujer, trans o masculino), eliges los días y el plan TOP, PREMIUM o GOLD.",
      "Los anuncios rotan dentro de su categoría: TOP abajo, PREMIUM más arriba y GOLD en la parte más alta del listado.",
    ],
    niveles: [
      { id: "TOP", nombre: "TOP", beneficio: "Etiqueta verde TOP. Hasta 8 fotos." },
      { id: "PREMIUM", nombre: "PREMIUM", beneficio: "Destacado en azul. Hasta 10 fotos y 1 video." },
      { id: "GOLD", nombre: "GOLD", beneficio: "El más visible. Hasta 12 fotos, videos, historias y clave de acceso." },
    ],
    horarios: [],
    diurno: {},
    madrugada: {},
    faq: [
      {
        q: "¿Cómo funciona la publicación en Escorcitas?",
        a: "Eliges si publicas como escort mujer, trans o masculino, cuántos días (1, 3 o 7) y el plan TOP, PREMIUM o GOLD. El cotizador te da el precio al tiro.",
      },
      {
        q: "¿Qué diferencia hay entre TOP, PREMIUM y GOLD?",
        a: "TOP lleva etiqueta verde y hasta 8 fotos. PREMIUM se destaca en azul, permite 2 fotos de perfil, hasta 10 fotos y 1 video opcional. GOLD es el más grande: 3 fotos de portada, hasta 12 fotos, videos, clave de acceso y estados/historias.",
      },
      {
        q: "¿Cómo rotan los anuncios?",
        a: "Cada anuncio rota dentro de su propia categoría (TOP, PREMIUM o GOLD). Periódicamente uno sube arriba y van turnándose entre los de la misma plan.",
      },
      {
        q: "¿Cuánto cuesta publicar en Escorcitas?",
        a: "Depende de los días y el plan. Ejemplo 7 días: TOP $8.000, PREMIUM $11.000, GOLD $16.000. El cotizador muestra el valor exacto.",
      },
    ],
  },
  wenas: {
    slug: "wenas",
    nombre: "Wenas",
    dominio: "wenas.cl",
    slogan: "Publicación VIP",
    color: "#D32F2F",
    accent: "#B71C1C",
    disponible: true,
    descripcion: [
      "En Wenas publicas con plan VIP: tu aviso queda destacado durante 7, 15 o 30 días.",
      "Eliges la duración, ves el precio al tiro y pedís la publicación por WhatsApp.",
    ],
    niveles: [
      {
        id: "VIP",
        nombre: "VIP",
        beneficio: "Anuncio VIP destacado en el listado de wenas.cl.",
      },
    ],
    horarios: [],
    diurno: {},
    madrugada: {},
    faq: [
      {
        q: "¿Cómo funciona la publicación en Wenas?",
        a: "Eliges cuántos días quieres el plan VIP (7, 15 o 30). El cotizador te muestra el precio exacto y puedes pedir la publicación por WhatsApp.",
      },
      {
        q: "¿Qué incluye el plan VIP?",
        a: "Es la publicación destacada VIP en wenas.cl durante el período que contrates: 7, 15 o 30 días.",
      },
      {
        q: "¿Cuánto cuesta el VIP en Wenas?",
        a: "VIP 7 días: $31.900. VIP 15 días: $55.900. VIP 30 días: $96.900. El cotizador y la tabla de valores muestran el detalle.",
      },
    ],
  },
  gemidos: {
    slug: "gemidos",
    nombre: "Gemidos.tv",
    dominio: "gemidos.tv",
    slogan: "Publicación verificada",
    color: "#3E828E",
    accent: "#B91D2F",
    disponible: true,
    descripcion: [
      "En Gemidos.tv eliges el plan (Classic, Gold, Platinum, Diamond, Diamond VIP o Black Rose) y la duración disponible para ese plan.",
      "La verificación de perfil es obligatoria. También puedes usar modo pausa o vacaciones según las reglas del sitio.",
    ],
    niveles: [
      { id: "CLASSIC", nombre: "Classic", beneficio: "Publicación estándar." },
      { id: "GOLD", nombre: "Gold", beneficio: "Más visibilidad que Classic." },
      { id: "PLATINUM", nombre: "Platinum", beneficio: "Posicionamiento alto." },
      { id: "DIAMOND", nombre: "Diamond", beneficio: "Alta prioridad." },
      { id: "DIAMOND_VIP", nombre: "Diamond VIP", beneficio: "Diamond exclusivo." },
      { id: "BLACK_ROSE", nombre: "Black Rose", beneficio: "Máxima exposición." },
    ],
    horarios: [],
    diurno: {},
    madrugada: {},
    faq: [
      {
        q: "¿Qué planes hay en Gemidos.tv?",
        a: "Classic, Gold, Platinum, Diamond, Diamond VIP y Black Rose. Cada uno tiene duraciones y precios distintos. El cotizador te muestra el valor exacto.",
      },
      {
        q: "¿Cómo se verifica el perfil?",
        a: "Se pide una sola vez: foto de documento frente y dorso, selfie tocándote el cuello, y un video real presentándote en Gemidos con fecha y hora. La verificación real es obligatoria.",
      },
      {
        q: "¿Qué es el modo pausa?",
        a: "Hasta 10 días sin descontar vigencia. Luego se reactiva solo. Semanal: 1 pausa. Mensual: 2 pausas.",
      },
      {
        q: "¿Qué es el modo vacaciones?",
        a: "Puedes activarlo el tiempo que quieras. Sí se descuentan días, pero el perfil sigue visible y mantiene su posición e imagen.",
      },
    ],
  },
};

/** Sitios en el home aún no cotizables (solo aviso). */
const PRONTO_HOME: {
  slug: string;
  nombre: string;
  dominio: string;
  color: string;
  disponible: false;
  mensajePronto: string;
}[] = [];

const HOME_ORDER = [
  "skokka",
  "chimbis",
  "locanto",
  "simpleescort",
  "escorcitas",
  "wenas",
  "gemidos",
];

export type SitioHome = Pick<Sitio, "slug" | "nombre" | "dominio" | "color" | "disponible"> & {
  mensajePronto?: string;
};

/** Si Supabase trae datos incompletos, rellena con FALLBACK del mismo slug. */
function completarSitioDesdeFallback(slug: string, sitio: Sitio): Sitio {
  const fb = FALLBACK[slug];
  if (!fb) return sitio;

  return {
    ...sitio,
    horarios: sitio.horarios.length ? sitio.horarios : fb.horarios,
    niveles: sitio.niveles.length ? sitio.niveles : fb.niveles,
    descripcion: sitio.descripcion.length ? sitio.descripcion : fb.descripcion,
    faq: sitio.faq.length ? sitio.faq : fb.faq,
    diurno: Object.keys(sitio.diurno).length ? sitio.diurno : fb.diurno,
    madrugada: Object.keys(sitio.madrugada).length ? sitio.madrugada : fb.madrugada,
  };
}

// Slugs disponibles (para generateStaticParams / sitemap)
export async function listarSlugs(): Promise<string[]> {
  const desdeFallback = Object.keys(FALLBACK).filter((s) => FALLBACK[s].disponible);
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("sitios")
      .select("slug")
      .eq("disponible", true);
    if (!error && data && data.length) {
      const slugs = new Set([...data.map((r: { slug: string }) => r.slug), ...desdeFallback]);
      return [...slugs];
    }
  }
  return desdeFallback;
}

// Resumen de todos los sitios (home)
export async function listarSitios(): Promise<SitioHome[]> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("sitios")
      .select("slug,nombre,dominio,color,disponible")
      .order("orden", { ascending: true });
    if (!error && data && data.length) {
      const porSlug = new Map<string, SitioHome>(
        data.map((row) => [row.slug, row as SitioHome])
      );
      for (const s of Object.values(FALLBACK)) {
        if (s.disponible) {
          porSlug.set(s.slug, {
            slug: s.slug,
            nombre: s.nombre,
            dominio: s.dominio,
            color: s.color,
            disponible: true,
          });
        }
      }
      for (const p of PRONTO_HOME) {
        porSlug.set(p.slug, p);
      }
      return [...porSlug.values()].sort(
        (a, b) => HOME_ORDER.indexOf(a.slug) - HOME_ORDER.indexOf(b.slug)
      );
    }
  }
  return Object.values(FALLBACK)
    .map(
      (s): SitioHome => ({
        slug: s.slug,
        nombre: s.nombre,
        dominio: s.dominio,
        color: s.color,
        disponible: s.disponible,
      })
    )
    .concat(PRONTO_HOME)
    .sort((a, b) => HOME_ORDER.indexOf(a.slug) - HOME_ORDER.indexOf(b.slug));
}

// Sitio completo por slug (arma la tabla de precios desde filas planas)
export async function obtenerSitio(slug: string): Promise<Sitio | null> {
  // Sitios con cotizador propio usan datos locales (no el esquema Skokka de Supabase)
  if (["chimbis", "locanto", "simpleescort", "escorcitas", "wenas", "gemidos"].includes(slug) && FALLBACK[slug]) {
    return FALLBACK[slug];
  }

  const sb = getSupabase();
  if (sb) {
    const { data: row, error } = await sb
      .from("sitios")
      .select("*")
      .eq("slug", slug)
      .single();

    if (!error && row) {
      const [niveles, horarios, precios] = await Promise.all([
        sb.from("niveles").select("*").eq("sitio_slug", slug).order("orden"),
        sb.from("horarios").select("*").eq("sitio_slug", slug).order("idx"),
        sb.from("precios").select("*").eq("sitio_slug", slug),
      ]);

      const diurno: TablaPrecios = {};
      const madrugada: TablaPrecios = {};
      for (const p of precios.data ?? []) {
        const tabla = p.modalidad === "diurno" ? diurno : madrugada;
        const key = `${p.subidas}-${p.dias}`;
        (tabla[key] ||= {})[p.nivel] = p.precio;
      }

      return completarSitioDesdeFallback(slug, {
        slug,
        nombre: row.nombre,
        dominio: row.dominio,
        desde: row.desde ?? undefined,
        slogan: row.slogan,
        color: row.color,
        accent: row.accent ?? row.color,
        disponible: row.disponible,
        descripcion: row.descripcion ?? [],
        niveles: niveles.data ?? [],
        horarios: (horarios.data ?? []).map((h: { etiqueta: string }) => h.etiqueta),
        diurno,
        madrugada,
        faq: row.faq ?? [],
      });
    }
  }
  return FALLBACK[slug] ?? null;
}
