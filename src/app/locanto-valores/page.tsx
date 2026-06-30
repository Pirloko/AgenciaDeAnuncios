import PaginaValores, { metadataValores } from "@/components/PaginaValores";

export const revalidate = 3600;

export async function generateMetadata() {
  return metadataValores("locanto");
}

export default function LocantoValoresPage() {
  return <PaginaValores sitioSlug="locanto" />;
}
