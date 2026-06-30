import PaginaAnunciosSEO, { metadataAnuncios } from "@/components/PaginaAnunciosSEO";

export const revalidate = 3600;

export async function generateMetadata() {
  return metadataAnuncios("simpleescort");
}

export default function AnunciosSimpleEscortPage() {
  return <PaginaAnunciosSEO sitioSlug="simpleescort" />;
}
