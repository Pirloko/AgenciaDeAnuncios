-- Lectura pública de precios promo Skokka (cotizador + tabla de valores).
-- Solo esa key; el resto de admin_config sigue restringido a admins.

grant select on public.admin_config to anon, authenticated;

drop policy if exists "lectura publica promos skokka" on public.admin_config;
create policy "lectura publica promos skokka"
  on public.admin_config for select
  to anon, authenticated
  using (key = 'promos_pagina_skokka');
