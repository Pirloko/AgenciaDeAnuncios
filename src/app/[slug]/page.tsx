import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Cotizador from "@/components/Cotizador";
import CotizadorChimbis from "@/components/CotizadorChimbis";
import CotizadorLocanto from "@/components/CotizadorLocanto";
import CotizadorSimpleEscort from "@/components/CotizadorSimpleEscort";
import CotizadorEscorcitas from "@/components/CotizadorEscorcitas";
import CotizadorWenas from "@/components/CotizadorWenas";
import CotizadorGemidos from "@/components/CotizadorGemidos";
import CatalogoSEO from "@/components/CatalogoSEO";
import JsonLd from "@/components/JsonLd";
import { obtenerSitio, listarSlugs } from "@/lib/sitios";
import { planLabel } from "@/lib/precios";
import { iterarOfertasWenas, WENAS_PLAN_INFO, precioWenasEfectivo, type WenasDias } from "@/lib/wenas";
import { ofertasGemidosEfectivas, GEMIDOS_PLAN_INFO } from "@/lib/gemidos";
import { precioLocantoEfectivo, LOCANTO_DIAS, LOCANTO_PLAN_INFO, type LocantoPlan } from "@/lib/locanto";
import { precioEscorcitasEfectivo, ESCORCITAS_PLAN_INFO, type EscorcitasDias, type EscorcitasPlan } from "@/lib/escorcitas";
import {
  calcularTotalSimpleEscortEfectivo,
  SIMPLEESCORT_DIAS,
  SIMPLEESCORT_HORARIOS_TOTAL,
  type SimpleEscortDias,
} from "@/lib/simpleescort";
import {
  iterarOfertasChimbis,
  CHIMBIS_REGION_LABEL,
  nombrePlanChimbis,
  precioChimbisEfectivo,
} from "@/lib/chimbis";
import { SITE_NAME, SITE_URL, getKeywords, SEO_OVERRIDES } from "@/lib/seo";
import { getPublicidadLanding, listPublicidadSlugs } from "@/lib/seo-regiones";
import SeoPublicidadPage, { metadataPublicidad } from "@/components/SeoPublicidadPage";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";
import { esValoresSitio, rutaValores } from "@/lib/valores-seo";
import {
  aplicarPromosSkokkaASitio,
  cargarPromosSkokkaPublicas,
} from "@/lib/promos-pagina-skokka";
import {
  cargarPreciosPublicos,
  mapaPreciosPorSitio,
} from "@/lib/precios-publicos";

export const revalidate = 60; // precios admin → público (también se revalida al guardar en admin)

function publicidadRegionDesdeSlug(slug: string): string | null {
  const prefix = "publicidad-escort-";
  if (!slug.startsWith(prefix)) return null;
  return slug.slice(prefix.length);
}

