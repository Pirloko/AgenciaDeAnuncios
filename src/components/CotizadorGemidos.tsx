"use client";

import { useState } from "react";
import type { Sitio } from "@/types/sitio";
import {
  type GemidosDias,
  type GemidosPlan,
  GEMIDOS_PLAN_INFO,
  GEMIDOS_PLAN_ORDER,
  clp,
  ofertasGemidosPorPlan,
  precioGemidos,
} from "@/lib/gemidos";
import { enlaceWhatsApp } from "@/lib/whatsapp";

type Step = "plan" | "dias" | "resultado";

const STEPS: Step[] = ["plan", "dias", "resultado"];

export default function CotizadorGemidos({ sitio }: { sitio: Sitio }) {
  const [step, setStep] = useState(0);
  const [plan, setPlan] = useState<GemidosPlan | null>(null);
  const [dias, setDias] = useState<GemidosDias | null>(null);

  const brandStyle = {
    "--brand": sitio.color,
    "--brand-soft": sitio.color + "1f",
    "--accent": sitio.accent,
  } as unknown as React.CSSProperties;

  const cur = STEPS[step];
  const ofertasPlan = plan ? ofertasGemidosPorPlan(plan) : [];

  function next() {
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }
  function reset() {
    setStep(0);
    setPlan(null);
    setDias(null);
  }

  function pickPlan(p: GemidosPlan) {
    setPlan(p);
    setDias(null);
    setTimeout(next, 180);
  }

  function pickDias(d: GemidosDias) {
    setDias(d);
    setTimeout(next, 180);
  }

  if (cur === "resultado" && plan && dias) {
    const total = precioGemidos(plan, dias);
    const info = GEMIDOS_PLAN_INFO[plan];
    if (total == null) {
      return (
        <div className="cotizador" style={brandStyle}>
          <Header sitio={sitio} />
          <p className="qsub">Esa combinación no está disponible.</p>
          <button className="again" onClick={reset}>
            Volver a cotizar
          </button>
        </div>
      );
    }

    const msg = encodeURIComponent(
      `¡Hola! Quiero publicar en ${sitio.nombre} (${sitio.dominio}):\n` +
        `• Plan: ${info.nombre}\n` +
        `• ${dias} días\n` +
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
            <div className="row">
              <span>Plan</span>
              <b>{info.nombre}</b>
            </div>
            <div className="row">
              <span>Duración</span>
              <b>
                {dias} día{dias > 1 ? "s" : ""}
              </b>
            </div>
          </div>
          <a className="wa" href={wa} target="_blank" rel="noopener noreferrer">
            Pedir esta publicación por WhatsApp
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
        {cur === "plan" && (
          <>
            <h2 className="q">¿Qué plan quieres?</h2>
            <p className="qsub">Classic, Gold, Platinum, Diamond, Diamond VIP o Black Rose.</p>
            <div className="opts">
              {GEMIDOS_PLAN_ORDER.map((p) => {
                const info = GEMIDOS_PLAN_INFO[p];
                const desde = Math.min(...ofertasGemidosPorPlan(p).map((o) => o.precio));
                return (
                  <button
                    key={p}
                    type="button"
                    className={"opt" + (plan === p ? " on" : "")}
                    onClick={() => pickPlan(p)}
                  >
                    <span className="ic">◆</span>
                    <span>
                      <span className="tt">{info.nombre}</span>
                      <span className="ds">
                        {info.beneficio} Desde {clp(desde)}.
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {cur === "dias" && plan && (
          <>
            <h2 className="q">¿Por cuántos días?</h2>
            <p className="qsub">Plan {GEMIDOS_PLAN_INFO[plan].nombre}.</p>
            <div className="opts">
              {ofertasPlan.map((o) => (
                <button
                  key={`${o.plan}-${o.dias}`}
                  type="button"
                  className={"opt" + (dias === o.dias ? " on" : "")}
                  onClick={() => pickDias(o.dias)}
                >
                  <span className="ic">{o.dias}</span>
                  <span>
                    <span className="tt">
                      {o.dias} días — {clp(o.precio)}
                    </span>
                    <span className="ds">{GEMIDOS_PLAN_INFO[plan].nombre}</span>
                  </span>
                </button>
              ))}
            </div>
            <div className="bar">
              <button type="button" className="back" onClick={back}>
                Atrás
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
