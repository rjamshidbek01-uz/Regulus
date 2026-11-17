import Link from "next/link";
import { redirect } from "next/navigation";
import { sql } from "../../lib/db";
import { currentUser } from "../../lib/auth";
import { courseFor } from "../../lib/courses";
import { PRACTICE_N, PRACTICE_MAX_MISTAKES } from "../../lib/practice";
export const metadata = { title: "Sinov — Regulus" };

export default async function Practice() {
  const user = await currentUser();
  if (!user) redirect("/login");
  const C = courseFor(user), UNITS = C.units, PER = C.PER;
  const [{ m }] = await sql`select coalesce(max(lesson_id),0)::int m from lesson_progress where user_id=${user.id} and course=${C.code}`;
  return (
    <main className="wrap" style={{ maxWidth: 640, paddingBottom: 56 }}>
      <h1 className="page-h">Bölim sinovi</h1>
      <p className="lead">Jonlaringiz: <b>♥ {user.hearts}</b> / 5. Har kuni yangi 5 ta jon beriladi.</p>
      <p style={{ color: "var(--on-sky-2)" }}>Sinov bölimdagi barcha darslardan {PRACTICE_N} ta savoldan iborat. Ötiş uçun kamida 85% aniqlik kerak (en köpi bilan {PRACTICE_MAX_MISTAKES} ta xato). Muvaffaqiyatli bölsa, <b>+3 jon</b> olasiz (jami 5 tagaça).</p>
      <div style={{ marginTop: 24 }}>
        {UNITS.map((u, i) => {
          const ok = i * PER + 1 <= m;
          return (
            <div className="card chap" key={i}>
              <div><span className="lv">{u.lv}</span><b>{i + 1}-bölim: {u.t}</b></div>
              {ok ? <Link className="btn sm" href={`/practice/${i + 1}`}>Boşlaş</Link> : <span aria-label="Yopiq">🔒</span>}
            </div>
          );
        })}
      </div>
    </main>
  );
}
