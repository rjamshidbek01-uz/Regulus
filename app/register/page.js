import { redirect } from "next/navigation";
import { currentUser } from "../../lib/auth";
import AuthForm from "../components/AuthForm";
export const metadata = { title: "Röyxatdan ötish — Regulus" };
export default async function P() {
  if (await currentUser().catch(() => null)) redirect("/learn");
  return <AuthForm mode="register" />;
}
