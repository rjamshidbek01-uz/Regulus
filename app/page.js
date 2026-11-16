import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "../lib/auth";

const tiles = [["Hello","c1"],["Salom","c2"],["Water","c3"],["Suv","c4"],["Thank you","c2"],["Rahmat","c1"],["Bread","c4"],["Non","c3"],["Yes","c1"]];

export default async function Welcome() {
  if (await currentUser().catch(() => null)) redirect("/learn");
  return (
    <main className="wrap">
      <section className="hero">
        <div>
          <p className="eyebrow">Regulus</p>
          <h1>İngliz tilini özbek tilida örganing</h1>
          <p>Har kuni bir necha daqiqa. Qisqa darslar, eşitib yozish, juft topish va öz luğatingiz — hammasi özbek tilida tushuntiriladi.</p>
          <div className="row">
            <Link className="btn" href="/register">Bepul boşlash</Link>
            <Link className="btn alt" href="/login">Hisobim bor</Link>
          </div>
        </div>
        <div className="tiles" aria-hidden="true">
          {tiles.map(([t, c], i) => <div key={i} className={`star ${c}`}><span>{t}</span></div>)}
        </div>
      </section>
      <section className="feats">
        <div className="card"><h3>Özbek tilida tushuntirish</h3><p>Qoidalar va maslahatlar ona tilingizda: artikl, söz tartibi, talaffuz.</p></div>
        <div className="card"><h3>Luğatim</h3><p>Örgangan har bir söz avtomatik yiğiladi va qançalik eslab qolganingiz körsatiladi.</p></div>
        <div className="card"><h3>Kunlik odat</h3><p>Ketma-ket kunlar va tajriba ballari sizni har kuni qaytarib keladi.</p></div>
      </section>
    </main>
  );
}
