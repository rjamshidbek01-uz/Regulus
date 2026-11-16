import { hash, verify } from "@node-rs/argon2";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { cache } from "react";
import { sql } from "./db";

const sha = (s) => crypto.createHash("sha256").update(s).digest("hex");
export const sha256 = sha;
export const hashPw = (p) => hash(p, { memoryCost: 19456, timeCost: 2, parallelism: 1 });
export const checkPw = (h, p) => verify(h, p).catch(() => false);
let dummy;
export async function fakeCheck(p) { dummy ||= await hashPw("dummy-password"); await checkPw(dummy, p); }

export async function createSession(userId) {
  const t = crypto.randomBytes(32).toString("base64url");
  await sql`insert into sessions(token_hash,user_id,expires_at) values(${sha(t)},${userId},now()+interval '30 days')`;
  (await cookies()).set("sid", t, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 2592000 });
}
export const currentUser = cache(async () => {
  const t = (await cookies()).get("sid")?.value;
  if (!t) return null;
  const h = sha(t);
  // daily upkeep: refill lives and count today as an active day (streak)
  await sql`update users set
      hearts=case when hearts_day<(now() at time zone 'Asia/Tashkent')::date then 5 else hearts end,
      hearts_day=(now() at time zone 'Asia/Tashkent')::date,
      streak=case when last_active is null or last_active<(now() at time zone 'Asia/Tashkent')::date then (case when last_active=(now() at time zone 'Asia/Tashkent')::date-1 then streak+1 else 1 end) else streak end,
      last_active=(now() at time zone 'Asia/Tashkent')::date
    where id=(select user_id from sessions where token_hash=${h} and expires_at>now())
      and (hearts_day<(now() at time zone 'Asia/Tashkent')::date or last_active is null or last_active<(now() at time zone 'Asia/Tashkent')::date)`;
  const r = await sql`select u.id,u.nickname,u.xp,u.hearts,case when u.last_active>=(now() at time zone 'Asia/Tashkent')::date-1 then u.streak else 0 end as streak from sessions s join users u on u.id=s.user_id where s.token_hash=${h} and s.expires_at>now()`;
  return r[0] || null;
});
export async function destroySession() {
  const c = await cookies();
  const t = c.get("sid")?.value;
  if (t) await sql`delete from sessions where token_hash=${sha(t)}`;
  c.delete("sid");
}
