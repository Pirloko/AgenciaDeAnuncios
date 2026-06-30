import { Fragment } from "react";
import Link from "next/link";
import type { Sitio } from "@/types/sitio";
import { esAnunciosSitio, rutaAnuncios } from "@/lib/anuncios-seo";
import FaqAcordeon from "@/components/FaqAcordeon";

// FAQ compacto en el cotizador; el detalle + ejemplos viven en /anuncios-{sitio}.
export default function CatalogoSEO({ sitio }: { sitio: Sitio }) {
  if (!sitio.faq.length) return null;

  const tieneGuia = esAnunciosSitio(sitio.slug);

  return (
    <section className="seo" aria-label={`Preguntas frecuentes sobre avisos destacados en ${sitio.nombre}`}>
      {tieneGuia && (
        <p className="guia-completa">
          <Link href={rutaAnuncios(sitio.slug)}>
            Ver guía completa de cómo funciona {sitio.nombre}
          </Link>
        </p>
      )}

      {tieneGuia ? (
        <FaqAcordeon sitioSlug={sitio.slug} faq={sitio.faq} />
      ) : (
        <div className="card faq">
          <h2>Preguntas frecuentes</h2>
          <dl>
            {sitio.faq.map((f, i) => (
              <Fragment key={i}>
                <dt>{f.q}</dt>
                <dd>{f.a}</dd>
              </Fragment>
            ))}
          </dl>
        </div>
      )}
    </section>
  );
}
