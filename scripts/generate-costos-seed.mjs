/**
 * Genera supabase/02-seed-anuncio-costos.sql desde el Excel.
 * Uso: node scripts/generate-costos-seed.mjs
 */
import { writeFileSync } from "fs";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const require = createRequire(import.meta.url);
const XLSX = require("xlsx");

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, "..");
const xlsxPath = join(root, "AGENCIA PUBLICACIONES VALORES.xlsx");

const wb = XLSX.readFile(xlsxPath);
const ws = wb.Sheets["NUEVO VALORES AGENCIAS"];
const grid = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

function cell(row, col) {
  const v = row[col];
  return v == null ? "" : String(v).trim();
}

function parseMoney(v) {
  if (v === "" || v == null) return null;
  if (typeof v === "number") return Number.isFinite(v) ? Math.round(v) : null;
  const t = String(v).replace(/\$/g, "").replace(/\s/g, "");
  if (t === "-" || t === "−") return null;
  const n = Number(t.replace(/\./g, "").replace(/,/g, ""));
  return Number.isFinite(n) ? Math.round(n) : null;
}

function parseIntVal(v) {
  if (v === "" || v == null) return null;
  const n = Number(String(v).replace(/\s/g, ""));
  return Number.isFinite(n) ? Math.round(n) : null;
}

function esc(s) {
  return s.replace(/'/g, "''");
}

const rows = [];
let sitio = null;
let categoria = null;
let orden = 0;

for (const row of grid) {
  const c0 = cell(row, 0);
  const c1 = cell(row, 1);

  if (c0.startsWith("PAGINA SKOKKA")) {
    sitio = "skokka";
    categoria = null;
    continue;
  }
  if (c0.startsWith("PAGINA CHIMBIS")) {
    sitio = "chimbis";
    categoria = "regiones";
    continue;
  }
  if (c0.startsWith("ANUNCIOS CHIMBIS SANTIAGO")) {
    sitio = "chimbis";
    categoria = "santiago";
    continue;
  }
  if (c0.startsWith("PAGINA LOCANTO")) {
    sitio = "locanto";
    categoria = "general";
    continue;
  }

  if (sitio === "skokka") {
    if (c1 === "ANUNCIOS SKOKKA") {
      categoria = "diurno";
      continue;
    }
    if (c1 === "ANUNCIOS MADRUGADA") {
      categoria = "madrugada";
      continue;
    }
    if (c1 === "ANUNCIOS ESPECIALES") {
      categoria = "especial";
      continue;
    }
    if (c1.match(/^\d+\s*DIA/i)) continue;
    if (!c0 || !categoria) continue;

    const m = c0.match(
      /^(TOP|SUPERTOP|TOP HIGHLIGHT|TOP NOVEDAD|FULL DESTACADO)\s+(\d+)\s+Subidas?\s+x\s+(\d+)\s+Dia/i
    );
    if (!m) continue;

    const costo = parseMoney(row[5]);
    let venta = parseMoney(row[6]);
    if (venta === 0) venta = null;
    if (costo === null && venta === null) continue;

    orden++;
    rows.push({
      sitio,
      categoria,
      plan: m[1].toUpperCase(),
      subidas: Number(m[2]),
      dias: Number(m[3]),
      etiqueta: c0,
      valor_plataforma: parseMoney(row[2]),
      creditos: parseIntVal(row[3]),
      costo_agencia: costo ?? 0,
      precio_venta: venta,
      orden,
    });
    continue;
  }

  if (sitio === "chimbis" && categoria) {
    if (c1.match(/^\d+\s*DIA/i)) continue;
    if (!c0) continue;

    const m = c0.match(
      /^(TOP|TOP DEST\.|TOP HIST\.|FULL DESTACADO)\s+(\d+)\s+SUBIDAS?\s+X\s+(\d+)\s+DIA/i
    );
    if (!m) continue;

    const planMap = {
      TOP: "TOP",
      "TOP DEST.": "TOP_DESTACADO",
      "TOP HIST.": "TOP_HISTORIAS",
      "FULL DESTACADO": "TOP_DESTACADO_HISTORIA",
    };

    const costo = parseMoney(row[4]);
    let venta = parseMoney(row[5]);
    if (venta === 0) venta = null;
    if (costo === null && venta === null) continue;

    orden++;
    rows.push({
      sitio: "chimbis",
      categoria,
      plan: planMap[m[1].toUpperCase()] || m[1],
      subidas: Number(m[2]),
      dias: Number(m[3]),
      etiqueta: c0,
      valor_plataforma: parseMoney(row[2]),
      creditos: null,
      costo_agencia: costo ?? 0,
      precio_venta: venta,
      orden,
    });
    continue;
  }

  if (sitio === "locanto") {
    const planLine = c0 || c1;
    if (!planLine || planLine.includes("VALOR LOCANTO") || planLine.includes("Calculo")) continue;

    let plan = null;
    const p = planLine.trim().toUpperCase();
    if (p === "TOP") plan = "TOP";
    else if (p === "GALERIA") plan = "GALERIA";
    else if (p.includes("TOP") && p.includes("GALERIA")) plan = "TOP_GALERIA";
    if (!plan) continue;

    const costo = parseMoney(row[4]);
    let venta = parseMoney(row[5]);
    if (venta === 0) venta = null;
    if (costo === null && venta === null) continue;

    orden++;
    rows.push({
      sitio: "locanto",
      categoria: "general",
      plan,
      subidas: null,
      dias: 7,
      etiqueta: planLine.trim(),
      valor_plataforma: parseMoney(row[2]),
      creditos: null,
      costo_agencia: costo ?? 0,
      precio_venta: venta,
      orden,
    });
  }
}

const values = rows
  .map((r) => {
    const vp = r.valor_plataforma ?? "null";
    const cr = r.creditos ?? "null";
    const pv = r.precio_venta ?? "null";
    const sub = r.subidas ?? "null";
    return `  ('${r.sitio}', '${esc(r.categoria)}', '${esc(r.plan)}', ${sub}, ${r.dias}, '${esc(r.etiqueta)}', ${vp}, ${cr}, ${r.costo_agencia}, ${pv}, ${r.orden})`;
  })
  .join(",\n");

const sql = `-- Generado automáticamente desde NUEVO VALORES AGENCIAS (${rows.length} filas)
-- Ejecutar DESPUÉS de 01-admin-schema.sql

truncate table public.anuncio_costos;

insert into public.anuncio_costos (
  sitio, categoria, plan, subidas, dias, etiqueta,
  valor_plataforma, creditos, costo_agencia, precio_venta, orden
) values
${values};
`;

const out = join(root, "supabase", "02-seed-anuncio-costos.sql");
writeFileSync(out, sql);
console.log(`OK: ${rows.length} filas -> ${out}`);
