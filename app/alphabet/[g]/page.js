import { notFound, redirect } from "next/navigation";
import { currentUser } from "../../../lib/auth";
import { courseFor, courseInfo } from "../../../lib/courses";
import { shuffle } from "../../../lib/engine";
import Player from "../../components/Player";
export const metadata = { title: "Alifbo maşqi — Regulus" };

// Letter practice for one group: "how is this letter read?" and "which letter did you hear?".
// Runs as a drill: no lives are used and nothing is saved.
export default async function AlphabetDrill({ params }) {
  const user = await currentUser();
  if (!user) redirect("/login");
  const C = courseFor(user);
  if (!C.alphabet) redirect("/learn");
  const abc = C.alphabet, gi = Number.parseInt((await params).g, 10);
  const group = abc.groups[gi - 1];
  if (!group) notFound();
  const all = abc.groups.flatMap((g) => g.l);
  const opts = (right, key) => {
    const others = shuffle([...new Set(all.map((x) => x[key]).filter((v) => v !== right[key]))]).slice(0, 2);
    const options = shuffle([right[key], ...others]);
    return { options, answer: options.indexOf(right[key]) };
  };
  const ex = shuffle(group.l.flatMap((x) => [
    { part: 1, type: "choice", data: { prompt: "Bu harf qanday öqiladi?", question: x.g, big: true, word: x.g, ...opts(x, "sound") } },
    { part: 1, type: "listenpick", data: { prompt: "Eşitgan harfni tanlang", text: abc.rtl ? x.g : x.name, word: x.g, ...opts(x, "g") } },
  ])).slice(0, 16);
  return <Player lessonId={0} exercises={ex} course={courseInfo(C)} drill={{ title: `${abc.title} · ${group.t}`, back: "/alphabet", again: `/alphabet/${gi}` }} />;
}
