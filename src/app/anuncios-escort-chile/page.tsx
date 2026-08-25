import SeoLandingPage, { metadataLanding } from "@/components/SeoLandingPage";

export const revalidate = 3600;

export async function generateMetadata() {
  return metadataLanding("anuncios");
}

export default function AnunciosEscortChilePage() {
  return <SeoLandingPage kind="anuncios" />;
}
