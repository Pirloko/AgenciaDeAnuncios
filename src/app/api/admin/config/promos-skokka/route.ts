import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { rutaValores } from "@/lib/valores-seo";
import {
  ADMIN_CONFIG_KEY_PROMOS_SKOKKA,
  normalizarSkokkaPromosConfig,
  seedSkokkaPromosConfig,
  type SkokkaPromosConfig,
} from "@/lib/promos-pagina-skokka";

function revalidarSkokkaPublico() {
  revalidatePath("/skokka");
  revalidatePath("/skokka-valores");
  revalidatePath(rutaValores("skokka"));
  revalidatePath("/promociones");
  revalidatePath("/");
}

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.app_metadata?.role !== "admin") {
    return { supabase, error: NextResponse.json({ error: "No autorizado" }, { status: 401 }) };
  }
  return { supabase, error: null };
}

export async function GET() {
  const { supabase, error } = await requireAdmin();
  if (error) return error;

  const { data, error: readErr } = await supabase
    .from("admin_config")
    .select("value")
    .eq("key", ADMIN_CONFIG_KEY_PROMOS_SKOKKA)
    .maybeSingle();

  if (readErr) {
    return NextResponse.json({ error: readErr.message }, { status: 500 });
  }

  if (!data?.value) {
    const seed = seedSkokkaPromosConfig();
    const { error: insErr } = await supabase.from("admin_config").insert({
      key: ADMIN_CONFIG_KEY_PROMOS_SKOKKA,
      value: seed,
    });
    if (insErr && !insErr.message.toLowerCase().includes("duplicate")) {
      // Si falla el insert, igual devolvemos seed en memoria
      console.error("promos_skokka seed:", insErr.message);
    }
    return NextResponse.json({ config: seed });
  }

  return NextResponse.json({ config: normalizarSkokkaPromosConfig(data.value) });
}

export async function PATCH(request: Request) {
  const { supabase, error } = await requireAdmin();
  if (error) return error;

  let body: { config?: SkokkaPromosConfig };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (!body.config || body.config.version !== 1 || typeof body.config.ventas !== "object") {
    return NextResponse.json({ error: "Config inválida" }, { status: 400 });
  }

  const config = normalizarSkokkaPromosConfig(body.config);

  const { data: existing } = await supabase
    .from("admin_config")
    .select("key")
    .eq("key", ADMIN_CONFIG_KEY_PROMOS_SKOKKA)
    .maybeSingle();

  if (!existing) {
    const { data, error: insErr } = await supabase
      .from("admin_config")
      .insert({ key: ADMIN_CONFIG_KEY_PROMOS_SKOKKA, value: config })
      .select("value")
      .maybeSingle();
    if (insErr) {
      return NextResponse.json({ error: insErr.message }, { status: 500 });
    }
    revalidarSkokkaPublico();
    return NextResponse.json({ ok: true, config: normalizarSkokkaPromosConfig(data?.value) });
  }

  const { data, error: saveErr } = await supabase
    .from("admin_config")
    .update({ value: config })
    .eq("key", ADMIN_CONFIG_KEY_PROMOS_SKOKKA)
    .select("value")
    .maybeSingle();

  if (saveErr) {
    return NextResponse.json({ error: saveErr.message }, { status: 500 });
  }

  revalidarSkokkaPublico();
  return NextResponse.json({ ok: true, config: normalizarSkokkaPromosConfig(data?.value) });
}
