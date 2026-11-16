"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./Icon";

const ITEMS = [
  ["/learn", "Darslar", "home"],
  ["/review", "Takrorlaş", "repeat"],
  ["/dictionary", "Luğatim", "book"],
  ["/leaderboard", "Reyting", "trophy"],
  ["/tutor", "Ustoz", "chat"],
];
function Links() {
  const path = usePathname() || "";
  return ITEMS.map(([href, label, icon]) => {
    const on = path === href || path.startsWith(href + "/") || (href === "/learn" && path.startsWith("/practice"));
    return <Link key={href} href={href} className={`l ${on ? "on" : ""}`} aria-current={on ? "page" : undefined}><Icon n={icon} />{label}</Link>;
  });
}
export function NavLinks() { return <nav className="navlinks" aria-label="Asosiy"><Links /></nav>; }
export function TabBar() { return <nav className="tabbar" aria-label="Asosiy"><Links /></nav>; }
