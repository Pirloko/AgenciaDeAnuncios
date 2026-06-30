import Link from "next/link";
import { listarSitios } from "@/lib/sitios";
import { SITE_NAME } from "@/lib/seo";

export const revalidate = 3600;

export default async function Home() {
  const sitios = await listarSitios();

  return (
    <main className="app app--fill">
      <div className="home">
        <div className="big">
          Cotiza tu aviso
          <br />
          destacado al toque
        </div>
        <p className="lead">
          Elegí el sitio, respondé unas preguntas simples y te mostramos el precio. Sin vueltas.
        </p>

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
                <span className="soon">Pronto</span>
              </div>
            )
          )}
        </div>
      </div>

      <footer className="foot">{SITE_NAME} · Catálogo de avisos destacados en Chile</footer>
    </main>
  );
}
