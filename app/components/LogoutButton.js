"use client";
export default function LogoutButton() {
  return <button className="btn alt sm" onClick={async () => { await fetch("/api/logout", { method: "POST" }); location.href = "/"; }}>Çiqiş</button>;
}
