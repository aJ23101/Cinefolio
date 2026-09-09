-- Run this in Supabase SQL Editor. The ADD COLUMN statements keep an existing
-- Cinefolio database upgradeable without deleting a user's watch history.
create table if not exists public.movies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  year integer,
  director text,
  poster_url text,
  created_at timestamptz not null default now(),
  unique (user_id, title)
);

create table if not exists public.logs (
  id uuid primary key default gen_random_uuid(),
  movie_id uuid not null references public.movies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  watched_on date not null,
  watched_date date,
  rating integer not null check (rating between 1 and 5),
  review text,
  review_text text,
  tags text[] not null default '{}',
  rewatch boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.movies add column if not exists release_year integer;
alter table public.movies add column if not exists tmdb_id bigint;
alter table public.movies add column if not exists runtime integer;
alter table public.movies add column if not exists country text;
alter table public.movies add column if not exists language text;
alter table public.movies add column if not exists audio_languages text[] not null default '{}';
alter table public.movies add column if not exists genre text[] not null default '{}';
alter table public.movies add column if not exists backdrop_url text;
alter table public.movies add column if not exists overview text;
alter table public.movies add column if not exists original_language text;

do $$ begin
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'movies' and column_name = 'year') then
    update public.movies set release_year = year where release_year is null;
  end if;
end $$;

alter table public.logs add column if not exists review_text text;
alter table public.logs add column if not exists watched_date date;
alter table public.logs add column if not exists created_at timestamptz not null default now();
update public.logs set watched_date = watched_on where watched_date is null;
update public.logs set review_text = review where review_text is null;

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

create table if not exists public.log_tags (
  log_id uuid not null references public.logs(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (log_id, tag_id)
);

-- A film can be in one or both personal collections. Metadata stays on the
-- existing user-owned movies row; this table only records the collection state.
create table if not exists public.movie_collections (
  movie_id uuid not null references public.movies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('watchlist', 'favorite')),
  created_at timestamptz not null default now(),
  primary key (movie_id, kind)
);

alter table public.movies enable row level security;
alter table public.logs enable row level security;
alter table public.tags enable row level security;
alter table public.log_tags enable row level security;
alter table public.movie_collections enable row level security;

drop policy if exists "Users can manage their own movies" on public.movies;
drop policy if exists "Users can manage their own logs" on public.logs;
create policy "Users can manage their own movies" on public.movies for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage their own logs" on public.logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Users can manage their own tags" on public.tags;
create policy "Users can manage their own tags" on public.tags for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Users can manage their own log tags" on public.log_tags;
create policy "Users can manage their own log tags" on public.log_tags for all using (
  exists (select 1 from public.logs where logs.id = log_tags.log_id and logs.user_id = auth.uid())
  and exists (select 1 from public.tags where tags.id = log_tags.tag_id and tags.user_id = auth.uid())
);
drop policy if exists "Users can manage their own collections" on public.movie_collections;
create policy "Users can manage their own collections" on public.movie_collections for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists movies_user_title_idx on public.movies (user_id, lower(title));
create unique index if not exists movies_user_tmdb_idx on public.movies (user_id, tmdb_id) where tmdb_id is not null;
create index if not exists movies_country_idx on public.movies (user_id, country);
create index if not exists movies_language_idx on public.movies (user_id, language);
create index if not exists movies_genre_idx on public.movies using gin (genre);
create index if not exists logs_user_date_idx on public.logs (user_id, watched_date desc);
create index if not exists logs_rating_idx on public.logs (user_id, rating);
create index if not exists logs_tags_idx on public.logs using gin (tags);
create index if not exists movie_collections_user_kind_idx on public.movie_collections (user_id, kind, created_at desc);
