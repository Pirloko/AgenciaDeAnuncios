-- Precios de venta visibles en el cotizador público (sin costo/margen/créditos).
-- Ejecutar en Supabase SQL Editor.

create or replace view public.precios_publicos
with (security_invoker = false)
as
select
  sitio,
  categoria,
  plan,
  subidas,
  dias,
  etiqueta,
  precio_venta,
  orden
from public.anuncio_costos
where activo is true
  and precio_venta is not null
  and precio_venta > 0;

grant select on public.precios_publicos to anon, authenticated;

comment on view public.precios_publicos is
  'Solo precio de venta para cotizador/valores/promos públicos. No expone costos ni márgenes.';
