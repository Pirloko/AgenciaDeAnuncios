import PaginaAnunciosSEO, { metadataAnuncios } from "@/components/PaginaAnunciosSEO";

export const revalidate = 3600;

export async function generateMetadata() {
  return metadataAnuncios("chimbis");
}

export default function AnunciosChimbisPage() {
  return <PaginaAnunciosSEO sitioSlug="chimbis" />;
}
