import {
  type AnuncioCosto,
  type LocantoDolarConfig,
  type SimpleEscortCreditosConfig,
  type SkokkaCreditosConfig,
  normalizarCosto,
} from "@/lib/admin-costos";
import {
  claveCosto,
  esGemidosCanonico,
  esWenasVipCanonico,
  filasSeedGemidos,
  filasSeedSitiosNuevos,
  filasSeedWenas,
} from "@/lib/admin-seed-sitios";
import { aplicarPreciosVentaWeb } from "@/lib/precio-venta-web";
import { obtenerSitio } from "@/lib/sitios";
import { createClient } from "@/lib/supabase/server";

const SIMPLEESCORT_CREDITOS_DEFAULT: SimpleEscortCreditosConfig = {
  costo_total_clp: 100000,
  cantidad_creditos: 1000,
  valor_credito_clp: 100,
};

const GEMIDOS_FILAS_ESPERADAS = filasSeedGemidos().length;

/** Wenas debe quedar en exactamente 3 filas VIP (7 / 15 / 30). */
async function sincronizarWenasVip(
  supabase: Awaited<ReturnType<typeof createClient>>,
  existentes: AnuncioCosto[]
): Promise<boolean> {
  const wenas = existentes.filter((c) => c.sitio === "wenas");
  const canon = wenas.filter(esWenasVipCanonico);
  const clavesCanon = new Set(canon.map((c) => claveCosto(c)));
  const faltan = filasSeedWenas().some((f) => !clavesCanon.has(claveCosto(f)));
  const sobran = wenas.length !== 3 || canon.length !== 3 || faltan;

  if (!sobran) return false;

  // Borrar TODAS las filas de Wenas
  const { error: delErr } = await supabase.from("anuncio_costos").delete().eq("sitio", "wenas");
  if (delErr) {
    console.error("No se pudo limpiar Wenas:", delErr.message);
    return false;
  }

  // Verificar que el DELETE realmente aplicó (sin política RLS puede "pasar" sin borrar)
  const { data: quedan, error: checkErr } = await supabase
    .from("anuncio_costos")
    .select("id")
    .eq("sitio", "wenas");
  if (checkErr || (quedan && quedan.length > 0)) {
    console.error(
      "Wenas sigue con filas tras DELETE. Ejecuta supabase/07-wenas-vip.sql en el SQL Editor."
    );
    return false;
  }

  const { error: insErr } = await supabase.from("anuncio_costos").insert(
    filasSeedWenas().map((f) => ({
      sitio: f.sitio,
      categoria: f.categoria,
      plan: f.plan,
      subidas: f.subidas,
      dias: f.dias,
      etiqueta: f.etiqueta,
      valor_plataforma: f.valor_plataforma,
      creditos: f.creditos,
      costo_agencia: f.costo_agencia,
      precio_venta: f.precio_venta,
      orden: f.orden,
      activo: true,
    }))
  );

  if (insErr) {
    console.error("No se pudieron insertar VIP de Wenas:", insErr.message);
    return false;
  }

  return true;
}

/**
 * Gemidos: exactamente las ofertas canónicas (sin duplicados).
 * Conserva costo_agencia / precio_venta ya editados cuando existían.
 */
async function sincronizarGemidos(
  supabase: Awaited<ReturnType<typeof createClient>>,
  existentes: AnuncioCosto[]
): Promise<boolean> {
  const gemidos = existentes.filter((c) => c.sitio === "gemidos");
  const seed = filasSeedGemidos();
  const porClave = new Map<string, AnuncioCosto[]>();
  for (const c of gemidos) {
    const k = claveCosto(c);
    const arr = porClave.get(k) ?? [];
    arr.push(c);
    porClave.set(k, arr);
  }

  const canon = gemidos.filter(esGemidosCanonico);
  const clavesCanonUnicas = new Set(canon.map((c) => claveCosto(c)));
  const hayDup = [...porClave.values()].some((arr) => arr.length > 1);
  const faltan = seed.some((f) => !clavesCanonUnicas.has(claveCosto(f)));
  const sobran =
    hayDup ||
    faltan ||
    gemidos.length !== GEMIDOS_FILAS_ESPERADAS ||
    clavesCanonUnicas.size !== GEMIDOS_FILAS_ESPERADAS ||
    gemidos.some((c) => !esGemidosCanonico(c));

  if (!sobran) return false;

  const { error: delErr } = await supabase.from("anuncio_costos").delete().eq("sitio", "gemidos");
  if (delErr) {
    console.error("No se pudo limpiar Gemidos:", delErr.message);
    return false;
  }

  const { data: quedan, error: checkErr } = await supabase
    .from("anuncio_costos")
    .select("id")
    .eq("sitio", "gemidos");
  if (checkErr || (quedan && quedan.length > 0)) {
    console.error(
      "Gemidos sigue con filas tras DELETE. Ejecuta supabase/11-gemidos-dedupe.sql en el SQL Editor."
    );
    return false;
  }

  const filas = seed.map((f) => {
    const prev = porClave.get(claveCosto(f))?.[0];
    return {
      sitio: f.sitio,
      categoria: f.categoria,
      plan: f.plan,
      subidas: f.subidas,
      dias: f.dias,
      etiqueta: f.etiqueta,
      valor_plataforma: f.valor_plataforma,
      creditos: f.creditos,
      costo_agencia: prev?.costo_agencia ?? f.costo_agencia,
      precio_venta: prev?.precio_venta ?? f.precio_venta,
      orden: f.orden,
      activo: true,
    };
  });

  const { error: insErr } = await supabase.from("anuncio_costos").insert(filas);
  if (insErr) {
    console.error("No se pudieron insertar planes de Gemidos:", insErr.message);
    return false;
  }

  return true;
}

