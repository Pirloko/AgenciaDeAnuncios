import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { TablaValoresPorSitio } from "@/components/TablasValores";
import { obtenerSitio } from "@/lib/sitios";
import { SITE_NAME, SITE_URL, getKeywords } from "@/lib/seo";
import { esValoresSitio, rutaValores, VALORES_INTRO, type ValoresSitioSlug } from "@/lib/valores-seo";
import { esAnunciosSitio, rutaAnuncios } from "@/lib/anuncios-seo";
import {
  aplicarPromosSkokkaASitio,
  cargarPromosSkokkaPublicas,
} from "@/lib/promos-pagina-skokka";
import {
  cargarPreciosPublicos,
  mapaPreciosPorSitio,
} from "@/lib/precios-publicos";

export async function metadataValores(sitioSlug: ValoresSitioSlug): Promise<Metadata> {
  const sitio = await obtenerSitio(sitioSlug);
  if (!sitio) return {};

  const title = `Todos los valores de avisos destacados en ${sitio.nombre}`;
  const description =
    `Tabla completa de precios en ${sitio.nombre}: planes, días y modalidades. ${sitio.descripcion[0] ?? ""}`.slice(
      0,
      160
    );

  return {
    title,
    description,
    keywords: getKeywords(sitioSlug),
    alternates: { canonical: rutaValores(sitioSlug) },
    openGraph: {
      type: "article",
      locale: "es_CL",
      url: `${SITE_URL}${rutaValores(sitioSlug)}`,
      siteName: SITE_NAME,
      title,
      description,
    },
  };
}

export default async function PaginaValores({
  sitioSlug,
}: {
  sitioSlug: ValoresSitioSlug;
}) {
  if (!esValoresSitio(sitioSlug)) notFound();

  const sitioBase = await obtenerSitio(sitioSlug);
  if (!sitioBase || !sitioBase.disponible) notFound();

  const preciosRows = await cargarPreciosPublicos();
  const preciosAdmin = mapaPreciosPorSitio(preciosRows, sitioSlug);
  const sitio =
    sitioSlug === "skokka"
      ? aplicarPromosSkokkaASitio(sitioBase, await cargarPromosSkokkaPublicas())
      : sitioBase;
  const hasAdmin = Object.keys(preciosAdmin).length > 0;

  const brandStyle = {
    "--brand": sitio.color,
    "--brand-soft": sitio.color + "1f",
    "--accent": sitio.accent,
  } as React.CSSProperties;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: sitio.nombre, item: `${SITE_URL}/${sitioSlug}` },
      {
        "@type": "ListItem",
        position: 3,
        name: "Valores",
        item: `${SITE_URL}${rutaValores(sitioSlug)}`,
      },
    ],
  };

  return (
    <main className="app page-sitio page-valores seo" style={brandStyle}>
      <JsonLd data={breadcrumbLd} />

      <header className="valores-hdr">
        <div>
          <span className="logo">{sitio.nombre}</span>{" "}
          <span className="dom">{sitio.dominio}</span>
        </div>
        <Link className="switch" href={`/${sitioSlug}`}>
          Cotizar
        </Link>
      </header>

      <article className="valores-article">
        <h1 className="valores-title">Valores en {sitio.nombre}</h1>
        <p className="valores-intro">
          {VALORES_INTRO[sitioSlug]} Si ya sabes qué quieres, el{" "}
          <Link href={`/${sitioSlug}`}>cotizador</Link> te da el precio exacto al tiro.
        </p>

        <TablaValoresPorSitio
          slug={sitioSlug}
          sitio={sitio}
          preciosAdmin={hasAdmin ? preciosAdmin : null}
        />

        {esAnunciosSitio(sitioSlug) && (
          <p className="guia-completa guia-completa--valores">
            <Link href={rutaAnuncios(sitioSlug)}>
              Ver guía completa de cómo funciona {sitio.nombre}
            </Link>
          </p>
        )}

        <p className="valores-cta">
          <Link href={`/${sitioSlug}`} className="valores-cta__btn">
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
