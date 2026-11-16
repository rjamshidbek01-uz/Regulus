import { redirect } from "next/navigation";
import { sql } from "../../lib/db";
import { currentUser } from "../../lib/auth";
import { ProfileForms } from "../components/Forms";
import LogoutButton from "../components/LogoutButton";
import Regi from "../components/Regi";
export const metadata = { title: "Profil — Regulus" };

export default async function Profile() {
  const user = await currentUser();
  if (!user) redirect("/login");
  const [u] = await sql`select email,nickname,xp,(case when last_active>=(now() at time zone 'Asia/Tashkent')::date-1 then streak else 0 end) as streak,created_at from users where id=${user.id}`;
  return (
    <main className="wrap" style={{ maxWidth: 560, paddingBottom: 56 }}>
      <h1 className="page-h">Profil</h1>
      <div className="card" style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        <Regi mood="happy" size={84} head />
        <div style={{ flex: 1, minWidth: 180 }}>
          <h2 style={{ fontSize: 26 }}>{u.nickname}</h2>
          <p style={{ margin: "4px 0", overflowWrap: "anywhere" }}>{u.email}</p>
          <p style={{ margin: 0 }}>⚡ {u.xp} ball · 🔥 {u.streak} kun · {new Date(u.created_at).toISOString().slice(0, 10)} dan beri bizdasiz</p>
        </div>
        <LogoutButton />
      </div>
      <ProfileForms />
    </main>
  );
}
