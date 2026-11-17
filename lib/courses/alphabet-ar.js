// Arabic alphabet: 28 letters, grouped by shape. Letters change shape by position; the page shows
// the forms automatically (zero-width joiners), and `joins: false` marks letters that never connect
// to the next letter.
const L = (g, name, sound, hint, ex, exUz, joins = true) => ({ g, name, sound, hint, ex, exUz, joins });
export const alphabet = {
  title: "Arab alifbosi",
  rtl: true,
  intro: "Arab yozuvi öngdan çapga yoziladi va öqiladi. 28 ta harf bor; harflar söz içida bir-biriga ulanadi va şakli biroz özgaradi. Qisqa unlilar (a, i, u) harf ustiga yoki ostiga qöyiladigan belgilar bilan yoziladi.",
  groups: [
    { t: "Birinçi harflar", d: "ب ت ث bir xil şaklda, faqat nuqtalari farq qiladi.", l: [
      L("ا", "alif", "a (uzun)", "Uzun a; söz boşida hamza bilan keladi", "أَسَد", "şer", false),
      L("ب", "bo", "b", "Ostida bitta nuqta", "بَيْت", "uy"),
      L("ت", "to", "t", "Ustida ikkita nuqta", "تُفَّاح", "olma"),
      L("ث", "so", "s (tiş orasida)", "Ustida uçta nuqta; til tişlar orasida", "ثَلْج", "qor"),
      L("ن", "nun", "n", "Ustida bitta nuqta", "نَار", "olov"),
      L("ي", "yo", "y / uzun i", "Ostida ikkita nuqta; uzun i ham bildiradi", "يَد", "qöl"),
    ] },
    { t: "Ikkinçi harflar", d: "ج ح خ bir oila; د ذ va ر ز juft-juft, ular keyingi harfga ulanmaydi.", l: [
      L("ج", "jim", "j", "Ostida nuqta", "جَمَل", "tuya"),
      L("ح", "ho", "h (böğiq)", "Nuqtasiz; tomoqdan çiqadigan h", "حَلِيب", "sut"),
      L("خ", "xo", "x", "Ustida nuqta; özbekça x", "خُبْز", "non"),
      L("د", "dol", "d", "Keyingi harfga ulanmaydi", "دَرْس", "dars", false),
      L("ذ", "zol", "z (tiş orasida)", "Ustida nuqta; til tişlar orasida", "ذَهَب", "oltin", false),
      L("ر", "ro", "r", "Keyingi harfga ulanmaydi", "رَأْس", "boş", false),
      L("ز", "zay", "z", "Ustida nuqta", "زَيْت", "yoğ", false),
    ] },
    { t: "Uçinçi harflar", d: "Qalin (orqa) tovuşlar va arab tiliga xos ع غ harflari.", l: [
      L("س", "sin", "s", "Uçta tişça", "سَمَك", "baliq"),
      L("ش", "şin", "ş", "Ustida uçta nuqta", "شَمْس", "quyoş"),
      L("ص", "sod", "s (qalin)", "Qalin s", "صَدِيق", "döst"),
      L("ض", "zod", "d (qalin)", "Qalin d", "ضَوْء", "yoruğlik"),
      L("ط", "to (qalin)", "t (qalin)", "Qalin t", "طَالِب", "talaba"),
      L("ظ", "zo", "z (qalin)", "Qalin z", "ظُهْر", "peşin"),
      L("ع", "ayn", "ʼ (böğizdan)", "Tomoq tovuşi, özbek tilida yöq", "عَيْن", "köz"),
      L("غ", "ğayn", "ğ", "Özbekça ğ", "غُرْفَة", "xona"),
    ] },
    { t: "Törtinçi harflar", d: "Bu harflar köp uçraydi. و keyingi harfga ulanmaydi.", l: [
      L("ف", "fo", "f", "Ustida bitta nuqta", "فِيل", "fil"),
      L("ق", "qof", "q", "Ustida ikkita nuqta; özbekça q", "قَلَم", "qalam"),
      L("ك", "kof", "k", "Özbekça k", "كِتَاب", "kitob"),
      L("ل", "lom", "l", "Özbekça l", "لَيْمُون", "limon"),
      L("م", "mim", "m", "Özbekça m", "مَاء", "suv"),
      L("ه", "ha", "h", "Yengil h", "هِلَال", "hilol"),
      L("و", "vov", "v / uzun u", "Uzun u ham bildiradi; ulanmaydi", "وَرْدَة", "atirgul", false),
    ] },
  ],
  marks: [
    ["بَ", "fatha", "ba — harf ustidagi çiziqça: a"],
    ["بِ", "kasra", "bi — harf ostidagi çiziqça: i"],
    ["بُ", "damma", "bu — harf ustidagi kiçik vov: u"],
    ["بْ", "sukun", "b — dumaloq belgi: unli yöq"],
    ["بّ", "şadda", "bb — harf ikki marta aytiladi"],
  ],
};
