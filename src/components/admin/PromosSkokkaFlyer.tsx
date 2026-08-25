"use client";

import { forwardRef } from "react";
import { clp } from "@/lib/precios";
import { NUMERO_WHATSAPP } from "@/lib/whatsapp";
import {
  SKOKKA_PROMO_HORARIOS,
  SKOKKA_PROMO_PLANES,
  SKOKKA_PROMO_PLAN_LABEL,
  etiquetaComboSkokka,
  ventaPromoSkokka,
  type SkokkaPromoModalidad,
  type SkokkaPromosConfig,
} from "@/lib/promos-pagina-skokka";

type Props = {
  modalidad: SkokkaPromoModalidad;
  subidas: number;
  dias: number;
  config: SkokkaPromosConfig;
};

function formatoWhatsApp(num: string): string {
  // 56963550717 → +56 9 6355 0717
  if (num.length === 11 && num.startsWith("56")) {
    return `+${num.slice(0, 2)} ${num.slice(2, 3)} ${num.slice(3, 7)} ${num.slice(7)}`;
  }
  return `+${num}`;
}

const PromosSkokkaFlyer = forwardRef<HTMLDivElement, Props>(function PromosSkokkaFlyer(
  { modalidad, subidas, dias, config },
  ref
) {
  const esMadrugada = modalidad === "madrugada";
  const badge = etiquetaComboSkokka(subidas, dias);
  const wa = formatoWhatsApp(NUMERO_WHATSAPP);
  const horariosLista = esMadrugada ? ([1] as const) : SKOKKA_PROMO_HORARIOS;

  return (
    <div ref={ref} className="skokka-flyer">
      <div className="skokka-flyer__side">
        <span>AGENCIA DE PUBLICACIONES</span>
        <span>DESDE EL 2015 PUBLICANDO</span>
      </div>

      <div className="skokka-flyer__inner">
        <header className="skokka-flyer__hdr">
          <div className="skokka-flyer__logo">
            <span className="skokka-flyer__heart" aria-hidden="true">
              ♥
            </span>
            <span className="skokka-flyer__brand">skokka</span>
          </div>
          <p className="skokka-flyer__tag">¡NUESTROS ANUNCIOS VENDEN!</p>
          <div className="skokka-flyer__badge">{badge}</div>
          {esMadrugada && (
            <p className="skokka-flyer__modalidad">Madrugada · 00:00 a 06:00</p>
          )}
          <p className="skokka-flyer__hook">
            {esMadrugada
              ? "Precio plano por bloque madrugada · 6 subidas incluidas"
              : "Mientras más horarios tomas, más conveniente te queda el pack"}
          </p>
        </header>

        {SKOKKA_PROMO_PLANES.map((plan) => {
          const isAll = plan === "FULL DESTACADO";
          return (
            <section
              key={plan}
              className={`skokka-flyer__box${isAll ? " skokka-flyer__box--all" : ""}`}
            >
              <h2 className="skokka-flyer__plan">
                {isAll ? (
                  <>
                    <span aria-hidden="true">⭐</span> {SKOKKA_PROMO_PLAN_LABEL[plan]}{" "}
                    <span aria-hidden="true">⭐</span>
                  </>
                ) : (
                  SKOKKA_PROMO_PLAN_LABEL[plan]
                )}
              </h2>
              <ul className="skokka-flyer__list">
                {horariosLista.map((h) => {
                  const venta =
                    ventaPromoSkokka(config, modalidad, subidas, dias, plan, h) ?? 0;
                  return (
                    <li key={h}>
                      <span>
                        {esMadrugada ? "Bloque madrugada" : `${h} Horario${h > 1 ? "s" : ""}.`}
                      </span>
                      <b>{clp(venta)}</b>
                    </li>
                  );
                })}
              </ul>
              {isAll && (
                <p className="skokka-flyer__note">
                  Tu publicación aparece en SUPER TOP, además tu publicación destacará con un
                  fondo de color y también con una etiqueta que dirá publicación «NOVEDAD».
                </p>
              )}
            </section>
          );
        })}

        <footer className="skokka-flyer__cta">
          <p className="skokka-flyer__cta-kicker">¿Listas para vender más?</p>
          <p className="skokka-flyer__cta-title">Reserva tu pack ahora por WhatsApp</p>
          <div className="skokka-flyer__cta-btn">
            <span className="skokka-flyer__cta-ico" aria-hidden="true">
              💬
            </span>
            <span className="skokka-flyer__cta-num">{wa}</span>
          </div>
          <p className="skokka-flyer__cta-sub">
            Te armamos el destacado al tiro · Agencia de Publicaciones
          </p>
        </footer>
      </div>
    </div>
  );
});

export default PromosSkokkaFlyer;
