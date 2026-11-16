export const metadata = { title: "Haqida — Regulus" };

const crew = [
  ["Jamshidbek Rustamjanov", "https://t.me/jamshidbekrustamjanov", "@jamshidbekrustamjanov"],
  ["Hojiakbar Obidjonov", "https://t.me/Hojiakbar_Obidjonov", "@Hojiakbar_Obidjonov"],
  ["Shohjahon Habibullayev", "https://t.me/Fangtastic_2011", "@Fangtastic_2011"],
];
const steps = [
  ["Bölim va dars tanlang", "Darslar bölimlarga bölingan. Har bölimda 3 ta dars bor va ular ketma-ket oçiladi."],
  ["Har dars 4 qismdan iborat", "Sözlar, Eşitish, Tarjima va Takrorlash. Har qismda yangi mashqlar keladi, takror bölmaydi."],
  ["Söz tarjimasini körish", "İngliz tilidagi söz ustiga sichqoncha kursorini olib boring (telefonda söz ustiga bosing): tarjimasi körinadi. Tarjima söz luğatdagi asosiy shaklida beriladi (masalan, drinks — içmoq), gapdagi qöşimçali shaklida emas."],
  ["Jonlar", "Har kuni 5 ta jon beriladi. Xato qilsangiz bittadan kamayadi. Jonlar tugasa, bölim sinovini (85% aniqlik) topshirib 3 ta jon olasiz yoki ertasi kunni kutasiz."],
  ["Eşitish mashqlari", "Tinglay olmasangiz, “Hozir tinglay olmayman” tugmasini bosing: 1 soat davomida eşitish mashqlari çiqmaydi."],
  ["Takrorlash va xatolar", "Takrorlash bölimi xato qilgan sözlaringizni yiğadi va vaqti kelganlarini eslatadi. Takrorlash jonlarni sarflamaydi."],
  ["AI ustoz", "Xato qilsangiz, “AI tushuntirsin” tugmasini bosing yoki Ustoz bölimida İngliz tili haqida savol bering."],
  ["Ball va kunlar", "Dars tugatsangiz ball olasiz. Har kuni saytga kirsangiz, ketma-ket kunlar soni öşadi."],
  ["Luğatim", "Örgangan har bir söz Luğatim bölimiga tuşadi. U yerda sözni eşitish, qidirish va qaysi sözlar zaifligini körish mumkin."],
  ["Reyting", "Ball böyiça guruhingizdagi eng yaxşi foydalanuvçilar körsatiladi. Har guruhda 200 kişigaça bor."],
];
export default function About() {
  return (
    <main className="wrap" style={{ maxWidth: 760, paddingBottom: 64 }}>
      <h1 className="page-h">Regulus haqida</h1>
      <p className="lead">Regulus — özbek tilida İngliz tilini örgatadigan platforma. Maqsad — har kuni bir necha daqiqa vaqt ajratib, ketma-ket va qiziqarli örganiş.</p>
      <h2 id="qollanma" className="sec-h">Qöllanma: qanday işlaydi</h2>
      <ol className="steps">{steps.map(([t, d]) => <li key={t}><b>{t}</b>{d}</li>)}</ol>
      <h2 className="sec-h">Yaratuvçilar</h2>
      <div className="crew">{crew.map(([n, u, h]) => <div className="card" key={n}><h3>{n}</h3><a href={u} target="_blank" rel="noopener noreferrer">{h}</a></div>)}</div>
      <h2 id="boglanish" className="sec-h">Biz bilan bağlaning</h2>
      <div className="card">
        <p style={{ marginTop: 0 }}>Savol, taklif yoki xato haqida yozmoqçi bölsangiz, Telegram orqali yaratuvçilarga murojaat qiling:</p>
        <ul>{crew.map(([n, u, h]) => <li key={n}>{n}: <a href={u} target="_blank" rel="noopener noreferrer">{h}</a></li>)}</ul>
      </div>
    </main>
  );
}
