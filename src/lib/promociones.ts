import {
  type AnuncioCosto,
  type SitioAdmin,
  SITIOS_ADMIN,
  SITIO_ADMIN_LABEL,
  PLAN_LABEL,
  CATEGORIA_LABEL,
  filtrarCostosSitio,
  clpAdmin,
} from "@/lib/admin-costos";
import {
  ESCORCITAS_PRECIOS,
  type EscorcitasDias,
  type EscorcitasPlan,
} from "@/lib/escorcitas";
import {
  SIMPLEESCORT_DIAS,
  SIMPLEESCORT_HORARIOS_TOTAL,
  calcularTotalSimpleEscort,
  type SimpleEscortDias,
} from "@/lib/simpleescort";
import { WENAS_DIAS_ORDER, WENAS_PRECIOS, type WenasDias } from "@/lib/wenas";
import { iterarOfertasLocanto, LOCANTO_DIAS } from "@/lib/locanto";
import { iterarOfertasChimbis } from "@/lib/chimbis";
import { FALLBACK } from "@/lib/sitios";
import { SKOKKA_PLANES_WEB } from "@/lib/admin-costos";

/** Sobrante máximo deseable al ajustar una promoción al presupuesto. */
export const SOBRANTE_OBJETIVO = 1500;

/** Días que ofrece el asistente de promociones (público y admin). */
export const DIAS_PROMO = [1, 3, 7] as const;
export type DiasPromo = (typeof DIAS_PROMO)[number];

/** Zona geográfica (afecta precios de Chimbis; otras páginas se mantienen). */
export type ZonaPromo = "santiago" | "regiones";

export const ZONA_PROMO_OPTS: { id: ZonaPromo; label: string; hint: string }[] = [
  {
    id: "santiago",
    label: "Santiago o comunas de Santiago",
    hint: "Región Metropolitana",
  },
  {
    id: "regiones",
    label: "Regiones sur o norte",
    hint: "Ciudades fuera de Santiago / RM",
  },
];

export const ZONA_PROMO_LABEL: Record<ZonaPromo, string> = {
  santiago: "Santiago / comunas",
  regiones: "Sur o norte",
};

/** Cuántas opciones distintas se muestran (si existen). */
export const MIN_OPCIONES_PROMO = 3;
export const MAX_OPCIONES_PROMO = 8;

export interface LineaPromo {
  id: string;
  sitio: SitioAdmin;
  plan: string;
  etiqueta: string;
  categoria: string;
  dias: number;
  subidas: number | null;
  precio: number;
}

export interface PromocionSugerida {
  id: string;
  nombre: string;
  descripcion: string;
  lineas: LineaPromo[];
  total: number;
  sobrante: number;
  sitios: SitioAdmin[];
}

export interface FiltrosPromo {
  presupuesto: number;
  dias: number;
  zona: ZonaPromo;
  /** Páginas elegidas por la usuaria (mín. 2 en flujo público). */
  sitios?: SitioAdmin[];
}

/** Mínimo de páginas a elegir en el asistente público. */
export const MIN_SITIOS_PROMO = 2;

export function parsePresupuestoCLP(raw: string): number | null {
  const limpio = raw.trim().replace(/\./g, "").replace(/,/g, "");
  if (!limpio) return null;
  const n = Number(limpio);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
}

