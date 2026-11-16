import { redirect } from "next/navigation";
import { sql } from "../../../lib/db";
import { currentUser } from "../../../lib/auth";
import { buildReview } from "../../../lib/review";
import { glossFor } from "../../../lib/glossary";
import Player from "../../components/Player";

export default async function ReviewRun() {
  const user = await currentUser();
  if (!user) redirect("/login");
  const rows = await sql`select word_en,word_uz from dictionary where user_id=${user.id} order by (wrong_count>0) desc, (next_review<=now()) desc, next_review asc limit 10`;
  if (!rows.length) redirect("/review");
  const ex = buildReview(rows);
  return <Player lessonId={0} exercises={ex} gloss={glossFor(ex)} review />;
}
