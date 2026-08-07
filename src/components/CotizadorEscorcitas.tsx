"use client";

import { useState } from "react";
import type { Sitio } from "@/types/sitio";
import {
  type EscorcitasTipo,
  type EscorcitasDias,
  type EscorcitasPlan,
  ESCORCITAS_TIPO_LABEL,
  ESCORCITAS_PLAN_INFO,
  planesEscorcitas,
  precioEscorcitasEfectivo,
  clp,
} from "@/lib/escorcitas";
import { enlaceWhatsApp } from "@/lib/whatsapp";
import { ESCORCITAS_EJEMPLOS } from "@/lib/escorcitas-ejemplos";
import { EjemploAviso } from "@/components/EjemploAviso";

type Step = "tipo" | "dias" | "plan" | "resultado";

const STEPS: Step[] = ["tipo", "dias", "plan", "resultado"];

const TIPOS: { id: EscorcitasTipo; icon: string; desc: string }[] = [
  { id: "mujer", icon: "♀", desc: "Publicación en la sección de escorts mujer" },
  { id: "trans", icon: "⚧", desc: "Publicación en la sección de escorts trans" },
  { id: "masculino", icon: "♂", desc: "Publicación en la sección de escorts masculino" },
];

const DIAS_OPTS: { d: EscorcitasDias; desc: string }[] = [
  { d: 1, desc: "Publicación por un día" },
  { d: 3, desc: "Tres días en el listado" },
  { d: 7, desc: "Una semana completa" },
];

