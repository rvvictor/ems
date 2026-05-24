"use client";

import { useMemo, useState } from "react";
import { CopilotChat } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
});

type Step = "intake" | "context" | "template" | "result";

const templates = [
  {
    id: "dashboard",
    title: "Impact Dashboard",
    description: "Cards, charts, and KPIs for rapid scanning.",
  },
  {
    id: "report",
    title: "Executive Report",
    description: "Narrative sections with data-backed highlights.",
  },
  {
    id: "map",
    title: "Coastal Map",
    description: "Geo-focused insights and hotspot layers.",
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
  ".pdf,.xlsx,.xls,.csv,.json,.xml,.md,text/markdown,application/xml,text/xml";

export default function Home() {
  const [step, setStep] = useState<Step>("intake");
  const [intakeReady, setIntakeReady] = useState(false);
  const [template, setTemplate] = useState("dashboard");
  const [contextValues, setContextValues] = useState<Record<string, string>>({
    participacion: "Yes",
  });

  const canContinue = useMemo(() => intakeReady, [intakeReady]);

  const currentTemplate = templates.find((item) => item.id === template);

  const goNext = () => {
    if (step === "intake") setStep("context");
    if (step === "context") setStep("template");
    if (step === "template") setStep("result");
  };

  const goBack = () => {
    if (step === "result") setStep("template");
    if (step === "template") setStep("context");
    if (step === "context") setStep("intake");
  };

  return (
    <div
      className={`${spaceGrotesk.className} relative min-h-screen bg-slate-950 text-white`}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(60% 60% at 80% 10%, rgba(20, 184, 166, 0.14), transparent 60%), radial-gradient(60% 60% at 10% 90%, rgba(56, 189, 248, 0.12), transparent 60%)",
        }}
      />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 pb-16 pt-10 lg:flex-row">
        <section className="flex-1 space-y-8">
          <header className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/60">
              Coastal Impact Flow
            </div>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              Turn coastal data into immediate environmental action.
            </h1>
            <p className="max-w-2xl text-sm text-white/70 md:text-base">
              Start with a prompt and a source file. CopilotKit will extract
              the data, collect missing context, and prepare a structured
              briefing for the Azure Foundry random forest model.
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
                    <li>1. Share the coastal concern and desired output.</li>
                    <li>2. Attach at least one data file (PDF, Excel, JSON).</li>
                    <li>3. Wait for Copilot to confirm the extraction.</li>
                  </ul>
                </div>
                <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white/70">
                  <input
                    type="checkbox"
                    checked={intakeReady}
                    onChange={(event) => setIntakeReady(event.target.checked)}
                    className="h-4 w-4 accent-cyan-300"
                  />
                  I have sent the prompt and files in the chat.
                </label>
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
              <h2 className="text-lg font-semibold">Step 3 - Choose a Template</h2>
              <span className="rounded-full border border-white/15 px-2 py-1 text-xs text-white/70">
                {step === "template" ? "Active" : "Pending"}
              </span>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {templates.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTemplate(item.id)}
                  className={`rounded-xl border px-4 py-4 text-left transition ${
                    template === item.id
                      ? "border-cyan-300/70 bg-cyan-300/10"
                      : "border-white/10 bg-slate-950/40 hover:border-white/40"
                  }`}
                >
                  <div className="text-sm font-semibold">{item.title}</div>
                  <p className="mt-2 text-xs text-white/70">{item.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Step 4 - Black Box Output</h2>
              <span className="rounded-full border border-white/15 px-2 py-1 text-xs text-white/70">
                {step === "result" ? "Active" : "Pending"}
              </span>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-white/50">
                  Model Status
                </div>
                <div className="mt-3 text-lg font-semibold">Black Box Ready</div>
                <p className="mt-2 text-sm text-white/70">
                  Azure Foundry Random Forest (placeholder) will ingest the
                  extracted data once the intake is locked.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-white/50">
                  UI Preview
                </div>
                <div className="mt-3 text-sm text-white/70">
                  Template: {currentTemplate?.title}
                </div>
                <div className="mt-3 h-24 rounded-lg border border-dashed border-white/15 bg-white/5" />
                <p className="mt-3 text-xs text-white/60">
                  This is a black box placeholder. The real UI renders after
                  model inference.
                </p>
              </div>
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
              disabled={step === "intake" && !canContinue}
              className="rounded-full bg-cyan-300 px-6 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {step === "template" ? "Lock Template" : "Continue"}
            </button>
            <div className="text-xs text-white/50">
              {step === "intake" && !canContinue
                ? "Use the chat, then confirm the intake checkbox."
                : "Progress through the flow to unlock the final UI."}
            </div>
          </div>
        </section>

        <aside className="w-full max-w-xl lg:sticky lg:top-10 lg:h-[calc(100vh-6rem)]">
          <div className="flex h-full flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.7)]">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-white/50">
                CopilotKit Chat
              </div>
              <h2 className="mt-2 text-xl font-semibold">Coastal Copilot</h2>
              <p className="mt-2 text-sm text-white/70">
                Ask CopilotKit to extract, summarize, and request missing
                context. Attach files directly in the chat.
              </p>
              <div className="mt-3 rounded-xl border border-white/10 bg-slate-950/60 p-3 text-xs text-white/60">
                Supported files: PDF, Excel, CSV, JSON, XML, Markdown.
              </div>
            </div>
            <div className="flex-1 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70">
              <CopilotChat
                instructions="You are an expert in coastal environmental impact. Extract data from uploaded files, ask for missing context, and propose the best presentation template (dashboard, report, or map)."
                labels={{
                  title: "Coastal Copilot",
                  initial:
                    "Hi! Share a prompt and a file, and I will help structure the analysis.",
                  placeholder: "Describe the coastal concern...",
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