import PaginaValores, { metadataValores } from "@/components/PaginaValores";

export const revalidate = 3600;

export async function generateMetadata() {
  return metadataValores("wenas");
}

export default function WenasValoresPage() {
  return <PaginaValores sitioSlug="wenas" />;
}
