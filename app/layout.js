import "./globals.css";
import "./extra.css";
import Link from "next/link";
import { currentUser } from "../lib/auth";
import LogoutButton from "./components/LogoutButton";
import Stats from "./components/Stats";

export const metadata = { title: "Regulus — İngliz tilini özbek tilida örganing", description: "İngliz tilini özbek tilida, kiçik darslar bilan örganing." };

export default async function RootLayout({ children }) {
  const u = await currentUser().catch(() => null);
  return (
    <html lang="uz">
      <body>
        <header className="nav"><div className="wrap">
          <Link href={u ? "/learn" : "/"} className="logo"><i aria-hidden="true" />Regulus</Link>
          {u ? (<>
            <Link className="l" href="/learn">Darslar</Link>
            <Link className="l" href="/review">Takrorlash</Link>
            <Link className="l" href="/dictionary">Luğatim</Link>
            <Link className="l" href="/leaderboard">Reyting</Link>
            <Link className="l" href="/tutor">Ustoz</Link>
            <Link className="l" href="/about">Haqida</Link>
            <span className="sp" />
            <Stats initial={{ hearts: u.hearts, streak: u.streak, xp: u.xp }} />
            <Link className="stat" href="/profile">{u.nickname}</Link>
            <LogoutButton />
          </>) : (<>
            <span className="sp" />
            <Link className="l" href="/about">Haqida</Link>
            <Link className="l" href="/login">Kirish</Link>
            <Link className="btn sm" href="/register">Röyxatdan ötish</Link>
          </>)}
        </div></header>
        {children}
        <footer className="site-footer"><div className="wrap fgrid">
          <div><div className="flogo">Regulus</div><p>İngliz tilini özbek tilida örganing: qisqa darslar, luğat va AI ustoz.</p></div>
          <nav aria-label="Platforma"><h4>Platforma</h4><Link href="/about">Haqida</Link><Link href="/about#qollanma">Qöllanma</Link><Link href="/about#boglanish">Bağlanish</Link></nav>
          {u ? (
            <nav aria-label="Örganiş"><h4>Örganiş</h4><Link href="/learn">Darslar</Link><Link href="/review">Takrorlash</Link><Link href="/dictionary">Luğatim</Link><Link href="/leaderboard">Reyting</Link><Link href="/tutor">AI ustoz</Link></nav>
          ) : (
            <nav aria-label="Boşlash"><h4>Boşlash</h4><Link href="/register">Röyxatdan ötish</Link><Link href="/login">Kirish</Link></nav>
          )}
        </div><div className="wrap fcopy">© 2026 Regulus. Barcha huquqlar himoyalangan.</div></footer>
      </body>
    </html>
  );
}
