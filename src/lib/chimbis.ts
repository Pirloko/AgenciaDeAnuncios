import { clp } from "@/lib/precios";

export type ChimbisRegion = "santiago" | "ciudades";
export type ChimbisPlan =
  | "TOP"
  | "TOP_DESTACADO"
  | "TOP_HISTORIAS"
  | "TOP_DESTACADO_HISTORIA";

type PlanesPorSubidas = Partial<Record<ChimbisPlan, number>>;
type SubidasPorDias = Record<number, PlanesPorSubidas>;
type DiasPorRegion = Record<number, SubidasPorDias>;

export const CHIMBIS_PRECIOS: Record<ChimbisRegion, DiasPorRegion> = {
  ciudades: {
    1: {
      6: {
        TOP: 5500,
        TOP_DESTACADO: 7500,
        TOP_HISTORIAS: 9000,
        TOP_DESTACADO_HISTORIA: 11000,
      },
      12: {
        TOP: 7000,
        TOP_DESTACADO: 9500,
        TOP_HISTORIAS: 11500,
        TOP_DESTACADO_HISTORIA: 13500,
      },
    },
    3: {
      3: { TOP: 5000, TOP_DESTACADO: 6500 },
      6: {
        TOP: 7500,
        TOP_DESTACADO: 9500,
        TOP_HISTORIAS: 12000,
        TOP_DESTACADO_HISTORIA: 14000,
      },
      12: {
        TOP: 11000,
        TOP_DESTACADO: 15000,
        TOP_HISTORIAS: 17000,
        TOP_DESTACADO_HISTORIA: 22000,
      },
    },
    7: {
      3: { TOP: 7000, TOP_DESTACADO: 9500 },
      6: {
        TOP: 11000,
        TOP_DESTACADO: 15500,
        TOP_HISTORIAS: 17000,
        TOP_DESTACADO_HISTORIA: 22500,
      },
      12: {
        TOP: 16000,
        TOP_DESTACADO: 22000,
        TOP_HISTORIAS: 24000,
        TOP_DESTACADO_HISTORIA: 30000,
      },
    },
    15: {
      3: { TOP: 10500, TOP_DESTACADO: 15000 },
      6: {
        TOP: 16000,
        TOP_DESTACADO: 23500,
        TOP_HISTORIAS: 24500,
        TOP_DESTACADO_HISTORIA: 29500,
      },
      12: {
        TOP: 22000,
        TOP_DESTACADO: 32000,
        TOP_HISTORIAS: 33500,
        TOP_DESTACADO_HISTORIA: 42500,
      },
    },
  },
  santiago: {
    3: {
      6: {
        TOP: 7500,
        TOP_DESTACADO: 9500,
        TOP_HISTORIAS: 12000,
        TOP_DESTACADO_HISTORIA: 14000,
      },
      12: {
        TOP: 11000,
        TOP_DESTACADO: 15000,
        TOP_HISTORIAS: 17000,
        TOP_DESTACADO_HISTORIA: 22000,
      },
      24: {
        TOP: 15500,
        TOP_DESTACADO: 22500,
        TOP_HISTORIAS: 24500,
        TOP_DESTACADO_HISTORIA: 31500,
      },
      48: {
        TOP: 22500,
        TOP_DESTACADO: 34000,
        TOP_HISTORIAS: 36000,
        TOP_DESTACADO_HISTORIA: 47000,
      },
    },
    7: {
      6: {
        TOP: 11000,
        TOP_DESTACADO: 15500,
        TOP_HISTORIAS: 17000,
        TOP_DESTACADO_HISTORIA: 22500,
      },
      12: {
        TOP: 16000,
        TOP_DESTACADO: 22000,
        TOP_HISTORIAS: 24000,
        TOP_DESTACADO_HISTORIA: 30000,
      },
      24: {
        TOP: 22000,
        TOP_DESTACADO: 32000,
        TOP_HISTORIAS: 33500,
        TOP_DESTACADO_HISTORIA: 43500,
      },
      48: {
        TOP: 38000,
        TOP_DESTACADO: 56000,
        TOP_HISTORIAS: 57500,
        TOP_DESTACADO_HISTORIA: 75500,
      },
    },
    15: {
      6: {
        TOP: 16000,
        TOP_DESTACADO: 23500,
        TOP_HISTORIAS: 24500,
        TOP_DESTACADO_HISTORIA: 29500,
      },
      12: {
        TOP: 22000,
        TOP_DESTACADO: 32000,
        TOP_HISTORIAS: 33500,
        TOP_DESTACADO_HISTORIA: 42500,
      },
      24: {
        TOP: 35000,
        TOP_DESTACADO: 52000,
        TOP_HISTORIAS: 53000,
        TOP_DESTACADO_HISTORIA: 70000,
      },
      48: {
        TOP: 56000,
        TOP_DESTACADO: 85000,
        TOP_HISTORIAS: 87000,
        TOP_DESTACADO_HISTORIA: 115000,
      },
    },
  },
};

