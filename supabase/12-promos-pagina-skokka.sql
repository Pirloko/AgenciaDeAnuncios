-- Config de promociones por página (Skokka). Independiente de anuncio_costos.
-- Opcional: si no existe, la API la crea al primer GET/PATCH.

insert into public.admin_config (key, value)
values ('promos_pagina_skokka', '{"version":1,"ventas":{}}'::jsonb)
on conflict (key) do nothing;
