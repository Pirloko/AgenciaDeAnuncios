"use client";

import { useState } from "react";
import type { Sitio } from "@/types/sitio";
import {
  SIMPLEESCORT_SUBIDAS,
  SIMPLEESCORT_HORARIOS_TOTAL,
  SIMPLEESCORT_DIAS,
  FRANJAS_SIMPLEESCORT,
  franjaSimpleEscortPorIndice,
  resumenHorariosSimpleEscort,
  calcularTotalSimpleEscortEfectivo,
  type SimpleEscortDias,
  clp,
} from "@/lib/simpleescort";
import { EjemploAviso } from "@/components/EjemploAviso";
import { enlaceWhatsApp } from "@/lib/whatsapp";

type Step = "dias" | "horarios" | "resultado";

const STEPS: Step[] = ["dias", "horarios", "resultado"];

export default function CotizadorSimpleEscort({
  sitio,
  preciosAdmin = null,
}: {
  sitio: Sitio;
  preciosAdmin?: Record<string, number> | null;
}) {
  const [step, setStep] = useState(0);
  const [dias, setDias] = useState<SimpleEscortDias | null>(null);
  const [horarios, setHorarios] = useState<number[]>([]);

  const brandStyle = {
    "--brand": sitio.color,
    "--brand-soft": sitio.color + "1f",
    "--accent": sitio.accent,
  } as unknown as React.CSSProperties;

  const cur = STEPS[step];
  const horariosCompletos = horarios.length === SIMPLEESCORT_HORARIOS_TOTAL;

  function next() {
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }
  function reset() {
    setStep(0);
    setDias(null);
    setHorarios([]);
  }

  function pickAdvance(fn: () => void) {
    fn();
    setTimeout(next, 180);
  }

  function toggleHorario(i: number) {
    setHorarios((h) => (h.includes(i) ? h.filter((x) => x !== i) : [...h, i]));
  }

  function toggleTodosHorarios() {
    setHorarios(
      horariosCompletos ? [] : FRANJAS_SIMPLEESCORT.map((_, i) => i)
    );
  }

  // ---------- RESULTADO ----------
  if (cur === "resultado" && dias && horarios.length > 0) {
    const total = calcularTotalSimpleEscortEfectivo(dias, horarios.length, preciosAdmin);
    const hTxt = resumenHorariosSimpleEscort(horarios);
    const subidasTotal = SIMPLEESCORT_SUBIDAS * horarios.length;

    const msg = encodeURIComponent(
      `¡Hola! Quiero un Super Turbo en ${sitio.nombre} (${sitio.dominio}):\n` +
        `• ${dias} día${dias > 1 ? "s" : ""}\n` +
        `• 5 subidas por horario (${subidasTotal} al día)\n` +
        `• Foto 2,5×, etiqueta Super Turbo, color distintivo\n` +
        `• Horarios: ${hTxt}\n` +
        `• Total: ${clp(total)}`
    );
    const wa = enlaceWhatsApp(msg);

    return (
      <div className="cotizador" style={brandStyle}>
        <Header sitio={sitio} />
        <div className="result">
          <div className="tick-big">✓</div>
          <p className="rlabel">El precio de tu Super Turbo es</p>
          <div className="price">{clp(total)}</div>
          <div className="summary">
            <Row k="Plan" v="Super Turbo 5X" />
            <Row k="Duración" v={`${dias} día${dias > 1 ? "s" : ""}`} />
            <Row
              k="Subidas"
              v={`5 por horario · ${subidasTotal} al día`}
            />
            <Row k="Incluye" v="Foto 2,5×, etiqueta Super Turbo, color distintivo" />
            <Row k="Horarios" v={horariosCompletos ? "Full (4 franjas)" : `${horarios.length} franja${horarios.length > 1 ? "s" : ""}`} />
          </div>
          <a className="wa" href={wa} target="_blank" rel="noopener noreferrer">
            <span>💬</span> Pedir este aviso por WhatsApp
          </a>
          <button className="again" onClick={reset}>
            Cotizar otro aviso
          </button>
        </div>
      </div>
    );
  }

  // ---------- PASOS ----------
  return (
    <div className="cotizador" style={brandStyle}>
      <Header sitio={sitio} />

      <div className="prog">
        {STEPS.map((_, i) => (
          <i key={i} className={i < step ? "done" : i === step ? "now" : ""} />
        ))}
      </div>

      <div className="step">
        {cur === "dias" && (
          <>
            <h2 className="q">¿Por cuántos días?</h2>
            <p className="qsub qsub--tight">Super Turbo · define la duración de tu aviso.</p>
            <EjemploSuperTurbo />
            <p className="step-note step-note--compact">
              Foto <b>2,5× más grande</b>, etiqueta <b>Super Turbo</b>, color distintivo y{" "}
              <b>5 subidas</b> en cada horario. Hasta <b>20× más</b> llamadas y contactos según
              las franjas que definas.
            </p>
            {SIMPLEESCORT_DIAS.map((d) => (
              <Opt
                key={d}
                on={dias === d}
                icon={String(d)}
                title={`${d} día${d > 1 ? "s" : ""}`}
                desc={d === 7 ? "Mejor precio por día" : d === 1 ? "Para probar" : "Duración estándar"}
                onClick={() =>
                  pickAdvance(() => {
                    setDias(d);
                    setHorarios([]);
                  })
                }
              />
            ))}
            <BackBar onBack={back} show={step > 0} />
          </>
        )}

        {cur === "horarios" && dias && (
          <>
            <h2 className="q">¿En qué horarios?</h2>
            <p className="qsub">
              Toca una o más franjas. En cada una tu aviso <b>sube 5 veces</b> al día a los
              primeros lugares.
            </p>
            <p className="step-note">
              Con los <b>4 horarios</b> son <b>20 subidas diarias</b> (5 por franja). Si marcas
              menos, pagas el valor <b>por horario</b>; con los 4 aplica el precio{" "}
              <b>full horarios</b>.
            </p>
            <button
              type="button"
              className={"hall" + (horariosCompletos ? " on" : "")}
              onClick={toggleTodosHorarios}
            >
              {horariosCompletos ? "✓ Full horarios (4 franjas)" : "Full horarios (4 franjas)"}
            </button>
            <div className="hgrid hgrid--full">
              {FRANJAS_SIMPLEESCORT.map((_, i) => {
                const franja = franjaSimpleEscortPorIndice(i);
                return (
                  <button
                    key={i}
                    className={"hbtn" + (horarios.includes(i) ? " on" : "")}
                    onClick={() => toggleHorario(i)}
                  >
                    <span className="tick">{horarios.includes(i) ? "✓" : ""}</span>
                    <span className="hbtn__body">
                      <span className="hbtn__reloj">{franja.reloj}</span>
                      <span className="hbtn__texto">{franja.texto}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="runtot">
              {horarios.length ? (
                <>
                  {horarios.length} horario{horarios.length > 1 ? "s" : ""} ·{" "}
                  <b>{clp(calcularTotalSimpleEscortEfectivo(dias, horarios.length, preciosAdmin))}</b>
                  {horariosCompletos ? " (full)" : ""}
                </>
              ) : (
                "Toca al menos un horario"
              )}
            </p>
            <div className="bar">
              <button className="back" onClick={back}>
                Atrás
              </button>
              <button className="cta" disabled={!horarios.length} onClick={next}>
                Ver precio
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function EjemploSuperTurbo() {
  return (
    <EjemploAviso
      src="/simpleescort/superturbo-ejemplo.png"
      alt="Ejemplo de aviso Super Turbo en SimpleEscorts: foto grande, etiqueta morada y fondo distintivo"
      label="Así se ve un aviso Super Turbo en el listado"
      width={962}
      height={543}
    />
  );
}

function Header({ sitio }: { sitio: Sitio }) {
  return (
    <div className="hdr">
      <div>
        <span className="logo">{sitio.nombre}</span> <span className="dom">{sitio.dominio}</span>
      </div>
      <a className="switch" href="/">
        Cambiar sitio
      </a>
    </div>
  );
}

function Opt({
  on,
  icon,
  title,
  desc,
  onClick,
}: {
  on: boolean;
  icon: string;
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button className={"opt" + (on ? " on" : "")} onClick={onClick}>
      <span className="ic">{icon}</span>
      <span>
        <span className="tt">{title}</span>
        <span className="ds">{desc}</span>
      </span>
    </button>
  );
}

function BackBar({ onBack, show = true }: { onBack: () => void; show?: boolean }) {
  if (!show) return null;
  return (
    <div className="bar">
      <button className="back" onClick={onBack}>
        Atrás
      </button>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="row">
      <span>{k}</span>
      <span>{v}</span>
    </div>
  );
}
