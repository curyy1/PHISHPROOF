-- Phishproof initial schema
-- Security model:
--   * Every table has Row Level Security enabled.
--   * Learners can SELECT only their own rows (teachers can also read rows of students in their classes).
--   * Progress tables have NO insert/update/delete policies for clients. All progress writes happen in
--     Next.js server actions that re-grade answers from repo content, then write with the service role.
--     This stops anyone from forging XP or scores with the public anon key.
--   * Profile edits are limited to safe columns via column-level privileges.
--   * Public certificate verification and the leaderboard go through narrow SECURITY DEFINER functions.

create extension if not exists pgcrypto;

-- --------------------------------------------------------------------------------------------
-- Course catalog (seeded from src/content by `npm run seed:generate` → supabase/seed.sql)
-- --------------------------------------------------------------------------------------------
create table public.course_modules (
  id text primary key check (id ~ '^[a-z0-9-]{1,64}$'),
  number int not null unique,
  title text not null
);

create table public.course_lessons (
  id text primary key check (id ~ '^[a-z0-9-]{1,64}$'),
  module_id text not null references public.course_modules (id) on delete cascade,
  position int not null,
  title text not null
);

-- --------------------------------------------------------------------------------------------
-- Profiles
-- --------------------------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 32),
  full_name text check (full_name is null or char_length(full_name) between 2 and 80),
  role text not null default 'student' check (role in ('student', 'teacher', 'admin')),
  leaderboard_opt_in boolean not null default false,
  xp integer not null default 0 check (xp >= 0),
  current_streak integer not null default 0 check (current_streak >= 0),
  longest_streak integer not null default 0 check (longest_streak >= 0),
  last_active_on date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- --------------------------------------------------------------------------------------------
-- Progress
-- --------------------------------------------------------------------------------------------
create table public.lesson_progress (
  user_id uuid not null references public.profiles (id) on delete cascade,
  lesson_id text not null references public.course_lessons (id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table public.quiz_attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  quiz_id text not null check (quiz_id ~ '^[a-z0-9-]{1,64}$'),
  score integer not null,
  total integer not null check (total > 0),
  created_at timestamptz not null default now(),
  check (score between 0 and total)
);
create index quiz_attempts_user_idx on public.quiz_attempts (user_id, quiz_id);

create table public.drill_results (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  drill text not null check (drill in ('inbox', 'sms', 'browser', 'urls')),
  item_id text not null check (item_id ~ '^[a-z0-9-]{1,32}$'),
  is_phish boolean not null,
  correct boolean not null,
  found text[] not null default '{}',
  missed text[] not null default '{}',
  false_flags integer not null default 0 check (false_flags >= 0),
  created_at timestamptz not null default now()
);
create index drill_results_user_idx on public.drill_results (user_id, drill);

create table public.user_activities (
  user_id uuid not null references public.profiles (id) on delete cascade,
  key text not null check (key ~ '^(passwords|scenario:[a-z0-9-]{1,48})$'),
  completed_at timestamptz not null default now(),
  primary key (user_id, key)
);

create table public.daily_activity (
  user_id uuid not null references public.profiles (id) on delete cascade,
  day date not null,
  primary key (user_id, day)
);

create table public.user_badges (
  user_id uuid not null references public.profiles (id) on delete cascade,
  badge_id text not null check (badge_id ~ '^[a-z0-9-]{1,32}$'),
  earned_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);

create table public.activity_log (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  kind text not null,
  label text not null check (char_length(label) <= 200),
  xp integer not null default 0,
  href text check (href is null or href ~ '^/[A-Za-z0-9/_#?=&.-]*$'),
  created_at timestamptz not null default now()
);
create index activity_log_user_idx on public.activity_log (user_id, created_at desc);

-- --------------------------------------------------------------------------------------------
-- Certificates
-- --------------------------------------------------------------------------------------------
create table public.certificates (
  id text primary key check (id ~ '^PP-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$'),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  full_name text not null check (char_length(full_name) between 2 and 80),
  score integer not null,
  total integer not null,
  issued_at timestamptz not null default now()
);

-- --------------------------------------------------------------------------------------------
-- Classes (teacher view)
-- --------------------------------------------------------------------------------------------
create table public.classes (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 60),
  join_code text not null unique check (join_code ~ '^[A-Z2-9]{6}$'),
  teacher_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.class_members (
  class_id uuid not null references public.classes (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (class_id, user_id)
);
create index class_members_user_idx on public.class_members (user_id);

-- --------------------------------------------------------------------------------------------
-- Helper functions (SECURITY DEFINER with an empty search_path to avoid hijacking)
-- --------------------------------------------------------------------------------------------
create or replace function public.is_teacher()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('teacher', 'admin'));
$$;

-- True when the caller teaches a class that `student` belongs to.
create or replace function public.is_teacher_of(student uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1
    from public.class_members cm
    join public.classes c on c.id = cm.class_id
    where cm.user_id = student and c.teacher_id = auth.uid()
  );
$$;

create or replace function public.is_class_member(cls uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.class_members cm where cm.class_id = cls and cm.user_id = auth.uid());
$$;

-- Create a profile row when someone signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = ''
as $$
declare
  name text;
begin
  name := left(trim(coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1), 'Learner')), 32);
  name := regexp_replace(name, '[^[:alnum:] ._''-]', '', 'g');
  if char_length(name) < 2 then
    name := 'Learner';
  end if;
  insert into public.profiles (id, display_name) values (new.id, name) on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_touch before update on public.profiles
for each row execute function public.touch_updated_at();

