import { z } from "zod";
import { sql } from "../../../../../lib/db";
import { currentUser } from "../../../../../lib/auth";
import { limit, sameOrigin, json } from "../../../../../lib/security";
import { getLesson, lessonWords } from "../../../../../lib/curriculum";

const schema = z.object({ mistakes: z.number().int().min(0).max(7), wrong: z.array(z.string().max(80)).max(20) });

export async function POST(req, { params }) {
  if (!sameOrigin(req)) return json({ error: "bad" }, 400);
  const user = await currentUser();
  if (!user) return json({ error: "auth" }, 401);
  if (user.hearts <= 0) return json({ error: "hearts" }, 403);
  const lid = Number.parseInt((await params).id, 10);
  const p = schema.safeParse(await req.json().catch(() => null));
  if (!p.success || !getLesson(lid)) return json({ error: "bad" }, 400);
  if (!(await limit(`les:${user.id}`, 60, 3600))) return json({ error: "limit" }, 429);
  if (lid > 1) {
    const [ok] = await sql`select 1 from lesson_progress where user_id=${user.id} and lesson_id=${lid - 1}`;
    if (!ok) return json({ error: "locked" }, 403);
  }
  const [prev] = await sql`select 1 from lesson_progress where user_id=${user.id} and lesson_id=${lid}`;
  const xp = prev ? 4 : 20 + (p.data.mistakes <= 1 ? 10 : 0);
  const words = lessonWords(lid);

  await sql`insert into lesson_progress(user_id,lesson_id,score) values(${user.id},${lid},${7 - p.data.mistakes})
    on conflict(user_id,lesson_id) do update set score=greatest(lesson_progress.score,excluded.score), completed_at=now()`;
  for (const w of words)
    await sql`insert into dictionary(user_id,word_en,word_uz,correct_count,next_review) values(${user.id},${w.en},${w.uz},1,now()+interval '1 day')
      on conflict(user_id,word_en) do update set correct_count=dictionary.correct_count+1, word_uz=excluded.word_uz`;
  if (p.data.wrong.length)
    await sql`update dictionary set wrong_count=wrong_count+1, next_review=now() where user_id=${user.id} and word_en=any(${p.data.wrong})`;
  await sql`update users set xp=xp+${xp},
    streak=case when last_active=(now() at time zone 'Asia/Tashkent')::date then streak when last_active=(now() at time zone 'Asia/Tashkent')::date-1 then streak+1 else 1 end,
    last_active=(now() at time zone 'Asia/Tashkent')::date where id=${user.id}`;
  return json({ ok: true, xp, words: words.length });
}
