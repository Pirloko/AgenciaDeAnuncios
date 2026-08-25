import type { Metadata } from "next";
import AdminValoresPanel, { type SitioValoresAdmin } from "@/components/admin/AdminValoresPanel";
import { obtenerSitio } from "@/lib/sitios";
import { VALORES_SITIOS } from "@/lib/valores-seo";
import {
  aplicarPromosSkokkaASitio,
  cargarPromosSkokkaPublicas,
} from "@/lib/promos-pagina-skokka";
import {
  cargarPreciosPublicos,
  mapaPreciosPorSitio,
} from "@/lib/precios-publicos";

export const metadata: Metadata = {
  title: "Tablas de valores",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminValoresPage() {
  const preciosRows = await cargarPreciosPublicos();
  const sitios: SitioValoresAdmin[] = [];

  for (const slug of VALORES_SITIOS) {
    const sitioBase = await obtenerSitio(slug);
    if (!sitioBase?.disponible) continue;
    const preciosAdmin = mapaPreciosPorSitio(preciosRows, slug);
    const sitio =
      slug === "skokka"
        ? aplicarPromosSkokkaASitio(sitioBase, await cargarPromosSkokkaPublicas())
        : sitioBase;
    sitios.push({
      slug,
      sitio,
      preciosAdmin: Object.keys(preciosAdmin).length ? preciosAdmin : null,
    });
  }

  return <AdminValoresPanel sitios={sitios} />;
}
