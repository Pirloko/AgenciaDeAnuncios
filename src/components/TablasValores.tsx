import type { Sitio } from "@/types/sitio";
import { clp } from "@/lib/precios";
import { FRANJAS_DIURNAS, franjaDiurnaPorEtiqueta } from "@/lib/horarios";
import ChimbisValoresRegiones from "@/components/ChimbisValoresRegiones";
import ValoresTabla from "@/components/ValoresTabla";
import { LOCANTO_DIAS, LOCANTO_PLAN_INFO, LOCANTO_PRECIOS, type LocantoPlan } from "@/lib/locanto";
import {
  ESCORCITAS_PLAN_INFO,
  ESCORCITAS_PRECIOS,
  type EscorcitasDias,
  type EscorcitasPlan,
} from "@/lib/escorcitas";
import {
  FRANJAS_SIMPLEESCORT,
  SIMPLEESCORT_DIAS,
  SIMPLEESCORT_HORARIOS_TOTAL,
  calcularTotalSimpleEscort,
} from "@/lib/simpleescort";
import {
  WENAS_DIAS_ORDER,
  WENAS_PLAN_INFO,
  WENAS_PRECIOS,
} from "@/lib/wenas";
import {
  GEMIDOS_DIAS_TABLA,
  GEMIDOS_PAUSA,
  GEMIDOS_PLAN_INFO,
  GEMIDOS_PLAN_ORDER,
  GEMIDOS_VACACIONES,
  GEMIDOS_VERIFICACION,
  precioGemidos,
} from "@/lib/gemidos";

const LOCANTO_ORDER: LocantoPlan[] = ["TOP", "GALERIA", "TOP_GALERIA"];
const ESCORCITAS_DIAS_ORDER: EscorcitasDias[] = [1, 3, 7];
const ESCORCITAS_PLAN_ORDER: EscorcitasPlan[] = ["TOP", "PREMIUM", "GOLD"];

interface GrupoValoresDias {
  dias: number;
  filas: { id: string; etiqueta: string; valores: string[] }[];
}

function agruparSkokkaPorDias(
  tabla: Record<string, Record<string, number>>,
  nivelIds: string[]
): GrupoValoresDias[] {
  const porDias = new Map<number, { subidas: number; key: string }[]>();

  for (const key of Object.keys(tabla)) {
    const [subidas, dias] = key.split("-").map(Number);
    if (!porDias.has(dias)) porDias.set(dias, []);
    porDias.get(dias)!.push({ subidas, key });
  }

  return [...porDias.entries()]
    .sort(([a], [b]) => a - b)
    .map(([dias, items]) => ({
      dias,
      filas: items
        .sort((a, b) => a.subidas - b.subidas)
        .map(({ subidas, key }) => ({
          id: key,
          etiqueta: `${subidas} subidas`,
          valores: nivelIds.map((id) => clp(tabla[key][id])),
        })),
    }));
}

function TablasSkokkaPorDias({
  grupos,
  columnas,
}: {
  grupos: GrupoValoresDias[];
  columnas: string[];
}) {
  return (
    <>
      {grupos.map(({ dias, filas }) => (
        <div key={dias} className="valores-sub">
          <h3 className="valores-h3">
            Publicación por {dias} día{dias > 1 ? "s" : ""}
          </h3>
          <ValoresTabla columnas={columnas} filas={filas} />
        </div>
      ))}
    </>
  );
}

