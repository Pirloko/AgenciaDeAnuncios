import PaginaAnunciosSEO, { metadataAnuncios } from "@/components/PaginaAnunciosSEO";

export const revalidate = 3600;

export async function generateMetadata() {
  return metadataAnuncios("skokka");
}

export default function AnunciosSkokkaPage() {
  return <PaginaAnunciosSEO sitioSlug="skokka" />;
}
