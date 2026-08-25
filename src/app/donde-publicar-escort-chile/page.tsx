import SeoLandingPage, { metadataLanding } from "@/components/SeoLandingPage";

export const revalidate = 3600;

export async function generateMetadata() {
  return metadataLanding("donde");
}

export default function DondePublicarEscortChilePage() {
  return <SeoLandingPage kind="donde" />;
}
