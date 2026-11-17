-- Multi-language courses: remember which course each progress row / dictionary word belongs to.
-- Existing rows are all English, so every new column defaults to 'en'.

-- STEP 1 (safe to run while the previous app version is live: only adds things)
alter table users           add column if not exists course text not null default 'en';
alter table lesson_progress add column if not exists course text not null default 'en';
alter table dictionary      add column if not exists course text not null default 'en';
create unique index if not exists lesson_progress_user_course_lesson on lesson_progress (user_id, course, lesson_id);
create unique index if not exists dictionary_user_course_word        on dictionary (user_id, course, word_en);

-- STEP 2 (run right after the app version that uses `course` is deployed; the old version's
-- ON CONFLICT clauses need the old primary keys). Needed before a second course goes live,
-- because the old keys allow only one course per lesson id / word.
alter table lesson_progress drop constraint if exists lesson_progress_pkey;
alter table lesson_progress add constraint lesson_progress_pkey primary key using index lesson_progress_user_course_lesson;
alter table dictionary drop constraint if exists dictionary_pkey;
alter table dictionary add constraint dictionary_pkey primary key using index dictionary_user_course_word;
