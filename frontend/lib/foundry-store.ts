import type {
  FoundryIntakePayload,
  FoundrySession,
  FoundryUiPayload,
  FoundryUiType,
} from "@/lib/types/foundry";

const STORAGE_KEY = "foundry_session_v2";

function createEmptySession(): FoundrySession {
  return {
    intake: null,
    outputs: {},
    order: [],
  };
}

function saveSession(session: FoundrySession) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function loadFoundrySession(): FoundrySession {
  if (typeof window === "undefined") {
    return createEmptySession();
  }

  const raw = window.sessionStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return createEmptySession();
  }

  try {
    return JSON.parse(raw) as FoundrySession;
  } catch {
    return createEmptySession();
  }
}

export function saveIntakePayload(payload: FoundryIntakePayload) {
  const session = loadFoundrySession();
  session.intake = payload;
  saveSession(session);
}

export function saveFoundryOutput(payload: FoundryUiPayload) {
  const session = loadFoundrySession();
  session.outputs[payload.ui_type] = payload;
  if (!session.order.includes(payload.ui_type)) {
    session.order.push(payload.ui_type);
  }
  saveSession(session);
}

export function getFoundryOutput(uiType: FoundryUiType) {
  const session = loadFoundrySession();
  return session.outputs[uiType] ?? null;
}

export function clearFoundrySession() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(STORAGE_KEY);
}
