import PaginaValores, { metadataValores } from "@/components/PaginaValores";

export const revalidate = 60;

export async function generateMetadata() {
  return metadataValores("simpleescort");
}

export default function SimpleEscortValoresPage() {
  return <PaginaValores sitioSlug="simpleescort" />;
}
