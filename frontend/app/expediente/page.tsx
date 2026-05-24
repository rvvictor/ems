"use client";

import { useEffect, useMemo, useState } from "react";
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

const formatLabel: Record<FoundryUiType, string> = {
  action_plan: "Action Plan",
  nom001_report: "NOM-001 Report",
  public_fact_sheet: "Public Fact Sheet",
  allies_directory: "Allies Directory",
};

export default function ExpedientePage() {
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
      <div className="flex min-h-screen bg-slate-950 text-white">
        <Sidebar />
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-semibold">Cenote Dossier</h1>
          <p className="mt-3 text-white/70">
            No intake data found. Start from the intake flow to capture the cenote context.
          </p>
          <Link
            href="/home"
            className="mt-6 inline-flex rounded-full border border-white/20 px-5 py-2 text-sm text-white/80 transition hover:border-white/60"
          >
            Go to Intake
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar />
      <main className="flex-1 p-8">
        <header className="flex flex-col gap-3">
          <div className="text-xs uppercase tracking-[0.25em] text-emerald-200/70">
            Cenote dossier
          </div>
          <h1 className="text-3xl font-semibold">Results Workspace</h1>
          <p className="max-w-2xl text-sm text-white/70">
            Each output builds on the same intake data. Generate one format at a time
            and grow a complete dossier for the cenote.
          </p>
        </header>

        {generationError ? (
          <div className="mt-6 rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-100">
            {generationError}
          </div>
        ) : null}

        <section className="mt-8">
          <div className="flex flex-wrap gap-2">
            {availableOutputs.length === 0 ? (
              <span className="text-sm text-white/60">No outputs yet.</span>
            ) : (
              availableOutputs.map((output) => (
                <button
                  key={output.ui_type}
                  type="button"
                  onClick={() => setActiveTab(output.ui_type)}
                  className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition ${
                    activeTab === output.ui_type
                      ? "border-emerald-300/70 bg-emerald-300/10 text-emerald-100"
                      : "border-white/15 text-white/70 hover:border-white/40"
                  }`}
                >
                  {formatLabel[output.ui_type]}
                </button>
              ))
            )}
          </div>

          {activeTab ? (
            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/60 p-6">
              <FormatOutput output={session.outputs[activeTab] ?? null} />
            </div>
          ) : null}
        </section>

        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Add another format</h2>
            <span className="text-xs text-white/50">
              {missingFormats.length} remaining
            </span>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {missingFormats.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <p className="mt-2 text-xs text-white/70">{item.description}</p>
                <ul className="mt-3 space-y-1 text-xs text-white/60">
                  {item.preview.map((line) => (
                    <li key={line}>- {line}</li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => handleGenerate(item.id)}
                  disabled={isGenerating}
                  className="mt-4 w-full rounded-full border border-emerald-300/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100 transition hover:border-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isGenerating ? "Generating..." : "Generate"}
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function FormatOutput({ output }: { output: FoundryUiPayload | null }) {
  if (!output) {
    return (
      <p className="text-sm text-white/70">
        Select a format to see the generated content.
      </p>
    );
  }

  if (output.ui_type === "action_plan") {
    return (
      <section className="space-y-4">
        <header>
          <h2 className="text-2xl font-semibold">{output.title}</h2>
          <p className="mt-2 text-white/70">{output.summary}</p>
        </header>
        <div className="grid gap-4 md:grid-cols-2">
          {output.actions.map((action, index) => (
            <article
              key={`${action.action}-${index}`}
              className="rounded-xl border border-white/10 bg-slate-950/60 p-4"
            >
              <div className="text-xs uppercase tracking-[0.2em] text-emerald-200/70">
                {action.urgency} urgency
              </div>
              <h3 className="mt-2 text-base font-semibold">{action.action}</h3>
              <p className="mt-2 text-sm text-white/70">
                Owner: {action.owner} · Deadline: {action.deadline}
              </p>
              <p className="mt-1 text-sm text-white/70">
                Estimated cost: {action.estimated_cost}
              </p>
              {action.notes ? (
                <p className="mt-2 text-xs text-white/60">{action.notes}</p>
              ) : null}
            </article>
          ))}
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold">Next steps</h3>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            {output.next_steps.map((step, index) => (
              <li key={`${step}-${index}`}>- {step}</li>
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
          <h2 className="text-2xl font-semibold">{output.title}</h2>
          <p className="mt-2 text-white/70">{output.summary}</p>
        </header>
        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-xs uppercase tracking-[0.2em] text-white/60">
              <tr>
                <th className="px-4 py-3">Parameter</th>
                <th className="px-4 py-3">Value</th>
                <th className="px-4 py-3">Limit</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {output.parameters.map((row, index) => (
                <tr key={`${row.parameter}-${index}`} className="border-t border-white/10">
                  <td className="px-4 py-3 text-white/80">{row.parameter}</td>
                  <td className="px-4 py-3 text-white/70">{row.value}</td>
                  <td className="px-4 py-3 text-white/70">{row.limit}</td>
                  <td className="px-4 py-3 text-white/70">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold">Legal conclusion</h3>
          <p className="mt-2 text-sm text-white/70">{output.legal_conclusion}</p>
          <div className="mt-4">
            <h4 className="text-xs uppercase tracking-[0.2em] text-white/50">References</h4>
            <ul className="mt-2 space-y-1 text-xs text-white/60">
              {output.references.map((item, index) => (
                <li key={`${item}-${index}`}>- {item}</li>
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
          <div className="text-xs uppercase tracking-[0.2em] text-emerald-200/70">
            {output.safety_label} status
          </div>
          <h2 className="text-2xl font-semibold">{output.headline}</h2>
          <p className="mt-2 text-white/70">{output.summary}</p>
        </header>
        <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold">Highlights</h3>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            {output.highlights.map((item, index) => (
              <li key={`${item}-${index}`}>- {item}</li>
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
          <h2 className="text-2xl font-semibold">{output.title}</h2>
          <p className="mt-2 text-white/70">{output.summary}</p>
        </header>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {output.allies.map((ally, index) => (
            <article
              key={`${ally.name}-${index}`}
              className="rounded-xl border border-white/10 bg-slate-950/60 p-4"
            >
              <div className="text-xs uppercase tracking-[0.2em] text-emerald-200/70">
                {ally.category}
              </div>
              <h3 className="mt-2 text-base font-semibold">{ally.name}</h3>
              <p className="mt-2 text-sm text-white/70">Focus: {ally.focus}</p>
              <p className="mt-1 text-sm text-white/70">Region: {ally.region}</p>
              <p className="mt-1 text-sm text-white/70">Contact: {ally.contact}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return null;
}
