"use client";
import Sidebar from "./Sidebar";import Topbar from "./Topbar";
export default function LayoutShell({title,children}){return <div className="shell"><Sidebar/><main className="content"><Topbar title={title}/>{children}</main></div>}
