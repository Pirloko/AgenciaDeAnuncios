import Link from "next/link";

export default function PromosPaginaHub() {
  return (
    <main className="admin-page">
      <header className="admin-hdr">
        <div>
          <Link href="/admin" className="admin-back">
            ← Panel
          </Link>
          <h1 className="admin-title">Promociones por páginas</h1>
          <p className="admin-muted">
            Promos exclusivas de una sola página. No son packs multi-sitio.
          </p>
        </div>
      </header>

      <p className="admin-note">
        Aquí defines los valores de venta de Skokka que ve el público en el cotizador y en la
        tabla de valores. No cambian Costos y márgenes.
      </p>

      <nav className="admin-hub__nav" aria-label="Páginas con promociones">
        <Link href="/admin/promos-pagina/skokka" className="admin-hub__card admin-hub__card--accent">
          <span className="admin-hub__icon" aria-hidden="true">
            ◈
          </span>
          <span className="admin-hub__name">Promociones Skokka</span>
          <span className="admin-hub__desc">
            Descuentos por horarios · flyer TOP / Super Top / All in One.
          </span>
        </Link>

        <div className="admin-hub__card admin-hub__card--disabled" aria-disabled="true">
          <span className="admin-hub__icon" aria-hidden="true">
            ◈
          </span>
          <span className="admin-hub__name">Promociones Chimbis</span>
          <span className="admin-hub__desc">Próximamente</span>
        </div>

        <div className="admin-hub__card admin-hub__card--disabled" aria-disabled="true">
          <span className="admin-hub__icon" aria-hidden="true">
            ◈
          </span>
          <span className="admin-hub__name">Promociones Locanto</span>
          <span className="admin-hub__desc">Próximamente</span>
        </div>
      </nav>
    </main>
  );
}
