"use client";

import { useState } from "react";
import {
  CHIMBIS_PRECIOS,
  CHIMBIS_PLAN_INFO,
  CHIMBIS_REGION_LABEL,
  clp,
  type ChimbisPlan,
  type ChimbisRegion,
} from "@/lib/chimbis";
import ValoresTabla from "@/components/ValoresTabla";

const CHIMBIS_PLAN_ORDER: ChimbisPlan[] = [
  "TOP",
  "TOP_DESTACADO",
  "TOP_HISTORIAS",
  "TOP_DESTACADO_HISTORIA",
];

const REGIONES: ChimbisRegion[] = ["santiago", "ciudades"];

function TablasRegionChimbis({ region }: { region: ChimbisRegion }) {
  return (
    <>
      {Object.keys(CHIMBIS_PRECIOS[region])
        .map(Number)
        .sort((a, b) => a - b)
        .map((dias) => {
          const subidasKeys = Object.keys(CHIMBIS_PRECIOS[region][dias])
            .map(Number)
            .sort((a, b) => a - b);
          const planesDisp = CHIMBIS_PLAN_ORDER.filter((p) =>
            subidasKeys.some((s) => CHIMBIS_PRECIOS[region][dias][s]?.[p] != null)
          );

          const columnas = ["Subidas", ...planesDisp.map((p) => CHIMBIS_PLAN_INFO[p].nombre)];
          const filas = subidasKeys.map((subidas) => ({
            id: `${dias}-${subidas}`,
            etiqueta: `${subidas} subidas`,
            valores: planesDisp.map((p) => {
              const precio = CHIMBIS_PRECIOS[region][dias][subidas]?.[p];
              return precio != null ? clp(precio) : "—";
            }),
          }));

          return (
            <div key={dias} className="valores-sub">
              <h3 className="valores-h3">
                Publicación por {dias} día{dias > 1 ? "s" : ""}
              </h3>
              <ValoresTabla columnas={columnas} filas={filas} />
            </div>
          );
        })}
    </>
  );
}

export default function ChimbisValoresRegiones({ expandirTodo = false }: { expandirTodo?: boolean }) {
  const [abiertas, setAbiertas] = useState<Record<ChimbisRegion, boolean>>({
    santiago: expandirTodo,
    ciudades: expandirTodo,
  });

  function toggle(region: ChimbisRegion) {
    if (expandirTodo) return;
    setAbiertas((prev) => ({ ...prev, [region]: !prev[region] }));
  }

  const regionAbierta = (region: ChimbisRegion) => expandirTodo || abiertas[region];

  return (
    <div className="valores-chimbis-regiones">
      <p className="valores-note">
        Toca <b>+</b> en cada zona para ver sus precios. Santiago y el resto de Chile tienen tablas
        distintas.
      </p>
      {REGIONES.map((region) => {
        const open = regionAbierta(region);
        const panelId = `chimbis-valores-${region}`;
        return (
          <div key={region} className="card valores-acordeon">
            <button
              type="button"
              className="valores-acordeon__hdr"
              onClick={() => toggle(region)}
              aria-expanded={open}
              aria-controls={panelId}
            >
              <span className="valores-acordeon__title">{CHIMBIS_REGION_LABEL[region]}</span>
              <span className="valores-acordeon__icon" aria-hidden="true">
                {open ? "−" : "+"}
              </span>
            </button>
            {open && (
              <div id={panelId} className="valores-acordeon__panel valores-block valores-block--inner">
                <TablasRegionChimbis region={region} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
