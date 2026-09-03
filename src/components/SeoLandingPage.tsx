import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import SiteFooter from "@/components/SiteFooter";
import { SITE_NAME, SITE_URL, getKeywords, organizationJsonLd } from "@/lib/seo";
import { PUBLICIDAD_LANDINGS } from "@/lib/seo-regiones";

const SITIOS_LINKS = [
  { href: "/skokka", nombre: "Skokka", desc: "TOP, Súper Top y All in One por franjas" },
  { href: "/locanto", nombre: "Locanto", desc: "TOP y Galería · 7 días" },
  { href: "/chimbis", nombre: "Chimbis", desc: "Santiago/RM o regiones · subidas" },
  { href: "/escorcitas", nombre: "Escorcitas", desc: "TOP, PREMIUM y GOLD" },
  { href: "/simpleescort", nombre: "SimpleEscorts", desc: "Super Turbo 5X por horario" },
  { href: "/wenas", nombre: "Wenas", desc: "Plan VIP 7, 15 o 30 días" },
  { href: "/gemidos", nombre: "Gemidos.tv", desc: "Classic a Black Rose" },
] as const;

type LandingKind = "publicaciones" | "anuncios" | "donde";

const COPY: Record<
  LandingKind,
  {
    path: string;
    title: string;
    description: string;
    h1: string;
    intro: string[];
    faqs: { q: string; a: string }[];
  }
> = {
  publicaciones: {
    path: "/publicaciones-escort-chile",
    title: "Publicaciones escort Chile | Publiescort y avisos destacados",
    description:
      "Publicaciones escort y publiescort en todo Chile. Cotiza anuncios escort en Skokka, Locanto, Chimbis, Escorcitas, SimpleEscorts, Wenas y Gemidos. Agencia desde 2015.",
    h1: "Publicaciones escort en Chile",
    intro: [
      "Somos una agencia de publicaciones escort y publicidad para escort (publiescort) en todo Chile. Cotizas el aviso, te armamos el texto que vende y publicamos o destacamos en las páginas que más llaman.",
      "Trabajamos Skokka, Locanto, Chimbis, Escorcitas, SimpleEscorts, Wenas y Gemidos. Atendemos sur, centro-sur y regiones: Puerto Montt, Concepción, Temuco, Rancagua y más.",
    ],
    faqs: [
      {
        q: "¿Qué incluye una publicación escort con ustedes?",
        a: "Cotización clara, textos/títulos orientados a vender, opción de difuminar rostro o cubrir tatuajes, y el destacados en la página que elijas (o un pack de varias).",
      },
      {
        q: "¿Publican en todo Chile?",
        a: "Sí. Atendemos Santiago/RM y regiones. En páginas como Chimbis el precio cambia según zona; en el asistente de promociones lo eliges al armar el pack.",
      },
      {
        q: "¿Hacen arriendo de habitaciones o piezas?",
        a: "No. Solo publicaciones y anuncios destacados. Si buscas “habitaciones para escort” o “piezas para escort”, te ayudamos a publicar en las páginas correctas; no arrendamos alcobas.",
      },
    ],
  },
  anuncios: {
    path: "/anuncios-escort-chile",
    title: "Anuncios escort Chile | Cotiza y publica en las mejores páginas",
    description:
      "Anuncios escort en Chile con precio al instante. Publicamos y destacamos tu aviso en Skokka, Locanto, Chimbis y más. Textos que venden y packs por presupuesto.",
    h1: "Anuncios escort en Chile",
    intro: [
      "Si buscas anuncios escort o publicidad escort en Chile con precio al tiro, aquí cotizas página por página o armas una promoción según tu presupuesto.",
      "Desde 2015 ayudamos a publicar y destacar avisos: Skokka, Locanto, Chimbis, Escorcitas, SimpleEscorts, Wenas y Gemidos. WhatsApp listo cuando elijas el pack.",
    ],
    faqs: [
      {
        q: "¿Cómo cotizo un anuncio escort?",
        a: "Entra al cotizador de cada página, marca horarios/días/plan y ves el total. O usa “Armar promoción” si quieres varias páginas con un presupuesto.",
      },
      {
        q: "¿Puedo ver todos los valores antes?",
        a: "Sí. Cada sitio tiene tabla o flyers de valores (por ejemplo Skokka con imágenes por pack). También hay guía completa de cómo funciona cada página.",
      },
      {
        q: "¿Sirve para Santiago y regiones?",
        a: "Sí. Cubrimos todo Chile. Indica zona cuando el asistente lo pide (especialmente Chimbis).",
      },
    ],
  },
  donde: {
    path: "/donde-publicar-escort-chile",
    title: "Dónde publicar escort en Chile | Skokka, Locanto, Chimbis y más",
    description:
      "Guía para elegir dónde publicar escort en Chile: Skokka, Locanto, Chimbis, Escorcitas, SimpleEscorts, Wenas, Gemidos y el panorama del mercado (Alcoba, Comunidad Escort).",
    h1: "Dónde publicar escort en Chile",
    intro: [
      "Elegir dónde publicar depende de tu zona, presupuesto y estilo de aviso. Nosotros cotizamos y publicamos en las páginas de anuncios más usadas en Chile.",
      "Abajo tienes el mapa rápido. Si ya sabes la página, cotiza al tiro. Si no, arma un pack por presupuesto.",
    ],
    faqs: [
      {
        q: "¿Skokka, Locanto o Chimbis: cuál me conviene?",
        a: "Depende de tu ciudad, horarios y plata. Skokka brilla con franjas y subidas; Locanto suele ser pack de 7 días; Chimbis diferencia Santiago/RM vs regiones. Cotiza las tres y compara.",
      },
      {
        q: "¿Qué pasa con Alcoba.cl o ComunidadEscort.cl?",
        a: "Son sitios del mercado (habitaciones/comunidad u otros servicios). Nosotros no somos Alcoba ni Comunidad Escort: somos agencia de publicaciones y anuncios destacados. Si tu objetivo es publicar/avisar, cotiza aquí.",
      },
      {
        q: "¿Puedo publicar en varias páginas a la vez?",
        a: "Sí. En Armar promoción eliges presupuesto, días, zona y mínimo 2 páginas; te mostramos opciones de pack para mandar por WhatsApp.",
      },
    ],
  },
};

