export function EjemploAviso({
  src,
  alt,
  label,
  width,
  height,
}: {
  src: string;
  alt: string;
  label: string;
  width: number;
  height: number;
}) {
  return (
    <figure className="aviso-ejemplo">
      <div className="aviso-ejemplo__frame">
        <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
      </div>
      <figcaption>{label}</figcaption>
    </figure>
  );
}
