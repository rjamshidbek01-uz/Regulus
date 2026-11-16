"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Md from "./Md";

const NAMES = ["Sözlar", "Eşitish", "Tarjima", "Takrorlash"];
const isListen = (e) => e.type === "listen" || e.type === "listenpick";
const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const prep = (e) => {
  const d = e.data;
  if (e.type === "choice" || e.type === "listenpick") return { opts: shuffle(d.options.map((t, o) => ({ t, o }))) };
  if (e.type === "match") return { L: shuffle(d.pairs.map((p, k) => ({ t: p[0], k }))), R: shuffle(d.pairs.map((p, k) => ({ t: p[1], k }))) };
  return { words: shuffle(d.words.map((t, k) => ({ t, k }))) };
};
const say = (t) => { try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.lang = "en-US"; u.rate = .9; speechSynthesis.speak(u); } catch {} };
const muted = () => { try { return Number(localStorage.getItem("nolisten") || 0) > Date.now(); } catch { return false; } };
const clean = (t) => t.toLowerCase().replace(/[.,!?;:]/g, "");
function Hov({ s, G }) {
  if (!s) return null;
  const whole = G[clean(s)];
  if (whole) return <span className="tip" tabIndex={0} data-t={whole}>{s}</span>;
  return s.split(" ").map((t, i, a) => { const v = G[clean(t)]; return <span key={i}>{v ? <span className="tip" tabIndex={0} data-t={v}>{t}</span> : t}{i < a.length - 1 ? " " : ""}</span>; });
}
const post = (url, body) => fetch(url, { method: "POST", keepalive: true, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body || {}) }).catch(() => null);

