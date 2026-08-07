-- Limpia duplicados de Gemidos y deja exactamente las 11 filas canónicas.
-- Ejecutar en Supabase SQL Editor.

delete from public.anuncio_costos
where sitio = 'gemidos';

insert into public.anuncio_costos
  (sitio, categoria, plan, subidas, dias, etiqueta, valor_plataforma, creditos, costo_agencia, precio_venta, orden)
values
  ('gemidos', 'general', 'CLASSIC',     null, 30, 'Classic · 30 días',     null, null, 0, 45000,  500),
  ('gemidos', 'general', 'GOLD',        null, 7,  'Gold · 7 días',         null, null, 0, 25000,  501),
  ('gemidos', 'general', 'GOLD',        null, 30, 'Gold · 30 días',        null, null, 0, 61000,  502),
  ('gemidos', 'general', 'PLATINUM',    null, 7,  'Platinum · 7 días',     null, null, 0, 38000,  503),
  ('gemidos', 'general', 'PLATINUM',    null, 30, 'Platinum · 30 días',    null, null, 0, 82000,  504),
  ('gemidos', 'general', 'DIAMOND',     null, 7,  'Diamond · 7 días',      null, null, 0, 56000,  505),
  ('gemidos', 'general', 'DIAMOND',     null, 30, 'Diamond · 30 días',     null, null, 0, 121000, 506),
  ('gemidos', 'general', 'DIAMOND_VIP', null, 7,  'Diamond VIP · 7 días',  null, null, 0, 120000, 507),
  ('gemidos', 'general', 'DIAMOND_VIP', null, 30, 'Diamond VIP · 30 días', null, null, 0, 205000, 508),
  ('gemidos', 'general', 'BLACK_ROSE',  null, 3,  'Black Rose · 3 días',   null, null, 0, 220000, 509),
  ('gemidos', 'general', 'BLACK_ROSE',  null, 7,  'Black Rose · 7 días',   null, null, 0, 330000, 510);
