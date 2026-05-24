import type {
  FoundryIntakePayload,
  FoundryUiPayload,
  FoundryUiType,
} from "@/lib/types/foundry";

interface FoundryRequestInput {
  intake: FoundryIntakePayload;
  uiType: FoundryUiType;
  previousOutputs: FoundryUiPayload[];
}

export async function requestFoundryOutput({
  intake,
  uiType,
  previousOutputs,
}: FoundryRequestInput): Promise<FoundryUiPayload> {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

  const response = await fetch(`${backendUrl}/datos-zona`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      usuario_prompt: intake.usuario_prompt,
      datos_zona: intake.datos_zona,
      context: intake.context ?? {},
      ui_type: uiType,
      previous_outputs: previousOutputs,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Foundry error ${response.status}: ${text}`);
  }

  const data = (await response.json()) as { output: FoundryUiPayload };
  return data.output;
}
