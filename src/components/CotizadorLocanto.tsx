"use client";

import { useState } from "react";
import type { Sitio } from "@/types/sitio";
import {
  type LocantoPlan,
  LOCANTO_DIAS,
  LOCANTO_PLAN_INFO,
  planesLocanto,
  precioLocanto,
  clp,
} from "@/lib/locanto";
import { ejemplosLocanto } from "@/lib/locanto-ejemplos";
import { EjemploAviso } from "@/components/EjemploAviso";
import { enlaceWhatsApp } from "@/lib/whatsapp";

type Step = "plan" | "resultado";

const STEPS: Step[] = ["plan", "resultado"];

export default function CotizadorLocanto({ sitio }: { sitio: Sitio }) {
  const [step, setStep] = useState(0);
  const [plan, setPlan] = useState<LocantoPlan | null>(null);

  const brandStyle = {
    "--brand": sitio.color,
    "--brand-soft": sitio.color + "1f",
    "--accent": sitio.accent,
  } as unknown as React.CSSProperties;

  const cur = STEPS[step];
  const opciones = planesLocanto();

  function next() {
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }
  function reset() {
    setStep(0);
    setPlan(null);
  }

  const ejemplos = plan ? ejemplosLocanto(plan) : [];

  // ---------- RESULTADO ----------
  if (cur === "resultado" && plan) {
    const info = LOCANTO_PLAN_INFO[plan];
    const total = precioLocanto(plan);

    const msg = encodeURIComponent(
      `¡Hola! Quiero un aviso destacado en ${sitio.nombre} (${sitio.dominio}):\n` +
        `• ${LOCANTO_DIAS} días (visible 24 hrs por día)\n` +
        `• Plan: ${info.nombre}\n` +
        `• Total: ${clp(total)}`
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
            <Row k="Duración" v={`${LOCANTO_DIAS} días`} />
            <Row k="Visibilidad" v="24 hrs cada día" />
            <Row k="Plan" v={info.nombre} />
          </div>
          <p className="locanto-note locanto-note--result">
            Tu aviso rota dentro de su categoría: los TOP rotan entre TOP, la Galería entre
            Galería. Siempre visible las 24 horas durante los 7 días.
          </p>
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

  // ---------- PLAN ----------
  return (
    <div className="cotizador" style={brandStyle}>
      <Header sitio={sitio} />

      <div className="prog">
        {STEPS.map((_, i) => (
          <i key={i} className={i < step ? "done" : i === step ? "now" : ""} />
        ))}
      </div>

      <div className="step">
        <h2 className="q">
          ¿Qué plan
          <br />
          quieres?
        </h2>
        <p className="qsub qsub--tight">
          Toca TOP, Galería o ambos. Así ves cómo quedará tu aviso.
        </p>
        <p className="step-note">
          Tu anuncio se mueve dentro de <b>su propia categoría</b>: los TOP rotan entre los TOP
          (uno destacado arriba cada cierto tiempo), y lo mismo en Galería. Siempre visible todo
          el día.
        </p>
        {opciones.map(({ plan: p, precio, nombre, beneficio, icon }) => (
          <button
            key={p}
            className={"opt opt--plan" + (plan === p ? " on" : "")}
            onClick={() => setPlan(p)}
          >
            <span className="ic">{icon}</span>
            <span>
              <span className="tt">{nombre}</span>
              <span className="ds">{beneficio}</span>
            </span>
            <span className="pr">
              {clp(precio)}
              <small>7 días · total</small>
            </span>
          </button>
        ))}
        {ejemplos.length > 0 && (
          <div className="aviso-ejemplo--preview">
            {ejemplos.map((ej) => (
              <EjemploAviso
                key={ej.src}
                src={ej.src}
                alt={ej.alt}
                label={`Así se ve ${ej.label} en el listado`}
                width={ej.width}
                height={ej.height}
              />
            ))}
          </div>
        )}
        <div className="bar">
          <button className="back" onClick={back} disabled={step === 0}>
            Atrás
          </button>
          <button className="cta" disabled={!plan} onClick={next}>
            Continuar
          </button>
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
      <span>{v}</span>
    </div>
  );
}
