import { redirect } from "next/navigation";
import { currentUser } from "../../lib/auth";
import TutorChat from "../components/TutorChat";
export const metadata = { title: "AI ustoz — Regulus" };
export default async function Tutor() {
  if (!(await currentUser())) redirect("/login");
  return <TutorChat />;
}
