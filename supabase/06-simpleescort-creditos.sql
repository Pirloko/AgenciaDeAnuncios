-- Config de créditos SimpleEscort (valores distintos a Skokka).
-- Ejecutar en Supabase SQL Editor. Seguro de re-ejecutar.

insert into public.admin_config (key, value)
values (
  'simpleescort_creditos',
  '{"costo_total_clp": 100000, "cantidad_creditos": 1000, "valor_credito_clp": 100}'::jsonb
)
on conflict (key) do update set value = excluded.value;
