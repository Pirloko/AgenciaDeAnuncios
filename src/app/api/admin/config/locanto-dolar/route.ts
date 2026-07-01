import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let body: { valor_dolar_clp?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const valor = body.valor_dolar_clp;
  if (typeof valor !== "number" || valor <= 0) {
    return NextResponse.json({ error: "Valor del dólar inválido" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("admin_config")
    .update({
      value: { valor_dolar_clp: Math.round(valor) },
    })
    .eq("key", "locanto_dolar")
    .select("value")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json(
      { error: "Config locanto_dolar no encontrada. Ejecuta supabase/05-locanto-dolar.sql en Supabase." },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, config: data.value });
}
