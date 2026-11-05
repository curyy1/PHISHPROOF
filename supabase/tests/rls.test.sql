-- RLS / privilege tests. Run via supabase/tests/run-local.sh. Any failed assertion raises an error.
\set ON_ERROR_STOP on
set client_min_messages = warning;

-- Users: A and B are students, T is a teacher.
insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-0000-0000-00000000000a', 'a@school.example', '{"display_name":"Ava"}'),
  ('00000000-0000-0000-0000-00000000000b', 'b@school.example', '{"display_name":"<script>B"}'),
  ('00000000-0000-0000-0000-00000000000c', 't@school.example', '{}');
update public.profiles set role = 'teacher' where id = '00000000-0000-0000-0000-00000000000c';
update public.profiles set leaderboard_opt_in = true, xp = 120 where id = '00000000-0000-0000-0000-00000000000a';
update public.profiles set xp = 999 where id = '00000000-0000-0000-0000-00000000000b';
-- Server-side (service role) writes
insert into public.quiz_attempts (user_id, quiz_id, score, total) values
  ('00000000-0000-0000-0000-00000000000a', 'what-is-phishing', 5, 6),
  ('00000000-0000-0000-0000-00000000000b', 'what-is-phishing', 2, 6);
insert into public.lesson_progress (user_id, lesson_id) values ('00000000-0000-0000-0000-00000000000a', 'phishing-101');
insert into public.certificates (id, user_id, full_name, score, total) values ('PP-ABCD-EFGH-JKLM', '00000000-0000-0000-0000-00000000000a', 'Ava Lee', 18, 20);

do $$ begin
  assert (select display_name from public.profiles where id = '00000000-0000-0000-0000-00000000000b') = 'scriptB', 'display name sanitized';
  assert (select display_name from public.profiles where id = '00000000-0000-0000-0000-00000000000c') = 'Learner', 'too-short names fall back to Learner';
end $$ ;

-- ---------------------------------------------------------------- as student A
begin;
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000a', true);
do $$ begin
  assert (select count(*) from public.profiles) = 1, 'A sees only own profile';
  assert (select count(*) from public.quiz_attempts) = 1, 'A sees only own quiz attempts';
  assert (select count(*) from public.course_lessons) = 31, 'catalog readable';
  assert (select count(*) from public.certificates) = 1, 'A sees own certificate';
end $$;
-- Allowed: edit own display name / opt-in
update public.profiles set display_name = 'Ava L', leaderboard_opt_in = true where id = '00000000-0000-0000-0000-00000000000a';
-- Not allowed: editing someone else's profile silently matches 0 rows
do $$ declare n int; begin
  update public.profiles set display_name = 'hacked' where id = '00000000-0000-0000-0000-00000000000b';
  get diagnostics n = row_count;
  assert n = 0, 'A cannot update B';
end $$;
-- Not allowed: XP / role escalation
do $$ begin
  begin update public.profiles set xp = 1000000 where id = '00000000-0000-0000-0000-00000000000a';
    raise exception 'FAIL: A updated own xp';
  exception when insufficient_privilege then null; end;
  begin update public.profiles set role = 'admin' where id = '00000000-0000-0000-0000-00000000000a';
    raise exception 'FAIL: A changed own role';
  exception when insufficient_privilege then null; end;
end $$;
-- Not allowed: writing progress directly
do $$ begin
  begin insert into public.quiz_attempts (user_id, quiz_id, score, total) values ('00000000-0000-0000-0000-00000000000a', 'final', 20, 20);
    raise exception 'FAIL: A inserted a quiz attempt';
  exception when insufficient_privilege then null; end;
  begin insert into public.certificates (id, user_id, full_name, score, total) values ('PP-ZZZZ-ZZZZ-ZZZZ', '00000000-0000-0000-0000-00000000000a', 'x', 1, 1);
    raise exception 'FAIL: A forged a certificate';
  exception when insufficient_privilege then null; end;
  begin delete from public.user_badges;
    raise exception 'FAIL: A deleted badges';
  exception when insufficient_privilege then null; end;
end $$;
-- Students can't create classes
do $$ begin
  begin insert into public.classes (name, join_code, teacher_id) values ('Fake', 'ABCDEF', '00000000-0000-0000-0000-00000000000a');
    raise exception 'FAIL: student created a class';
  exception when insufficient_privilege then null; end;
end $$;
commit;

-- ---------------------------------------------------------------- as teacher T
begin;
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000c', true);
insert into public.classes (name, join_code, teacher_id) values ('Period 3 Cyber', 'K7MP2Q', '00000000-0000-0000-0000-00000000000c');
do $$ begin
  assert (select count(*) from public.quiz_attempts) = 0, 'teacher sees no students before anyone joins';
  begin insert into public.classes (name, join_code, teacher_id) values ('Steal', 'QQQQQQ', '00000000-0000-0000-0000-00000000000a');
    raise exception 'FAIL: teacher created class for someone else';
  exception when insufficient_privilege then null; end;
end $$;
commit;

-- A joins with the code
begin;
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000a', true);
select public.join_class(' k7mp2q ');
do $$ begin
  assert (select count(*) from public.classes) = 1, 'member can read their class';
  begin perform public.join_class('NOPE22'); raise exception 'FAIL: joined bad code';
  exception when raise_exception then
    if sqlerrm like 'FAIL%' then raise; end if;
  end;
end $$;
commit;

begin;
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000c', true);
do $$ begin
  assert (select count(*) from public.quiz_attempts) = 1, 'teacher sees A (student) attempts only';
  assert (select count(*) from public.profiles) = 2, 'teacher sees own + A profile, not B';
  assert (select count(*) from public.lesson_progress) = 1, 'teacher sees A lessons';
  assert (select count(*) from public.activity_log) = 0, 'activity log stays private';
end $$;
commit;

-- B can't see A's class or data
begin;
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000b', true);
do $$ begin
  assert (select count(*) from public.classes) = 0, 'non-member cannot read class';
  assert (select count(*) from public.class_members) = 0, 'non-member cannot read roster';
  assert (select count(*) from public.quiz_attempts) = 1, 'B sees only own attempt';
end $$;
commit;

-- ---------------------------------------------------------------- anon
begin;
set local role anon;
do $$ begin
  assert (select full_name from public.verify_certificate('pp-abcd-efgh-jklm')) = 'Ava Lee', 'public verify works (case-insensitive)';
  assert (select count(*) from public.verify_certificate('PP-NOPE-NOPE-NOPE')) = 0, 'unknown cert';
  assert (select count(*) from public.get_leaderboard(10)) = 1, 'only opted-in users on leaderboard';
  assert (select display_name from public.get_leaderboard(10)) = 'Ava L', 'leaderboard shows display name';
  begin perform count(*) from public.certificates; raise exception 'FAIL: anon read certificates table';
  exception when insufficient_privilege then null; end;
  begin perform count(*) from public.profiles; raise exception 'FAIL: anon read profiles';
  exception when insufficient_privilege then null; end;
end $$;
commit;

-- ---------------------------------------------------------------- account deletion cascades
delete from auth.users where id = '00000000-0000-0000-0000-00000000000a';
do $$ begin
  assert (select count(*) from public.quiz_attempts where user_id = '00000000-0000-0000-0000-00000000000a') = 0, 'cascade quiz';
  assert (select count(*) from public.certificates) = 0, 'cascade certificate';
  assert (select count(*) from public.class_members) = 0, 'cascade membership';
end $$;
