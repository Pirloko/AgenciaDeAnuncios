import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Cotizador from "@/components/Cotizador";
import CotizadorChimbis from "@/components/CotizadorChimbis";
import CotizadorLocanto from "@/components/CotizadorLocanto";
import CotizadorSimpleEscort from "@/components/CotizadorSimpleEscort";
import CatalogoSEO from "@/components/CatalogoSEO";
import JsonLd from "@/components/JsonLd";
import { obtenerSitio, listarSlugs } from "@/lib/sitios";
import { planLabel } from "@/lib/precios";
import {
  iterarOfertasChimbis,
  CHIMBIS_REGION_LABEL,
  nombrePlanChimbis,
} from "@/lib/chimbis";
import { iterarOfertasLocanto, LOCANTO_DIAS } from "@/lib/locanto";
import { iterarOfertasSimpleEscort } from "@/lib/simpleescort";
import { SITE_NAME, SITE_URL, getKeywords, SEO_OVERRIDES } from "@/lib/seo";

export const revalidate = 3600; // refresca precios desde Supabase cada hora

export async function generateStaticParams() {
  const slugs = await listarSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sitio = await obtenerSitio(slug);
  if (!sitio) return {};

  const ov = SEO_OVERRIDES[slug] ?? {};
  const title =
    ov.title ?? `Precios de avisos destacados en ${sitio.nombre} (TOP, Súper Top, All in One)`;
  const description =
    ov.description ??
    `Cotiza tu aviso destacado en ${sitio.nombre} en segundos. ${sitio.descripcion[0] ?? ""}`.slice(0, 160);

  return {
    title,
    description,
    keywords: getKeywords(slug),
    alternates: { canonical: `/${slug}` },
    openGraph: {
      type: "website",
      locale: "es_CL",
      url: `${SITE_URL}/${slug}`,
      siteName: SITE_NAME,
      title,
      description,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function SitioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sitio = await obtenerSitio(slug);
  if (!sitio || !sitio.disponible) notFound();

  // ---- Offers para JSON-LD ----
  const offers =
    slug === "chimbis"
      ? iterarOfertasChimbis().map((o) => ({
          "@type": "Offer" as const,
          name: `${nombrePlanChimbis(o.plan, o.subidas)} · ${o.dias} día${o.dias > 1 ? "s" : ""} · ${CHIMBIS_REGION_LABEL[o.region]}`,
          price: String(o.precio),
          priceCurrency: "CLP",
          availability: "https://schema.org/InStock",
        }))
      : slug === "locanto"
        ? iterarOfertasLocanto().map((o) => ({
            "@type": "Offer" as const,
            name: `${o.nombre} · ${LOCANTO_DIAS} días`,
            price: String(o.precio),
            priceCurrency: "CLP",
            availability: "https://schema.org/InStock",
          }))
        : slug === "simpleescort"
          ? iterarOfertasSimpleEscort().map((o) => ({
              "@type": "Offer" as const,
              name: `${o.tipo} · ${o.dias} día${o.dias > 1 ? "s" : ""}`,
              price: String(o.precio),
              priceCurrency: "CLP",
              availability: "https://schema.org/InStock",
            }))
          : [
          ...Object.entries(sitio.diurno).flatMap(([key, precios]) => {
            const [s, d] = key.split("-").map(Number);
            return sitio.niveles.map((n) => ({
              "@type": "Offer" as const,
              name: `${n.nombre} · ${planLabel(s, d)} (diurno, por horario)`,
              price: String(precios[n.id]),
              priceCurrency: "CLP",
              availability: "https://schema.org/InStock",
            }));
          }),
          ...Object.entries(sitio.madrugada).flatMap(([key, precios]) => {
            const [s, d] = key.split("-").map(Number);
            return sitio.niveles.map((n) => ({
              "@type": "Offer" as const,
              name: `${n.nombre} · ${planLabel(s, d)} (madrugada)`,
              price: String(precios[n.id]),
              priceCurrency: "CLP",
              availability: "https://schema.org/InStock",
            }));
          }),
        ];

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Avisos destacados en ${sitio.nombre}`,
    serviceType: "Publicación de avisos destacados",
    description: sitio.descripcion.join(" "),
    areaServed: { "@type": "Country", name: "Chile" },
    provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    offers,
  };

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
      { "@type": "ListItem", position: 2, name: sitio.nombre, item: `${SITE_URL}/${slug}` },
    ],
  };

  return (
    <main className="app page-sitio">
      <JsonLd data={serviceLd} />
      <JsonLd data={faqLd} />
      <JsonLd data={breadcrumbLd} />

      {slug === "chimbis" ? (
        <CotizadorChimbis sitio={sitio} />
      ) : slug === "locanto" ? (
        <CotizadorLocanto sitio={sitio} />
      ) : slug === "simpleescort" ? (
        <CotizadorSimpleEscort sitio={sitio} />
      ) : (
        <Cotizador sitio={sitio} />
      )}
      <CatalogoSEO sitio={sitio} />
      <footer className="foot">
        {sitio.descripcion[0]} <br />
        <a href="/">Ver otros sitios</a>
      </footer>
    </main>
  );
}
