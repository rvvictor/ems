"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Sidebar from "@/components/ui/Sidebar";
import { requestFoundryOutput } from "@/lib/foundry-client";
import {
  loadFoundrySession,
  saveFoundryOutput,
} from "@/lib/foundry-store";
import type {
  FoundrySession,
  FoundryUiPayload,
  FoundryUiType,
} from "@/lib/types/foundry";
import {
  ClipboardList,
  FileSpreadsheet,
  FileText,
  Users,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const formats: Array<{
  id: FoundryUiType;
  title: string;
  description: string;
  preview: string[];
  icon: typeof ClipboardList;
}> = [
  {
    id: "action_plan",
    title: "Action Plan",
    description: "Operational steps with urgency, owners, timelines, and cost.",
    preview: ["Urgency tiers", "Responsible owners", "Cost estimates"],
    icon: ClipboardList,
  },
  {
    id: "nom001_report",
    title: "NOM-001 Report",
    description: "Compliance table with legal conclusion for authorities.",
    preview: ["Parameter vs limit", "Legal conclusion", "PDF-ready"],
    icon: FileSpreadsheet,
  },
  {
    id: "public_fact_sheet",
    title: "Public Fact Sheet",
    description: "Visitor-friendly status in clear, non-technical language.",
    preview: ["QR-ready copy", "Highlights", "Safety label"],
    icon: FileText,
  },
  {
    id: "allies_directory",
    title: "Allies Directory",
    description: "NGOs, funds, and treatment partners by issue type.",
    preview: ["Local partners", "Funding leads", "Contact info"],
    icon: Users,
  },
];

const formatLabel: Record<FoundryUiType, string> = {
  action_plan: "Action Plan",
  nom001_report: "NOM-001 Report",
  public_fact_sheet: "Public Fact Sheet",
  allies_directory: "Allies Directory",
};

export default function ExpedientePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-cream text-dark">
          <div className="flex items-center gap-3 text-primary">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            Loading dossier...
          </div>
        </div>
      }
    >
      <ExpedienteContent />
    </Suspense>
  );
}

