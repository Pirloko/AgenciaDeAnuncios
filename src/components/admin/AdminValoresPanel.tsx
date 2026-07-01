"use client";

import { useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { TablaValoresPorSitio } from "@/components/TablasValores";
import {
  abrirWhatsappTexto,
  capturarElementoComoPng,
  compartirImagenWhatsapp,
  mensajeWhatsappValores,
  urlValoresPublica,
} from "@/lib/valores-compartir";
import { rutaValores, VALORES_INTRO, type ValoresSitioSlug } from "@/lib/valores-seo";
import type { Sitio } from "@/types/sitio";

export interface SitioValoresAdmin {
  slug: ValoresSitioSlug;
  sitio: Sitio;
}

interface Props {
  sitios: SitioValoresAdmin[];
}

export default function AdminValoresPanel({ sitios }: Props) {
  const captureRef = useRef<HTMLDivElement>(null);
  const [activo, setActivo] = useState<ValoresSitioSlug>(sitios[0]?.slug ?? "skokka");
  const [expandirChimbis, setExpandirChimbis] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [aviso, setAviso] = useState("");
  const [copiado, setCopiado] = useState(false);

  const actual = sitios.find((s) => s.slug === activo) ?? sitios[0];
  if (!actual) {
    return (
      <main className="admin-page">
        <p className="admin-error">No hay tablas de valores disponibles.</p>
      </main>
    );
  }

  const { slug, sitio } = actual;
  const brandStyle = {
    "--brand": sitio.color,
    "--brand-soft": sitio.color + "1f",
    "--accent": sitio.accent,
  } as CSSProperties;

  const mensajeWhatsapp = mensajeWhatsappValores(slug, sitio.nombre);
  const urlPublica = urlValoresPublica(slug);

  async function esperarRender() {
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
  }

  async function compartirComoImagen() {
    if (!captureRef.current) return;
    setCargando(true);
    setAviso("");

    if (slug === "chimbis") setExpandirChimbis(true);
    await esperarRender();

    try {
      const blob = await capturarElementoComoPng(captureRef.current);
      const resultado = await compartirImagenWhatsapp(
        blob,
        `${slug}-valores.png`,
        mensajeWhatsapp
      );
      setAviso(
        resultado === "shared"
          ? "Listo. Elige WhatsApp en el menú de compartir."
          : "Imagen descargada. Se abrió WhatsApp: adjunta el archivo PNG al chat."
      );
    } catch {
      setAviso("No se pudo generar la imagen. Intenta de nuevo.");
    } finally {
      setExpandirChimbis(false);
      setCargando(false);
    }
  }

  async function copiarEnlace() {
    try {
      await navigator.clipboard.writeText(urlPublica);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      setAviso("No se pudo copiar el enlace.");
    }
  }

  return (
    <main className="admin-page admin-valores">
      <header className="admin-hdr">
        <div>
          <Link href="/admin" className="admin-back">
            ← Panel
          </Link>
          <h1 className="admin-title">Tablas de valores para clientas</h1>
          <p className="admin-muted">
            Vista previa de las mismas tablas públicas. Comparte el enlace o envía la tabla como
            imagen por WhatsApp.
          </p>
        </div>
      </header>

      <div className="admin-valores__tabs" role="tablist" aria-label="Sitios">
        {sitios.map(({ slug: s, sitio: sit }) => (
          <button
            key={s}
            type="button"
            role="tab"
            aria-selected={activo === s}
            className={`admin-valores__tab${activo === s ? " admin-valores__tab--on" : ""}`}
            onClick={() => {
              setActivo(s);
              setAviso("");
            }}
          >
            {sit.nombre}
          </button>
        ))}
      </div>

      <section className="admin-valores__actions">
        <a
          href={rutaValores(slug)}
          target="_blank"
          rel="noopener noreferrer"
          className="admin-btn admin-btn--ghost"
        >
          Ver página pública
        </a>
        <button type="button" className="admin-btn admin-btn--ghost" onClick={copiarEnlace}>
          {copiado ? "Enlace copiado ✓" : "Copiar enlace"}
        </button>
        <button
          type="button"
          className="admin-btn admin-btn--ghost admin-btn--wa"
          onClick={() => abrirWhatsappTexto(mensajeWhatsapp)}
        >
          WhatsApp (enlace)
        </button>
        <button
          type="button"
          className="admin-btn admin-btn--primary admin-btn--wa"
          onClick={compartirComoImagen}
          disabled={cargando}
        >
          {cargando ? "Generando imagen…" : "WhatsApp (imagen)"}
        </button>
      </section>

      {aviso && <p className="admin-toast admin-valores__toast">{aviso}</p>}

      <p className="admin-valores__hint">
        <b>WhatsApp (imagen):</b> en el celular abre el menú nativo para elegir WhatsApp. En
        computador descarga la imagen y abre WhatsApp para adjuntarla al chat.
      </p>

      <div
        ref={captureRef}
        className="admin-valores__capture page-valores"
        style={brandStyle}
      >
        <div className="admin-valores__capture-brand">
          <div className="home-avatar">
            {/* img nativo: html2canvas no captura bien next/image */}
            <img
              src="/perfil-agencia.png"
              alt="Agencia de Publicaciones para Escort"
              className="home-avatar__img"
              width={128}
              height={128}
            />
          </div>
          <p className="admin-valores__capture-agencia">
            Agencia de Publicaciones
            <br />
            para Escort
          </p>
        </div>

        <div className="admin-valores__capture-hdr">
          <span className="logo">{sitio.nombre}</span>
          <p className="admin-valores__capture-sub">Tabla completa de valores — Agencia de Publicaciones</p>
        </div>

        <article className="valores-article admin-valores__capture-body">
          <h2 className="valores-title">Valores en {sitio.nombre}</h2>
          <p className="valores-intro admin-valores__intro-corta">{VALORES_INTRO[slug]}</p>
          <TablaValoresPorSitio slug={slug} sitio={sitio} expandirChimbis={expandirChimbis} />
          <p className="admin-valores__capture-url">{urlPublica}</p>
        </article>
      </div>
    </main>
  );
}
