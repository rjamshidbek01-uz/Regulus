import crypto from "node:crypto";
import { z } from "zod";
import { sql } from "../../../lib/db";
import { sha256 } from "../../../lib/auth";
import { limit, ipOf, sameOrigin, json } from "../../../lib/security";
import { mailEnabled, sendReset } from "../../../lib/mail";

const schema = z.object({ email: z.string().trim().toLowerCase().email().max(254) });

export async function POST(req) {
  if (!sameOrigin(req) || !req.headers.get("content-type")?.includes("application/json")) return json({ error: "bad" }, 400);
  const p = schema.safeParse(await req.json().catch(() => null));
  if (!p.success) return json({ ok: true });
  const { email } = p.data;
  if (!(await limit(`forgot-ip:${ipOf(req)}`, 5, 3600)) || !(await limit(`forgot:${email}`, 3, 3600))) return json({ error: "Köp urinish. Keyinroq urining." }, 429);
  if (mailEnabled()) {
    const [u] = await sql`select id from users where email=${email} and email_verified=true`;
    if (u) {
      const t = crypto.randomBytes(32).toString("base64url");
      await sql`delete from email_tokens where user_id=${u.id} and purpose='reset'`;
      await sql`insert into email_tokens(token_hash,user_id,purpose,expires_at) values(${sha256(t)},${u.id},'reset',now()+interval '1 hour')`;
      await sendReset(email, t);
    }
  }
  return json({ ok: true });
}
