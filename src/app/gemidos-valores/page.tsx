import PaginaValores, { metadataValores } from "@/components/PaginaValores";

export const revalidate = 3600;

export async function generateMetadata() {
  return metadataValores("gemidos");
}

export default function GemidosValoresPage() {
  return <PaginaValores sitioSlug="gemidos" />;
}
