"use client";
import Icon from "./Icon";
const say = (t, lang = "en-US") => { try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.lang = lang; u.rate = .9; speechSynthesis.speak(u); } catch {} };

// The lesson's words before you start: tap one to hear it.
export default function WordPreview({ words, lang, dir }) {
  return (
    <ul className="wprev">
      {words.map((w) => (
        <li key={w.en}><button type="button" onClick={() => say(w.en, lang)} aria-label={`${w.en} — ${w.uz}. Tinglaş`}><Icon n="sound" size={16} /><b dir={dir}>{w.en}</b><span>{w.uz}</span></button></li>
      ))}
    </ul>
  );
}
