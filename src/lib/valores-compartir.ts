import { SITE_URL } from "@/lib/seo";
import { rutaValores, type ValoresSitioSlug } from "@/lib/valores-seo";
import { NUMERO_WHATSAPP } from "@/lib/whatsapp";

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
  window.open(
    `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(texto)}`,
    "_blank",
    "noopener,noreferrer"
  );
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

export type ResultadoCompartirImagen = "shared" | "copied" | "unsupported";

/**
 * Comparte la imagen sin descargar:
 * 1) Menú nativo de compartir (ideal en celular → WhatsApp)
 * 2) Copia la foto al portapapeles para pegarla en el chat
 */
export async function compartirImagenWhatsapp(
  blob: Blob,
  nombreArchivo: string,
  textoFallback: string
): Promise<ResultadoCompartirImagen> {
  const file = new File([blob], nombreArchivo, { type: "image/png" });
  const titulo = nombreArchivo.replace(/\.png$/i, "");

  if (typeof navigator.share === "function") {
    const conArchivos: ShareData = {
      files: [file],
      title: titulo,
      text: textoFallback,
    };
    try {
      const puedeArchivos =
        typeof navigator.canShare !== "function" || navigator.canShare({ files: [file] });
      if (puedeArchivos) {
        await navigator.share(conArchivos);
        return "shared";
      }
    } catch (err) {
      if (esAbortoUsuario(err)) throw err;
      // Sigue con portapapeles
    }
  }

  try {
    if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": blob,
        }),
      ]);
      abrirWhatsappTexto(textoFallback);
      return "copied";
    }
  } catch {
    // Sigue a unsupported
  }

  return "unsupported";
}

function esAbortoUsuario(err: unknown): boolean {
  return err instanceof DOMException && err.name === "AbortError";
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
