"use client";
import { useState } from "react";
import Regi from "./Regi";
import Icon from "./Icon";
const say = (t, lang = "en-US") => { try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.lang = lang; u.rate = .9; speechSynthesis.speak(u); } catch {} };
const level = (r) => Math.max(0, Math.min(100, Math.round(((r.c - r.w) / 4) * 100)));

export default function Words({ rows, lang, dir }) {
  const [q, setQ] = useState("");
  const [by, setBy] = useState("new");
  const s = q.trim().toLowerCase();
  let list = rows.filter((r) => !s || r.en.toLowerCase().includes(s) || r.uz.toLowerCase().includes(s));
  if (by === "az") list = [...list].sort((a, b) => a.en.localeCompare(b.en));
  if (by === "weak") list = [...list].sort((a, b) => level(a) - level(b));
  const strong = rows.filter((r) => level(r) >= 75).length;
  if (rows.length === 0) return (
    <main className="wrap" style={{ maxWidth: 560 }}>
      <h1 className="page-h">Luğatim</h1>
      <div className="card empty"><Regi mood="think" size={120} /><h2>Luğat hali böş</h2><p>Birinçi darsni tugatsangiz, örgangan sözlar şu yerda körinadi.</p><a className="btn" href="/learn">Darsni boşlaş</a></div>
    </main>
  );
  return (
    <main className="wrap">
      <div className="dict-head">
        <h1>Luğatim</h1>
        <input className="search" placeholder="Söz qidiriş" aria-label="Söz qidiriş" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="search" style={{ maxWidth: 190 }} aria-label="Tartib" value={by} onChange={(e) => setBy(e.target.value)}>
          <option value="new">Yangilari avval</option><option value="az">A–Z</option><option value="weak">Zaiflari avval</option>
        </select>
      </div>
      <div className="stats">
        <div className="card"><b>{rows.length}</b><div>jami söz</div></div>
        <div className="card"><b>{strong}</b><div>yaxşi bilaman</div></div>
        <div className="card"><b>{rows.length - strong}</b><div>takrorlaş kerak</div></div>
      </div>
      {list.length === 0
        ? <div className="card empty"><h2>Heç narsa topilmadi</h2><p>«{q}» böyiça söz yöq.</p><button className="btn alt" onClick={() => setQ("")}>Qidiruvni tozalaş</button></div>
        : <div className="words">{list.map((r) => (
          <div className="w" key={r.en}>
            <b><span dir={dir}>{r.en}</span> <button className="icon-btn" style={{ background: "#eef0ff", color: "var(--lapis-d)" }} aria-label={`${r.en} talaffuzi`} onClick={() => say(r.en, lang)}><Icon n="sound" size={22} /></button></b>
            <span>{r.uz}</span>
            <div className="bar" aria-label={`Bilim darajasi ${level(r)}%`}><i style={{ width: `${level(r)}%` }} /></div>
            <small>{r.at}</small>
          </div>))}</div>}
    </main>
  );
}
