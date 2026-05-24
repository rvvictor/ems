import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CopilotKit } from "@copilotkit/react-core";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistema de Gestión Ambiental",
  description: "Monitoreo y gestión de indicadores ambientales con IA",
};

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <CopilotKit runtimeUrl="/api/copilotkit">{children}</CopilotKit>
    </div>
  );
}