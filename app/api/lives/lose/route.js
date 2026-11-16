import { sql } from "../../../../lib/db";
import { currentUser } from "../../../../lib/auth";
import { limit, sameOrigin, json } from "../../../../lib/security";

export async function POST(req) {
  if (!sameOrigin(req)) return json({ error: "bad" }, 400);
  const user = await currentUser();
  if (!user) return json({ error: "auth" }, 401);
  if (!(await limit(`lose:${user.id}`, 40, 3600))) return json({ error: "limit" }, 429);
  const [r] = await sql`update users set hearts=greatest(hearts-1,0) where id=${user.id} returning hearts`;
  return json({ ok: true, hearts: r.hearts });
}
