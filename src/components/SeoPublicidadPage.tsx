import Link from "next/link";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import SiteFooter from "@/components/SiteFooter";
import type { PublicidadLanding } from "@/lib/seo-regiones";
import { PUBLICIDAD_LANDINGS } from "@/lib/seo-regiones";
import { SITE_NAME, SITE_URL, getKeywords, organizationJsonLd } from "@/lib/seo";

const SITIOS_LINKS = [
  { href: "/skokka", nombre: "Skokka" },
  { href: "/chimbis", nombre: "Chimbis" },
  { href: "/escorcitas", nombre: "Escorcitas" },
  { href: "/locanto", nombre: "Locanto" },
  { href: "/wenas", nombre: "Wenas" },
  { href: "/gemidos", nombre: "Gemidos.tv" },
] as const;

export function metadataPublicidad(landing: PublicidadLanding): Metadata {
  return {
    title: landing.title,
    description: landing.description,
    keywords: getKeywords(),
    alternates: { canonical: landing.path },
    openGraph: {
      type: "article",
      locale: "es_CL",
      url: `${SITE_URL}${landing.path}`,
      siteName: SITE_NAME,
      title: landing.title,
      description: landing.description,
    },
    twitter: {
      card: "summary_large_image",
      title: landing.title,
      description: landing.description,
    },
  };
}

export default function SeoPublicidadPage({ landing }: { landing: PublicidadLanding }) {
  const otrasRegiones = PUBLICIDAD_LANDINGS.filter(
    (l) => l.slug !== landing.slug && l.slug !== "chile"
  );

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: landing.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Publicidad escort — ${landing.regionLabel}`,
    provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    areaServed:
      landing.cities.length > 0
        ? landing.cities.map((city) => ({ "@type": "City", name: city, containedInPlace: "Chile" }))
        : { "@type": "Country", name: "Chile" },
    description: landing.description,
    url: `${SITE_URL}${landing.path}`,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Publicidad escort Chile",
        item: `${SITE_URL}/publicidad-escort-chile`,
      },
      ...(landing.slug !== "chile"
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: landing.h1,
              item: `${SITE_URL}${landing.path}`,
            },
          ]
        : []),
    ],
  };

  return (
    <main className="app page-sitio page-seo-landing">
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={faqLd} />
      <JsonLd data={serviceLd} />
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
        <h1 className="anuncios-title">{landing.h1}</h1>
        {landing.intro.map((p) => (
          <p key={p.slice(0, 48)} className="anuncios-intro">
            {p}
          </p>
        ))}
        <p className="anuncios-intro anuncios-intro--highlight">{landing.destacado}</p>

        {landing.cities.length > 0 && (
          <section className="anuncios-block">
            <h2 className="anuncios-h2">Ciudades que atendemos en {landing.regionLabel}</h2>
            <ul className="seo-ciudades__tags">
              {landing.cities.map((city) => (
                <li key={city}>
                  <span className="seo-ciudades__tag">{city}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="seo-landing__cta-row">
          <Link href="/promociones" className="valores-cta__btn">
            Armar promoción
          </Link>
          <Link href="/skokka" className="seo-landing__link-btn">
            Cotizar Skokka
          </Link>
        </div>

        <section className="anuncios-block">
          <h2 className="anuncios-h2">Páginas donde publicamos</h2>
          <ul className="seo-landing__sitios">
            {SITIOS_LINKS.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="seo-landing__sitio">
                  <strong>{s.nombre}</strong>
                  <span>Publicidad y avisos destacados</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {landing.slug === "chile" && (
          <section className="anuncios-block">
            <h2 className="anuncios-h2">Publicidad escort por región</h2>
            <ul className="seo-regiones__list">
              {otrasRegiones.map((r) => (
                <li key={r.slug}>
                  <Link href={r.path} className="seo-regiones__card">
                    <strong>{r.regionLabel}</strong>
                    <span>{r.cities.join(" · ")}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="anuncios-block">
          <h2 className="anuncios-h2">Preguntas frecuentes</h2>
          <dl className="seo-landing__faq">
            {landing.faqs.map((f) => (
              <div key={f.q} className="seo-landing__faq-item">
                <dt>{f.q}</dt>
                <dd>{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <p className="valores-cta">
          <Link href="/promociones" className="valores-cta__btn">
            Cotizar con mi presupuesto
          </Link>
        </p>

        <p className="seo-landing__more">
          <Link href="/publicidad-escort-chile">Publicidad escort Chile</Link>
          {" · "}
          <Link href="/publicaciones-escort-chile">Publicaciones escort</Link>
          {" · "}
          <Link href="/anuncios-escort-chile">Anuncios escort</Link>
          {" · "}
          <Link href="/donde-publicar-escort-chile">Dónde publicar</Link>
        </p>
      </article>

      <SiteFooter note={<Link href="/">Ver cotizadores</Link>} />
    </main>
  );
}
