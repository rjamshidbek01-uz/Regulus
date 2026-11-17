"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Md from "./Md";
import Regi from "./Regi";
import Icon from "./Icon";
import { Confetti, sfx, soundOff, setSoundOff } from "./Fx";

const NAMES = ["Sözlar", "Eşitiş", "Tarjima", "Takrorlaş"];
const PRAISE = ["Töğri!", "Barakalla!", "Zör!", "Ajoyib!", "Juda yaxşi!"];
const CHEER = ["Notöğri", "Hali emas", "Yana urinib köramiz"];
const isListen = (e) => e.type === "listen" || e.type === "listenpick";
const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const prep = (e) => {
  const d = e.data;
  if (e.type === "intro") return {};
  if (e.type === "choice" || e.type === "listenpick") return { opts: shuffle(d.options.map((t, o) => ({ t, o }))) };
  if (e.type === "match") return { L: shuffle(d.pairs.map((p, k) => ({ t: p[0], k }))), R: shuffle(d.pairs.map((p, k) => ({ t: p[1], k }))) };
  return { words: shuffle(d.words.map((t, k) => ({ t, k }))) };
};
const say = (t, lang = "en-US") => { try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.lang = lang; u.rate = .9; speechSynthesis.speak(u); } catch {} };
const muted = () => { try { return Number(localStorage.getItem("nolisten") || 0) > Date.now(); } catch { return false; } };
const clean = (t) => t.toLowerCase().replace(/[.,!?;:]/g, "");
// Hint on a word: shows its translation on hover, keyboard focus, or a tap (phones).
const tap = (e) => { const el = e.currentTarget, on = !el.classList.contains("open"); document.querySelectorAll(".tip.open").forEach((x) => x.classList.remove("open")); if (on) el.classList.add("open"); };
function Tip({ t, v }) { return <span className="tip" tabIndex={0} role="button" aria-label={`${t}: ${v}`} data-t={v} onClick={tap}>{t}</span>; }
function Hov({ s, G, uz }) {
  if (!s) return null;
  const p = uz ? "uz:" : "", whole = G[p + clean(s)];
  if (whole && s.includes(" ")) return <Tip t={s} v={whole} />;
  return s.split(" ").map((t, i, a) => { const v = G[p + clean(t)]; return <span key={i}>{v ? <Tip t={t} v={v} /> : t}{i < a.length - 1 ? " " : ""}</span>; });
}
const hasHint = (s, G, uz) => !!s && s.split(" ").concat(s).some((t) => G[(uz ? "uz:" : "") + clean(t)]);
// What the learner should take away from an exercise: the word or sentence with its translation.
function lesson(ex) {
  const d = ex.data;
  if (ex.type === "build") return `${d.source} — ${d.answer.join(" ")}`;
  if (ex.type === "listen") return d.tr ? `${d.text} — ${d.tr}` : "";
  if ((ex.type === "choice" || ex.type === "listenpick") && d.word) {
    const other = d.question && d.question !== d.word ? d.question : d.options[d.answer];
    return other && other !== d.word ? `${d.word} — ${other}` : "";
  }
  return "";
}
const post = (url, body) => fetch(url, { method: "POST", keepalive: true, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body || {}) }).catch(() => null);

