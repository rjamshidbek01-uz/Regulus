# Regulus — project handoff

Duolingo-style web app that teaches **English to Uzbek speakers, in Uzbek**. Live: https://regulus-jamshidbek1.vercel.app

## Stack
- Next.js 15 (App Router, JavaScript), React 19, Zod, `@node-rs/argon2`, `@neondatabase/serverless`
- DB: Neon Postgres (project `curly-mud-44522540`, branch `br-rough-sun-ar8zduan`, db `neondb`)
- Hosting: Vercel (team `team_2sRe5Y7NANiASTDlghF266DX`, project `regulus` = `prj_laK8BeoOBdNgf8FM5QgH269Twnnp`)
- AI: Google Gemini (preferred, `GEMINI_API_KEY`) with Groq fallback (`GROQ_API_KEY`); mail: Brevo (`BREVO_API_KEY`, `MAIL_FROM`) or Resend

## Environment variables (names only — set them in Vercel/.env, never commit values)
DATABASE_URL, AUTH_SECRET, APP_URL, GROQ_API_KEY, GEMINI_API_KEY (optional), BREVO_API_KEY, MAIL_FROM, optional GROQ_MODEL / GEMINI_MODEL

## Hard rules / decisions
- All Uzbek text uses the **Turkish-style Latin alphabet**: o'→ö, g'→ğ, sh→ş, ch→ç, capital I at word start → İ (e.g. Luğatim, İngliz tili). Say "ingliz tili", never "inglizça"; formal register ("siz").
- AI answers: full explanation first, then "Misollar:" with `*English* — Uzbek`; no parentheses translations; server converts output to the Turkish-style alphabet (`toTurk` in `app/api/ai/route.js`).
- Hover hints (dictionary form) only on the QUESTION text, never on answer choices (`lib/glossary.js`).
- Lives: 5 per day (reset at midnight Asia/Tashkent), −1 per mistake (server-side `/api/lives/lose`); at 0 lives lessons are blocked; chapter practice test (20 questions, ≤3 mistakes = 85%) gives +3 lives.
- Streak counts any active day (visiting while logged in); computed in `currentUser()` in `lib/auth.js`.
- Header numbers (hearts/streak/xp) are a client component refreshed via `/api/me` + `regulus:refresh` event, because the root layout is not re-rendered on soft navigation.
- Auth: argon2id, httpOnly session cookie `sid`, rate limits in `rate_limits` table, math captcha + honeypot, email verification only when a mail key exists.

## Design (night-sky theme + mascot)
- Mascot: **Regi**, a lion cub with a crown and star-tipped tail (`app/components/Regi.js`, pure SVG; moods: happy, wave, cheer, sad, think, sleep, shy). Shown on landing, lesson path, player, auth forms, tutor, empty states.
- One stylesheet: `app/globals.css` (tokens at the top; dark sky background, white chunky cards, 3D pressable buttons). Fonts are self-hosted via `@fontsource-variable/fredoka` (display) and `nunito` (body); CSP allows only `font-src 'self'`.
- `app/components/Fx.js`: `Tilt` (pointer 3D), `Confetti`, `sfx` (WebAudio sounds, mute stored in localStorage). `Icon.js`: inline icons. `Nav.js`: top links (≥1024px) and bottom tab bar (below).
- All motion is transform/opacity and is disabled under `prefers-reduced-motion`. The player hides the site header/footer.

## Structure
- `lib/curriculum.js` — content engine + the original 15 chapters; extra chapters live in `lib/units/{a1,a2,b1,b2}.js` and are appended after them (80 chapters × 3 lessons = 240 lessons, 8 words + 6 sentences each). Lesson ids are positional (1..240) and stored in `lesson_progress`, so **never reorder or remove chapters — only append**. Exercises are generated (4 parts: Sözlar, Eşitish, Tarjima, Takrorlash).
- Learn UI: `/learn` = mission card + "Yulduzlar xaritasi" (4 galaxies of 20 chapters, `WORLDS` in curriculum.js; `MapView`, `Planet`); `/learn/bolim/[n]` = chapter page (Regi tip, `Constellation` of 3 lessons + test, word previews with audio, lesson buttons).
- `lib/practice.js`, `lib/review.js`, `lib/glossary.js`, `lib/mail.js`, `lib/auth.js`, `lib/security.js`
- `app/components/Player.js` — the lesson/practice/review player
- Leaderboard groups of 200 (`users.group_no`), About page with creators/tutorial, footer in `app/layout.js`

## Database tables
users(id, email, nickname, password_hash, email_verified, xp, streak, last_active, hearts, hearts_day, role, group_no, created_at), sessions, email_tokens, rate_limits, lesson_progress(user_id, lesson_id, score, completed_at), dictionary(user_id, word_en, word_uz, example_en, example_uz, correct_count, wrong_count, learned_at, next_review). (units/lessons/exercises tables exist but are unused; content lives in code.)

## Deploy
Best: push this folder to GitHub and import it in Vercel (auto-deploys). Or `vercel --prod`.

## Open ideas / TODO
- Native-speaker proofreading of all Uzbek content
- Add GEMINI_API_KEY (better Uzbek than Groq); rotate the Groq key (it was shared in a chat)
- More chapters (B1+), custom domain, streak reminders, design polish, mobile polish
