-- Create profiles table
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  couple_id uuid, -- Foreign key to couples table (nullable initially)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create couples table
create table public.couples (
  id uuid default gen_random_uuid() primary key,
  start_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add foreign key constraint to profiles
alter table public.profiles
add constraint profiles_couple_id_fkey
foreign key (couple_id) references public.couples(id);

-- Create memories table
create table public.memories (
  id uuid default gen_random_uuid() primary key,
  couple_id uuid references public.couples(id) not null,
  title text not null,
  description text,
  date date not null,
  image_path text, -- Path in Storage
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create letters table
create table public.letters (
  id uuid default gen_random_uuid() primary key,
  couple_id uuid references public.couples(id) not null,
  content text,
  sender_id uuid references public.profiles(id),
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.couples enable row level security;
alter table public.memories enable row level security;
alter table public.letters enable row level security;

-- Policies
-- Profiles: Users can see their own profile
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Couples: Users can view their own couple data
create policy "Users can view own couple" on public.couples
  for select using (
    id in (select couple_id from public.profiles where id = auth.uid())
  );

-- Memories: Users can view/insert memories if they belong to the couple
create policy "Couples can view memories" on public.memories
  for select using (
    couple_id in (select couple_id from public.profiles where id = auth.uid())
  );

create policy "Couples can insert memories" on public.memories
  for insert with check (
    couple_id in (select couple_id from public.profiles where id = auth.uid())
  );

-- Storage bucket setup (You need to create 'memories' bucket in Dashboard)
-- insert into storage.buckets (id, name) values ('memories', 'memories');
