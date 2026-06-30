export interface ValoresFila {
  id: string;
  etiqueta: string;
  valores: string[];
}

interface ValoresTablaProps {
  /** Primera columna + encabezados de precio. Ej: ["Plan", "TOP", "Súper Top"] */
  columnas: string[];
  filas: ValoresFila[];
}

/** Tabla en escritorio; en móvil cada fila es una ficha sin scroll horizontal. */
export default function ValoresTabla({ columnas, filas }: ValoresTablaProps) {
  const etiquetasPrecio = columnas.slice(1);

  return (
    <div className="valores-tabla">
      <div className="valores-tabla__desk valores-scroll">
        <table>
          <thead>
            <tr>
              {columnas.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filas.map((fila) => (
              <tr key={fila.id}>
                <td>{fila.etiqueta}</td>
                {fila.valores.map((v, i) => (
                  <td key={i}>{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="valores-tabla__movil" aria-hidden={false}>
        {filas.map((fila) => (
          <article key={fila.id} className="valores-ficha">
            <h4 className="valores-ficha__tit">{fila.etiqueta}</h4>
            <dl className="valores-ficha__dl">
              {etiquetasPrecio.map((etiq, i) => (
                <div key={etiq} className="valores-ficha__row">
                  <dt>{etiq}</dt>
                  <dd>{fila.valores[i] ?? "—"}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>
    </div>
  );
}
