import { destroySession } from "../../../lib/auth";
import { sameOrigin, json } from "../../../lib/security";
export async function POST(req) {
  if (!sameOrigin(req)) return json({ error: "bad" }, 400);
  await destroySession();
  return json({ ok: true });
}
