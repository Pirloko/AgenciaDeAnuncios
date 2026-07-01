import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let body: {
    costo_agencia?: number;
    precio_venta?: number | null;
    valor_plataforma?: number | null;
    creditos?: number | null;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const patch: Record<string, number | null> = {};
  if (body.costo_agencia !== undefined) {
    if (typeof body.costo_agencia !== "number" || body.costo_agencia < 0) {
      return NextResponse.json({ error: "Costo inválido" }, { status: 400 });
    }
    patch.costo_agencia = Math.round(body.costo_agencia);
  }
  if (body.precio_venta !== undefined) {
    if (body.precio_venta !== null && (typeof body.precio_venta !== "number" || body.precio_venta < 0)) {
      return NextResponse.json({ error: "Precio inválido" }, { status: 400 });
    }
    patch.precio_venta = body.precio_venta === null ? null : Math.round(body.precio_venta);
  }
  if (body.valor_plataforma !== undefined) {
    if (body.valor_plataforma !== null && (typeof body.valor_plataforma !== "number" || body.valor_plataforma < 0)) {
      return NextResponse.json({ error: "Valor plataforma inválido" }, { status: 400 });
    }
    patch.valor_plataforma = body.valor_plataforma === null ? null : Math.round(body.valor_plataforma);
  }
  if (body.creditos !== undefined) {
    if (body.creditos !== null && (typeof body.creditos !== "number" || body.creditos < 0)) {
      return NextResponse.json({ error: "Créditos inválidos" }, { status: 400 });
    }
    patch.creditos = body.creditos === null ? null : Math.round(body.creditos);
  }

  if (!Object.keys(patch).length) {
    return NextResponse.json({ error: "Sin cambios" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("anuncio_costos")
    .update(patch)
    .eq("id", id)
    .select("id, valor_plataforma, creditos, costo_agencia, precio_venta, ganancia, margen_pct")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, row: data });
}
