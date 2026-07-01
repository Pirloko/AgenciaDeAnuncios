"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  type AnuncioCosto,
  type CampoCostoEditable,
  type LocantoDolarConfig,
  type SkokkaCreditosConfig,
  type SitioAdmin,
  SITIO_ADMIN_LABEL,
  SITIOS_ADMIN,
  CATEGORIA_LABEL,
  PLAN_LABEL,
  clpAdmin,
  pctAdmin,
  resumenMargen,
  filtrarCostos,
  filtrarCostosSitio,
  categoriasDeItems,
  diasDeItems,
  subidasOptsParaSitio,
  sitioTieneFiltroSubidas,
  ordenarCategorias,
  calcularGananciaLocal,
  calcularMargenLocal,
  calcularCostoAgenciaLocanto,
  calcularCostoAgenciaSkokka,
  calcularCreditosSkokka,
  parseDecimalInput,
  clpAdminDecimal,
} from "@/lib/admin-costos";

interface Props {
  costos: AnuncioCosto[];
  skokkaCreditos: SkokkaCreditosConfig | null;
  locantoDolar: LocantoDolarConfig | null;
}

function parseInputCLP(val: string): number | null {
  const limpio = val.trim();
  if (!limpio) return null;
  const n = Number(limpio.replace(/\D/g, ""));
  return Number.isFinite(n) && n >= 0 ? n : null;
}

