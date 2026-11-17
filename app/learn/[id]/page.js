import { notFound, redirect } from "next/navigation";
import { sql } from "../../../lib/db";
import { currentUser } from "../../../lib/auth";
import { getLesson, buildExercises, chapterOf, TOTAL } from "../../../lib/curriculum";
import { glossFor } from "../../../lib/glossary";
import Player from "../../components/Player";

export default async function LessonPage({ params }) {
  const user = await currentUser();
  if (!user) redirect("/login");
  const id = Number.parseInt((await params).id, 10);
  if (!getLesson(id)) notFound();
  if (user.hearts <= 0) redirect("/practice");
  if (id > 1) {
    const [p] = await sql`select 1 from lesson_progress where user_id=${user.id} and lesson_id=${id - 1}`;
    if (!p) redirect(`/learn/bolim/${chapterOf(id)}`);
  }
  const ex = buildExercises(id);
  return <Player lessonId={id} exercises={ex} hearts={user.hearts} gloss={glossFor(ex)} back={`/learn/bolim/${chapterOf(id)}`} next={id < TOTAL ? id + 1 : null} />;
}
