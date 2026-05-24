"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { requestFoundryOutput } from "@/lib/foundry-client";
import {
  getDossier,
  getAllDossiers,
  updateDossierOutput,
  deleteDossier,
  renameDossier,
} from "@/lib/foundry-store";
import type {
  Dossier,
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
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  AlertTriangle,
  Circle,
  TrendingDown,
  Gauge,
  Skull,
  ChevronRight,
  ExternalLink,
  Info,
} from "lucide-react";

const formatos: Array<{
  id: FoundryUiType;
  titulo: string;
  descripcion: string;
  preview: string[];
  icono: typeof ClipboardList;
}> = [
  {
    id: "action_plan",
    titulo: "Plan de Acción",
    descripcion: "Pasos operativos con nivel de urgencia, responsables, plazos y costos.",
    preview: ["Niveles de urgencia", "Responsables asignados", "Estimación de costos"],
    icono: ClipboardList,
  },
  {
    id: "nom001_report",
    titulo: "Informe NOM-001",
    descripcion: "Tabla de cumplimiento normativo con conclusión legal para autoridades.",
    preview: ["Parámetros vs límites", "Conclusión legal", "Listo para PDF"],
    icono: FileSpreadsheet,
  },
  {
    id: "public_fact_sheet",
    titulo: "Ficha Pública",
    descripcion: "Resumen en lenguaje claro para visitantes del cenote.",
    preview: ["Listo para código QR", "Aspectos destacados", "Etiqueta de seguridad"],
    icono: FileText,
  },
  {
    id: "allies_directory",
    titulo: "Directorio de Aliados",
    descripcion: "ONGs, fondos y socios de tratamiento organizados por tipo de problema.",
    preview: ["Socios locales", "Contactos de financiamiento", "Información de contacto"],
    icono: Users,
  },
];

const etiquetaFormato: Record<FoundryUiType, string> = {
  action_plan: "Plan de Acción",
  nom001_report: "Informe NOM-001",
  public_fact_sheet: "Ficha Pública",
  allies_directory: "Directorio de Aliados",
};

