"use client";
import { useRef, useEffect, useState } from "react";
import Md from "./Md";

const HI = "Salom! Men Regulus ustoziman. İngliz tili haqida istalgan savol bering: grammatika, söz ma'nosi yoki tarjima.";
export default function TutorChat() {
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const end = useRef(null);
  useEffect(() => { end.current?.scrollIntoView({ block: "end" }); }, [msgs, busy]);

  async function send(e) {
    e.preventDefault();
    const t = text.trim();
    if (!t || busy) return;
    const next = [...msgs, { role: "user", content: t.slice(0, 600) }];
    setMsgs(next); setText(""); setErr(""); setBusy(true);
    const r = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode: "chat", messages: next.slice(-8) }) }).catch(() => null);
    const d = await r?.json().catch(() => ({}));
    setBusy(false);
    if (r?.ok && d.text) setMsgs([...next, { role: "assistant", content: d.text }]);
    else setErr(d?.error || "Xatolik. Qayta urining.");
  }
  return (
    <main className="wrap" style={{ maxWidth: 720, paddingBottom: 40 }}>
      <h1 style={{ fontSize: 40, margin: "32px 0 16px" }}>AI ustoz</h1>
      <div className="chat">
        <div className="bub bot">{HI}</div>
        {msgs.map((m, i) => <div key={i} className={`bub ${m.role === "user" ? "me" : "bot"}`}>{m.role === "user" ? m.content : <Md text={m.content} />}</div>)}
        {busy && <div className="bub bot">…</div>}
        <div ref={end} />
      </div>
      {err && <div className="err" role="alert">{err}</div>}
      <form onSubmit={send} style={{ display: "flex", gap: 10, marginTop: 14 }}>
        <input className="search" style={{ maxWidth: "none", flex: 1 }} placeholder="Savolingizni yozing…" aria-label="Savol" maxLength={600} value={text} onChange={(e) => setText(e.target.value)} />
        <button className="btn" disabled={busy || !text.trim()}>Yuborish</button>
      </form>
      <p><small>AI xato qilishi mumkin. Muhim narsalarni darslik bilan solishtiring.</small></p>
    </main>
  );
}
