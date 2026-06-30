import PaginaAnunciosSEO, { metadataAnuncios } from "@/components/PaginaAnunciosSEO";

export const revalidate = 3600;

export async function generateMetadata() {
  return metadataAnuncios("locanto");
}

export default function AnunciosLocantoPage() {
  return <PaginaAnunciosSEO sitioSlug="locanto" />;
}
