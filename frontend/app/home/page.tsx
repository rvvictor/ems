"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CopilotChat } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import { Space_Grotesk } from "next/font/google";
import { useCopilotAction } from "@copilotkit/react-core";
import type { FoundryIntakePayload } from "@/lib/types/foundry";
import { createDossier } from "@/lib/foundry-store";
import { ArrowRight, TreePine, Sparkles, X } from "lucide-react";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
});

const acceptedFileTypes =
  ".pdf,.xlsx,.xls,.csv,.json,.xml,.md,text/markdown,application/xml,text/xml,image/*";

export default function Home() {
  const [pendiente, setPendiente] = useState<FoundryIntakePayload | null>(null);
  const [errorIntake, setErrorIntake] = useState<string | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nombreDossier, setNombreDossier] = useState("");
  const router = useRouter();

  useCopilotAction({
    name: "registerIntake",
    description:
      "Guardar los datos ambientales normalizados para el flujo de expediente.",
    parameters: [
      {
        name: "usuario_prompt",
        type: "string",
        description: "Solicitud del usuario en lenguaje natural.",
      },
      {
        name: "datos_zona",
        type: "object",
        description: "Datos normalizados siguiendo el esquema test.json.",
      },
    ],
    handler: async ({ usuario_prompt, datos_zona }) => {
      setErrorIntake(null);
      const payload: FoundryIntakePayload = {
        usuario_prompt,
        datos_zona: datos_zona as Record<string, unknown>,
      };
      setPendiente(payload);
      setMostrarModal(true);
      setNombreDossier("");
      return "OK";
    },
  });

  const handleCrearExpediente = () => {
    if (!pendiente) return;
    const nombre = nombreDossier.trim() || `Cenote ${new Date().toLocaleDateString()}`;
    const dossier = createDossier(nombre, pendiente);
    setMostrarModal(false);
    setPendiente(null);
    router.push(`/expediente?id=${dossier.id}`);
  };

  return (
    <div className={`${spaceGrotesk.className} min-h-screen bg-cream text-dark`}>
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6">
        <nav className="flex items-center justify-between py-6">
          <div className="flex items-center gap-3">
            <img src="/logo.jpeg" alt="EMS" className="h-10 w-10 rounded-xl object-cover" />
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary">EMS</p>
              <p className="text-sm font-semibold">Sistema de Monitoreo Ambiental</p>
            </div>
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
Responde siempre en español latinoamericano.
No hagas preguntas, no muestres JSON ni resúmenes en el chat.
Cuando los datos estén listos, llama a registerIntake con usuario_prompt y datos_zona.`}
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

            {errorIntake && (
              <p className="mt-4 text-xs text-primary">{errorIntake}</p>
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

      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-secondary bg-surface p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Nuevo expediente</h2>
              <button
                onClick={() => setMostrarModal(false)}
                className="rounded-full p-1 text-dark/40 transition hover:bg-dark/5 hover:text-dark"
              >
                <X size={18} />
              </button>
            </div>
            <p className="mt-2 text-sm text-dark/60">
              Ponle un nombre a este expediente para identificarlo después.
            </p>
            <input
              value={nombreDossier}
              onChange={(e) => setNombreDossier(e.target.value)}
              placeholder="Ej: Cenote Azul - Mayo 2026"
              className="mt-4 w-full rounded-xl border border-secondary bg-cream p-3 text-sm text-dark outline-none transition focus:border-primary"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCrearExpediente();
              }}
            />
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setMostrarModal(false)}
                className="rounded-full border border-secondary px-5 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-dark/60 transition hover:border-dark/30"
              >
                Cancelar
              </button>
              <button
                onClick={handleCrearExpediente}
                className="inline-flex items-center gap-2 rounded-full bg-dark px-5 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-cream transition hover:bg-dark/85"
              >
                Crear expediente <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