export async function generateStaticParams() {
  const slugs = await listarSlugs();
  const publicidad = listPublicidadSlugs().map((region) => ({
    slug: `publicidad-escort-${region}`,
  }));
  return [...slugs.map((slug) => ({ slug })), ...publicidad];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const regionPublicidad = publicidadRegionDesdeSlug(slug);
  if (regionPublicidad) {
    const landing = getPublicidadLanding(regionPublicidad);
    if (landing) return metadataPublicidad(landing);
    return {};
  }

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
  const regionPublicidad = publicidadRegionDesdeSlug(slug);
  if (regionPublicidad) {
    const landing = getPublicidadLanding(regionPublicidad);
    if (landing) return <SeoPublicidadPage landing={landing} />;
    notFound();
  }

  const sitioBase = await obtenerSitio(slug);
  if (!sitioBase || !sitioBase.disponible) notFound();

  const preciosRows = await cargarPreciosPublicos();
  const preciosAdmin = mapaPreciosPorSitio(preciosRows, slug);
  const promosSkokka =
    slug === "skokka" ? await cargarPromosSkokkaPublicas() : null;
  const sitio =
    slug === "skokka" && promosSkokka
      ? aplicarPromosSkokkaASitio(sitioBase, promosSkokka)
      : sitioBase;

  // ---- Offers para JSON-LD ----
  const offers =
    slug === "chimbis"
      ? iterarOfertasChimbis().map((o) => ({
          "@type": "Offer" as const,
          name: `${nombrePlanChimbis(o.plan, o.subidas)} · ${o.dias} día${o.dias > 1 ? "s" : ""} · ${CHIMBIS_REGION_LABEL[o.region]}`,
          price: String(
            precioChimbisEfectivo(o.region, o.dias, o.subidas, o.plan, preciosAdmin) ?? o.precio
          ),
          priceCurrency: "CLP",
          availability: "https://schema.org/InStock",
        }))
      : slug === "locanto"
        ? (["TOP", "GALERIA", "TOP_GALERIA"] as LocantoPlan[]).map((plan) => ({
            "@type": "Offer" as const,
            name: `${LOCANTO_PLAN_INFO[plan].nombre} · ${LOCANTO_DIAS} días`,
            price: String(precioLocantoEfectivo(plan, preciosAdmin)),
            priceCurrency: "CLP",
            availability: "https://schema.org/InStock",
          }))
        : slug === "simpleescort"
          ? SIMPLEESCORT_DIAS.flatMap((dias) => {
              const d = dias as SimpleEscortDias;
              return [
                {
                  "@type": "Offer" as const,
                  name: `Super Turbo 5X · 4 horarios (full) · ${d} día${d > 1 ? "s" : ""}`,
                  price: String(
                    calcularTotalSimpleEscortEfectivo(d, SIMPLEESCORT_HORARIOS_TOTAL, preciosAdmin)
                  ),
                  priceCurrency: "CLP",
                  availability: "https://schema.org/InStock",
                },
                {
                  "@type": "Offer" as const,
                  name: `Super Turbo 5X · por horario · ${d} día${d > 1 ? "s" : ""}`,
                  price: String(calcularTotalSimpleEscortEfectivo(d, 1, preciosAdmin)),
                  priceCurrency: "CLP",
                  availability: "https://schema.org/InStock",
                },
              ];
            })
          : slug === "escorcitas"
            ? ([1, 3, 7] as EscorcitasDias[]).flatMap((dias) =>
                (["TOP", "PREMIUM", "GOLD"] as EscorcitasPlan[]).map((plan) => ({
                  "@type": "Offer" as const,
                  name: `${ESCORCITAS_PLAN_INFO[plan].nombre} · ${dias} día${dias > 1 ? "s" : ""}`,
                  price: String(precioEscorcitasEfectivo(dias, plan, preciosAdmin)),
                  priceCurrency: "CLP",
                  availability: "https://schema.org/InStock",
                }))
              )
            : slug === "wenas"
              ? iterarOfertasWenas().map((o) => ({
                  "@type": "Offer" as const,
                  name: `${WENAS_PLAN_INFO.VIP.nombre} · ${o.dias} días`,
                  price: String(precioWenasEfectivo(o.dias as WenasDias, preciosAdmin)),
                  priceCurrency: "CLP",
                  availability: "https://schema.org/InStock",
                }))
              : slug === "gemidos"
                ? ofertasGemidosEfectivas(preciosAdmin).map((o) => ({
                    "@type": "Offer" as const,
                    name: `${GEMIDOS_PLAN_INFO[o.plan].nombre} · ${o.dias} día${o.dias > 1 ? "s" : ""}`,
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

  const hasAdmin = Object.keys(preciosAdmin).length > 0;

  return (
    <main className="app page-sitio">
      <JsonLd data={serviceLd} />
      <JsonLd data={faqLd} />
      <JsonLd data={breadcrumbLd} />

      {slug === "chimbis" ? (
        <CotizadorChimbis sitio={sitio} preciosAdmin={hasAdmin ? preciosAdmin : null} />
      ) : slug === "locanto" ? (
        <CotizadorLocanto sitio={sitio} preciosAdmin={hasAdmin ? preciosAdmin : null} />
      ) : slug === "simpleescort" ? (
        <CotizadorSimpleEscort sitio={sitio} preciosAdmin={hasAdmin ? preciosAdmin : null} />
      ) : slug === "escorcitas" ? (
        <CotizadorEscorcitas sitio={sitio} preciosAdmin={hasAdmin ? preciosAdmin : null} />
      ) : slug === "wenas" ? (
        <CotizadorWenas sitio={sitio} preciosAdmin={hasAdmin ? preciosAdmin : null} />
      ) : slug === "gemidos" ? (
        <CotizadorGemidos sitio={sitio} preciosAdmin={hasAdmin ? preciosAdmin : null} />
      ) : (
        <Cotizador sitio={sitio} promosConfig={promosSkokka} />
      )}
      <CatalogoSEO sitio={sitio} />
      <SiteFooter
        note={
          <>
            {sitio.descripcion[0]}
            <br />
            {esValoresSitio(slug) && (
              <>
                <Link href={rutaValores(slug)}>Ver tabla completa de valores</Link>
                <br />
              </>
            )}
            <Link href="/">Ver otros sitios</Link>
          </>
        }
      />
    </main>
  );
}
