import { notFound, redirect } from "next/navigation";
import { sql } from "../../../lib/db";
import { currentUser } from "../../../lib/auth";
import { courseFor, courseInfo } from "../../../lib/courses";
import { glossFor } from "../../../lib/glossary";
import Player from "../../components/Player";

export default async function LessonPage({ params }) {
  const user = await currentUser();
  if (!user) redirect("/login");
  const C = courseFor(user);
  const id = Number.parseInt((await params).id, 10);
  if (!C.getLesson(id)) notFound();
  if (user.hearts <= 0) redirect("/practice");
  if (id > 1) {
    const [p] = await sql`select 1 from lesson_progress where user_id=${user.id} and course=${C.code} and lesson_id=${id - 1}`;
    if (!p) redirect(`/learn/bolim/${C.chapterOf(id)}`);
  }
  const ex = C.buildExercises(id);
  return <Player lessonId={id} exercises={ex} hearts={user.hearts} gloss={glossFor(ex, C)} course={courseInfo(C)} back={`/learn/bolim/${C.chapterOf(id)}`} next={id < C.TOTAL ? id + 1 : null} />;
}
