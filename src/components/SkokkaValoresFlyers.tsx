"use client";

import { useRef, useState } from "react";
import Image from "next/image";

type FlyerId =
  | "3-1"
  | "6-1"
  | "3-3"
  | "6-3"
  | "3-7"
  | "6-7"
  | "madrugada";

const FLYERS_DIA: {
  id: FlyerId;
  subidas: number;
  dias: number;
  src: string;
  labelGrande: string;
  labelChica: string;
}[] = [
  {
    id: "3-1",
    subidas: 3,
    dias: 1,
    src: "/skokka/valores/3subidas1dia.png",
    labelGrande: "3 subidas · 1 día",
    labelChica: "Para probar",
  },
  {
    id: "6-1",
    subidas: 6,
    dias: 1,
    src: "/skokka/valores/6subidas1dia.png",
    labelGrande: "6 subidas · 1 día",
    labelChica: "Más subidas",
  },
  {
    id: "3-3",
    subidas: 3,
    dias: 3,
    src: "/skokka/valores/3subidas3dias.png",
    labelGrande: "3 subidas · 3 días",
    labelChica: "El más pedido",
  },
  {
    id: "6-3",
    subidas: 6,
    dias: 3,
    src: "/skokka/valores/6subidas3dias.png",
    labelGrande: "6 subidas · 3 días",
    labelChica: "Más visibilidad",
  },
  {
    id: "3-7",
    subidas: 3,
    dias: 7,
    src: "/skokka/valores/3subidas7dias.png",
    labelGrande: "3 subidas · 7 días",
    labelChica: "Toda la semana",
  },
  {
    id: "6-7",
    subidas: 6,
    dias: 7,
    src: "/skokka/valores/6subidas7dias.png",
    labelGrande: "6 subidas · 7 días",
    labelChica: "Máxima cobertura",
  },
];

const FLYER_MADRUGADA = {
  id: "madrugada" as const,
  src: "/skokka/valores/madrugada.png",
  labelGrande: "Madrugada",
  labelChica: "00:00 a 06:00 · 6 subidas incluidas",
};

type Modo = "dia" | "madrugada";

export default function SkokkaValoresFlyers() {
  const [modo, setModo] = useState<Modo>("dia");
  const [flyerId, setFlyerId] = useState<FlyerId>("3-3");
  const imagenRef = useRef<HTMLDivElement>(null);

  const flyerActivo =
    modo === "madrugada"
      ? FLYER_MADRUGADA
      : FLYERS_DIA.find((f) => f.id === flyerId) ?? FLYERS_DIA[2];

  function irAImagen() {
    requestAnimationFrame(() => {
      const el = imagenRef.current;
      if (!el) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" });
    });
  }

  return (
    <section className="valores-block valores-block--skokka-flyers">
      <h2 className="valores-h2">Valores Skokka</h2>
      <p className="skokka-flyers__ayuda">
        1) Elige <b>Día</b> o <b>Madrugada</b>. 2) Toca el pack. 3) Mira la imagen con los precios.
      </p>

      <div className="skokka-flyers__modos" role="tablist" aria-label="Tipo de horario">
        <button
          type="button"
          role="tab"
          aria-selected={modo === "dia"}
          className={"skokka-flyers__modo" + (modo === "dia" ? " on" : "")}
          onClick={() => {
            setModo("dia");
            setFlyerId("3-3");
            irAImagen();
          }}
        >
          <span className="skokka-flyers__modo-ico" aria-hidden="true">
            ☀️
          </span>
          <span className="skokka-flyers__modo-txt">
            <strong>Durante el día</strong>
            <small>06:00 a 00:00</small>
          </span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={modo === "madrugada"}
          className={
            "skokka-flyers__modo skokka-flyers__modo--mad" +
            (modo === "madrugada" ? " on" : "")
          }
          onClick={() => {
            setModo("madrugada");
            irAImagen();
          }}
        >
          <span className="skokka-flyers__modo-ico" aria-hidden="true">
            🌙
          </span>
          <span className="skokka-flyers__modo-txt">
            <strong>Madrugada</strong>
            <small>00:00 a 06:00</small>
          </span>
        </button>
      </div>

      {modo === "dia" && (
        <div className="skokka-flyers__packs" role="list">
          {FLYERS_DIA.map((f) => (
            <button
              key={f.id}
              type="button"
              role="listitem"
              className={"skokka-flyers__pack" + (flyerId === f.id ? " on" : "")}
              onClick={() => {
                setFlyerId(f.id);
                irAImagen();
              }}
            >
              <span className="skokka-flyers__pack-main">{f.labelGrande}</span>
              <span className="skokka-flyers__pack-sub">{f.labelChica}</span>
            </button>
          ))}
        </div>
      )}

      {modo === "madrugada" && (
        <p className="skokka-flyers__mad-note">
          Un solo bloque nocturno. Precio fijo · 6 subidas incluidas.
        </p>
      )}

      <div className="skokka-flyers__visor" ref={imagenRef}>
        <p className="skokka-flyers__visor-tit">{flyerActivo.labelGrande}</p>
        <div className="skokka-flyers__img-wrap">
          <Image
            src={flyerActivo.src}
            alt={`Valores Skokka: ${flyerActivo.labelGrande}`}
            width={1080}
            height={1920}
            className="skokka-flyers__img"
            sizes="(max-width: 720px) 100vw, 640px"
            priority
          />
        </div>
        <p className="skokka-flyers__pinch">
          Puedes agrandar la imagen con dos dedos si lo necesitas.
        </p>
      </div>
    </section>
  );
}
