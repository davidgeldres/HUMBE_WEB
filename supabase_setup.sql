-- ==========================================
-- SUPER SCRIPT DE CONFIGURACIÓN HUMBE WEB
-- ==========================================
-- Ejecuta todo este script en el SQL Editor de Supabase
-- para configurar el "Muro Público" (Notas y Favoritos).
-- ==========================================

-- 1. TABLAS (Las crea solo si no existen para no borrar datos)
-- -----------------------------------------------------------
create table if not exists favorites (
  user_id uuid references auth.users not null,
  song_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, song_id)
);

create table if not exists notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  song_id text not null,
  text text,
  attachments jsonb, 
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, song_id)
);

-- 2. LIMPIEZA DE REGLAS 
-- (Borra ABSOLUTAMENTE TODAS las reglas anteriores para empezar de cero y evitar conflictos)
-- -----------------------------------------------------------
alter table favorites enable row level security;
alter table notes enable row level security;

-- Borrar politicas de Favoritos
drop policy if exists "Users can view own favorites" on favorites;
drop policy if exists "Users can insert own favorites" on favorites;
drop policy if exists "Users can delete own favorites" on favorites;
drop policy if exists "Everyone can view favorites" on favorites;
drop policy if exists "Authenticated users can insert favorites" on favorites;
drop policy if exists "Authenticated users can delete favorites" on favorites;

-- Borrar politicas de Notas
drop policy if exists "Users can view own notes" on notes;
drop policy if exists "Users can insert/update own notes" on notes;
drop policy if exists "Everyone can view notes" on notes;
drop policy if exists "Authenticated users can insert notes" on notes;
drop policy if exists "Authenticated users can update notes" on notes;

-- 3. NUEVAS REGLAS (MODELO 100% PÚBLICO)
-- -----------------------------------------------------------

-- === FAVORITOS ===
-- Ver: Todo el mundo puede ver qué canciones son favoritas.
create policy "Everyone can view favorites" on favorites for select using (true);

-- Dar Like/Dislike: Cualquier usuario que entre a la app (incluso anónimo).
create policy "Authenticated users can insert favorites" on favorites for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can delete favorites" on favorites for delete using (auth.role() = 'authenticated');

-- === NOTAS ===
-- Ver: Todo el mundo puede ver las fotos y notas.
create policy "Everyone can view notes" on notes for select using (true);

-- Escribir/Editar: Cualquier usuario que entre a la app.
create policy "Authenticated users can insert notes" on notes for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can update notes" on notes for update using (auth.role() = 'authenticated');

-- 4. ALMACENAMIENTO (FOTOS)
-- -----------------------------------------------------------
insert into storage.buckets (id, name, public) 
values ('humbe-media', 'humbe-media', true)
on conflict (id) do nothing;

drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Authenticated Upload" on storage.objects;

-- Ver fotos: Todo el mundo
create policy "Public Access" on storage.objects for select using ( bucket_id = 'humbe-media' );
-- Subir fotos: Cualquiera en la app
create policy "Authenticated Upload" on storage.objects for insert with check ( bucket_id = 'humbe-media' and auth.role() = 'authenticated' );

-- 5. ACTIVAR MAGIA (TIEMPO REAL)
-- -----------------------------------------------------------
-- Esto hace que las fotos y likes aparezcan solos sin refrescar
alter publication supabase_realtime add table notes;
alter publication supabase_realtime add table favorites;

-- Fin del script
