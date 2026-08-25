import type { Sitio } from "@/types/sitio";
import { clp } from "@/lib/precios";
import ChimbisValoresRegiones from "@/components/ChimbisValoresRegiones";
import ValoresTabla from "@/components/ValoresTabla";
import SkokkaValoresFlyers from "@/components/SkokkaValoresFlyers";
import { LOCANTO_DIAS, LOCANTO_PLAN_INFO, precioLocantoEfectivo, type LocantoPlan } from "@/lib/locanto";
import {
  ESCORCITAS_PLAN_INFO,
  precioEscorcitasEfectivo,
  type EscorcitasDias,
  type EscorcitasPlan,
} from "@/lib/escorcitas";
import {
  FRANJAS_SIMPLEESCORT,
  SIMPLEESCORT_DIAS,
  SIMPLEESCORT_HORARIOS_TOTAL,
  calcularTotalSimpleEscortEfectivo,
} from "@/lib/simpleescort";
import {
  WENAS_DIAS_ORDER,
  WENAS_PLAN_INFO,
  precioWenasEfectivo,
} from "@/lib/wenas";
import {
  GEMIDOS_DIAS_TABLA,
  GEMIDOS_PAUSA,
  GEMIDOS_PLAN_INFO,
  GEMIDOS_PLAN_ORDER,
  GEMIDOS_VACACIONES,
  GEMIDOS_VERIFICACION,
  precioGemidosEfectivo,
} from "@/lib/gemidos";

const LOCANTO_ORDER: LocantoPlan[] = ["TOP", "GALERIA", "TOP_GALERIA"];
const ESCORCITAS_DIAS_ORDER: EscorcitasDias[] = [1, 3, 7];
const ESCORCITAS_PLAN_ORDER: EscorcitasPlan[] = ["TOP", "PREMIUM", "GOLD"];

export function TablaValoresSkokka({ sitio: _sitio }: { sitio: Sitio }) {
  return <SkokkaValoresFlyers />;
}

export function TablaValoresChimbis({
  expandirTodo = false,
  preciosAdmin = null,
}: {
  expandirTodo?: boolean;
  preciosAdmin?: Record<string, number> | null;
}) {
  return (
    <section className="valores-block valores-block--chimbis">
      <p className="valores-note valores-note--lead">
        Las <b>subidas</b> son cuántas veces tu aviso vuelve a los primeros lugares durante los días
        que contrates. El precio cambia según zona, días, subidas y plan.
      </p>
      <ChimbisValoresRegiones expandirTodo={expandirTodo} preciosAdmin={preciosAdmin} />
    </section>
  );
}

export function TablaValoresLocanto({
  preciosAdmin = null,
}: {
  preciosAdmin?: Record<string, number> | null;
}) {
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
          valores: [`${LOCANTO_DIAS} días`, clp(precioLocantoEfectivo(plan, preciosAdmin))],
        }))}
      />
    </section>
  );
}

export function TablaValoresSimpleEscort({
  preciosAdmin = null,
}: {
  preciosAdmin?: Record<string, number> | null;
}) {
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
              clp(calcularTotalSimpleEscortEfectivo(dias, SIMPLEESCORT_HORARIOS_TOTAL, preciosAdmin)),
              clp(calcularTotalSimpleEscortEfectivo(dias, 1, preciosAdmin)),
              clp(calcularTotalSimpleEscortEfectivo(dias, 2, preciosAdmin)),
            ],
          }))}
        />
      </div>
    </section>
  );
}

export function TablaValoresEscorcitas({
  preciosAdmin = null,
}: {
  preciosAdmin?: Record<string, number> | null;
}) {
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
          valores: ESCORCITAS_PLAN_ORDER.map((plan) =>
            clp(precioEscorcitasEfectivo(dias, plan, preciosAdmin))
          ),
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

export function TablaValoresWenas({
  preciosAdmin = null,
}: {
  preciosAdmin?: Record<string, number> | null;
}) {
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
          valores: [clp(precioWenasEfectivo(dias, preciosAdmin))],
        }))}
      />
      <p className="valores-note valores-note--inline">
        <b>{WENAS_PLAN_INFO.VIP.nombre}:</b> {WENAS_PLAN_INFO.VIP.detalle}
      </p>
    </section>
  );
}

export function TablaValoresGemidos({
  preciosAdmin = null,
}: {
  preciosAdmin?: Record<string, number> | null;
}) {
  return (
    <>
      <section className="valores-block">
        <h2 className="valores-h2">Planes y duraciones</h2>
        <p className="valores-note">
          Cada plan tiene duraciones distintas. La fila de 3 días solo aplica a Black Rose; en el
          resto aparece como no disponible.
        </p>
        <ValoresTabla
          columnas={["Duración", ...GEMIDOS_PLAN_ORDER.map((p) => GEMIDOS_PLAN_INFO[p].nombre)]}
          filas={GEMIDOS_DIAS_TABLA.map((dias) => ({
            id: String(dias),
            etiqueta: `${dias} días`,
            valores: GEMIDOS_PLAN_ORDER.map((plan) => {
              const precio = precioGemidosEfectivo(plan, dias, preciosAdmin);
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
  preciosAdmin = null,
}: {
  slug: string;
  sitio: Sitio;
  expandirChimbis?: boolean;
  preciosAdmin?: Record<string, number> | null;
}) {
  switch (slug) {
    case "skokka":
      return <TablaValoresSkokka sitio={sitio} />;
    case "chimbis":
      return <TablaValoresChimbis expandirTodo={expandirChimbis} preciosAdmin={preciosAdmin} />;
    case "locanto":
      return <TablaValoresLocanto preciosAdmin={preciosAdmin} />;
    case "simpleescort":
      return <TablaValoresSimpleEscort preciosAdmin={preciosAdmin} />;
    case "escorcitas":
      return <TablaValoresEscorcitas preciosAdmin={preciosAdmin} />;
    case "wenas":
      return <TablaValoresWenas preciosAdmin={preciosAdmin} />;
    case "gemidos":
      return <TablaValoresGemidos preciosAdmin={preciosAdmin} />;
    default:
      return null;
  }
}
