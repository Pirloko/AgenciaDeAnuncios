import type { Metadata } from "next";
import PromocionesPublicas from "@/components/PromocionesPublicas";
import { SITE_NAME, SITE_URL, getKeywords } from "@/lib/seo";

export const revalidate = 3600;

const title = "Armar promoción — presupuesto y paquetes de avisos";
const description =
  "Di cuánta plata tienes y por cuántos días quieres publicar. Te armamos opciones de avisos destacados en Skokka, Chimbis, Locanto y más, listas para pedir por WhatsApp.";

export const metadata: Metadata = {
  title,
  description,
  keywords: getKeywords(),
  alternates: { canonical: "/promociones" },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: `${SITE_URL}/promociones`,
    siteName: SITE_NAME,
    title,
    description,
  },
};

export default function PromocionesPage() {
  return <PromocionesPublicas />;
}
