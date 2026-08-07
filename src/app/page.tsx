import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { listarSitios } from "@/lib/sitios";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, getKeywords } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: `${SITE_NAME} — Avisos destacados en Chile`,
  description: SITE_DESCRIPTION,
  keywords: getKeywords(),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Avisos destacados en Chile`,
    description: SITE_DESCRIPTION,
  },
};

export default async function Home() {
  const sitios = await listarSitios();

  return (
    <main className="app app--fill">
      <div className="home">
        <div className="home-avatar">
          <Image
            src="/perfil-agencia.png"
            alt="Agencia de Publicaciones para Escort"
            width={128}
            height={128}
            className="home-avatar__img"
            priority
          />
        </div>
        <div className="big">
          Agencia de Publicaciones
          <br />
          para Escort
        </div>
        <p className="home-since">Desde 2015 en el rubro</p>
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
              <div
                key={s.slug}
                className={`scard off${s.slug === "gemidos" ? " scard--gemidos" : ""}`}
              >
                <span className="slogo" style={{ color: s.color }}>
                  {s.nombre}
                </span>
                <span className="sdom">{s.dominio}</span>
                <span className="soon">{s.mensajePronto ?? "Pronto"}</span>
              </div>
            )
          )}
        </div>
      </div>

      <footer className="foot">{SITE_NAME} · Catálogo de avisos destacados en Chile</footer>
    </main>
  );
}
