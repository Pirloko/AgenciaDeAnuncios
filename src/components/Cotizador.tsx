"use client";

import { useMemo, useState } from "react";
import type { Sitio } from "@/types/sitio";
import { clp, precioUnitario, calcularTotal } from "@/lib/precios";
import { franjaDiurnaPorIndice, resumenHorarios } from "@/lib/horarios";
import { SKOKKA_EJEMPLOS } from "@/lib/skokka-ejemplos";
import { EjemploAviso } from "@/components/EjemploAviso";
import { enlaceWhatsApp } from "@/lib/whatsapp";
import {
  precioUnitarioPromoSkokka,
  totalPromoSkokka,
  type SkokkaPromosConfig,
} from "@/lib/promos-pagina-skokka";

type Step = "cuando" | "dias" | "subidas" | "nivel" | "resultado";

// 📲 WhatsApp: +56 9 6355 0717 (ver src/lib/whatsapp.ts)

export default function Cotizador({
  sitio,
  promosConfig = null,
}: {
  sitio: Sitio;
  /** Precios de Admin → Promociones Skokka (fuente única en público). */
  promosConfig?: SkokkaPromosConfig | null;
}) {
  const [step, setStep] = useState(0);
  const [dias, setDias] = useState<number | null>(null);
  const [subidas, setSubidas] = useState<number | null>(null);
  const [nivel, setNivel] = useState<string | null>(null);
  const [horarios, setHorarios] = useState<number[]>([]);
  const [incluyeMadrugada, setIncluyeMadrugada] = useState(false);

  const brandStyle = {
    "--brand": sitio.color,
    "--brand-soft": sitio.color + "1f",
    "--accent": sitio.accent,
  } as unknown as React.CSSProperties;

  const tieneDiurno = horarios.length > 0;
  const soloMadrugada = incluyeMadrugada && !tieneDiurno;

  const steps: Step[] = useMemo(
    () =>
      soloMadrugada
        ? ["cuando", "dias", "nivel", "resultado"]
        : ["cuando", "dias", "subidas", "nivel", "resultado"],
    [soloMadrugada]
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
    setDias(null);
    setSubidas(null);
    setNivel(null);
    setHorarios([]);
    setIncluyeMadrugada(false);
  }

  function pickAdvance(fn: () => void) {
    fn();
    setTimeout(next, 180);
  }

  const subidasDiurnas = tieneDiurno ? subidas : null;
  const subidasListas = soloMadrugada || (tieneDiurno && subidasDiurnas != null);

  const todosLosHorarios = sitio.horarios.map((_, i) => i);
  const horariosCompletos = horarios.length === sitio.horarios.length;
  const todosLosHorariosMarcados = horariosCompletos && incluyeMadrugada;
  const seleccionOk = tieneDiurno || incluyeMadrugada;

  function precioBloque(
    modalidad: "diurno" | "madrugada",
    subidasN: number,
    nivelId: string,
    cantidadHorarios: number
  ): number {
    if (promosConfig && dias) {
      const fromPromo =
        cantidadHorarios <= 1 && modalidad === "diurno"
          ? precioUnitarioPromoSkokka(promosConfig, modalidad, subidasN, dias, nivelId)
          : totalPromoSkokka(
              promosConfig,
              modalidad,
              subidasN,
              dias,
              nivelId,
              cantidadHorarios
            );
      if (fromPromo != null) return fromPromo;
    }
    if (cantidadHorarios <= 1 && modalidad === "diurno") {
      return precioUnitario(sitio, modalidad, subidasN, dias!, nivelId);
    }
    return calcularTotal(sitio, modalidad, subidasN, dias!, nivelId, cantidadHorarios);
  }

  /** Precio mostrado en el paso nivel (referencia según selección). */
  function precioNivel(nivelId: string): { valor: number; etiqueta: string } {
    if (!dias || !subidasListas) return { valor: 0, etiqueta: "" };

    if (soloMadrugada) {
      return {
        valor: precioBloque("madrugada", 6, nivelId, 1),
        etiqueta: "total",
      };
    }

    if (tieneDiurno && !incluyeMadrugada) {
      return {
        valor: precioBloque("diurno", subidasDiurnas!, nivelId, 1),
        etiqueta: "por horario",
      };
    }

    // Día + madrugada: total del pack actual
    const dia = precioBloque("diurno", subidasDiurnas!, nivelId, horarios.length);
    const mad = precioBloque("madrugada", 6, nivelId, 1);
    return { valor: dia + mad, etiqueta: "total pack" };
  }

  function totalAviso(nivelId: string): number {
    let total = 0;
    if (tieneDiurno && dias && subidasDiurnas) {
      total += precioBloque("diurno", subidasDiurnas, nivelId, horarios.length);
    }
    if (incluyeMadrugada && dias) {
      total += precioBloque("madrugada", 6, nivelId, 1);
    }
    return total;
  }

  // ---------- RESULTADO ----------
  if (cur === "resultado" && dias && subidasListas && nivel && seleccionOk) {
    const total = totalAviso(nivel);
    const nivelNombre = sitio.niveles.find((n) => n.id === nivel)?.nombre ?? nivel;

    const partesCuando: string[] = [];
    if (tieneDiurno) partesCuando.push("Durante el día (6:00–00:00)");
    if (incluyeMadrugada) partesCuando.push("Madrugada (00:00–6:00)");
    const cuando = partesCuando.join(" + ");

    const partesHorario: string[] = [];
    if (tieneDiurno) partesHorario.push(resumenHorarios(horarios));
    if (incluyeMadrugada) {
      partesHorario.push("00:00 a 06:00 hrs (12 de la noche a 6 de la mañana)");
    }
    const hTxt = partesHorario.join(" · ");

    const partesSubidas: string[] = [];
    if (tieneDiurno && subidasDiurnas) {
      partesSubidas.push(`${subidasDiurnas} al día (franjas diurnas)`);
    }
    if (incluyeMadrugada) partesSubidas.push("6 en madrugada");
    const subidasTxt = partesSubidas.join(" · ");

    const msg = encodeURIComponent(
      `¡Hola! Quiero un aviso destacado en ${sitio.nombre} (${sitio.dominio}):\n` +
        `• ${cuando}\n• ${dias} día${dias > 1 ? "s" : ""}\n• Subidas: ${subidasTxt}\n` +
        `• Nivel: ${nivelNombre}\n• Horarios: ${hTxt}\n• Total: ${clp(total)}`
    );
    const wa = enlaceWhatsApp(msg);

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
            <Row k="Subidas" v={subidasTxt} />
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
            <h2 className="q">¿Cuándo quieres que se vea?</h2>
            <p className="qsub">
              Toca las franjas que quieras. Puedes combinar día y madrugada.
            </p>
            <div className="horarios-inline">
              <button
                type="button"
                className={"hall" + (todosLosHorariosMarcados ? " on" : "")}
                onClick={() => {
                  if (todosLosHorariosMarcados) {
                    setHorarios([]);
                    setIncluyeMadrugada(false);
                  } else {
                    setHorarios(todosLosHorarios);
                    setIncluyeMadrugada(true);
                  }
                }}
              >
                {todosLosHorariosMarcados
                  ? "✓ Todos los horarios"
                  : "Todos los horarios"}
              </button>
              <div className="hgrid hgrid--full">
                {sitio.horarios.map((_, i) => {
                  const franja = franjaDiurnaPorIndice(i);
                  const on = horarios.includes(i);
                  return (
                    <button
                      key={i}
                      type="button"
                      className={"hbtn" + (on ? " on" : "")}
                      onClick={() =>
                        setHorarios((h) =>
                          h.includes(i) ? h.filter((x) => x !== i) : [...h, i]
                        )
                      }
                    >
                      <span className="tick">{on ? "✓" : ""}</span>
                      <span className="hbtn__body">
                        <span className="hbtn__reloj">{franja.reloj}</span>
                        <span className="hbtn__texto">{franja.texto}</span>
                      </span>
                    </button>
                  );
                })}
                <button
                  type="button"
                  className={
                    "hbtn hbtn--madrugada" + (incluyeMadrugada ? " on" : "")
                  }
                  onClick={() => setIncluyeMadrugada((v) => !v)}
                >
                  <span className="tick">{incluyeMadrugada ? "✓" : ""}</span>
                  <span className="hbtn__body">
                    <span className="hbtn__badge">Madrugada</span>
                    <span className="hbtn__reloj">00:00 a 06:00 hrs</span>
                    <span className="hbtn__texto">
                      12 de la noche a 6 de la mañana · bloque nocturno especial
                    </span>
                  </span>
                </button>
              </div>
              <p className="runtot">
                {!seleccionOk
                  ? "Toca al menos una franja"
                  : [
                      tieneDiurno
                        ? `${horarios.length} franja${horarios.length > 1 ? "s" : ""} del día`
                        : null,
                      incluyeMadrugada ? "madrugada" : null,
                    ]
                      .filter(Boolean)
                      .join(" + ")}
              </p>
            </div>
            <div className="bar">
              <button className="back" onClick={back}>
                Atrás
              </button>
              <button className="cta" disabled={!seleccionOk} onClick={next}>
                Continuar
              </button>
            </div>
          </>
        )}

        {cur === "dias" && (
          <>
            <h2 className="q">¿Por cuántos días?</h2>
            <p className="qsub">Cuántos días seguidos estará activo tu aviso.</p>
            {([[1, "Para probar"], [3, "El más pedido"], [7, "Mejor precio por día"]] as [number, string][]).map(
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
              quieres que suba?
            </h2>
            <p className="qsub">Cada «subida» lleva tu aviso de nuevo a los primeros lugares.</p>
            <p className="step-note">
              Las subidas son <b>en cada franja del día</b> que definiste
              {horarios.length > 0 && (
                <>
                  {" "}
                  ({horarios.length} franja{horarios.length > 1 ? "s" : ""})
                </>
              )}
              : con <b>3 subidas</b> sube 3 veces en cada horario; con <b>6 subidas</b>, 6 veces.
              {incluyeMadrugada && (
                <>
                  {" "}
                  La <b>madrugada</b> siempre incluye 6 subidas.
                </>
              )}
            </p>
            {([[3, "3 subidas en cada horario"], [6, "6 subidas en cada horario"]] as [number, string][]).map(
              ([n, ds]) => (
                <Opt
                  key={n}
                  on={subidas === n}
                  icon={`↑${n}`}
                  title={`${n} subidas`}
                  desc={ds}
                  onClick={() => pickAdvance(() => setSubidas(n))}
                />
              )
            )}
            <BackBar onBack={back} />
          </>
        )}

        {cur === "nivel" && subidasListas && dias && (
          <>
            <h2 className="q">
              ¿Qué tan destacado
              <br />
              lo quieres?
            </h2>
            <p className="qsub qsub--tight">
              Toca TOP, Súper Top o Top All in One. Así ves cómo quedará tu aviso.
            </p>
            {sitio.niveles.map((n) => {
              const { valor, etiqueta } = precioNivel(n.id);
              return (
                <button
                  key={n.id}
                  className={"opt" + (nivel === n.id ? " on" : "")}
                  onClick={() => setNivel(n.id)}
                >
                  <span>
                    <span className="tt">{n.nombre}</span>
                    <span className="ds">{n.beneficio}</span>
                  </span>
                  <span className="pr">
                    {clp(valor)}
                    <small>{etiqueta}</small>
                  </span>
                </button>
              );
            })}
            {nivel && SKOKKA_EJEMPLOS[nivel] && (
              <div className="aviso-ejemplo--preview">
                <EjemploAviso
                  src={SKOKKA_EJEMPLOS[nivel].src}
                  alt={SKOKKA_EJEMPLOS[nivel].alt}
                  label={`Así se ve ${SKOKKA_EJEMPLOS[nivel].label} en el listado`}
                  width={SKOKKA_EJEMPLOS[nivel].width}
                  height={SKOKKA_EJEMPLOS[nivel].height}
                />
              </div>
            )}
            <div className="bar">
              <button className="back" onClick={back}>
                Atrás
              </button>
              <button className="cta" disabled={!nivel} onClick={next}>
                Continuar
              </button>
            </div>
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
