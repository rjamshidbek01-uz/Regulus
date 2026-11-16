import { Reset } from "../components/Forms";
export const metadata = { title: "Yangi parol — Regulus" };
export default async function P({ searchParams }) {
  const { t } = await searchParams;
  return <Reset token={typeof t === "string" ? t : ""} />;
}
