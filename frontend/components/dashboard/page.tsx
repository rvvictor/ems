"use client";

import Link from "next/link";
import Sidebar from "@/components/ui/Sidebar";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Dashboard Deprecated</h1>
        <p className="mt-3 text-sm text-white/70">
          The dossier flow is now consolidated on the Results Workspace.
        </p>
        <Link
          href="/expediente"
          className="mt-6 inline-flex rounded-full border border-white/20 px-5 py-2 text-sm text-white/80 transition hover:border-white/60"
        >
          Go to Results Workspace
        </Link>
      </main>
    </div>
  );
}