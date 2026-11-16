import Link from "next/link";
import { redirect } from "next/navigation";
import { sql } from "../../lib/db";
import { currentUser } from "../../lib/auth";
import { UNITS, PER, TOTAL } from "../../lib/curriculum";
import Regi from "../components/Regi";
import Icon from "../components/Icon";
export const metadata = { title: "Darslar — Regulus" };

const HUES = [["#4551e0", "#2c36ad"], ["#0a8377", "#065e55"], ["#d42f52", "#9f1f3a"], ["#7d47e6", "#5a2db8"], ["#c2570a", "#8f3f05"]];
const DX = [0, -52, 52];

export default async function Learn() {
  const user = await currentUser();
  if (!user) redirect("/login");
  const rows = await sql`select lesson_id from lesson_progress where user_id=${user.id}`;
  const done = new Set(rows.map((r) => r.lesson_id));
  const out = user.hearts <= 0;
  const all = done.size >= TOTAL;
  let open = true;
  return (
    <main className="wrap" style={{ maxWidth: 600, paddingBottom: 48 }}>
      <div className="greet">
        <Regi mood={out ? "sleep" : all ? "cheer" : "wave"} size={92} />
        <div className="bubble">
          <b>{out ? "Jonlar tugadi" : `Salom, ${user.nickname}!`}</b>
          {out ? "Ertaga yangi 5 ta jon beriladi. Hoziroq davom etiş uçun bölim sinovini topşiring: 85% aniqlik — +3 jon."
            : all ? "Barça darslarni tugatdingiz. Barakalla! Sözlarni takrorlab turing."
            : done.size ? `${done.size} ta dars tugatildi. Davom etamizmi?` : "Men Regi. Birinçi darsni birga boşlaymiz!"}
          {out && <div style={{ marginTop: 12 }}><Link className="btn sm" href="/practice">Sinov topşiriş</Link></div>}
        </div>
      </div>
      {UNITS.map((u, ui) => {
        const [c, cd] = HUES[ui % HUES.length];
        const n = u.l.filter((_, li) => done.has(ui * PER + li + 1)).length;
        return (
          <section key={ui}>
            <div className="unit" style={{ "--u": c, "--ud": cd }}>
              <div><h2><span className="lv">{u.lv}</span>{ui + 1}-bölim: {u.t}</h2><p>{u.tip}</p></div>
              <span className="count" aria-label={`${n}/${u.l.length} dars tugatildi`}>{n}/{u.l.length}</span>
            </div>
            <div className="path">
              {u.l.map((l, li) => {
                const id = ui * PER + li + 1;
                const state = done.has(id) ? "done" : open ? "open" : "locked";
                if (!done.has(id)) open = false;
                const dx = DX[(id - 1) % 3];
                return (
                  <Link key={id} href={`/learn/${id}`} className={`node ${state}`} style={{ "--dx": `${dx}px` }} aria-disabled={state === "locked"} tabIndex={state === "locked" ? -1 : 0}>
                    <span className="orb"><Icon n={state === "done" ? "star" : state === "locked" ? "lock" : "play"} /></span>
                    <em>{l.t}</em>
                    {state === "open" && !out && <span className={`side ${dx > 0 ? "l" : "r"}`} aria-hidden="true"><span className="bubble sm down">Boşladik!</span><Regi mood="happy" size={74} /></span>}
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </main>
  );
}
