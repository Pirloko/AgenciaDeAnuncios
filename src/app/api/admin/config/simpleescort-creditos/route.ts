import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  calcularCostoAgenciaPorCreditos,
  type SimpleEscortCreditosConfig,
} from "@/lib/admin-costos";

const CONFIG_KEY = "simpleescort_creditos";

/** Defaults si aún no hay config en BD (el admin puede cambiarlos). */
const DEFAULTS: SimpleEscortCreditosConfig = {
  costo_total_clp: 100000,
  cantidad_creditos: 1000,
  valor_credito_clp: 100,
};

export async function PATCH(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let body: { costo_total_clp?: number; cantidad_creditos?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const { data: actual, error: readErr } = await supabase
    .from("admin_config")
    .select("value")
    .eq("key", CONFIG_KEY)
    .maybeSingle();

  if (readErr) {
    return NextResponse.json({ error: readErr.message }, { status: 500 });
  }

  const prev = (actual?.value ?? null) as SimpleEscortCreditosConfig | null;

  const cantidad =
    typeof body.cantidad_creditos === "number" && body.cantidad_creditos > 0
      ? Math.round(body.cantidad_creditos)
      : (prev?.cantidad_creditos ?? DEFAULTS.cantidad_creditos);

  const costoTotal =
    typeof body.costo_total_clp === "number" && body.costo_total_clp > 0
      ? Math.round(body.costo_total_clp)
      : (prev?.costo_total_clp ?? DEFAULTS.costo_total_clp);

  if (cantidad <= 0 || costoTotal <= 0) {
    return NextResponse.json({ error: "Paquete o créditos inválidos" }, { status: 400 });
  }

  const valor = Math.round((costoTotal / cantidad) * 1000) / 1000;

  const nuevoConfig: SimpleEscortCreditosConfig = {
    costo_total_clp: costoTotal,
    cantidad_creditos: cantidad,
    valor_credito_clp: valor,
  };

  let guardado;
  if (actual) {
    const { data, error } = await supabase
      .from("admin_config")
      .update({ value: nuevoConfig })
      .eq("key", CONFIG_KEY)
      .select("value")
      .maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    guardado = data;
  } else {
    const { data, error } = await supabase
      .from("admin_config")
      .insert({ key: CONFIG_KEY, value: nuevoConfig })
      .select("value")
      .maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    guardado = data;
  }

  if (!guardado) {
    return NextResponse.json({ error: "No se pudo guardar la config de SimpleEscort." }, { status: 500 });
  }

  const { data: filas, error: filasErr } = await supabase
    .from("anuncio_costos")
    .select("id, creditos")
    .eq("sitio", "simpleescort")
    .not("creditos", "is", null);

  if (filasErr) {
    return NextResponse.json({ error: filasErr.message }, { status: 500 });
  }

  for (const fila of filas ?? []) {
    if (fila.creditos == null) continue;
    const costo = calcularCostoAgenciaPorCreditos(Number(fila.creditos), valor);
    const { error: updErr } = await supabase
      .from("anuncio_costos")
      .update({ costo_agencia: costo })
      .eq("id", fila.id);
    if (updErr) {
      return NextResponse.json({ error: updErr.message }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true, config: nuevoConfig, actualizados: filas?.length ?? 0 });
}
