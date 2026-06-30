import type { ChimbisPlan } from "@/lib/chimbis";
import { CHIMBIS_EJEMPLOS } from "@/lib/chimbis-ejemplos";
import type { EscorcitasPlan } from "@/lib/escorcitas";
import { ESCORCITAS_EJEMPLOS } from "@/lib/escorcitas-ejemplos";
import { LOCANTO_EJEMPLOS } from "@/lib/locanto-ejemplos";
import { SKOKKA_EJEMPLOS } from "@/lib/skokka-ejemplos";

export const ANUNCIOS_SITIOS = [
  "skokka",
  "chimbis",
  "locanto",
  "simpleescort",
  "escorcitas",
] as const;
export type AnunciosSitioSlug = (typeof ANUNCIOS_SITIOS)[number];

export interface EjemploVisual {
  src: string;
  alt: string;
  label: string;
  width: number;
  height: number;
}

export function esAnunciosSitio(slug: string): slug is AnunciosSitioSlug {
  return (ANUNCIOS_SITIOS as readonly string[]).includes(slug);
}

export function rutaAnuncios(sitioSlug: string): string {
  return `/anuncios-${sitioSlug}`;
}

export function enlaceFaqAnuncios(sitioSlug: string, pregunta: string, index: number): string {
  return `${rutaAnuncios(sitioSlug)}#${faqAnchorId(pregunta, index)}`;
}

/** ID estable para anclas SEO (sin acentos ni signos). */
export function faqAnchorId(pregunta: string, index: number): string {
  const base = pregunta
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[¿?«»"'’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72);
  return base || `pregunta-${index + 1}`;
}

export function ejemplosVisualesSitio(sitioSlug: string): EjemploVisual[] {
  switch (sitioSlug) {
    case "skokka":
      return Object.values(SKOKKA_EJEMPLOS);
    case "chimbis":
      return (Object.keys(CHIMBIS_EJEMPLOS) as ChimbisPlan[]).map((k) => CHIMBIS_EJEMPLOS[k]);
    case "locanto":
      return [LOCANTO_EJEMPLOS.TOP[0], LOCANTO_EJEMPLOS.GALERIA[0]];
    case "simpleescort":
      return [
        {
          src: "/simpleescort/superturbo-ejemplo.png",
          alt: "Ejemplo de aviso Super Turbo en SimpleEscorts",
          label: "Super Turbo",
          width: 962,
          height: 543,
        },
      ];
    case "escorcitas":
      return (Object.keys(ESCORCITAS_EJEMPLOS) as EscorcitasPlan[]).map(
        (k) => ESCORCITAS_EJEMPLOS[k]
      );
    default:
      return [];
  }
}
