import { redirect } from "next/navigation";
import { currentUser } from "../../lib/auth";
import TutorChat from "../components/TutorChat";
import { courseFor } from "../../lib/courses";
export const metadata = { title: "AI ustoz — Regulus" };
export default async function Tutor() {
  const user = await currentUser();
  if (!user) redirect("/login");
  const C = courseFor(user);
  return <TutorChat name={C.name} code={C.code} />;
}
