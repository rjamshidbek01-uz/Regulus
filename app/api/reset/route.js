import { z } from "zod";
import { sql } from "../../../lib/db";
import { hashPw, sha256 } from "../../../lib/auth";
import { limit, ipOf, sameOrigin, json } from "../../../lib/security";

const schema = z.object({ token: z.string().max(200), password: z.string().min(10).max(128), confirm: z.string() });

export async function POST(req) {
  if (!sameOrigin(req) || !req.headers.get("content-type")?.includes("application/json")) return json({ error: "bad" }, 400);
  if (!(await limit(`reset-ip:${ipOf(req)}`, 10, 3600))) return json({ error: "Köp urinish. Keyinroq urining." }, 429);
  const p = schema.safeParse(await req.json().catch(() => null));
  if (!p.success) return json({ error: "Parol kamida 10 belgidan iborat bölsin." }, 400);
  if (p.data.password !== p.data.confirm) return json({ error: "Parollar mos kelmadi." }, 400);
  const r = await sql`delete from email_tokens where token_hash=${sha256(p.data.token)} and purpose='reset' and expires_at>now() returning user_id`;
  if (!r[0]) return json({ error: "Havola yaroqsiz yoki muddati tugagan." }, 400);
  await sql`update users set password_hash=${await hashPw(p.data.password)} where id=${r[0].user_id}`;
  await sql`delete from sessions where user_id=${r[0].user_id}`;
  return json({ ok: true });
}
