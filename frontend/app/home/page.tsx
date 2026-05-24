"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CopilotChat } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import { Space_Grotesk } from "next/font/google";
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import type { FoundryIntakePayload, FoundryUiType } from "@/lib/types/foundry";
import { loadFoundrySession, saveIntakePayload } from "@/lib/foundry-store";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
});

type Step = "intake" | "context" | "format";

const formats: Array<{
  id: FoundryUiType;
  title: string;
  description: string;
  preview: string[];
}> = [
  {
    id: "action_plan",
    title: "Action Plan",
    description: "Operational steps with urgency, owners, timelines, and cost.",
    preview: ["Urgency tiers", "Responsible owners", "Cost estimates"],
  },
  {
    id: "nom001_report",
    title: "NOM-001 Report",
    description: "Compliance table with legal conclusion for authorities.",
    preview: ["Parameter vs limit", "Legal conclusion", "PDF-ready"],
  },
  {
    id: "public_fact_sheet",
    title: "Public Fact Sheet",
    description: "Visitor-friendly status in clear, non-technical language.",
    preview: ["QR-ready copy", "Highlights", "Safety label"],
  },
  {
    id: "allies_directory",
    title: "Allies Directory",
    description: "NGOs, funds, and treatment partners by issue type.",
    preview: ["Local partners", "Funding leads", "Contact info"],
  },
];

const contextFields = [
  { key: "turistas", label: "Tourists per day" },
  { key: "educacion", label: "Environmental education (1-5)" },
  { key: "residuos", label: "Waste management (%)" },
  { key: "dbo", label: "BOD (mg/L)" },
  { key: "ph", label: "pH" },
  { key: "oxibenzona", label: "Oxybenzone (ug/L)" },
  { key: "octinoxato", label: "Octinoxate (ug/L)" },
  { key: "cumplimiento", label: "Regulatory compliance (1-5)" },
  { key: "participacion", label: "Community participation" },
  { key: "bloqueadores", label: "Eco sunscreen usage (%)" },
];

const acceptedFileTypes =
  ".pdf,.xlsx,.xls,.csv,.json,.xml,.md,text/markdown,application/xml,text/xml,image/*";