/** Inserta SimpleEscort / Escorcitas / Wenas / Gemidos si aún no existen filas. */
async function asegurarCostosSitiosNuevos(
  supabase: Awaited<ReturnType<typeof createClient>>,
  existentes: AnuncioCosto[]
): Promise<boolean> {
  let cambio = await sincronizarWenasVip(supabase, existentes);
  cambio = (await sincronizarGemidos(supabase, existentes)) || cambio;

  const vigentes = existentes.filter(
    (c) =>
      (c.sitio !== "wenas" || esWenasVipCanonico(c)) &&
      (c.sitio !== "gemidos" || esGemidosCanonico(c))
  );
  const claves = new Set(
    (cambio
      ? vigentes.filter((c) => c.sitio !== "wenas" && c.sitio !== "gemidos")
      : vigentes
    ).map((c) => claveCosto(c))
  );
  if (cambio) {
    for (const f of filasSeedWenas()) claves.add(claveCosto(f));
    for (const f of filasSeedGemidos()) claves.add(claveCosto(f));
  }

  const faltantes = filasSeedSitiosNuevos().filter((f) => !claves.has(claveCosto(f)));
  if (!faltantes.length) return cambio;

  const { error } = await supabase.from("anuncio_costos").insert(
    faltantes.map((f) => ({
      sitio: f.sitio,
      categoria: f.categoria,
      plan: f.plan,
      subidas: f.subidas,
      dias: f.dias,
      etiqueta: f.etiqueta,
      valor_plataforma: f.valor_plataforma,
      creditos: f.creditos,
      costo_agencia: f.costo_agencia,
      precio_venta: f.precio_venta,
      orden: f.orden,
      activo: true,
    }))
  );

  if (error) {
    console.error("No se pudieron insertar costos de sitios nuevos:", error.message);
    return cambio;
  }

  return true;
}

/** Asegura config de créditos SimpleEscort en admin_config. */
async function asegurarConfigSimpleEscort(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data } = await supabase
    .from("admin_config")
    .select("value")
    .eq("key", "simpleescort_creditos")
    .maybeSingle();

  if (data?.value) return data.value as SimpleEscortCreditosConfig;

  const { data: inserted } = await supabase
    .from("admin_config")
    .insert({ key: "simpleescort_creditos", value: SIMPLEESCORT_CREDITOS_DEFAULT })
    .select("value")
    .maybeSingle();

  return (inserted?.value as SimpleEscortCreditosConfig | undefined) ?? SIMPLEESCORT_CREDITOS_DEFAULT;
}

export async function cargarCostosAdmin() {
  const supabase = await createClient();
  const { data: costos, error } = await supabase
    .from("anuncio_costos")
    .select("*")
    .order("orden", { ascending: true });

  if (error) throw error;

  let lista = (costos ?? []).map((c) => normalizarCosto(c as AnuncioCosto));

  const huboSeed = await asegurarCostosSitiosNuevos(supabase, lista);

  if (huboSeed) {
    const { data: costos2, error: err2 } = await supabase
      .from("anuncio_costos")
      .select("*")
      .order("orden", { ascending: true });
    if (!err2 && costos2) {
      lista = costos2.map((c) => normalizarCosto(c as AnuncioCosto));
    }
  }

  const [
    { data: skokkaConfig },
    { data: locantoConfig },
    simpleescortCreditos,
    skokka,
  ] = await Promise.all([
    supabase.from("admin_config").select("value").eq("key", "skokka_creditos").maybeSingle(),
    supabase.from("admin_config").select("value").eq("key", "locanto_dolar").maybeSingle(),
    asegurarConfigSimpleEscort(supabase),
    obtenerSitio("skokka"),
  ]);

  const costosWeb = aplicarPreciosVentaWeb(lista, { skokka }).filter(
    (c) =>
      (c.sitio !== "wenas" || esWenasVipCanonico(c)) &&
      (c.sitio !== "gemidos" || esGemidosCanonico(c))
  );

  return {
    costos: costosWeb,
    skokkaCreditos: (skokkaConfig?.value ?? null) as SkokkaCreditosConfig | null,
    simpleescortCreditos,
    locantoDolar: (locantoConfig?.value ?? null) as LocantoDolarConfig | null,
  };
}
