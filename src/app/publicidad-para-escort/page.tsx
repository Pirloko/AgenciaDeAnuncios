import type { Metadata } from "next";
import SeoPublicidadPage, { metadataPublicidad } from "@/components/SeoPublicidadPage";
import { PUBLICIDAD_PARA_ESCORT } from "@/lib/seo-regiones";

export const metadata: Metadata = metadataPublicidad(PUBLICIDAD_PARA_ESCORT);

export default function PublicidadParaEscortPage() {
  return <SeoPublicidadPage landing={PUBLICIDAD_PARA_ESCORT} />;
}
