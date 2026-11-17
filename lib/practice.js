import crypto from "node:crypto";
import { shuffle } from "./engine";

export const PRACTICE_N = 20;
export const PRACTICE_MAX_MISTAKES = 3; // 17/20 = 85%
const mac = (s) => crypto.createHmac("sha256", process.env.AUTH_SECRET).update(s).digest("hex");

// Chapter test: 20 random non-listening exercises from the chapter's lessons, in course C.
export function buildPractice(C, n) {
  const pool = [];
  for (let k = 1; k <= C.PER; k++)
    C.buildExercises((n - 1) * C.PER + k).forEach((e) => { if (e.type !== "listen" && e.type !== "listenpick") pool.push({ ...e, part: 1 }); });
  return shuffle(pool).slice(0, PRACTICE_N);
}
// The token ties a test to user + course + chapter and proves it lasted a realistic time.
const key = (uid, code, n, iat) => (code === "en" ? `${uid}.${n}.${iat}` : `${uid}.${code}.${n}.${iat}`);
export function signPractice(uid, code, n) { const iat = Date.now(); return `${iat}.${mac(key(uid, code, n, iat))}`; }
export function checkPractice(uid, code, n, tok) {
  const [iat, sig] = String(tok || "").split(".");
  const age = Date.now() - Number(iat);
  if (!iat || !sig || !(age > 45000 && age < 7200000)) return false;
  const w = Buffer.from(mac(key(uid, code, n, iat))), g = Buffer.from(sig);
  return w.length === g.length && crypto.timingSafeEqual(w, g);
}
