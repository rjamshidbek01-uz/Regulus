import crypto from "node:crypto";
import { z } from "zod";
import { sql } from "../../../lib/db";
import { sha256 } from "../../../lib/auth";
import { limit, ipOf, sameOrigin, json } from "../../../lib/security";
import { mailEnabled, sendVerification } from "../../../lib/mail";

const schema = z.object({ id: z.string().trim().min(1).max(254) });

export async function POST(req) {
  if (!sameOrigin(req) || !req.headers.get("content-type")?.includes("application/json")) return json({ error: "bad" }, 400);
  const p = schema.safeParse(await req.json().catch(() => null));
  if (!p.success) return json({ ok: true });
  const id = p.data.id;
  if (!(await limit(`resend-ip:${ipOf(req)}`, 5, 3600)) || !(await limit(`resend:${id.toLowerCase()}`, 3, 3600))) return json({ error: "Köp urinish. Keyinroq urining." }, 429);
  if (mailEnabled()) {
    const [u] = id.includes("@")
      ? await sql`select id,email from users where email=${id} and email_verified=false`
      : await sql`select id,email from users where nickname=${id} and email_verified=false`;
    if (u) {
      const t = crypto.randomBytes(32).toString("base64url");
      await sql`delete from email_tokens where user_id=${u.id} and purpose='verify'`;
      await sql`insert into email_tokens(token_hash,user_id,purpose,expires_at) values(${sha256(t)},${u.id},'verify',now()+interval '24 hours')`;
      await sendVerification(u.email, t);
    }
  }
  return json({ ok: true });
}
