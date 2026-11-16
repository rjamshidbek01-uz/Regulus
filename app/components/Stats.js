"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// The root layout is not re-rendered on client-side navigation, so keep these numbers fresh here.
export default function Stats({ initial }) {
  const [s, setS] = useState(initial);
  const path = usePathname();
  useEffect(() => { setS(initial); }, [initial.hearts, initial.streak, initial.xp]);
  useEffect(() => {
    let off = false;
    const load = () => fetch("/api/me", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).then((j) => { if (j && !off) setS(j); }).catch(() => {});
    load();
    window.addEventListener("regulus:refresh", load);
    return () => { off = true; window.removeEventListener("regulus:refresh", load); };
  }, [path]);
  return (
    <>
      <Link className="stat" href="/practice" title="Jonlar">♥ {s.hearts}</Link>
      <span className="stat" title="Ketma-ket kunlar">🔥 {s.streak}</span>
      <span className="stat" title="Tajriba ballari">⚡ {s.xp}</span>
    </>
  );
}
