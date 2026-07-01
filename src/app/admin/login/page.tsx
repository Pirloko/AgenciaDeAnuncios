import type { Metadata } from "next";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin — Ingresar",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="admin-page admin-page--login">
      <div className="admin-card">
        <h1 className="admin-title">Panel de costos</h1>
        <p className="admin-muted">Acceso privado — solo administrador.</p>
        <AdminLoginForm errorCode={error} />
      </div>
    </main>
  );
}
