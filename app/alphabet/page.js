import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "../../lib/auth";
import { courseFor } from "../../lib/courses";
import Regi from "../components/Regi";
import AlphabetView from "../components/AlphabetView";
export const metadata = { title: "Alifbo — Regulus" };

// Letters page for courses that use a non-Latin script (Russian, Arabic).
export default async function Alphabet() {
  const user = await currentUser();
  if (!user) redirect("/login");
  const C = courseFor(user);
  if (!C.alphabet) redirect("/learn");
  const abc = C.alphabet;
  return (
    <main className="wrap" style={{ paddingBottom: 56 }}>
      <Link href="/learn" className="back">← Yulduzlar xaritasi</Link>
      <h1 className="page-h" style={{ marginTop: 8 }}>{abc.title}</h1>
      <div className="buddy" style={{ marginBottom: 24 }}>
        <Regi mood="happy" size={84} />
        <div className="bubble" style={{ flex: 1 }}><p style={{ margin: 0 }}>{abc.intro}</p></div>
      </div>
      <AlphabetView abc={{ ...abc }} lang={C.speech} dir={C.dir} />
    </main>
  );
}
