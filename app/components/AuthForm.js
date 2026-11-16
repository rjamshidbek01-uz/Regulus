"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Regi from "./Regi";

export default function AuthForm({ mode, notice }) {
  const reg = mode === "register";
  const router = useRouter();
  const [f, setF] = useState({ email: "", nickname: "", password: "", confirm: "", answer: "", website: "" });
  const [cap, setCap] = useState(null);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [unv, setUnv] = useState(false);
  const [note, setNote] = useState("");
  const [shy, setShy] = useState(false);
  const pwEv = { onFocus: () => setShy(true), onBlur: () => setShy(false) };
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const loadCap = () => reg && fetch("/api/captcha").then((r) => r.json()).then(setCap).catch(() => {});
  useEffect(() => { loadCap(); }, []);

  async function submit(e) {
    e.preventDefault();
    setErr("");
    if (reg && f.password !== f.confirm) return setErr("Parollar mos kelmadi.");
    setBusy(true);
    const body = reg ? { ...f, token: cap?.token || "" } : { id: f.email, password: f.password };
    const r = await fetch(`/api/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).catch(() => null);
    const d = await r?.json().catch(() => ({}));
    setBusy(false);
    if (r?.ok) {
      if (d.verify) return setDone(true);
      router.push("/learn"); router.refresh(); return;
    }
    setErr(d?.error || "Xatolik. Qayta urining."); setUnv(!!d?.unverified);
    loadCap(); setF((x) => ({ ...x, answer: "" }));
  }

  async function resend() {
    await fetch("/api/resend", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: f.email }) }).catch(() => null);
    setNote("Agar hisob mavjud bölsa, yangi xat yuborildi.");
  }

  if (done) return <main className="form"><div className="peek"><Regi mood="cheer" size={130} head /></div><div className="card"><h2 style={{ marginBottom: 8 }}>E-poçtani tekşiring</h2><p>Tasdiqlaş havolasi <b>{f.email}</b> manziliga yuborildi. Havolani bosgaç, kirişingiz mumkin.</p></div></main>;
  return (
    <main className="form">
      <h1>{reg ? "Röyxatdan ötiş" : "Xuş kelibsiz!"}</h1>
      <div className="peek"><Regi mood={shy ? "shy" : err ? "sad" : "happy"} size={130} head /></div>
      {notice === "1" && <div className="ok">E-poçta tasdiqlandi. Endi kirişingiz mumkin.</div>}
      {notice === "0" && <div className="err">Havola yaroqsiz yoki muddati tugagan.</div>}
      {err && <div className="err" role="alert">{err}{unv && <div style={{ marginTop: 8 }}><button type="button" className="btn alt sm" onClick={resend}>Xatni qayta yuboriş</button></div>}</div>}
      {note && <div className="ok">{note}</div>}
      <form onSubmit={submit} className="card" noValidate>
        <div className="f"><label htmlFor="email">{reg ? "E-poçta" : "E-poçta yoki taxallus"}</label><input id="email" type={reg ? "email" : "text"} autoComplete={reg ? "email" : "username"} required value={f.email} onChange={set("email")} /></div>
        {reg && <div className="f"><label htmlFor="nick">Taxallus</label><input id="nick" autoComplete="username" required minLength={3} maxLength={20} value={f.nickname} onChange={set("nickname")} /><small>3–20 belgi: harf, raqam yoki _</small></div>}
        <div className="f"><label htmlFor="pw">Parol</label><input id="pw" type="password" autoComplete={reg ? "new-password" : "current-password"} required minLength={reg ? 10 : 1} value={f.password} onChange={set("password")} {...pwEv} />{reg && <small>Kamida 10 belgi</small>}</div>
        {reg && <div className="f"><label htmlFor="cf">Parolni qayta kiriting</label><input id="cf" type="password" autoComplete="new-password" required value={f.confirm} onChange={set("confirm")} {...pwEv} /></div>}
        {reg && <div className="f"><label htmlFor="cap">Robot emasligingizni tasdiqlang: {cap?.q || "…"}</label><input id="cap" inputMode="numeric" required value={f.answer} onChange={set("answer")} /></div>}
        {reg && <div className="hp" aria-hidden="true"><label>Website<input tabIndex={-1} autoComplete="off" value={f.website} onChange={set("website")} /></label></div>}
        <button className="btn" disabled={busy}>{busy ? "…" : reg ? "Hisob yaratiş" : "Kiriş"}</button>
      </form>
      <p>{reg ? <>Hisobingiz bormi? <a href="/login">Kiriş</a></> : <>Hisobingiz yöqmi? <a href="/register">Röyxatdan ötiş</a></>}</p>
    </main>
  );
}
