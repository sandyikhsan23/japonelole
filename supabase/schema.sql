-- Jalankan di Supabase SQL Editor setelah membuat project.
-- Auth (tabel users) sudah otomatis disediakan Supabase di auth.users.

create table if not exists public.scene_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  scene_id text not null,
  mastered_ids text[] not null default '{}',
  attempts int not null default 0,
  correct int not null default 0,
  updated_at timestamptz not null default now(),
  unique (user_id, scene_id)
);

alter table public.scene_progress enable row level security;

create policy "Users can view their own progress"
  on public.scene_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert their own progress"
  on public.scene_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own progress"
  on public.scene_progress for update
  using (auth.uid() = user_id);
