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


/** Sobrante máximo deseable al ajustar una promoción al presupuesto. */
export const SOBRANTE_OBJETIVO = 1500;

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
}

export interface FiltrosPromo {
  presupuesto: number;
  sitiosElegidos: SitioAdmin[];
  dias: number | "all";
}

export function parsePresupuestoCLP(raw: string): number | null {
  const limpio = raw.trim().replace(/\./g, "").replace(/,/g, "");
  if (!limpio) return null;
  const n = Number(limpio);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
}

export function sitiosConPrecioVenta(costos: AnuncioCosto[]): SitioAdmin[] {
  const catalogo = construirCatalogo(costos);
  const set = new Set(catalogo.map((i) => i.sitio));
  return SITIOS_ADMIN.filter((s) => set.has(s));
}

export function diasDisponiblesPromo(
  costos: AnuncioCosto[],
  sitios: SitioAdmin[]
): number[] {
  const catalogo = construirCatalogo(costos).filter((i) => sitios.includes(i.sitio));
  return [...new Set(catalogo.map((i) => i.dias))].sort((a, b) => a - b);
}

export function construirCatalogo(costos: AnuncioCosto[]): LineaPromo[] {
  const out: LineaPromo[] = [];
  for (const sitio of SITIOS_ADMIN) {
    const items = filtrarCostosSitio(
      costos.filter((c) => c.sitio === sitio && c.precio_venta != null && c.precio_venta > 0),
      sitio
    );
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
  return out;
}

function filtrarCatalogo(
  catalogo: LineaPromo[],
  sitios: SitioAdmin[],
  dias: number | "all"
): LineaPromo[] {
  let r = catalogo.filter((i) => sitios.includes(i.sitio));
  if (dias !== "all") r = r.filter((i) => i.dias === dias);
  return r;
}

function totalLineas(lineas: LineaPromo[]): number {
  return lineas.reduce((s, l) => s + l.precio, 0);
}

function cubreSitios(lineas: LineaPromo[], sitios: SitioAdmin[]): boolean {
  return sitios.every((s) => lineas.some((l) => l.sitio === s));
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
  if (sobrante <= SOBRANTE_OBJETIVO) {
    return `Ajustado al presupuesto — sobran solo ${clpAdmin(sobrante)}.`;
  }
  return `Usa ${clpAdmin(sobrante)} menos que tu tope (no hay combinación más cercana con estos filtros).`;
}

function empaquetar(
  nombre: string,
  descripcion: string,
  lineas: LineaPromo[],
  presupuesto: number
): PromocionSugerida | null {
  if (!lineas.length) return null;
  const total = totalLineas(lineas);
  if (total > presupuesto) return null;
  const sobrante = presupuesto - total;
  return {
    id: idCombo(lineas),
    nombre,
    descripcion: `${descripcion} ${textoSobrante(sobrante)}`,
    lineas,
    total,
    sobrante,
  };
}

/** Añade o mejora ítems hasta acercarse al presupuesto (mínimo sobrante). */
function optimizarAlPresupuesto(
  inicio: LineaPromo[],
  catalogo: LineaPromo[],
  presupuesto: number,
  sitiosRequeridos: SitioAdmin[]
): LineaPromo[] | null {
  const lineas = [...inicio];
  const usados = new Set(lineas.map((l) => l.id));

  for (const sitio of sitiosRequeridos) {
    if (lineas.some((l) => l.sitio === sitio)) continue;
    const opciones = catalogo
      .filter((i) => i.sitio === sitio && !usados.has(i.id))
      .filter((i) => totalLineas(lineas) + i.precio <= presupuesto)
      .sort((a, b) => b.precio - a.precio);
    if (!opciones.length) return null;
    lineas.push(opciones[0]);
    usados.add(opciones[0].id);
  }

  if (!cubreSitios(lineas, sitiosRequeridos)) return null;

  const maxPasos = catalogo.length * 3;
  for (let paso = 0; paso < maxPasos; paso++) {
    const total = totalLineas(lineas);
    const sobrante = presupuesto - total;
    if (sobrante <= SOBRANTE_OBJETIVO) break;

    let mejorSobrante = sobrante;
    let mejorLineas: LineaPromo[] | null = null;

    for (let i = 0; i < lineas.length; i++) {
      const actual = lineas[i];
      const cupo = sobrante + actual.precio;
      for (const cand of catalogo) {
        if (cand.sitio !== actual.sitio || usados.has(cand.id) || cand.precio > cupo) continue;
        const nuevoTotal = total - actual.precio + cand.precio;
        const nuevoSobrante = presupuesto - nuevoTotal;
        if (nuevoSobrante >= 0 && nuevoSobrante < mejorSobrante) {
          mejorSobrante = nuevoSobrante;
          const next = [...lineas];
          next[i] = cand;
          mejorLineas = next;
        }
      }
    }

    for (const cand of catalogo) {
      if (usados.has(cand.id)) continue;
      const nuevoTotal = total + cand.precio;
      if (nuevoTotal > presupuesto) continue;
      const nuevoSobrante = presupuesto - nuevoTotal;
      if (nuevoSobrante < mejorSobrante) {
        mejorSobrante = nuevoSobrante;
        mejorLineas = [...lineas, cand];
      }
    }

    if (!mejorLineas) break;

    usados.clear();
    for (const l of mejorLineas) usados.add(l.id);
    lineas.splice(0, lineas.length, ...mejorLineas);
  }

  return cubreSitios(lineas, sitiosRequeridos) ? lineas : null;
}

/** Mejor combinación de un anuncio por sitio que más se acerca al presupuesto. */
function mejorUnoPorSitio(
  catalogo: LineaPromo[],
  sitios: SitioAdmin[],
  presupuesto: number
): LineaPromo[] | null {
  const porSitio = sitios.map((s) => catalogo.filter((i) => i.sitio === s));
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

function semillaUnAnuncio(catalogo: LineaPromo[], presupuesto: number): LineaPromo[] | null {
  const ok = catalogo
    .filter((i) => i.precio <= presupuesto)
    .sort((a, b) => presupuesto - a.precio - (presupuesto - b.precio));
  return ok[0] ? [ok[0]] : null;
}

function semillaPorSitio(
  catalogo: LineaPromo[],
  sitios: SitioAdmin[],
  presupuesto: number,
  modo: "min" | "max"
): LineaPromo[] | null {
  const cupo = Math.floor(presupuesto / sitios.length);
  const lineas: LineaPromo[] = [];
  for (const sitio of sitios) {
    const delSitio = catalogo
      .filter((i) => i.sitio === sitio && i.precio <= cupo)
      .sort((a, b) => (modo === "min" ? a.precio - b.precio : b.precio - a.precio));
    if (!delSitio.length) return null;
    lineas.push(modo === "min" ? delSitio[0] : delSitio[delSitio.length - 1]);
  }
  return lineas;
}

function semillaGreedy(
  catalogo: LineaPromo[],
  sitios: SitioAdmin[],
  presupuesto: number
): LineaPromo[] | null {
  const ordenados = [...catalogo].sort((a, b) => b.precio - a.precio);
  const lineas: LineaPromo[] = [];
  const usados = new Set<string>();

  for (const sitio of sitios) {
    const pick = ordenados.find((i) => i.sitio === sitio && !usados.has(i.id) && i.precio <= presupuesto);
    if (!pick) return null;
    lineas.push(pick);
    usados.add(pick.id);
  }

  let resto = presupuesto - totalLineas(lineas);
  for (const item of ordenados) {
    if (usados.has(item.id)) continue;
    if (item.precio <= resto) {
      lineas.push(item);
      usados.add(item.id);
      resto -= item.precio;
    }
  }

  return lineas;
}

function nombrePromo(lineas: LineaPromo[], sitios: SitioAdmin[]): string {
  const n = lineas.length;
  const sitiosUsados = new Set(lineas.map((l) => l.sitio)).size;
  if (n === 1) return "Un destacado ajustado al tope";
  if (sitiosUsados === sitios.length && n === sitios.length) return "Un aviso por página, al máximo";
  if (n > sitios.length) return `Paquete ampliado (${n} anuncios)`;
  return `Combinación optimizada (${n} anuncios)`;
}

function procesarSemilla(
  semilla: LineaPromo[] | null,
  catalogo: LineaPromo[],
  presupuesto: number,
  sitios: SitioAdmin[]
): PromocionSugerida | null {
  if (!semilla) return null;
  const optimizado = optimizarAlPresupuesto(semilla, catalogo, presupuesto, sitios);
  if (!optimizado) return null;
  return empaquetar(
    nombrePromo(optimizado, sitios),
    "Combinación calculada con precios de venta web.",
    optimizado,
    presupuesto
  );
}

export function generarPromociones(
  costos: AnuncioCosto[],
  filtros: FiltrosPromo
): PromocionSugerida[] {
  const catalogo = filtrarCatalogo(
    construirCatalogo(costos),
    filtros.sitiosElegidos,
    filtros.dias
  );

  if (!catalogo.length || filtros.presupuesto <= 0) return [];

  const { presupuesto, sitiosElegidos: sitios } = filtros;

  const semillas: (LineaPromo[] | null)[] = [
    mejorUnoPorSitio(catalogo, sitios, presupuesto),
    semillaUnAnuncio(catalogo, presupuesto),
    semillaPorSitio(catalogo, sitios, presupuesto, "max"),
    semillaPorSitio(catalogo, sitios, presupuesto, "min"),
    semillaGreedy(catalogo, sitios, presupuesto),
  ];

  const candidatas: PromocionSugerida[] = [];
  const vistas = new Set<string>();

  for (const semilla of semillas) {
    const promo = procesarSemilla(semilla, catalogo, presupuesto, sitios);
    if (!promo || vistas.has(promo.id)) continue;
    vistas.add(promo.id);
    candidatas.push(promo);
  }

  candidatas.sort((a, b) => {
    const dentroA = a.sobrante <= SOBRANTE_OBJETIVO;
    const dentroB = b.sobrante <= SOBRANTE_OBJETIVO;
    if (dentroA !== dentroB) return dentroA ? -1 : 1;
    if (a.sobrante !== b.sobrante) return a.sobrante - b.sobrante;
    return b.total - a.total;
  });

  return candidatas.slice(0, 5);
}

export function resumenLineaPromo(l: LineaPromo): string {
  return descripcionLinea(l);
}
