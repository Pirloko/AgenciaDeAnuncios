-- Black Rose 3 días (si ya corriste 08 sin esta fila).
-- Ejecutar en Supabase SQL Editor.

insert into public.anuncio_costos
  (sitio, categoria, plan, subidas, dias, etiqueta, valor_plataforma, creditos, costo_agencia, precio_venta, orden)
select * from (values
  ('gemidos', 'general', 'BLACK_ROSE', null::int, 3, 'Black Rose · 3 días', null::numeric, null::int, 0, 220000, 509)
) as v(sitio, categoria, plan, subidas, dias, etiqueta, valor_plataforma, creditos, costo_agencia, precio_venta, orden)
where not exists (
  select 1 from public.anuncio_costos c
  where c.sitio = 'gemidos' and c.plan = 'BLACK_ROSE' and c.dias = 3
);