// drill = practice without lives or saving (e.g. the alphabet): { title, back, again }
export default function Player({ lessonId, exercises, hearts: h0 = 5, practice, review, drill, gloss, back, next: nextId, course }) {
  const L = course?.speech || "en-US";
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
  const [quiet, setQuiet] = useState(false);
  const resRef = useRef([]);
  const single = !!(practice || review || drill);
  const G = gloss || {};

  useEffect(() => {
    const l = !practice && muted() ? exercises.filter((e) => !isListen(e)) : exercises;
    setList(l); setP(l.map(prep)); setQuiet(soundOff());
  }, [exercises, practice]);
  useEffect(() => {
    if (!end) return;
    window.dispatchEvent(new Event("regulus:refresh"));
    if (!end.fail && !end.error && end.pass !== false) sfx("win");
  }, [end]);
  if (!list) return null;
  const ex = list[i], d = ex?.data, p = P[i];
  const reset = () => { setFb(null); setSel(null); setBuilt([]); setLeft(null); setDone([]); setBad(null); setAi(null); };
  const result = (r) => { sfx(r.ok ? "good" : "bad"); setFb({ ...r, word: (r.ok ? PRAISE : CHEER)[Math.floor(Math.random() * (r.ok ? PRAISE : CHEER).length)] }); };

  // returns true when the run is over (no lives / too many mistakes)
  function miss(en) {
    mRef.current += 1; setMist(mRef.current);
    if (review || drill) return false;
    if (practice) { const over = mRef.current > practice.allowed; if (over) setDead(true); return over; }
    if (en) setWrong((w) => [...w, en]);
    hRef.current = Math.max(0, hRef.current - 1); setHearts(hRef.current);
    post("/api/lives/lose").then(() => window.dispatchEvent(new Event("regulus:refresh")));
    if (hRef.current === 0) { setDead(true); return true; }
    return false;
  }
  async function finish() {
    if (drill) return setEnd({ drill: true, right: list.length - mRef.current, total: list.length });
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
    if (mc0) { ok = sel === d.answer; correct = d.options[d.answer]; }
    else { ok = built.length > 0 && built.map((k) => p.words.find((w) => w.k === k).t).join(" ") === d.answer.join(" "); correct = d.answer.join(" "); }
    if (review) resRef.current.push({ w: d.word, ok });
    if (!ok) miss(d.word);
    const answer = mc0 ? d.options[sel] : built.map((k) => p.words.find((w) => w.k === k).t).join(" ");
    result({ ok, correct, answer });
  }
  async function explain() {
    setAi({ loading: true });
    const r = await post("/api/ai", { mode: "explain", question: String(d.question || d.source || d.text || "").slice(0, 300), answer: String(fb.answer || "").slice(0, 300), correct: String(fb.correct).slice(0, 300) });
    const j = r?.ok ? await r.json().catch(() => null) : null;
    setAi({ text: j?.text || "AI hozirça javob bera olmadi." });
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
    if (left === k) { const nd = [...done, k]; setDone(nd); setLeft(null); if (nd.length === d.pairs.length) result({ ok: true, correct: "" }); else sfx("tap"); }
    else { const over = miss(d.pairs[left][0]); sfx("bad"); setBad(`${left}-${k}`); setLeft(null); setTimeout(() => setBad(null), 500); if (over) setFb({ ok: false, correct: "", word: CHEER[0] }); }
  }

  if (end) {
    const win = !end.fail && !end.error && end.pass !== false && !(end.drill && end.right < end.total * 0.7);
    return (
      <div className="lesson"><div className="end">
        {win && <Confetti />}
        <Regi mood={end.fail ? "sleep" : end.error ? "think" : win ? "cheer" : "sad"} size={170} />
        {end.fail ? <><h1>Jonlar tugadi</h1><p className="lead">Regi biroz dam oladi. Ertaga yangi 5 ta jon beriladi, yoki hoziroq bölim sinovini topşiring: 85% aniqlik — +3 jon.</p><div className="row c"><a className="btn" href="/practice">Sinov topşiriş</a><a className="btn alt" href="/learn">Darslarga</a></div></>
        : end.practice ? (end.pass
          ? <><h1>Sinovdan öttingiz!</h1><div className="reward"><div style={{ "--c": "#ff8fa3", "--cd": "#d9566f" }}><b>+3</b>jon</div><div style={{ "--c": "var(--gold)", "--cd": "var(--gold-d)" }}><b>♥ {end.hearts}</b>jami jon</div></div><a className="btn big" href="/learn">Darslarga qaytiş</a></>
          : <><h1>Bu safar bölmadi</h1><p className="lead">85% aniqlik kerak edi. Xafa bölmang, yana bir urinib köring!</p><div className="row c"><a className="btn" href={`/practice/${practice.n}`}>Qayta uriniş</a><a className="btn alt" href="/practice">Bölimlar</a></div></>)
        : end.drill ? <><h1>{win ? "Barakalla!" : "Yana maşq qilamiz"}</h1><div className="reward"><div style={{ "--c": "var(--gold)", "--cd": "var(--gold-d)" }}><b>{Math.max(0, end.right)}/{end.total}</b>töğri javob</div></div><div className="row c"><a className="btn big" href={drill.again}>Yana bir bor</a><a className="btn big alt" href={drill.back}>Alifboga</a></div></>
        : end.review ? <><h1>Takrorlaş tugadi!</h1><div className="reward"><div style={{ "--c": "var(--gold)", "--cd": "var(--gold-d)" }}><b>+{end.xp}</b>ball</div><div style={{ "--c": "var(--turq)", "--cd": "var(--turq-d)" }}><b>{end.words}</b>ta söz</div></div><div className="row c"><a className="btn" href="/review">Takrorlaş</a><a className="btn alt" href="/learn">Darslarga</a></div></>
        : end.error ? <><h1>Saqlanmadi</h1><p className="lead">İnternetni tekşirib, qayta urinib köring.</p><Link className="btn" href="/learn">Darslarga</Link></>
        : <><h1>Dars tugadi!</h1><div className="reward"><div style={{ "--c": "var(--gold)", "--cd": "var(--gold-d)" }}><b>+{end.xp}</b>ball</div><div style={{ "--c": "var(--turq)", "--cd": "var(--turq-d)" }}><b>{end.words}</b>ta söz luğatda</div></div><div className="row c">{nextId ? <a className="btn big" href={`/learn/${nextId}`}>Keyingi dars</a> : <a className="btn big" href="/learn">Xaritaga</a>}<a className="btn big alt" href={back || "/learn"}>Bölimga qaytiş</a></div></>}
      </div></div>
    );
  }

  const cur = ex.part;
  const segs = single ? [1] : [1, 2, 3, 4];
  const seg = (n) => { const tot = list.filter((e) => single || e.part === n).length; const dn = list.filter((e, k) => (single || e.part === n) && k < i).length + (fb && (single || n === cur) ? 1 : 0); return tot ? Math.min(1, dn / tot) : 0; };
  const mc = ex.type === "choice" || ex.type === "listenpick";
  const ready = mc ? sel !== null : built.length > 0;
  const mood = fb ? (fb.ok ? "cheer" : "sad") : isListen(ex) ? "happy" : "think";
  const optCls = (o) => fb ? (o === d.answer ? "right" : o === sel ? "wrong" : "") : sel === o ? "sel" : "";
  return (
    <div className="lesson">
      <div className="top">
        <Link className="icon-btn" href={drill?.back || back || (practice ? "/practice" : review ? "/review" : "/learn")} aria-label="Çiqiş"><Icon n="x" size={22} /></Link>
        <div className="segs" style={single ? { gridTemplateColumns: "1fr" } : undefined} role="progressbar" aria-valuenow={i} aria-valuemax={list.length}>
          {segs.map((n) => <div key={n} className={`seg ${!single && n === cur ? "cur" : ""}`}><i style={{ "--p": seg(n) }} /></div>)}
        </div>
        <button className="icon-btn" aria-label={quiet ? "Ovozni yoqiş" : "Ovozni öçiriş"} aria-pressed={quiet} onClick={() => { setSoundOff(!quiet); setQuiet(!quiet); }}><Icon n={quiet ? "mute" : "sound"} size={22} /></button>
        {review || drill ? <span className="lives">{i + 1}/{list.length}</span> : practice ? <span className="lives" aria-label="Xatolar">Xato {Math.min(mist, practice.allowed)}/{practice.allowed}</span> : <span key={hearts} className={`lives ${hearts < h0 ? "hit" : ""}`} aria-label={`${hearts} jon`}><Icon n="heart" />{hearts}</span>}
      </div>
      <div className="partname">{drill ? drill.title : review ? "Takrorlaş" : practice ? `${practice.n}-bölim sinovi · ${i + 1}/${list.length}` : `${cur}-qism · ${NAMES[cur - 1]}`}</div>
      <div className="q" key={`q${i}`}>
        <Regi mood={mood} size={84} />
        <div className="bubble"><small>{d.prompt}</small>{d.question && <h2 dir="auto" className={d.big ? "glyph" : ""}><Hov s={d.question} G={G} /></h2>}{d.source && <h2 dir="auto"><Hov s={d.source} G={G} uz={d.from === "uz"} /></h2>}{!fb && (hasHint(d.question, G) || hasHint(d.source, G, d.from === "uz")) && <span className="hintnote">💡 Tagiga çizilgan sözni bosing — tarjimasi çiqadi</span>}</div>
      </div>

      <div className="body" key={`b${i}`}>
        {ex.type === "intro" && <ul className="wprev intro-words">{d.words.map((w) => <li key={w.en}><button type="button" onClick={() => say(w.en, L)} aria-label={`${w.en} — ${w.uz}. Tinglaş`}><Icon n="sound" size={16} /><b dir="auto">{w.en}</b><span>{w.uz}</span></button></li>)}</ul>}
        {isListen(ex) && <button className="btn blue say" onClick={() => say(d.text, L)}><Icon n="sound" size={22} />Tinglaş</button>}

        {mc && <div className="opts" dir="auto">{p.opts.map((o) => <button dir="auto" key={o.o} className={`opt ${optCls(o.o)}`} disabled={!!fb} onClick={() => { setSel(o.o); sfx("tap"); }}>{o.t}</button>)}</div>}

        {ex.type === "match" && <div className="pairs">
          <div>{p.L.map((o) => <button dir="auto" key={o.k} className={`opt ${done.includes(o.k) ? "done" : left === o.k ? "sel" : ""}`} disabled={done.includes(o.k) || !!fb} onClick={() => { pick("L", o.k); say(o.t, L); }}>{o.t}</button>)}</div>
          <div>{p.R.map((o) => <button dir="auto" key={o.k} className={`opt ${done.includes(o.k) ? "done" : bad?.endsWith(`-${o.k}`) ? "badf" : ""}`} disabled={done.includes(o.k) || !!fb} onClick={() => pick("R", o.k)}>{o.t}</button>)}</div>
        </div>}

        {(ex.type === "build" || ex.type === "listen") && <>
          <div className="ans" aria-label="Javob" dir="auto">{built.map((k) => { const w = p.words.find((x) => x.k === k); return <button dir="auto" key={k} className="chip" disabled={!!fb} onClick={() => setBuilt(built.filter((x) => x !== k))}>{w.t}</button>; })}</div>
          <div className="chips" dir="auto">{p.words.map((w) => <button dir="auto" key={w.k} className="chip" disabled={built.includes(w.k) || !!fb} onClick={() => { setBuilt([...built, w.k]); sfx("tap"); }}>{w.t}</button>)}</div>
        </>}

        {isListen(ex) && !fb && <div><button className="skip" onClick={skipListening}>Hozir tinglay olmayman</button></div>}
      </div>

      <div className={`foot ${fb ? (fb.ok ? "good" : "bad") : ""}`}><div className="row">
        {fb ? <><div className="fb"><div><b>{fb.word}</b>{lesson(ex) && <div className="trline" dir="auto">{lesson(ex)}</div>}{!fb.ok && fb.correct && !lesson(ex) && <div>Javob: {fb.correct}</div>}{!fb.ok && fb.correct && !ai && <button className="skip" onClick={explain}>AI tuşuntirsin</button>}</div></div><button className={`btn ${fb.ok ? "green" : "red"}`} onClick={next} autoFocus>Davom</button></>
        : ex.type === "intro" ? <><span>Sözlarni bosib tinglang</span><button className="btn" onClick={next}>Boşladik</button></> : ex.type === "match" ? <span style={{ minHeight: 50 }} /> : <><span /><button className="btn" disabled={!ready} onClick={check}>Tekşiriş</button></>}
      </div>{ai && <div className="aibox">{ai.loading ? <span className="dots"><i /><i /><i /></span> : <Md text={ai.text} />}</div>}</div>
    </div>
  );
}
