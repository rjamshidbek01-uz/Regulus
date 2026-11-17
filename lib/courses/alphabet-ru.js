// Russian (Cyrillic) alphabet, grouped for learners who already read Latin letters.
// l: [upper+lower, letter name as spoken, sound in Uzbek letters, hint, example word, its meaning]
const L = (g, name, sound, hint, ex, exUz) => ({ g, name, sound, hint, ex, exUz });
export const alphabet = {
  title: "Rus alifbosi",
  intro: "Rus tili kirill yozuvida yoziladi: 33 ta harf. Ularning bir qismi lotin harflariga öxşaydi, ayrimlari esa öxşasa ham boşqaça öqiladi. Har bir harfni bosing va tinglang.",
  groups: [
    { t: "Tanış harflar", d: "Bu harflar lotin harflariga öxşaydi va deyarli xuddi şunday öqiladi.", l: [
      L("А а", "а", "a", "Özbekça a kabi", "арбуз", "tarvuz"),
      L("К к", "ка", "k", "Özbekça k kabi", "кошка", "muşuk"),
      L("М м", "эм", "m", "Özbekça m kabi", "мама", "ona"),
      L("О о", "о", "o", "Urğusiz bölsa a ga yaqin öqiladi", "окно", "oyna"),
      L("Т т", "тэ", "t", "Özbekça t kabi", "торт", "tort"),
    ] },
    { t: "Aldamçi harflar", d: "Diqqat! Bular lotin harflariga öxşaydi, lekin boşqa tovuşni bildiradi.", l: [
      L("В в", "вэ", "v", "B emas — v deb öqiladi", "вода", "suv"),
      L("Е е", "е", "ye", "Söz boşida ye, undoşdan keyin e", "еда", "ovqat"),
      L("Н н", "эн", "n", "H emas — n deb öqiladi", "нос", "burun"),
      L("Р р", "эр", "r", "P emas — r deb öqiladi", "рыба", "baliq"),
      L("С с", "эс", "s", "C emas — s deb öqiladi", "сок", "şarbat"),
      L("У у", "у", "u", "Y emas — u deb öqiladi", "утро", "tong"),
      L("Х х", "ха", "x", "X kabi yoziladi, özbekça x tovuşi", "хлеб", "non"),
    ] },
    { t: "Yangi harflar", d: "Bu harflar lotin yozuvida yöq, lekin tovuşlari özbek tilida bor.", l: [
      L("Б б", "бэ", "b", "Özbekça b", "банан", "banan"),
      L("Г г", "гэ", "g", "Özbekça g", "город", "şahar"),
      L("Д д", "дэ", "d", "Özbekça d", "дом", "uy"),
      L("Ж ж", "жэ", "j", "Özbekça j (jurnal sözidagi kabi)", "жук", "qönğiz"),
      L("З з", "зэ", "z", "Özbekça z", "зонт", "soyabon"),
      L("И и", "и", "i", "Özbekça i", "игра", "öyin"),
      L("Й й", "и краткое", "y", "Qisqa y: май, мой", "йогурт", "yogurt"),
      L("Л л", "эль", "l", "Özbekça l", "лампа", "lampa"),
      L("П п", "пэ", "p", "Özbekça p", "папа", "dada"),
      L("Ф ф", "эф", "f", "Özbekça f", "флаг", "bayroq"),
    ] },
    { t: "Maxsus harflar", d: "Bu harflar alohida tovuş yoki belgini bildiradi — ularni yaxşilab tinglang.", l: [
      L("Ц ц", "цэ", "ts", "t va s birga: цирк", "цветок", "gul"),
      L("Ч ч", "че", "ç", "Özbekça ç", "чай", "çoy"),
      L("Ш ш", "ша", "ş", "Özbekça ş (qattiq)", "шар", "şar"),
      L("Щ щ", "ща", "şç", "Yumşoq va uzun ş", "щётка", "çötka"),
      L("Ы ы", "ы", "ı", "Qattiq i: tilni orqaga tortib aytiladi", "сыр", "pişloq"),
      L("Э э", "э", "e", "Özbekça e (söz boşida)", "это", "bu"),
      L("Ю ю", "ю", "yu", "y + u birga", "юбка", "yubka"),
      L("Я я", "я", "ya", "y + a birga", "яблоко", "olma"),
      L("Ё ё", "ё", "yo", "y + o birga, doim urğuli", "ёж", "tipratikan"),
      L("Ъ ъ", "твёрдый знак", "—", "Qattiq belgi: tovuş bermaydi, ajratib turadi", "подъезд", "kiriş yöli"),
      L("Ь ь", "мягкий знак", "—", "Yumşatiş belgisi: oldingi undoşni yumşatadi", "соль", "tuz"),
    ] },
  ],
};