function CostoEditor({
  row,
  saving,
  onGuardar,
  onGuardarLocantoUsd,
  onGuardarSkokkaCreditos,
  onGuardarSkokkaCosto,
  variant,
  modoSkokka,
  modoLocanto,
  valorDolarClp,
  valorCreditoClp,
}: {
  row: AnuncioCosto;
  saving: string | null;
  onGuardar: (
    id: string,
    campo: CampoCostoEditable,
    valor: number | null,
    prev: number | null
  ) => Promise<void>;
  onGuardarLocantoUsd: (id: string, usd: number, prevUsd: number | null) => Promise<void>;
  onGuardarSkokkaCreditos: (id: string, creditos: number, prevCreditos: number | null) => Promise<void>;
  onGuardarSkokkaCosto: (id: string, costo: number, prevCosto: number) => Promise<void>;
  variant: "desk" | "movil";
  modoSkokka: boolean;
  modoLocanto: boolean;
  valorDolarClp: number | null;
  valorCreditoClp: number | null;
}) {
  const [plataforma, setPlataforma] = useState(
    row.valor_plataforma != null ? String(row.valor_plataforma) : ""
  );
  const [costo, setCosto] = useState(String(row.costo_agencia));
  const [creditos, setCreditos] = useState(row.creditos != null ? String(row.creditos) : "");
  const [venta, setVenta] = useState(row.precio_venta != null ? String(row.precio_venta) : "");

  useEffect(() => {
    setPlataforma(row.valor_plataforma != null ? String(row.valor_plataforma) : "");
    setCosto(String(row.costo_agencia));
    setCreditos(row.creditos != null ? String(row.creditos) : "");
    setVenta(row.precio_venta != null ? String(row.precio_venta) : "");
  }, [row.id, row.updated_at, row.valor_plataforma, row.costo_agencia, row.creditos, row.precio_venta]);

  const costoNum = parseInputCLP(costo) ?? row.costo_agencia;
  const ventaNum = parseInputCLP(venta);
  const ganancia = calcularGananciaLocal(costoNum, ventaNum) ?? row.ganancia;
  const margen = calcularMargenLocal(costoNum, ventaNum) ?? row.margen_pct;

  function sincronizarCostoDesdeUsd(usdStr: string) {
    if (!modoLocanto || !valorDolarClp) return;
    const usd = parseInputCLP(usdStr);
    if (usd != null) setCosto(String(calcularCostoAgenciaLocanto(usd, valorDolarClp)));
  }

  function sincronizarCostoDesdeCreditos(creditosStr: string) {
    if (!modoSkokka || !valorCreditoClp) return;
    const cr = parseInputCLP(creditosStr);
    if (cr != null) setCosto(String(calcularCostoAgenciaSkokka(cr, valorCreditoClp)));
  }

  function sincronizarCreditosDesdeCosto(costoStr: string) {
    if (!modoSkokka || !valorCreditoClp) return;
    const c = parseInputCLP(costoStr);
    if (c != null) setCreditos(String(calcularCreditosSkokka(c, valorCreditoClp)));
  }

  async function blurPlataforma() {
    const n = parseInputCLP(plataforma);
    if (n == null) {
      setPlataforma(row.valor_plataforma != null ? String(row.valor_plataforma) : "");
      setCosto(String(row.costo_agencia));
      return;
    }
    if (modoLocanto && valorDolarClp) {
      await onGuardarLocantoUsd(row.id, n, row.valor_plataforma);
      return;
    }
    await onGuardar(row.id, "valor_plataforma", n, row.valor_plataforma);
  }

  async function blurCosto() {
    const n = parseInputCLP(costo);
    if (n == null) {
      setCosto(String(row.costo_agencia));
      return;
    }
    if (modoSkokka && valorCreditoClp) {
      await onGuardarSkokkaCosto(row.id, n, row.costo_agencia);
      return;
    }
    await onGuardar(row.id, "costo_agencia", n, row.costo_agencia);
  }

  async function blurVenta() {
    const n = parseInputCLP(venta);
    await onGuardar(row.id, "precio_venta", venta.trim() === "" ? null : n, row.precio_venta);
  }

  async function blurCreditos() {
    const n = parseInputCLP(creditos);
    if (creditos.trim() !== "" && n == null) {
      setCreditos(row.creditos != null ? String(row.creditos) : "");
      return;
    }
    if (modoSkokka && valorCreditoClp) {
      if (n == null) {
        setCreditos(row.creditos != null ? String(row.creditos) : "");
        setCosto(String(row.costo_agencia));
        return;
      }
      await onGuardarSkokkaCreditos(row.id, n, row.creditos);
      return;
    }
    await onGuardar(row.id, "creditos", creditos.trim() === "" ? null : n, row.creditos);
  }

  if (variant === "desk") {
    if (modoSkokka) {
      return (
        <tr>
          <td className="admin-table__name">
            <span className="admin-item__plan">{PLAN_LABEL[row.plan] ?? row.plan}</span>
            <span className="admin-item__sub">
              {row.subidas != null ? `${row.subidas} sub · ` : ""}
              {row.dias} día{row.dias > 1 ? "s" : ""}
            </span>
          </td>
          <td>
            <input
              className="admin-input"
              type="text"
              inputMode="numeric"
              value={plataforma}
              placeholder="—"
              onChange={(e) => setPlataforma(e.target.value)}
              disabled={saving === row.id + "valor_plataforma"}
              onBlur={blurPlataforma}
            />
          </td>
          <td>
            <input
              className="admin-input"
              type="text"
              inputMode="numeric"
              value={creditos}
              placeholder="—"
              onChange={(e) => {
                setCreditos(e.target.value);
                sincronizarCostoDesdeCreditos(e.target.value);
              }}
              disabled={saving === row.id + "creditos"}
              onBlur={blurCreditos}
            />
          </td>
          <td>
            <input
              className="admin-input"
              type="text"
              inputMode="numeric"
              value={costo}
              onChange={(e) => {
                setCosto(e.target.value);
                sincronizarCreditosDesdeCosto(e.target.value);
              }}
              disabled={saving === row.id + "costo_agencia"}
              onBlur={blurCosto}
            />
          </td>
          <td>
            <input
              className="admin-input"
              type="text"
              inputMode="numeric"
              value={venta}
              placeholder="—"
              onChange={(e) => setVenta(e.target.value)}
              disabled={saving === row.id + "precio_venta"}
              onBlur={blurVenta}
            />
          </td>
          <td className="admin-table__gan">{clpAdmin(ganancia)}</td>
          <td className="admin-table__pct">{pctAdmin(margen)}</td>
        </tr>
      );
    }

    if (modoLocanto) {
      return (
        <tr>
          <td className="admin-table__name">
            <span className="admin-item__plan">{PLAN_LABEL[row.plan] ?? row.plan}</span>
            <span className="admin-item__sub">
              {row.dias} día{row.dias > 1 ? "s" : ""}
            </span>
          </td>
          <td>
            <div className="admin-input-usd">
              <span className="admin-input-usd__prefix">US$</span>
              <input
                className="admin-input admin-input--usd"
                type="text"
                inputMode="numeric"
                value={plataforma}
                placeholder="—"
                onChange={(e) => {
                  setPlataforma(e.target.value);
                  sincronizarCostoDesdeUsd(e.target.value);
                }}
                disabled={saving === row.id + "valor_plataforma"}
                onBlur={blurPlataforma}
              />
            </div>
          </td>
          <td className="admin-table__costo-auto">{clpAdmin(costoNum)}</td>
          <td>
            <input
              className="admin-input"
              type="text"
              inputMode="numeric"
              value={venta}
              placeholder="—"
              onChange={(e) => setVenta(e.target.value)}
              disabled={saving === row.id + "precio_venta"}
              onBlur={blurVenta}
            />
          </td>
          <td className="admin-table__gan">{clpAdmin(ganancia)}</td>
          <td className="admin-table__pct">{pctAdmin(margen)}</td>
        </tr>
      );
    }

    return (
      <tr>
        <td className="admin-table__name">
          <span className="admin-item__plan">{PLAN_LABEL[row.plan] ?? row.plan}</span>
          <span className="admin-item__sub">
            {row.subidas != null ? `${row.subidas} sub · ` : ""}
            {row.dias} día{row.dias > 1 ? "s" : ""}
          </span>
        </td>
        <td>
          <input
            className="admin-input"
            type="text"
            inputMode="numeric"
            value={plataforma}
            placeholder="—"
            onChange={(e) => setPlataforma(e.target.value)}
            disabled={saving === row.id + "valor_plataforma"}
            onBlur={blurPlataforma}
          />
        </td>
        <td>{row.creditos ?? "—"}</td>
        <td>
          <input
            className="admin-input"
            type="text"
            inputMode="numeric"
            value={costo}
            onChange={(e) => setCosto(e.target.value)}
            disabled={saving === row.id + "costo_agencia"}
            onBlur={blurCosto}
          />
        </td>
        <td>
          <input
            className="admin-input"
            type="text"
            inputMode="numeric"
            value={venta}
            placeholder="—"
            onChange={(e) => setVenta(e.target.value)}
            disabled={saving === row.id + "precio_venta"}
            onBlur={blurVenta}
          />
        </td>
        <td className="admin-table__gan">{clpAdmin(ganancia)}</td>
        <td className="admin-table__pct">{pctAdmin(margen)}</td>
      </tr>
    );
  }

  if (modoSkokka) {
    return (
      <article className="admin-ficha admin-ficha--skokka">
        <header className="admin-ficha__hdr">
          <h4 className="admin-ficha__tit">{PLAN_LABEL[row.plan] ?? row.plan}</h4>
          <span className="admin-ficha__badge">
            {row.subidas != null ? `${row.subidas} sub · ` : ""}
            {row.dias}d
          </span>
        </header>
        <div className="admin-ficha__edit admin-ficha__edit--skokka">
          <label className="admin-ficha__field">
            <span>Valor plataforma</span>
            <input
              className="admin-input admin-input--full"
              type="text"
              inputMode="numeric"
              value={plataforma}
              placeholder="Sin valor"
              onChange={(e) => setPlataforma(e.target.value)}
              disabled={saving === row.id + "valor_plataforma"}
              onBlur={blurPlataforma}
            />
          </label>
          <label className="admin-ficha__field">
            <span>Créditos</span>
            <input
              className="admin-input admin-input--full"
              type="text"
              inputMode="numeric"
              value={creditos}
              placeholder="Sin créditos"
              onChange={(e) => {
                setCreditos(e.target.value);
                sincronizarCostoDesdeCreditos(e.target.value);
              }}
              disabled={saving === row.id + "creditos"}
              onBlur={blurCreditos}
            />
          </label>
          <label className="admin-ficha__field">
            <span>Costo agencia</span>
            <input
              className="admin-input admin-input--full"
              type="text"
              inputMode="numeric"
              value={costo}
              onChange={(e) => {
                setCosto(e.target.value);
                sincronizarCreditosDesdeCosto(e.target.value);
              }}
              disabled={saving === row.id + "costo_agencia"}
              onBlur={blurCosto}
            />
          </label>
          <label className="admin-ficha__field admin-ficha__field--full">
            <span>Precio venta (web)</span>
            <input
              className="admin-input admin-input--full"
              type="text"
              inputMode="numeric"
              value={venta}
              placeholder="Sin precio"
              onChange={(e) => setVenta(e.target.value)}
              disabled={saving === row.id + "precio_venta"}
              onBlur={blurVenta}
            />
          </label>
        </div>
        <footer className="admin-ficha__foot">
          <div>
            <span className="admin-ficha__lbl">Ganancia</span>
            <strong className="admin-ficha__gan">{clpAdmin(ganancia)}</strong>
          </div>
          <div>
            <span className="admin-ficha__lbl">Margen</span>
            <strong className="admin-ficha__pct">{pctAdmin(margen)}</strong>
          </div>
        </footer>
      </article>
    );
  }

  if (modoLocanto) {
    return (
      <article className="admin-ficha admin-ficha--locanto">
        <header className="admin-ficha__hdr">
          <h4 className="admin-ficha__tit">{PLAN_LABEL[row.plan] ?? row.plan}</h4>
          <span className="admin-ficha__badge">{row.dias}d</span>
        </header>
        <div className="admin-ficha__edit admin-ficha__edit--locanto">
          <label className="admin-ficha__field">
            <span>Valor plataforma (USD)</span>
            <div className="admin-input-usd">
              <span className="admin-input-usd__prefix">US$</span>
              <input
                className="admin-input admin-input--usd admin-input--full"
                type="text"
                inputMode="numeric"
                value={plataforma}
                placeholder="Sin valor"
                onChange={(e) => {
                  setPlataforma(e.target.value);
                  sincronizarCostoDesdeUsd(e.target.value);
                }}
                disabled={saving === row.id + "valor_plataforma"}
                onBlur={blurPlataforma}
              />
            </div>
          </label>
          <label className="admin-ficha__field">
            <span>Costo agencia (CLP)</span>
            <p className="admin-ficha__costo-auto">{clpAdmin(costoNum)}</p>
          </label>
          <label className="admin-ficha__field admin-ficha__field--full">
            <span>Precio venta (web)</span>
            <input
              className="admin-input admin-input--full"
              type="text"
              inputMode="numeric"
              value={venta}
              placeholder="Sin precio"
              onChange={(e) => setVenta(e.target.value)}
              disabled={saving === row.id + "precio_venta"}
              onBlur={blurVenta}
            />
          </label>
        </div>
        <footer className="admin-ficha__foot">
          <div>
            <span className="admin-ficha__lbl">Ganancia</span>
            <strong className="admin-ficha__gan">{clpAdmin(ganancia)}</strong>
          </div>
          <div>
            <span className="admin-ficha__lbl">Margen</span>
            <strong className="admin-ficha__pct">{pctAdmin(margen)}</strong>
          </div>
        </footer>
      </article>
    );
  }

  return (
    <article className="admin-ficha">
      <header className="admin-ficha__hdr">
        <h4 className="admin-ficha__tit">{PLAN_LABEL[row.plan] ?? row.plan}</h4>
        <span className="admin-ficha__badge">
          {row.subidas != null ? `${row.subidas} sub · ` : ""}
          {row.dias}d
        </span>
      </header>
      {(row.valor_plataforma != null || row.creditos != null) && (
        <div className="admin-ficha__meta">
          {row.valor_plataforma != null && (
            <div className="admin-ficha__row">
              <span className="admin-ficha__lbl-inline">Valor plataforma</span>
              <input
                className="admin-input admin-input--inline"
                type="text"
                inputMode="numeric"
                value={plataforma}
                onChange={(e) => setPlataforma(e.target.value)}
                disabled={saving === row.id + "valor_plataforma"}
                onBlur={blurPlataforma}
              />
            </div>
          )}
          {row.creditos != null && (
            <div className="admin-ficha__row">
              <span className="admin-ficha__lbl-inline">Créditos</span>
              <span className="admin-ficha__val-inline">{row.creditos}</span>
            </div>
          )}
        </div>
      )}
      <div className="admin-ficha__edit">
        <label className="admin-ficha__field">
          <span>Costo agencia</span>
          <input
            className="admin-input admin-input--full"
            type="text"
            inputMode="numeric"
            value={costo}
            onChange={(e) => setCosto(e.target.value)}
            disabled={saving === row.id + "costo_agencia"}
            onBlur={blurCosto}
          />
        </label>
        <label className="admin-ficha__field">
          <span>Precio venta</span>
          <input
            className="admin-input admin-input--full"
            type="text"
            inputMode="numeric"
            value={venta}
            placeholder="Sin venta"
            onChange={(e) => setVenta(e.target.value)}
            disabled={saving === row.id + "precio_venta"}
            onBlur={blurVenta}
          />
        </label>
      </div>
      <footer className="admin-ficha__foot">
        <div>
          <span className="admin-ficha__lbl">Ganancia</span>
          <strong className="admin-ficha__gan">{clpAdmin(ganancia)}</strong>
        </div>
        <div>
          <span className="admin-ficha__lbl">Margen</span>
          <strong className="admin-ficha__pct">{pctAdmin(margen)}</strong>
        </div>
      </footer>
    </article>
  );
}

