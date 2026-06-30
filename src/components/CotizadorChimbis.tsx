"use client";

import { useMemo, useState } from "react";
import type { Sitio } from "@/types/sitio";
import {
  type ChimbisRegion,
  type ChimbisPlan,
  CHIMBIS_REGION_LABEL,
  CHIMBIS_PLAN_INFO,
  diasChimbis,
  subidasChimbis,
  planesChimbis,
  nombrePlanChimbis,
  precioChimbis,
  clp,
} from "@/lib/chimbis";

type Step = "region" | "dias" | "subidas" | "plan" | "resultado";

const NUMERO_WHATSAPP = "56963550717";

const STEPS: Step[] = ["region", "dias", "subidas", "plan", "resultado"];

export default function CotizadorChimbis({ sitio }: { sitio: Sitio }) {
  const [step, setStep] = useState(0);
  const [region, setRegion] = useState<ChimbisRegion | null>(null);
  const [dias, setDias] = useState<number | null>(null);
  const [subidas, setSubidas] = useState<number | null>(null);
  const [plan, setPlan] = useState<ChimbisPlan | null>(null);

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
    setRegion(null);
    setDias(null);
    setSubidas(null);
    setPlan(null);
  }

  function pickAdvance(fn: () => void) {
    fn();
    setTimeout(next, 180);
  }

  const diasOpciones = useMemo(
    () => (region ? diasChimbis(region) : []),
    [region]
  );
  const subidasOpciones = useMemo(
    () => (region && dias ? subidasChimbis(region, dias) : []),
    [region, dias]
  );
  const planesOpciones = useMemo(
    () => (region && dias && subidas ? planesChimbis(region, dias, subidas) : []),
    [region, dias, subidas]
  );

  // ---------- RESULTADO ----------
  if (cur === "resultado" && region && dias && subidas && plan) {
    const total = precioChimbis(region, dias, subidas, plan) ?? 0;
    const planNombre = nombrePlanChimbis(plan, subidas);

    const msg = encodeURIComponent(
      `¡Hola! Quiero un aviso destacado en ${sitio.nombre} (${sitio.dominio}):\n` +
        `• Zona: ${CHIMBIS_REGION_LABEL[region]}\n` +
        `• ${dias} día${dias > 1 ? "s" : ""}\n` +
        `• ${subidas} subidas\n` +
        `• Plan: ${planNombre}\n` +
        `• Total: ${clp(total)}`
    );
    const wa = `https://wa.me/${NUMERO_WHATSAPP}?text=${msg}`;

    return (
      <div className="cotizador" style={brandStyle}>
        <Header sitio={sitio} />
        <div className="result">
          <div className="tick-big">✓</div>
          <p className="rlabel">El precio de tu aviso destacado es</p>
          <div className="price">{clp(total)}</div>
          <div className="summary">
            <Row k="Zona" v={CHIMBIS_REGION_LABEL[region]} />
            <Row k="Duración" v={`${dias} día${dias > 1 ? "s" : ""}`} />
            <Row k="Subidas" v={`${subidas} en total`} />
            <Row k="Plan" v={planNombre} />
          </div>
          <p className="chimbis-note chimbis-note--result">
            Recordá: en Chimbis solo se publican avisos con fotos 100% reales comprobables. También
            podés subir videos.
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
        {cur === "region" && (
          <>
            <h2 className="q">¿Dónde querés publicar?</h2>
            <p className="qsub">Elegí la zona de Chile para tu aviso destacado.</p>
            <Opt
              on={region === "santiago"}
              icon="🏙️"
              title="Santiago / RM"
              desc="Región Metropolitana de Santiago"
              onClick={() =>
                pickAdvance(() => {
                  setRegion("santiago");
                  setDias(null);
                  setSubidas(null);
                  setPlan(null);
                })
              }
            />
            <Opt
              on={region === "ciudades"}
              icon="🗺️"
              title="Otras ciudades"
              desc="Ciudades del norte o sur de Chile"
              onClick={() =>
                pickAdvance(() => {
                  setRegion("ciudades");
                  setDias(null);
                  setSubidas(null);
                  setPlan(null);
                })
              }
            />
            <p className="chimbis-note">
              En Chimbis solo se publican avisos destacados con <b>fotos 100% reales comprobables</b>.
              También podés subir <b>videos</b>.
            </p>
            <BackBar onBack={back} show={step > 0} />
          </>
        )}

        {cur === "dias" && region && (
          <>
            <h2 className="q">¿Por cuántos días?</h2>
            <p className="qsub">
              {CHIMBIS_REGION_LABEL[region]} · elegí la duración de tu aviso.
            </p>
            {diasOpciones.map((d) => (
              <Opt
                key={d}
                on={dias === d}
                icon={String(d)}
                title={`${d} día${d > 1 ? "s" : ""}`}
                desc={d === 1 ? "Publicación por un día" : d === 15 ? "Mejor precio por día" : "Duración estándar"}
                onClick={() =>
                  pickAdvance(() => {
                    setDias(d);
                    setSubidas(null);
                    setPlan(null);
                  })
                }
              />
            ))}
            <BackBar onBack={back} />
          </>
        )}

        {cur === "subidas" && region && dias && (
          <>
            <h2 className="q">
              ¿Cuántas veces
              <br />
              querés que suba?
            </h2>
            <p className="qsub">
              Cada «subida» lleva tu aviso de nuevo a los primeros lugares del listado.
            </p>
            <p className="step-note">
              En Chimbis las subidas son el <b>total del período</b> ({dias} día
              {dias > 1 ? "s" : ""}): tu aviso sube esa cantidad de veces a los primeros puestos
              durante esos días.
            </p>
            {subidasOpciones.map((n) => (
              <Opt
                key={n}
                on={subidas === n}
                icon={`↑${n}`}
                title={`${n} subidas`}
                desc={`Sube ${n} veces a los primeros lugares`}
                onClick={() =>
                  pickAdvance(() => {
                    setSubidas(n);
                    setPlan(null);
                  })
                }
              />
            ))}
            <BackBar onBack={back} />
          </>
        )}

        {cur === "plan" && region && dias && subidas && (
          <>
            <h2 className="q">
              ¿Qué plan
              <br />
              querés?
            </h2>
            <p className="qsub">Elegí entre TOP, Destacado e Historias según lo que necesites.</p>
            {planesOpciones.map(({ plan: p, precio }) => {
              const info = CHIMBIS_PLAN_INFO[p];
              return (
                <button
                  key={p}
                  className={"opt opt--plan" + (plan === p ? " on" : "")}
                  onClick={() => pickAdvance(() => setPlan(p))}
                >
                  <span>
                    <span className="tt">
                      {p === "TOP" ? `TOP ${subidas} subidas` : info.nombre}
                      {info.destacado && <span className="ptag ptag--dest">Destacado</span>}
                      {info.historias && <span className="ptag ptag--hist">Historias</span>}
                    </span>
                    <span className="ds">{info.beneficio}</span>
                  </span>
                  <span className="pr">
                    {clp(precio)}
                    <small>total</small>
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
