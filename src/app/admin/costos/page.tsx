import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { cargarCostosAdmin } from "@/lib/admin-data";

export const metadata: Metadata = {
  title: "Costos y márgenes",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminCostosPage() {
  try {
    const { costos, skokkaCreditos, simpleescortCreditos, locantoDolar } = await cargarCostosAdmin();
    return (
      <AdminDashboard
        costos={costos}
        skokkaCreditos={skokkaCreditos}
        simpleescortCreditos={simpleescortCreditos}
        locantoDolar={locantoDolar}
      />
    );
  } catch {
    redirect("/admin/login?error=config");
  }
}
