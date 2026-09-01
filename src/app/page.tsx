import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import HomeBannerCarousel from "@/components/HomeBannerCarousel";
import JsonLd from "@/components/JsonLd";
import { listarSitios } from "@/lib/sitios";
import {
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_URL,
  SITE_LOGO,
  getKeywords,
  organizationJsonLd,
} from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: {
    absolute: `${SITE_NAME} — Publicaciones y anuncios escort en Chile`,
  },
  description: SITE_DESCRIPTION,
  keywords: getKeywords(),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Publicaciones y anuncios escort en Chile`,
    description: SITE_DESCRIPTION,
    images: [{ url: SITE_LOGO, width: 1080, height: 1080, alt: SITE_NAME }],
  },
};

export default async function Home() {
  const sitios = await listarSitios();

  return (
    <main className="app app--fill">
      <JsonLd data={organizationJsonLd()} />
      <HomeBannerCarousel />
      <div className="home">
        <div className="home-avatar">
          <Image
            src="/logo-agencia.png"
            alt="Publicaciones Escort Chile — agencia de anuncios destacados"
            width={128}
            height={128}
            className="home-avatar__img"
            priority
          />
        </div>
        <h1 className="big">
          Publicaciones escort
          <br />
          en Chile
        </h1>
        <p className="home-since">Desde 2015 · publicacionesescort.cl</p>
        <p className="lead">
          ¿Sin título ni textos? Te creamos uno que <b>vende</b>. Difuminamos o tapamos rostro y
          cubrimos tatuajes si lo necesitas.
        </p>
        <p className="home-cta">
          Toca el sitio, define tu aviso y te damos el precio al instante.
        </p>

        <Link href="/promociones" className="scard scard--promo">
          <span className="scard--promo__text">
            <span className="scard--promo__q">¿Cuánto dinero tienes?</span>
            <span className="scard--promo__q">¿Necesitas una promoción?</span>
            <span className="scard--promo__cta">Entra aquí</span>
          </span>
          <span className="go" aria-hidden="true">
            →
          </span>
        </Link>

        <div className="sitecards">
          {sitios.map((s) =>
            s.disponible ? (
              <Link key={s.slug} href={`/${s.slug}`} className="scard">
                <span className="slogo" style={{ color: s.color }}>
                  {s.nombre}
                </span>
                <span className="sdom">{s.dominio}</span>
                <span className="go">→</span>
              </Link>
            ) : (
              <div key={s.slug} className="scard off">
                <span className="slogo" style={{ color: s.color }}>
                  {s.nombre}
                </span>
                <span className="sdom">{s.dominio}</span>
                <span className="soon">{s.mensajePronto ?? "Pronto"}</span>
              </div>
            )
          )}
        </div>

        <nav className="home-seo-links" aria-label="Guías de publicaciones escort">
          <Link href="/publicaciones-escort-chile">Publicaciones escort Chile</Link>
          <Link href="/anuncios-escort-chile">Anuncios escort Chile</Link>
          <Link href="/donde-publicar-escort-chile">Dónde publicar</Link>
        </nav>
      </div>

      <footer className="foot">
        {SITE_NAME} · Publiescort y avisos destacados en todo Chile
      </footer>
    </main>
  );
}
