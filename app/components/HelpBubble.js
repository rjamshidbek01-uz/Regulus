"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Md from "./Md";
import Regi from "./Regi";
import Icon from "./Icon";

// Ready answers for the questions people ask most. They work instantly, even if the AI is down.
const GUEST = [
  { id: "email", q: "E-poçtamni qayerdan topaman?", a: "Agar telefoningiz *Android* bölsa, sizda allaqaçon e-poçta bor — bu Google hisobingiz (…@gmail.com).\n1. Telefonda *Sozlamalar* (*Settings*) ni oçing.\n2. *Google* yoki «Hisoblar» bölimini bosing.\n3. Eng yuqorida yozilgan …@gmail.com — sizning e-poçtangiz.\nYana bir yöl: *Gmail* yoki *Play Market* ilovasini oçib, yuqori öng burçakdagi dumaloq rasmni bosing.\n*iPhone* bölsa: *Settings* → eng yuqoridagi ismingiz → e-poçtangiz körinadi." },
  { id: "noemail", q: "E-poçtam yöq. Nima qilay?", a: "Bepul *Gmail* oçiş 5 daqiqa oladi:\n1. *Gmail* ilovasini yoki gmail.com saytini oçing.\n2. «Hisob yaratiş» (*Create account*) ni bosing.\n3. Ismingizni, tuğilgan sanangizni yozing va yangi manzil tanlang (masalan ali.karimov2012@gmail.com).\n4. Parol qöying va uni daftarga yozib qöying.\n5. Şu manzil bilan Regulusda «Röyxatdan ötiş» ni bosing.\nBola bölsangiz, ota-onangizdan yordam söraşingiz mumkin." },
  { id: "signup", q: "Qanday röyxatdan ötaman?", a: "1. «Röyxatdan ötiş» ni bosing.\n2. E-poçtangizni yozing (masalan ali@gmail.com).\n3. Taxallus öylab toping: 3–20 ta lotin harfi, raqam yoki _ (masalan ali_2012).\n4. Kamida 10 belgili parol yozing va uni yana bir bor kiriting.\n5. Kiçik misolni yeçing (masalan 3 + 4 = 7) va «Hisob yaratiş» ni bosing.\n6. E-poçtangizga kelgan xatdagi «E-poçtani tasdiqlaş» tugmasini bosing — tayyor!" },
  { id: "noletter", q: "Tasdiqlaş xati kelmadi", a: "1. 1–2 daqiqa kuting.\n2. *Gmail* da «Spam» va «Promoaksiyalar» papkalarini ham tekşiring.\n3. E-poçta manzilini xatosiz yozganingizni tekşiring.\n4. «Kiriş» sahifasida e-poçta va parolni kiriting — «Xatni qayta yuboriş» tugmasi çiqadi, uni bosing.\n5. Xatdagi «E-poçtani tasdiqlaş» tugmasini bosing (havola 24 soat işlaydi)." },
  { id: "forgot", q: "Parolimni unutdim", a: "1. «Kiriş» sahifasida «Parolni unutdingizmi?» ni bosing.\n2. E-poçtangizni yozib, «Havola yuboriş» ni bosing.\n3. *Gmail* dagi «Regulus: parolni tiklaş» xatini oçing.\n4. «Parolni tiklaş» tugmasini bosib, yangi parol qöying (kamida 10 belgi).\nHavola 1 soat işlaydi." },
  { id: "login", q: "Kira olmayapman", a: "1. E-poçta yoki taxallusni xatosiz yozing.\n2. Parolda katta va kiçik harflar farq qiladi — *Caps Lock* öçiqligini tekşiring.\n3. «E-poçtangizni avval tasdiqlang» deyilsa — xatni tasdiqlang yoki «Xatni qayta yuboriş» ni bosing.\n4. «Köp urinish» deyilsa — 10 daqiqa kuting.\n5. Parolni eslay olmasangiz — «Parolni unutdingizmi?» ni bosing." },
];
const MEMBER = [
  { id: "map", q: "Darslar qanday işlaydi?", a: "«Darslar» sahifasida 80 ta bölim bor — har biri bitta sayyora.\n1. Sayyorani bosing: Regi maslahati, 3 ta dars, sözlar va bölim sinovi oçiladi.\n2. Darslar ketma-ket oçiladi.\n3. «Davom etiş» tugmasi sizni darhol keyingi darsga olib boradi." },
  { id: "hearts", q: "Jonlar qanday tiklanadi?", a: "1. Har kuni yarim tunda (Toşkent vaqti) 5 ta jon beriladi.\n2. Darsda har bir xato — 1 ta jon.\n3. Jon tugasa, bölim sinovini topşiring: 20 savol, köpi bilan 3 ta xato — +3 jon.\nTakrorlaş va sinov jon sarflamaydi." },
  { id: "points", q: "Ball qanday yiğiladi?", a: "1. Yangi dars — 20 ball (0–1 xato bilan yana +10).\n2. Darsni qayta öqiş — 4 ball.\n3. Takrorlaş — 10 ball.\n4. Bölim sinovidan ötiş — 15 ball.\nHar kuni saytga kirsangiz, ketma-ket kunlar (🔥) öşadi." },
  { id: "password", q: "Parolni qanday özgartiraman?", a: "1. Yuqori öng burçakdagi dumaloq harfni (profil) bosing.\n2. «Parolni özgartiriş» bölimida joriy va yangi parolni yozing.\n3. «Saqlaş» ni bosing." },
];

