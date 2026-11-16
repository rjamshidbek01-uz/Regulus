import Link from "next/link";
import Regi from "./components/Regi";
export const metadata = { title: "Sahifa topilmadi — Regulus" };
export default function NotFound() {
  return (
    <main className="wrap" style={{ maxWidth: 520, padding: "48px 16px" }}>
      <div className="card empty"><Regi mood="think" size={130} /><h2>Bu sahifa topilmadi</h2><p>Regi ham qidirdi, lekin bu yerda heç narsa yöq.</p><Link className="btn" href="/">Boş sahifaga qaytiş</Link></div>
    </main>
  );
}