export default function AdminDashboard({ costos, skokkaCreditos, locantoDolar }: Props) {
  const router = useRouter();
  const [sitio, setSitio] = useState<SitioAdmin>("skokka");
  const [q, setQ] = useState("");
  const [categoria, setCategoria] = useState("all");
  const [dias, setDias] = useState("all");
  const [subidas, setSubidas] = useState("all");
  const [saving, setSaving] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [msgError, setMsgError] = useState(false);
  const [valorDolarInput, setValorDolarInput] = useState(
    String(locantoDolar?.valor_dolar_clp ?? 868)
  );
  const [valorCreditoInput, setValorCreditoInput] = useState(
    String(skokkaCreditos?.valor_credito_clp ?? 40.241)
  );

  useEffect(() => {
    setValorDolarInput(String(locantoDolar?.valor_dolar_clp ?? 868));
  }, [locantoDolar?.valor_dolar_clp]);

  useEffect(() => {
    setValorCreditoInput(String(skokkaCreditos?.valor_credito_clp ?? 40.241));
  }, [skokkaCreditos?.valor_credito_clp]);

  const valorDolarClp = locantoDolar?.valor_dolar_clp ?? 868;
  const valorCreditoClp = skokkaCreditos?.valor_credito_clp ?? 40.241;

  const delSitio = useMemo(
    () => filtrarCostosSitio(costos.filter((c) => c.sitio === sitio), sitio),
    [costos, sitio]
  );
  const categorias = useMemo(() => categoriasDeItems(delSitio), [delSitio]);
  const diasOpts = useMemo(() => diasDeItems(delSitio), [delSitio]);
  const subidasOpts = useMemo(
    () => subidasOptsParaSitio(delSitio, sitio, { categoria, dias }),
    [delSitio, sitio, categoria, dias]
  );

  const filtrados = useMemo(
    () => filtrarCostos(delSitio, { q, categoria, dias, subidas }),
    [delSitio, q, categoria, dias, subidas]
  );

  const resumen = useMemo(() => resumenMargen(filtrados), [filtrados]);

  const porCategoria = useMemo(() => {
    const acc: Record<string, AnuncioCosto[]> = {};
    for (const item of filtrados) {
      (acc[item.categoria] ||= []).push(item);
    }
    return acc;
  }, [filtrados]);

  const categoriasOrdenadas = useMemo(
    () => ordenarCategorias(Object.keys(porCategoria)),
    [porCategoria]
  );

  function cambiarSitio(s: SitioAdmin) {
    setSitio(s);
    setCategoria("all");
    setDias("all");
    setSubidas("all");
    setQ("");
    setMsg("");
  }

  function limpiarFiltros() {
    setQ("");
    setCategoria("all");
    setDias("all");
    setSubidas("all");
  }

  async function guardar(
    id: string,
    campo: CampoCostoEditable,
    valor: number | null,
    prev: number | null
  ) {
    if (valor === prev) return;

    setSaving(id + campo);
    setMsg("");
    setMsgError(false);

    const payload: Record<string, number | null> = {
      [campo]:
        campo === "precio_venta" || campo === "creditos" ? valor : valor ?? 0,
    };

    try {
      const res = await fetch(`/api/admin/costos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMsg(data.error ?? "Error al guardar.");
        setMsgError(true);
        return;
      }
      setMsg("Guardado ✓");
      setMsgError(false);
      router.refresh();
      setTimeout(() => setMsg(""), 2500);
    } catch {
      setMsg("Sin conexión. Revisa tu red.");
      setMsgError(true);
    } finally {
      setSaving(null);
    }
  }

  async function guardarLocantoUsd(id: string, usd: number, prevUsd: number | null) {
    if (!valorDolarClp || usd === prevUsd) return;

    const costoClp = calcularCostoAgenciaLocanto(usd, valorDolarClp);
    setSaving(id + "valor_plataforma");
    setMsg("");
    setMsgError(false);

    try {
      const res = await fetch(`/api/admin/costos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ valor_plataforma: usd, costo_agencia: costoClp }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMsg(data.error ?? "Error al guardar.");
        setMsgError(true);
        return;
      }
      setMsg("Guardado ✓");
      setMsgError(false);
      router.refresh();
      setTimeout(() => setMsg(""), 2500);
    } catch {
      setMsg("Sin conexión. Revisa tu red.");
      setMsgError(true);
    } finally {
      setSaving(null);
    }
  }

  async function guardarSkokkaCreditos(id: string, creditos: number, prevCreditos: number | null) {
    if (!valorCreditoClp || creditos === prevCreditos) return;

    const costoClp = calcularCostoAgenciaSkokka(creditos, valorCreditoClp);
    setSaving(id + "creditos");
    setMsg("");
    setMsgError(false);

    try {
      const res = await fetch(`/api/admin/costos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creditos, costo_agencia: costoClp }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMsg(data.error ?? "Error al guardar.");
        setMsgError(true);
        return;
      }
      setMsg("Guardado ✓");
      setMsgError(false);
      router.refresh();
      setTimeout(() => setMsg(""), 2500);
    } catch {
      setMsg("Sin conexión. Revisa tu red.");
      setMsgError(true);
    } finally {
      setSaving(null);
    }
  }

  async function guardarSkokkaCosto(id: string, costo: number, prevCosto: number) {
    if (!valorCreditoClp || costo === prevCosto) return;

    const creditos = calcularCreditosSkokka(costo, valorCreditoClp);
    setSaving(id + "costo_agencia");
    setMsg("");
    setMsgError(false);

    try {
      const res = await fetch(`/api/admin/costos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ costo_agencia: costo, creditos }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMsg(data.error ?? "Error al guardar.");
        setMsgError(true);
        return;
      }
      setMsg("Guardado ✓");
      setMsgError(false);
      router.refresh();
      setTimeout(() => setMsg(""), 2500);
    } catch {
      setMsg("Sin conexión. Revisa tu red.");
      setMsgError(true);
    } finally {
      setSaving(null);
    }
  }

  async function guardarValorDolar() {
    const n = parseInputCLP(valorDolarInput);
    if (n == null || n === valorDolarClp) {
      setValorDolarInput(valorDolarClp != null ? String(valorDolarClp) : "");
      return;
    }

    setSaving("locanto_dolar");
    setMsg("");
    setMsgError(false);

    try {
      const res = await fetch("/api/admin/config/locanto-dolar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ valor_dolar_clp: n }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMsg(data.error ?? "Error al guardar el dólar.");
        setMsgError(true);
        return;
      }
      setMsg("Dólar actualizado ✓");
      setMsgError(false);
      router.refresh();
      setTimeout(() => setMsg(""), 2500);
    } catch {
      setMsg("Sin conexión. Revisa tu red.");
      setMsgError(true);
    } finally {
      setSaving(null);
    }
  }

  async function guardarValorCreditoSkokka() {
    const n = parseDecimalInput(valorCreditoInput);
    if (n == null || n === valorCreditoClp) {
      setValorCreditoInput(String(valorCreditoClp));
      return;
    }

    setSaving("skokka_credito");
    setMsg("");
    setMsgError(false);

    try {
      const res = await fetch("/api/admin/config/skokka-creditos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ valor_credito_clp: n }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMsg(data.error ?? "Error al guardar el valor del crédito.");
        setMsgError(true);
        return;
      }
      setMsg("Valor del crédito actualizado ✓");
      setMsgError(false);
      router.refresh();
      setTimeout(() => setMsg(""), 2500);
    } catch {
      setMsg("Sin conexión. Revisa tu red.");
      setMsgError(true);
    } finally {
      setSaving(null);
    }
  }

  function contarSitio(s: SitioAdmin) {
    return filtrarCostosSitio(
      costos.filter((c) => c.sitio === s),
      s
    ).length;
  }

  const esSkokka = sitio === "skokka";
  const esLocanto = sitio === "locanto";
  const filtroSubidas = sitioTieneFiltroSubidas(sitio);
  const sinDatosSitio = delSitio.length === 0;

  return (
    <main className="admin-page">
      <header className="admin-hdr">
        <div>
          <Link href="/admin" className="admin-back">
            ← Panel
          </Link>
          <h1 className="admin-title">Costos y márgenes</h1>
          <p className="admin-muted">Toca un sitio, filtra y edita costos o precios.</p>
        </div>
      </header>

      <nav className="admin-tabs" aria-label="Sitios">
        {SITIOS_ADMIN.map((s) => (
          <button
            key={s}
            type="button"
            className={`admin-tab${sitio === s ? " admin-tab--on" : ""}`}
            onClick={() => cambiarSitio(s)}
          >
            {SITIO_ADMIN_LABEL[s]}
            <span className="admin-tab__n">{contarSitio(s)}</span>
          </button>
        ))}
      </nav>

      {esSkokka && skokkaCreditos && (
        <div className="admin-skokka-creditos">
          <p className="admin-skokka-creditos__pack">
            Paquete de créditos: <b>{clpAdmin(skokkaCreditos.costo_total_clp)}</b> por{" "}
            <b>{skokkaCreditos.cantidad_creditos.toLocaleString("es-CL")}</b> créditos (
            {clpAdminDecimal(skokkaCreditos.valor_credito_clp)} c/u)
          </p>
          <label className="admin-skokka-creditos__field">
            <span>Valor del crédito (CLP)</span>
            <input
              className="admin-input"
              type="text"
              inputMode="decimal"
              value={valorCreditoInput}
              onChange={(e) => setValorCreditoInput(e.target.value)}
              disabled={saving === "skokka_credito"}
              onBlur={guardarValorCreditoSkokka}
            />
          </label>
          <p className="admin-skokka-creditos__hint">
            En Skokka el <b>costo agencia</b> = créditos × valor del crédito. Si cambias créditos,
            costo o el valor del crédito, los demás se actualizan solos.
          </p>
        </div>
      )}

      {esLocanto && (
        <div className="admin-locanto-dolar">
          <label className="admin-locanto-dolar__field">
            <span>Valor del dólar (CLP)</span>
            <input
              className="admin-input"
              type="text"
              inputMode="numeric"
              value={valorDolarInput}
              onChange={(e) => setValorDolarInput(e.target.value)}
              disabled={saving === "locanto_dolar"}
              onBlur={guardarValorDolar}
            />
          </label>
          <p className="admin-locanto-dolar__hint">
            En Locanto el <b>valor plataforma</b> está en dólares. El <b>costo agencia</b> se calcula
            automático: USD × dólar.
          </p>
        </div>
      )}

      <div className="admin-toolbar">
        <label className="admin-search">
          <span className="admin-search__icon" aria-hidden="true">
            ⌕
          </span>
          <input
            type="search"
            placeholder="Buscar plan, subidas o días…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            enterKeyHint="search"
          />
          {q && (
            <button
              type="button"
              className="admin-search__clear"
              onClick={() => setQ("")}
              aria-label="Limpiar búsqueda"
            >
              ×
            </button>
          )}
        </label>

        <div className="admin-filters">
          <select
            className="admin-select"
            value={categoria}
            onChange={(e) => {
              setCategoria(e.target.value);
              if (sitio === "chimbis") setSubidas("all");
            }}
            aria-label="Zona"
          >
            <option value="all">Todas las zonas</option>
            {categorias.map((c) => (
              <option key={c} value={c}>
                {CATEGORIA_LABEL[c] ?? c}
              </option>
            ))}
          </select>

          <select
            className="admin-select"
            value={dias}
            onChange={(e) => {
              setDias(e.target.value);
              if (sitio === "chimbis") setSubidas("all");
            }}
            aria-label="Días"
          >
            <option value="all">Todos los días</option>
            {diasOpts.map((d) => (
              <option key={d} value={String(d)}>
                {d} día{d > 1 ? "s" : ""}
              </option>
            ))}
          </select>

          {filtroSubidas && (
            <select
              className="admin-select"
              value={subidas}
              onChange={(e) => setSubidas(e.target.value)}
              aria-label="Subidas"
            >
              <option value="all">Todas las subidas</option>
              {subidasOpts.map((n) => (
                <option key={n} value={String(n)}>
                  {n} subida{n > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          )}

        </div>
      </div>

      <section className="admin-kpis">
        <div className="admin-kpi">
          <span className="admin-kpi__lbl">Resultados</span>
          <strong className="admin-kpi__val">{filtrados.length}</strong>
        </div>
        <div className="admin-kpi">
          <span className="admin-kpi__lbl">Con venta</span>
          <strong className="admin-kpi__val">{resumen.conVenta}</strong>
        </div>
        <div className="admin-kpi admin-kpi--accent">
          <span className="admin-kpi__lbl">Ganancia</span>
          <strong className="admin-kpi__val">{clpAdmin(resumen.gananciaTotal)}</strong>
        </div>
        <div className="admin-kpi">
          <span className="admin-kpi__lbl">Margen prom.</span>
          <strong className="admin-kpi__val">{pctAdmin(resumen.margenProm)}</strong>
        </div>
      </section>

      {msg && (
        <p className={`admin-toast admin-toast--bar${msgError ? " admin-toast--err" : ""}`}>{msg}</p>
      )}

      {filtrados.length === 0 ? (
        <section className="admin-empty">
          <p>
            {sinDatosSitio
              ? `Aún no hay costos cargados para ${SITIO_ADMIN_LABEL[sitio] ?? sitio}. Pronto podrás agregarlos aquí.`
              : "No hay anuncios con esos filtros."}
          </p>
          {!sinDatosSitio && (
            <button type="button" className="admin-btn admin-btn--ghost" onClick={limpiarFiltros}>
              Limpiar filtros
            </button>
          )}
        </section>
      ) : (
        categoriasOrdenadas.map((cat) => {
          const filas = porCategoria[cat];
          if (!filas?.length) return null;
          return (
            <section key={cat} className="admin-block">
              <h2 className="admin-h2">{CATEGORIA_LABEL[cat] ?? cat}</h2>
              <p className="admin-block__count">
                {filas.length} anuncio{filas.length > 1 ? "s" : ""}
              </p>

              <div className="admin-scroll admin-list__desk">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Plan</th>
                      {esSkokka ? (
                        <>
                          <th>Valor plataforma</th>
                          <th>Créditos</th>
                          <th>Costo agencia</th>
                          <th>Precio venta</th>
                          <th>Ganancia</th>
                          <th>%</th>
                        </>
                      ) : esLocanto ? (
                        <>
                          <th>Plataforma (USD)</th>
                          <th>Costo agencia</th>
                          <th>Precio venta</th>
                          <th>Ganancia</th>
                          <th>%</th>
                        </>
                      ) : (
                        <>
                          <th>Plataforma</th>
                          <th>Créd.</th>
                          <th>Costo</th>
                          <th>Venta</th>
                          <th>Ganancia</th>
                          <th>%</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filas.map((row) => (
                      <CostoEditor
                        key={row.id}
                        row={row}
                        saving={saving}
                        onGuardar={guardar}
                        onGuardarLocantoUsd={guardarLocantoUsd}
                        onGuardarSkokkaCreditos={guardarSkokkaCreditos}
                        onGuardarSkokkaCosto={guardarSkokkaCosto}
                        variant="desk"
                        modoSkokka={esSkokka}
                        modoLocanto={esLocanto}
                        valorDolarClp={valorDolarClp}
                        valorCreditoClp={valorCreditoClp}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="admin-list__movil">
                {filas.map((row) => (
                  <CostoEditor
                    key={row.id}
                    row={row}
                    saving={saving}
                    onGuardar={guardar}
                    onGuardarLocantoUsd={guardarLocantoUsd}
                    onGuardarSkokkaCreditos={guardarSkokkaCreditos}
                    onGuardarSkokkaCosto={guardarSkokkaCosto}
                    variant="movil"
                    modoSkokka={esSkokka}
                    modoLocanto={esLocanto}
                    valorDolarClp={valorDolarClp}
                    valorCreditoClp={valorCreditoClp}
                  />
                ))}
              </div>
            </section>
          );
        })
      )}
    </main>
  );
}
