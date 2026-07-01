export type CategoriaEscort = "mujer" | "trans" | "masculino";

export const CATEGORIA_ESCORT_LABEL: Record<CategoriaEscort, string> = {
  mujer: "Escort mujer",
  trans: "Escort trans",
  masculino: "Escort masculino",
};

export interface DatosAnuncio {
  categoria: CategoriaEscort;
  nombre: string;
  edad: number;
  ciudad: string;
  nacionalidad?: string;
  telefono?: string;
}

export interface TextoGenerado {
  titulo: string;
  cuerpo: string;
  completo: string;
}

type FnIntro = (d: DatosAnuncio) => string;
type FnUbic = (d: DatosAnuncio) => string;
type FnTitulo = (d: DatosAnuncio) => string;
type FnCuerpo = () => string;

interface PoolsCategoria {
  intros: FnIntro[];
  cuerpos: FnCuerpo[];
  ubicaciones: FnUbic[];
  titulos: FnTitulo[];
  sinNacionalidad: string[];
  conNacionalidad: (n: string) => string[];
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function fraseNacionalidad(d: DatosAnuncio, pools: PoolsCategoria): string {
  if (!d.nacionalidad?.trim()) return pick(pools.sinNacionalidad);
  return pick(pools.conNacionalidad(d.nacionalidad.trim()));
}

function fraseContacto(
  categoria: CategoriaEscort,
  telefono?: string,
  ciudad?: string
): string {
  if (telefono?.trim()) {
    const t = telefono.trim();
    if (categoria === "masculino") {
      return pick([
        `Llama de inmediato al ${t} para resolver cualquier duda y agendar nuestra cita al instante.`,
        `Marca a mi número ${t} y con gusto estaré para atenderte en ${ciudad}.`,
        `Contáctame por teléfono o WhatsApp al ${t} para coordinar nuestro encuentro.`,
        `Comunícate directamente conmigo al ${t} para que coordinemos ahora mismo.`,
      ]);
    }
    return pick([
      `Para agendar una cita contáctame al ${t} o déjame un mensajito de WhatsApp y concretamos.`,
      `Llámame al ${t} para coordinar nuestra cita ahora mismo. Te espero. Besos.`,
      `Agenda tu espacio a mi teléfono ${t} y recuerda que estoy lista para atenderte.`,
      `Marca a mi número ${t} y con gusto estaré para atenderte en ${ciudad}.`,
      `Contáctame llamando o escribiendo por WhatsApp al ${t} para acordar una cita, besos.`,
    ]);
  }
  if (categoria === "masculino") {
    return pick([
      `Contáctame para agendar una cita en ${ciudad}, te espero con la mejor actitud.`,
      `Escríbeme para coordinar en ${ciudad}, no te arrepentirás.`,
      `Ven a conocerme en ${ciudad}, disponible para encuentros discretos.`,
    ]);
  }
  return pick([
    `Contáctame para agendar una cita en ${ciudad}, aquí te estaré esperando con muchos besos.`,
    `Escríbeme para coordinar nuestra cita en ${ciudad}, no te arrepentirás.`,
    `Ven a conocerme en ${ciudad}, te espero con la mejor actitud.`,
  ]);
}

const SALUDOS_MUJER = [
  "Hola, cariño",
  "Hola, amor",
  "Hola, mis amores",
  "Hola, amorcito mío",
  "Amor",
];

const SALUDOS_TRANS = ["Hola, amor", "Hola, cariño", "Hola", "Hola, mi vida"];

const SALUDOS_MASC = ["Hola", "Hola, espero que estés muy bien"];

/** Frases que deben aparecer en todo anuncio generado */
function parrafoFrasesObligatorias(categoria: CategoriaEscort): string {
  const variantes: string[] = [
    "Si buscas rico sexo, aquí tienes el mejor sexo: sexo oral bien dedicado, te lo chupo rico, sexo con condón, diferentes posiciones y diferentes poses. Tengo lencería sexy para volverte loco.",
    "Te garantizo rico sexo y sexo sin apuros. Disfruta mi sexo oral, te lo chupo rico, siempre sexo con condón, en diferentes posiciones y diferentes poses. Tengo lencería lista para complacerte.",
    "Ven por rico sexo y buen sexo de verdad: sexo oral húmedo, te lo chupo rico, sexo con condón en diferentes posiciones y diferentes poses. Tengo lencería provocadora para que la pasemos increíble.",
    "Quiero darte rico sexo y sexo bien caliente. Mi sexo oral es de lujo, te lo chupo rico, todo sexo con condón, en diferentes posiciones y diferentes poses. Tengo lencería para encender la noche.",
  ];

  if (categoria === "masculino") {
    return pick([
      "Te ofrezco rico sexo y sexo intenso: sexo oral bien hecho, te lo chupo rico, sexo con condón en diferentes posiciones y diferentes poses. Tengo lencería si te gusta algo más atrevido.",
      "Mira, rico sexo y buen sexo es lo mío: sexo oral dedicado, te lo chupo rico, sexo con condón, diferentes posiciones y diferentes poses. Tengo lencería para sorprenderte.",
      "Cumplo con rico sexo y sexo sin límites. Sexo oral profundo, te lo chupo rico, sexo con condón en diferentes posiciones y diferentes poses. Tengo lencería lista para ti.",
    ]);
  }

  return pick(variantes);
}

export const TITULO_MIN_CARACTERES = 63;
export const TITULO_MAX_CARACTERES = 64;

const KEYWORDS_TITULO: Record<CategoriaEscort, string[]> = {
  mujer: [
    "ardiente",
    "rico sexo",
    "sexo oral",
    "independiente",
    "discreta",
    "complaciente",
    "caliente",
    "fogosa",
    "trato novios",
    "lencería",
    "salidas",
    "hotel",
    "verificada",
    "auténtica",
    "oral",
    "besos",
    "masajes",
    "disponible",
    "nalgona",
    "piernona",
  ],
  trans: [
    "trans",
    "dotada",
    "ardiente",
    "rico sexo",
    "sexo oral",
    "independiente",
    "discreta",
    "complaciente",
    "caliente",
    "trato novios",
    "salidas",
    "hotel",
    "verificada",
    "auténtica",
    "oral",
    "fogosa",
    "disponible",
    "nalgona",
    "piernona",
    "lechera",
  ],
  masculino: [
    "hombre",
    "activo",
    "vergón",
    "rico sexo",
    "sexo oral",
    "discreto",
    "complaciente",
    "varonil",
    "trato novios",
    "salidas",
    "hotel",
    "masajes",
    "disponible",
    "independiente",
    "oral",
    "anal",
    "deportista",
    "fitness",
    "exclusivo",
    "versátil",
  ],
};

function longitudTituloObjetivo(): number {
  return pick([TITULO_MIN_CARACTERES, TITULO_MAX_CARACTERES]);
}

function acortarTitulo(titulo: string, datos: DatosAnuncio): string {
  if (titulo.length <= TITULO_MAX_CARACTERES) return titulo;

  const etiquetas: Record<CategoriaEscort, string> = {
    mujer: "escort",
    trans: "trans",
    masculino: "hombre",
  };

  let ciudad = datos.ciudad;
  let nombre = datos.nombre;
  const etiq = etiquetas[datos.categoria];

  while (ciudad.length > 2) {
    const candidato = `${nombre}, ${datos.edad}a ${etiq} ${ciudad}`;
    if (candidato.length <= TITULO_MAX_CARACTERES) return candidato;
    ciudad = ciudad.slice(0, -1);
  }
  while (nombre.length > 2) {
    const candidato = `${nombre}, ${datos.edad}a ${etiq} ${ciudad}`;
    if (candidato.length <= TITULO_MAX_CARACTERES) return candidato;
    nombre = nombre.slice(0, -1);
  }

  return titulo.slice(0, TITULO_MAX_CARACTERES);
}

function completarTitulo(
  titulo: string,
  keywords: string[],
  objetivo: number
): string {
  let t = titulo.trim();

  if (t.length > TITULO_MAX_CARACTERES) {
    t = t.slice(0, TITULO_MAX_CARACTERES);
  }

  const shuffled = [...keywords].sort(() => Math.random() - 0.5);
  let i = 0;

  while (t.length < objetivo && i < 80) {
    const kw = shuffled[i % shuffled.length];
    const sep = t.length > 0 && !/[ |,\-|]$/.test(t) ? " " : "";
    const siguiente = t + sep + kw;

    if (siguiente.length <= objetivo) {
      t = siguiente;
    } else {
      const falta = objetivo - t.length - sep.length;
      if (falta > 0) t = t + sep + kw.slice(0, falta);
      break;
    }
    i++;
  }

  if (t.length < TITULO_MIN_CARACTERES) {
    const sufijo =
      " escort rico sexo sexo oral independiente discreta complaciente caliente";
    t = (t + sufijo).slice(0, objetivo);
  }

  if (t.length < TITULO_MIN_CARACTERES) {
    const sufijo = " rico sexo oral caliente disponible ahora mismo besos";
    t = (t + sufijo).slice(0, objetivo);
  }

  if (t.length > TITULO_MAX_CARACTERES) {
    t = t.slice(0, TITULO_MAX_CARACTERES);
  }

  return t;
}

function generarTitulo(datos: DatosAnuncio): string {
  const objetivo = longitudTituloObjetivo();
  const pools = POOLS[datos.categoria];
  const keywords = KEYWORDS_TITULO[datos.categoria];

  let base = pick(pools.titulos)(datos).trim();

  if (base.length > TITULO_MAX_CARACTERES) {
    base = acortarTitulo(base, datos);
  }

  if (base.length > objetivo) {
    base = base.slice(0, objetivo);
  }

  let titulo = completarTitulo(base, keywords, objetivo);

  if (titulo.length < TITULO_MIN_CARACTERES || titulo.length > TITULO_MAX_CARACTERES) {
    const etiquetas: Record<CategoriaEscort, string> = {
      mujer: "escort mujer",
      trans: "escort trans",
      masculino: "escort hombre",
    };
    const nucleo = `${datos.nombre}, ${datos.edad}a, ${etiquetas[datos.categoria]}, ${datos.ciudad}`;
    titulo = completarTitulo(nucleo, keywords, objetivo);
  }

  return titulo;
}

const POOLS: Record<CategoriaEscort, PoolsCategoria> = {
  mujer: {
    sinNacionalidad: [
      "soy una atractiva escort recién llegadita a tu ciudad",
      "soy una joven escort con piel muy suave y cuerpo natural",
      "soy una linda escort que te ofrece una buena experiencia",
      "soy una linda escort gordita y traviesa con senos grandes y una colita golosa",
      "me considero una mujer cariñosa y sin apuros para que disfrutemos de una compañía muy especial",
      "soy una ardiente escort lista para darte un trato lujurioso y súper apasionado",
      "en mí vas a encontrar a una escort hermosa con figura esbelta, bonitos pechos y buena cola",
    ],
    conNacionalidad: (n) => [
      `soy una escort ${n} independiente, caliente, divertida, deliciosa y encantadora`,
      `soy ${n} de piel suave y cuerpo natural`,
      `me considero una ${n} linda, ardiente, apasionada y muy coqueta`,
      `soy una ${n} linda que te ofrece una buena experiencia`,
    ],
    intros: [
      (d) => {
        const nat = fraseNacionalidad(d, POOLS.mujer);
        return `${pick(SALUDOS_MUJER)}, me llamo ${d.nombre} y tengo ${d.edad} años. ${cap(nat)}, con un precioso cuerpo para endulzarte el día.`;
      },
      (d) => {
        const nat = fraseNacionalidad(d, POOLS.mujer);
        return `Hola, me llamo ${d.nombre} y soy una linda escort de ${d.edad} años que te ofrece una buena experiencia. ${cap(nat)}, te aseguro que no te arrepentirás de conocerme hoy.`;
      },
      (d) => {
        const extra = d.nacionalidad?.trim()
          ? `escort ${d.nacionalidad.trim()} independiente`
          : "escort independiente";
        return `${pick(SALUDOS_MUJER)}, me llamo ${d.nombre}, y soy una ${extra}, caliente, divertida, deliciosa y encantadora. Tengo ${d.edad} años, estoy con ganas de pasarla bien y lista para que juntos gocemos de un buen sexo.`;
      },
      (d) =>
        `${pick(SALUDOS_MUJER)}, me llamo ${d.nombre}, en mí vas a encontrar a una escort hermosa de ${d.edad} años con figura esbelta, bonitos pechos y buena cola. Me distingo por ser cariñosa, divertida y tu amante ideal.`,
      (d) => {
        const nat = fraseNacionalidad(d, POOLS.mujer);
        return `Hola mi amor, soy ${d.nombre}, una ardiente escort de ${d.edad} años. ${cap(nat)}. Ven y descubre que soy una verdadera ninfómana lista para llevarte al placer.`;
      },
    ],
    cuerpos: [
      () =>
        "Mi trato es de novios con besos apasionados, ricos masajes y bailes eróticos. Ven y enloquece con mi servicio bien porno, culo de infarto y pechos para que te vuelvas loco.",
      () =>
        "Me encantará chupártela y cuando me tengas toda mojada quiero que me la metas entera y me hagas acabar. Haré todo para que tengas uno de los mejores orgasmos de tu vida.",
      () =>
        "Te ofrezco trato de novios con ricos besos, oral a garganta profunda y un rico anal muy placentero. Lluvia dorada, beso negro y muchas ganas de repetir.",
      () =>
        "Soy cariñosa, sensual y traviesa. Provocadoras caricias, bailes eróticos y sexo bien húmedo, mojadita y caliente hasta que no aguantes más.",
      () =>
        "Te garantizo cumplir tus deseos más ocultos. Sexo salvaje con preservativo, gemidos reales y entrega total en la cama.",
      () =>
        "Oral hasta el fondo en las posturas que más te exciten. Estaré súper mojadita y ansiosa por ti, con atención llena de pasión y sin tabúes.",
    ],
    ubicaciones: [
      (d) => `Me ubico en ${d.ciudad}, tengo lugar propio y también voy a domicilio u hotel.`,
      (d) => `Estoy en la zona de ${d.ciudad} con un ambiente discreto y cómodo, cuento con lugar privado.`,
      (d) => `Me ubico en ${d.ciudad} y realizo salidas a domicilio, hotel o motel.`,
      (d) => `Estoy de paso por ${d.ciudad}. Hago salidas cuando lo desees y me traslado a hoteles.`,
      (d) => `Estoy en ${d.ciudad}, en una zona céntrica y bien conectada, para un encuentro placentero.`,
    ],
    titulos: [
      (d) => `${d.nombre}, ${d.edad}a escort ${d.ciudad}`,
      (d) => `${d.nombre} | ${d.edad}a | ${d.ciudad}`,
      (d) => `Escort ${d.nombre} ${d.ciudad}`,
      (d) => `Ardiente ${d.nombre}, ${d.edad}a, ${d.ciudad}`,
      (d) => `${d.nombre} escort ${d.ciudad} ${d.edad}a`,
    ],
  },

  trans: {
    sinNacionalidad: [
      "soy una escort trans con un cuerpo bien cuidado y lleno de energía",
      "soy una hermosa transexual totalmente genuina, tal como me ves en las fotos",
      "soy una hermosa trans bien dotada y muy ardiente",
      "soy una linda escort trans nueva en tu ciudad para cumplir todas tus fantasías",
      "me destaco por ser sumamente ardiente, atractiva y la compañera ideal",
    ],
    conNacionalidad: (n) => [
      `soy una escort trans ${n} con mucha pasión y energía`,
      `soy una hermosa trans ${n}, genuina y muy complaciente`,
      `me presento como escort trans ${n}, atractiva y fogosa`,
    ],
    intros: [
      (d) =>
        `Hola, soy ${d.nombre}, una escort trans con un cuerpo bien cuidado y lleno de energía. Tengo ${d.edad} años y estoy lista para ofrecerte una experiencia única, con mucha pasión y diversión.`,
      (d) =>
        `Hola, cariño, me llamo ${d.nombre} y soy una hermosa transexual totalmente genuina, tal como me ves en las fotos. Tengo ${d.edad} años, soy muy complaciente y cumplo cada una de tus fantasías.`,
      (d) =>
        `Hola, me llamo ${d.nombre}, soy una hermosa trans bien dotada y muy ardiente. ${d.edad} años, sumamente atractiva y la compañera ideal para un encuentro inolvidable.`,
      (d) =>
        `Hola, amor, me llamo ${d.nombre}, una linda escort trans de ${d.edad} años en ${d.ciudad} para cumplir todas tus fantasías. Soy de piel suave, bien nalgona y piernona. Mis fotos son auténticas.`,
      (d) =>
        `Hola, soy tu ${d.nombre}, escort trans de ${d.edad} años con mucha energía y ganas de darte placer. Busco clientes con buen gusto que deseen una experiencia caliente y llena de complicidad.`,
    ],
    cuerpos: [
      () =>
        "Me especializo en encuentros inolvidables, placer intenso y momentos bien calientes. Mi servicio es súper seguro, discreto y sin rollos.",
      () =>
        "Trato de pareja, oral con preservativo, 69 y lluvia dorada. Cambio de roles, anal con protección y eyaculación corporal. También vendo contenido y hago videollamadas.",
      () =>
        "Dispuesta a cumplir todas tus fantasías en la cama. Trato de novios, bien cachonda y experta en oral de lujo. Puedes venirte donde quieras.",
      () =>
        "Me pones en la posición que gustes, soy bien nalgona y piernona. Fotos auténticas, servicio discreto y muchas ganas de darte placer sin límites.",
      () =>
        "Experiencia caliente y auténtica, con total entrega. Atiendo independiente, higiene impecable y muchas ganas de repetir contigo.",
    ],
    ubicaciones: [
      (d) => `Estoy en ${d.ciudad}, con un lugar discreto y privado para nuestros encuentros.`,
      (d) => `Me ubico en ${d.ciudad}, hago salidas a hotel y domicilio cuando lo desees.`,
      (d) => `Estoy ubicada en ${d.ciudad}, zona céntrica y bien conectada, con espacio discreto.`,
      (d) => `Me ubico en ${d.ciudad}. Estaré solo por pocos días, así que no dudes en contactarme.`,
    ],
    titulos: [
      (d) => `Trans ${d.nombre} ${d.edad}a ${d.ciudad}`,
      (d) => `${d.nombre} trans ${d.ciudad}`,
      (d) => `Escort trans ${d.nombre} ${d.ciudad}`,
      (d) => `${d.nombre}, ${d.edad}a, ${d.ciudad}`,
    ],
  },

  masculino: {
    sinNacionalidad: [
      "soy un sabroso escort hombre, deportista con excelente actitud y carisma",
      "soy un escort hombre alto y varonil, con presencia segura y elegante",
      "soy un escort hombre serio y versátil, deseoso de compartir un espacio de pleno placer",
      "quiero ser tu chico de compañía, 100% exclusivo, activo y discreto",
      "soy un escort hombre mulato con imponente presencia y personalidad decidida",
      "me considero una persona sumamente apasionada y entregada en la intimidad",
    ],
    conNacionalidad: (n) => [
      `soy un escort hombre ${n}, deportista con excelente actitud`,
      `me presento como escort hombre ${n}, varonil y discreto`,
      `soy un ${n} activo, educado e impecable, listo para complacerte`,
    ],
    intros: [
      (d) =>
        `Hola, me presento, mi nombre es ${d.nombre} y soy un sabroso escort hombre de ${d.edad} años, deportista con excelente actitud y carisma. Me considero sumamente apasionado y entregado para cumplir todo lo que pase por tu mente.`,
      (d) =>
        `Hola, me llamo ${d.nombre}, y soy un escort hombre alto y varonil de ${d.edad} años. Mi presencia transmite seguridad, elegancia y una masculinidad natural que se siente desde el primer momento.`,
      (d) =>
        `Hola, espero que estés muy bien, me llamo ${d.nombre} y soy un escort hombre serio y versátil de ${d.edad} años. Me caracterizo por brindar un trato sumamente masculino, directo y con total discreción.`,
      (d) =>
        `Hola, me llamo ${d.nombre} y quiero ser tu chico de compañía de ${d.edad} años, 100% exclusivo. Soy activo, discreto, educado e impecable, dispuesto a complacer tus mayores deseos con atención personalizada.`,
      (d) =>
        `Hola, me llamo ${d.nombre}, un escort hombre de ${d.edad} años con imponente presencia y personalidad decidida para brindarte un encuentro totalmente inolvidable en ${d.ciudad}.`,
    ],
    cuerpos: [
      () =>
        "Cumplo todas tus fantasías y deseos más íntimos. Anal jugoso en varias posturas, bien delicioso. Bailes exóticos, trato de pololos y siempre con higiene.",
      () =>
        "Penetración profunda, masajes sensuales y fantasías compartidas con entrega total. Sé cómo hacerte sentir deseada y completamente satisfecha.",
      () =>
        "Trato de pareja higiénico con ricos besos, caricias y penetraciones, más un jugoso oral. Sexo seguro y confidencialidad absoluta.",
      () =>
        "Experiencia exclusiva: cenas, eventos, viajes o encuentros privados. Masajes deliciosos, atiendo parejas y vendo contenido si lo deseas.",
      () =>
        "Activo, con total protección. Atiendo mujeres, parejas o pasivos con profesionalismo. Vergón, discreto y con ganas de romper la rutina.",
    ],
    ubicaciones: [
      (d) => `Me ubico en ${d.ciudad}, específicamente en zona céntrica, esperando tu comunicación para encontrarnos.`,
      (d) => `Estoy en ${d.ciudad}, con departamento privado y ambiente elegante y relajado.`,
      (d) => `Me ubico en ${d.ciudad}, sector bien conectado en transporte público, listo para coordinar contigo.`,
      (d) => `Recién llegué a ${d.ciudad}, tengo lugar propio y también hago salidas a hotel o domicilio.`,
    ],
    titulos: [
      (d) => `${d.nombre} hombre ${d.edad}a ${d.ciudad}`,
      (d) => `Escort ${d.nombre} ${d.ciudad}`,
      (d) => `${d.nombre}, ${d.edad}a, ${d.ciudad}`,
      (d) => `Hombre ${d.nombre} ${d.ciudad}`,
    ],
  },
};

export function validarDatosAnuncio(raw: {
  categoria: string;
  nombre: string;
  edad: string;
  ciudad: string;
  nacionalidad: string;
  telefono: string;
}): { ok: true; datos: DatosAnuncio } | { ok: false; error: string } {
  const categoria = raw.categoria as CategoriaEscort;
  if (!["mujer", "trans", "masculino"].includes(categoria)) {
    return { ok: false, error: "Selecciona el tipo de escort." };
  }

  const nombre = raw.nombre.trim();
  const ciudad = raw.ciudad.trim();
  const edad = Number(raw.edad.trim());

  if (!nombre) return { ok: false, error: "El nombre es obligatorio." };
  if (!ciudad) return { ok: false, error: "La ciudad es obligatoria." };
  if (!Number.isFinite(edad) || edad < 18 || edad > 99) {
    return { ok: false, error: "Ingresa una edad válida (18–99)." };
  }

  const nacionalidad = raw.nacionalidad.trim();
  const telefono = raw.telefono.trim().replace(/\s/g, "");

  return {
    ok: true,
    datos: {
      categoria,
      nombre,
      edad: Math.round(edad),
      ciudad,
      nacionalidad: nacionalidad || undefined,
      telefono: telefono || undefined,
    },
  };
}

export function generarTextoAnuncio(datos: DatosAnuncio): TextoGenerado {
  const pools = POOLS[datos.categoria];

  const parrafos = [
    pick(pools.intros)(datos),
    pick(pools.cuerpos)(),
    parrafoFrasesObligatorias(datos.categoria),
    `${pick(pools.ubicaciones)(datos)} ${fraseContacto(datos.categoria, datos.telefono, datos.ciudad)}`,
  ];

  const titulo = generarTitulo(datos);
  const cuerpo = parrafos.join("\n\n");

  return {
    titulo,
    cuerpo,
    completo: `${titulo}\n\n${cuerpo}`,
  };
}
