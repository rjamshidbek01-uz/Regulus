import { redirect } from "next/navigation";
import { sql } from "../../lib/db";
import { currentUser } from "../../lib/auth";
import Words from "../components/Words";
import { courseFor } from "../../lib/courses";
export const metadata = { title: "Luğatim — Regulus" };

export default async function Dict() {
  const user = await currentUser();
  if (!user) redirect("/login");
  const C = courseFor(user);
  const rows = await sql`select word_en en,word_uz uz,correct_count c,wrong_count w,learned_at at from dictionary where user_id=${user.id} and course=${C.code} order by learned_at desc`;
  return <Words lang={C.speech} dir={C.dir} rows={rows.map((r) => ({ ...r, at: new Date(r.at).toISOString().slice(0, 10) }))} />;
}
