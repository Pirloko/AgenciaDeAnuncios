import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PromosSkokkaPanel from "@/components/admin/PromosSkokkaPanel";
import { cargarCostosAdmin } from "@/lib/admin-data";
import { createClient } from "@/lib/supabase/server";
import {
  ADMIN_CONFIG_KEY_PROMOS_SKOKKA,
  normalizarSkokkaPromosConfig,
  seedSkokkaPromosConfig,
} from "@/lib/promos-pagina-skokka";

export const metadata: Metadata = {
  title: "Promociones Skokka",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPromosSkokkaPage() {
  try {
    const [{ costos }, supabase] = await Promise.all([cargarCostosAdmin(), createClient()]);

    const { data } = await supabase
      .from("admin_config")
      .select("value")
      .eq("key", ADMIN_CONFIG_KEY_PROMOS_SKOKKA)
      .maybeSingle();

    const config = data?.value
      ? normalizarSkokkaPromosConfig(data.value)
      : seedSkokkaPromosConfig();

    return (
      <PromosSkokkaPanel
        costos={costos.filter((c) => c.sitio === "skokka")}
        configInicial={config}
      />
    );
  } catch {
    redirect("/admin/login?error=config");
  }
}