export default function Home() {
  const [step, setStep] = useState<Step>("intake");
  const [intake, setIntake] = useState<FoundryIntakePayload | null>(null);
  const [contextValues, setContextValues] = useState<Record<string, string>>({
    participacion: "Yes",
  });
  const [intakeStatus, setIntakeStatus] = useState("Waiting for intake.");
  const [intakeError, setIntakeError] = useState<string | null>(null);

  const router = useRouter();

  const canContinue = useMemo(() => Boolean(intake), [intake]);

  useEffect(() => {
    const stored = loadFoundrySession();
    if (stored.intake) {
      setIntake(stored.intake);
      setIntakeStatus("Intake loaded from this session.");
    }
  }, []);

  useCopilotReadable({
    description: "Context form values provided by the user.",
    value: contextValues,
  });

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
        datos_zona,
      };
      setIntake(payload);
      saveIntakePayload(payload);
      setIntakeStatus("Intake captured. You can add missing context now.");
      setStep("context");
      return "OK";
    },
  });

  const goNext = () => {
    if (step === "intake") {
      setStep("context");
      return;
    }
    if (step === "context") {
      if (intake) {
        saveIntakePayload({
          ...intake,
          context: contextValues,
        });
      }
      setStep("format");
    }
  };

  const goBack = () => {
    if (step === "format") setStep("context");
    if (step === "context") setStep("intake");
  };

  const handleSelectFormat = (format: FoundryUiType) => {
    if (!intake) {
      setIntakeError("Intake is required before selecting a format.");
      return;
    }
    saveIntakePayload({
      ...intake,
      context: contextValues,
    });
    router.push(`/expediente?format=${format}`);
  };

  return (
    <div className={`${spaceGrotesk.className} min-h-screen bg-slate-950 text-white`}>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 pb-16 pt-10 lg:flex-row">
        <section className="flex-1 space-y-8">
          <header className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/60">
              Cenote Intake Flow
            </div>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              Turn cenote data into a complete environmental dossier.
            </h1>
            <p className="max-w-2xl text-sm text-white/70 md:text-base">
              Share the prompt and files in the chat. We capture normalized
              data, add missing context, and then select the first output format.
            </p>
          </header>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.7)]">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Step 1 - Intake</h2>
                <span className="rounded-full border border-white/15 px-2 py-1 text-xs text-white/70">
                  {step === "intake" ? "Active" : "Ready"}
                </span>
              </div>
              <div className="mt-5 space-y-4 text-sm text-white/70">
                <p>
                  Use the chat on the right to send your prompt and attach the
                  source files. We keep a single input surface to avoid
                  confusion.
                </p>
                <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-white/50">
                    Intake Checklist
                  </div>
                  <ul className="mt-3 space-y-2 text-xs text-white/70">
                    <li>1. Share the cenote concern and desired outcomes.</li>
                    <li>2. Attach at least one data file (PDF, Excel, JSON).</li>
                    <li>3. Wait for Copilot to confirm the extraction.</li>
                  </ul>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white/70">
                  <div className="text-xs uppercase tracking-[0.2em] text-white/50">
                    Intake Status
                  </div>
                  <p className="mt-2">{intakeStatus}</p>
                  {intakeError ? (
                    <p className="mt-2 text-xs text-rose-200">{intakeError}</p>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Step 2 - Missing Context</h2>
                <span className="rounded-full border border-white/15 px-2 py-1 text-xs text-white/70">
                  {step === "context" ? "Active" : "Pending"}
                </span>
              </div>
              <p className="mt-4 text-sm text-white/70">
                If CopilotKit needs extra context, capture it here so the model
                prompt is complete.
              </p>
              {step === "context" && (
                <div className="mt-4 grid gap-3">
                  {contextFields.map((field) => (
                    <label
                      key={field.key}
                      className="flex flex-col gap-1 text-xs text-white/70"
                    >
                      {field.label}
                      {field.key === "participacion" ? (
                        <select
                          value={contextValues[field.key] ?? "Yes"}
                          onChange={(event) =>
                            setContextValues((prev) => ({
                              ...prev,
                              [field.key]: event.target.value,
                            }))
                          }
                          className="rounded-lg border border-white/15 bg-slate-950/70 p-2 text-sm text-white"
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      ) : (
                        <input
                          value={contextValues[field.key] ?? ""}
                          onChange={(event) =>
                            setContextValues((prev) => ({
                              ...prev,
                              [field.key]: event.target.value,
                            }))
                          }
                          className="rounded-lg border border-white/15 bg-slate-950/70 p-2 text-sm text-white"
                          placeholder="Enter value"
                        />
                      )}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Step 3 - Choose the first format</h2>
              <span className="rounded-full border border-white/15 px-2 py-1 text-xs text-white/70">
                {step === "format" ? "Active" : "Pending"}
              </span>
            </div>
            <p className="mt-3 text-sm text-white/70">
              Pick the first output. The remaining formats will stay available
              once you reach the dossier workspace.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {formats.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectFormat(item.id)}
                  disabled={step !== "format"}
                  className={`rounded-2xl border px-4 py-4 text-left transition ${
                    step === "format"
                      ? "border-emerald-300/50 bg-emerald-300/5 hover:border-emerald-200"
                      : "border-white/10 bg-slate-950/40 opacity-60"
                  }`}
                >
                  <div className="text-sm font-semibold">{item.title}</div>
                  <p className="mt-2 text-xs text-white/70">{item.description}</p>
                  <ul className="mt-3 space-y-1 text-xs text-white/60">
                    {item.preview.map((line) => (
                      <li key={line}>- {line}</li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={goBack}
              className="rounded-full border border-white/20 px-5 py-2 text-sm text-white/70 transition hover:border-white/50"
              disabled={step === "intake"}
            >
              Back
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={step === "format" || (step === "intake" && !canContinue)}
              className="rounded-full bg-emerald-300 px-6 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {step === "context" ? "Review formats" : step === "format" ? "Select a format" : "Continue"}
            </button>
            <div className="text-xs text-white/50">
              {step === "intake" && !canContinue
                ? "Use the chat to register the intake first."
                : "Progress through the flow to select the output format."}
            </div>
          </div>
        </section>

        <aside className="w-full max-w-xl lg:sticky lg:top-10 lg:h-[calc(100vh-6rem)]">
          <div className="flex h-full flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.7)]">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-white/50">
                CopilotKit Chat
              </div>
              <h2 className="mt-2 text-xl font-semibold">Cenote Copilot</h2>
              <p className="mt-2 text-sm text-white/70">
                Share the prompt and files. CopilotKit will extract the data and
                store it without showing model responses.
              </p>
              <div className="mt-3 rounded-xl border border-white/10 bg-slate-950/60 p-3 text-xs text-white/60">
                Supported files: PDF, Excel, CSV, JSON, XML, Markdown, Images.
              </div>
            </div>
            <div className="copilotkit-hide-assistant flex-1 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70">
              <CopilotChat
                instructions={`You are an expert in environmental impact intake. Normalize the user's inputs into the test.json schema.
Do not ask questions in chat and do not output JSON or summaries in chat.
When the data is ready, call registerIntake with usuario_prompt and datos_zona.
Context values: ${JSON.stringify(contextValues)}.`}
                labels={{
                  title: "Cenote Copilot",
                  initial:
                    "Hi! Share the prompt and files, and I will prepare the intake.",
                  placeholder: "Describe the cenote concern...",
                }}
                attachments={{
                  enabled: true,
                  accept: acceptedFileTypes,
                  maxSize: 20 * 1024 * 1024,
                }}
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}