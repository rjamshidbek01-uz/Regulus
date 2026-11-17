// Checks every course's content: shape (8 words / 6 sentences per lesson, 3 lessons per chapter),
// Uzbek spelling in the app's Turkish-style alphabet, the allowed letters of each target language,
// duplicate words in a lesson, one meaning per word across a course, and that every lesson's
// exercises can be generated.   Run:  node --no-warnings scripts/validate-content.mjs
import { register } from "node:module";
register("data:text/javascript," + encodeURIComponent(
  `export async function resolve(s, c, next) { if (/^\\.{1,2}\\//.test(s) && !/\\.[mc]?js$/.test(s)) s += ".js"; return next(s, c); }`));
const { COURSES } = await import("../lib/courses/index.js");

const TARGET = {
  en: /^[A-Za-z0-9 '\-]+$/, ru: /^[А-Яа-яЁё0-9 \-]+$/, de: /^[A-Za-zÄÖÜäöüß0-9 '\-]+$/,
  fr: /^[A-Za-zÀÂÆÇÉÈÊËÎÏÔŒÙÛÜŸàâæçéèêëîïôœùûüÿ0-9 '\-]+$/, tr: /^[A-Za-zÇĞİÖŞÜçğıöşü0-9 '\-]+$/,
  it: /^[A-Za-zÀÈÉÌÒÙàèéìòù0-9 '\-]+$/, ar: /^[؀-ۿ ]+$/,
};
const sp = (x) => { const i = x.indexOf("="); return [x.slice(0, i), x.slice(i + 1)]; };
const uzBad = (u, title = false) => {
  const r = [];
  if (/sh|ch/i.test(u)) r.push("sh/ch → ş/ç");
  if (/[oOgG]['‘’`ʻ]/.test(u)) r.push("o'/g' → ö/ğ");
  if (/['‘’`ʻ]/.test(u)) r.push("apostrophe → ʼ");
  if (/(^|[\s(\-])I/.test(u)) r.push("I → İ");
  if (!title && /[cwCW]/.test(u)) r.push("c/w letter"); // titles may name English grammar (will, was/were)
  const odd = u.match(/[^A-Za-zÖöĞğŞşÇçİʼ0-9 \-–.,…?!:()]/g);
  if (odd) r.push("char " + [...new Set(odd)].join(""));
  return r;
};
let errors = 0;
for (const C of Object.values(COURSES)) {
  const errs = [], keys = new Map();
  C.units.forEach((u, ui) => {
    const ch = ui + 1;
    if (!u.t || !u.lv || !u.tip || u.l.length !== C.PER) errs.push(`ch${ch}: needs t, lv, tip and ${C.PER} lessons`);
    for (const b of uzBad(u.t, true)) errs.push(`ch${ch} title "${u.t}": ${b}`);
    u.l.forEach((l, li) => {
      const tag = `ch${ch}.${li + 1} "${l.t}"`;
      for (const b of uzBad(l.t, true)) errs.push(`${tag} title: ${b}`);
      if (l.w.length !== 8) errs.push(`${tag}: ${l.w.length} words (need 8)`);
      if (l.s.length !== 6) errs.push(`${tag}: ${l.s.length} sentences (need 6)`);
      const seenT = new Set(), seenU = new Set();
      for (const [t, z] of l.w.map(sp)) {
        if (!t || !z) { errs.push(`${tag}: empty word pair`); continue; }
        if (seenT.has(t.toLowerCase())) errs.push(`${tag}: duplicate word ${t}`); seenT.add(t.toLowerCase());
        if (seenU.has(z.toLowerCase())) errs.push(`${tag}: duplicate translation ${z}`); seenU.add(z.toLowerCase());
        if (!TARGET[C.code].test(t)) errs.push(`${tag}: unexpected letters in "${t}"`);
        for (const b of uzBad(z)) errs.push(`${tag} ${t}=${z}: ${b}`);
        const k = t.toLowerCase();
        if (keys.has(k) && keys.get(k).z !== z) errs.push(`"${t}" has two meanings: ${keys.get(k).at} ${keys.get(k).z} / ch${ch}.${li + 1} ${z}`);
        if (!keys.has(k)) keys.set(k, { z, at: `ch${ch}.${li + 1}` });
      }
      for (const s of l.s) {
        const [z, t] = sp(s);
        if (!z || !t) { errs.push(`${tag}: bad sentence "${s}"`); continue; }
        if (!TARGET[C.code].test(t)) errs.push(`${tag}: unexpected letters in "${t}"`);
        for (const b of uzBad(z)) errs.push(`${tag} "${z}": ${b}`);
        if (/\s{2}|^\s|\s$/.test(s)) errs.push(`${tag}: extra spaces in "${s}"`);
      }
    });
  });
  for (let id = 1; id <= C.TOTAL; id++) if (C.buildExercises(id).length !== 17) errs.push(`lesson ${id}: exercises could not be generated`);
  if (C.alphabet) {
    const n = C.alphabet.groups.reduce((a, g) => a + g.l.length, 0);
    const sounds = new Set(C.alphabet.groups.flatMap((g) => g.l.map((x) => x.g)));
    if (sounds.size !== n) errs.push("alphabet: duplicate letters");
    console.log(`  ${C.code}: alphabet with ${n} letters in ${C.alphabet.groups.length} groups`);
  }
  console.log(`${C.code}: ${C.units.length} chapters, ${C.TOTAL} lessons, ${C.wordCount} words — ${errs.length ? errs.length + " problem(s)" : "OK"}`);
  for (const e of errs) console.log("   - " + e);
  errors += errs.length;
}
process.exit(errors ? 1 : 0);
