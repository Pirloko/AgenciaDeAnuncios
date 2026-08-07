import { GEMIDOS_OFERTAS } from "@/lib/gemidos";

export interface AnuncioCosto {
  id: string;
  sitio: "skokka" | "chimbis" | "locanto" | "simpleescort" | "escorcitas" | "wenas" | "gemidos";
  categoria: string;
  plan: string;
  subidas: number | null;
  dias: number;
  etiqueta: string;
  valor_plataforma: number | null;
  creditos: number | null;
  costo_agencia: number;
  precio_venta: number | null;
  ganancia: number | null;
  margen_pct: number | null;
  orden: number;
  activo: boolean;
  updated_at: string;
}

export interface SkokkaCreditosConfig {
  costo_total_clp: number;
  cantidad_creditos: number;
  valor_credito_clp: number;
}

/** Misma forma que Skokka; el admin configura valores distintos. */
export type SimpleEscortCreditosConfig = SkokkaCreditosConfig;

export interface LocantoDolarConfig {
  valor_dolar_clp: number;
}

/** Costo agencia Locanto = valor plataforma (USD) × tipo de cambio. */
export function calcularCostoAgenciaLocanto(usd: number, valorDolarClp: number): number {
  return Math.round(usd * valorDolarClp);
}

/** Costo agencia = créditos × valor del crédito (Skokka / SimpleEscort). */
export function calcularCostoAgenciaSkokka(creditos: number, valorCreditoClp: number): number {
  return Math.round(creditos * valorCreditoClp);
}

/** Créditos a partir del costo agencia y el valor del crédito. */
export function calcularCreditosSkokka(costoAgencia: number, valorCreditoClp: number): number {
  if (valorCreditoClp <= 0) return 0;
  return Math.round(costoAgencia / valorCreditoClp);
}

export const calcularCostoAgenciaPorCreditos = calcularCostoAgenciaSkokka;
export const calcularCreditosPorCosto = calcularCreditosSkokka;

export function parseDecimalInput(val: string): number | null {
  const limpio = val.trim();
  if (!limpio) return null;
  const n = Number(limpio.replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export function clpAdminDecimal(n: number | string | null | undefined, decimales = 2): string {
  if (n == null || n === "") return "—";
  const num = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(num)) return "—";
  return (
    "$" +
    new Intl.NumberFormat("es-CL", {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimales,
    }).format(num)
  );
}

export const SITIO_ADMIN_LABEL: Record<string, string> = {
  skokka: "Skokka",
  chimbis: "Chimbis",
  locanto: "Locanto",
  simpleescort: "simpleescort.cl",
  escorcitas: "escorcitas.cl",
  wenas: "wenas.cl",
  gemidos: "gemidos.tv",
};

export const CATEGORIA_LABEL: Record<string, string> = {
  diurno: "Día",
  madrugada: "Madrugada",
  especial: "Especiales",
  regiones: "Regiones",
  santiago: "Santiago",
  general: "General",
};

export const PLAN_LABEL: Record<string, string> = {
  TOP: "TOP",
  SUPERTOP: "Súper Top",
  "TOP HIGHLIGHT": "Top Highlight",
  "TOP NOVEDAD": "Top Novedad",
  "FULL DESTACADO": "Top All in One",
  TOP_DESTACADO: "Top Destacado",
  TOP_HISTORIAS: "Top Historias",
  TOP_DESTACADO_HISTORIA: "Full Destacado",
  GALERIA: "Galería",
  TOP_GALERIA: "TOP + Galería",
  DESTACADO: "Destacado",
  PREMIUM: "PREMIUM",
  GOLD: "GOLD",
  VIP: "VIP",
  CLASSIC: "Classic",
  PLATINUM: "Platinum",
  DIAMOND: "Diamond",
  DIAMOND_VIP: "Diamond VIP",
  BLACK_ROSE: "Black Rose",
  SUPER_TURBO_FULL: "Super Turbo 5X · 4 horarios",
  SUPER_TURBO_1H: "Super Turbo 5X · 1 horario",
  SUPER_TURBO_2H: "Super Turbo 5X · 2 horarios",
  SUPER_TURBO_3H: "Super Turbo 5X · 3 horarios",
};

export const SITIOS_ADMIN = [
  "skokka",
  "chimbis",
  "locanto",
  "simpleescort",
  "escorcitas",
  "wenas",
  "gemidos",
] as const;
export type SitioAdmin = (typeof SITIOS_ADMIN)[number];

/** Planes Skokka que usa el cotizador web (TOP, Súper Top, Top All in One). */
export const SKOKKA_PLANES_WEB = ["TOP", "SUPERTOP", "FULL DESTACADO"] as const;

/** Zonas que no usa el cotizador Skokka (solo día y madrugada). */
export const SKOKKA_CATEGORIAS_EXCLUIDAS = ["especial"] as const;

/** Subidas que no ofrece el cotizador Skokka (solo 3 y 6 en diurno; 6 en madrugada). */
export const SKOKKA_SUBIDAS_EXCLUIDAS = [10] as const;

export function esPlanSkokkaWeb(plan: string): boolean {
  return (SKOKKA_PLANES_WEB as readonly string[]).includes(plan);
}

export function filtrarCostosSitio(items: AnuncioCosto[], sitio: SitioAdmin): AnuncioCosto[] {
  if (sitio === "wenas") {
    return items.filter(
      (i) => i.plan === "VIP" && (i.dias === 7 || i.dias === 15 || i.dias === 30)
    );
  }
  if (sitio === "gemidos") {
    const claves = new Set(GEMIDOS_OFERTAS.map((o) => `${o.plan}|${o.dias}`));
    const vistos = new Set<string>();
    return items.filter((i) => {
      const k = `${i.plan}|${i.dias}`;
      if (!claves.has(k) || vistos.has(k)) return false;
      vistos.add(k);
      return true;
    });
  }
  if (sitio !== "skokka") return items;
  return items.filter(
    (i) =>
      esPlanSkokkaWeb(i.plan) &&
      !(SKOKKA_CATEGORIAS_EXCLUIDAS as readonly string[]).includes(i.categoria) &&
      (i.subidas == null ||
        !(SKOKKA_SUBIDAS_EXCLUIDAS as readonly number[]).includes(i.subidas))
  );
}

export type CampoCostoEditable =
  | "costo_agencia"
  | "precio_venta"
  | "valor_plataforma"
  | "creditos";

const ORDEN_CATEGORIAS = ["diurno", "madrugada", "especial", "regiones", "santiago", "general"];

function sinAcentos(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
}

export function clpAdmin(n: number | string | null | undefined): string {
  if (n == null || n === "") return "—";
  const num = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(num)) return "—";
  return "$" + new Intl.NumberFormat("es-CL").format(Math.round(num));
}

