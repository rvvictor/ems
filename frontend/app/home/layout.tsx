import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CopilotKit } from "@copilotkit/react-core";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistema de Gestión Ambiental",
  description: "Monitoreo y gestión de indicadores ambientales con IA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <CopilotKit runtimeUrl="/api/copilotkit">
          {children}
        </CopilotKit>
      </body>
    </html>
  );
}