/** Ofertas desde precios de la web pública (sin filas admin). */
function catalogoDesdeWebPublica(): LineaPromo[] {
  const out: LineaPromo[] = [];

  // Skokka — precio por 1 horario (diurno) / precio plano (madrugada)
  const skokka = FALLBACK.skokka;
  if (skokka) {
    const mapPlan: Record<string, string> = {
      TOP: "TOP",
      "SUPER TOP": "SUPERTOP",
      "TOP ALL IN ONE": "FULL DESTACADO",
    };
    for (const [modalidad, tabla] of [
      ["diurno", skokka.diurno],
      ["madrugada", skokka.madrugada],
    ] as const) {
      for (const [key, precios] of Object.entries(tabla)) {
        const [subidas, dias] = key.split("-").map(Number);
        for (const [nivelWeb, precio] of Object.entries(precios)) {
          const plan = mapPlan[nivelWeb] ?? nivelWeb;
          if (!(SKOKKA_PLANES_WEB as readonly string[]).includes(plan)) continue;
          if (typeof precio !== "number" || precio <= 0) continue;
          out.push({
            id: `web-skokka-${modalidad}-${plan}-${subidas}-${dias}`,
            sitio: "skokka",
            plan,
            etiqueta: `${PLAN_LABEL[plan] ?? plan} · ${subidas} sub · ${dias}d · ${modalidad === "diurno" ? "día" : "madrugada"}`,
            categoria: modalidad,
            dias,
            subidas,
            precio,
          });
        }
      }
    }
  }

  // Chimbis
  for (const o of iterarOfertasChimbis()) {
    const categoria = o.region === "santiago" ? "santiago" : "regiones";
    out.push({
      id: `web-chimbis-${o.region}-${o.plan}-${o.subidas}-${o.dias}`,
      sitio: "chimbis",
      plan: o.plan,
      etiqueta: `${PLAN_LABEL[o.plan] ?? o.plan} · ${o.subidas} sub · ${o.dias}d`,
      categoria,
      dias: o.dias,
      subidas: o.subidas,
      precio: o.precio,
    });
  }

  // Locanto
  for (const o of iterarOfertasLocanto()) {
    out.push({
      id: `web-locanto-${o.plan}`,
      sitio: "locanto",
      plan: o.plan,
      etiqueta: o.nombre,
      categoria: "general",
      dias: LOCANTO_DIAS,
      subidas: null,
      precio: o.precio,
    });
  }

  for (const dias of SIMPLEESCORT_DIAS) {
    const d = dias as SimpleEscortDias;
    const full = calcularTotalSimpleEscort(d, SIMPLEESCORT_HORARIOS_TOTAL);
    out.push({
      id: `web-simpleescort-full-${d}`,
      sitio: "simpleescort",
      plan: "SUPER_TURBO_FULL",
      etiqueta: `Super Turbo 5X full · ${d}d`,
      categoria: "general",
      dias: d,
      subidas: 20,
      precio: full,
    });
    for (const horarios of [1, 2, 3] as const) {
      const precio = calcularTotalSimpleEscort(d, horarios);
      if (precio >= full) continue;
      out.push({
        id: `web-simpleescort-${horarios}h-${d}`,
        sitio: "simpleescort",
        plan: `SUPER_TURBO_${horarios}H`,
        etiqueta: `Super Turbo 5X · ${horarios} horario${horarios > 1 ? "s" : ""} · ${d}d`,
        categoria: "general",
        dias: d,
        subidas: 5 * horarios,
        precio,
      });
    }
  }

  const planes: EscorcitasPlan[] = ["TOP", "PREMIUM", "GOLD"];
  const diasEsc: EscorcitasDias[] = [1, 3, 7];
  for (const dias of diasEsc) {
    for (const plan of planes) {
      out.push({
        id: `web-escorcitas-${plan}-${dias}`,
        sitio: "escorcitas",
        plan,
        etiqueta: `${plan} · ${dias}d`,
        categoria: "general",
        dias,
        subidas: null,
        precio: ESCORCITAS_PRECIOS[dias][plan],
      });
    }
  }

  for (const dias of WENAS_DIAS_ORDER) {
    const d = dias as WenasDias;
    out.push({
      id: `web-wenas-vip-${d}`,
      sitio: "wenas",
      plan: "VIP",
      etiqueta: `VIP · ${d}d`,
      categoria: "general",
      dias: d,
      subidas: null,
      precio: WENAS_PRECIOS[d],
    });
  }

  return out;
}

/** Catálogo solo con precios públicos (sin login admin). */
export function catalogoPublicoPromo(): LineaPromo[] {
  return construirCatalogo([]);
}

export function construirCatalogo(costos: AnuncioCosto[]): LineaPromo[] {
  const out: LineaPromo[] = [];
  const sitiosConFilas = new Set<SitioAdmin>();

  for (const sitio of SITIOS_ADMIN) {
    const items = filtrarCostosSitio(
      costos.filter((c) => c.sitio === sitio && c.precio_venta != null && c.precio_venta > 0),
      sitio
    );
    if (items.length) sitiosConFilas.add(sitio);
    for (const c of items) {
      out.push({
        id: c.id,
        sitio: c.sitio,
        plan: c.plan,
        etiqueta: c.etiqueta,
        categoria: c.categoria,
        dias: c.dias,
        subidas: c.subidas,
        precio: c.precio_venta!,
      });
    }
  }

  // Completar SimpleEscort / Escorcitas desde la web si no hay filas en admin
  for (const linea of catalogoDesdeWebPublica()) {
    if (sitiosConFilas.has(linea.sitio)) continue;
    out.push(linea);
  }

  return out;
}

