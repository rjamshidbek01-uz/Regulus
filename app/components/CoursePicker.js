"use client";
import { useState } from "react";

export default function CoursePicker({ courses, current }) {
  const [busy, setBusy] = useState(null), [err, setErr] = useState("");
  async function pick(code) {
    if (code === current) { location.href = "/learn"; return; }
    setBusy(code); setErr("");
    const r = await fetch("/api/course", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }) }).catch(() => null);
    const d = await r?.json().catch(() => ({}));
    if (r?.ok) { location.href = "/learn"; return; }
    setBusy(null); setErr(d?.error || "Xatolik. Qayta urinib köring.");
  }
  return (
    <>
      {err && <div className="err" role="alert">{err}</div>}
      <div className="courses">
        {courses.map((c) => (
          <button key={c.code} className={`course ${c.code === current ? "on" : ""}`} onClick={() => pick(c.code)} disabled={!!busy}>
            <span className="cnative" dir={c.dir}>{c.native}</span>
            <b>{c.name}</b>
            <small>{c.chapters} ta bölim · {c.lessons} ta dars{c.hasAlphabet ? " · alifbo" : ""}</small>
            {!c.live && <em className="tag locked">Yaşirin — faqat admin köradi</em>}
            <span className="btn sm">{c.code === current ? "Davom etiş" : busy === c.code ? "…" : "Tanlaş"}</span>
          </button>
        ))}
      </div>
    </>
  );
}