export default function Player({ lessonId, exercises, hearts: h0 = 5, practice, review, gloss }) {
  const [list, setList] = useState(null);
  const [P, setP] = useState(null);
  const [i, setI] = useState(0);
  const [hearts, setHearts] = useState(h0);
  const hRef = useRef(h0);
  const mRef = useRef(0);
  const [mist, setMist] = useState(0);
  const [dead, setDead] = useState(false);
  const [wrong, setWrong] = useState([]);
  const [sel, setSel] = useState(null);
  const [built, setBuilt] = useState([]);
  const [left, setLeft] = useState(null);
  const [done, setDone] = useState([]);
  const [bad, setBad] = useState(null);
  const [fb, setFb] = useState(null);
  const [end, setEnd] = useState(null);
  const [ai, setAi] = useState(null);
  const resRef = useRef([]);
  const single = !!(practice || review);
  const G = gloss || {};

  useEffect(() => {
    const l = !practice && muted() ? exercises.filter((e) => !isListen(e)) : exercises;
    setList(l); setP(l.map(prep));
  }, [exercises, practice]);
  useEffect(() => { if (end) window.dispatchEvent(new Event("regulus:refresh")); }, [end]);
  if (!list) return null;
  const ex = list[i], d = ex?.data, p = P[i];
  const reset = () => { setFb(null); setSel(null); setBuilt([]); setLeft(null); setDone([]); setBad(null); setAi(null); };

  // returns true when the run is over (no lives / too many mistakes)
  function miss(en) {
    mRef.current += 1; setMist(mRef.current);
    if (review) return false;
    if (practice) { const over = mRef.current > practice.allowed; if (over) setDead(true); return over; }
    if (en) setWrong((w) => [...w, en]);
    hRef.current = Math.max(0, hRef.current - 1); setHearts(hRef.current);
    post("/api/lives/lose").then(() => window.dispatchEvent(new Event("regulus:refresh")));
    if (hRef.current === 0) { setDead(true); return true; }
    return false;
  }
  async function finish() {
    if (review) {
      const r = await post("/api/review/complete", { results: resRef.current.slice(0, 20) });
      const j = r?.ok ? await r.json() : null;
      return setEnd(j ? { review: true, xp: j.xp, words: j.words } : { error: true });
    }
    if (practice) {
      const r = await post(`/api/practice/${practice.n}/complete`, { mistakes: mRef.current, token: practice.token });
      const j = r?.ok ? await r.json() : null;
      return setEnd(j ? { practice: true, pass: j.pass, hearts: j.hearts } : { error: true });
    }
    const r = await post(`/api/lesson/${lessonId}/complete`, { mistakes: Math.min(7, mRef.current), wrong: [...new Set(wrong)].slice(0, 20) });
    setEnd(r?.ok ? await r.json() : { error: true });
  }
  function check() {
    let ok, correct;
    const mc0 = ex.type === "choice" || ex.type === "listenpick";
    if (ex.type === "choice" || ex.type === "listenpick") { ok = sel === d.answer; correct = d.options[d.answer]; }
    else { ok = built.length > 0 && built.map((k) => p.words.find((w) => w.k === k).t).join(" ") === d.answer.join(" "); correct = d.answer.join(" "); }
    if (review) resRef.current.push({ w: d.word, ok });
    if (!ok) miss(d.word);
    const answer = mc0 ? d.options[sel] : built.map((k) => p.words.find((w) => w.k === k).t).join(" ");
    setFb({ ok, correct, answer });
  }
  async function explain() {
    setAi({ loading: true });
    const r = await post("/api/ai", { mode: "explain", question: String(d.question || d.source || d.text || "").slice(0, 300), answer: String(fb.answer || "").slice(0, 300), correct: String(fb.correct).slice(0, 300) });
    const j = r?.ok ? await r.json().catch(() => null) : null;
    setAi({ text: j?.text || "AI hozircha javob bera olmadi." });
  }
  async function next() {
    if (dead) return setEnd(practice ? { practice: true, pass: false } : { fail: true });
    reset();
    if (i + 1 < list.length) return setI(i + 1);
    await finish();
  }
  async function skipListening() {
    try { localStorage.setItem("nolisten", String(Date.now() + 3600000)); } catch {}
    const keep = (e, k) => k < i || (k > i && !isListen(e));
    const nl = list.filter(keep), np = P.filter((_, k) => keep(list[k], k));
    reset(); setList(nl); setP(np);
    if (i >= nl.length) { setI(Math.max(0, nl.length - 1)); await finish(); }
  }
  function pick(side, k) {
    if (side === "L") return setLeft(k);
    if (left === null || done.includes(k)) return;
    if (left === k) { const nd = [...done, k]; setDone(nd); setLeft(null); if (nd.length === d.pairs.length) setFb({ ok: true, correct: "" }); }
    else { const over = miss(d.pairs[left][0]); setBad(`${left}-${k}`); setLeft(null); setTimeout(() => setBad(null), 500); if (over) setFb({ ok: false, correct: "" }); }
  }

  if (end) return (
    <div className="lesson"><div className="end">
      {end.fail ? <><h1>Jonlar tugadi</h1><p className="lead">Bugungi jonlaringiz tugadi. Ertaga yangi 5 ta jon beriladi, yoki hoziroq bölim sinovini topshiring: 85% aniqlik — +3 jon.</p><div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}><a className="btn" href="/practice">Sinov topshirish</a><a className="btn alt" href="/learn">Darslarga</a></div></>
      : end.practice ? (end.pass
        ? <><h1>Sinovdan öttingiz!</h1><p className="lead">+3 jon. Hozir jonlaringiz: ♥ {end.hearts}</p><a className="btn" href="/learn">Darslarga qaytish</a></>
        : <><h1>Bu safar bölmadi</h1><p className="lead">85% aniqlik kerak edi. Qayta urinib körin.</p><div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}><a className="btn" href={`/practice/${practice.n}`}>Qayta urinish</a><a className="btn alt" href="/practice">Bölimlar</a></div></>)
      : end.review ? <><h1>Takrorlash tugadi!</h1><p className="lead">+{end.xp} ball · {end.words} ta söz takrorlandi.</p><div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}><a className="btn" href="/review">Takrorlash</a><a className="btn alt" href="/learn">Darslarga</a></div></>
      : end.error ? <><h1>Saqlanmadi</h1><p className="lead">İnternetni tekşirib, qayta urining.</p><Link className="btn" href="/learn">Darslarga</Link></>
      : <><h1>Dars tugadi!</h1><p className="lead">+{end.xp} ball · {end.words} ta söz luğatingizda.</p><div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}><a className="btn" href="/learn">Davom etish</a><a className="btn alt" href="/dictionary">Luğatim</a></div></>}
    </div></div>
  );

  const cur = ex.part;
  const segs = single ? [1] : [1, 2, 3, 4];
  const seg = (n) => { const tot = list.filter((e) => single || e.part === n).length; const dn = list.filter((e, k) => (single || e.part === n) && k < i).length; return tot ? (dn / tot) * 100 : 0; };
  const mc = ex.type === "choice" || ex.type === "listenpick";
  const ready = mc ? sel !== null : built.length > 0;
  return (
    <div className="lesson">
      <div className="top">
        <Link href={practice ? "/practice" : review ? "/review" : "/learn"} aria-label="Çiqish">✕</Link>
        <div className="segs" style={single ? { gridTemplateColumns: "1fr" } : undefined} role="progressbar" aria-valuenow={i} aria-valuemax={list.length}>
          {segs.map((n) => <div key={n} className={`seg ${!single && n === cur ? "cur" : ""}`}><i style={{ width: `${seg(n)}%` }} /></div>)}
        </div>
        {review ? <span className="lives">{i + 1}/{list.length}</span> : practice ? <span className="lives" aria-label="Xatolar">Xato {Math.min(mist, practice.allowed)}/{practice.allowed}</span> : <span className="lives" aria-label={`${hearts} jon`}>♥ {hearts}</span>}
      </div>
      <div className="partname">{review ? "Takrorlash" : practice ? `${practice.n}-bölim sinovi · ${i + 1}/${list.length}` : `${cur}-qism · ${NAMES[cur - 1]}`}</div>
      <div className="q"><small>{d.prompt}</small>{d.question && <h2><Hov s={d.question} G={G} /></h2>}{d.source && <h2><Hov s={d.source} G={G} /></h2>}</div>

      {isListen(ex) && <button className="btn alt say" onClick={() => say(d.text)}>🔊 Tinglash</button>}

      {mc && <div className="opts">{p.opts.map((o) => <button key={o.o} className={`opt ${sel === o.o ? "sel" : ""}`} disabled={!!fb} onClick={() => setSel(o.o)}>{o.t}</button>)}</div>}

      {ex.type === "match" && <div className="pairs">
        <div>{p.L.map((o) => <button key={o.k} className={`opt ${done.includes(o.k) ? "done" : left === o.k ? "sel" : ""}`} disabled={done.includes(o.k) || !!fb} onClick={() => { pick("L", o.k); say(o.t); }}>{o.t}</button>)}</div>
        <div>{p.R.map((o) => <button key={o.k} className={`opt ${done.includes(o.k) ? "done" : bad?.endsWith(`-${o.k}`) ? "badf" : ""}`} disabled={done.includes(o.k) || !!fb} onClick={() => pick("R", o.k)}>{o.t}</button>)}</div>
      </div>}

      {(ex.type === "build" || ex.type === "listen") && <>
        <div className="ans" aria-label="Javob">{built.map((k) => { const w = p.words.find((x) => x.k === k); return <button key={k} className="chip" disabled={!!fb} onClick={() => setBuilt(built.filter((x) => x !== k))}>{w.t}</button>; })}</div>
        <div className="chips">{p.words.map((w) => <button key={w.k} className="chip" disabled={built.includes(w.k) || !!fb} onClick={() => setBuilt([...built, w.k])}>{w.t}</button>)}</div>
      </>}

      {isListen(ex) && !fb && <div><button className="skip" onClick={skipListening}>Hozir tinglay olmayman</button></div>}

      <div className={`foot ${fb ? (fb.ok ? "good" : "bad") : ""}`}><div className="row">
        {fb ? <><div><b>{fb.ok ? "Töğri!" : "Notöğri"}</b>{!fb.ok && fb.correct && <div>Javob: {fb.correct}</div>}{!fb.ok && fb.correct && !ai && <button className="skip" style={{ marginTop: 4 }} onClick={explain}>AI tushuntirsin</button>}</div><button className="btn blue" onClick={next}>Davom</button></>
        : ex.type === "match" ? <span /> : <><span /><button className="btn" disabled={!ready} onClick={check}>Tekşirish</button></>}
      </div>{ai && <div className="aibox">{ai.loading ? "…" : <Md text={ai.text} />}</div>}</div>
    </div>
  );
}
