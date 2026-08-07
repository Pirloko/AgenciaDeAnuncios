import PaginaValores, { metadataValores } from "@/components/PaginaValores";

export const revalidate = 60;

export async function generateMetadata() {
  return metadataValores("locanto");
}

export default function LocantoValoresPage() {
  return <PaginaValores sitioSlug="locanto" />;
}
