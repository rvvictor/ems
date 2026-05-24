"use client";

import { CopilotSidebar } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import Sidebar from "@/components/ui/Sidebar";
import { indicadoresMock, alertasMock } from "@/data/components/mock";
import { useCopilotReadable } from "@copilotkit/react-core";

export default function DashboardPage() {
  useCopilotReadable({
    description: "Resumen del sistema de gestión ambiental",
    value: { indicadores: indicadoresMock, alertas: alertasMock },
  });

  const criticos = indicadoresMock.filter(i => i.estado === "critico").length;
  const alertasActivas = alertasMock.filter(a => !a.resuelta).length;

  return (
    <CopilotSidebar
      instructions="Eres un asistente experto en gestión ambiental. Analiza indicadores, alertas y reportes. Puedes sugerir acciones y explicar tendencias."
      labels={{ title: "Asistente Ambiental" }}
      defaultOpen={false}
    >
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-bold mb-6">Dashboard General</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Indicadores" value={indicadoresMock.length} color="blue" />
            <StatCard label="Alertas activas" value={alertasActivas} color="yellow" />
            <StatCard label="Críticos" value={criticos} color="red" />
            <StatCard label="Estaciones" value={3} color="green" />
          </div>
        </main>
      </div>
    </CopilotSidebar>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
    red: "bg-red-50 border-red-200 text-red-700",
    green: "bg-green-50 border-green-200 text-green-700",
  };
  return (
    <div className={`border rounded-xl p-5 ${colors[color]}`}>
      <p className="text-sm opacity-70">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}