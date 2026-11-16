import { sql } from "../../../lib/db";
import { sha256 } from "../../../lib/auth";
export async function GET(req) {
  const t = new URL(req.url).searchParams.get("t") || "";
  const r = await sql`delete from email_tokens where token_hash=${sha256(t)} and purpose='verify' and expires_at>now() returning user_id`;
  if (r[0]) await sql`update users set email_verified=true where id=${r[0].user_id}`;
  return Response.redirect(new URL(r[0] ? "/login?verified=1" : "/login?verified=0", req.url), 302);
}
