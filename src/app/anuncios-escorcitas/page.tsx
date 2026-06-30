import PaginaAnunciosSEO, { metadataAnuncios } from "@/components/PaginaAnunciosSEO";

export const revalidate = 3600;

export async function generateMetadata() {
  return metadataAnuncios("escorcitas");
}

export default function AnunciosEscorcitasPage() {
  return <PaginaAnunciosSEO sitioSlug="escorcitas" />;
}
