import { neon } from "@neondatabase/serverless";
let q;
export function sql(strings, ...values) {
  q ||= neon(process.env.DATABASE_URL);
  return q(strings, ...values);
}
