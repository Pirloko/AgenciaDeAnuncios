-- Wenas VIP: deja SOLO 3 opciones (VIP 7 / 15 / 30 días).
-- Ejecutar en Supabase SQL Editor.

-- Permitir borrar costos desde el panel admin
grant delete on public.anuncio_costos to authenticated;
drop policy if exists "admin borra costos" on public.anuncio_costos;
create policy "admin borra costos"
  on public.anuncio_costos for delete
  to authenticated
  using (public.is_admin());

-- Borrar TODAS las filas de Wenas (placeholders + duplicados)
delete from public.anuncio_costos
where sitio = 'wenas';

-- Insertar únicamente las 3 VIP
insert into public.anuncio_costos
  (sitio, categoria, plan, subidas, dias, etiqueta, valor_plataforma, creditos, costo_agencia, precio_venta, orden)
values
  ('wenas', 'general', 'VIP', null, 7,  'VIP · 7 días',  null, null, 26900, 31900, 400),
  ('wenas', 'general', 'VIP', null, 15, 'VIP · 15 días', null, null, 49900, 55900, 401),
  ('wenas', 'general', 'VIP', null, 30, 'VIP · 30 días', null, null, 89900, 96900, 402);
