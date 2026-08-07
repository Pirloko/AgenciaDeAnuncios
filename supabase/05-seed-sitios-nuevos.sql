-- Seed SimpleEscort, Escorcitas y placeholders Wenas
-- Ejecutar en Supabase SQL Editor (incluye ampliación del check de sitios).
-- Seguro de re-ejecutar: solo inserta si no existe la misma combinación.

-- 1) Permitir sitios nuevos en el check constraint
alter table public.anuncio_costos drop constraint if exists anuncio_costos_sitio_check;

alter table public.anuncio_costos add constraint anuncio_costos_sitio_check
  check (sitio in ('skokka', 'chimbis', 'locanto', 'simpleescort', 'escorcitas', 'wenas', 'gemidos'));

-- 2) SimpleEscort (precios web)
insert into public.anuncio_costos
  (sitio, categoria, plan, subidas, dias, etiqueta, valor_plataforma, creditos, costo_agencia, precio_venta, orden)
select * from (values
  ('simpleescort', 'general', 'SUPER_TURBO_FULL', 20, 1, 'Super Turbo 5X · 4 horarios (full) · 1d', null::integer, null::integer, 0, 7000, 200),
  ('simpleescort', 'general', 'SUPER_TURBO_1H', 5, 1, 'Super Turbo 5X · 1 horario · 1d', null, null, 0, 3500, 201),
  ('simpleescort', 'general', 'SUPER_TURBO_2H', 10, 1, 'Super Turbo 5X · 2 horarios · 1d', null, null, 0, 7000, 202),
  ('simpleescort', 'general', 'SUPER_TURBO_3H', 15, 1, 'Super Turbo 5X · 3 horarios · 1d', null, null, 0, 10500, 203),
  ('simpleescort', 'general', 'SUPER_TURBO_FULL', 20, 3, 'Super Turbo 5X · 4 horarios (full) · 3d', null, null, 0, 12000, 204),
  ('simpleescort', 'general', 'SUPER_TURBO_1H', 5, 3, 'Super Turbo 5X · 1 horario · 3d', null, null, 0, 5500, 205),
  ('simpleescort', 'general', 'SUPER_TURBO_2H', 10, 3, 'Super Turbo 5X · 2 horarios · 3d', null, null, 0, 11000, 206),
  ('simpleescort', 'general', 'SUPER_TURBO_3H', 15, 3, 'Super Turbo 5X · 3 horarios · 3d', null, null, 0, 16500, 207),
  ('simpleescort', 'general', 'SUPER_TURBO_FULL', 20, 5, 'Super Turbo 5X · 4 horarios (full) · 5d', null, null, 0, 18000, 208),
  ('simpleescort', 'general', 'SUPER_TURBO_1H', 5, 5, 'Super Turbo 5X · 1 horario · 5d', null, null, 0, 6500, 209),
  ('simpleescort', 'general', 'SUPER_TURBO_2H', 10, 5, 'Super Turbo 5X · 2 horarios · 5d', null, null, 0, 13000, 210),
  ('simpleescort', 'general', 'SUPER_TURBO_3H', 15, 5, 'Super Turbo 5X · 3 horarios · 5d', null, null, 0, 19500, 211),
  ('simpleescort', 'general', 'SUPER_TURBO_FULL', 20, 7, 'Super Turbo 5X · 4 horarios (full) · 7d', null, null, 0, 22000, 212),
  ('simpleescort', 'general', 'SUPER_TURBO_1H', 5, 7, 'Super Turbo 5X · 1 horario · 7d', null, null, 0, 8000, 213),
  ('simpleescort', 'general', 'SUPER_TURBO_2H', 10, 7, 'Super Turbo 5X · 2 horarios · 7d', null, null, 0, 16000, 214),
  ('simpleescort', 'general', 'SUPER_TURBO_3H', 15, 7, 'Super Turbo 5X · 3 horarios · 7d', null, null, 0, 24000, 215)
) as v(sitio, categoria, plan, subidas, dias, etiqueta, valor_plataforma, creditos, costo_agencia, precio_venta, orden)
where not exists (
  select 1 from public.anuncio_costos c
  where c.sitio = v.sitio and c.plan = v.plan and c.dias = v.dias
    and c.categoria = v.categoria
    and coalesce(c.subidas, -1) = coalesce(v.subidas, -1)
);

-- 3) Escorcitas
insert into public.anuncio_costos
  (sitio, categoria, plan, subidas, dias, etiqueta, valor_plataforma, creditos, costo_agencia, precio_venta, orden)
