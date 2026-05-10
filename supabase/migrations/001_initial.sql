-- profiles
create table public.profiles (
  id uuid references auth.users(id) primary key,
  username text unique,
  country_filter text,
  topic_filter text[],
  serendipity_level int default 5,
  created_at timestamptz default now()
);

-- content cache
create table public.content (
  id text primary key,
  source text not null,
  source_name text not null,
  title text not null,
  summary text,
  url text not null,
  image_url text,
  country text,
  topic text,
  reading_time_seconds int,
  published_at timestamptz,
  cached_at timestamptz default now()
);

-- seen-set
create table public.seen (
  user_id uuid references auth.users(id),
  content_id text references public.content(id),
  seen_at timestamptz default now(),
  primary key (user_id, content_id)
);

create index seen_at_idx on public.seen(seen_at);

-- RLS
alter table public.profiles enable row level security;
alter table public.seen enable row level security;
alter table public.content enable row level security;

create policy "Users can read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can read own seen" on public.seen for select using (auth.uid() = user_id);
create policy "Users can insert own seen" on public.seen for insert with check (auth.uid() = user_id);
create policy "Content is public" on public.content for select using (true);
create policy "Service role inserts content" on public.content for insert with check (true);
