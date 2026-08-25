import type { Metadata } from "next";
import PromosPaginaHub from "@/components/admin/PromosPaginaHub";

export const metadata: Metadata = {
  title: "Promociones por páginas",
  robots: { index: false, follow: false },
};

export default function AdminPromosPaginaPage() {
  return <PromosPaginaHub />;
}
