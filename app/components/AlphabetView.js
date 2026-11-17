"use client";
import Icon from "./Icon";
const say = (t, lang) => { try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.lang = lang; u.rate = .8; speechSynthesis.speak(u); } catch {} };
const ZWJ = "‍";

// Letter cards: tap a letter to hear it, tap the example to hear the word.
export default function AlphabetView({ abc, lang, dir }) {
  return (
    <>
      {abc.groups.map((g, gi) => (
        <section key={g.t} className="abc-group">
          <div className="abc-gh">
            <div><small>{gi + 1}-guruh · {g.l.length} ta harf</small><h2>{g.t}</h2><p>{g.d}</p></div>
            <a className="btn sm" href={`/alphabet/${gi + 1}`}>Maşq qiliş</a>
          </div>
          <div className="letters">
            {g.l.map((x) => {
              const base = x.g.split(" ")[0];
              return (
                <article key={x.g} className="letter">
                  <button type="button" className="lg" dir={dir} onClick={() => say(abc.rtl ? base : x.name, lang)} aria-label={`${x.g} harfi: ${x.sound}. Tinglaş`}>{x.g}</button>
                  <div className="lsound"><b>{x.sound}</b><span>{x.name}</span></div>
                  <p>{x.hint}</p>
                  {abc.rtl && (
                    <div className="forms" dir="rtl" aria-label="Söz boşida, örtasida va oxirida">
                      <span><i>{x.joins ? base + ZWJ : base}</i><small>boşida</small></span>
                      <span><i>{ZWJ + base + (x.joins ? ZWJ : "")}</i><small>örtasida</small></span>
                      <span><i>{ZWJ + base}</i><small>oxirida</small></span>
                    </div>
                  )}
                  <button type="button" className="lex" onClick={() => say(x.ex, lang)}><Icon n="sound" size={16} /><b dir={dir}>{x.ex}</b><span>{x.exUz}</span></button>
                </article>
              );
            })}
          </div>
        </section>
      ))}
      {abc.marks && (
        <section className="abc-group">
          <div className="abc-gh"><div><small>Qisqa unlilar</small><h2>Harakatlar</h2><p>Bu belgilar harf ustiga yoki ostiga qöyiladi va qisqa unlini bildiradi. Boşlovçilar uçun matnlar şu belgilar bilan yoziladi.</p></div></div>
          <div className="letters">
            {abc.marks.map(([g, name, d]) => (
              <article key={name} className="letter"><button type="button" className="lg" dir="rtl" onClick={() => say(g, lang)} aria-label={`${name}. Tinglaş`}>{g}</button><div className="lsound"><b>{name}</b></div><p>{d}</p></article>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