export const CHIMBIS_REGION_LABEL: Record<ChimbisRegion, string> = {
  santiago: "Santiago / Región Metropolitana",
  ciudades: "Otra ciudad del norte o sur de Chile",
};

export const CHIMBIS_PLAN_INFO: Record<
  ChimbisPlan,
  { nombre: string; beneficio: string; destacado?: boolean; historias?: boolean }
> = {
  TOP: {
    nombre: "TOP",
    beneficio: "Tu aviso alcanza los primeros lugares del listado.",
  },
  TOP_DESTACADO: {
    nombre: "TOP + Destacado",
    beneficio: "Primeros lugares con etiqueta y mayor visibilidad destacada.",
    destacado: true,
  },
  TOP_HISTORIAS: {
    nombre: "TOP + Historias",
    beneficio: "Primeros lugares más publicación en historias.",
    historias: true,
  },
  TOP_DESTACADO_HISTORIA: {
    nombre: "TOP + Destacado + Historia",
    beneficio: "Lo máximo: TOP, destacado e historias combinados.",
    destacado: true,
    historias: true,
  },
};

const PLAN_ORDER: ChimbisPlan[] = [
  "TOP",
  "TOP_DESTACADO",
  "TOP_HISTORIAS",
  "TOP_DESTACADO_HISTORIA",
];

export function diasChimbis(region: ChimbisRegion): number[] {
  return Object.keys(CHIMBIS_PRECIOS[region])
    .map(Number)
    .sort((a, b) => a - b);
}

export function subidasChimbis(region: ChimbisRegion, dias: number): number[] {
  const tabla = CHIMBIS_PRECIOS[region][dias];
  if (!tabla) return [];
  return Object.keys(tabla)
    .map(Number)
    .sort((a, b) => a - b);
}

export function planesChimbis(
  region: ChimbisRegion,
  dias: number,
  subidas: number
): { plan: ChimbisPlan; precio: number }[] {
  const fila = CHIMBIS_PRECIOS[region][dias]?.[subidas];
  if (!fila) return [];
  return PLAN_ORDER.filter((p) => fila[p] != null).map((plan) => ({
    plan,
    precio: fila[plan]!,
  }));
}

export function precioChimbis(
  region: ChimbisRegion,
  dias: number,
  subidas: number,
  plan: ChimbisPlan
): number | null {
  return CHIMBIS_PRECIOS[region][dias]?.[subidas]?.[plan] ?? null;
}

export function nombrePlanChimbis(plan: ChimbisPlan, subidas: number): string {
  if (plan === "TOP") return `TOP ${subidas} subidas`;
  return CHIMBIS_PLAN_INFO[plan].nombre;
}

export function iterarOfertasChimbis() {
  const out: {
    region: ChimbisRegion;
    dias: number;
    subidas: number;
    plan: ChimbisPlan;
    precio: number;
  }[] = [];

  for (const region of Object.keys(CHIMBIS_PRECIOS) as ChimbisRegion[]) {
    for (const dias of diasChimbis(region)) {
      for (const subidas of subidasChimbis(region, dias)) {
        for (const { plan, precio } of planesChimbis(region, dias, subidas)) {
          out.push({ region, dias, subidas, plan, precio });
        }
      }
    }
  }
  return out;
}

export { clp };