export default function HelpBubble({ loggedIn }) {
  const path = usePathname() || "";
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const input = useRef(null), end = useRef(null), fab = useRef(null);
  const FAQ = loggedIn ? MEMBER : GUEST;

  const ask = (f) => setMsgs((m) => [...m, { role: "user", content: f.q }, { role: "assistant", content: f.a, ready: true }]);
  useEffect(() => {
    const onHelp = (e) => { setOpen(true); const f = GUEST.concat(MEMBER).find((x) => x.id === e.detail?.q); if (f) ask(f); };
    window.addEventListener("regulus:help", onHelp);
    return () => window.removeEventListener("regulus:help", onHelp);
  }, []);
  useEffect(() => {
    if (!open) return;
    setTimeout(() => input.current?.focus(), 50);
    const esc = (e) => { if (e.key === "Escape") { setOpen(false); fab.current?.focus(); } };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);
  useEffect(() => { end.current?.scrollIntoView({ block: "end" }); }, [msgs, busy]);
  if (path.startsWith("/tutor")) return null;

  async function send(e) {
    e.preventDefault();
    const t = text.trim();
    if (!t || busy) return;
    const next = [...msgs, { role: "user", content: t.slice(0, 600) }];
    setMsgs(next); setText(""); setBusy(true);
    const history = next.filter((m) => !m.error).slice(-8).map(({ role, content }) => ({ role, content }));
    const r = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode: loggedIn ? "chat" : "help", messages: history }) }).catch(() => null);
    const d = await r?.json().catch(() => ({}));
    setBusy(false);
    setMsgs([...next, r?.ok && d.text ? { role: "assistant", content: d.text } : { role: "assistant", error: true, content: (d?.error && d.error !== "auth" ? d.error : "Hozir javob bera olmadim.") + " Pastdagi tayyor savollardan birini tanlab köring yoki Telegram orqali yozing (Haqida sahifasi)." }]);
  }

  return (
    <>
      <button ref={fab} className={`helpfab ${open ? "hide" : ""} ${loggedIn ? "member" : ""}`} onClick={() => setOpen(true)} aria-label="Regidan yordam söraş" aria-expanded={open}>
        <Regi mood="wave" size={46} head /><span>Yordam kerakmi?</span>
      </button>
      {open && (
        <section className="helpbox" role="dialog" aria-modal="false" aria-label="Regi yordamçi">
          <header><Regi mood="happy" size={40} head /><div><b>Regi yordamçi</b><small>{loggedIn ? "Sayt va ingliz tili böyiça savollar" : "Kiriş va röyxatdan ötiş böyiça yordam"}</small></div>
            <button className="icon-btn" onClick={() => { setOpen(false); fab.current?.focus(); }} aria-label="Yopiş"><Icon n="x" size={20} /></button></header>
          <div className="helplog" aria-live="polite">
            <div className="bub bot">{loggedIn ? "Salom! Regulus haqida istalgan savolingizni bering yoki pastdan tanlang." : "Salom! Men Regi. Röyxatdan ötiş, kiriş yoki e-poçta bilan muammo bölsa — yordam beraman. Savolni tanlang yoki özingiz yozing."}</div>
            {msgs.map((m, i) => <div key={i} className={`bub ${m.role === "user" ? "me" : "bot"} ${m.error ? "err-b" : ""}`}>{m.role === "user" ? m.content : <Md text={m.content} />}</div>)}
            {busy && <div className="bub bot"><span className="dots" aria-label="Yozmoqda"><i /><i /><i /></span></div>}
            <div ref={end} />
          </div>
          <div className="faq">{FAQ.map((f) => <button key={f.id} className="chip" onClick={() => ask(f)}>{f.q}</button>)}</div>
          <form className="ask" onSubmit={send}>
            <input ref={input} className="search" placeholder="Savolingizni yozing…" aria-label="Savol" maxLength={600} value={text} onChange={(e) => setText(e.target.value)} />
            <button className="btn sm" disabled={busy || !text.trim()}>Yuboriş</button>
          </form>
        </section>
      )}
    </>
  );
}