function ExpedienteContent() {
  const searchParams = useSearchParams();
  const [session, setSession] = useState<FoundrySession>(() => loadFoundrySession());
  const [activeTab, setActiveTab] = useState<FoundryUiType | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const initialFormat = searchParams.get("format") as FoundryUiType | null;

  const missingFormats = useMemo(() => {
    return formats.filter((item) => !session.outputs[item.id]);
  }, [session.outputs]);

  const availableOutputs = useMemo(() => {
    return session.order
      .map((uiType) => session.outputs[uiType])
      .filter(Boolean) as FoundryUiPayload[];
  }, [session.order, session.outputs]);

  const refreshSession = () => setSession(loadFoundrySession());

  const handleGenerate = async (uiType: FoundryUiType) => {
    if (!session.intake || isGenerating) {
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const previousOutputs = Object.values(session.outputs).filter(Boolean) as FoundryUiPayload[];
      const output = await requestFoundryOutput({
        intake: session.intake,
        uiType,
        previousOutputs,
      });
      saveFoundryOutput(output);
      refreshSession();
      setActiveTab(uiType);
    } catch (error) {
      setGenerationError((error as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (!session.intake) {
      return;
    }

    if (initialFormat && !session.outputs[initialFormat]) {
      void handleGenerate(initialFormat);
      return;
    }

    if (!activeTab && session.order.length > 0) {
      setActiveTab(session.order[0]);
    }
  }, [initialFormat, session, activeTab]);

  if (!session.intake) {
    return (
      <div className="flex min-h-screen bg-cream text-dark">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="mx-auto max-w-2xl pt-16 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-dark/5">
              <FileText size={28} className="text-primary" />
            </div>
            <h1 className="text-2xl font-bold">EMS Dossier</h1>
            <p className="mt-3 text-dark/60">
              No intake data found. Start from the intake flow to capture the cenote context.
            </p>
            <Link
              href="/home"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-dark px-5 py-2.5 text-sm font-medium text-cream transition hover:bg-dark/85"
            >
              Go to Intake <ArrowRight size={14} />
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-cream text-dark">
      <Sidebar />
      <main className="flex-1 p-8">
        <header className="flex flex-col gap-3">
          <div className="text-xs uppercase tracking-[0.25em] text-primary/70">
            EMS dossier
          </div>
          <h1 className="text-3xl font-bold">Results Workspace</h1>
          <p className="max-w-2xl text-sm text-dark/60">
            Each output builds on the same intake data. Generate one format at a time
            and grow a complete dossier for the cenote.
          </p>
        </header>

        {generationError ? (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-rose-300 bg-rose-50 p-4 text-sm text-rose-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            {generationError}
          </div>
        ) : null}

        <section className="mt-8">
          <div className="flex flex-wrap gap-2">
            {availableOutputs.length === 0 ? (
              <span className="text-sm text-dark/50">No outputs yet.</span>
            ) : (
              availableOutputs.map((output) => (
                <button
                  key={output.ui_type}
                  type="button"
                  onClick={() => setActiveTab(output.ui_type)}
                  className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition ${
                    activeTab === output.ui_type
                      ? "border-primary/60 bg-primary/10 text-primary"
                      : "border-dark/15 text-dark/60 hover:border-dark/30"
                  }`}
                >
                  {formatLabel[output.ui_type]}
                </button>
              ))
            )}
          </div>

          {activeTab ? (
            <div className="mt-6 rounded-2xl border border-secondary/40 bg-surface p-6">
              <FormatOutput output={session.outputs[activeTab] ?? null} />
            </div>
          ) : null}
        </section>

        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Add another format</h2>
            <span className="text-xs text-dark/50">
              {missingFormats.length} remaining
            </span>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {missingFormats.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-secondary/40 bg-surface p-4"
                >
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-dark/5 text-primary">
                    <Icon size={18} />
                  </div>
                  <h3 className="text-sm font-semibold">{item.title}</h3>
                  <p className="mt-2 text-xs text-dark/60">{item.description}</p>
                  <ul className="mt-3 space-y-1 text-xs text-dark/50">
                    {item.preview.map((line) => (
                      <li key={line} className="flex items-center gap-1.5">
                        <span className="h-1 w-1 rounded-full bg-primary" />
                        {line}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => handleGenerate(item.id)}
                    disabled={isGenerating}
                    className="mt-4 w-full rounded-full border border-primary/50 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary transition hover:bg-primary/15 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isGenerating ? (
                      <span className="inline-flex items-center gap-2">
                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        Generating...
                      </span>
                    ) : (
                      "Generate"
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

function FormatOutput({ output }: { output: FoundryUiPayload | null }) {
  if (!output) {
    return (
      <p className="text-sm text-dark/60">
        Select a format to see the generated content.
      </p>
    );
  }

  if (output.ui_type === "action_plan") {
    return (
      <section className="space-y-4">
        <header>
          <h2 className="text-2xl font-bold text-dark">{output.title}</h2>
          <p className="mt-2 text-dark/60">{output.summary}</p>
        </header>
        <div className="grid gap-4 md:grid-cols-2">
          {output.actions.map((action, index) => (
            <article
              key={`${action.action}-${index}`}
              className="rounded-xl border border-secondary/30 bg-cream/50 p-4"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${
                    action.urgency === "critical"
                      ? "bg-red-500"
                      : action.urgency === "high"
                        ? "bg-orange-400"
                        : action.urgency === "medium"
                          ? "bg-yellow-400"
                          : "bg-primary"
                  }`}
                />
                <span className="text-xs uppercase tracking-[0.15em] text-dark/50">
                  {action.urgency} urgency
                </span>
              </div>
              <h3 className="mt-2 text-base font-semibold">{action.action}</h3>
              <p className="mt-2 text-sm text-dark/60">
                Owner: {action.owner} &middot; Deadline: {action.deadline}
              </p>
              <p className="mt-1 text-sm text-dark/60">
                Estimated cost: {action.estimated_cost}
              </p>
              {action.notes ? (
                <p className="mt-2 text-xs text-dark/50">{action.notes}</p>
              ) : null}
            </article>
          ))}
        </div>
        <div className="rounded-xl border border-secondary/30 bg-cream/50 p-4">
          <h3 className="text-sm font-semibold">Next steps</h3>
          <ul className="mt-3 space-y-2 text-sm text-dark/60">
            {output.next_steps.map((step, index) => (
              <li key={`${step}-${index}`} className="flex items-start gap-2">
                <ArrowRight size={14} className="mt-0.5 shrink-0 text-primary" />
                {step}
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  if (output.ui_type === "nom001_report") {
    return (
      <section className="space-y-4">
        <header>
          <h2 className="text-2xl font-bold text-dark">{output.title}</h2>
          <p className="mt-2 text-dark/60">{output.summary}</p>
        </header>
        <div className="overflow-hidden rounded-xl border border-secondary/30">
          <table className="w-full text-left text-sm">
            <thead className="bg-dark/5 text-xs uppercase tracking-[0.2em] text-dark/50">
              <tr>
                <th className="px-4 py-3">Parameter</th>
                <th className="px-4 py-3">Value</th>
                <th className="px-4 py-3">Limit</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {output.parameters.map((row, index) => (
                <tr key={`${row.parameter}-${index}`} className="border-t border-secondary/20">
                  <td className="px-4 py-3 text-dark/80">{row.parameter}</td>
                  <td className="px-4 py-3 text-dark/60">{row.value}</td>
                  <td className="px-4 py-3 text-dark/60">{row.limit}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium ${
                        row.status === "ok"
                          ? "text-green-600"
                          : row.status === "exceeds"
                            ? "text-orange-600"
                            : "text-red-600"
                      }`}
                    >
                      {row.status === "ok" ? (
                        <CheckCircle2 size={12} />
                      ) : (
                        <AlertCircle size={12} />
                      )}
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-xl border border-secondary/30 bg-cream/50 p-4">
          <h3 className="text-sm font-semibold">Legal conclusion</h3>
          <p className="mt-2 text-sm text-dark/60">{output.legal_conclusion}</p>
          <div className="mt-4">
            <h4 className="text-xs uppercase tracking-[0.2em] text-dark/50">References</h4>
            <ul className="mt-2 space-y-1 text-xs text-dark/50">
              {output.references.map((item, index) => (
                <li key={`${item}-${index}`} className="flex items-start gap-1.5">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    );
  }

  if (output.ui_type === "public_fact_sheet") {
    return (
      <section className="space-y-4">
        <header>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
              output.safety_label === "safe"
                ? "bg-green-100 text-green-700"
                : output.safety_label === "caution"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
            }`}
          >
            {output.safety_label} status
          </span>
          <h2 className="mt-3 text-2xl font-bold text-dark">{output.headline}</h2>
          <p className="mt-2 text-dark/60">{output.summary}</p>
        </header>
        <div className="rounded-xl border border-secondary/30 bg-cream/50 p-4">
          <h3 className="text-sm font-semibold">Highlights</h3>
          <ul className="mt-3 space-y-2 text-sm text-dark/60">
            {output.highlights.map((item, index) => (
              <li key={`${item}-${index}`} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  if (output.ui_type === "allies_directory") {
    return (
      <section className="space-y-4">
        <header>
          <h2 className="text-2xl font-bold text-dark">{output.title}</h2>
          <p className="mt-2 text-dark/60">{output.summary}</p>
        </header>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {output.allies.map((ally, index) => (
            <article
              key={`${ally.name}-${index}`}
              className="rounded-xl border border-secondary/30 bg-cream/50 p-4"
            >
              <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.1em] text-primary">
                {ally.category}
              </span>
              <h3 className="mt-3 text-base font-semibold">{ally.name}</h3>
              <p className="mt-2 text-sm text-dark/60">Focus: {ally.focus}</p>
              <p className="mt-1 text-sm text-dark/60">Region: {ally.region}</p>
              <p className="mt-1 text-sm text-dark/60">Contact: {ally.contact}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return null;
}
