"use client";

import { useMemo, useState } from "react";
import type { Sitio, Modalidad } from "@/types/sitio";
import { clp, precioUnitario, calcularTotal } from "@/lib/precios";
import { franjaDiurnaPorIndice, resumenHorarios } from "@/lib/horarios";

type Step = "cuando" | "dias" | "subidas" | "nivel" | "resultado";

// 📲 Poné tu número con código país, sin signos (ej: "56912345678").
// Vacío = WhatsApp deja elegir contacto.
const NUMERO_WHATSAPP = "";

export default function Cotizador({ sitio }: { sitio: Sitio }) {
  const [step, setStep] = useState(0);
  const [modalidad, setModalidad] = useState<Modalidad | null>(null);
  const [dias, setDias] = useState<number | null>(null);
  const [subidas, setSubidas] = useState<number | null>(null);
  const [nivel, setNivel] = useState<string | null>(null);
  const [horarios, setHorarios] = useState<number[]>([]);

  const brandStyle = {
    "--brand": sitio.color,
    "--brand-soft": sitio.color + "1f",
    "--accent": sitio.accent,
  } as unknown as React.CSSProperties;

  const steps: Step[] = useMemo(
    () =>
      modalidad === "madrugada"
        ? ["cuando", "dias", "nivel", "resultado"]
        : ["cuando", "dias", "subidas", "nivel", "resultado"],
    [modalidad]
  );
  const cur = steps[step];

  function next() {
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }
  function reset() {
    setStep(0);
    setModalidad(null);
    setDias(null);
    setSubidas(null);
    setNivel(null);
    setHorarios([]);
  }

  // avanza solo al elegir (como un test)
  function pickAdvance(fn: () => void) {
    fn();
    setTimeout(next, 180);
  }

  const subidasEfectivas = modalidad === "madrugada" ? 6 : subidas;

  function toggleHorario(i: number) {
    setHorarios((h) => (h.includes(i) ? h.filter((x) => x !== i) : [...h, i]));
  }

  const todosLosHorarios = sitio.horarios.map((_, i) => i);
  const horariosCompletos = horarios.length === sitio.horarios.length;

  function toggleTodosHorarios() {
    setHorarios(horariosCompletos ? [] : todosLosHorarios);
  }

  // ---------- RESULTADO ----------
  if (cur === "resultado" && modalidad && dias && subidasEfectivas && nivel) {
    const total = calcularTotal(sitio, modalidad, subidasEfectivas, dias, nivel, horarios.length);
    const nivelNombre = sitio.niveles.find((n) => n.id === nivel)?.nombre ?? nivel;
    const cuando = modalidad === "diurno" ? "Durante el día (6:00–00:00)" : "Madrugada (00:00–6:00)";
    const hTxt =
      modalidad === "diurno"
        ? resumenHorarios(horarios)
        : "00:00 a 06:00 hrs (12 de la noche a 6 de la mañana)";

    const msg = encodeURIComponent(
      `¡Hola! Quiero un aviso destacado en ${sitio.nombre} (${sitio.dominio}):\n` +
        `• ${cuando}\n• ${dias} día${dias > 1 ? "s" : ""}\n• ${subidasEfectivas} subidas\n` +
        `• Nivel: ${nivelNombre}\n• Horarios: ${hTxt}\n• Total: ${clp(total)}`
    );
    const wa = NUMERO_WHATSAPP
      ? `https://wa.me/${NUMERO_WHATSAPP}?text=${msg}`
      : `https://wa.me/?text=${msg}`;

    return (
      <div className="cotizador" style={brandStyle}>
        <Header sitio={sitio} />
        <div className="result">
          <div className="tick-big">✓</div>
          <p className="rlabel">El precio de tu aviso destacado es</p>
          <div className="price">{clp(total)}</div>
          <div className="summary">
            <Row k="Cuándo" v={cuando} />
            <Row k="Duración" v={`${dias} día${dias > 1 ? "s" : ""}`} />
            <Row k="Subidas" v={`${subidasEfectivas} al día`} />
            <Row k="Nivel" v={nivelNombre} />
            <Row k="Horarios" v={hTxt} />
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
        {steps.map((_, i) => (
          <i key={i} className={i < step ? "done" : i === step ? "now" : ""} />
        ))}
      </div>

      <div className="step">
        {cur === "cuando" && (
          <>
            <h2 className="q">¿Cuándo querés que se vea?</h2>
            <p className="qsub">Elegí la franja del día.</p>
            <Opt
              on={modalidad === "diurno"}
              icon="☀️"
              title="Durante el día"
              desc="De 6:00 a 00:00 hrs"
              onClick={() => {
                setModalidad("diurno");
              }}
            />
            {modalidad === "diurno" && (
              <div className="horarios-inline">
                <p className="qsub horarios-inline__hint">
                  Tocá una o más franjas. Mientras más elijas, más se ve tu aviso.
                </p>
                <button
                  type="button"
                  className={"hall" + (horariosCompletos ? " on" : "")}
                  onClick={toggleTodosHorarios}
                >
                  {horariosCompletos ? "✓ Todos los horarios" : "Todos los horarios"}
                </button>
                <div className="hgrid hgrid--full">
                  {sitio.horarios.map((_, i) => {
                    const franja = franjaDiurnaPorIndice(i);
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
                  {horarios.length
                    ? `${horarios.length} horario${horarios.length > 1 ? "s" : ""} elegido${horarios.length > 1 ? "s" : ""}`
                    : "Elegí al menos un horario"}
                </p>
              </div>
            )}
            <Opt
              on={modalidad === "madrugada"}
              icon="🌙"
              title="En la madrugada"
              desc="De 00:00 a 6:00 hrs"
              onClick={() =>
                pickAdvance(() => {
                  setModalidad("madrugada");
                  setHorarios([]);
                })
              }
            />
            <div className="bar">
              <button className="back" onClick={back}>
                Atrás
              </button>
              {modalidad === "diurno" && (
                <button className="cta" disabled={!horarios.length} onClick={next}>
                  Continuar
                </button>
              )}
            </div>
          </>
        )}

        {cur === "dias" && (
          <>
            <h2 className="q">¿Por cuántos días?</h2>
            <p className="qsub">Cuántos días seguidos estará activo tu aviso.</p>
            {([[1, "Para probar"], [3, "El más elegido"], [7, "Mejor precio por día"]] as [number, string][]).map(
              ([d, nota]) => (
                <Opt
                  key={d}
                  on={dias === d}
                  icon={String(d)}
                  title={`${d} día${d > 1 ? "s" : ""}`}
                  desc={nota}
                  onClick={() => pickAdvance(() => setDias(d))}
                />
              )
            )}
            <BackBar onBack={back} />
          </>
        )}

        {cur === "subidas" && (
          <>
            <h2 className="q">
              ¿Cuántas veces
              <br />
              querés que suba?
            </h2>
            <p className="qsub">Cada «subida» lleva tu aviso de nuevo a los primeros lugares.</p>
            <p className="step-note">
              Las subidas son <b>en cada horario</b> que elegiste
              {horarios.length > 0 && (
                <>
                  {" "}
                  ({horarios.length} franja{horarios.length > 1 ? "s" : ""})
                </>
              )}
              : con <b>3 subidas</b> sube 3 veces en cada horario seleccionado; con <b>6 subidas</b>, 6 veces en cada horario.
            </p>
            {([[3, "3 subidas en cada horario"], [6, "6 subidas en cada horario"]] as [number, string][]).map(([n, ds]) => (
              <Opt
                key={n}
                on={subidas === n}
                icon={`↑${n}`}
                title={`${n} subidas`}
                desc={ds}
                onClick={() => pickAdvance(() => setSubidas(n))}
              />
            ))}
            <BackBar onBack={back} />
          </>
        )}

        {cur === "nivel" && subidasEfectivas && dias && (
          <>
            <h2 className="q">
              ¿Qué tan destacado
              <br />
              lo querés?
            </h2>
            <p className="qsub">
              {modalidad === "diurno" ? "Precio por cada horario que elijas." : "Precio total de la madrugada."}
            </p>
            {sitio.niveles.map((n) => {
              const p = precioUnitario(sitio, modalidad!, subidasEfectivas, dias, n.id);
              return (
                <button
                  key={n.id}
                  className={"opt" + (nivel === n.id ? " on" : "")}
                  onClick={() => pickAdvance(() => setNivel(n.id))}
                >
                  <span>
                    <span className="tt">{n.nombre}</span>
                    <span className="ds">{n.beneficio}</span>
                  </span>
                  <span className="pr">
                    {clp(p)}
                    <small>{modalidad === "diurno" ? "por horario" : "total"}</small>
                  </span>
                </button>
              );
            })}
            <BackBar onBack={back} />
          </>
        )}

      </div>
    </div>
  );
}

/* ---------- subcomponentes ---------- */
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

function BackBar({ onBack }: { onBack: () => void }) {
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
