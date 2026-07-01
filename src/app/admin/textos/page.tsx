import type { Metadata } from "next";
import CrearTextoForm from "@/components/admin/CrearTextoForm";

export const metadata: Metadata = {
  title: "Crear título y texto",
  robots: { index: false, follow: false },
};

export default function AdminTextosPage() {
  return <CrearTextoForm />;
}
