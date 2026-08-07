"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { type AnuncioCosto, SITIO_ADMIN_LABEL, clpAdmin } from "@/lib/admin-costos";
import {
  type PromocionSugerida,
  type ZonaPromo,
  SOBRANTE_OBJETIVO,
  ZONA_PROMO_LABEL,
  ZONA_PROMO_OPTS,
  diasDisponiblesPromo,
  generarPromociones,
  parsePresupuestoCLP,
  resumenLineaPromo,
  resumenSitiosPromo,
  sitiosAlcanzables,
} from "@/lib/promociones";

type Step = "presupuesto" | "dias" | "zona" | "resultado";

interface Props {
  costos: AnuncioCosto[];
}

export default function PromocionesWizard({ costos }: Props) {
  const [step, setStep] = useState<Step>("presupuesto");
  const [presupuestoRaw, setPresupuestoRaw] = useState("");
  const [dias, setDias] = useState<number | null>(null);
  const [zona, setZona] = useState<ZonaPromo | null>(null);

  const presupuesto = parsePresupuestoCLP(presupuestoRaw) ?? 0;

  const diasOpts = useMemo(() => diasDisponiblesPromo(costos), [costos]);

  const sitiosPosibles = useMemo(() => {
    if (presupuesto <= 0 || dias == null || zona == null) return [];
    return sitiosAlcanzables(costos, presupuesto, dias, zona);
  }, [costos, presupuesto, dias, zona]);

  const promociones = useMemo((): PromocionSugerida[] => {
    if (step !== "resultado" || presupuesto <= 0 || dias == null || zona == null) return [];
    return generarPromociones(costos, { presupuesto, dias, zona });
  }, [step, costos, presupuesto, dias, zona]);

  function reiniciar() {
    setStep("presupuesto");
    setPresupuestoRaw("");
    setDias(null);
    setZona(null);
  }

  const pasos: { id: Step; label: string }[] = [
    { id: "presupuesto", label: "Presupuesto" },
    { id: "dias", label: "Días" },
    { id: "zona", label: "Zona" },
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
          <p className="admin-muted">
            Indica el monto, los días y la zona: te mostramos en qué páginas puedes publicar y varias
            opciones con total y sobrante.
          </p>
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
          <h2 className="admin-promo__q">¿Cuánto dinero tienes para publicar?</h2>
          <p className="admin-promo__hint">Ejemplo: 20.000 o 20000</p>
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
          <p className="admin-promo__hint">Elige una duración (1, 3 o 7 días). Después indicas la zona.</p>
          <div className="admin-promo__opts admin-promo__opts--wrap">
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
          {diasOpts.length === 0 && (
            <p className="admin-promo__warn">No hay anuncios con precio de venta web cargado.</p>
          )}
          <div className="admin-promo__bar">
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              onClick={() => setStep("presupuesto")}
            >
              Atrás
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--primary"
              disabled={dias == null}
              onClick={() => setStep("zona")}
            >
              Continuar
            </button>
          </div>
        </section>
      )}

      {step === "zona" && (
        <section className="admin-promo__panel">
          <h2 className="admin-promo__q">¿Dónde quieres publicar?</h2>
          <p className="admin-promo__hint">
            Santiago o comunas de Santiago, o regiones sur o norte. En Chimbis los precios cambian
            según la zona.
          </p>
          <div className="admin-promo__opts">
            {ZONA_PROMO_OPTS.map((z) => {
              const on = zona === z.id;
              return (
                <button
                  key={z.id}
                  type="button"
                  className={`admin-promo__opt${on ? " admin-promo__opt--on" : ""}`}
                  onClick={() => setZona(z.id)}
                >
                  <strong>{z.label}</strong>
                  <span>{z.hint}</span>
                </button>
              );
            })}
          </div>
          <div className="admin-promo__bar">
            <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setStep("dias")}>
              Atrás
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--primary"
              disabled={zona == null}
              onClick={() => setStep("resultado")}
            >
              Ver opciones
            </button>
          </div>
        </section>
      )}

      {step === "resultado" && dias != null && zona != null && (
        <section className="admin-promo__panel">
          <div className="admin-promo__resumen">
            <span>Presupuesto {clpAdmin(presupuesto)}</span>
            <span>
              {dias} día{dias > 1 ? "s" : ""}
            </span>
            <span>{ZONA_PROMO_LABEL[zona]}</span>
          </div>

          {sitiosPosibles.length > 0 ? (
            <p className="admin-promo__hint admin-promo__hint--block">
              Con este monto puedes publicar en{" "}
              <strong>
                {sitiosPosibles.length === 1
                  ? "1 página"
                  : `${sitiosPosibles.length} páginas`}
              </strong>
              : {sitiosPosibles.map((s) => SITIO_ADMIN_LABEL[s]).join(", ")}.
            </p>
          ) : (
            <p className="admin-promo__warn">
              Con {clpAdmin(presupuesto)}, {dias} día{dias > 1 ? "s" : ""} y zona{" "}
              {ZONA_PROMO_LABEL[zona]} no alcanza ningún anuncio. Prueba subir el monto o cambiar
              filtros.
            </p>
          )}

          {promociones.length === 0 ? (
            <div className="admin-empty">
              <p>No encontramos combinaciones dentro del presupuesto para esa duración y zona.</p>
              <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setStep("zona")}>
                Cambiar zona
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
                    <p>
                      Páginas: {resumenSitiosPromo(p.sitios)}. {p.descripcion}
                    </p>
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
                      <span>{p.sobrante === 0 ? "Justo" : "Sobra"}</span>
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
            <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setStep("zona")}>
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
