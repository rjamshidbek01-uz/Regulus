"use client";
import { useState } from "react";

const post = async (url, body) => {
  const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).catch(() => null);
  return { ok: !!r?.ok, d: await r?.json().catch(() => ({})) };
};
function Msg({ err, ok }) {
  return <>{err && <div className="err" role="alert">{err}</div>}{ok && <div className="ok">{ok}</div>}</>;
}
function Field({ id, label, type = "password", value, set, hint, auto }) {
  return <div className="f"><label htmlFor={id}>{label}</label><input id={id} type={type} autoComplete={auto} required value={value} onChange={(e) => set(e.target.value)} />{hint && <small>{hint}</small>}</div>;
}

export function Forgot() {
  const [email, setEmail] = useState(""), [ok, setOk] = useState(""), [err, setErr] = useState(""), [busy, setBusy] = useState(false);
  async function go(e) {
    e.preventDefault(); setErr(""); setOk(""); setBusy(true);
    const { ok: g, d } = await post("/api/forgot", { email });
    setBusy(false);
    g ? setOk("Agar bu e-poçta bilan hisob bölsa, parolni tiklaş havolasi yuborildi. Spam papkasini ham tekşiring.") : setErr(d?.error || "Xatolik. Qayta urining.");
  }
  return (
    <main className="form"><h1>Parolni tiklaş</h1><Msg err={err} ok={ok} />
      <form onSubmit={go} className="card" noValidate>
        <Field id="fe" label="E-poçta" type="email" value={email} set={setEmail} auto="email" />
        <button className="btn" disabled={busy}>{busy ? "…" : "Havola yuboriş"}</button>
      </form>
    </main>
  );
}

export function Reset({ token }) {
  const [pw, setPw] = useState(""), [cf, setCf] = useState(""), [ok, setOk] = useState(false), [err, setErr] = useState(""), [busy, setBusy] = useState(false);
  async function go(e) {
    e.preventDefault(); setErr("");
    if (pw !== cf) return setErr("Parollar mos kelmadi.");
    setBusy(true);
    const { ok: g, d } = await post("/api/reset", { token, password: pw, confirm: cf });
    setBusy(false);
    g ? setOk(true) : setErr(d?.error || "Xatolik. Qayta urining.");
  }
  if (ok) return <main className="form"><div className="card"><h1>Tayyor!</h1><p>Parol yangilandi. Endi kirişingiz mumkin.</p><a className="btn" href="/login">Kiriş</a></div></main>;
  return (
    <main className="form"><h1>Yangi parol</h1><Msg err={err} />
      <form onSubmit={go} className="card" noValidate>
        <Field id="rp" label="Yangi parol" value={pw} set={setPw} auto="new-password" hint="Kamida 10 belgi" />
        <Field id="rc" label="Parolni qayta kiriting" value={cf} set={setCf} auto="new-password" />
        <button className="btn" disabled={busy}>{busy ? "…" : "Parolni saqlaş"}</button>
      </form>
    </main>
  );
}

export function ProfileForms() {
  const [cur, setCur] = useState(""), [pw, setPw] = useState(""), [cf, setCf] = useState(""), [dp, setDp] = useState("");
  const [e1, setE1] = useState(""), [o1, setO1] = useState(""), [e2, setE2] = useState("");
  async function change(e) {
    e.preventDefault(); setE1(""); setO1("");
    if (pw !== cf) return setE1("Parollar mos kelmadi.");
    const { ok, d } = await post("/api/profile/password", { current: cur, password: pw, confirm: cf });
    if (ok) { setO1("Parol yangilandi."); setCur(""); setPw(""); setCf(""); } else setE1(d?.error || "Xatolik.");
  }
  async function del(e) {
    e.preventDefault(); setE2("");
    if (!confirm("Hisob va barcha ma'lumotlar öçiriladi. Davom etasizmi?")) return;
    const { ok, d } = await post("/api/profile/delete", { password: dp });
    if (ok) location.href = "/"; else setE2(d?.error || "Xatolik.");
  }
  return (
    <>
      <h2 style={{ margin: "32px 0 12px" }}>Parolni özgartiriş</h2><Msg err={e1} ok={o1} />
      <form onSubmit={change} className="card" noValidate>
        <Field id="pc" label="Joriy parol" value={cur} set={setCur} auto="current-password" />
        <Field id="pn" label="Yangi parol" value={pw} set={setPw} auto="new-password" hint="Kamida 10 belgi" />
        <Field id="pf" label="Yangi parolni qayta kiriting" value={cf} set={setCf} auto="new-password" />
        <button className="btn">Saqlaş</button>
      </form>
      <h2 style={{ margin: "32px 0 12px" }}>Hisobni öçiriş</h2><Msg err={e2} />
      <form onSubmit={del} className="card" noValidate>
        <p style={{ marginTop: 0 }}>Bu amalni qaytarib bölmaydi: darslar, luğat va ballaringiz öçadi.</p>
        <Field id="dp" label="Parolni kiriting" value={dp} set={setDp} auto="current-password" />
        <button className="btn red">Hisobni öçiriş</button>
      </form>
    </>
  );
}
