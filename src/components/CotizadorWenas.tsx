"use client";

import { useState } from "react";
import type { Sitio } from "@/types/sitio";
import {
  type WenasDias,
  WENAS_PLAN_INFO,
  planesWenas,
  precioWenasEfectivo,
  clp,
} from "@/lib/wenas";
import { enlaceWhatsApp } from "@/lib/whatsapp";

type Step = "dias" | "resultado";

const STEPS: Step[] = ["dias", "resultado"];

const DIAS_DESC: Record<WenasDias, string> = {
  7: "Una semana VIP en el listado",
  15: "Quince días de visibilidad VIP",
  30: "Un mes completo como VIP",
};

export default function CotizadorWenas({
  sitio,
  preciosAdmin = null,
}: {
  sitio: Sitio;
  preciosAdmin?: Record<string, number> | null;
}) {
  const [step, setStep] = useState(0);
  const [dias, setDias] = useState<WenasDias | null>(null);

  const brandStyle = {
    "--brand": sitio.color,
    "--brand-soft": sitio.color + "1f",
    "--accent": sitio.accent,
  } as unknown as React.CSSProperties;

  const cur = STEPS[step];
  const opciones = planesWenas(preciosAdmin);

  function next() {
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function reset() {
    setStep(0);
    setDias(null);
  }

  function pickAdvance(d: WenasDias) {
    setDias(d);
    setTimeout(next, 180);
  }

  if (cur === "resultado" && dias) {
    const total = precioWenasEfectivo(dias, preciosAdmin);
    const info = WENAS_PLAN_INFO.VIP;

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
          <p className="rlabel">El precio de tu publicación VIP es</p>
          <div className="price">{clp(total)}</div>
          <div className="summary">
            <Row k="Plan" v={info.nombre} />
            <Row k="Duración" v={`${dias} días`} />
          </div>
          <p className="escorcitas-note escorcitas-note--result">{info.detalle}</p>
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
        <h2 className="q">¿Cuántos días VIP?</h2>
        <p className="hint">En Wenas el plan es VIP. Eliges la duración y ves el precio al tiro.</p>
        <div className="opts">
          {opciones.map((o) => (
            <button
              key={o.dias}
              className={"opt" + (dias === o.dias ? " on" : "")}
              onClick={() => pickAdvance(o.dias)}
            >
              <span className="ic">★</span>
              <span>
                <span className="tt">
                  VIP · {o.dias} días — {clp(o.precio)}
                </span>
                <span className="ds">{DIAS_DESC[o.dias]}</span>
              </span>
            </button>
          ))}
        </div>
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

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="row">
      <span>{k}</span>
      <b>{v}</b>
    </div>
  );
}
