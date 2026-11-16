import { z } from "zod";
import { sql } from "../../../../lib/db";
import { currentUser } from "../../../../lib/auth";
import { limit, sameOrigin, json } from "../../../../lib/security";

const schema = z.object({ results: z.array(z.object({ w: z.string().max(80), ok: z.boolean() })).min(1).max(20) });

export async function POST(req) {
  if (!sameOrigin(req)) return json({ error: "bad" }, 400);
  const user = await currentUser();
  if (!user) return json({ error: "auth" }, 401);
  const p = schema.safeParse(await req.json().catch(() => null));
  if (!p.success) return json({ error: "bad" }, 400);
  if (!(await limit(`rev:${user.id}`, 30, 3600))) return json({ error: "limit" }, 429);
  for (const r of p.data.results) {
    if (r.ok) await sql`update dictionary set correct_count=correct_count+1, next_review=now()+interval '1 day'*least(power(2,correct_count)::int,30) where user_id=${user.id} and word_en=${r.w}`;
    else await sql`update dictionary set wrong_count=wrong_count+1, next_review=now() where user_id=${user.id} and word_en=${r.w}`;
  }
  await sql`update users set xp=xp+10,
    streak=case when last_active=(now() at time zone 'Asia/Tashkent')::date then streak when last_active=(now() at time zone 'Asia/Tashkent')::date-1 then streak+1 else 1 end,
    last_active=(now() at time zone 'Asia/Tashkent')::date where id=${user.id}`;
  return json({ ok: true, xp: 10, words: p.data.results.length });
}
