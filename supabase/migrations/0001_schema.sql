-- Supabase schema for WebAmp
-- Catalogue public (lecture), données utilisateur privées avec partage opt-in (is_public)

-----------------------
-- Buckets storage
-----------------------
insert into storage.buckets (id, name, public)
values ('ir', 'ir', false)
on conflict (id) do nothing;

-----------------------
-- Catalogue
-----------------------
create table if not exists public.pedals (
  id text primary key,
  brand text not null,
  model text not null,
  type text not null,
  description text,
  color text,
  accent_color text,
  style text,
  created_at timestamp with time zone default now()
);

create table if not exists public.pedal_parameters (
  id bigserial primary key,
  pedal_id text references public.pedals(id) on delete cascade,
  name text not null,
  label text,
  min numeric not null,
  max numeric not null,
  default_value numeric not null,
  control_type text,         -- knob | slider | switch-vertical | switch-horizontal | switch-selector
  orientation text,          -- vertical | horizontal
  order_index int default 0,
  created_at timestamp with time zone default now()
);
create index if not exists pedal_parameters_pedal_idx on public.pedal_parameters(pedal_id, order_index);

create table if not exists public.amplifiers (
  id text primary key,
  brand text not null,
  model text not null,
  type text not null,        -- combo | head
  description text,
  color text,
  style text,
  knob_color text,
  knob_base_color text,
  grille_gradient_a text,
  grille_gradient_b text,
  grille_pattern text,
  knob_layout text,
  border_style text,
  created_at timestamp with time zone default now()
);

create table if not exists public.amplifier_parameters (
  id bigserial primary key,
  amplifier_id text references public.amplifiers(id) on delete cascade,
  name text not null,
  label text,
  min numeric not null,
  max numeric not null,
  default_value numeric not null,
  order_index int default 0,
  created_at timestamp with time zone default now()
);
create index if not exists amplifier_parameters_amp_idx on public.amplifier_parameters(amplifier_id, order_index);

-----------------------
-- Presets
-----------------------
create table if not exists public.presets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  style text,
  notes text,
  is_public boolean default false,
  tags text[] default '{}',
  bpm int,
  instrument text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
create index if not exists presets_user_idx on public.presets(user_id);
create index if not exists presets_public_idx on public.presets(is_public);

create table if not exists public.preset_effects (
  id uuid primary key default gen_random_uuid(),
  preset_id uuid references public.presets(id) on delete cascade,
  effect_id text,           -- frontend ID
  pedal_id text references public.pedals(id),
  type text,
  position int,
  bypassed boolean default false
);
create index if not exists preset_effects_preset_idx on public.preset_effects(preset_id, position);

create table if not exists public.preset_effect_parameters (
  id uuid primary key default gen_random_uuid(),
  preset_effect_id uuid references public.preset_effects(id) on delete cascade,
  name text not null,
  value numeric not null
);
create index if not exists preset_effect_parameters_pe_idx on public.preset_effect_parameters(preset_effect_id);

create table if not exists public.preset_amplifiers (
  id uuid primary key default gen_random_uuid(),
  preset_id uuid references public.presets(id) on delete cascade,
  amplifier_id text references public.amplifiers(id),
  parameters jsonb
);
create index if not exists preset_amplifiers_preset_idx on public.preset_amplifiers(preset_id);

create table if not exists public.favorites (
  user_id uuid references auth.users(id) on delete cascade,
  preset_id uuid references public.presets(id) on delete cascade,
  created_at timestamp with time zone default now(),
  primary key (user_id, preset_id)
);

-----------------------
-- Impulse Responses
-----------------------
create table if not exists public.impulse_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  description text,
  file_path text not null,   -- storage path (bucket ir)
  mime_type text,
  sample_rate int,
  length_ms int,
  is_public boolean default false,
  created_at timestamp with time zone default now()
);
create index if not exists impulse_responses_user_idx on public.impulse_responses(user_id);
create index if not exists impulse_responses_public_idx on public.impulse_responses(is_public);

-----------------------
-- RLS
-----------------------
alter table public.pedals enable row level security;
alter table public.pedal_parameters enable row level security;
alter table public.amplifiers enable row level security;
alter table public.amplifier_parameters enable row level security;
alter table public.presets enable row level security;
alter table public.preset_effects enable row level security;
alter table public.preset_effect_parameters enable row level security;
alter table public.preset_amplifiers enable row level security;
alter table public.favorites enable row level security;
alter table public.impulse_responses enable row level security;

-- Catalogue : lecture publique, écriture admin/service seulement
drop policy if exists "catalogue pedals read" on public.pedals;
create policy "catalogue pedals read" on public.pedals for select using (true);

drop policy if exists "catalogue pedal_params read" on public.pedal_parameters;
create policy "catalogue pedal_params read" on public.pedal_parameters for select using (true);

drop policy if exists "catalogue amplifiers read" on public.amplifiers;
create policy "catalogue amplifiers read" on public.amplifiers for select using (true);

