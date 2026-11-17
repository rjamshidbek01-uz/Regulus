import { EN } from "./curriculum";

// Dictionary (base) forms shown when hovering English words. Overrides win over lesson word lists.
const OV = {
  "wake up":"uyğonmoq","wake":"uyğonmoq","wash":"yuvinmoq","eat":"yemoq","eats":"yemoq","ate":"yemoq","drink":"içmoq","drinks":"içmoq","drank":"içmoq",
  go:"bormoq",goes:"bormoq",went:"bormoq",work:"işlamoq",works:"işlamoq",worked:"işlamoq",study:"öqimoq",studied:"öqimoq",read:"öqimoq",write:"yozmoq",wrote:"yozmoq",
  sing:"kuylamoq",swim:"suzmoq",run:"yugurmoq",play:"öynamoq",plays:"öynamoq",played:"öynamoq",draw:"çizmoq",cook:"pişirmoq; oşpaz",cooks:"pişirmoq",cooked:"pişirmoq",
  buy:"sotib olmoq",bought:"sotib olmoq",sell:"sotmoq","try on":"ölçab körmoq",like:"yoqtirmoq",stay:"qolmoq",send:"yubormoq",receive:"qabul qilmoq",rest:"dam olmoq",
  walk:"sayr qilmoq",win:"yutmoq",wins:"yutmoq",invite:"taklif qilmoq",decide:"qaror qilmoq",decided:"qaror qilmoq",start:"boşlamoq",starts:"boşlanmoq",finish:"tugatmoq",
  learn:"örganmoq",move:"köçmoq",try:"harakat qilmoq",improve:"yaxşilamoq",believe:"işonmoq",sleep:"uyqu; uxlamoq",cleaned:"tozalamoq",saw:"körmoq",see:"körmoq",
  came:"kelmoq",come:"kelmoq",comes:"kelmoq",had:"ega bölmoq",have:"ega bölmoq",has:"ega bölmoq",began:"boşlamoq",ended:"tugamoq",rained:"yomğir yoğmoq",raining:"yomğir yoğmoq",
  snowing:"qor yoğmoq",watched:"tomoşa qilmoq",
  a:"bir (noaniq artikl)",an:"bir (noaniq artikl)",the:"(aniq artikl)",am:"bölmoq",is:"bölmoq",are:"bölmoq",was:"bölmoq",be:"bölmoq",
  ali:"Ali (ism)",apples:"olma",baby:"çaqaloq",bag:"sumka",banana:"banan",birds:"quş",book:"kitob",books:"kitob",brothers:"aka-uka",by:"bilan; yonida",
  call:"qönğiroq qilmoq",can:"qila olmoq",car:"maşina",clear:"aniq",close:"yopmoq",clouds:"bulut",costs:"turmoq (narx)",days:"kun",dinner:"keçki ovqat",diploma:"diplom",
  do:"qilmoq",every:"har",everything:"hamma narsa",exercises:"maşq qilmoq",eyes:"köz",face:"yuz",field:"dala",food:"ovqat","for":"uçun",from:"-dan",get:"olmoq",give:"bermoq",
  he:"u (erkak)",health:"soğliq",her:"uning (ayol)",here:"bu yerda",home:"uy",hurts:"oğrimoq",important:"muhim","in":"-da",it:"u (jonsiz)",last:"ötgan; oxirgi",leaves:"jönamoq",
  lesson:"dars",lessons:"dars",letter:"xat",listen:"tinglamoq",live:"yaşamoq",london:"London",love:"sevmoq",makes:"qilmoq",many:"köp",me:"men",meet:"uçraşmoq",
  mountains:"toğ",much:"köp",need:"kerak bölmoq",new:"yangi",next:"keyingi",nice:"yaxşi",nights:"tun",not:"emas",number:"son","of":"-ning",on:"-da; ustida",open:"oçmoq; oçiq",
  our:"bizning",pages:"bet",pay:"tölamoq",people:"kişilar",photos:"rasm",pictures:"rasm",put:"qöymoq",she:"u (ayol)",show:"körsatmoq",sit:"ötirmoq",sky:"osmon",
  so:"şuning uçun; juda",speak:"gapirmoq",stops:"töxtamoq",students:"talaba",take:"olmoq",tashkent:"Toşkent",thank:"rahmat aytmoq",there:"bor; u yerda",these:"bular",
  they:"ular",third:"uçinçi",this:"bu","to":"-ga",too:"juda; ham",trees:"daraxt",up:"yuqori",visit:"mehmonga bormoq",want:"xohlamoq",wants:"xohlamoq",we:"biz",wear:"kiymoq",
  at:"-da (joy, vaqt)",as:"kabi; sifatida",well:"yaxşi",will:"-aman (kelasi zamon)",with:"bilan",years:"yil",
};
const sp = (x) => { const i = x.indexOf("="); return [x.slice(0, i), x.slice(i + 1)]; };
// Word lists per course; the English overrides above only apply to the English course.
const WL = new Map();
const wl = (C) => WL.get(C.code) || WL.set(C.code, new Map(C.units.flatMap((u) => u.l.flatMap((l) => l.w.map((w) => { const [en, uz] = sp(w); return [en.toLowerCase(), uz]; }))))).get(C.code);
const clean = (t) => t.toLowerCase().replace(/[.,!?;:]/g, "");
const look = (k, C) => (C.code === "en" && Object.prototype.hasOwnProperty.call(OV, k) ? OV[k] : wl(C).get(k)) ?? null;