export function pctAdmin(n: number | string | null | undefined): string {
  if (n == null || n === "") return "—";
  const num = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(num)) return "—";
  return `${num.toFixed(1)}%`;
}

/** Supabase puede devolver numeric como string — normaliza filas del panel. */
export function normalizarCosto(row: AnuncioCosto): AnuncioCosto {
  const num = (v: unknown) => {
    if (v == null || v === "") return null;
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) ? n : null;
  };
  return {
    ...row,
    subidas: num(row.subidas),
    dias: num(row.dias) ?? row.dias,
    valor_plataforma: num(row.valor_plataforma),
    creditos: num(row.creditos),
    costo_agencia: num(row.costo_agencia) ?? 0,
    precio_venta: num(row.precio_venta),
    ganancia: num(row.ganancia),
    margen_pct: num(row.margen_pct),
    orden: num(row.orden) ?? row.orden,
  };
}

export function ordenarCategorias(categorias: string[]): string[] {
  return [...categorias].sort((a, b) => {
    const ia = ORDEN_CATEGORIAS.indexOf(a);
    const ib = ORDEN_CATEGORIAS.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
}

export function filtrarCostos(
  items: AnuncioCosto[],
  opts: {
    q: string;
    categoria: string;
    dias: string;
    subidas: string;
  }
): AnuncioCosto[] {
  const q = sinAcentos(opts.q.trim());
  return items.filter((item) => {
    if (opts.categoria !== "all" && item.categoria !== opts.categoria) return false;
    if (opts.dias !== "all" && String(item.dias) !== opts.dias) return false;
    if (opts.subidas !== "all") {
      if (item.subidas == null || String(item.subidas) !== opts.subidas) return false;
    }
    if (!q) return true;
    const plan = PLAN_LABEL[item.plan] ?? item.plan;
    const subidasTxt = item.subidas != null ? `${item.subidas} subidas` : "";
    const hay = sinAcentos(
      [item.etiqueta, item.plan, plan, subidasTxt, item.categoria, CATEGORIA_LABEL[item.categoria]]
        .filter(Boolean)
        .join(" ")
    );
    return hay.includes(q);
  });
}

export function categoriasDeItems(items: AnuncioCosto[]): string[] {
  return ordenarCategorias([...new Set(items.map((i) => i.categoria))]);
}

export function diasDeItems(items: AnuncioCosto[]): number[] {
  return [...new Set(items.map((i) => i.dias))].sort((a, b) => a - b);
}

export function subidasDeItems(items: AnuncioCosto[]): number[] {
  return [...new Set(items.map((i) => i.subidas).filter((n): n is number => n != null))].sort(
    (a, b) => a - b
  );
}

/** Para Chimbis: opciones de subidas según zona (y días) ya elegidos. */
export function subidasOptsParaSitio(
  items: AnuncioCosto[],
  sitio: SitioAdmin,
  opts: { categoria: string; dias: string }
): number[] {
  if (sitio !== "chimbis" || opts.categoria === "all") {
    return subidasDeItems(items);
  }
  let filtrados = items.filter((i) => i.categoria === opts.categoria);
  if (opts.dias !== "all") {
    filtrados = filtrados.filter((i) => String(i.dias) === opts.dias);
  }
  return subidasDeItems(filtrados);
}

export function sitioTieneFiltroSubidas(sitio: SitioAdmin): boolean {
  return sitio === "skokka" || sitio === "chimbis";
}

export function resumenMargen(items: AnuncioCosto[]) {
  const conVenta = items.filter((i) => i.precio_venta != null && i.precio_venta > 0);
  const gananciaTotal = conVenta.reduce((s, i) => s + (Number(i.ganancia) || 0), 0);
  const ventaTotal = conVenta.reduce((s, i) => s + (Number(i.precio_venta) || 0), 0);
  const costoTotal = conVenta.reduce((s, i) => s + (Number(i.costo_agencia) || 0), 0);
  const margenProm =
    ventaTotal > 0 ? Math.round(((gananciaTotal / ventaTotal) * 100) * 10) / 10 : null;
  return { conVenta: conVenta.length, gananciaTotal, ventaTotal, costoTotal, margenProm };
}

export function calcularGananciaLocal(costo: number, venta: number | null): number | null {
  if (venta == null || venta <= 0) return null;
  return venta - costo;
}

export function calcularMargenLocal(costo: number, venta: number | null): number | null {
  if (venta == null || venta <= 0) return null;
  return Math.round(((venta - costo) / venta) * 1000) / 10;
}
