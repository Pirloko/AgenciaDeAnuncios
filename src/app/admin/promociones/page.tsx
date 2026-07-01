import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PromocionesWizard from "@/components/admin/PromocionesWizard";
import { cargarCostosAdmin } from "@/lib/admin-data";

export const metadata: Metadata = {
  title: "Promociones",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPromocionesPage() {
  try {
    const { costos } = await cargarCostosAdmin();
    return <PromocionesWizard costos={costos} />;
  } catch {
    redirect("/admin/login?error=config");
  }
}
