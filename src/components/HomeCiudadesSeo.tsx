import Link from "next/link";
import { PUBLICIDAD_LANDINGS } from "@/lib/seo-regiones";

export default function HomeCiudadesSeo() {
  const regiones = PUBLICIDAD_LANDINGS.filter((l) => l.slug !== "chile");

  return (
    <section className="home-ciudades" aria-label="Publicidad escort por región en Chile">
      <h2 className="home-ciudades__title">Publicidad para escort en todo Chile</h2>
      <p className="home-ciudades__lead">
        Cotizamos <b>publicidad para escort</b> desde 2015. Atendemos sur, centro-sur y regiones:
      </p>
      <ul className="home-ciudades__regiones">
        {regiones.map((r) => (
          <li key={r.slug}>
            <Link href={r.path} className="home-ciudades__region">
              <span className="home-ciudades__region-name">{r.regionLabel}</span>
              <span className="home-ciudades__region-cities">{r.cities.join(" · ")}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="home-ciudades__more">
        <Link href="/publicidad-para-escort">Guía de publicidad para escort →</Link>
      </p>
    </section>
  );
}
