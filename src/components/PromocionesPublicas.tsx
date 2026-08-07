"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { type SitioAdmin, SITIO_ADMIN_LABEL, clpAdmin } from "@/lib/admin-costos";
import { enlaceWhatsApp } from "@/lib/whatsapp";
import {
  type PromocionSugerida,
  type ZonaPromo,
  MIN_SITIOS_PROMO,
  SOBRANTE_OBJETIVO,
  ZONA_PROMO_LABEL,
  ZONA_PROMO_OPTS,
  diasDisponiblesPromo,
  generarPromociones,
  mensajeWhatsAppPromo,
  parsePresupuestoCLP,
  resumenLineaPromo,
  resumenSitiosPromo,
  sitiosAlcanzables,
} from "@/lib/promociones";

type Step = "intro" | "presupuesto" | "dias" | "zona" | "paginas" | "resultado";

/** Costos vacíos: el catálogo se arma solo con precios públicos. */
const COSTOS_PUBLICOS: [] = [];

export default function PromocionesPublicas({
  costos = COSTOS_PUBLICOS,
}: {
  costos?: import("@/lib/admin-costos").AnuncioCosto[];
}) {
  const [step, setStep] = useState<Step>("intro");
  const [presupuestoRaw, setPresupuestoRaw] = useState("");
  const [dias, setDias] = useState<number | null>(null);
  const [zona, setZona] = useState<ZonaPromo | null>(null);
  const [sitiosSel, setSitiosSel] = useState<SitioAdmin[]>([]);

  const presupuesto = parsePresupuestoCLP(presupuestoRaw) ?? 0;
  const diasOpts = useMemo(() => diasDisponiblesPromo(costos), [costos]);

  const sitiosPosibles = useMemo(() => {
    if (presupuesto <= 0 || dias == null || zona == null) return [];
    return sitiosAlcanzables(costos, presupuesto, dias, zona);
  }, [presupuesto, dias, zona, costos]);

  const puedeContinuarPaginas = sitiosSel.length >= MIN_SITIOS_PROMO;

  const promociones = useMemo((): PromocionSugerida[] => {
    if (
      step !== "resultado" ||
      presupuesto <= 0 ||
      dias == null ||
      zona == null ||
      sitiosSel.length < MIN_SITIOS_PROMO
    ) {
      return [];
    }
    return generarPromociones(costos, {
      presupuesto,
      dias,
      zona,
      sitios: sitiosSel,
    });
  }, [step, presupuesto, dias, zona, sitiosSel, costos]);

  function reiniciar() {
    setStep("intro");
    setPresupuestoRaw("");
    setDias(null);
    setZona(null);
    setSitiosSel([]);
  }

  function toggleSitio(s: SitioAdmin) {
    setSitiosSel((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  function seleccionarTodas() {
    setSitiosSel([...sitiosPosibles]);
  }

  function irAPaginas() {
    setSitiosSel((prev) => prev.filter((s) => sitiosPosibles.includes(s)));
    setStep("paginas");
  }

  const pasosVisibles: { id: Step; label: string }[] = [
    { id: "presupuesto", label: "Plata" },
    { id: "dias", label: "Días" },
    { id: "zona", label: "Zona" },
    { id: "paginas", label: "Páginas" },
    { id: "resultado", label: "Opciones" },
  ];

  const pasoIdx = pasosVisibles.findIndex((p) => p.id === step);

  return (
    <main className="app page-promo">
      <header className="promo-pub__hdr">
        <div>
          <Link className="switch" href="/">
            ← Inicio
          </Link>
          <h1 className="promo-pub__title">Armar promoción</h1>
        </div>
      </header>

      {step !== "intro" && (
        <ol className="promo-pub__steps" aria-label="Pasos">
          {pasosVisibles.map((s, i) => (
            <li
              key={s.id}
              className={`promo-pub__step${pasoIdx >= i ? " promo-pub__step--on" : ""}`}
            >
              {s.label}
            </li>
          ))}
        </ol>
      )}

      {step === "intro" && (
        <section className="promo-pub__panel promo-pub__intro">
          <ol className="promo-pub__como">
            <li>
              <strong>1. ¿Cuánto dinero tienes para publicar?</strong>
              <span>5.000, 10.000, 15.000, 50.000, etc.</span>
            </li>
            <li>
              <strong>2. Los días</strong>
              <span>1, 3 o 7 días</span>
            </li>
            <li>
              <strong>3. Debes elegir en cuál zona estás</strong>
              <span>Santiago o comunas de Santiago, o regiones sur o norte</span>
            </li>
            <li>
              <strong>4. Elige en qué páginas quieres publicar</strong>
              <span>Mínimo 2 páginas (puedes marcar todas)</span>
            </li>
            <li>
              <strong>5. Eliges una opción</strong>
              <span>
                Envías por WhatsApp o tómale captura y mándanos la foto
              </span>
            </li>
          </ol>
          <button
            type="button"
            className="promo-pub__cta"
            onClick={() => setStep("presupuesto")}
          >
            ARMA TU PROMOCIÓN AHORA
          </button>
        </section>
      )}

      {step === "presupuesto" && (
        <section className="promo-pub__panel">
          <h2 className="promo-pub__q">
            Aquí debes poner cuánto dinero tienes para publicar
          </h2>
          <input
            className="promo-pub__input"
            type="text"
            inputMode="numeric"
            placeholder="Ejemplo: 20.000"
            value={presupuestoRaw}
            onChange={(e) => setPresupuestoRaw(e.target.value)}
            autoFocus
          />
          {presupuesto > 0 && (
            <p className="promo-pub__preview">Presupuesto: {clpAdmin(presupuesto)}</p>
          )}
          <div className="promo-pub__bar">
            <button type="button" className="promo-pub__btn promo-pub__btn--ghost" onClick={() => setStep("intro")}>
              Atrás
            </button>
            <button
              type="button"
              className="promo-pub__btn promo-pub__btn--primary"
              disabled={presupuesto <= 0}
              onClick={() => setStep("dias")}
            >
              Continuar
            </button>
          </div>
        </section>
      )}

      {step === "dias" && (
        <section className="promo-pub__panel">
          <h2 className="promo-pub__q">¿Por cuántos días?</h2>
          <p className="promo-pub__hint">1, 3 o 7 días.</p>
          <div className="promo-pub__chips">
            {diasOpts.map((d) => (
              <button
                key={d}
                type="button"
                className={`promo-pub__chip${dias === d ? " promo-pub__chip--on" : ""}`}
                onClick={() => setDias(d)}
              >
                {d} día{d > 1 ? "s" : ""}
              </button>
            ))}
          </div>
          <div className="promo-pub__bar">
            <button
              type="button"
              className="promo-pub__btn promo-pub__btn--ghost"
              onClick={() => setStep("presupuesto")}
            >
              Atrás
            </button>
            <button
              type="button"
              className="promo-pub__btn promo-pub__btn--primary"
              disabled={dias == null}
              onClick={() => setStep("zona")}
            >
              Continuar
            </button>
          </div>
        </section>
      )}

      {step === "zona" && (
        <section className="promo-pub__panel">
          <h2 className="promo-pub__q">Debes elegir en cuál zona estás</h2>
          <div className="promo-pub__opts">
            {ZONA_PROMO_OPTS.map((z) => (
              <button
                key={z.id}
                type="button"
                className={`promo-pub__opt${zona === z.id ? " promo-pub__opt--on" : ""}`}
                onClick={() => setZona(z.id)}
              >
                <strong>{z.label}</strong>
                <span>{z.hint}</span>
              </button>
            ))}
          </div>
          <div className="promo-pub__bar">
            <button type="button" className="promo-pub__btn promo-pub__btn--ghost" onClick={() => setStep("dias")}>
              Atrás
            </button>
            <button
              type="button"
              className="promo-pub__btn promo-pub__btn--primary"
              disabled={zona == null}
              onClick={irAPaginas}
            >
              Continuar
            </button>
          </div>
        </section>
      )}

      {step === "paginas" && (
        <section className="promo-pub__panel">
          <h2 className="promo-pub__q">¿En qué páginas quieres publicar?</h2>
          <p className="promo-pub__hint">
            Elige al menos {MIN_SITIOS_PROMO} O Todas.
          </p>

          {sitiosPosibles.length < MIN_SITIOS_PROMO ? (
            <p className="promo-pub__warn">
              Con este presupuesto no alcanzan {MIN_SITIOS_PROMO} páginas. Sube el monto o cambia
              los días.
            </p>
          ) : (
            <>
              <div className="promo-pub__opts">
                {sitiosPosibles.map((s) => {
                  const on = sitiosSel.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      className={`promo-pub__opt${on ? " promo-pub__opt--on" : ""}`}
                      onClick={() => toggleSitio(s)}
                      aria-pressed={on}
                    >
                      <strong>{SITIO_ADMIN_LABEL[s]}</strong>
                      <span>{on ? "Seleccionada" : "Toca para elegir"}</span>
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                className="promo-pub__btn promo-pub__btn--ghost promo-pub__btn--block"
                onClick={seleccionarTodas}
              >
                Seleccionar todas
              </button>
              <p className="promo-pub__preview">
                {sitiosSel.length} página{sitiosSel.length === 1 ? "" : "s"} elegida
                {sitiosSel.length === 1 ? "" : "s"}
                {sitiosSel.length > 0 && sitiosSel.length < MIN_SITIOS_PROMO
                  ? ` (faltan ${MIN_SITIOS_PROMO - sitiosSel.length})`
                  : ""}
              </p>
            </>
          )}

          <div className="promo-pub__bar">
            <button type="button" className="promo-pub__btn promo-pub__btn--ghost" onClick={() => setStep("zona")}>
              Atrás
            </button>
            <button
              type="button"
              className="promo-pub__btn promo-pub__btn--primary"
              disabled={!puedeContinuarPaginas}
              onClick={() => setStep("resultado")}
            >
              Ver opciones
            </button>
          </div>
        </section>
      )}

      {step === "resultado" && dias != null && zona != null && (
        <section className="promo-pub__panel">
          <div className="promo-pub__resumen">
            <span>{clpAdmin(presupuesto)}</span>
            <span>
              {dias} día{dias > 1 ? "s" : ""}
            </span>
            <span>{ZONA_PROMO_LABEL[zona]}</span>
            <span>{sitiosSel.length} páginas</span>
          </div>

          <p className="promo-pub__hint promo-pub__hint--block">
            Páginas: <strong>{resumenSitiosPromo(sitiosSel)}</strong>
          </p>

          {promociones.length === 0 ? (
            <div className="promo-pub__empty">
              <p>
                No encontramos combinaciones con esas páginas. Prueba marcar más páginas o subir el
                presupuesto.
              </p>
              <button
                type="button"
                className="promo-pub__btn promo-pub__btn--ghost"
                onClick={() => setStep("paginas")}
              >
                Cambiar páginas
              </button>
            </div>
          ) : (
            <div className="promo-pub__lista">
              {promociones.map((p, idx) => {
                const wa = enlaceWhatsApp(
                  encodeURIComponent(
                    mensajeWhatsAppPromo(p, { presupuesto, dias, zona })
                  )
                );
                return (
                  <article key={p.id} className="promo-pub__pack">
                    <header className="promo-pub__pack-hdr">
                      <span className="promo-pub__pack-n">Opción {idx + 1}</span>
                      <h3>{p.nombre}</h3>
                      <p className="promo-pub__pack-sitios">{resumenSitiosPromo(p.sitios)}</p>
                      <p className="promo-pub__pack-desc">{p.descripcion}</p>
                    </header>
                    <ul className="promo-pub__lineas">
                      {p.lineas.map((l) => (
                        <li key={l.id}>
                          <span>{resumenLineaPromo(l)}</span>
                          <strong>{clpAdmin(l.precio)}</strong>
                        </li>
                      ))}
                    </ul>
                    <footer className="promo-pub__pack-foot">
                      <div>
                        <span>Total</span>
                        <strong>{clpAdmin(p.total)}</strong>
                      </div>
                      <div className="promo-pub__pack-sobra">
                        <span>{p.sobrante === 0 ? "Justo" : "Sobra"}</span>
                        <strong className={p.sobrante <= SOBRANTE_OBJETIVO ? "promo-pub__ok" : undefined}>
                          {clpAdmin(p.sobrante)}
                        </strong>
                      </div>
                    </footer>
                    <div className="promo-pub__pack-actions">
                      <a className="wa promo-pub__wa" href={wa} target="_blank" rel="noopener noreferrer">
                        Pedir por WhatsApp
                      </a>
                      <p className="promo-pub__tip" role="note">
                        Tómale captura de pantalla y envíame la foto
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          <div className="promo-pub__bar">
            <button
              type="button"
              className="promo-pub__btn promo-pub__btn--ghost"
              onClick={() => setStep("paginas")}
            >
              Atrás
            </button>
            <button type="button" className="promo-pub__btn promo-pub__btn--ghost" onClick={reiniciar}>
              Empezar de nuevo
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
