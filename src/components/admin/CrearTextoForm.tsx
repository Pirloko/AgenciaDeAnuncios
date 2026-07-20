"use client";

import { useState } from "react";
import Link from "next/link";
import {
  type CategoriaEscort,
  CATEGORIA_ESCORT_LABEL,
  type TextoGenerado,
  generarTextoAnuncio,
  validarDatosAnuncio,
} from "@/lib/textos-anuncio";

const CATEGORIAS: CategoriaEscort[] = ["mujer", "trans", "masculino"];

export default function CrearTextoForm() {
  const [categoria, setCategoria] = useState<CategoriaEscort>("mujer");
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [nacionalidad, setNacionalidad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [error, setError] = useState("");
  const [resultado, setResultado] = useState<TextoGenerado | null>(null);
  const [copiado, setCopiado] = useState<"titulo" | "cuerpo" | "todo" | null>(null);

  function generar() {
    setError("");
    const val = validarDatosAnuncio({
      categoria,
      nombre,
      edad,
      ciudad,
      nacionalidad,
      telefono,
    });
    if (!val.ok) {
      setError(val.error);
      setResultado(null);
      return;
    }
    setResultado(generarTextoAnuncio(val.datos));
  }

  async function copiar(texto: string, tipo: "titulo" | "cuerpo" | "todo") {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(tipo);
      setTimeout(() => setCopiado(null), 2000);
    } catch {
      setError("No se pudo copiar. Selecciona el texto manualmente.");
    }
  }

  return (
    <main className="admin-page admin-texto">
      <header className="admin-hdr">
        <div>
          <Link href="/admin" className="admin-back">
            ← Panel
          </Link>
          <h1 className="admin-title">Crear título y texto</h1>
          <p className="admin-muted">
            Completa los datos y genera un anuncio en tono chileno, más explícito y con variedad.
            Usa «Otra versión» para probar distintas combinaciones.
          </p>
        </div>
      </header>

      <section className="admin-texto__panel">
        <h2 className="admin-promo__q">Datos del anuncio</h2>
        <p className="admin-promo__hint">Los campos marcados con * son obligatorios.</p>

        <div className="admin-texto__grid">
          <label className="admin-field admin-field--full">
            <span>Tipo de escort *</span>
            <select
              className="admin-select"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as CategoriaEscort)}
            >
              {CATEGORIAS.map((c) => (
                <option key={c} value={c}>
                  {CATEGORIA_ESCORT_LABEL[c]}
                </option>
              ))}
            </select>
          </label>
          <label className="admin-field">
            <span>Nombre *</span>
            <input
              type="text"
              placeholder="Ej: Naroa"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </label>
          <label className="admin-field">
            <span>Edad *</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Ej: 22"
              value={edad}
              onChange={(e) => setEdad(e.target.value)}
            />
          </label>
          <label className="admin-field admin-field--full">
            <span>Ciudad *</span>
            <input
              type="text"
              placeholder="Ej: Curicó"
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
            />
          </label>
          <label className="admin-field">
            <span>Nacionalidad</span>
            <input
              type="text"
              placeholder="Ej: chilenita"
              value={nacionalidad}
              onChange={(e) => setNacionalidad(e.target.value)}
            />
          </label>
          <label className="admin-field">
            <span>Número de celular</span>
            <input
              type="tel"
              inputMode="tel"
              placeholder="Ej: 9 5088 9405"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </label>
        </div>

        {error && <p className="admin-error">{error}</p>}

        <div className="admin-promo__bar">
          <button type="button" className="admin-btn admin-btn--primary" onClick={generar}>
            Generar texto
          </button>
          {resultado && (
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              onClick={generar}
            >
              Otra versión
            </button>
          )}
        </div>
      </section>

      {resultado && (
        <section className="admin-texto__result">
          <div className="admin-texto__block">
            <div className="admin-texto__block-hdr">
              <h3>Título</h3>
              <button
                type="button"
                className="admin-btn admin-btn--ghost admin-btn--sm"
                onClick={() => copiar(resultado.titulo, "titulo")}
              >
                {copiado === "titulo" ? "Copiado ✓" : "Copiar"}
              </button>
            </div>
            <p className="admin-texto__out admin-texto__out--tit">{resultado.titulo}</p>
          </div>

          <div className="admin-texto__block">
            <div className="admin-texto__block-hdr">
              <h3>Texto del anuncio</h3>
              <button
                type="button"
                className="admin-btn admin-btn--ghost admin-btn--sm"
                onClick={() => copiar(resultado.cuerpo, "cuerpo")}
              >
                {copiado === "cuerpo" ? "Copiado ✓" : "Copiar"}
              </button>
            </div>
            <p className="admin-texto__out">{resultado.cuerpo}</p>
          </div>

          <button
            type="button"
            className="admin-btn admin-btn--primary admin-texto__copy-all"
            onClick={() => copiar(resultado.completo, "todo")}
          >
            {copiado === "todo" ? "¡Copiado todo! ✓" : "Copiar título + texto"}
          </button>
        </section>
      )}
    </main>
  );
}
