"use client";
import { useState } from "react";
const say = (t) => { try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.lang = "en-US"; u.rate = .9; speechSynthesis.speak(u); } catch {} };
const level = (r) => Math.max(0, Math.min(100, Math.round(((r.c - r.w) / 4) * 100)));

export default function Words({ rows }) {
  const [q, setQ] = useState("");
  const [by, setBy] = useState("new");
  const s = q.trim().toLowerCase();
  let list = rows.filter((r) => !s || r.en.toLowerCase().includes(s) || r.uz.toLowerCase().includes(s));
  if (by === "az") list = [...list].sort((a, b) => a.en.localeCompare(b.en));
  if (by === "weak") list = [...list].sort((a, b) => level(a) - level(b));
  const strong = rows.filter((r) => level(r) >= 75).length;
  return (
    <main className="wrap">
      <div className="dict-head">
        <h1>Luğatim</h1>
        <input className="search" placeholder="Söz qidirish" aria-label="Söz qidirish" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="search" style={{ maxWidth: 180 }} aria-label="Tartib" value={by} onChange={(e) => setBy(e.target.value)}>
          <option value="new">Yangilari avval</option><option value="az">A–Z</option><option value="weak">Zaiflari avval</option>
        </select>
      </div>
      <div className="stats">
        <div className="card"><b>{rows.length}</b><div>jami söz</div></div>
        <div className="card"><b>{strong}</b><div>yaxşi bilaman</div></div>
        <div className="card"><b>{rows.length - strong}</b><div>takrorlash kerak</div></div>
      </div>
      {rows.length === 0 ? <div className="card"><h2>Luğat hali bosh</h2><p>Birinçi darsni tugatsangiz, örgangan sözlar şu yerda körinadi.</p><a className="btn" href="/learn">Darsni boşlash</a></div>
      : <div className="words">{list.map((r) => (
        <div className="w" key={r.en}>
          <b>{r.en} <button className="btn alt sm" aria-label={`${r.en} talaffuzi`} onClick={() => say(r.en)}>🔊</button></b>
          <span>{r.uz}</span>
          <div className="bar" aria-label={`Bilim darajasi ${level(r)}%`}><i style={{ width: `${level(r)}%` }} /></div>
          <small>{r.at}</small>
        </div>))}</div>}
    </main>
  );
}
