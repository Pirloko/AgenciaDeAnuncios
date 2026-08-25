import Link from "next/link";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

export default function AdminHome() {
  return (
    <main className="admin-page admin-hub">
      <header className="admin-hdr">
        <div>
          <h1 className="admin-title">Panel admin</h1>
          <p className="admin-muted">Elige qué quieres gestionar.</p>
        </div>
        <AdminLogoutButton />
      </header>

      <nav className="admin-hub__nav" aria-label="Secciones del panel">
        <Link href="/admin/promociones" className="admin-hub__card admin-hub__card--accent">
          <span className="admin-hub__icon" aria-hidden="true">
            ✦
          </span>
          <span className="admin-hub__name">Promociones</span>
          <span className="admin-hub__desc">
            Arma paquetes según tu presupuesto, páginas y días de publicación.
          </span>
        </Link>

        <Link href="/admin/promos-pagina" className="admin-hub__card">
          <span className="admin-hub__icon" aria-hidden="true">
            ◈
          </span>
          <span className="admin-hub__name">Promociones por páginas</span>
          <span className="admin-hub__desc">
            Promos exclusivas de una página (Skokka, etc.) e imagen flyer.
          </span>
        </Link>

        <Link href="/admin/textos" className="admin-hub__card">
          <span className="admin-hub__icon" aria-hidden="true">
            ✎
          </span>
          <span className="admin-hub__name">Crear título y texto</span>
          <span className="admin-hub__desc">
            Genera anuncios con nombre, edad, ciudad y datos opcionales listos para copiar.
          </span>
        </Link>

        <Link href="/admin/valores" className="admin-hub__card">
          <span className="admin-hub__icon" aria-hidden="true">
            ⊞
          </span>
          <span className="admin-hub__name">Tablas de valores para clientas</span>
          <span className="admin-hub__desc">
            Chimbis, Locanto y más. Comparte enlace o imagen por WhatsApp.
          </span>
        </Link>

        <Link href="/admin/costos" className="admin-hub__card">
          <span className="admin-hub__icon" aria-hidden="true">
            $
          </span>
          <span className="admin-hub__name">Costos y márgenes</span>
          <span className="admin-hub__desc">
            Edita costos, precios de venta web y revisa ganancias por anuncio.
          </span>
        </Link>
      </nav>
    </main>
  );
}
