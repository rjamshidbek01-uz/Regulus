import Link from "next/link";
import { redirect } from "next/navigation";
import { sql } from "../../lib/db";
import { currentUser } from "../../lib/auth";
export const metadata = { title: "Takrorlash — Regulus" };

export default async function Review() {
  const user = await currentUser();
  if (!user) redirect("/login");
  const rows = await sql`select word_en en,word_uz uz,wrong_count w,(next_review<=now()) due from dictionary where user_id=${user.id} order by wrong_count desc, learned_at desc`;
  const mistakes = rows.filter((r) => r.w > 0);
  const due = rows.filter((r) => r.due).length;
  return (
    <main className="wrap" style={{ maxWidth: 720, paddingBottom: 56 }}>
      <h1 style={{ fontSize: 40, margin: "32px 0 16px" }}>Takrorlash</h1>
      <div className="stats">
        <div className="card"><b>{rows.length}</b><div>jami söz</div></div>
        <div className="card"><b>{due}</b><div>takrorlash vaqti</div></div>
        <div className="card"><b>{mistakes.length}</b><div>xato qilingan</div></div>
      </div>
      {rows.length === 0
        ? <div className="card"><h2>Hali söz yöq</h2><p>Birinçi darsni tugatsangiz, sözlar şu yerda takrorlash uçun paydo böladi.</p><Link className="btn" href="/learn">Darslarga</Link></div>
        : <><p>Takrorlash jonlaringizni sarflamaydi. Xato qilingan va vaqti kelgan sözlar birinçi bölib keladi (10 tagaça).</p><Link className="btn" href="/review/run">Takrorlashni boşlash</Link></>}
      {mistakes.length > 0 && <>
        <h2 style={{ margin: "36px 0 12px" }}>Xatolar daftari</h2>
        <div className="words">{mistakes.slice(0, 40).map((r) => <div className="w" key={r.en}><b>{r.en}</b><span>{r.uz}</span><small>Xato: {r.w} marta</small></div>)}</div>
      </>}
    </main>
  );
}
