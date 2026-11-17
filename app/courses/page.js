import { redirect } from "next/navigation";
import { currentUser } from "../../lib/auth";
import { visibleCourses, courseFor, courseInfo, isLive } from "../../lib/courses";
import CoursePicker from "../components/CoursePicker";
export const metadata = { title: "Tillar — Regulus" };

export default async function Courses() {
  const user = await currentUser();
  if (!user) redirect("/login");
  const list = visibleCourses(user).map((c) => ({ ...courseInfo(c), chapters: c.units.length, lessons: c.TOTAL, live: isLive(c.code) }));
  return (
    <main className="wrap" style={{ maxWidth: 820, paddingBottom: 56 }}>
      <h1 className="page-h">Qaysi tilni örganamiz?</h1>
      <p className="lead">Har bir til uçun alohida xarita, luğat va takrorlaş bor. Jonlar, ball va kunlar barça tillar uçun umumiy.</p>
      <CoursePicker courses={list} current={courseFor(user).code} />
    </main>
  );
}
