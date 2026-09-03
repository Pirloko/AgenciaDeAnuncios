"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AGE_STORAGE_KEY, AGE_STORAGE_VALUE } from "@/lib/legal";

function isExemptPath(pathname: string | null): boolean {
  if (!pathname) return false;
  if (pathname.startsWith("/admin")) return true;
  if (pathname.startsWith("/login")) return true;
  return false;
}

function readConfirmed(): boolean {
  try {
    return window.localStorage.getItem(AGE_STORAGE_KEY) === AGE_STORAGE_VALUE;
  } catch {
    return false;
  }
}

export default function AgeGate() {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    setConfirmed(readConfirmed());
    setReady(true);
  }, []);

  const confirm = useCallback(() => {
    try {
      window.localStorage.setItem(AGE_STORAGE_KEY, AGE_STORAGE_VALUE);
    } catch {
      /* ignore quota / private mode */
    }
    setConfirmed(true);
    setDenied(false);
    window.dispatchEvent(new Event("pe-age-confirmed"));
  }, []);

  const deny = useCallback(() => {
    setDenied(true);
  }, []);

  if (!ready || isExemptPath(pathname) || confirmed) {
    return null;
  }

  return (
    <div className="age-gate" role="dialog" aria-modal="true" aria-labelledby="age-gate-title">
      <div className="age-gate__card">
        {!denied ? (
          <>
            <p className="age-gate__brand">publicacionesescort.cl</p>
            <h1 id="age-gate-title" className="age-gate__title">
              ¿Eres mayor de 18 años?
            </h1>
            <p className="age-gate__text">
              Este sitio es un cotizador de avisos destacados para escorts (contenido para adultos).
              Al continuar declaras bajo tu responsabilidad que tienes 18 años o más.
            </p>
            <div className="age-gate__actions">
              <button type="button" className="age-gate__btn age-gate__btn--yes" onClick={confirm}>
                Sí, soy mayor de 18
              </button>
              <button type="button" className="age-gate__btn age-gate__btn--no" onClick={deny}>
                No
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 id="age-gate-title" className="age-gate__title">
              Acceso no permitido
            </h1>
            <p className="age-gate__text">
              Debes ser mayor de 18 años para usar este sitio. Si entraste por error, cierra
              esta página.
            </p>
            <div className="age-gate__actions">
              <a className="age-gate__btn age-gate__btn--no" href="https://www.google.com">
                Salir
              </a>
              <button
                type="button"
                className="age-gate__btn age-gate__btn--yes"
                onClick={() => setDenied(false)}
              >
                Volver a la pregunta
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