-- Public certificate lookup: returns only what's printed on the certificate.
create or replace function public.verify_certificate(cert_id text)
returns table (id text, full_name text, score integer, total integer, issued_at timestamptz)
language sql stable security definer set search_path = ''
as $$
  select c.id, c.full_name, c.score, c.total, c.issued_at
  from public.certificates c
  where c.id = upper(trim(cert_id));
$$;

-- Opt-in leaderboard: display names and XP only.
create or replace function public.get_leaderboard(max_rows integer default 50)
returns table (rank bigint, display_name text, xp integer, longest_streak integer, is_me boolean)
language sql stable security definer set search_path = ''
as $$
  select rank() over (order by p.xp desc) as rank, p.display_name, p.xp, p.longest_streak, p.id = auth.uid() as is_me
  from public.profiles p
  where p.leaderboard_opt_in and p.xp > 0
  order by p.xp desc, p.created_at asc
  limit least(greatest(max_rows, 1), 100);
$$;

-- Join a class by code (students can't read classes they aren't in, so this runs as definer).
create or replace function public.join_class(code text)
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare
  cls uuid;
begin
  if auth.uid() is null then
    raise exception 'Not signed in';
  end if;
  select c.id into cls from public.classes c where c.join_code = upper(trim(code));
  if cls is null then
    raise exception 'No class found with that code';
  end if;
  insert into public.class_members (class_id, user_id) values (cls, auth.uid()) on conflict do nothing;
  return cls;
end;
$$;

-- --------------------------------------------------------------------------------------------
-- Row Level Security
-- --------------------------------------------------------------------------------------------
alter table public.course_modules enable row level security;
alter table public.course_lessons enable row level security;
alter table public.profiles enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.drill_results enable row level security;
alter table public.user_activities enable row level security;
alter table public.daily_activity enable row level security;
alter table public.user_badges enable row level security;
alter table public.activity_log enable row level security;
alter table public.certificates enable row level security;
alter table public.classes enable row level security;
alter table public.class_members enable row level security;

-- Catalog: readable by everyone.
create policy "catalog modules readable" on public.course_modules for select to anon, authenticated using (true);
create policy "catalog lessons readable" on public.course_lessons for select to anon, authenticated using (true);

-- Profiles
create policy "read own profile" on public.profiles for select to authenticated
  using (id = (select auth.uid()) or public.is_teacher_of(id));
create policy "update own profile" on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- Progress tables: read own (or your students'). No client write policies.
create policy "read own lessons" on public.lesson_progress for select to authenticated
  using (user_id = (select auth.uid()) or public.is_teacher_of(user_id));
create policy "read own quizzes" on public.quiz_attempts for select to authenticated
  using (user_id = (select auth.uid()) or public.is_teacher_of(user_id));
create policy "read own drills" on public.drill_results for select to authenticated
  using (user_id = (select auth.uid()) or public.is_teacher_of(user_id));
create policy "read own activities" on public.user_activities for select to authenticated
  using (user_id = (select auth.uid()) or public.is_teacher_of(user_id));
create policy "read own days" on public.daily_activity for select to authenticated
  using (user_id = (select auth.uid()) or public.is_teacher_of(user_id));
create policy "read own badges" on public.user_badges for select to authenticated
  using (user_id = (select auth.uid()) or public.is_teacher_of(user_id));
create policy "read own activity log" on public.activity_log for select to authenticated
  using (user_id = (select auth.uid()));
create policy "read own certificate" on public.certificates for select to authenticated
  using (user_id = (select auth.uid()) or public.is_teacher_of(user_id));

-- Classes
create policy "teachers and members read classes" on public.classes for select to authenticated
  using (teacher_id = (select auth.uid()) or public.is_class_member(id));
create policy "teachers create classes" on public.classes for insert to authenticated
  with check (teacher_id = (select auth.uid()) and public.is_teacher());
create policy "teachers update own classes" on public.classes for update to authenticated
  using (teacher_id = (select auth.uid())) with check (teacher_id = (select auth.uid()));
create policy "teachers delete own classes" on public.classes for delete to authenticated
  using (teacher_id = (select auth.uid()));

create policy "read memberships" on public.class_members for select to authenticated
  using (
    user_id = (select auth.uid())
    or exists (select 1 from public.classes c where c.id = class_id and c.teacher_id = (select auth.uid()))
  );
create policy "leave or remove from class" on public.class_members for delete to authenticated
  using (
    user_id = (select auth.uid())
    or exists (select 1 from public.classes c where c.id = class_id and c.teacher_id = (select auth.uid()))
  );

-- --------------------------------------------------------------------------------------------
-- Privileges (defense in depth on top of RLS)
-- --------------------------------------------------------------------------------------------
revoke all on all tables in schema public from anon, authenticated;
grant select on public.course_modules, public.course_lessons to anon, authenticated;
grant select on public.profiles, public.lesson_progress, public.quiz_attempts, public.drill_results,
  public.user_activities, public.daily_activity, public.user_badges, public.activity_log,
  public.certificates, public.classes, public.class_members to authenticated;
-- Only these profile columns are user-editable. role, xp and streaks are server-managed.
grant update (display_name, full_name, leaderboard_opt_in) on public.profiles to authenticated;
grant insert (name, join_code, teacher_id), update (name), delete on public.classes to authenticated;
grant delete on public.class_members to authenticated;

revoke all on function public.verify_certificate(text) from public;
revoke all on function public.get_leaderboard(integer) from public;
revoke all on function public.join_class(text) from public;
revoke all on function public.handle_new_user() from public;
grant execute on function public.verify_certificate(text) to anon, authenticated;
grant execute on function public.get_leaderboard(integer) to anon, authenticated;
grant execute on function public.join_class(text) to authenticated;
grant execute on function public.is_teacher(), public.is_teacher_of(uuid), public.is_class_member(uuid) to authenticated;