// Uzbek -> target word, for hints on the Uzbek sentences learners translate into the target language.
const UZ = new Map();
const uzMap = (C) => UZ.get(C.code) || UZ.set(C.code, (() => {
  const m = new Map();
  for (const u of C.units) for (const l of u.l) for (const w of l.w) { const [en, uz] = sp(w); const k = uz.toLowerCase(); if (!m.has(k)) m.set(k, en); }
  return m;
})()).get(C.code);
// Common Uzbek endings, so "döstim" / "kitoblar" still find "döst" / "kitob".
const SUF = ["larimiz", "laringiz", "larim", "laring", "lari", "lar", "imiz", "ingiz", "ning", "dan", "man", "miz", "siz", "san", "ça", "ni", "ga", "da", "im", "ing", "si", "i", "m"];
// Pronouns and small words have several English equivalents, so they get fixed hints (English course).
const UZ_EN = {
  u: "he / she / it / that", ular: "they / those", men: "I", sen: "you", siz: "you", biz: "we", bu: "this", şu: "this / that",
  mening: "my", sening: "your", sizning: "your", uning: "his / her / its", bizning: "our", ularning: "their",
  menga: "to me", sizga: "to you", unga: "to him / her", bizga: "to us", meni: "me", sizni: "you", uni: "him / her / it",
  bir: "one / a / an", va: "and", bilan: "with", uçun: "for", emas: "not", juda: "very", ham: "too / also",
  bor: "there is / have", yöq: "no / there is not", ha: "yes", lekin: "but", çunki: "because", keyin: "then / after",
};
const lookUz = (k, local, C) => {
  if (C.code === "en" && Object.prototype.hasOwnProperty.call(UZ_EN, k)) return UZ_EN[k];
  const get = (x) => local.get(x) ?? uzMap(C).get(x) ?? null;
  const v = get(k);
  if (v) return v;
  for (const e of SUF) if (k.endsWith(e) && k.length - e.length >= 4) { const w = get(k.slice(0, -e.length)); if (w) return w; }
  return null;
};

// Hints for the lesson: target-language text -> Uzbek (key = word), Uzbek sentences to translate ->
// target language (key = "uz:" + word). Answer choices, chips and pairs never get hints.
export function glossFor(exercises, C = EN) {
  const out = {};
  const add = (s) => {
    if (typeof s !== "string" || !s) return;
    const whole = look(clean(s), C);
    if (whole) out[clean(s)] = whole;
    for (const t of s.split(" ")) { const k = clean(t); const v = look(k, C); if (v) out[k] = v; }
  };
  const local = new Map(exercises.filter((e) => e.type === "intro").flatMap((e) => e.data.words.map((w) => [w.uz.toLowerCase(), w.en])));
  const addUz = (s) => {
    const whole = lookUz(clean(s), local, C);
    if (whole) out["uz:" + clean(s)] = whole;
    for (const t of s.split(" ")) { const k = clean(t); const v = lookUz(k, local, C); if (v) out["uz:" + k] = v; }
  };
  for (const e of exercises) {
    if (e.data.from === "uz") addUz(e.data.source);
    else { add(e.data.question); add(e.data.source); }
  }
  return out;
}
