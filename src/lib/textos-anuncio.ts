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
        `Escríbeme al tiro por WhatsApp al ${t} y agendamos en ${ciudad}, sin rollos.`,
        `Llama o mándame un WhatsApp al ${t}: te atiendo piola y coordinamos ahora.`,
        `Marca al ${t} o escríbeme por WhatsApp y quedamos en ${ciudad} hoy mismo.`,
        `Contáctame al ${t}: te respondo rápido y armamos la cita sin vueltas.`,
        `WhatsApp ${t} — avísame a qué hora pasas y te espero listo.`,
      ]);
    }
    return pick([
      `Escríbeme al tiro por WhatsApp al ${t} y agendamos, te espero con ganas.`,
      `Llama o mándame un mensajito al ${t}: te atiendo piola y sin apuro.`,
      `WhatsApp ${t} — dime a qué hora quieres y quedamos en ${ciudad}.`,
      `Marca a mi número ${t} o escríbeme: estoy disponible ahora mismo, besitos.`,
      `Contáctame al ${t} por llamada o WhatsApp y armamos la cita al tiro.`,
      `Escríbeme al ${t}: te respondo rápido, discreta y con muchas ganas.`,
    ]);
  }
  if (categoria === "masculino") {
    return pick([
      `Escríbeme para agendar en ${ciudad}: te atiendo piola, discreto y sin vueltas.`,
      `Avísame y coordinamos en ${ciudad}, disponible ahora.`,
      `Contáctame para una cita en ${ciudad}: trato rico, seguro y confidencial.`,
    ]);
  }
  return pick([
    `Escríbeme para agendar en ${ciudad}: te espero mojadita y con ganas.`,
    `Avísame y quedamos en ${ciudad}, sin apuro y a puro gusto.`,
    `Contáctame para una cita en ${ciudad}: discreta, caliente y lista pa ti.`,
  ]);
}

const SALUDOS_MUJER = [
  "Hola, cariño",
  "Hola, amor",
  "Hola, mis amores",
  "Hola, amorcito",
  "Hola corazón",
  "Hola mi vida",
  "Hola rey",
  "Hola bb",
  "Amor",
  "Hola mi pololo",
];

const SALUDOS_TRANS = [
  "Hola, amor",
  "Hola, cariño",
  "Hola",
  "Hola, mi corazón",
  "Hola bb",
  "Hola rey",
  "Hola mi vida",
];

const SALUDOS_MASC = [
  "Hola",
  "Hola, espero que estés muy bien",
  "Hola, cómo estás",
  "Buenas",
  "Hola, un gusto",
];

