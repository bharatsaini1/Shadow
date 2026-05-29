"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout({ children, onNewSimulation }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-paper dark:bg-ink">
      <Sidebar />
      <Topbar onMenuToggle={() => setMobileSidebarOpen((v) => !v)} />
      <main className="pt-[52px] md:pl-[260px] transition-all duration-300 min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
