-- Permite INSERT en admin_config para admins (upsert / filas nuevas de config).
-- Ejecutar en Supabase SQL Editor si al guardar config aparece error de RLS.

drop policy if exists "admin inserta config" on public.admin_config;
create policy "admin inserta config"
  on public.admin_config for insert
  to authenticated
  with check (public.is_admin());

grant insert on public.admin_config to authenticated;
