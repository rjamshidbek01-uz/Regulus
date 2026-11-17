import { UNITS } from "./curriculum";

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
let WL;
const wl = () => WL || (WL = new Map(UNITS.flatMap((u) => u.l.flatMap((l) => l.w.map((w) => { const [en, uz] = sp(w); return [en.toLowerCase(), uz]; })))));
const clean = (t) => t.toLowerCase().replace(/[.,!?;:]/g, "");
const look = (k) => (Object.prototype.hasOwnProperty.call(OV, k) ? OV[k] : wl().get(k)) ?? null;

export function glossFor(exercises) {
  const out = {};
  const add = (s) => {
    if (typeof s !== "string" || !s) return;
    const whole = look(clean(s));
    if (whole) out[clean(s)] = whole;
    for (const t of s.split(" ")) { const k = clean(t); const v = look(k); if (v) out[k] = v; }
  };
  // Only the question / source sentence gets hints. Answer choices, chips and pairs never do.
  for (const e of exercises) { add(e.data.question); add(e.data.source); }
  return out;
}
