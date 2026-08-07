-- Ampliar sitios del panel admin (SimpleEscort, Escorcitas, Wenas)
-- Ejecutar en Supabase si ya corriste 01-admin-schema.sql con la lista antigua.

alter table public.anuncio_costos drop constraint if exists anuncio_costos_sitio_check;

alter table public.anuncio_costos add constraint anuncio_costos_sitio_check
  check (sitio in ('skokka', 'chimbis', 'locanto', 'simpleescort', 'escorcitas', 'wenas', 'gemidos'));
