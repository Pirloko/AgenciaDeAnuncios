-- ============================================================
--  ESQUEMA — Catálogo de avisos destacados
--  Ejecutá este archivo en Supabase: SQL Editor -> New query -> Run
-- ============================================================

create table if not exists sitios (
  slug        text primary key,
  nombre      text not null,
  dominio     text not null,
  desde       int,
  slogan      text,
  color       text not null default '#E5167B',
  accent      text not null default '#2E9BE5',
  disponible  boolean not null default true,
  descripcion jsonb not null default '[]',   -- array de strings
  faq         jsonb not null default '[]',   -- array de { q, a }
  orden       int not null default 100
);

create table if not exists niveles (
  sitio_slug text not null references sitios(slug) on delete cascade,
  id         text not null,   -- "TOP" | "SUPER TOP" | "TOP ALL IN ONE"
  nombre     text not null,
  beneficio  text not null,
  orden      int not null default 0,
  primary key (sitio_slug, id)
);

create table if not exists horarios (
  sitio_slug text not null references sitios(slug) on delete cascade,
  idx        int not null,    -- 0..n  (orden de la franja)
  etiqueta   text not null,   -- "06–09"
  primary key (sitio_slug, idx)
);

create table if not exists precios (
  sitio_slug text not null references sitios(slug) on delete cascade,
  modalidad  text not null check (modalidad in ('diurno','madrugada')),
  subidas    int not null,
  dias       int not null,
  nivel      text not null,
  precio     int not null,
  primary key (sitio_slug, modalidad, subidas, dias, nivel)
);

-- ============================================================
--  RLS — solo lectura pública (anon). Sin escritura desde el cliente.
-- ============================================================
alter table sitios   enable row level security;
alter table niveles  enable row level security;
alter table horarios enable row level security;
alter table precios  enable row level security;

create policy "lectura publica sitios"   on sitios   for select using (true);
create policy "lectura publica niveles"  on niveles  for select using (true);
create policy "lectura publica horarios" on horarios for select using (true);
create policy "lectura publica precios"  on precios  for select using (true);
