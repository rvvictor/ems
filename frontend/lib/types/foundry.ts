export type FoundryUiType =
  | "action_plan"
  | "nom001_report"
  | "public_fact_sheet"
  | "allies_directory";

export type FoundryUrgency = "low" | "medium" | "high" | "critical";
export type FoundryComplianceStatus = "ok" | "exceeds" | "missing";
export type FoundrySafetyLabel = "safe" | "caution" | "restricted";
export type FoundryAllyCategory =
  | "ngo"
  | "fund"
  | "treatment"
  | "research"
  | "government"
  | "private";

export interface FoundryActionItem {
  action: string;
  urgency: FoundryUrgency;
  owner: string;
  deadline: string;
  estimated_cost: string;
  notes?: string;
}

export interface FoundryNomParameter {
  parameter: string;
  value: string;
  limit: string;
  status: FoundryComplianceStatus;
}

export interface FoundryAlly {
  name: string;
  category: FoundryAllyCategory;
  focus: string;
  region: string;
  contact: string;
}

export interface FoundryActionPlanPayload {
  ui_type: "action_plan";
  title: string;
  summary: string;
  actions: FoundryActionItem[];
  next_steps: string[];
}

export interface FoundryNomReportPayload {
  ui_type: "nom001_report";
  title: string;
  summary: string;
  parameters: FoundryNomParameter[];
  legal_conclusion: string;
  references: string[];
}

export interface FoundryPublicFactPayload {
  ui_type: "public_fact_sheet";
  title: string;
  summary: string;
  headline: string;
  highlights: string[];
  safety_label: FoundrySafetyLabel;
}

export interface FoundryAlliesDirectoryPayload {
  ui_type: "allies_directory";
  title: string;
  summary: string;
  allies: FoundryAlly[];
}

export type FoundryUiPayload =
  | FoundryActionPlanPayload
  | FoundryNomReportPayload
  | FoundryPublicFactPayload
  | FoundryAlliesDirectoryPayload;

export interface FoundryIntakePayload {
  usuario_prompt: string;
  datos_zona: Record<string, unknown>;
  context?: Record<string, string>;
}

export interface FoundrySession {
  intake: FoundryIntakePayload | null;
  outputs: Partial<Record<FoundryUiType, FoundryUiPayload>>;
  order: FoundryUiType[];
}

export interface Dossier {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  session: FoundrySession;
}

export interface DossierStore {
  dossiers: Dossier[];
}
