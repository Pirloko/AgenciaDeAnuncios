-- Tipo de cambio USD → CLP para costos Locanto (solo panel admin)
insert into public.admin_config (key, value)
values (
  'locanto_dolar',
  '{"valor_dolar_clp": 868}'::jsonb
)
on conflict (key) do update set value = excluded.value;
