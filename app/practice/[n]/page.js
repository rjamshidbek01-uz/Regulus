import { notFound, redirect } from "next/navigation";
import { sql } from "../../../lib/db";
import { currentUser } from "../../../lib/auth";
import { courseFor, courseInfo } from "../../../lib/courses";
import { buildPractice, signPractice, PRACTICE_MAX_MISTAKES } from "../../../lib/practice";
import { glossFor } from "../../../lib/glossary";
import Player from "../../components/Player";

export default async function PracticeRun({ params }) {
  const user = await currentUser();
  if (!user) redirect("/login");
  const C = courseFor(user);
  const n = Number.parseInt((await params).n, 10);
  if (!(n >= 1 && n <= C.units.length)) notFound();
  const [{ m }] = await sql`select coalesce(max(lesson_id),0)::int m from lesson_progress where user_id=${user.id} and course=${C.code}`;
  if ((n - 1) * C.PER + 1 > m) redirect("/practice");
  const ex = buildPractice(C, n);
  return <Player lessonId={0} exercises={ex} gloss={glossFor(ex, C)} course={courseInfo(C)} practice={{ n, token: signPractice(user.id, C.code, n), allowed: PRACTICE_MAX_MISTAKES }} back={`/learn/bolim/${n}`} />;
}
