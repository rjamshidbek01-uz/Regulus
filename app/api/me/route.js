import { currentUser } from "../../../lib/auth";
import { json } from "../../../lib/security";

export async function GET() {
  const u = await currentUser();
  if (!u) return json({ error: "auth" }, 401);
  return json({ hearts: u.hearts, streak: u.streak, xp: u.xp });
}
