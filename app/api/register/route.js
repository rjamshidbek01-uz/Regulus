import crypto from "node:crypto";
import { z } from "zod";
import { sql } from "../../../lib/db";
import { hashPw, createSession, sha256 } from "../../../lib/auth";
import { limit, ipOf, sameOrigin, checkChallenge, json } from "../../../lib/security";
import { mailEnabled, sendVerification } from "../../../lib/mail";

const schema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  nickname: z.string().trim().regex(/^[A-Za-z0-9_]{3,20}$/),
  password: z.string().min(10).max(128),
  confirm: z.string(),
  answer: z.string().max(10),
  token: z.string().max(200),
  website: z.string().max(100).optional(),
});
const msg = { email: "E-poçta notöğri.", nickname: "Taxallus 3–20 belgi: harf, raqam yoki _", password: "Parol kamida 10 belgidan iborat bölsin." };

export async function POST(req) {
  if (!sameOrigin(req) || !req.headers.get("content-type")?.includes("application/json")) return json({ error: "bad" }, 400);
  if (!(await limit(`reg:${ipOf(req)}`, 5, 3600))) return json({ error: "Köp urinish. Birozdan söng qayta urining." }, 429);
  const p = schema.safeParse(await req.json().catch(() => null));
  if (!p.success) return json({ error: msg[p.error.issues[0]?.path[0]] || "Maydonlarni tekshiring." }, 400);
  const d = p.data;
  if (d.website) return json({ ok: true, verify: true });
  if (d.password !== d.confirm) return json({ error: "Parollar mos kelmadi." }, 400);
  if (!checkChallenge(d.answer, d.token)) return json({ error: "Tekshiruv javobi xato." }, 400);
  const mail = mailEnabled();
  try {
    const [u] = await sql`insert into users(email,nickname,password_hash,email_verified,group_no) values(${d.email},${d.nickname},${await hashPw(d.password)},${!mail},coalesce((select group_no from users group by group_no having count(*)<200 order by group_no limit 1),(select coalesce(max(group_no),0)+1 from users))) returning id`;
    if (!mail) { await createSession(u.id); return json({ ok: true, verify: false }); }
    const t = crypto.randomBytes(32).toString("base64url");
    await sql`insert into email_tokens(token_hash,user_id,purpose,expires_at) values(${sha256(t)},${u.id},'verify',now()+interval '24 hours')`;
    if (!(await sendVerification(d.email, t))) {
      await sql`delete from users where id=${u.id}`;
      return json({ error: "Xat yuborib bölmadi. Keyinroq urining." }, 500);
    }
    return json({ ok: true, verify: true });
  } catch (e) {
    if (e?.code === "23505") return json({ error: "Bu e-poçta yoki taxallus band." }, 409);
    return json({ error: "Xatolik. Keyinroq urinib köring." }, 500);
  }
}
