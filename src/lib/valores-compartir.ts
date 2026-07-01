import { SITE_URL } from "@/lib/seo";
import { rutaValores, type ValoresSitioSlug } from "@/lib/valores-seo";

export function urlValoresPublica(slug: ValoresSitioSlug): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}${rutaValores(slug)}`;
  }
  return `${SITE_URL}${rutaValores(slug)}`;
}

export function mensajeWhatsappValores(slug: ValoresSitioSlug, nombreSitio: string): string {
  return `Hola! Te comparto la tabla completa de valores en ${nombreSitio}:\n${urlValoresPublica(slug)}`;
}

export function abrirWhatsappTexto(texto: string): void {
  window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, "_blank", "noopener,noreferrer");
}

export async function capturarElementoComoPng(el: HTMLElement): Promise<Blob> {
  await esperarImagenesEn(el);

  const { default: html2canvas } = await import("html2canvas");
  const canvas = await html2canvas(el, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
    logging: false,
    scrollY: -window.scrollY,
  });

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("No se pudo generar la imagen"));
    }, "image/png");
  });
}

export type ResultadoCompartirImagen = "shared" | "downloaded";

export async function compartirImagenWhatsapp(
  blob: Blob,
  nombreArchivo: string,
  textoFallback: string
): Promise<ResultadoCompartirImagen> {
  const file = new File([blob], nombreArchivo, { type: "image/png" });

  if (typeof navigator.share === "function" && navigator.canShare?.({ files: [file] })) {
    await navigator.share({
      files: [file],
      title: nombreArchivo.replace(/\.png$/i, ""),
      text: textoFallback,
    });
    return "shared";
  }

  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = nombreArchivo;
  enlace.click();
  URL.revokeObjectURL(url);

  abrirWhatsappTexto(`${textoFallback}\n\n(Adjunta la imagen "${nombreArchivo}" que se acaba de descargar)`);
  return "downloaded";
}

function esperarImagenesEn(container: HTMLElement): Promise<void> {
  const imgs = Array.from(container.querySelectorAll("img"));
  if (imgs.length === 0) return Promise.resolve();

  return Promise.all(
    imgs.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) resolve();
          else {
            img.addEventListener("load", () => resolve(), { once: true });
            img.addEventListener("error", () => resolve(), { once: true });
          }
        })
    )
  ).then(() => undefined);
}
