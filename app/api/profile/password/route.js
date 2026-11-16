import { z } from "zod";
import { cookies } from "next/headers";
import { sql } from "../../../../lib/db";
import { currentUser, checkPw, hashPw, sha256 } from "../../../../lib/auth";
import { limit, sameOrigin, json } from "../../../../lib/security";

const schema = z.object({ current: z.string().max(128), password: z.string().min(10).max(128), confirm: z.string() });

export async function POST(req) {
  if (!sameOrigin(req)) return json({ error: "bad" }, 400);
  const user = await currentUser();
  if (!user) return json({ error: "auth" }, 401);
  if (!(await limit(`pw:${user.id}`, 5, 3600))) return json({ error: "Köp urinish. Keyinroq urining." }, 429);
  const p = schema.safeParse(await req.json().catch(() => null));
  if (!p.success) return json({ error: "Yangi parol kamida 10 belgidan iborat bölsin." }, 400);
  if (p.data.password !== p.data.confirm) return json({ error: "Parollar mos kelmadi." }, 400);
  const [u] = await sql`select password_hash from users where id=${user.id}`;
  if (!(await checkPw(u.password_hash, p.data.current))) return json({ error: "Joriy parol xato." }, 400);
  await sql`update users set password_hash=${await hashPw(p.data.password)} where id=${user.id}`;
  const sid = (await cookies()).get("sid")?.value;
  await sql`delete from sessions where user_id=${user.id} and token_hash<>${sid ? sha256(sid) : ""}`;
  return json({ ok: true });
}
