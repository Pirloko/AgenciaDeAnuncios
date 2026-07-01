import type { Metadata } from "next";
import AdminValoresPanel, { type SitioValoresAdmin } from "@/components/admin/AdminValoresPanel";
import { obtenerSitio } from "@/lib/sitios";
import { VALORES_SITIOS } from "@/lib/valores-seo";

export const metadata: Metadata = {
  title: "Tablas de valores",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminValoresPage() {
  const sitios: SitioValoresAdmin[] = [];

  for (const slug of VALORES_SITIOS) {
    const sitio = await obtenerSitio(slug);
    if (sitio?.disponible) sitios.push({ slug, sitio });
  }

  return <AdminValoresPanel sitios={sitios} />;
}
