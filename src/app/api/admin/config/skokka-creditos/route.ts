import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calcularCostoAgenciaSkokka, type SkokkaCreditosConfig } from "@/lib/admin-costos";

export async function PATCH(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let body: { valor_credito_clp?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const valor = body.valor_credito_clp;
  if (typeof valor !== "number" || valor <= 0) {
    return NextResponse.json({ error: "Valor del crédito inválido" }, { status: 400 });
  }

  const { data: actual, error: readErr } = await supabase
    .from("admin_config")
    .select("value")
    .eq("key", "skokka_creditos")
    .maybeSingle();

  if (readErr) {
    return NextResponse.json({ error: readErr.message }, { status: 500 });
  }

  const prev = (actual?.value ?? null) as SkokkaCreditosConfig | null;
  const cantidad = prev?.cantidad_creditos ?? 4970;
  const costoTotal = Math.round(valor * cantidad);

  const nuevoConfig: SkokkaCreditosConfig = {
    costo_total_clp: costoTotal,
    cantidad_creditos: cantidad,
    valor_credito_clp: valor,
  };

  const { data: guardado, error: saveErr } = await supabase
    .from("admin_config")
    .update({ value: nuevoConfig })
    .eq("key", "skokka_creditos")
    .select("value")
    .maybeSingle();

  if (saveErr) {
    return NextResponse.json({ error: saveErr.message }, { status: 500 });
  }

  if (!guardado) {
    return NextResponse.json(
      { error: "Config skokka_creditos no encontrada. Ejecuta supabase/01-admin-schema.sql en Supabase." },
      { status: 404 }
    );
  }

  const { data: filas, error: filasErr } = await supabase
    .from("anuncio_costos")
    .select("id, creditos")
    .eq("sitio", "skokka")
    .not("creditos", "is", null);

  if (filasErr) {
    return NextResponse.json({ error: filasErr.message }, { status: 500 });
  }

  for (const fila of filas ?? []) {
    if (fila.creditos == null) continue;
    const costo = calcularCostoAgenciaSkokka(Number(fila.creditos), valor);
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
