import SeoLandingPage, { metadataLanding } from "@/components/SeoLandingPage";

export const revalidate = 3600;

export async function generateMetadata() {
  return metadataLanding("publicaciones");
}

export default function PublicacionesEscortChilePage() {
  return <SeoLandingPage kind="publicaciones" />;
}
