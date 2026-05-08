
-- profiles table
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- tasks table
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  category text not null default 'Work' check (category in ('Work','Personal','Health','Finance','Learning')),
  priority text not null default 'Medium' check (priority in ('High','Medium','Low')),
  due date,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index tasks_user_id_idx on public.tasks(user_id);

-- updated_at trigger
create or replace function public.update_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger tasks_updated_at
  before update on public.tasks
  for each row execute function public.update_updated_at();

-- RLS
alter table public.profiles enable row level security;
alter table public.tasks enable row level security;

create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can view own tasks" on public.tasks
  for select using (auth.uid() = user_id);
create policy "Users can create own tasks" on public.tasks
  for insert with check (auth.uid() = user_id);
create policy "Users can update own tasks" on public.tasks
  for update using (auth.uid() = user_id);
create policy "Users can delete own tasks" on public.tasks
  for delete using (auth.uid() = user_id);

-- new user -> profile
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- new profile -> sample tasks
create or replace function public.create_sample_tasks()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.tasks (user_id, title, category, priority, due, description) values
    (new.id, 'Welcome to TaskFlow! 🎉', 'Personal', 'High', current_date + 1, 'Click the checkbox to complete this task.'),
    (new.id, 'Create your first real task', 'Work', 'Medium', current_date + 3, 'Click "+ New Task" to get started.'),
    (new.id, 'Explore board view', 'Learning', 'Low', current_date + 7, 'Click the "Board" button in the top bar.');
  return new;
end;
$$;

create trigger on_profile_created
  after insert on public.profiles
  for each row execute function public.create_sample_tasks();

-- realtime
alter publication supabase_realtime add table public.tasks;
alter table public.tasks replica identity full;
