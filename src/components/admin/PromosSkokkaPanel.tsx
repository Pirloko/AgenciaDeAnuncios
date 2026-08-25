"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { AnuncioCosto } from "@/lib/admin-costos";
import { clpAdmin, parseDecimalInput } from "@/lib/admin-costos";
import {
  SKOKKA_PROMO_COMBOS,
  SKOKKA_PROMO_HORARIOS,
  SKOKKA_PROMO_PLANES,
  SKOKKA_PROMO_PLAN_LABEL,
  combosFiltrados,
  costoSkokkaRef,
  etiquetaComboSkokka,
  etiquetaComboSkokkaCorta,
  setVentaPromo,
  valorPaginaSkokka,
  ventaPromoSkokka,
  type SkokkaPromoModalidad,
  type SkokkaPromoPlan,
  type SkokkaPromosConfig,
} from "@/lib/promos-pagina-skokka";
import { capturarElementoComoPng } from "@/lib/valores-compartir";
import PromosSkokkaFlyer from "@/components/admin/PromosSkokkaFlyer";

type Props = {
  costos: AnuncioCosto[];
  configInicial: SkokkaPromosConfig;
};

export default function PromosSkokkaPanel({ costos, configInicial }: Props) {
  const [config, setConfig] = useState<SkokkaPromosConfig>(configInicial);
  const [modalidad, setModalidad] = useState<SkokkaPromoModalidad | "all">("diurno");
  const [dias, setDias] = useState<number | "all">("all");
  const [subidas, setSubidas] = useState<number | "all">("all");
  const [comboActivo, setComboActivo] = useState<(typeof SKOKKA_PROMO_COMBOS)[number]>(
    SKOKKA_PROMO_COMBOS[2] // 3 subidas · 3 días
  );
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgErr, setMsgErr] = useState(false);
  const [generando, setGenerando] = useState(false);
  const [generandoIa, setGenerandoIa] = useState(false);
  const flyerRef = useRef<HTMLDivElement>(null);
  const flyerIaRef = useRef<HTMLDivElement>(null);
  const [flyerIaHtml, setFlyerIaHtml] = useState<string | null>(null);

  const combos = useMemo(
    () => combosFiltrados({ modalidad, dias, subidas }),
    [modalidad, dias, subidas]
  );

  async function persistir(next: SkokkaPromosConfig) {
    setSaving(true);
    setMsg("");
    setMsgErr(false);
    try {
      const res = await fetch("/api/admin/config/promos-skokka", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al guardar");
      setConfig(data.config ?? next);
      setMsg("Guardado");
      setTimeout(() => setMsg(""), 2000);
    } catch (e) {
      setMsgErr(true);
      setMsg(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  function onChangeVenta(
    plan: SkokkaPromoPlan,
    horarios: number,
    raw: string
  ) {
    const n = parseDecimalInput(raw);
    if (n == null) return;
    setConfig((prev) =>
      setVentaPromo(
        prev,
        comboActivo.modalidad,
        comboActivo.subidas,
        comboActivo.dias,
        plan,
        horarios,
        n
      )
    );
  }

  async function guardarCombo() {
    await persistir(config);
  }

  async function resetComboAValorPagina() {
    let next = config;
    for (const plan of SKOKKA_PROMO_PLANES) {
      const maxH = comboActivo.modalidad === "madrugada" ? 1 : 6;
      for (let h = 1; h <= maxH; h++) {
        const v = valorPaginaSkokka(
          comboActivo.modalidad,
          comboActivo.subidas,
          comboActivo.dias,
          plan,
          h
        );
        if (v == null) continue;
        next = setVentaPromo(
          next,
          comboActivo.modalidad,
          comboActivo.subidas,
          comboActivo.dias,
          plan,
          h,
          v
        );
      }
    }
    setConfig(next);
    await persistir(next);
  }

  async function generarImagen() {
    const el = flyerRef.current;
    if (!el) return;
    setGenerando(true);
    setMsg("");
    setMsgErr(false);
    try {
      const blob = await capturarElementoComoPng(el);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const mod =
        comboActivo.modalidad === "madrugada" ? "madrugada" : "dia";
      a.download = `skokka-promo-${mod}-${comboActivo.subidas}sub-${comboActivo.dias}d.png`;
      a.click();
      URL.revokeObjectURL(url);
      setMsg("Imagen descargada (plantilla)");
      setTimeout(() => setMsg(""), 2500);
    } catch {
      setMsgErr(true);
      setMsg("No se pudo generar la imagen");
    } finally {
      setGenerando(false);
    }
  }

  async function generarImagenIa() {
    if (comboActivo.modalidad !== "diurno") {
      setMsgErr(true);
      setMsg("La imagen IA es solo para Día (1–6 horarios). Usa Flyer plantilla en Madrugada.");
      return;
    }
    setGenerandoIa(true);
    setMsg("");
    setMsgErr(false);
    try {
      const precios: Record<string, Record<string, number>> = {};
      for (const plan of SKOKKA_PROMO_PLANES) {
        precios[plan] = {};
        for (const h of SKOKKA_PROMO_HORARIOS) {
          precios[plan][String(h)] =
            ventaPromoSkokka(
              config,
              "diurno",
              comboActivo.subidas,
              comboActivo.dias,
              plan,
              h
            ) ?? 0;
        }
      }

      const res = await fetch("/api/admin/promos-skokka/flyer-ia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subidas: comboActivo.subidas,
          dias: comboActivo.dias,
          precios,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al generar con IA");

      setFlyerIaHtml(data.html as string);

      // Esperar a que React pinte el HTML offscreen
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      await new Promise((r) => setTimeout(r, 120));

      const el = flyerIaRef.current;
      if (!el) throw new Error("No se pudo montar el flyer IA");

      const blob = await capturarElementoComoPng(el);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `skokka-promo-ia-${comboActivo.subidas}sub-${comboActivo.dias}d.png`;
      a.click();
      URL.revokeObjectURL(url);
      setMsg("Imagen IA descargada");
      setTimeout(() => setMsg(""), 2500);
    } catch (e) {
      setMsgErr(true);
      setMsg(e instanceof Error ? e.message : "Error al generar con IA");
    } finally {
      setGenerandoIa(false);
    }
  }

  const horariosLista =
    comboActivo.modalidad === "madrugada" ? ([1] as const) : SKOKKA_PROMO_HORARIOS;

  return (
    <main className="admin-page admin-page--wide">
      <header className="admin-hdr">
        <div>
          <Link href="/admin/promos-pagina" className="admin-back">
            ← Páginas
          </Link>
          <h1 className="admin-title">Promociones Skokka</h1>
          <p className="admin-muted">
            Valores solo para esta sección. No cambian Costos ni el cotizador público.
          </p>
        </div>
      </header>

      <p className="admin-note">
        Edita la <b>venta promo</b> por cantidad de horarios. Costo y valor página son referencia.
        <b>Flyer plantilla</b> funciona en Día y Madrugada.
        <b> Flyer con IA</b> solo Día (referencia con 1–6 horarios).
      </p>

      <div className="admin-filters" style={{ marginBottom: 14 }}>
        {(
          [
            ["diurno", "Día"],
            ["madrugada", "Madrugada"],
            ["all", "Todas"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`admin-chip${modalidad === id ? " admin-chip--on" : ""}`}
            onClick={() => setModalidad(id)}
          >
            {label}
          </button>
        ))}
        {[1, 3, 7].map((d) => (
          <button
            key={d}
            type="button"
            className={`admin-chip${dias === d ? " admin-chip--on" : ""}`}
            onClick={() => setDias(dias === d ? "all" : d)}
          >
            {d} día{d > 1 ? "s" : ""}
          </button>
        ))}
        {[3, 6].map((s) => (
          <button
            key={s}
            type="button"
            className={`admin-chip${subidas === s ? " admin-chip--on" : ""}`}
            onClick={() => setSubidas(subidas === s ? "all" : s)}
          >
            {s} subidas
          </button>
        ))}
      </div>

      <div className="admin-promo-combos">
        {combos.map((c) => {
          const on =
            c.modalidad === comboActivo.modalidad &&
            c.subidas === comboActivo.subidas &&
            c.dias === comboActivo.dias;
          return (
            <button
              key={`${c.modalidad}-${c.subidas}-${c.dias}`}
              type="button"
              className={`admin-promo-combo${on ? " admin-promo-combo--on" : ""}`}
              onClick={() => setComboActivo(c)}
            >
              <strong>{etiquetaComboSkokkaCorta(c.subidas, c.dias)}</strong>
              <span>{c.modalidad === "diurno" ? "Día" : "Madrugada"}</span>
            </button>
          );
        })}
      </div>

      <div className="admin-promo-actions">
        <button
          type="button"
          className="admin-btn"
          onClick={guardarCombo}
          disabled={saving}
        >
          {saving ? "Guardando…" : "Guardar ventas promo"}
        </button>
        <button
          type="button"
          className="admin-btn admin-btn--ghost"
          onClick={resetComboAValorPagina}
          disabled={saving}
        >
          Reset a valor página
        </button>
        <button
          type="button"
          className="admin-btn admin-btn--ghost"
          onClick={generarImagen}
          disabled={generando || generandoIa}
        >
          {generando ? "Generando…" : "Flyer plantilla"}
        </button>
        <button
          type="button"
          className="admin-btn admin-btn--accent"
          onClick={generarImagenIa}
          disabled={generando || generandoIa || comboActivo.modalidad !== "diurno"}
        >
          {generandoIa ? "Claude diseñando…" : "Flyer con IA (Anthropic)"}
        </button>
        {msg && (
          <span className={`admin-inline-msg${msgErr ? " admin-inline-msg--err" : ""}`}>
            {msg}
          </span>
        )}
      </div>

      <h2 className="admin-h2" style={{ marginTop: 8 }}>
        {etiquetaComboSkokka(comboActivo.subidas, comboActivo.dias)} ·{" "}
        {comboActivo.modalidad === "diurno" ? "Día" : "Madrugada"}
      </h2>

      {SKOKKA_PROMO_PLANES.map((plan) => (
        <section key={plan} className="admin-block admin-promo-plan">
          <h3 className="admin-promo-plan__tit">{SKOKKA_PROMO_PLAN_LABEL[plan]}</h3>
          <div className="admin-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Horarios</th>
                  <th>Costo</th>
                  <th>Valor página</th>
                  <th>Venta promo</th>
                  <th>Ganancia</th>
                  <th>Margen</th>
                </tr>
              </thead>
              <tbody>
                {horariosLista.map((h) => {
                  const costo = costoSkokkaRef(
                    costos,
                    comboActivo.modalidad,
                    comboActivo.subidas,
                    comboActivo.dias,
                    plan,
                    h
                  );
                  const pagina = valorPaginaSkokka(
                    comboActivo.modalidad,
                    comboActivo.subidas,
                    comboActivo.dias,
                    plan,
                    h
                  );
                  const venta =
                    ventaPromoSkokka(
                      config,
                      comboActivo.modalidad,
                      comboActivo.subidas,
                      comboActivo.dias,
                      plan,
                      h
                    ) ?? 0;
                  const gan = pagina != null && costo != null ? venta - costo : venta;
                  const margen = venta > 0 ? Math.round(((venta - (costo ?? 0)) / venta) * 1000) / 10 : null;
                  const base = pagina != null && h > 1 ? Math.round((pagina / h) * h) : pagina;
                  const vsFull = base != null && venta < base && h > 1;
                  return (
                    <tr key={h}>
                      <td>
                        <span className="admin-item__plan">
                          {comboActivo.modalidad === "madrugada"
                            ? "Bloque madrugada"
                            : `${h} horario${h > 1 ? "s" : ""}`}
                        </span>
                        {vsFull && pagina != null && (
                          <span className="admin-item__sub">
                            Promo (−{Math.round(((pagina - venta) / pagina) * 100)}% vs ×{h})
                          </span>
                        )}
                      </td>
                      <td>{costo != null ? clpAdmin(costo) : "—"}</td>
                      <td>{pagina != null ? clpAdmin(pagina) : "—"}</td>
                      <td>
                        <input
                          className="admin-input admin-input--sm"
                          type="text"
                          inputMode="numeric"
                          defaultValue={String(venta)}
                          key={`${comboActivo.modalidad}-${comboActivo.subidas}-${comboActivo.dias}-${plan}-${h}-${venta}`}
                          onBlur={(e) => onChangeVenta(plan, h, e.target.value)}
                        />
                      </td>
                      <td className="admin-table__gan">{clpAdmin(gan)}</td>
                      <td className="admin-table__pct">
                        {margen != null ? `${margen}%` : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      {/* Flyer fuera de pantalla para captura nítida */}
      <div className="admin-flyer-offscreen" aria-hidden="true">
        <PromosSkokkaFlyer
          ref={flyerRef}
          modalidad={comboActivo.modalidad}
          subidas={comboActivo.subidas}
          dias={comboActivo.dias}
          config={config}
        />
        {flyerIaHtml && (
          <div
            ref={flyerIaRef}
            className="skokka-flyer-ia-root"
            dangerouslySetInnerHTML={{ __html: flyerIaHtml }}
          />
        )}
      </div>
    </main>
  );
}
