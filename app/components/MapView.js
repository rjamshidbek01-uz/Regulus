"use client";
import { useState } from "react";
import Link from "next/link";
import Planet from "./Planet";

const STATE_LABEL = { done: "Tugatildi", current: "Siz şu yerdasiz", open: "Oçiq", locked: "Yopiq" };

export default function MapView({ worlds, chapters, start }) {
  const [w, setW] = useState(start);
  const W = worlds[w];
  const list = chapters.filter((c) => c.n >= W.from && c.n <= W.to);
  return (
    <section className="galaxy" aria-label="Yulduzlar xaritasi">
      <div className="worlds" role="tablist" aria-label="Galaktikalar">
        {worlds.map((x, i) => {
          const pct = Math.round((x.done / x.total) * 100);
          return (
            <button key={x.name} role="tab" aria-selected={i === w} className={`world ${i === w ? "on" : ""} ${x.locked ? "dim" : ""}`} onClick={() => setW(i)}>
              <span className="wn">{x.name}</span>
              <span className="ws">{x.sub}</span>
              <span className="wbar"><i style={{ "--p": x.done / x.total }} /></span>
              <span className="wp">{x.done}/{x.total} dars · {pct}%</span>
            </button>
          );
        })}
      </div>
      <div className="planets" role="tabpanel" key={w}>
        {list.map((c, i) => (
          <Link key={c.n} href={`/learn/bolim/${c.n}`} className={`pc ${c.state}`} style={{ "--d": `${Math.min(i, 12) * 30}ms` }} aria-label={`${c.n}-bölim: ${c.t}. ${STATE_LABEL[c.state]}`}>
            {c.state === "current" && <span className="here">Siz şu yerdasiz</span>}
            <Planet n={c.n} size={78} state={c.state} />
            <span className="pc-n">{c.n}-bölim<em>{c.lv}</em></span>
            <b className="pc-t">{c.t}</b>
            <span className="pips" aria-hidden="true">{[0, 1, 2].map((k) => <i key={k} className={k < c.done ? "on" : ""} />)}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