/** Días del asistente que tienen al menos un anuncio con precio web. */
export function diasDisponiblesPromo(costos: AnuncioCosto[]): number[] {
  const catalogo = construirCatalogo(costos);
  const set = new Set(catalogo.map((i) => i.dias));
  return DIAS_PROMO.filter((d) => set.has(d));
}

/** Filtra catálogo por zona: Chimbis según Santiago/regiones; el resto se mantiene. */
function filtrarPorZona(catalogo: LineaPromo[], zona: ZonaPromo): LineaPromo[] {
  return catalogo.filter((i) => {
    if (i.sitio !== "chimbis") return true;
    return i.categoria === zona;
  });
}

/** Páginas donde hay al menos un anuncio que cabe en el presupuesto para esos días y zona. */
export function sitiosAlcanzables(
  costos: AnuncioCosto[],
  presupuesto: number,
  dias: number,
  zona: ZonaPromo
): SitioAdmin[] {
  const catalogo = filtrarPorZona(
    construirCatalogo(costos).filter((i) => i.dias === dias && i.precio <= presupuesto),
    zona
  );
  const set = new Set(catalogo.map((i) => i.sitio));
  return SITIOS_ADMIN.filter((s) => set.has(s));
}

function totalLineas(lineas: LineaPromo[]): number {
  return lineas.reduce((s, l) => s + l.precio, 0);
}

function descripcionLinea(l: LineaPromo): string {
  const plan = PLAN_LABEL[l.plan] ?? l.plan;
  const zona = CATEGORIA_LABEL[l.categoria] ?? l.categoria;
  const sub = l.subidas != null ? `${l.subidas} sub · ` : "";
  return `${SITIO_ADMIN_LABEL[l.sitio]} · ${plan} · ${zona} · ${sub}${l.dias}d`;
}

function idCombo(lineas: LineaPromo[]): string {
  return lineas
    .map((l) => l.id)
    .sort()
    .join("-");
}

function textoSobrante(sobrante: number): string {
  if (sobrante === 0) return "Queda justo en el presupuesto.";
  if (sobrante <= SOBRANTE_OBJETIVO) {
    return `Ajustado al presupuesto — sobran solo ${clpAdmin(sobrante)}.`;
  }
  return `Sobra ${clpAdmin(sobrante)} del presupuesto.`;
}

function nombrePromo(lineas: LineaPromo[]): string {
  const sitios = [...new Set(lineas.map((l) => l.sitio))];
  const n = lineas.length;
  if (n === 1) {
    return `1 anuncio en ${SITIO_ADMIN_LABEL[sitios[0]]}`;
  }
  if (sitios.length === 1) {
    return `${n} anuncios en ${SITIO_ADMIN_LABEL[sitios[0]]}`;
  }
  if (sitios.length === n) {
    return `1 anuncio en ${sitios.length} páginas`;
  }
  return `${n} anuncios · ${sitios.length} páginas`;
}

function empaquetar(lineas: LineaPromo[], presupuesto: number): PromocionSugerida | null {
  if (!lineas.length) return null;
  const total = totalLineas(lineas);
  if (total > presupuesto || total <= 0) return null;
  const sobrante = presupuesto - total;
  const sitios = [...new Set(lineas.map((l) => l.sitio))];
  return {
    id: idCombo(lineas),
    nombre: nombrePromo(lineas),
    descripcion: textoSobrante(sobrante),
    lineas: [...lineas].sort((a, b) => b.precio - a.precio),
    total,
    sobrante,
    sitios,
  };
}

/** Subconjuntos no vacíos de sitios (máx. 5 sitios para cubrir el catálogo actual). */
function subconjuntosSitios(sitios: SitioAdmin[]): SitioAdmin[][] {
  const base = sitios.slice(0, 5);
  const out: SitioAdmin[][] = [];
  const n = base.length;
  for (let mask = 1; mask < 1 << n; mask++) {
    const sub: SitioAdmin[] = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) sub.push(base[i]);
    }
    out.push(sub);
  }
  return out.sort((a, b) => a.length - b.length || a.join().localeCompare(b.join()));
}

