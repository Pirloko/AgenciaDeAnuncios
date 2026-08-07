-- =============================================================================
-- PANEL ADMIN — Esquema de costos y precios
-- Ejecutar en Supabase SQL Editor (en orden: 01 → 02)
-- =============================================================================

-- 1) Tabla de configuración (créditos Skokka, etc.)
create table if not exists public.admin_config (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- 2) Tabla principal: costo + precio venta por anuncio
create table if not exists public.anuncio_costos (
  id uuid primary key default gen_random_uuid(),
  sitio text not null check (sitio in ('skokka', 'chimbis', 'locanto', 'simpleescort', 'escorcitas', 'wenas', 'gemidos')),
  categoria text not null,
  plan text not null,
  subidas integer,
  dias integer not null,
  etiqueta text not null,
  valor_plataforma integer,
  creditos integer,
  costo_agencia integer not null default 0,
  precio_venta integer,
  ganancia integer generated always as (
    case
      when precio_venta is not null then precio_venta - costo_agencia
      else null
    end
  ) stored,
  margen_pct numeric(6, 2) generated always as (
    case
      when precio_venta is not null and precio_venta > 0 then
        round(((precio_venta - costo_agencia)::numeric / precio_venta) * 100, 2)
      else null
    end
  ) stored,
  orden integer not null default 0,
  activo boolean not null default true,
  updated_at timestamptz not null default now()
);

create index if not exists anuncio_costos_sitio_idx on public.anuncio_costos (sitio, categoria, orden);
create index if not exists anuncio_costos_lookup_idx on public.anuncio_costos (sitio, plan, subidas, dias);

-- 3) Trigger updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists anuncio_costos_updated_at on public.anuncio_costos;
create trigger anuncio_costos_updated_at
  before update on public.anuncio_costos
  for each row execute function public.set_updated_at();

drop trigger if exists admin_config_updated_at on public.admin_config;
create trigger admin_config_updated_at
  before update on public.admin_config
  for each row execute function public.set_updated_at();

-- 4) Función: ¿es admin? (role en app_metadata del JWT)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- 5) RLS
alter table public.anuncio_costos enable row level security;
alter table public.admin_config enable row level security;

drop policy if exists "admin lee costos" on public.anuncio_costos;
create policy "admin lee costos"
  on public.anuncio_costos for select
  to authenticated
  using (public.is_admin());

drop policy if exists "admin edita costos" on public.anuncio_costos;
create policy "admin edita costos"
  on public.anuncio_costos for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin inserta costos" on public.anuncio_costos;
create policy "admin inserta costos"
  on public.anuncio_costos for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "admin lee config" on public.admin_config;
create policy "admin lee config"
  on public.admin_config for select
  to authenticated
  using (public.is_admin());

drop policy if exists "admin edita config" on public.admin_config;
create policy "admin edita config"
  on public.admin_config for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin inserta config" on public.admin_config;
create policy "admin inserta config"
  on public.admin_config for insert
  to authenticated
  with check (public.is_admin());

-- 6) Config inicial Skokka (créditos)
insert into public.admin_config (key, value)
values (
  'skokka_creditos',
  '{"costo_total_clp": 200000, "cantidad_creditos": 4970, "valor_credito_clp": 40.241}'::jsonb
)
on conflict (key) do update set value = excluded.value;

-- Config inicial Locanto (USD → CLP)
insert into public.admin_config (key, value)
values (
  'locanto_dolar',
  '{"valor_dolar_clp": 868}'::jsonb
)
on conflict (key) do update set value = excluded.value;

-- 7) Grants (si tu proyecto no expone tablas nuevas automáticamente)
grant select, insert, update on public.anuncio_costos to authenticated;
grant select, insert, update on public.admin_config to authenticated;

-- =============================================================================
-- DESPUÉS de ejecutar esto, ejecuta: 02-seed-anuncio-costos.sql
--
-- Luego crea tu usuario en Authentication → Users y en User Metadata (app_metadata):
--   { "role": "admin" }
-- =============================================================================