export function metadataLanding(kind: LandingKind): Metadata {
  const c = COPY[kind];
  return {
    title: c.title,
    description: c.description,
    keywords: getKeywords(),
    alternates: { canonical: c.path },
    openGraph: {
      type: "article",
      locale: "es_CL",
      url: `${SITE_URL}${c.path}`,
      siteName: SITE_NAME,
      title: c.title,
      description: c.description,
    },
    twitter: { card: "summary_large_image", title: c.title, description: c.description },
  };
}

export default function SeoLandingPage({ kind }: { kind: LandingKind }) {
  const c = COPY[kind];

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: c.h1,
        item: `${SITE_URL}${c.path}`,
      },
    ],
  };

  return (
    <main className="app page-sitio page-seo-landing">
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={faqLd} />
      <JsonLd data={breadcrumbLd} />

      <header className="anuncios-hdr">
        <div>
          <Link href="/" className="logo">
            {SITE_NAME}
          </Link>
          <span className="dom">publicacionesescort.cl</span>
        </div>
        <Link className="switch" href="/">
          Inicio
        </Link>
      </header>

      <article className="anuncios-article seo-landing">
        <h1 className="anuncios-title">{c.h1}</h1>
        {c.intro.map((p) => (
          <p key={p.slice(0, 40)} className="anuncios-intro">
            {p}
          </p>
        ))}

        <div className="seo-landing__cta-row">
          <Link href="/promociones" className="valores-cta__btn">
            Armar promoción
          </Link>
          <Link href="/skokka" className="seo-landing__link-btn">
            Cotizar Skokka
          </Link>
        </div>

        <section className="anuncios-block">
          <h2 className="anuncios-h2">Publicidad escort por región</h2>
          <ul className="seo-regiones__list">
            {PUBLICIDAD_LANDINGS.filter((l) => l.slug !== "chile").map((r) => (
              <li key={r.slug}>
                <Link href={r.path} className="seo-regiones__card">
                  <strong>{r.regionLabel}</strong>
                  <span>{r.cities.join(" · ")}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="seo-landing__region-more">
            <Link href="/publicidad-escort-chile">Guía completa de publicidad escort en Chile →</Link>
          </p>
        </section>

        <section className="anuncios-block">
          <h2 className="anuncios-h2">Páginas donde publicamos</h2>
          <ul className="seo-landing__sitios">
            {SITIOS_LINKS.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="seo-landing__sitio">
                  <strong>{s.nombre}</strong>
                  <span>{s.desc}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {kind === "donde" && (
          <section className="anuncios-block">
            <h2 className="anuncios-h2">Panorama del mercado en Chile</h2>
            <p className="anuncios-intro">
              Además de las páginas de anuncios destacados, en Chile existen otros nombres que la
              gente busca: <b>Alcoba</b> / alcoba.cl (más asociado a habitaciones o piezas) y{" "}
              <b>Comunidad Escort</b> / comunidadescort.cl. Si lo que necesitas es{" "}
              <b>publicar o destacar un anuncio</b>, el camino es cotizar aquí en
              publicacionesescort.cl — no somos esas marcas; somos la agencia que te arma el aviso.
            </p>
          </section>
        )}

        <section className="anuncios-block">
          <h2 className="anuncios-h2">Preguntas frecuentes</h2>
          <dl className="seo-landing__faq">
            {c.faqs.map((f) => (
              <div key={f.q} className="seo-landing__faq-item">
                <dt>{f.q}</dt>
                <dd>{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <p className="valores-cta">
          <Link href="/promociones" className="valores-cta__btn">
            Empezar con mi presupuesto
          </Link>
        </p>

        <p className="seo-landing__more">
          <Link href="/publicidad-escort-chile">Publicidad escort Chile</Link>
          {" · "}
          <Link href="/publicaciones-escort-chile">Publicaciones escort Chile</Link>
          {" · "}
          <Link href="/anuncios-escort-chile">Anuncios escort Chile</Link>
          {" · "}
          <Link href="/donde-publicar-escort-chile">Dónde publicar</Link>
        </p>
      </article>

      <SiteFooter note={<Link href="/">Ver sitios para cotizar</Link>} />
    </main>
  );
}
