import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "../lib/auth";
import Regi from "./components/Regi";
import Icon from "./components/Icon";
import { Tilt } from "./components/Fx";
import { UNITS, TOTAL, WORD_COUNT } from "../lib/curriculum";

const sats = [["Hello", "#fff", "#c6cee6"], ["Salom", "#ffbf2f", "#d88c00"], ["Star", "#17c3b2", "#0c8f83"], ["Yulduz", "#fff", "#c6cee6"], ["Friend", "#ff8fa3", "#d9566f"], ["Döst", "#ffbf2f", "#d88c00"]];
const feats = [
  ["chat", "#5468ff", "#3443c4", "Özbek tilida tuşuntiriş", "Qoidalar va maslahatlar ona tilingizda: artikl, söz tartibi, talaffuz."],
  ["book", "#17c3b2", "#0c8f83", "Luğatim", "Örgangan har bir söz avtomatik yiğiladi va qançalik eslab qolganingiz körsatiladi."],
  ["flame", "#ff8a3d", "#c9601a", "Kunlik odat", "Ketma-ket kunlar va tajriba ballari sizni har kuni qaytarib keladi."],
];

export default async function Welcome() {
  if (await currentUser().catch(() => null)) redirect("/learn");
  return (
    <main className="wrap">
      <section className="hero">
        <div>
          <p className="eyebrow">Regulus</p>
          <h1>İngliz tilini <b>özbek tilida</b> örganing</h1>
          <p>Har kuni bir neça daqiqa. Qisqa darslar, eşitib yoziş, juft topiş va öz luğatingiz. Yoningizda esa doim döstingiz — şerça Regi.</p>
          <ul className="hstats"><li><b>{UNITS.length}</b>bölim</li><li><b>{TOTAL}</b>dars</li><li><b>{Math.floor(WORD_COUNT / 100) * 100}+</b>söz</li><li><b>A1–B2</b>daraja</li></ul>
          <div className="row">
            <Link className="btn big" href="/register">Bepul boşlaş</Link>
            <Link className="btn big alt" href="/login">Hisobim bor</Link>
          </div>
        </div>
        <Tilt className="scene">
          <div className="stage" aria-hidden="true">
            <div className="planet" />
            <i className="spark" style={{ left: -10, top: 40 }} /><i className="spark" style={{ right: -6, top: 150, animationDelay: ".6s", width: 16, height: 16 }} /><i className="spark" style={{ left: 30, bottom: 30, animationDelay: "1.1s", width: 14, height: 14 }} />
            <Regi mood="wave" size={210} className="float" />
            <div className="orbit-tilt"><div className="orbit">
              {sats.map(([t, c, cd], i) => <div key={t} className="sat" style={{ "--a": `${i * 60}deg` }}><span style={{ "--c": c, "--cd": cd }}>{t}</span></div>)}
            </div></div>
          </div>
        </Tilt>
      </section>

      <section className="feats">
        {feats.map(([ic, c, d, t, p]) => (
          <div className="card" key={t}><div className="feat-ic" style={{ background: c, "--d": d }}><Icon n={ic} /></div><h3>{t}</h3><p>{p}</p></div>
        ))}
      </section>

      <h2 className="sec-h">Qanday işlaydi?</h2>
      <section className="how">
        <div><b>Darsni tanlang</b><span>Har bir dars 4 qismdan iborat va bir neça daqiqa davom etadi.</span></div>
        <div><b>Regi bilan maşq qiling</b><span>Sözlarni tanlang, eşiting va gap tuzing. Regi sizni qöllab turadi.</span></div>
        <div><b>Yulduzlarni yiğing</b><span>Ball töplang, kunlar zanjirini uzmang va reytingda kötariling.</span></div>
      </section>

      <section className="cta-band">
        <Regi mood="cheer" size={96} head />
        <h2>Birinçi darsni hoziroq boşlaymizmi?</h2>
        <Link className="btn big" href="/register">Bepul boşlaş</Link>
      </section>
    </main>
  );
}
