import { Fragment } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EjemploAviso } from "@/components/EjemploAviso";
import JsonLd from "@/components/JsonLd";
import {
  ejemplosVisualesSitio,
  faqAnchorId,
  esAnunciosSitio,
  type AnunciosSitioSlug,
} from "@/lib/anuncios-seo";
import { obtenerSitio } from "@/lib/sitios";
import { SITE_NAME, SITE_URL, getKeywords } from "@/lib/seo";

export async function metadataAnuncios(sitioSlug: AnunciosSitioSlug): Promise<Metadata> {
  const sitio = await obtenerSitio(sitioSlug);
  if (!sitio) return {};

  const title = `Guía de avisos destacados en ${sitio.nombre}`;
  const description = `${sitio.descripcion[0] ?? ""} Preguntas frecuentes y ejemplos visuales.`.slice(
    0,
    160
  );

  return {
    title,
    description,
    keywords: getKeywords(sitioSlug),
    alternates: { canonical: `/anuncios-${sitioSlug}` },
    openGraph: {
      type: "article",
      locale: "es_CL",
      url: `${SITE_URL}/anuncios-${sitioSlug}`,
      siteName: SITE_NAME,
      title,
      description,
    },
  };
}

export default async function PaginaAnunciosSEO({
  sitioSlug,
}: {
  sitioSlug: AnunciosSitioSlug;
}) {
  if (!esAnunciosSitio(sitioSlug)) notFound();

  const sitio = await obtenerSitio(sitioSlug);
  if (!sitio || !sitio.disponible) notFound();

  const ejemplos = ejemplosVisualesSitio(sitioSlug);
  const brandStyle = {
    "--brand": sitio.color,
    "--brand-soft": sitio.color + "1f",
    "--accent": sitio.accent,
  } as React.CSSProperties;

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: sitio.faq.map((f) => ({
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
      { "@type": "ListItem", position: 2, name: sitio.nombre, item: `${SITE_URL}/${sitioSlug}` },
      {
        "@type": "ListItem",
        position: 3,
        name: "Guía de avisos",
        item: `${SITE_URL}/anuncios-${sitioSlug}`,
      },
    ],
  };

  return (
    <main className="app page-sitio page-anuncios" style={brandStyle}>
      <JsonLd data={faqLd} />
      <JsonLd data={breadcrumbLd} />

      <header className="anuncios-hdr">
        <div>
          <span className="logo">{sitio.nombre}</span>{" "}
          <span className="dom">{sitio.dominio}</span>
        </div>
        <Link className="switch" href={`/${sitioSlug}`}>
          Cotizar
        </Link>
      </header>

      <article className="anuncios-article">
        <h1 className="anuncios-title">Avisos destacados en {sitio.nombre}</h1>
        {sitio.descripcion.map((p, i) => (
          <p key={i} className="anuncios-intro">
            {p}
          </p>
        ))}

        {ejemplos.length > 0 && (
          <section className="anuncios-block" aria-labelledby="ejemplos-titulo">
            <h2 id="ejemplos-titulo" className="anuncios-h2">
              Así se ven en el listado
            </h2>
            <div className="anuncios-ejemplos">
              {ejemplos.map((ej) => (
                <EjemploAviso
                  key={ej.src}
                  src={ej.src}
                  alt={ej.alt}
                  label={ej.label}
                  width={ej.width}
                  height={ej.height}
                />
              ))}
            </div>
          </section>
        )}

        <section className="anuncios-block" aria-labelledby="faq-titulo">
          <h2 id="faq-titulo" className="anuncios-h2">
            Preguntas frecuentes
          </h2>
          <dl className="faq faq--anuncios">
            {sitio.faq.map((f, i) => {
              const id = faqAnchorId(f.q, i);
              return (
                <Fragment key={id}>
                  <dt id={id} className="faq-seo-section">
                    {f.q}
                  </dt>
                  <dd>{f.a}</dd>
                </Fragment>
              );
            })}
          </dl>
        </section>

        <p className="anuncios-cta">
          <Link href={`/${sitioSlug}`} className="anuncios-cta__btn">
            Cotizar mi aviso en {sitio.nombre}
          </Link>
        </p>
      </article>

      <footer className="foot">
        <Link href="/">Ver otros sitios</Link>
      </footer>
    </main>
  );
}
