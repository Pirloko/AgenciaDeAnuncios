import PaginaValores, { metadataValores } from "@/components/PaginaValores";

export const revalidate = 3600;

export async function generateMetadata() {
  return metadataValores("escorcitas");
}

export default function EscorcitasValoresPage() {
  return <PaginaValores sitioSlug="escorcitas" />;
}
