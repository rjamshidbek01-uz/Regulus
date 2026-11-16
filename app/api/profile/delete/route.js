import { z } from "zod";
import { sql } from "../../../../lib/db";
import { currentUser, checkPw, destroySession } from "../../../../lib/auth";
import { limit, sameOrigin, json } from "../../../../lib/security";

const schema = z.object({ password: z.string().max(128) });

export async function POST(req) {
  if (!sameOrigin(req)) return json({ error: "bad" }, 400);
  const user = await currentUser();
  if (!user) return json({ error: "auth" }, 401);
  if (!(await limit(`del:${user.id}`, 5, 3600))) return json({ error: "Köp urinish. Keyinroq urining." }, 429);
  const p = schema.safeParse(await req.json().catch(() => null));
  if (!p.success) return json({ error: "bad" }, 400);
  const [u] = await sql`select password_hash from users where id=${user.id}`;
  if (!(await checkPw(u.password_hash, p.data.password))) return json({ error: "Parol xato." }, 400);
  await sql`delete from users where id=${user.id}`;
  await destroySession();
  return json({ ok: true });
}