/** Frases obligatorias: explícitas, tono chileno, con variación */
function parrafoFrasesObligatorias(categoria: CategoriaEscort): string {
  if (categoria === "masculino") {
    return pick([
      "Te ofrezco rico sexo sin apuro: te lo chupo entero, sexo oral bien hecho, sexo con condón, distintas posiciones y poses. Si te gusta lo más atrevido, también tengo look provocador listo pa ti.",
      "Rico sexo y buen sexo es lo mío: oral profundo, te lo chupo rico, siempre con condón, te la meto en las poses que más te calienten. Higiene piola y entrega total.",
      "Ven por sexo intenso de verdad: te lo chupo hasta el fondo, sexo con condón, varias posiciones, gemidos reales. Sin tabúes y con ganas de hacerte acabar rico.",
      "Te doy sexo bien caliente: oral jugoso, te lo chupo rico, penetración con condón en distintas poses. Trato de pololos, discreto y a puro gusto.",
      "Cumplo con rico sexo sin límites: sexo oral dedicado, te lo chupo entero, sexo con condón, diferentes posiciones. Listo pa dejarte temblando.",
    ]);
  }

  return pick([
    "Si buscas rico sexo, aquí lo tienes: te lo chupo rico, sexo oral bien baboso, sexo con condón, distintas posiciones y poses. Tengo lencería sexy pa volverte loco.",
    "Te garantizo rico sexo sin apuro. Disfruta mi oral húmedo, te lo chupo entero, siempre con condón, en las poses que más te calienten. Lencería lista pa complacerte.",
    "Ven por buen sexo de verdad: oral hasta el fondo, te lo chupo rico, sexo con condón, varias posiciones. Estoy mojadita y con lencería provocadora.",
    "Quiero darte sexo bien caliente. Mi oral es de lujo, te lo chupo rico, todo con condón, en distintas poses. Tengo lencería pa encender la noche.",
    "Rico sexo, sin vueltas: te lo chupo baboso, sexo oral profundo, sexo con condón, te monto o te dejo que me la metas como quieras. Lencería y muchas ganas.",
    "Pasémosla filete: oral goloso, te lo chupo rico, sexo con condón, diferentes posiciones y gemidos reales. Tengo lencería sexy y cero tabúes.",
    "Te ofrezco sexo a puro gusto: te lo chupo entero, oral con ganas, sexo con condón, te la meto en las poses que elijas. Lencería y entrega total.",
  ]);
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
    "culona",
    "cachonda",
    "mojadita",
    "sin apuro",
    "piola",
    "filete",
    "pololos",
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
    "cachonda",
    "vergona",
    "activa",
    "piola",
    "sin apuro",
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
    "dotado",
    "piola",
    "sin apuro",
    "filete",
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
      "soy una escort rica recién llegadita a tu ciudad, lista pa darte placer",
      "soy una joven escort de piel suave, cuerpo natural y mucha calentura",
      "soy una linda escort que te ofrece sexo rico, sin apuro y a puro gusto",
      "soy una escort gordita y traviesa, pechos grandes y una culita golosa",
      "me considero cariñosa, cachonda y sin apuros: compañía especial y sexo filete",
      "soy una ardiente escort lista pa un trato bien porno y súper apasionado",
      "en mí vas a encontrar una escort nalgona, pechos ricos y cola pa agarrar",
      "soy independiente, piola y bien caliente: te atiendo como corresponde",
      "soy una minita fogosa, mojadita fácil y con ganas de que me la metas rico",
      "soy escort verificada, fotos reales, cuerpo natural y cero engaños",
    ],
    conNacionalidad: (n) => [
      `soy una escort ${n} independiente, caliente, divertida y bien rica`,
      `soy ${n} de piel suave, cuerpo natural y muchas ganas de sexo`,
      `me considero una ${n} linda, ardiente, cachonda y bien coqueta`,
      `soy una ${n} fogosa que te ofrece sexo rico sin vueltas`,
      `soy ${n} piola, complaciente y lista pa cumplir tus fantasías`,
    ],
    intros: [
      (d) => {
        const nat = fraseNacionalidad(d, POOLS.mujer);
        return `${pick(SALUDOS_MUJER)}, me llamo ${d.nombre} y tengo ${d.edad} años. ${cap(nat)}. Tengo un cuerpo pa endulzarte el día y dejarte seco.`;
      },
      (d) => {
        const nat = fraseNacionalidad(d, POOLS.mujer);
        return `Hola, me llamo ${d.nombre}: escort de ${d.edad} años que te ofrece una experiencia filete. ${cap(nat)}. Si vienes, no te vas a arrepentir.`;
      },
      (d) => {
        const extra = d.nacionalidad?.trim()
          ? `escort ${d.nacionalidad.trim()} independiente`
          : "escort independiente";
        return `${pick(SALUDOS_MUJER)}, soy ${d.nombre}, ${extra}, caliente, divertida y deliciosa. Tengo ${d.edad} años y ganas de un buen sexo contigo.`;
      },
      (d) =>
        `${pick(SALUDOS_MUJER)}, me llamo ${d.nombre}: escort de ${d.edad} años, pechos ricos, buena cola y trato de pololos. Cariñosa, traviesa y tu amante ideal.`,
      (d) => {
        const nat = fraseNacionalidad(d, POOLS.mujer);
        return `Hola mi amor, soy ${d.nombre}, una ninfómana de ${d.edad} años. ${cap(nat)}. Ven y descubre lo mojadita que me pongo pa ti.`;
      },
      (d) =>
        `${pick(SALUDOS_MUJER)}, soy ${d.nombre} (${d.edad}). Escort piola, fotos reales, disponible ahora en ${d.ciudad}. Quiero que me chupes y que me la metas rico.`,
      (d) => {
        const nat = fraseNacionalidad(d, POOLS.mujer);
        return `Hola bb, ${d.nombre} de ${d.edad} años al habla. ${cap(nat)}. Busco alguien con ganas de sexo oral baboso y una culiada sin apuro.`;
      },
      (d) =>
        `${pick(SALUDOS_MUJER)}, me presento: ${d.nombre}, ${d.edad} añitos, nalgona y complaciente. Te atiendo en ${d.ciudad} con cero tabúes y mucha saliva.`,
    ],
    cuerpos: [
      () =>
        "Trato de pololos: besos con lengua, masajes eróticos y baile sensual. Servicio bien porno, culo de infarto y pechos pa que te vuelvas loco.",
      () =>
        "Me encanta chupártela babosa hasta el fondo. Cuando esté toda mojadita, métela entera y hazme acabar. Quiero dejarte con uno de los mejores orgasmos.",
      () =>
        "Trato de novios con ricos besos, oral a garganta profunda y anal bien rico si te late. Lluvia dorada, beso negro y ganas de repetir.",
      () =>
        "Soy cariñosa, sensual y bien putita cuando hay que serlo. Caricias, bailes y sexo húmedo hasta que no aguantes más.",
      () =>
        "Cumplo fantasías: sexo salvaje con condón, gemidos reales, te monto o te dejo que me la metas como quieras. Entrega total.",
      () =>
        "Oral hasta el fondo en las poses que más te calienten. Quedo súper mojadita, ansiosa, sin tabúes y con mucha saliva.",
      () =>
        "Te lo chupo rico, te lo masajeo con las tetas y después te la meto yo. Sexo sin apuro, piola y a puro gusto.",
      () =>
        "Me gusta el 69, que me agarres el culo y que me hables sucio. Condón siempre, higiene piola y muchas ganas de que te corras rico.",
      () =>
        "Disponible pa hotel, motel o domicilio. Lencería sexy, oral profundo, penetración en distintas poses y cero apuro.",
      () =>
        "Si te gusta lo más explícito: te lo chupo entero, oral bien baboso, y seguimos hasta que quedes seco.",
    ],
    ubicaciones: [
      (d) => `Me ubico en ${d.ciudad}: tengo lugar propio y también salgo a domicilio, hotel o motel.`,
      (d) => `Estoy en ${d.ciudad}, ambiente discreto y cómodo, con lugar privado pa nosotros.`,
      (d) => `Me ubico en ${d.ciudad} y hago salidas a domicilio, hotel o motel cuando quieras.`,
      (d) => `Estoy de paso por ${d.ciudad}. Salgo cuando me avises y me traslado a hoteles.`,
      (d) => `Estoy en ${d.ciudad}, zona céntrica y piola, ideal pa un encuentro rico y discreto.`,
      (d) => `Atiendo en ${d.ciudad}: lugar propio limpio o me voy a donde estés tú.`,
      (d) => `En ${d.ciudad} te espero. Si prefieres, quedamos en motel o en tu depto, tú eliges.`,
    ],
    titulos: [
      (d) => `${d.nombre}, ${d.edad}a escort ${d.ciudad}`,
      (d) => `${d.nombre} | ${d.edad}a | ${d.ciudad}`,
      (d) => `Escort ${d.nombre} ${d.ciudad}`,
      (d) => `Ardiente ${d.nombre}, ${d.edad}a, ${d.ciudad}`,
      (d) => `${d.nombre} escort ${d.ciudad} ${d.edad}a`,
      (d) => `${d.nombre} ${d.edad}a nalgona ${d.ciudad}`,
      (d) => `Fogosa ${d.nombre} ${d.ciudad}`,
      (d) => `${d.nombre} rico sexo ${d.ciudad}`,
    ],
  },

  trans: {
    sinNacionalidad: [
      "soy una escort trans con cuerpo cuidado, energía y mucha calentura",
      "soy una transexual genuina, igualita a las fotos, sin engaños",
      "soy una trans bien dotada, ardiente y lista pa darte placer",
      "soy una linda escort trans nueva en tu ciudad pa cumplir fantasías",
      "me destaco por ser ardiente, atractiva y compañera ideal en la cama",
      "soy trans independiente, piola, nalgona y con ganas de culiar rico",
      "soy una trans lechera, oral profundo y activa o pasiva como te guste",
      "fotos 100% reales: trans fogosa, discreta y bien complaciente",
    ],
    conNacionalidad: (n) => [
      `soy una escort trans ${n} con mucha pasión y energía sexual`,
      `soy una hermosa trans ${n}, genuina, caliente y complaciente`,
      `me presento como escort trans ${n}: atractiva, fogosa y piola`,
      `soy trans ${n} bien dotada, lista pa un sexo filete contigo`,
    ],
    intros: [
      (d) =>
        `Hola, soy ${d.nombre}, escort trans de cuerpo cuidado y pura energía. Tengo ${d.edad} años y quiero darte una experiencia caliente, divertida y sin rollos.`,
      (d) =>
        `Hola, cariño, me llamo ${d.nombre}: transexual genuina, igualita a las fotos. ${d.edad} años, muy complaciente y lista pa tus fantasías.`,
      (d) =>
        `Hola, me llamo ${d.nombre}, trans bien dotada y ardiente. ${d.edad} años, atractiva y la compañera ideal pa un encuentro inolvidable.`,
      (d) =>
        `Hola, amor, soy ${d.nombre}, escort trans de ${d.edad} años en ${d.ciudad}. Piel suave, bien nalgona y piernona. Fotos auténticas, cero mentiras.`,
      (d) =>
        `Hola, soy tu ${d.nombre}, escort trans de ${d.edad} años con ganas de darte placer. Busco gente con buen gusto pa un rato caliente y cómplice.`,
      (d) =>
        `${pick(SALUDOS_TRANS)}, ${d.nombre} al habla (${d.edad}). Trans piola, oral baboso y activa/pasiva según te late. Disponible en ${d.ciudad}.`,
      (d) =>
        `Hola bb, soy ${d.nombre}, ${d.edad} añitos, trans fogosa y lechera. Quiero chupártela rico y que me la metas o te la meta yo.`,
    ],
    cuerpos: [
      () =>
        "Encuentros intensos, placer real y momentos bien calientes. Servicio seguro, discreto y sin vueltas.",
      () =>
        "Trato de pareja, oral con condón, 69 y lluvia dorada. Cambio de roles, anal con protección y eyaculación donde quieras. También contenido y videollamadas.",
      () =>
        "Cumplo fantasías en la cama: trato de pololos, bien cachonda y experta en oral de lujo. Puedes venirte donde te guste.",
      () =>
        "Me pones en la pose que quieras: nalgona, piernona, fotos reales. Discreta, con ganas y sin límites.",
      () =>
        "Experiencia caliente y auténtica. Independiente, higiene piola y muchas ganas de repetir contigo.",
      () =>
        "Te lo chupo entero, te monto o te penetro con condón. Activa, pasiva o versátil: tú mandas.",
      () =>
        "Oral profundo, besos, caricias y sexo bien rico. Si te late lo más explícito, también hago beso negro y lluvia dorada.",
      () =>
        "Disponible pa hotel o domicilio. Lencería, oral goloso, penetración y cero apuro. Quiero dejarte temblando.",
    ],
    ubicaciones: [
      (d) => `Estoy en ${d.ciudad}, con lugar discreto y privado pa nuestros encuentros.`,
      (d) => `Me ubico en ${d.ciudad}: salgo a hotel y domicilio cuando me avises.`,
      (d) => `Estoy en ${d.ciudad}, zona céntrica, espacio discreto y piola.`,
      (d) => `Me ubico en ${d.ciudad}. Estaré pocos días, así que escríbeme al tiro.`,
      (d) => `Atiendo en ${d.ciudad}: lugar propio o me voy a donde estés tú.`,
    ],
    titulos: [
      (d) => `Trans ${d.nombre} ${d.edad}a ${d.ciudad}`,
      (d) => `${d.nombre} trans ${d.ciudad}`,
      (d) => `Escort trans ${d.nombre} ${d.ciudad}`,
      (d) => `${d.nombre}, ${d.edad}a, ${d.ciudad}`,
      (d) => `${d.nombre} trans dotada ${d.ciudad}`,
      (d) => `Fogosa trans ${d.nombre} ${d.ciudad}`,
    ],
  },

  masculino: {
    sinNacionalidad: [
      "soy un escort hombre deportista, rico, con actitud y carisma",
      "soy un escort alto y varonil, presencia segura y trato piola",
      "soy un escort serio y versátil, listo pa un espacio de pleno placer",
      "quiero ser tu chico de compañía: exclusivo, activo y discreto",
      "soy un escort mulato con presencia fuerte y personalidad decidida",
      "me considero apasionado, entregado y bien caliente en la intimidad",
      "soy hombre independiente, vergón, higiene piola y cero rollos",
      "soy escort fitness, activo, discreto y con ganas de culiar rico",
    ],
    conNacionalidad: (n) => [
      `soy un escort hombre ${n}, deportista y con excelente actitud`,
      `me presento como escort hombre ${n}: varonil, discreto y caliente`,
      `soy un ${n} activo, educado e impecable, listo pa complacerte`,
      `soy escort ${n}, vergón, piola y con ganas de darte rico sexo`,
    ],
    intros: [
      (d) =>
        `Hola, me presento: ${d.nombre}, escort hombre de ${d.edad} años, deportista y con carisma. Apasionado y entregado pa cumplir lo que se te ocurra.`,
      (d) =>
        `Hola, me llamo ${d.nombre}: escort hombre alto y varonil de ${d.edad} años. Seguridad, elegancia y masculinidad desde el primer momento.`,
      (d) =>
        `${pick(SALUDOS_MASC)}, me llamo ${d.nombre}, escort hombre serio y versátil de ${d.edad} años. Trato masculino, directo y con total discreción.`,
      (d) =>
        `Hola, soy ${d.nombre}, tu chico de compañía de ${d.edad} años, 100% exclusivo. Activo, discreto, educado e impecable.`,
      (d) =>
        `Hola, me llamo ${d.nombre}, escort hombre de ${d.edad} años en ${d.ciudad}. Presencia fuerte y ganas de un encuentro inolvidable.`,
      (d) =>
        `Buenas, ${d.nombre} al habla (${d.edad}). Hombre piola, vergón y disponible ahora en ${d.ciudad}. Sexo rico, sin vueltas.`,
      (d) =>
        `Hola, soy ${d.nombre}, ${d.edad} años, escort activo/versátil. Te atiendo con higiene, condón y muchas ganas de hacerte acabar.`,
    ],
    cuerpos: [
      () =>
        "Cumplo fantasías íntimas: anal jugoso en varias poses, bien delicioso. Bailes, trato de pololos y siempre con higiene.",
      () =>
        "Penetración profunda, masajes sensuales y fantasías compartidas. Sé cómo hacerte sentir deseada y bien satisfecha.",
      () =>
        "Trato de pareja con ricos besos, caricias, penetración y oral jugoso. Sexo seguro y confidencialidad total.",
      () =>
        "Experiencia exclusiva: cenas, eventos, viajes o privado. Masajes ricos, atiendo parejas y vendo contenido si quieres.",
      () =>
        "Activo, siempre con protección. Atiendo mujeres, parejas o pasivos. Vergón, discreto y con ganas de romper la rutina.",
      () =>
        "Te lo chupo rico, te la meto con condón y te dejo temblando. Sin apuro, piola y a puro gusto.",
      () =>
        "Oral profundo, 69, distintas poses y gemidos reales. Si te late lo más explícito, también hago anal y lluvia dorada.",
      () =>
        "Disponible pa hotel o domicilio. Fitness, energía y entrega total. Quiero que te corras rico más de una vez.",
    ],
    ubicaciones: [
      (d) => `Me ubico en ${d.ciudad}, zona céntrica: avísame y nos encontramos.`,
      (d) => `Estoy en ${d.ciudad}, con departamento privado, ambiente piola y relajado.`,
      (d) => `Me ubico en ${d.ciudad}, sector bien conectado, listo pa coordinar contigo.`,
      (d) => `Recién llegué a ${d.ciudad}: tengo lugar propio y también salgo a hotel o domicilio.`,
      (d) => `Atiendo en ${d.ciudad}: tú eliges si quedamos en mi lugar, hotel o donde estés.`,
    ],
    titulos: [
      (d) => `${d.nombre} hombre ${d.edad}a ${d.ciudad}`,
      (d) => `Escort ${d.nombre} ${d.ciudad}`,
      (d) => `${d.nombre}, ${d.edad}a, ${d.ciudad}`,
      (d) => `Hombre ${d.nombre} ${d.ciudad}`,
      (d) => `${d.nombre} vergón ${d.ciudad}`,
      (d) => `Activo ${d.nombre} ${d.edad}a ${d.ciudad}`,
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
