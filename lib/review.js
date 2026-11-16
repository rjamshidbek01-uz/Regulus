import { TOTAL, lessonWords } from "./curriculum";
const sh = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
let pool;
const allWords = () => pool || (pool = Array.from({ length: TOTAL }, (_, i) => lessonWords(i + 1)).flat());

export function buildReview(rows) {
  const all = allWords();
  return rows.map((r) => {
    const to = Math.random() < 0.5 ? "en" : "uz";
    const correct = to === "en" ? r.word_en : r.word_uz;
    const question = to === "en" ? r.word_uz : r.word_en;
    const others = [...new Set(sh(all.filter((w) => w[to] !== correct)).slice(0, 2).map((w) => w[to]))];
    const options = sh([correct, ...others]);
    return { part: 1, type: "choice", data: { prompt: "Töğri tarjimani tanlang", question, options, answer: options.indexOf(correct), word: r.word_en } };
  });
}
