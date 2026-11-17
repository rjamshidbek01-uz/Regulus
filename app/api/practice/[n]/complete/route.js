import { z } from "zod";
import { sql } from "../../../../../lib/db";
import { currentUser } from "../../../../../lib/auth";
import { limit, sameOrigin, json } from "../../../../../lib/security";
import { courseFor } from "../../../../../lib/courses";
import { checkPractice, PRACTICE_MAX_MISTAKES } from "../../../../../lib/practice";

const schema = z.object({ mistakes: z.number().int().min(0).max(60), token: z.string().max(200) });

export async function POST(req, { params }) {
  if (!sameOrigin(req)) return json({ error: "bad" }, 400);
  const user = await currentUser();
  if (!user) return json({ error: "auth" }, 401);
  const C = courseFor(user);
  const n = Number.parseInt((await params).n, 10);
  const p = schema.safeParse(await req.json().catch(() => null));
  if (!p.success || !(n >= 1 && n <= C.units.length)) return json({ error: "bad" }, 400);
  if (!(await limit(`prac:${user.id}`, 8, 86400))) return json({ error: "limit" }, 429);
  if (!checkPractice(user.id, C.code, n, p.data.token)) return json({ error: "token" }, 400);
  const used = await sql`insert into rate_limits(key,count) values(${"ptok:" + p.data.token},1) on conflict do nothing returning key`;
  if (!used.length) return json({ error: "used" }, 400);
  if (p.data.mistakes > PRACTICE_MAX_MISTAKES) return json({ ok: true, pass: false });
  const [r] = await sql`update users set hearts=least(5,hearts+3), xp=xp+15 where id=${user.id} returning hearts`;
  return json({ ok: true, pass: true, hearts: r.hearts });
}