export default function CotizadorEscorcitas({
  sitio,
  preciosAdmin = null,
}: {
  sitio: Sitio;
  preciosAdmin?: Record<string, number> | null;
}) {
  const [step, setStep] = useState(0);
  const [tipo, setTipo] = useState<EscorcitasTipo | null>(null);
  const [dias, setDias] = useState<EscorcitasDias | null>(null);
  const [plan, setPlan] = useState<EscorcitasPlan | null>(null);

  const brandStyle = {
    "--brand": sitio.color,
    "--brand-soft": sitio.color + "1f",
    "--accent": sitio.accent,
  } as unknown as React.CSSProperties;

  const cur = STEPS[step];

  function next() {
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }
  function reset() {
    setStep(0);
    setTipo(null);
    setDias(null);
    setPlan(null);
  }

  function pickAdvance(fn: () => void) {
    fn();
    setTimeout(next, 180);
  }

  if (cur === "resultado" && tipo && dias && plan) {
    const info = ESCORCITAS_PLAN_INFO[plan];
    const total = precioEscorcitasEfectivo(dias, plan, preciosAdmin);

    const msg = encodeURIComponent(
      `¡Hola! Quiero publicar en ${sitio.nombre} (${sitio.dominio}):\n` +
        `• Tipo: ${ESCORCITAS_TIPO_LABEL[tipo]}\n` +
        `• ${dias} día${dias > 1 ? "s" : ""}\n` +
        `• Plan: ${info.nombre}\n` +
        `• Total: ${clp(total)}`
    );
    const wa = enlaceWhatsApp(msg);

    return (
      <div className="cotizador" style={brandStyle}>
        <Header sitio={sitio} />
        <div className="result">
          <div className="tick-big">✓</div>
          <p className="rlabel">El precio de tu publicación es</p>
          <div className="price">{clp(total)}</div>
          <div className="summary">
            <Row k="Tipo" v={ESCORCITAS_TIPO_LABEL[tipo]} />
            <Row k="Duración" v={`${dias} día${dias > 1 ? "s" : ""}`} />
            <Row k="Plan" v={info.nombre} />
          </div>
          <p className="escorcitas-note escorcitas-note--result">{info.detalle}</p>
          <p className="escorcitas-note escorcitas-note--result">
            Tu anuncio rota dentro de su categoría ({info.nombre}): los de la misma plan rotan
            entre sí y van destacándose arriba de forma periódica.
          </p>
          <a className="wa" href={wa} target="_blank" rel="noopener noreferrer">
            <span>💬</span> Pedir esta publicación por WhatsApp
          </a>
          <button className="again" onClick={reset}>
            Cotizar otra publicación
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cotizador" style={brandStyle}>
      <Header sitio={sitio} />

      <div className="prog">
        {STEPS.map((_, i) => (
          <i key={i} className={i < step ? "done" : i === step ? "now" : ""} />
        ))}
      </div>

      <div className="step">
        {cur === "tipo" && (
          <>
            <h2 className="q">¿Qué tipo de escort?</h2>
            <p className="qsub">Toca la categoría en la que quieres publicar en Escorcitas.</p>
            {TIPOS.map(({ id, icon, desc }) => (
              <Opt
                key={id}
                on={tipo === id}
                icon={icon}
                title={ESCORCITAS_TIPO_LABEL[id]}
                desc={desc}
                onClick={() =>
                  pickAdvance(() => {
                    setTipo(id);
                    setDias(null);
                    setPlan(null);
                  })
                }
              />
            ))}
            <BackBar onBack={back} show={step > 0} />
          </>
        )}

        {cur === "dias" && tipo && (
          <>
            <h2 className="q">¿Por cuántos días?</h2>
            <p className="qsub">
              {ESCORCITAS_TIPO_LABEL[tipo]} · define la duración de tu publicación.
            </p>
            {DIAS_OPTS.map(({ d, desc }) => (
              <Opt
                key={d}
                on={dias === d}
                icon={String(d)}
                title={`${d} día${d > 1 ? "s" : ""}`}
                desc={desc}
                onClick={() =>
                  pickAdvance(() => {
                    setDias(d);
                    setPlan(null);
                  })
                }
              />
            ))}
            <BackBar onBack={back} />
          </>
        )}

        {cur === "plan" && tipo && dias && (
          <>
            <h2 className="q">
              ¿Qué plan
              <br />
              quieres?
            </h2>
            <p className="qsub qsub--tight">
              Toca el plan. Así ves cómo quedará tu anuncio en el listado.
            </p>
            <p className="step-note">
              Los anuncios rotan dentro de <b>su propia categoría</b>: TOP abajo, PREMIUM más arriba
              y GOLD en la parte más alta del listado.
            </p>
            {planesEscorcitas(dias, preciosAdmin).map(({ plan: p, precio, nombre, beneficio, detalle, icon }) => (
              <button
                key={p}
                className={"opt opt--plan" + (plan === p ? " on" : "")}
                onClick={() => setPlan(p)}
              >
                <span className="ic">{icon}</span>
                <span>
                  <span className="tt">
                    {nombre}
                    {p === "TOP" && <span className="ptag ptag--top">TOP</span>}
                    {p === "PREMIUM" && <span className="ptag ptag--prem">Premium</span>}
                    {p === "GOLD" && <span className="ptag ptag--gold">Gold</span>}
                  </span>
                  <span className="ds">{beneficio}</span>
                  <span className="ds ds--detail">{detalle}</span>
                </span>
                <span className="pr">
                  {clp(precio)}
                  <small>{dias} día{dias > 1 ? "s" : ""} · total</small>
                </span>
              </button>
            ))}
            {plan && (
              <div className="aviso-ejemplo--preview">
                <EjemploAviso
                  src={ESCORCITAS_EJEMPLOS[plan].src}
                  alt={ESCORCITAS_EJEMPLOS[plan].alt}
                  label={`Así se ve ${ESCORCITAS_EJEMPLOS[plan].label} en el listado`}
                  width={ESCORCITAS_EJEMPLOS[plan].width}
                  height={ESCORCITAS_EJEMPLOS[plan].height}
                />
              </div>
            )}
            <div className="bar">
              <button className="back" onClick={back}>
                Atrás
              </button>
              <button className="cta" disabled={!plan} onClick={next}>
                Continuar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
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
