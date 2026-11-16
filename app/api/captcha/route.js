import { newChallenge, limit, ipOf, json } from "../../../lib/security";
export async function GET(req) {
  if (!(await limit(`cap:${ipOf(req)}`, 60, 600))) return json({ error: "limit" }, 429);
  return json(newChallenge());
}
