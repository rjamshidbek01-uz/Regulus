import "@fontsource-variable/fredoka/wght.css";
import "@fontsource-variable/nunito/wght.css";
import "./globals.css";
import Link from "next/link";
import { currentUser } from "../lib/auth";
import LogoutButton from "./components/LogoutButton";
import Stats from "./components/Stats";
import { NavLinks, TabBar } from "./components/Nav";
import HelpBubble from "./components/HelpBubble";

export const metadata = { title: "Regulus — İngliz tilini özbek tilida örganing", description: "İngliz tilini özbek tilida, kiçik darslar bilan örganing." };
export const viewport = { width: "device-width", initialScale: 1, themeColor: "#0b1034" };

export default async function RootLayout({ children }) {
  const u = await currentUser().catch(() => null);
  return (
    <html lang="uz">
      <body>
        <div className="sky" aria-hidden="true" />
        <header className="nav"><div className="nav-in">
          <Link href={u ? "/learn" : "/"} className={`logo ${u ? "in" : ""}`} aria-label="Regulus"><i aria-hidden="true" /><span>Regulus</span></Link>
          {u ? (<>
            <NavLinks />
            <span className="sp" />
            <Stats initial={{ hearts: u.hearts, streak: u.streak, xp: u.xp }} />
            <Link className="avatar" href="/profile" title={u.nickname} aria-label={`Profil: ${u.nickname}`}>{u.nickname[0]}</Link>
            <span className="only-wide"><LogoutButton /></span>
          </>) : (<>
            <span className="sp" />
            <Link className="l only-wide" href="/about">Haqida</Link>
            <Link className="l" href="/login">Kiriş</Link>
            <Link className="btn sm" href="/register">Röyxatdan ötiş</Link>
          </>)}
        </div></header>
        {children}
        <footer className="site-footer"><div className="wrap fgrid">
          <div><div className="flogo">Regulus</div><p>İngliz tilini özbek tilida örganing: qisqa darslar, luğat va AI ustoz.</p></div>
          <nav aria-label="Platforma"><h4>Platforma</h4><Link href="/about">Haqida</Link><Link href="/about#qollanma">Qöllanma</Link><Link href="/about#boglanish">Bağlaniş</Link></nav>
          {u ? (
            <nav aria-label="Örganiş"><h4>Örganiş</h4><Link href="/learn">Darslar</Link><Link href="/review">Takrorlaş</Link><Link href="/dictionary">Luğatim</Link><Link href="/leaderboard">Reyting</Link><Link href="/tutor">AI ustoz</Link></nav>
          ) : (
            <nav aria-label="Boşlaş"><h4>Boşlaş</h4><Link href="/register">Röyxatdan ötiş</Link><Link href="/login">Kiriş</Link></nav>
          )}
        </div><div className="wrap fcopy">© 2026 Regulus. Barça huquqlar himoyalangan.</div></footer>
        {u && <TabBar />}
        <HelpBubble loggedIn={!!u} />
      </body>
    </html>
  );
}