/** Mejor combo: exactamente un anuncio por sitio, más cercano al presupuesto. */
function mejorUnoPorSitio(
  catalogo: LineaPromo[],
  sitios: SitioAdmin[],
  presupuesto: number
): LineaPromo[] | null {
  const porSitio = sitios.map((s) =>
    catalogo.filter((i) => i.sitio === s).sort((a, b) => b.precio - a.precio)
  );
  if (porSitio.some((arr) => !arr.length)) return null;

  let mejor: LineaPromo[] | null = null;
  let mejorSobrante = presupuesto + 1;

  function buscar(idx: number, acum: LineaPromo[], total: number) {
    if (idx === sitios.length) {
      const sobrante = presupuesto - total;
      if (sobrante >= 0 && sobrante < mejorSobrante) {
        mejorSobrante = sobrante;
        mejor = [...acum];
      }
      return;
    }
    for (const item of porSitio[idx]) {
      if (total + item.precio > presupuesto) continue;
      buscar(idx + 1, [...acum, item], total + item.precio);
    }
  }

  buscar(0, [], 0);
  return mejor;
}

/** Paquetes de 1 anuncio (los más cercanos al tope). */
function paquetesUnAnuncio(catalogo: LineaPromo[], presupuesto: number): LineaPromo[][] {
  return catalogo
    .filter((i) => i.precio <= presupuesto)
    .sort((a, b) => presupuesto - a.precio - (presupuesto - b.precio) || b.precio - a.precio)
    .slice(0, 12)
    .map((i) => [i]);
}

/** Paquetes de 2 anuncios distintos que quepan. */
function paquetesDosAnuncios(catalogo: LineaPromo[], presupuesto: number): LineaPromo[][] {
  const ordenados = [...catalogo].sort((a, b) => b.precio - a.precio);
  const out: LineaPromo[][] = [];
  const vistos = new Set<string>();

  for (let i = 0; i < ordenados.length; i++) {
    for (let j = i + 1; j < ordenados.length; j++) {
      const a = ordenados[i];
      const b = ordenados[j];
      const total = a.precio + b.precio;
      if (total > presupuesto) continue;
      const key = [a.id, b.id].sort().join("-");
      if (vistos.has(key)) continue;
      vistos.add(key);
      out.push([a, b]);
      if (out.length >= 40) return out;
    }
  }
  return out;
}

/** Paquetes de 3 anuncios (muestra limitada). */
function paquetesTresAnuncios(catalogo: LineaPromo[], presupuesto: number): LineaPromo[][] {
  const ordenados = [...catalogo].sort((a, b) => b.precio - a.precio).slice(0, 20);
  const out: LineaPromo[][] = [];
  const vistos = new Set<string>();

  for (let i = 0; i < ordenados.length; i++) {
    for (let j = i + 1; j < ordenados.length; j++) {
      const parcial = ordenados[i].precio + ordenados[j].precio;
      if (parcial >= presupuesto) continue;
      for (let k = j + 1; k < ordenados.length; k++) {
        const total = parcial + ordenados[k].precio;
        if (total > presupuesto) continue;
        const lineas = [ordenados[i], ordenados[j], ordenados[k]];
        const key = lineas
          .map((l) => l.id)
          .sort()
          .join("-");
        if (vistos.has(key)) continue;
        vistos.add(key);
        out.push(lineas);
        if (out.length >= 30) return out;
      }
    }
  }
  return out;
}

/**
 * Genera opciones de promoción con presupuesto + días + zona (+ páginas opcionales).
 * Incluye combinaciones de 1 o más páginas / anuncios, priorizando las más cercanas al monto.
 * Si se pasan `sitios` (≥2), solo usa esas páginas y prioriza paquetes multipágina.
 */
