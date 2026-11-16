import { redirect } from "next/navigation";
import { sql } from "../../lib/db";
import { currentUser } from "../../lib/auth";
import { ProfileForms } from "../components/Forms";
export const metadata = { title: "Profil — Regulus" };

export default async function Profile() {
  const user = await currentUser();
  if (!user) redirect("/login");
  const [u] = await sql`select email,nickname,xp,(case when last_active>=(now() at time zone 'Asia/Tashkent')::date-1 then streak else 0 end) as streak,created_at from users where id=${user.id}`;
  return (
    <main className="wrap" style={{ maxWidth: 560, paddingBottom: 56 }}>
      <h1 style={{ fontSize: 40, margin: "32px 0 16px" }}>Profil</h1>
      <div className="card">
        <p style={{ margin: 0 }}><b>{u.nickname}</b></p>
        <p style={{ margin: "4px 0" }}>{u.email}</p>
        <p style={{ margin: 0 }}>⚡ {u.xp} ball · 🔥 {u.streak} kun · {new Date(u.created_at).toISOString().slice(0, 10)} dan beri bizdasiz</p>
      </div>
      <ProfileForms />
    </main>
  );
}
