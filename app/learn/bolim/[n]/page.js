import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { sql } from "../../../../lib/db";
import { currentUser } from "../../../../lib/auth";
import { courseFor } from "../../../../lib/courses";
import { PRACTICE_N } from "../../../../lib/practice";
import Regi from "../../../components/Regi";
import Planet from "../../../components/Planet";
import Constellation from "../../../components/Constellation";
import WordPreview from "../../../components/WordPreview";
import Icon from "../../../components/Icon";

const num = async (params, C) => { const n = Number.parseInt((await params).n, 10); return n >= 1 && n <= C.units.length ? n : null; };
export const metadata = { title: "Bölim — Regulus" };
const LABEL = { done: "Tugatildi", open: "Oçiq", locked: "Yopiq" };

export default async function Chapter({ params }) {
  const user = await currentUser();
  if (!user) redirect("/login");
  const C = courseFor(user), UNITS = C.units, PER = C.PER, lessonWords = C.lessonWords;
  const n = await num(params, C);
  if (!n) notFound();
  const u = UNITS[n - 1], first = (n - 1) * PER + 1;
  const rows = await sql`select lesson_id from lesson_progress where user_id=${user.id} and course=${C.code}`;
  const done = new Set(rows.map((r) => r.lesson_id));
  const m = rows.reduce((a, r) => Math.max(a, r.lesson_id), 0);
  const lessons = u.l.map((l, k) => {
    const id = first + k;
    return { id, k, t: l.t, words: lessonWords(id), state: done.has(id) ? "done" : id === 1 || done.has(id - 1) ? "open" : "locked" };
  });
  const cnt = lessons.filter((l) => l.state === "done").length;
  const testOpen = first <= m;
  const out = user.hearts <= 0;
  const nodes = [
    ...lessons.map((l) => ({ state: l.state, href: `/learn/${l.id}`, label: `${l.k + 1}-dars`, aria: `${l.k + 1}-dars: ${l.t}. ${LABEL[l.state]}` })),
    { state: testOpen ? "open" : "locked", href: `/practice/${n}`, label: "Sinov", aria: `Bölim sinovi. ${testOpen ? "Oçiq" : "Yopiq"}` },
  ];

  return (
    <main className="wrap chapter" style={{ maxWidth: 820, paddingBottom: 56 }}>
      <Link href="/learn" className="back">← Yulduzlar xaritasi</Link>
      <header className="ch-head">
        <Planet n={n} size={120} state={cnt === PER ? "done" : lessons[0].state === "locked" ? "locked" : "current"} />
        <div>
          <p className="eyebrow">{n}-bölim · {u.lv}</p>
          <h1>{u.t}</h1>
          <p className="ch-meta">{cnt}/{PER} dars tugatildi</p>
        </div>
      </header>

      <div className="buddy ch-tip">
        <Regi mood="think" size={84} />
        <div className="bubble" style={{ flex: 1 }}><small>Regi maslahati</small><p>{u.tip}</p></div>
      </div>

      <div className="const-box">
        <Constellation n={n} nodes={nodes} />
      </div>

      <div className="lessons">
        {lessons.map((l) => (
          <article key={l.id} className={`lc ${l.state}`}>
            <div className="lc-h">
              <span className="lc-num">{l.state === "done" ? <Icon n="star" size={22} /> : l.k + 1}</span>
              <div className="lc-t"><small>{l.k + 1}-dars</small><h3>{l.t}</h3></div>
              <span className={`tag ${l.state}`}>{LABEL[l.state]}</span>
            </div>
            <p className="lc-sub">Bu darsda örganadigan sözlar — bosib tinglang:</p>
            <WordPreview words={l.words} lang={C.speech} dir={C.dir} />
            <div className="lc-f">
              {l.state === "locked" ? <span className="lockmsg"><Icon n="lock" size={18} />Avval oldingi darsni tugating</span>
                : out ? <Link className="btn" href="/practice">Jonlar tugadi — sinov topşiring</Link>
                : <Link className={`btn ${l.state === "done" ? "alt" : ""}`} href={`/learn/${l.id}`}>{l.state === "done" ? "Qayta öqiş" : "Darsni boşlaş"}</Link>}
            </div>
          </article>
        ))}
        <article className={`lc test ${testOpen ? "open" : "locked"}`}>
          <div className="lc-h">
            <span className="lc-num"><Icon n="trophy" size={22} /></span>
            <div className="lc-t"><small>Bölim sinovi</small><h3>{PRACTICE_N} ta savol</h3></div>
          </div>
          <p className="lc-sub">Bölimdagi barça darslardan savollar. 85% aniqlik bilan ötsangiz, <b>+3 jon</b> olasiz.</p>
          <div className="lc-f">{testOpen ? <Link className="btn blue" href={`/practice/${n}`}>Sinovni boşlaş</Link> : <span className="lockmsg"><Icon n="lock" size={18} />Birinçi darsdan keyin oçiladi</span>}</div>
        </article>
      </div>

      <nav className="ch-nav" aria-label="Bölimlar">
        {n > 1 ? <Link className="btn alt" href={`/learn/bolim/${n - 1}`}>← {n - 1}-bölim</Link> : <span />}
        {n < UNITS.length && <Link className="btn alt" href={`/learn/bolim/${n + 1}`}>{n + 1}-bölim →</Link>}
      </nav>
    </main>
  );
}