export function generarPromociones(
  costos: AnuncioCosto[],
  filtros: FiltrosPromo
): PromocionSugerida[] {
  const { presupuesto, dias, zona } = filtros;
  if (presupuesto <= 0 || !Number.isFinite(dias)) return [];

  let catalogo = filtrarPorZona(
    construirCatalogo(costos).filter((i) => i.dias === dias && i.precio <= presupuesto),
    zona
  );

  const sitiosFiltro = filtros.sitios?.length
    ? [...new Set(filtros.sitios)]
    : null;
  if (sitiosFiltro) {
    catalogo = catalogo.filter((i) => sitiosFiltro.includes(i.sitio));
  }
  if (!catalogo.length) return [];

  const sitiosEnCatalogo = [...new Set(catalogo.map((i) => i.sitio))];
  const sitios = sitiosFiltro
    ? sitiosFiltro.filter((s) => sitiosEnCatalogo.includes(s))
    : sitiosEnCatalogo;
  if (!sitios.length) return [];

  const exigirMulti = Boolean(sitiosFiltro && sitiosFiltro.length >= MIN_SITIOS_PROMO);
  const candidatas: PromocionSugerida[] = [];
  const vistas = new Set<string>();

  function agregar(lineas: LineaPromo[] | null) {
    if (!lineas?.length) return;
    if (exigirMulti) {
      const nSitios = new Set(lineas.map((l) => l.sitio)).size;
      if (nSitios < MIN_SITIOS_PROMO) return;
    }
    const promo = empaquetar(lineas, presupuesto);
    if (!promo || vistas.has(promo.id)) return;
    vistas.add(promo.id);
    candidatas.push(promo);
  }

  for (const sub of subconjuntosSitios(sitios)) {
    if (exigirMulti && sub.length < MIN_SITIOS_PROMO) continue;
    agregar(mejorUnoPorSitio(catalogo, sub, presupuesto));
  }

  if (!exigirMulti) {
    for (const pack of paquetesUnAnuncio(catalogo, presupuesto)) {
      agregar(pack);
    }
  }
  for (const pack of paquetesDosAnuncios(catalogo, presupuesto)) {
    agregar(pack);
  }
  for (const pack of paquetesTresAnuncios(catalogo, presupuesto)) {
    agregar(pack);
  }

  candidatas.sort((a, b) => {
    if (a.sobrante !== b.sobrante) return a.sobrante - b.sobrante;
    if (a.sitios.length !== b.sitios.length) return b.sitios.length - a.sitios.length;
    return b.total - a.total;
  });

  // Diversificar: no solo el mismo sitio/estilo
  const elegidas: PromocionSugerida[] = [];
  const firmas = new Set<string>();

  function firma(p: PromocionSugerida): string {
    return `${p.sitios.slice().sort().join("+")}|${p.lineas.length}|${p.total}`;
  }

  for (const p of candidatas) {
    const f = firma(p);
    if (firmas.has(f) && elegidas.length >= MIN_OPCIONES_PROMO) continue;
    firmas.add(f);
    elegidas.push(p);
    if (elegidas.length >= MAX_OPCIONES_PROMO) break;
  }

  // Si aún faltan para llegar a 3, completar con las siguientes por sobrante
  if (elegidas.length < MIN_OPCIONES_PROMO) {
    for (const p of candidatas) {
      if (elegidas.some((e) => e.id === p.id)) continue;
      elegidas.push(p);
      if (elegidas.length >= MIN_OPCIONES_PROMO) break;
    }
  }

  return elegidas;
}

export function resumenLineaPromo(l: LineaPromo): string {
  return descripcionLinea(l);
}

export function resumenSitiosPromo(sitios: SitioAdmin[]): string {
  return sitios.map((s) => SITIO_ADMIN_LABEL[s]).join(" · ");
}

/** Texto listo para WhatsApp al pedir una promoción. */
export function mensajeWhatsAppPromo(
  promo: PromocionSugerida,
  filtros: { presupuesto: number; dias: number; zona: ZonaPromo }
): string {
  const lineas = promo.lineas.map((l) => `• ${resumenLineaPromo(l)} — ${clpAdmin(l.precio)}`).join("\n");
  return (
    `¡Hola! Quiero esta promoción:\n` +
    `• Presupuesto: ${clpAdmin(filtros.presupuesto)}\n` +
    `• ${filtros.dias} día${filtros.dias > 1 ? "s" : ""} · ${ZONA_PROMO_LABEL[filtros.zona]}\n` +
    `• Opción: ${promo.nombre}\n` +
    `${lineas}\n` +
    `• Total: ${clpAdmin(promo.total)}` +
    (promo.sobrante > 0 ? `\n• Sobra: ${clpAdmin(promo.sobrante)}` : "")
  );
}
