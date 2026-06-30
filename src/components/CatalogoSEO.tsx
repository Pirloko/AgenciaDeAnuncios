import type { Sitio } from "@/types/sitio";

// FAQ server-rendered para que Google indexe las preguntas y respuestas.
export default function CatalogoSEO({ sitio }: { sitio: Sitio }) {
  if (!sitio.faq.length) return null;

  return (
    <section className="seo" aria-label={`Preguntas frecuentes sobre avisos destacados en ${sitio.nombre}`}>
      <div className="card faq">
        <h2>Preguntas frecuentes</h2>
        <dl>
          {sitio.faq.map((f, i) => (
            <div key={i}>
              <dt>{f.q}</dt>
              <dd>{f.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
