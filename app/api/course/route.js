import { z } from "zod";
import { sql } from "../../../lib/db";
import { currentUser } from "../../../lib/auth";
import { CODES, canUse } from "../../../lib/courses";
import { sameOrigin, json } from "../../../lib/security";

const schema = z.object({ code: z.enum(CODES) });

// Switch the course the user is studying. Hidden courses are only available to admins.
export async function POST(req) {
  if (!sameOrigin(req)) return json({ error: "bad" }, 400);
  const user = await currentUser();
  if (!user) return json({ error: "auth" }, 401);
  const p = schema.safeParse(await req.json().catch(() => null));
  if (!p.success || !canUse(user, p.data.code)) return json({ error: "Bu til hozirça mavjud emas." }, 400);
  await sql`update users set course=${p.data.code} where id=${user.id}`;
  return json({ ok: true });
}
