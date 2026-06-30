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
      "Los horarios son las franjas en que querés que el aviso se vea destacado: podés elegir de 1 a 6 franjas diurnas (06:00 a 00:00). El valor diurno es por horario y se multiplica por la cantidad de franjas. La madrugada (00:00 a 06:00) tiene un valor propio.",
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
      { q: "¿Cómo funciona un aviso destacado en Skokka?", a: "Tu aviso se muestra en los primeros lugares del listado. Elegís cuántas veces sube al día (subidas), en qué horarios y por cuántos días. Mientras más subidas y horarios, más visibilidad." },
      { q: "¿Qué significan las «subidas»?", a: "Una subida es cada vez que tu aviso vuelve automáticamente a los primeros puestos durante el día. Podés elegir 3 o 6 subidas diarias." },
      { q: "¿Qué diferencia hay entre TOP, Súper Top y Top All in One?", a: "TOP aparece en los primeros lugares. Súper Top tiene más prioridad de posición. Top All in One es lo máximo: sale en Súper Top, con fondo de color y etiqueta «Novedad»." },
      { q: "¿Cuánto cuesta destacar un aviso en Skokka?", a: "Depende de la modalidad (día o madrugada), los días, las subidas, el nivel y la cantidad de horarios. En el cotizador ves el precio exacto en segundos." },
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
      "Solo se publican avisos con fotos 100% reales comprobables. También podés subir videos.",
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
      { q: "¿Cómo funciona un aviso destacado en Chimbis?", a: "Elegís si publicás en Santiago/Región Metropolitana u otra ciudad del norte o sur de Chile. Luego definís los días, las subidas (cuántas veces sube a los primeros lugares) y el plan: TOP, TOP + Destacado, TOP + Historias o la combinación completa." },
      { q: "¿Qué significan las «subidas» en Chimbis?", a: "Cada subida es una vez que tu aviso vuelve a los primeros puestos del listado durante el período contratado. Podés elegir distintas cantidades según la zona y los días." },
      { q: "¿Qué diferencia hay entre TOP, Destacado e Historias?", a: "TOP te lleva a los primeros lugares. Destacado agrega mayor visibilidad en el listado. Historias incluye publicación en historias. Podés combinarlos según el plan que elijas." },
      { q: "¿Puedo subir fotos y videos?", a: "Sí. En Chimbis solo se aceptan avisos destacados con fotos 100% reales y comprobables. También podés subir videos." },
      { q: "¿Los precios son distintos en Santiago y en otras ciudades?", a: "Sí. Santiago/RM y las demás ciudades del norte o sur tienen tablas de precios diferentes. El cotizador te muestra el valor exacto según tu selección." },
    ],
  },
};

const PRONTO_HOME: Pick<Sitio, "slug" | "nombre" | "dominio" | "color" | "disponible">[] = [
  { slug: "locanto", nombre: "Locanto", dominio: "locanto.cl", color: "#f0901e", disponible: false },
  { slug: "simpleescort", nombre: "SimpleEscorts", dominio: "simpleescorts.com", color: "#6c5ce7", disponible: false },
];

const HOME_ORDER = ["skokka", "chimbis", "locanto", "simpleescort"];

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
export async function listarSitios(): Promise<
  Pick<Sitio, "slug" | "nombre" | "dominio" | "color" | "disponible">[]
> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("sitios")
      .select("slug,nombre,dominio,color,disponible")
      .order("orden", { ascending: true });
    if (!error && data && data.length) {
      const porSlug = new Map(data.map((row) => [row.slug, row]));
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
        if (!porSlug.has(p.slug)) porSlug.set(p.slug, p);
      }
      return [...porSlug.values()].sort(
        (a, b) => HOME_ORDER.indexOf(a.slug) - HOME_ORDER.indexOf(b.slug)
      );
    }
  }
  return Object.values(FALLBACK)
    .map((s) => ({
      slug: s.slug,
      nombre: s.nombre,
      dominio: s.dominio,
      color: s.color,
      disponible: s.disponible,
    }))
    .concat(PRONTO_HOME)
    .sort((a, b) => HOME_ORDER.indexOf(a.slug) - HOME_ORDER.indexOf(b.slug));
}

// Sitio completo por slug (arma la tabla de precios desde filas planas)
export async function obtenerSitio(slug: string): Promise<Sitio | null> {
  // Chimbis usa su propio cotizador y precios en src/lib/chimbis.ts
  if (slug === "chimbis" && FALLBACK.chimbis) {
    return FALLBACK.chimbis;
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

      return {
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
      };
    }
  }
  return FALLBACK[slug] ?? null;
}
