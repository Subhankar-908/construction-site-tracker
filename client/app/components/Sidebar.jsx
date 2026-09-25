"use client";
import Link from "next/link";
export default function Sidebar(){
 return <aside className="sidebar"><h2>🏗️ SiteLog</h2>
 <Link href="/dashboard">Dashboard</Link><Link href="/projects">Projects</Link><Link href="/daily-logs">Daily Logs</Link><Link href="/materials">Materials</Link><Link href="/reviews">Reviews</Link><Link href="/audit">Audit Trail</Link><Link href="/users">Users</Link>
 </aside>
}
