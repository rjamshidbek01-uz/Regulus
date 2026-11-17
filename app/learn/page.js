import Link from "next/link";
import { redirect } from "next/navigation";
import { sql } from "../../lib/db";
import { currentUser } from "../../lib/auth";
import { courseFor, visibleCourses } from "../../lib/courses";
import Regi from "../components/Regi";
import Planet from "../components/Planet";
import MapView from "../components/MapView";
export const metadata = { title: "Yulduzlar xaritasi — Regulus" };

function Ring({ value, total }) {
  const r = 46, c = 2 * Math.PI * r, p = total ? value / total : 0;
  return (
    <div className="ring-p" role="img" aria-label={`${value} / ${total} dars tugatildi`}>
      <svg viewBox="0 0 110 110" aria-hidden="true"><circle cx="55" cy="55" r={r} className="bg" /><circle cx="55" cy="55" r={r} className="fg" style={{ strokeDasharray: c, strokeDashoffset: c * (1 - p) }} /></svg>
      <span><b>{value}</b>/{total}<small>dars</small></span>
    </div>
  );
}

export default async function Learn() {
  const user = await currentUser();
  if (!user) redirect("/login");
  const C = courseFor(user), UNITS = C.units, PER = C.PER, TOTAL = C.TOTAL, WORLDS = C.worlds, chapterOf = C.chapterOf;
  const many = visibleCourses(user).length > 1;
  const rows = await sql`select lesson_id from lesson_progress where user_id=${user.id} and course=${C.code}`;
  const done = new Set(rows.map((r) => r.lesson_id));
  let next = null;
  for (let id = 1; id <= TOTAL; id++) if (!done.has(id) && (id === 1 || done.has(id - 1))) { next = id; break; }
  const cur = next ? chapterOf(next) : UNITS.length;
  const chapters = UNITS.map((u, i) => {
    const n = i + 1, first = i * PER + 1;
    const cnt = [0, 1, 2].filter((k) => done.has(first + k)).length;
    const state = cnt === PER ? "done" : next && n === cur ? "current" : cnt > 0 || first === 1 || done.has(first - 1) ? "open" : "locked";
    return { n, t: u.t, lv: u.lv, done: cnt, state };
  });
  const worlds = WORLDS.map((w) => {
    const cs = chapters.filter((c) => c.n >= w.from && c.n <= w.to);
    return { ...w, done: cs.reduce((a, c) => a + c.done, 0), total: cs.length * PER, locked: cs[0].state === "locked" };
  });
  const start = Math.max(0, WORLDS.findIndex((w) => cur >= w.from && cur <= w.to));
  const out = user.hearts <= 0, all = !next;
  const U = next ? UNITS[cur - 1] : null, L = next ? U.l[(next - 1) % PER] : null;

  return (
    <main className="wrap" style={{ paddingBottom: 56 }}>
      <section className="mission">
        <Regi mood={out ? "sleep" : all ? "cheer" : "wave"} size={128} className="m-regi" />
        <div className="m-body">
          {many && <Link className="course-chip" href="/courses">{C.name} · tilni almaştiriş</Link>}
          <p className="eyebrow">{out ? "Jonlar tugadi" : all ? "Barça bölimlar tugadi" : done.size ? "Keyingi missiya" : "Birinçi missiya"}</p>
          <h1>{out ? "Regi biroz dam olyapti" : all ? `Barakalla, ${user.nickname}!` : `Salom, ${user.nickname}!`}</h1>
          {out ? <p>Ertaga yangi 5 ta jon beriladi. Hoziroq davom etiş uçun bölim sinovini topşiring: 85% aniqlik — +3 jon.</p>
            : all ? <p>Siz Regulus yulduziga yetib keldingiz. Sözlarni takrorlab turing!</p>
            : <div className="m-next"><Planet n={cur} size={44} state="current" /><span><small>{cur}-bölim · {U.t}</small><b>{(next - 1) % PER + 1}-dars: {L.t}</b></span></div>}
          <div className="row">
            {out ? <Link className="btn big" href="/practice">Sinov topşiriş</Link>
              : next && <Link className="btn big" href={`/learn/${next}`}>{done.size ? "Davom etiş" : "Boşlaş"}</Link>}
            {next && <Link className="btn big alt" href={`/learn/bolim/${cur}`}>Bölimni körish</Link>}
          </div>
        </div>
        <Ring value={done.size} total={TOTAL} />
      </section>

      {C.alphabet && (
        <Link className="abc-card" href="/alphabet">
          <span className="abc-glyph" dir={C.dir} aria-hidden="true">{C.alphabet.groups[0].l.slice(0, 3).map((x) => x.g.split(" ")[0]).join(" ")}</span>
          <span><b>{C.alphabet.title}</b>Darslardan oldin harflarni örganing: har bir harf, uning tovuşi va misol söz.</span>
          <span className="btn sm">Oçiş</span>
        </Link>
      )}

      <div className="map-h">
        <h2>Yulduzlar xaritasi</h2>
        <p>{C.name}: {UNITS.length} ta bölim — {UNITS.length} ta sayyora. Har birida 3 ta dars va bitta sinov. Sayyorani bosing va sözlarni oldindan köring.</p>
      </div>
      <MapView worlds={worlds} chapters={chapters} start={start} />
    </main>
  );
}
