import crypto from "node:crypto";
import { sql } from "./db";

export async function limit(key, max, sec) {
  const r = await sql`insert into rate_limits(key,count,window_start) values(${key},1,now())
    on conflict(key) do update set
      count = case when rate_limits.window_start < now() - make_interval(secs => ${sec}::float8) then 1 else rate_limits.count + 1 end,
      window_start = case when rate_limits.window_start < now() - make_interval(secs => ${sec}::float8) then now() else rate_limits.window_start end
    returning count`;
  return r[0].count <= max;
}
export const ipOf = (req) => (req.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();
export function sameOrigin(req) {
  const o = req.headers.get("origin"), h = req.headers.get("host");
  if (!o || !h) return false;
  try { return new URL(o).host === h; } catch { return false; }
}
const secret = () => process.env.AUTH_SECRET;
const mac = (s) => crypto.createHmac("sha256", secret()).update(s).digest("hex");
export function newChallenge() {
  const a = 2 + crypto.randomInt(8), b = 2 + crypto.randomInt(8);
  const sub = crypto.randomInt(2) === 1 && a > b;
  const ans = sub ? a - b : a + b, exp = Date.now() + 300000;
  return { q: `${a} ${sub ? "−" : "+"} ${b} = ?`, token: `${exp}.${mac(`${ans}.${exp}`)}` };
}
export function checkChallenge(answer, token) {
  const [exp, sig] = String(token || "").split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  const n = String(parseInt(answer, 10));
  const want = Buffer.from(mac(`${n}.${exp}`)), got = Buffer.from(sig);
  return want.length === got.length && crypto.timingSafeEqual(want, got);
}
export async function sendVerification(email, token) {
  if (!process.env.RESEND_API_KEY) return false;
  const url = `${process.env.APP_URL}/api/verify?t=${token}`;
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.MAIL_FROM, to: email, subject: "E-poçtani tasdiqlang",
      html: `<p>Hisobingizni tasdiqlash uçun havolani bosing:</p><p><a href="${url}">${url}</a></p><p>Havola 24 soat amal qiladi.</p>` }),
  });
  return r.ok;
}
export const json = (o, status = 200) => Response.json(o, { status, headers: { "Cache-Control": "no-store" } });