export function TablaValoresSkokka({ sitio }: { sitio: Sitio }) {
  const niveles = sitio.niveles.map((n) => n.nombre);
  const nivelIds = sitio.niveles.map((n) => n.id);
  const columnas = ["Subidas", ...niveles];

  const gruposDiurno = agruparSkokkaPorDias(sitio.diurno, nivelIds);
  const gruposMadrugada = agruparSkokkaPorDias(sitio.madrugada, nivelIds);

  return (
    <>
      <section className="valores-block valores-block--skokka">
        <h2 className="valores-h2">De día (06:00 a 00:00)</h2>
        <p className="valores-note">
          Elige <b>una o más franjas</b> de la lista. Cada franja tiene el precio de la tabla. Si
          marcas 2 franjas, pagas el doble; si marcas las 6, pagas ×6.
        </p>
        <div className="valores-franjas valores-franjas--skokka">
          <p className="valores-note">
            <b>Las 6 franjas que puedes elegir:</b>
          </p>
          <ol className="valores-franjas__lista">
            {(sitio.horarios.length ? sitio.horarios : FRANJAS_DIURNAS.map((f) => f.corto)).map(
              (etiqueta, i) => {
                const f = franjaDiurnaPorEtiqueta(etiqueta);
                return (
                  <li key={etiqueta}>
                    <span className="valores-franja__n">{i + 1}</span>
                    <span>
                      <b>{f.reloj}</b>
                      <span className="valores-franja__sub"> — {f.texto}</span>
                    </span>
                  </li>
                );
              }
            )}
          </ol>
        </div>
        <p className="valores-note valores-note--inline">
          Precio de la tabla = <b>por cada franja</b> que actives.
        </p>
        <TablasSkokkaPorDias grupos={gruposDiurno} columnas={columnas} />
        {sitio.diurno["3-1"]?.TOP != null && (
          <p className="valores-ejemplo">
            Ejemplo: TOP · 3 subidas · 1 día · marcas mañana (06–09) y mediodía (09–12) ={" "}
            <b>{clp(sitio.diurno["3-1"].TOP * 2)}</b>
          </p>
        )}
      </section>

      <section className="valores-block valores-block--skokka">
        <h2 className="valores-h2">Madrugada (00:00 a 06:00)</h2>
        <p className="valores-note">
          Un solo bloque nocturno con <b>6 subidas incluidas</b>. Pagas el valor de la tabla una sola
          vez — no se multiplica por franjas.
        </p>
        <TablasSkokkaPorDias grupos={gruposMadrugada} columnas={columnas} />
      </section>
    </>
  );
}

export function TablaValoresChimbis({ expandirTodo = false }: { expandirTodo?: boolean }) {
  return (
    <section className="valores-block valores-block--chimbis">
      <p className="valores-note valores-note--lead">
        Las <b>subidas</b> son cuántas veces tu aviso vuelve a los primeros lugares durante los días
        que contrates. El precio cambia según zona, días, subidas y plan.
      </p>
      <ChimbisValoresRegiones expandirTodo={expandirTodo} />
    </section>
  );
}

export function TablaValoresLocanto() {
  return (
    <section className="valores-block">
      <h2 className="valores-h2">Precios por 7 días</h2>
      <p className="valores-note">
        Tu aviso queda visible <b>24 horas al día</b> durante 7 días. Dentro de su categoría (TOP o
        Galería) rota con los demás: de vez en cuando uno sube arriba y van turnándose.
      </p>
      <ValoresTabla
        columnas={["Plan", "Duración", "Precio total"]}
        filas={LOCANTO_ORDER.map((plan) => ({
          id: plan,
          etiqueta: LOCANTO_PLAN_INFO[plan].nombre,
          valores: [`${LOCANTO_DIAS} días`, clp(LOCANTO_PRECIOS[plan])],
        }))}
      />
    </section>
  );
}

