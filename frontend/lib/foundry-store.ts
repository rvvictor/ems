import type {
  Dossier,
  DossierStore,
  FoundryIntakePayload,
  FoundryUiPayload,
  FoundryUiType,
} from "@/lib/types/foundry";

const STORAGE_KEY = "ems_dossiers";

function emptyStore(): DossierStore {
  return { dossiers: [] };
}

function loadStore(): DossierStore {
  if (typeof window === "undefined") {
    return emptyStore();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore();
    return JSON.parse(raw) as DossierStore;
  } catch {
    return emptyStore();
  }
}

function saveStore(store: DossierStore) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function createDossier(
  name: string,
  intake: FoundryIntakePayload
): Dossier {
  const store = loadStore();
  const dossier: Dossier = {
    id: generateId(),
    name,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    session: {
      intake,
      outputs: {},
      order: [],
    },
  };
  store.dossiers.push(dossier);
  saveStore(store);
  return dossier;
}

export function getDossier(id: string): Dossier | null {
  const store = loadStore();
  return store.dossiers.find((d) => d.id === id) ?? null;
}

export function getAllDossiers(): Dossier[] {
  const store = loadStore();
  return [...store.dossiers].sort((a, b) => b.updatedAt - a.updatedAt);
}

export function updateDossierOutput(
  dossierId: string,
  output: FoundryUiPayload
): Dossier | null {
  const store = loadStore();
  const dossier = store.dossiers.find((d) => d.id === dossierId);
  if (!dossier) return null;

  dossier.session.outputs[output.ui_type] = output;
  if (!dossier.session.order.includes(output.ui_type)) {
    dossier.session.order.push(output.ui_type);
  }
  dossier.updatedAt = Date.now();
  saveStore(store);
  return dossier;
}

export function deleteDossier(id: string) {
  const store = loadStore();
  store.dossiers = store.dossiers.filter((d) => d.id !== id);
  saveStore(store);
}

export function renameDossier(id: string, name: string): Dossier | null {
  const store = loadStore();
  const dossier = store.dossiers.find((d) => d.id === id);
  if (!dossier) return null;
  dossier.name = name;
  dossier.updatedAt = Date.now();
  saveStore(store);
  return dossier;
}

// Legacy helpers — read from / migrate old sessionStorage
export function clearFoundrySession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
