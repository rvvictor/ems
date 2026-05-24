"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CopilotChat } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import { Space_Grotesk } from "next/font/google";
import { useCopilotAction } from "@copilotkit/react-core";
import type { FoundryIntakePayload } from "@/lib/types/foundry";
import { loadFoundrySession, saveIntakePayload } from "@/lib/foundry-store";
import { ArrowRight, TreePine, Sparkles } from "lucide-react";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
});

const acceptedFileTypes =
  ".pdf,.xlsx,.xls,.csv,.json,.xml,.md,text/markdown,application/xml,text/xml,image/*";

export default function Home() {
  const [intake, setIntake] = useState<FoundryIntakePayload | null>(null);
  const [intakeStatus, setIntakeStatus] = useState("Esperando datos...");
  const [intakeError, setIntakeError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const stored = loadFoundrySession();
    if (stored.intake) {
      setIntake(stored.intake);
      setIntakeStatus("Datos capturados. Ve al dossier.");
    }
  }, []);

  useCopilotAction({
    name: "registerIntake",
    description:
      "Store normalized environmental intake data for the cenote dossier flow.",
    parameters: [
      {
        name: "usuario_prompt",
        type: "string",
        description: "User request in natural language.",
      },
      {
        name: "datos_zona",
        type: "object",
        description: "Normalized data matching the test.json schema.",
      },
    ],
    handler: async ({ usuario_prompt, datos_zona }) => {
      setIntakeError(null);
      const payload: FoundryIntakePayload = {
        usuario_prompt,
        datos_zona: datos_zona as Record<string, unknown>,
      };
      setIntake(payload);
      saveIntakePayload(payload);
      setIntakeStatus("Datos capturados. Ve al dossier.");
      return "OK";
    },
  });

  return (
    <div className={`${spaceGrotesk.className} min-h-screen bg-cream text-dark`}>
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6">
        <nav className="flex items-center justify-between py-6">
          <div className="flex items-center gap-3">
            <img src="/logo.jpeg" alt="EMS" className="h-10 w-10 rounded-xl object-cover" />
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary">
                EMS
              </p>
              <p className="text-sm font-semibold">Environmental Monitoring System</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {intake && (
              <button
                type="button"
                onClick={() => router.push("/expediente")}
                className="inline-flex items-center gap-2 rounded-full bg-dark px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cream transition hover:bg-dark/85"
              >
                Ir al Dossier <ArrowRight size={14} />
              </button>
            )}
          </div>
        </nav>

        <main className="flex flex-1 flex-col items-center justify-center gap-8 pb-20 pt-10">
          <div className="max-w-xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-secondary bg-surface px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-primary">
              <Sparkles size={14} />
              Inteligencia Ambiental
            </div>
            <h1 className="text-3xl font-bold md:text-4xl">
              Cuéntanos sobre tu cenote
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-dark/60">
              Describe la situación y adjunta tus archivos de medición. El asistente
              preparará los datos para generar el expediente ambiental.
            </p>
          </div>

          <div className="w-full max-w-2xl">
            <div className="input-only-chat overflow-hidden rounded-2xl border border-secondary bg-surface shadow-sm">
              <CopilotChat
                instructions={`Eres un experto en impacto ambiental especializado en cenotes.
Normaliza los datos del usuario al esquema test.json.
No hagas preguntas, no muestres JSON ni resúmenes en el chat.
Cuando los datos estén listos, llama a registerIntake con usuario_prompt y datos_zona.
Si el usuario necesita ir al dossier, indícale que vaya a /expediente.`}
                labels={{
                  title: "Asistente Ambiental",
                  initial:
                    "Describe la situación del cenote y adjunta los archivos de medición.",
                  placeholder: "Escribe aquí la situación del cenote...",
                }}
                attachments={{
                  enabled: true,
                  accept: acceptedFileTypes,
                  maxSize: 20 * 1024 * 1024,
                }}
              />
            </div>

            {intakeStatus && (
              <div className="mt-4 flex items-center gap-2 text-xs text-dark/50">
                <span className="flex h-2 w-2 rounded-full" />
                {intakeStatus}
              </div>
            )}
            {intakeError && (
              <p className="mt-4 text-xs text-primary">{intakeError}</p>
            )}
          </div>
        </main>

        <footer className="flex items-center justify-between border-t border-secondary py-6 text-xs text-dark/60">
          <div className="flex items-center gap-2">
            <TreePine size={14} className="text-primary" />
            <span className="font-medium text-dark/80">EMS</span>
          </div>
          <p>&copy; {new Date().getFullYear()}. Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  );
}