export function TablaValoresSimpleEscort() {
  return (
    <section className="valores-block valores-block--simpleescort">
      <h2 className="valores-h2">Super Turbo 5X</h2>
      <p className="valores-note valores-note--lead">
        Cada horario que marques incluye <b>5 subidas</b> en esa franja. Con las 4 franjas son{" "}
        <b>20 subidas al día</b> en total (precio full).
      </p>

      <div className="valores-panel valores-panel--horarios">
        <h3 className="valores-h3">Horarios disponibles</h3>
        <ul className="valores-horarios-lista">
          {FRANJAS_SIMPLEESCORT.map((f) => (
            <li key={f.id}>
              <span className="valores-horarios-lista__reloj">{f.reloj}</span>
              <span className="valores-horarios-lista__texto">{f.texto}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="valores-panel valores-panel--precios">
        <h3 className="valores-h3">Precios por días</h3>
        <p className="valores-note valores-note--compact">
          Elige cuántos días quieres publicar y cuántos horarios activar.
        </p>
        <ValoresTabla
          columnas={["Días", "4 horarios (full)", "Cada horario", "Si marcas 2 horarios"]}
          filas={SIMPLEESCORT_DIAS.map((dias) => ({
            id: String(dias),
            etiqueta: `${dias} día${dias > 1 ? "s" : ""}`,
            valores: [
              clp(calcularTotalSimpleEscort(dias, SIMPLEESCORT_HORARIOS_TOTAL)),
              clp(calcularTotalSimpleEscort(dias, 1)),
              clp(calcularTotalSimpleEscort(dias, 2)),
            ],
          }))}
        />
      </div>
    </section>
  );
}

export function TablaValoresEscorcitas() {
  return (
    <section className="valores-block">
      <h2 className="valores-h2">TOP, PREMIUM y GOLD</h2>
      <p className="valores-note">
        Mismo precio para escort mujer, trans o masculino. Cada plan rota dentro de su categoría:
        TOP abajo, PREMIUM más arriba y GOLD en la parte más visible.
      </p>
      <ValoresTabla
        columnas={[
          "Días",
          ...ESCORCITAS_PLAN_ORDER.map((p) => ESCORCITAS_PLAN_INFO[p].nombre),
        ]}
        filas={ESCORCITAS_DIAS_ORDER.map((dias) => ({
          id: String(dias),
          etiqueta: `${dias} día${dias > 1 ? "s" : ""}`,
          valores: ESCORCITAS_PLAN_ORDER.map((plan) => clp(ESCORCITAS_PRECIOS[dias][plan])),
        }))}
      />
      <div className="valores-planes-detalle">
        {ESCORCITAS_PLAN_ORDER.map((plan) => (
          <p key={plan} className="valores-note valores-note--inline">
            <b>{ESCORCITAS_PLAN_INFO[plan].nombre}:</b> {ESCORCITAS_PLAN_INFO[plan].detalle}
          </p>
        ))}
      </div>
    </section>
  );
}

export function TablaValoresWenas() {
  return (
    <section className="valores-block">
      <h2 className="valores-h2">Plan VIP</h2>
      <p className="valores-note">
        En Wenas solo hay plan VIP. Eliges la duración y tu aviso queda destacado en wenas.cl.
      </p>
      <ValoresTabla
        columnas={["Duración", WENAS_PLAN_INFO.VIP.nombre]}
        filas={WENAS_DIAS_ORDER.map((dias) => ({
          id: String(dias),
          etiqueta: `${dias} días`,
          valores: [clp(WENAS_PRECIOS[dias])],
        }))}
      />
      <p className="valores-note valores-note--inline">
        <b>{WENAS_PLAN_INFO.VIP.nombre}:</b> {WENAS_PLAN_INFO.VIP.detalle}
      </p>
    </section>
  );
}

export function TablaValoresGemidos() {
  return (
    <>
      <section className="valores-block">
        <h2 className="valores-h2">Planes y duraciones</h2>
        <p className="valores-note">
          Cada plan tiene duraciones distintas. Si una celda está vacía, esa combinación no se ofrece.
        </p>
        <ValoresTabla
          columnas={["Duración", ...GEMIDOS_PLAN_ORDER.map((p) => GEMIDOS_PLAN_INFO[p].nombre)]}
          filas={GEMIDOS_DIAS_TABLA.map((dias) => ({
            id: String(dias),
            etiqueta: `${dias} días`,
            valores: GEMIDOS_PLAN_ORDER.map((plan) => {
              const precio = precioGemidos(plan, dias);
              return precio != null ? clp(precio) : "—";
            }),
          }))}
        />
        {GEMIDOS_PLAN_ORDER.map((plan) => (
          <p key={plan} className="valores-note valores-note--inline">
            <b>{GEMIDOS_PLAN_INFO[plan].nombre}:</b> {GEMIDOS_PLAN_INFO[plan].beneficio}
          </p>
        ))}
      </section>

      <section className="valores-block">
        <h2 className="valores-h2">Verificación de perfil</h2>
        <p className="valores-note">
          Requisito único: se pide una sola vez. La verificación real es obligatoria; perfiles con
          datos falsos se eliminan sin reembolso.
        </p>
        <ul className="valores-list">
          {GEMIDOS_VERIFICACION.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="valores-block">
        <h2 className="valores-h2">Modo pausa</h2>
        <ul className="valores-list">
          {GEMIDOS_PAUSA.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="valores-block">
        <h2 className="valores-h2">Modo vacaciones</h2>
        <ul className="valores-list">
          {GEMIDOS_VACACIONES.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </>
  );
}

export function TablaValoresPorSitio({
  slug,
  sitio,
  expandirChimbis = false,
}: {
  slug: string;
  sitio: Sitio;
  expandirChimbis?: boolean;
}) {
  switch (slug) {
    case "skokka":
      return <TablaValoresSkokka sitio={sitio} />;
    case "chimbis":
      return <TablaValoresChimbis expandirTodo={expandirChimbis} />;
    case "locanto":
      return <TablaValoresLocanto />;
    case "simpleescort":
      return <TablaValoresSimpleEscort />;
    case "escorcitas":
      return <TablaValoresEscorcitas />;
    case "wenas":
      return <TablaValoresWenas />;
    case "gemidos":
      return <TablaValoresGemidos />;
    default:
      return null;
  }
}
