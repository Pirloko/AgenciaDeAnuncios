import type { Metadata } from "next";
import PromocionesPublicas from "@/components/PromocionesPublicas";
import { SITE_NAME, SITE_URL, getKeywords } from "@/lib/seo";
import {
  cargarPreciosPublicos,
  preciosPublicosComoCostos,
} from "@/lib/precios-publicos";
import {
  cargarPromosSkokkaPublicas,
  fusionarCostosConPromosSkokka,
} from "@/lib/promos-pagina-skokka";

export const revalidate = 60;

const title = "Armar promoción escort Chile — packs por presupuesto";
const description =
  "Arma tu promoción de publicaciones escort en Chile según tu presupuesto. Packs en Skokka, Chimbis, Locanto, Escorcitas y más, listos para pedir por WhatsApp.";

export const metadata: Metadata = {
  title,
  description,
  keywords: getKeywords(),
  alternates: { canonical: "/promociones" },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: `${SITE_URL}/promociones`,
    siteName: SITE_NAME,
    title,
    description,
  },
};

export default async function PromocionesPage() {
  const rows = await cargarPreciosPublicos();
  const costosBase = preciosPublicosComoCostos(rows);
  const promosSkokka = await cargarPromosSkokkaPublicas();
  const costos = fusionarCostosConPromosSkokka(costosBase, promosSkokka);
  return <PromocionesPublicas costos={costos} />;
}
