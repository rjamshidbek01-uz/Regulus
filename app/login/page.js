import { redirect } from "next/navigation";
import { currentUser } from "../../lib/auth";
import AuthForm from "../components/AuthForm";
export const metadata = { title: "Kirish — Regulus" };
export default async function P({ searchParams }) {
  if (await currentUser().catch(() => null)) redirect("/learn");
  const { verified } = await searchParams;
  return (<><AuthForm mode="login" notice={verified} /><p style={{ textAlign: "center", marginTop: -24, paddingBottom: 40 }}><a href="/forgot">Parolni unutdingizmi?</a></p></>);
}
