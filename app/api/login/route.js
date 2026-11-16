import { z } from "zod";
import { sql } from "../../../lib/db";
import { checkPw, fakeCheck, createSession } from "../../../lib/auth";
import { limit, ipOf, sameOrigin, json } from "../../../lib/security";

const schema = z.object({ id: z.string().trim().min(1).max(254), password: z.string().min(1).max(128) });
const bad = () => json({ error: "E-poçta/taxallus yoki parol xato." }, 401);

export async function POST(req) {
  if (!sameOrigin(req) || !req.headers.get("content-type")?.includes("application/json")) return json({ error: "bad" }, 400);
  const p = schema.safeParse(await req.json().catch(() => null));
  if (!p.success) return bad();
  const { id, password } = p.data;
  const key = id.toLowerCase();
  if (!(await limit(`login-ip:${ipOf(req)}`, 20, 600)) || !(await limit(`login:${key}`, 6, 600)))
    return json({ error: "Köp urinish. 10 daqiqadan söng qayta urining." }, 429);
  const [u] = id.includes("@")
    ? await sql`select id,password_hash,email_verified from users where email=${id}`
    : await sql`select id,password_hash,email_verified from users where nickname=${id}`;
  if (!u) { await fakeCheck(password); return bad(); }
  if (!(await checkPw(u.password_hash, password))) return bad();
  if (!u.email_verified) return json({ error: "E-poçtangizni avval tasdiqlang.", unverified: true }, 403);
  await createSession(u.id);
  return json({ ok: true });
}
