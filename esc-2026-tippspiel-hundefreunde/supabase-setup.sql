create table if not exists esc2026_players (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  created_at timestamptz default now()
);

create table if not exists esc2026_predictions (
  player_name text primary key references esc2026_players(name) on delete cascade,
  top1 text,
  top2 text,
  top3 text,
  top4 text,
  top5 text,
  winner text,
  last text,
  updated_at timestamptz default now()
);

create table if not exists esc2026_results (
  id int primary key default 1,
  top1 text,
  top2 text,
  top3 text,
  top4 text,
  top5 text,
  last text,
  updated_at timestamptz default now(),
  constraint one_result_row check (id = 1)
);

insert into esc2026_results (id) values (1) on conflict (id) do nothing;

alter table esc2026_players enable row level security;
alter table esc2026_predictions enable row level security;
alter table esc2026_results enable row level security;

drop policy if exists "read players" on esc2026_players;
drop policy if exists "add players" on esc2026_players;
drop policy if exists "delete players" on esc2026_players;
drop policy if exists "read predictions" on esc2026_predictions;
drop policy if exists "add predictions" on esc2026_predictions;
drop policy if exists "edit predictions" on esc2026_predictions;
drop policy if exists "delete predictions" on esc2026_predictions;
drop policy if exists "read results" on esc2026_results;
drop policy if exists "edit results" on esc2026_results;

create policy "read players" on esc2026_players for select using (true);
create policy "add players" on esc2026_players for insert with check (true);
create policy "delete players" on esc2026_players for delete using (true);

create policy "read predictions" on esc2026_predictions for select using (true);
create policy "add predictions" on esc2026_predictions for insert with check (true);
create policy "edit predictions" on esc2026_predictions for update using (true);
create policy "delete predictions" on esc2026_predictions for delete using (true);

create policy "read results" on esc2026_results for select using (true);
create policy "edit results" on esc2026_results for update using (true);

alter publication supabase_realtime add table esc2026_players;
alter publication supabase_realtime add table esc2026_predictions;
alter publication supabase_realtime add table esc2026_results;
