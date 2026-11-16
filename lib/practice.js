import crypto from "node:crypto";
import { buildExercises, PER } from "./curriculum";

export const PRACTICE_N = 20;
export const PRACTICE_MAX_MISTAKES = 3; // 17/20 = 85%
const mac = (s) => crypto.createHmac("sha256", process.env.AUTH_SECRET).update(s).digest("hex");
const sh = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

export function buildPractice(n) {
  const pool = [];
  for (let k = 1; k <= PER; k++)
    buildExercises((n - 1) * PER + k).forEach((e) => { if (e.type !== "listen" && e.type !== "listenpick") pool.push({ ...e, part: 1 }); });
  return sh(pool).slice(0, PRACTICE_N);
}
export function signPractice(uid, n) { const iat = Date.now(); return `${iat}.${mac(`${uid}.${n}.${iat}`)}`; }
export function checkPractice(uid, n, tok) {
  const [iat, sig] = String(tok || "").split(".");
  const age = Date.now() - Number(iat);
  if (!iat || !sig || !(age > 45000 && age < 7200000)) return false;
  const w = Buffer.from(mac(`${uid}.${n}.${iat}`)), g = Buffer.from(sig);
  return w.length === g.length && crypto.timingSafeEqual(w, g);
}
