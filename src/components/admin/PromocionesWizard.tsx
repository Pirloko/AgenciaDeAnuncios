"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  type AnuncioCosto,
  type SitioAdmin,
  SITIO_ADMIN_LABEL,
  clpAdmin,
} from "@/lib/admin-costos";
import {
  type PromocionSugerida,
  SOBRANTE_OBJETIVO,
  diasDisponiblesPromo,
  generarPromociones,
  parsePresupuestoCLP,
  resumenLineaPromo,
  sitiosConPrecioVenta,
} from "@/lib/promociones";

type Step = "presupuesto" | "sitios" | "dias" | "resultado";

interface Props {
  costos: AnuncioCosto[];
}

export default function PromocionesWizard({ costos }: Props) {
  const [step, setStep] = useState<Step>("presupuesto");
  const [presupuestoRaw, setPresupuestoRaw] = useState("");
  const [sitiosSel, setSitiosSel] = useState<SitioAdmin[]>([]);
  const [dias, setDias] = useState<number | "all">("all");

  const sitiosDisponibles = useMemo(() => sitiosConPrecioVenta(costos), [costos]);

  const presupuesto = parsePresupuestoCLP(presupuestoRaw) ?? 0;

  const diasOpts = useMemo(
    () => diasDisponiblesPromo(costos, sitiosSel),
    [costos, sitiosSel]
  );

  const promociones = useMemo((): PromocionSugerida[] => {
    if (step !== "resultado" || presupuesto <= 0 || !sitiosSel.length) {
      return [];
    }
    return generarPromociones(costos, {
      presupuesto,
      sitiosElegidos: sitiosSel,
      dias,
    });
  }, [step, costos, presupuesto, sitiosSel, dias]);

  function toggleSitio(s: SitioAdmin) {
    setSitiosSel((prev) => {
      if (prev.includes(s)) return prev.filter((x) => x !== s);
      return [...prev, s];
    });
  }

  function seleccionarTodas() {
    setSitiosSel(sitiosDisponibles);
  }

  function reiniciar() {
    setStep("presupuesto");
    setPresupuestoRaw("");
    setSitiosSel([]);
    setDias("all");
  }

  const pasos: { id: Step; label: string }[] = [
    { id: "presupuesto", label: "Presupuesto" },
    { id: "sitios", label: "Páginas" },
    { id: "dias", label: "Días" },
    { id: "resultado", label: "Opciones" },
  ];

  return (
    <main className="admin-page admin-promo">
      <header className="admin-hdr">
        <div>
          <Link href="/admin" className="admin-back">
            ← Panel
          </Link>
          <h1 className="admin-title">Promociones</h1>
          <p className="admin-muted">Arma paquetes según presupuesto y precios de venta web.</p>
        </div>
      </header>

      <ol className="admin-promo__steps" aria-label="Pasos">
        {pasos.map((s, i) => {
          const activo = pasos.findIndex((p) => p.id === step) >= i;
          return (
            <li key={s.id} className={`admin-promo__step${activo ? " admin-promo__step--on" : ""}`}>
              {s.label}
            </li>
          );
        })}
      </ol>

      {step === "presupuesto" && (
        <section className="admin-promo__panel">
          <h2 className="admin-promo__q">¿Cuánto presupuesto tienes para publicar anuncios?</h2>
          <p className="admin-promo__hint">Ejemplo: 25.000 o 25000</p>
          <input
            className="admin-promo__input"
            type="text"
            inputMode="numeric"
            placeholder="Monto en pesos chilenos"
            value={presupuestoRaw}
            onChange={(e) => setPresupuestoRaw(e.target.value)}
            autoFocus
          />
          {presupuesto > 0 && (
            <p className="admin-promo__preview">Presupuesto: {clpAdmin(presupuesto)}</p>
          )}
          <div className="admin-promo__bar">
            <button
              type="button"
              className="admin-btn admin-btn--primary"
              disabled={presupuesto <= 0}
              onClick={() => setStep("sitios")}
            >
              Continuar
            </button>
          </div>
        </section>
      )}

      {step === "sitios" && (
        <section className="admin-promo__panel">
          <h2 className="admin-promo__q">¿En qué páginas quieres la promoción?</h2>
          <p className="admin-promo__hint">
            Toca una o más. {sitiosSel.length > 0 ? `${sitiosSel.length} seleccionada${sitiosSel.length > 1 ? "s" : ""}.` : "Elige al menos una."}
          </p>
          <div className="admin-promo__opts">
            {sitiosDisponibles.map((s) => {
              const on = sitiosSel.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  className={`admin-promo__opt${on ? " admin-promo__opt--on" : ""}`}
                  onClick={() => toggleSitio(s)}
                >
                  <strong>{SITIO_ADMIN_LABEL[s]}</strong>
                  <span>{on ? "Incluida en la promoción" : "Toca para incluir"}</span>
                </button>
              );
            })}
          </div>
          {sitiosDisponibles.length === 0 && (
            <p className="admin-promo__warn">Aún no hay sitios con precio de venta cargado.</p>
          )}
          {sitiosDisponibles.length > 1 && (
            <button type="button" className="admin-promo__link" onClick={seleccionarTodas}>
              Seleccionar todas
            </button>
          )}
          <div className="admin-promo__bar">
            <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setStep("presupuesto")}>
              Atrás
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--primary"
              disabled={sitiosSel.length === 0}
              onClick={() => setStep("dias")}
            >
              Continuar
            </button>
          </div>
        </section>
      )}

      {step === "dias" && (
        <section className="admin-promo__panel">
          <h2 className="admin-promo__q">¿Por cuántos días quieres publicar?</h2>
          <div className="admin-promo__opts admin-promo__opts--wrap">
            <button
              type="button"
              className={`admin-promo__opt admin-promo__opt--chip${dias === "all" ? " admin-promo__opt--on" : ""}`}
              onClick={() => setDias("all")}
            >
              <strong>Sin preferencia</strong>
            </button>
            {diasOpts.map((d) => (
              <button
                key={d}
                type="button"
                className={`admin-promo__opt admin-promo__opt--chip${dias === d ? " admin-promo__opt--on" : ""}`}
                onClick={() => setDias(d)}
              >
                <strong>
                  {d} día{d > 1 ? "s" : ""}
                </strong>
              </button>
            ))}
          </div>
          <div className="admin-promo__bar">
            <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setStep("sitios")}>
              Atrás
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--primary"
              onClick={() => setStep("resultado")}
            >
              Ver promociones
            </button>
          </div>
        </section>
      )}

      {step === "resultado" && (
        <section className="admin-promo__panel">
          <div className="admin-promo__resumen">
            <span>Presupuesto {clpAdmin(presupuesto)}</span>
            <span>{sitiosSel.map((s) => SITIO_ADMIN_LABEL[s]).join(" · ")}</span>
            <span>{dias === "all" ? "Cualquier duración" : `${dias} día${dias > 1 ? "s" : ""}`}</span>
          </div>

          {promociones.length === 0 ? (
            <div className="admin-empty">
              <p>
                No encontramos combinaciones dentro del presupuesto con esos filtros. Prueba subir el monto,
                elegir otras páginas o quitar la preferencia de días.
              </p>
              <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setStep("dias")}>
                Cambiar filtros
              </button>
            </div>
          ) : (
            <div className="admin-promo__lista">
              {promociones.map((p, idx) => (
                <article key={p.id} className="admin-promo__pack">
                  <header className="admin-promo__pack-hdr">
                    <h3>
                      Opción {idx + 1}: {p.nombre}
                    </h3>
                    <p>{p.descripcion}</p>
                  </header>
                  <ul className="admin-promo__lineas">
                    {p.lineas.map((l) => (
                      <li key={l.id}>
                        <span>{resumenLineaPromo(l)}</span>
                        <strong>{clpAdmin(l.precio)}</strong>
                      </li>
                    ))}
                  </ul>
                  <footer className="admin-promo__pack-foot">
                    <div>
                      <span>Total</span>
                      <strong>{clpAdmin(p.total)}</strong>
                    </div>
                    <div>
                      <span>Sobra</span>
                      <strong
                        className={
                          p.sobrante <= SOBRANTE_OBJETIVO ? "admin-promo__sobrante--ok" : undefined
                        }
                      >
                        {clpAdmin(p.sobrante)}
                      </strong>
                    </div>
                  </footer>
                </article>
              ))}
            </div>
          )}

          <div className="admin-promo__bar">
            <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setStep("dias")}>
              Atrás
            </button>
            <button type="button" className="admin-btn admin-btn--ghost" onClick={reiniciar}>
              Nueva búsqueda
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
