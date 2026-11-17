// Generic lesson engine: turns a course's chapters into lessons and exercises.
// Course content format (same for every language):
//   w: "Target=Özbekça" (8 words), s: "Özbekça=Target" (6 sentences, no punctuation).
//   Sentences 0-1 -> listening, 2-3 -> uz->target, 4-5 -> target->uz.
// In exercises and the dictionary the target-language text is kept under the key `en`
// (historical name from when Regulus only taught English).
export const PER = 3;
export const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
export const pair = (x) => { const i = x.indexOf("="); return [x.slice(0, i), x.slice(i + 1)]; };

const GALAXIES = [
  ["Orion", "İlk qadamlar"], ["Andromeda", "Kundalik hayot"], ["Pleyadalar", "Erkin muloqot"], ["Arslon", "Regulus sari"],
  ["Lira", "Yangi ufqlar"], ["Kassiopeya", "Ustalik"],
];
export function makeWorlds(chapters) {
  const out = [];
  for (let from = 1, i = 0; from <= chapters; from += 20, i++) {
    const [name, sub] = GALAXIES[i % GALAXIES.length];
    out.push({ name, sub, from, to: Math.min(from + 19, chapters) });
  }
  return out;
}

export function makeCourse(cfg) {
  const units = cfg.units;
  const TOTAL = units.length * PER;
  const getLesson = (id) => (!Number.isInteger(id) || id < 1 || id > TOTAL ? null : units[Math.floor((id - 1) / PER)].l[(id - 1) % PER]);
  const lessonWords = (id) => { const L = getLesson(id); return L ? L.w.map((x) => { const [en, uz] = pair(x); return { en, uz }; }) : []; };
  const chapterOf = (lessonId) => Math.ceil(lessonId / PER);
  let all;
  const allWords = () => all || (all = Array.from({ length: TOTAL }, (_, i) => lessonWords(i + 1)).flat());

  function buildExercises(id) {
    const L = getLesson(id);
    if (!L) return [];
    const W = lessonWords(id);
    const S = L.s.map((x) => { const [uz, en] = pair(x); return { uz, en }; });
    const enT = [...new Set(S.flatMap((s) => s.en.split(" ")))];
    const uzT = [...new Set(S.flatMap((s) => s.uz.split(" ")))];
    const bank = (ans, pool) => [...ans, ...shuffle(pool.filter((t) => !ans.includes(t))).slice(0, 2)];
    const pick = (w, to) => {
      const options = shuffle([w[to], ...shuffle(W.filter((x) => x !== w && x[to] !== w[to])).slice(0, 2).map((x) => x[to])]);
      return { options, answer: options.indexOf(w[to]) };
    };
    const E = [];
    const add = (part, type, data) => E.push({ part, type, data });
    const OK = "Töğri tarjimani tanlang";
    // First a card that introduces all 8 new words with their translation and audio.
    add(1, "intro", { prompt: "Yangi sözlar — avval tanişib oling", words: W });
    W.slice(4).forEach((w) => add(1, "choice", { prompt: OK, question: w.uz, word: w.en, ...pick(w, "en") }));
    add(1, "match", { prompt: "Juftliklarni toping", pairs: W.slice(0, 4).map((w) => [w.en, w.uz]) });
    [S[0], S[1]].forEach((s) => add(2, "listen", { prompt: "Eşitganingizni yozing", text: s.en, tr: s.uz, words: bank(s.en.split(" "), enT), answer: s.en.split(" ") }));
    [W[0], W[1]].forEach((w) => add(2, "listenpick", { prompt: "Eşitgan söz tarjimasini tanlang", text: w.en, word: w.en, ...pick(w, "uz") }));
    [S[2], S[3]].forEach((s) => add(3, "build", { prompt: `${cfg.into} tarjima qiling`, source: s.uz, from: "uz", words: bank(s.en.split(" "), enT), answer: s.en.split(" ") }));
    [W[2], W[3]].forEach((w) => add(3, "choice", { prompt: OK, question: w.en, word: w.en, ...pick(w, "uz") }));
    add(4, "match", { prompt: "Juftliklarni toping", pairs: W.slice(4).map((w) => [w.en, w.uz]) });
    [S[4], S[5]].forEach((s) => add(4, "build", { prompt: "Özbek tiliga tarjima qiling", source: s.en, words: bank(s.uz.split(" "), uzT), answer: s.uz.split(" ") }));
    return E;
  }

  return {
    ...cfg, units, PER, TOTAL, getLesson, lessonWords, chapterOf, buildExercises, allWords,
    worlds: cfg.worlds || makeWorlds(units.length),
    wordCount: new Set(units.flatMap((u) => u.l.flatMap((l) => l.w.map((x) => pair(x)[0].toLowerCase())))).size,
  };
}
