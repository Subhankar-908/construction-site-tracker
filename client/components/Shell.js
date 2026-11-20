"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/projects", label: "Projects" },
  { href: "/logs", label: "Daily Logs" },
  { href: "/materials", label: "Materials" },
  { href: "/audit", label: "Audit Trail", roles: ["ADMIN", "MANAGER"] },
];

export default function Shell({ title, children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) return <p className="muted pad">Loading...</p>;

  return (
    <div>
      <header className="nav">
        <strong className="brand">Site Tracker</strong>
        <nav>
          {links
            .filter((l) => !l.roles || l.roles.includes(user.role))
            .map((l) => (
              <Link key={l.href} href={l.href} className={path.startsWith(l.href) ? "active" : ""}>
                {l.label}
              </Link>
            ))}
        </nav>
        <span className="who">
          {user.name} <span className="badge">{user.role}</span>
          <button className="btn ghost" onClick={logout}>Log out</button>
        </span>
      </header>
      <main className="page">
        <h1>{title}</h1>
        {children}
      </main>
    </div>
  );
}
