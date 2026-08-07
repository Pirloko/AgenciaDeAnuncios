import PaginaValores, { metadataValores } from "@/components/PaginaValores";

export const revalidate = 60;

export async function generateMetadata() {
  return metadataValores("skokka");
}

export default function SkokkaValoresPage() {
  return <PaginaValores sitioSlug="skokka" />;
}
