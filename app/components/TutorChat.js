"use client";
import { useRef, useEffect, useState } from "react";
import Md from "./Md";
import Regi from "./Regi";

const HI = "Salom! Men Regi — sizning AI ustozingizman. İngliz tili haqida istalgan savol bering: grammatika, söz ma'nosi yoki tarjima.";
const IDEAS = ["«a» va «an» farqi nima?", "Past Simple qanday yasaladi?", "«How are you?» ga qanday javob beriladi?"];
export default function TutorChat() {
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const end = useRef(null);
  useEffect(() => { if (msgs.length || busy) end.current?.scrollIntoView({ block: "end" }); }, [msgs, busy]);

  async function ask(raw) {
    const t = raw.trim();
    if (!t || busy) return;
    const next = [...msgs, { role: "user", content: t.slice(0, 600) }];
    setMsgs(next); setText(""); setErr(""); setBusy(true);
    const r = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode: "chat", messages: next.slice(-8) }) }).catch(() => null);
    const d = await r?.json().catch(() => ({}));
    setBusy(false);
    if (r?.ok && d.text) setMsgs([...next, { role: "assistant", content: d.text }]);
    else setErr(d?.error || "Javob kelmadi. Qayta urinib köring.");
  }
  const Bot = ({ children }) => <div className="msg"><Regi mood="happy" size={44} head /><div className="bub bot">{children}</div></div>;
  return (
    <main className="wrap" style={{ maxWidth: 720, paddingBottom: 40 }}>
      <h1 className="page-h">AI ustoz</h1>
      <div className="chat">
        <Bot>{HI}</Bot>
        {msgs.map((m, i) => m.role === "user" ? <div key={i} className="msg me"><div className="bub me">{m.content}</div></div> : <Bot key={i}><Md text={m.content} /></Bot>)}
        {busy && <Bot><span className="dots" aria-label="Yozmoqda"><i /><i /><i /></span></Bot>}
        <div ref={end} />
      </div>
      {!msgs.length && <div className="row" style={{ marginTop: 6 }}>{IDEAS.map((q) => <button key={q} className="btn alt sm" onClick={() => ask(q)}>{q}</button>)}</div>}
      {err && <div className="err" role="alert" style={{ marginTop: 12 }}>{err}</div>}
      <form className="ask" onSubmit={(e) => { e.preventDefault(); ask(text); }}>
        <input className="search" placeholder="Savolingizni yozing…" aria-label="Savol" maxLength={600} value={text} onChange={(e) => setText(e.target.value)} />
        <button className="btn" disabled={busy || !text.trim()}>Yuboriş</button>
      </form>
      <p style={{ color: "var(--on-sky-2)" }}><small>AI xato qilişi mumkin. Muhim narsalarni darslik bilan soliştiring.</small></p>
    </main>
  );
}
