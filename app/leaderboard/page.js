import { redirect } from "next/navigation";
import { sql } from "../../lib/db";
import { currentUser } from "../../lib/auth";
export const metadata = { title: "Reyting — Regulus" };

export default async function Board() {
  const user = await currentUser();
  if (!user) redirect("/login");
  const [me] = await sql`select group_no,xp from users where id=${user.id}`;
  const top = await sql`select id,nickname,xp,(case when last_active>=(now() at time zone 'Asia/Tashkent')::date-1 then streak else 0 end) as streak from users where group_no=${me.group_no} order by xp desc, created_at asc limit 50`;
  const [{ n }] = await sql`select count(*)::int n from users where group_no=${me.group_no}`;
  const inTop = top.some((r) => r.id === user.id);
  const [{ r }] = await sql`select (count(*)+1)::int r from users where group_no=${me.group_no} and (xp>${me.xp} or (xp=${me.xp} and created_at<(select created_at from users where id=${user.id})))`;
  return (
    <main className="wrap">
      <div className="dict-head"><h1>Reyting</h1><span>{me.group_no}-guruh · {n}/200 kişi</span></div>
      <table className="board">
        <thead><tr><th>Örin</th><th>Taxallus</th><th>Kunlar</th><th style={{ textAlign: "right" }}>Ball</th></tr></thead>
        <tbody>
          {top.map((u, i) => (
            <tr key={u.id} className={`${u.id === user.id ? "me" : ""} ${i === 0 ? "top1" : ""}`}>
              <td>{i + 1}</td><td>{u.nickname}</td><td>🔥 {u.streak}</td><td>{u.xp}</td>
            </tr>
          ))}
          {!inTop && <tr className="me"><td>{r}</td><td>{user.nickname}</td><td>🔥 {user.streak}</td><td>{me.xp}</td></tr>}
        </tbody>
      </table>
      <p style={{ paddingBottom: 48 }}>Guruhda 200 kişi tölsa, yangi foydalanuvçilar keyingi guruhga qöşiladi. Har guruhda reyting alohida hisoblanadi.</p>
    </main>
  );
}