drop policy if exists "catalogue amplifier_params read" on public.amplifier_parameters;
create policy "catalogue amplifier_params read" on public.amplifier_parameters for select using (true);

-- Presets : owner ou public pour select, owner pour write
drop policy if exists "presets select public_or_owner" on public.presets;
create policy "presets select public_or_owner" on public.presets
  for select using (is_public or auth.uid() = user_id);

drop policy if exists "presets write owner" on public.presets;
create policy "presets write owner" on public.presets
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "preset_effects select linked" on public.preset_effects;
create policy "preset_effects select linked" on public.preset_effects
  for select using (exists (select 1 from public.presets p where p.id = preset_id and (p.is_public or auth.uid() = p.user_id)));

drop policy if exists "preset_effects write owner" on public.preset_effects;
create policy "preset_effects write owner" on public.preset_effects
  for all using (exists (select 1 from public.presets p where p.id = preset_id and auth.uid() = p.user_id))
  with check (exists (select 1 from public.presets p where p.id = preset_id and auth.uid() = p.user_id));

drop policy if exists "preset_effect_parameters select linked" on public.preset_effect_parameters;
create policy "preset_effect_parameters select linked" on public.preset_effect_parameters
  for select using (exists (select 1 from public.preset_effects pe join public.presets p on p.id = pe.preset_id where pe.id = preset_effect_id and (p.is_public or auth.uid() = p.user_id)));

drop policy if exists "preset_effect_parameters write owner" on public.preset_effect_parameters;
create policy "preset_effect_parameters write owner" on public.preset_effect_parameters
  for all using (exists (select 1 from public.preset_effects pe join public.presets p on p.id = pe.preset_id where pe.id = preset_effect_id and auth.uid() = p.user_id))
  with check (exists (select 1 from public.preset_effects pe join public.presets p on p.id = pe.preset_id where pe.id = preset_effect_id and auth.uid() = p.user_id));

drop policy if exists "preset_amplifiers select linked" on public.preset_amplifiers;
create policy "preset_amplifiers select linked" on public.preset_amplifiers
  for select using (exists (select 1 from public.presets p where p.id = preset_id and (p.is_public or auth.uid() = p.user_id)));

drop policy if exists "preset_amplifiers write owner" on public.preset_amplifiers;
create policy "preset_amplifiers write owner" on public.preset_amplifiers
  for all using (exists (select 1 from public.presets p where p.id = preset_id and auth.uid() = p.user_id))
  with check (exists (select 1 from public.presets p where p.id = preset_id and auth.uid() = p.user_id));

-- Favorites : owner only
drop policy if exists "favorites select owner" on public.favorites;
create policy "favorites select owner" on public.favorites
  for select using (auth.uid() = user_id);

drop policy if exists "favorites write owner" on public.favorites;
create policy "favorites write owner" on public.favorites
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- IR : select si public ou owner, write owner
drop policy if exists "ir select public_or_owner" on public.impulse_responses;
create policy "ir select public_or_owner" on public.impulse_responses
  for select using (is_public or auth.uid() = user_id);

drop policy if exists "ir write owner" on public.impulse_responses;
create policy "ir write owner" on public.impulse_responses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-----------------------
-- Storage policies (bucket ir)
-----------------------
-- Rule: path must start with `${auth.uid()}/` to read/write own files; public access via signed URLs
drop policy if exists "storage ir owner read" on storage.objects;
create policy "storage ir owner read" on storage.objects
  for select using (bucket_id = 'ir' and auth.role() = 'authenticated' and auth.uid()::text = split_part(name, '/', 1));

drop policy if exists "storage ir owner write" on storage.objects;
create policy "storage ir owner write" on storage.objects
  for insert with check (bucket_id = 'ir' and auth.role() = 'authenticated' and auth.uid()::text = split_part(name, '/', 1));

drop policy if exists "storage ir owner update" on storage.objects;
create policy "storage ir owner update" on storage.objects
  for update using (bucket_id = 'ir' and auth.role() = 'authenticated' and auth.uid()::text = split_part(name, '/', 1))
  with check (bucket_id = 'ir' and auth.role() = 'authenticated' and auth.uid()::text = split_part(name, '/', 1));

drop policy if exists "storage ir owner delete" on storage.objects;
create policy "storage ir owner delete" on storage.objects
  for delete using (bucket_id = 'ir' and auth.role() = 'authenticated' and auth.uid()::text = split_part(name, '/', 1));

-- Admin/service can manage everything
drop policy if exists "storage ir service all" on storage.objects;
create policy "storage ir service all" on storage.objects
  for all using (bucket_id = 'ir' and auth.role() = 'service_role');

-----------------------
-- Helper constraints (optional checks)
-----------------------
alter table public.pedal_parameters
  drop constraint if exists pedal_param_bounds;
alter table public.pedal_parameters
  add constraint pedal_param_bounds check (min <= default_value and default_value <= max);

alter table public.amplifier_parameters
  drop constraint if exists amplifier_param_bounds;
alter table public.amplifier_parameters
  add constraint amplifier_param_bounds check (min <= default_value and default_value <= max);


