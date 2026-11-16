import Link from "next/link";
import { redirect } from "next/navigation";
import { sql } from "../../lib/db";
import { currentUser } from "../../lib/auth";
import { UNITS, PER } from "../../lib/curriculum";
export const metadata = { title: "Darslar — Regulus" };

export default async function Learn() {
  const user = await currentUser();
  if (!user) redirect("/login");
  const rows = await sql`select lesson_id from lesson_progress where user_id=${user.id}`;
  const done = new Set(rows.map((r) => r.lesson_id));
  let open = true;
  const color = { done: "c2", open: "c3", locked: "c0" };
  return (
    <main className="wrap" style={{ maxWidth: 560 }}>
      {user.hearts <= 0 && <div className="card" style={{ marginTop: 28 }}><h2>Jonlar tugadi</h2><p>Ertaga yangi 5 ta jon beriladi. Hoziroq davom etish uçun bölim sinovini topshiring: 85% aniqlik va +3 jon.</p><Link className="btn" href="/practice">Sinov topshirish</Link></div>}
      {UNITS.map((u, ui) => (
        <section key={ui}>
          <div className="unit"><h2><span className="lv">{u.lv}</span>{ui + 1}-bölim: {u.t}</h2><p>{u.tip}</p></div>
          <div className="path">
            {u.l.map((l, li) => {
              const id = ui * PER + li + 1;
              const state = done.has(id) ? "done" : open ? "open" : "locked";
              if (!done.has(id)) open = false;
              return (
                <Link key={id} href={`/learn/${id}`} className={`node ${state === "locked" ? "locked" : ""}`} aria-disabled={state === "locked"} tabIndex={state === "locked" ? -1 : 0}>
                  <div className={`star ${color[state]}`}><span>{state === "done" ? "✓" : state === "locked" ? "🔒" : "▶"}</span></div>
                  <em>{l.t}</em>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </main>
  );
}
