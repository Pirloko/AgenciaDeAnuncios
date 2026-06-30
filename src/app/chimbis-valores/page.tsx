import PaginaValores, { metadataValores } from "@/components/PaginaValores";

export const revalidate = 3600;

export async function generateMetadata() {
  return metadataValores("chimbis");
}

export default function ChimbisValoresPage() {
  return <PaginaValores sitioSlug="chimbis" />;
}
