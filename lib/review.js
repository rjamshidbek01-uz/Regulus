import { shuffle } from "./engine";

// Review questions from the user's dictionary rows (word_en = target-language word) in course C.
export function buildReview(rows, C) {
  const all = C.allWords();
  return rows.map((r) => {
    const to = Math.random() < 0.5 ? "en" : "uz";
    const correct = to === "en" ? r.word_en : r.word_uz;
    const question = to === "en" ? r.word_uz : r.word_en;
    const others = [...new Set(shuffle(all.filter((w) => w[to] !== correct)).slice(0, 2).map((w) => w[to]))];
    const options = shuffle([correct, ...others]);
    return { part: 1, type: "choice", data: { prompt: "Töğri tarjimani tanlang", question, options, answer: options.indexOf(correct), word: r.word_en } };
  });
}