select * from (values
  ('escorcitas', 'general', 'TOP', null::integer, 1, 'TOP · 1 día', null::integer, null::integer, 0, 2500, 300),
  ('escorcitas', 'general', 'PREMIUM', null, 1, 'PREMIUM · 1 día', null, null, 0, 3500, 301),
  ('escorcitas', 'general', 'GOLD', null, 1, 'GOLD · 1 día', null, null, 0, 4500, 302),
  ('escorcitas', 'general', 'TOP', null, 3, 'TOP · 3 días', null, null, 0, 5000, 303),
  ('escorcitas', 'general', 'PREMIUM', null, 3, 'PREMIUM · 3 días', null, null, 0, 6000, 304),
  ('escorcitas', 'general', 'GOLD', null, 3, 'GOLD · 3 días', null, null, 0, 8500, 305),
  ('escorcitas', 'general', 'TOP', null, 7, 'TOP · 7 días', null, null, 0, 8000, 306),
  ('escorcitas', 'general', 'PREMIUM', null, 7, 'PREMIUM · 7 días', null, null, 0, 11000, 307),
  ('escorcitas', 'general', 'GOLD', null, 7, 'GOLD · 7 días', null, null, 0, 16000, 308)
) as v(sitio, categoria, plan, subidas, dias, etiqueta, valor_plataforma, creditos, costo_agencia, precio_venta, orden)
where not exists (
  select 1 from public.anuncio_costos c
  where c.sitio = v.sitio and c.plan = v.plan and c.dias = v.dias
    and c.categoria = v.categoria
    and coalesce(c.subidas, -1) = coalesce(v.subidas, -1)
);

-- 4) Wenas VIP (solo 3 opciones)
delete from public.anuncio_costos where sitio = 'wenas';

insert into public.anuncio_costos
  (sitio, categoria, plan, subidas, dias, etiqueta, valor_plataforma, creditos, costo_agencia, precio_venta, orden)
values
  ('wenas', 'general', 'VIP', null, 7,  'VIP · 7 días',  null, null, 26900, 31900, 400),
  ('wenas', 'general', 'VIP', null, 15, 'VIP · 15 días', null, null, 49900, 55900, 401),
  ('wenas', 'general', 'VIP', null, 30, 'VIP · 30 días', null, null, 89900, 96900, 402);

-- 5) Gemidos.tv (planes oficiales)
insert into public.anuncio_costos
  (sitio, categoria, plan, subidas, dias, etiqueta, valor_plataforma, creditos, costo_agencia, precio_venta, orden)
select * from (values
  ('gemidos', 'general', 'CLASSIC',     null::int, 30, 'Classic · 30 días',     null::numeric, null::int, 0, 45000,  500),
  ('gemidos', 'general', 'GOLD',        null, 7,  'Gold · 7 días',         null, null, 0, 25000,  501),
  ('gemidos', 'general', 'GOLD',        null, 30, 'Gold · 30 días',        null, null, 0, 61000,  502),
  ('gemidos', 'general', 'PLATINUM',    null, 7,  'Platinum · 7 días',     null, null, 0, 38000,  503),
  ('gemidos', 'general', 'PLATINUM',    null, 30, 'Platinum · 30 días',    null, null, 0, 82000,  504),
  ('gemidos', 'general', 'DIAMOND',     null, 7,  'Diamond · 7 días',      null, null, 0, 56000,  505),
  ('gemidos', 'general', 'DIAMOND',     null, 30, 'Diamond · 30 días',     null, null, 0, 121000, 506),
  ('gemidos', 'general', 'DIAMOND_VIP', null, 7,  'Diamond VIP · 7 días',  null, null, 0, 120000, 507),
  ('gemidos', 'general', 'DIAMOND_VIP', null, 30, 'Diamond VIP · 30 días', null, null, 0, 205000, 508),
  ('gemidos', 'general', 'BLACK_ROSE',  null, 3,  'Black Rose · 3 días',   null, null, 0, 220000, 509),
  ('gemidos', 'general', 'BLACK_ROSE',  null, 7,  'Black Rose · 7 días',   null, null, 0, 330000, 510)
) as v(sitio, categoria, plan, subidas, dias, etiqueta, valor_plataforma, creditos, costo_agencia, precio_venta, orden)
where not exists (
  select 1 from public.anuncio_costos c
  where c.sitio = v.sitio and c.plan = v.plan and c.dias = v.dias
    and c.categoria = v.categoria
    and coalesce(c.subidas, -1) = coalesce(v.subidas, -1)
);