export default function ExpedientePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-teal-surface text-teal-dark">
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-teal-dark border-t-transparent" />
            Cargando...
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
  const router = useRouter();
  const dossierId = searchParams.get("id");

  const [lista, setLista] = useState<Dossier[]>([]);
  const [actual, setActual] = useState<Dossier | null>(null);
  const [pestanaActiva, setPestanaActiva] = useState<FoundryUiType | null>(null);
  const [generando, setGenerando] = useState(false);
  const [errorGeneracion, setErrorGeneracion] = useState<string | null>(null);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [nombreEdit, setNombreEdit] = useState("");

  const refrescar = () => {
    const todos = getAllDossiers();
    setLista(todos);
    if (dossierId) {
      const d = getDossier(dossierId);
      setActual(d);
      if (d && d.session.order.length > 0 && !pestanaActiva) {
        setPestanaActiva(d.session.order[0]);
      }
    } else if (todos.length > 0) {
      router.replace(`/expediente?id=${todos[0].id}`);
    }
  };

  useEffect(() => {
    refrescar();
  }, [dossierId]);

  const sesion = actual?.session ?? null;

  const formatosFaltantes = useMemo(() => {
    if (!sesion) return [];
    return formatos.filter((f) => !sesion.outputs[f.id]);
  }, [sesion]);

  const formatosDisponibles = useMemo(() => {
    if (!sesion) return [];
    return sesion.order
      .map((t) => sesion.outputs[t])
      .filter(Boolean) as FoundryUiPayload[];
  }, [sesion]);

  const handleGenerar = async (tipo: FoundryUiType) => {
    if (!actual?.session?.intake || generando) return;

    setGenerando(true);
    setErrorGeneracion(null);

    try {
      const previos = Object.values(actual.session.outputs).filter(
        Boolean
      ) as FoundryUiPayload[];
      const resultado = await requestFoundryOutput({
        intake: actual.session.intake,
        uiType: tipo,
        previousOutputs: previos,
      });
      updateDossierOutput(actual.id, resultado);
      refrescar();
      setPestanaActiva(tipo);
    } catch (error) {
      setErrorGeneracion((error as Error).message);
    } finally {
      setGenerando(false);
    }
  };

  const handleEliminar = (id: string) => {
    deleteDossier(id);
    if (id === actual?.id) {
      router.push("/expediente");
    } else {
      refrescar();
    }
  };

  const handleRenombrar = (id: string) => {
    const name = nombreEdit.trim();
    if (!name) return;
    renameDossier(id, name);
    setEditandoId(null);
    refrescar();
  };

  const iniciarEdicion = (d: Dossier) => {
    setEditandoId(d.id);
    setNombreEdit(d.name);
  };

  if (!actual || !sesion) {
    return (
      <div className="flex min-h-screen bg-teal-surface text-teal-dark">
        <BarraDossier
          dossiers={lista}
          actualId={null}
          editandoId={editandoId}
          nombreEdit={nombreEdit}
          onSeleccionar={(id) => router.push(`/expediente?id=${id}`)}
          onEliminar={handleEliminar}
          onIniciarEdicion={iniciarEdicion}
          onNombreEdit={setNombreEdit}
          onConfirmarRenombrar={handleRenombrar}
          onCancelarEdicion={() => setEditandoId(null)}
        />
        <main className="flex flex-1 items-center justify-center p-8">
          <div className="max-w-sm text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-light/50">
              <FileText size={28} className="text-teal-dark" />
            </div>
            <h1 className="text-2xl font-bold">Expediente Ambiental</h1>
            <p className="mt-3 text-sm text-teal-dark/60">
              Aún no tienes expedientes. Crea uno desde el chat de inteligencia ambiental.
            </p>
            <Link
              href="/home"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-teal-dark px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-dark/85"
            >
              Ir al chat <ArrowRight size={14} />
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-teal-surface text-teal-dark">
      <BarraDossier
        dossiers={lista}
        actualId={actual.id}
        editandoId={editandoId}
        nombreEdit={nombreEdit}
        onSeleccionar={(id) => router.push(`/expediente?id=${id}`)}
        onEliminar={handleEliminar}
        onIniciarEdicion={iniciarEdicion}
        onNombreEdit={setNombreEdit}
        onConfirmarRenombrar={handleRenombrar}
        onCancelarEdicion={() => setEditandoId(null)}
      />
      <main className="flex-1 p-8">
        <header className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="text-xs uppercase tracking-[0.25em] text-teal-primary">
              Expediente ambiental
            </div>
            <span className="rounded-full border border-teal-secondary bg-white px-3 py-0.5 text-xs text-teal-dark/60">
              {actual.name}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-teal-dark">{actual.name}</h1>
          {sesion.intake && (
            <p className="max-w-2xl text-sm text-teal-dark/50">
              Consulta: {sesion.intake.usuario_prompt}
            </p>
          )}
        </header>

        {errorGeneracion ? (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            {errorGeneracion}
          </div>
        ) : null}

        <section className="mt-8">
          <div className="flex flex-wrap gap-2">
            {formatosDisponibles.length === 0 ? (
              <span className="text-sm text-teal-dark/50">
                Aún no hay reportes generados.
              </span>
            ) : (
              formatosDisponibles.map((output) => (
                <button
                  key={output.ui_type}
                  type="button"
                  onClick={() => setPestanaActiva(output.ui_type)}
                  className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition ${
                    pestanaActiva === output.ui_type
                      ? "border-teal-dark bg-teal-dark text-white"
                      : "border-teal-secondary text-teal-dark/60 hover:border-teal-dark/40"
                  }`}
                >
                  {etiquetaFormato[output.ui_type]}
                </button>
              ))
            )}
          </div>

          {pestanaActiva ? (
            <div className="mt-6 rounded-2xl border border-teal-light bg-white p-6 shadow-sm">
              <FormatoVisual output={sesion.outputs[pestanaActiva] ?? null} />
            </div>
          ) : null}
        </section>

        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-teal-dark">
              Generar otro formato
            </h2>
            <span className="text-xs text-teal-dark/50">
              {formatosFaltantes.length} restantes
            </span>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {formatosFaltantes.map((f) => {
              const Icono = f.icono;
              return (
                <div
                  key={f.id}
                  className="rounded-2xl border border-teal-light bg-white p-4 transition hover:shadow-sm"
                >
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-teal-surface text-teal-primary">
                    <Icono size={18} />
                  </div>
                  <h3 className="text-sm font-semibold text-teal-dark">{f.titulo}</h3>
                  <p className="mt-2 text-xs text-teal-dark/60">{f.descripcion}</p>
                  <ul className="mt-3 space-y-1 text-xs text-teal-dark/50">
                    {f.preview.map((linea) => (
                      <li key={linea} className="flex items-center gap-1.5">
                        <span className="h-1 w-1 rounded-full bg-teal-primary" />
                        {linea}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => handleGenerar(f.id)}
                    disabled={generando}
                    className="mt-4 w-full rounded-full border border-teal-primary/50 bg-teal-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-teal-dark transition hover:bg-teal-primary/15 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {generando ? (
                      <span className="inline-flex items-center gap-2">
                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-teal-dark border-t-transparent" />
                        Generando...
                      </span>
                    ) : (
                      "Generar"
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

function BarraDossier({
  dossiers,
  actualId,
  editandoId,
  nombreEdit,
  onSeleccionar,
  onEliminar,
  onIniciarEdicion,
  onNombreEdit,
  onConfirmarRenombrar,
  onCancelarEdicion,
}: {
  dossiers: Dossier[];
  actualId: string | null;
  editandoId: string | null;
  nombreEdit: string;
  onSeleccionar: (id: string) => void;
  onEliminar: (id: string) => void;
  onIniciarEdicion: (d: Dossier) => void;
  onNombreEdit: (name: string) => void;
  onConfirmarRenombrar: (id: string) => void;
  onCancelarEdicion: () => void;
}) {
  return (
    <aside className="flex w-64 flex-col gap-1 border-r border-teal-light bg-white p-4">
      <Link
        href="/"
        className="mb-4 flex items-center gap-2 text-sm font-semibold text-teal-dark"
      >
        <img src="/logo.jpeg" alt="EMS" className="h-7 w-7 rounded-lg object-cover" />
        EMS
      </Link>

      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.2em] text-teal-dark/40">
          Expedientes
        </span>
        <Link
          href="/home"
          className="rounded-full p-1 text-teal-dark/40 transition hover:bg-teal-surface hover:text-teal-dark"
        >
          <Plus size={16} />
        </Link>
      </div>

      <div className="mt-3 flex flex-col gap-1">
        {dossiers.length === 0 && (
          <p className="text-xs text-teal-dark/40">Sin expedientes</p>
        )}
        {dossiers.map((d) => (
          <div key={d.id} className="group">
            {editandoId === d.id ? (
              <div className="flex items-center gap-1">
                <input
                  value={nombreEdit}
                  onChange={(e) => onNombreEdit(e.target.value)}
                  className="flex-1 rounded-lg border border-teal-primary bg-teal-surface px-2 py-1.5 text-xs outline-none text-teal-dark"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onConfirmarRenombrar(d.id);
                    if (e.key === "Escape") onCancelarEdicion();
                  }}
                />
                <button
                  onClick={() => onConfirmarRenombrar(d.id)}
                  className="rounded p-1 text-teal-primary transition hover:bg-teal-surface"
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={onCancelarEdicion}
                  className="rounded p-1 text-teal-dark/40 transition hover:bg-teal-surface"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onSeleccionar(d.id)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition ${
                  d.id === actualId
                    ? "bg-teal-dark font-medium text-white"
                    : "text-teal-dark/60 hover:bg-teal-surface hover:text-teal-dark"
                }`}
              >
                <span className="truncate">{d.name}</span>
                <div
                  className={`flex items-center gap-0.5 ${
                    d.id === actualId ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      onIniciarEdicion(d);
                    }}
                    className={`rounded p-0.5 transition ${
                      d.id === actualId
                        ? "hover:bg-white/20"
                        : "hover:bg-teal-surface"
                    }`}
                  >
                    <Edit3 size={12} />
                  </span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`¿Eliminar "${d.name}"?`)) onEliminar(d.id);
                    }}
                    className={`rounded p-0.5 transition ${
                      d.id === actualId
                        ? "hover:bg-white/20"
                        : "hover:bg-red-50 hover:text-red-500"
                    }`}
                  >
                    <Trash2 size={12} />
                  </span>
                </div>
              </button>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}

/* ────────────── COMPONENTE DE VISUALIZACIÓN ────────────── */

function FormatoVisual({ output }: { output: FoundryUiPayload | null }) {
  if (!output) {
    return (
      <p className="text-sm text-teal-dark/60">
        Selecciona un formato para ver su contenido.
      </p>
    );
  }

  if (output.ui_type === "action_plan") {
    return <PlanAccion output={output} />;
  }
  if (output.ui_type === "nom001_report") {
    return <InformeNom output={output} />;
  }
  if (output.ui_type === "public_fact_sheet") {
    return <FichaPublica output={output} />;
  }
  if (output.ui_type === "allies_directory") {
    return <DirectorioAliados output={output} />;
  }
  return null;
}

/* ── PLAN DE ACCIÓN ── */

const URGENCIA_CONFIG = {
  critical: {
    etiqueta: "Crítico",
    color: "bg-red-500",
    bg: "bg-red-50",
    borde: "border-l-red-500",
    texto: "text-red-700",
    icono: Skull,
  },
  high: {
    etiqueta: "Alto",
    color: "bg-orange-400",
    bg: "bg-orange-50",
    borde: "border-l-orange-400",
    texto: "text-orange-700",
    icono: AlertTriangle,
  },
  medium: {
    etiqueta: "Medio",
    color: "bg-yellow-400",
    bg: "bg-yellow-50",
    borde: "border-l-yellow-400",
    texto: "text-yellow-700",
    icono: Circle,
  },
  low: {
    etiqueta: "Bajo",
    color: "bg-teal-primary",
    bg: "bg-teal-surface",
    borde: "border-l-teal-primary",
    texto: "text-teal-dark",
    icono: TrendingDown,
  },
};

function PlanAccion({
  output,
}: {
  output: Extract<FoundryUiPayload, { ui_type: "action_plan" }>;
}) {
  return (
    <section className="space-y-6">
      <header className="border-b border-teal-light pb-4">
        <h2 className="text-2xl font-bold text-teal-dark">{output.title}</h2>
        <p className="mt-2 text-sm text-teal-dark/60">{output.summary}</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {output.actions.map((accion, idx) => {
          const cfg = URGENCIA_CONFIG[accion.urgency];
          const Icono = cfg.icono;
          return (
            <article
              key={`${accion.action}-${idx}`}
              className={`border-l-4 ${cfg.borde} rounded-r-xl border border-teal-light ${cfg.bg} p-4 transition hover:shadow-sm`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${cfg.color} ${cfg.texto}`}
                >
                  <Icono size={14} />
                  {cfg.etiqueta}
                </span>
              </div>
              <h3 className="mt-3 text-base font-semibold text-teal-dark">
                {accion.action}
              </h3>
              <div className="mt-3 space-y-1.5 text-sm text-teal-dark/60">
                <p>
                  <span className="font-medium text-teal-dark/80">Responsable:</span>{" "}
                  {accion.owner}
                </p>
                <p>
                  <span className="font-medium text-teal-dark/80">Fecha límite:</span>{" "}
                  {accion.deadline}
                </p>
                <p>
                  <span className="font-medium text-teal-dark/80">Costo estimado:</span>{" "}
                  {accion.estimated_cost}
                </p>
              </div>
              {accion.notes ? (
                <p className="mt-3 text-xs text-teal-dark/50">{accion.notes}</p>
              ) : null}
            </article>
          );
        })}
      </div>

      {/* Próximos pasos — sección destacada */}
      <div className="rounded-xl border-2 border-teal-primary/30 bg-gradient-to-r from-teal-surface to-white p-5">
        <div className="flex items-center gap-2">
          <ChevronRight size={20} className="text-teal-primary" />
          <h3 className="text-base font-bold text-teal-dark">Próximos pasos</h3>
        </div>
        <ol className="mt-4 space-y-3">
          {output.next_steps.map((paso, idx) => (
            <li key={`${paso}-${idx}`} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-dark text-xs font-bold text-white">
                {idx + 1}
              </span>
              <span className="pt-0.5 text-sm text-teal-dark/70">{paso}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── INFORME NOM-001 ── */

const STATUS_CONFIG = {
  ok: {
    etiqueta: "Cumple",
    bg: "bg-green-50",
    texto: "text-green-700",
    borde: "border-l-green-500",
    icono: CheckCircle2,
  },
  exceeds: {
    etiqueta: "Excede",
    bg: "bg-orange-50",
    texto: "text-orange-700",
    borde: "border-l-orange-500",
    icono: AlertTriangle,
  },
  missing: {
    etiqueta: "Faltante",
    bg: "bg-red-50",
    texto: "text-red-700",
    borde: "border-l-red-500",
    icono: AlertCircle,
  },
};

function InformeNom({
  output,
}: {
  output: Extract<FoundryUiPayload, { ui_type: "nom001_report" }>;
}) {
  return (
    <section className="space-y-6">
      <header className="border-b border-teal-light pb-4">
        <h2 className="text-2xl font-bold text-teal-dark">{output.title}</h2>
        <p className="mt-2 text-sm text-teal-dark/60">{output.summary}</p>
      </header>

      <div className="overflow-hidden rounded-xl border border-teal-light">
        <table className="w-full text-left text-sm">
          <thead className="bg-teal-surface text-xs uppercase tracking-[0.2em] text-teal-dark/60">
            <tr>
              <th className="px-4 py-3">Parámetro</th>
              <th className="px-4 py-3">Valor</th>
              <th className="px-4 py-3">Límite</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {output.parameters.map((row, idx) => {
              const cfg = STATUS_CONFIG[row.status];
              const Icono = cfg.icono;
              return (
                <tr
                  key={`${row.parameter}-${idx}`}
                  className={`border-l-4 ${cfg.borde} border-t border-teal-light ${cfg.bg} transition hover:brightness-95`}
                >
                  <td className="px-4 py-3 font-medium text-teal-dark/80">
                    {row.parameter}
                  </td>
                  <td className="px-4 py-3 text-teal-dark/60">{row.value}</td>
                  <td className="px-4 py-3 text-teal-dark/60">{row.limit}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.bg} ${cfg.texto}`}
                    >
                      <Icono size={14} />
                      {cfg.etiqueta}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-teal-light bg-teal-surface p-5">
        <div className="flex items-start gap-3">
          <Gauge size={20} className="mt-0.5 text-teal-primary" />
          <div>
            <h3 className="text-sm font-bold text-teal-dark">Conclusión legal</h3>
            <p className="mt-2 text-sm text-teal-dark/70">{output.legal_conclusion}</p>
          </div>
        </div>
      </div>

      {output.references.length > 0 && (
        <div className="rounded-xl border border-teal-light bg-white p-4">
          <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-teal-dark/50">
            <ExternalLink size={14} />
            Referencias
          </h4>
          <ul className="mt-3 space-y-1.5">
            {output.references.map((ref, idx) => (
              <li key={`${ref}-${idx}`} className="flex items-start gap-2 text-xs text-teal-dark/60">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-primary" />
                {ref}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

/* ── FICHA PÚBLICA ── */

const SEGURIDAD_CONFIG = {
  safe: {
    etiqueta: "Seguro",
    bg: "bg-green-50",
    texto: "text-green-700",
    icono: CheckCircle2,
  },
  caution: {
    etiqueta: "Precaución",
    bg: "bg-yellow-50",
    texto: "text-yellow-700",
    icono: AlertTriangle,
  },
  restricted: {
    etiqueta: "Restringido",
    bg: "bg-red-50",
    texto: "text-red-700",
    icono: Skull,
  },
};

function FichaPublica({
  output,
}: {
  output: Extract<FoundryUiPayload, { ui_type: "public_fact_sheet" }>;
}) {
  const seg = SEGURIDAD_CONFIG[output.safety_label];
  const IconoSeg = seg.icono;

  return (
    <section className="space-y-6">
      <header className="border-b border-teal-light pb-4">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold ${seg.bg} ${seg.texto}`}
        >
          <IconoSeg size={18} />
          {seg.etiqueta}
        </span>
        <h2 className="mt-4 text-2xl font-bold text-teal-dark">{output.headline}</h2>
        <p className="mt-2 text-sm text-teal-dark/60">{output.summary}</p>
      </header>

      <div className="rounded-xl border border-teal-light bg-teal-surface p-5">
        <div className="flex items-center gap-2">
          <Info size={18} className="text-teal-primary" />
          <h3 className="text-sm font-bold text-teal-dark">Aspectos destacados</h3>
        </div>
        <ul className="mt-4 space-y-3">
          {output.highlights.map((item, idx) => (
            <li key={`${item}-${idx}`} className="flex items-start gap-3 text-sm text-teal-dark/70">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-teal-primary" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ── DIRECTORIO DE ALIADOS ── */

const CATEGORIA_COLORES: Record<string, { bg: string; texto: string }> = {
  ngo: { bg: "bg-blue-50", texto: "text-blue-700" },
  fund: { bg: "bg-green-50", texto: "text-green-700" },
  treatment: { bg: "bg-purple-50", texto: "text-purple-700" },
  research: { bg: "bg-cyan-50", texto: "text-cyan-700" },
  government: { bg: "bg-orange-50", texto: "text-orange-700" },
  private: { bg: "bg-gray-50", texto: "text-gray-700" },
};

function DirectorioAliados({
  output,
}: {
  output: Extract<FoundryUiPayload, { ui_type: "allies_directory" }>;
}) {
  return (
    <section className="space-y-6">
      <header className="border-b border-teal-light pb-4">
        <h2 className="text-2xl font-bold text-teal-dark">{output.title}</h2>
        <p className="mt-2 text-sm text-teal-dark/60">{output.summary}</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {output.allies.map((aliado, idx) => {
          const colores = CATEGORIA_COLORES[aliado.category] ?? {
            bg: "bg-teal-surface",
            texto: "text-teal-dark",
          };
          return (
            <article
              key={`${aliado.name}-${idx}`}
              className="rounded-xl border border-teal-light bg-white p-4 transition hover:border-teal-secondary hover:shadow-sm"
            >
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${colores.bg} ${colores.texto}`}
              >
                {aliado.category === "ngo"
                  ? "ONG"
                  : aliado.category === "fund"
                    ? "Fondo"
                    : aliado.category === "treatment"
                      ? "Tratamiento"
                      : aliado.category === "research"
                        ? "Investigación"
                        : aliado.category === "government"
                          ? "Gobierno"
                          : "Privado"}
              </span>
              <h3 className="mt-3 text-base font-semibold text-teal-dark">
                {aliado.name}
              </h3>
              <p className="mt-2 text-sm text-teal-dark/60">
                <span className="font-medium text-teal-dark/80">Enfoque:</span>{" "}
                {aliado.focus}
              </p>
              <p className="mt-1 text-sm text-teal-dark/60">
                <span className="font-medium text-teal-dark/80">Región:</span>{" "}
                {aliado.region}
              </p>
              <p className="mt-1 text-sm text-teal-dark/60">
                <span className="font-medium text-teal-dark/80">Contacto:</span>{" "}
                {aliado.contact}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
