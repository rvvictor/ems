import json
import logging
import os
import re
from typing import Any, Iterator

from dotenv import load_dotenv
from fastapi import Body, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from azure.identity import DefaultAzureCredential
from azure.ai.projects import AIProjectClient

### ENV
load_dotenv()
project_endpoint = os.getenv("PROJECT_ENDPOINT")
agent_name = os.getenv("AGENT_NAME")
if not project_endpoint or not agent_name:
    raise RuntimeError("Both PROJECT_ENDPOINT and AGENT_NAME must be set in the environment.")
PROJECT_ENDPOINT = project_endpoint
AGENT_NAME = agent_name

### FAST API
app = FastAPI(title="Impacto Ambiental API")

logger = logging.getLogger("impacto-ambiental")
if not logger.handlers:
    logging.basicConfig(level=logging.INFO)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

### AZURE OPEN AI
project = AIProjectClient(
    endpoint=PROJECT_ENDPOINT,
    credential=DefaultAzureCredential(),
)
openai = project.get_openai_client()

### API
def normalize_field_name(field_name: str) -> str:
    return field_name.replace("_", " ").capitalize()

def format_field_value(value: Any) -> str:
    if isinstance(value, bool):
        return "Sí" if value else "No"
    if value is None:
        return "N/A"
    return str(value)

def build_prompt(
    usuario_prompt: str,
    datos_zona: dict[str, Any],
    ui_type: str,
    context: dict[str, Any] | None = None,
    previous_outputs: list[dict[str, Any]] | None = None,
) -> str:
    if not datos_zona:
        raise ValueError("El JSON de entrada debe contener al menos un parámetro.")

    datos_list = []
    for key, value in datos_zona.items():
        field_name = normalize_field_name(key)
        formatted_value = format_field_value(value)
        datos_list.append(f"- {field_name}: {formatted_value}")

        datos_text = "\n".join(datos_list)
        usuario_prompt = usuario_prompt or ""
        context = context or {}
        context_text = "\n".join(
                f"- {normalize_field_name(key)}: {format_field_value(value)}"
                for key, value in context.items()
        )
        previous_outputs = previous_outputs or []
        previous_text = json.dumps(previous_outputs, ensure_ascii=False, indent=2)

        return f"""
Return ONLY a valid JSON object. Do not use Markdown or extra text.
The JSON must follow the schema for ui_type "{ui_type}".

Schema for action_plan:
{{
    "ui_type": "action_plan",
    "title": string,
    "summary": string,
    "actions": [{{
        "action": string,
        "urgency": "low"|"medium"|"high"|"critical",
        "owner": string,
        "deadline": string,
        "estimated_cost": string,
        "notes": string
    }}],
    "next_steps": [string]
}}

Schema for nom001_report:
{{
    "ui_type": "nom001_report",
    "title": string,
    "summary": string,
    "parameters": [{{
        "parameter": string,
        "value": string,
        "limit": string,
        "status": "ok"|"exceeds"|"missing"
    }}],
    "legal_conclusion": string,
    "references": [string]
}}

Schema for public_fact_sheet:
{{
    "ui_type": "public_fact_sheet",
    "title": string,
    "summary": string,
    "headline": string,
    "highlights": [string],
    "safety_label": "safe"|"caution"|"restricted"
}}

Schema for allies_directory:
{{
    "ui_type": "allies_directory",
    "title": string,
    "summary": string,
    "allies": [{{
        "name": string,
        "category": "ngo"|"fund"|"treatment"|"research"|"government"|"private",
        "focus": string,
        "region": string,
        "contact": string
    }}]
}}

Rules:
- All lists must contain at least one item. If data is missing, add a single fallback item.
- Use English for all content.
- Keep outputs concise and operational.
- "ui_type" must be "{ui_type}".

User request:
{usuario_prompt}

Normalized intake data:
{datos_text}

Additional context:
{context_text if context_text else "None"}

Previous outputs (if any):
{previous_text if previous_outputs else "None"}
"""

def extract_json_payload(text: str) -> dict[str, Any]:
    if not text:
        raise ValueError("Empty model response.")

    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        raise ValueError("No JSON object found in model response.")

    try:
        return json.loads(match.group(0))
    except json.JSONDecodeError as error:
        raise ValueError(f"Invalid JSON: {error}")

def ensure_non_empty_list(value: Any, fallback: Any) -> list[Any]:
    if isinstance(value, list) and len(value) > 0:
        return value
    return [fallback]

def normalize_output_payload(payload: dict[str, Any], ui_type: str) -> dict[str, Any]:
    payload["ui_type"] = payload.get("ui_type") or ui_type
    payload["title"] = payload.get("title") or "Environmental Impact Summary"
    payload["summary"] = payload.get("summary") or "No summary provided."

    if ui_type == "action_plan":
        payload["actions"] = ensure_non_empty_list(
            payload.get("actions"),
            {
                "action": "No actions available",
                "urgency": "low",
                "owner": "TBD",
                "deadline": "TBD",
                "estimated_cost": "N/A",
                "notes": "No action data provided.",
            },
        )
        payload["next_steps"] = ensure_non_empty_list(
            payload.get("next_steps"),
            "No next steps provided.",
        )
        return payload

    if ui_type == "nom001_report":
        payload["parameters"] = ensure_non_empty_list(
            payload.get("parameters"),
            {
                "parameter": "No parameters",
                "value": "N/A",
                "limit": "N/A",
                "status": "missing",
            },
        )
        payload["legal_conclusion"] = payload.get("legal_conclusion") or "No legal conclusion provided."
        payload["references"] = ensure_non_empty_list(
            payload.get("references"),
            "No references provided.",
        )
        return payload

    if ui_type == "public_fact_sheet":
        payload["headline"] = payload.get("headline") or payload["title"]
        payload["highlights"] = ensure_non_empty_list(
            payload.get("highlights"),
            "No highlights provided.",
        )
        payload["safety_label"] = payload.get("safety_label") or "caution"
        return payload

    if ui_type == "allies_directory":
        payload["allies"] = ensure_non_empty_list(
            payload.get("allies"),
            {
                "name": "No allies available",
                "category": "ngo",
                "focus": "N/A",
                "region": "N/A",
                "contact": "N/A",
            },
        )
        return payload

    return payload

def stream_ai_response(prompt: str) -> Iterator[str]:
    conversation = openai.conversations.create()
    response_stream = openai.responses.create(
        conversation=conversation.id,
        extra_body={"agent_reference": {"name": AGENT_NAME, "type": "agent_reference"}},
        input=prompt,
        timeout=12000,
        stream=True,
    )

    for event in response_stream:
        event_type = getattr(event, "type", None)
        if event_type == "response.output_text.delta":
            delta = getattr(event, "delta", "")
            if delta:
                yield delta
        elif event_type == "response.output_text.done":
            break

@app.post("/datos-zona")
async def guardar_datos_zona(payload: dict[str, Any] = Body(...)):
    raw_payload = payload.copy()
    usuario_prompt = payload.get("usuario_prompt", "")
    datos_zona = payload.get("datos_zona")
    ui_type = payload.get("ui_type", "action_plan")
    context = payload.get("context") if isinstance(payload.get("context"), dict) else {}
    previous_outputs = payload.get("previous_outputs")
    if not isinstance(previous_outputs, list):
        previous_outputs = []

    if usuario_prompt is None or datos_zona is None:
        raise HTTPException(
            status_code=400,
            detail="El JSON debe incluir 'usuario_prompt' y 'datos_zona'.",
        )
    if not isinstance(datos_zona, dict):
        raise HTTPException(
            status_code=400,
            detail="'datos_zona' debe ser un objeto JSON con uno o más atributos.",
        )
    if ui_type not in {"action_plan", "nom001_report", "public_fact_sheet", "allies_directory"}:
        raise HTTPException(
            status_code=400,
            detail=(
                "'ui_type' debe ser 'action_plan', 'nom001_report', "
                "'public_fact_sheet' o 'allies_directory'."
            ),
        )

    try:
        prompt = build_prompt(usuario_prompt, datos_zona, ui_type, context, previous_outputs)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))

    conversation = openai.conversations.create()
    response = openai.responses.create(
        conversation=conversation.id,
        extra_body={"agent_reference": {"name": AGENT_NAME, "type": "agent_reference"}},
        input=prompt,
        timeout=12000,
    )

    logger.info("Foundry raw output_text: %s", response.output_text)

    try:
        output_payload = extract_json_payload(response.output_text)
        output_payload = normalize_output_payload(output_payload, ui_type)
    except ValueError as error:
        raise HTTPException(status_code=500, detail=str(error))

    logger.info("Foundry parsed payload: %s", output_payload)

    return JSONResponse(
        status_code=200,
        content={
            "input": raw_payload,
            "prompt": prompt,
            "output": output_payload,
        },
    )

@app.post("/datos-zona-stream")
async def guardar_datos_zona_stream(payload: dict[str, Any] = Body(...)):
    usuario_prompt = payload.get("usuario_prompt", "")
    datos_zona = payload.get("datos_zona")
    ui_type = payload.get("ui_type", "action_plan")
    context = payload.get("context") if isinstance(payload.get("context"), dict) else {}
    previous_outputs = payload.get("previous_outputs")
    if not isinstance(previous_outputs, list):
        previous_outputs = []

    if usuario_prompt is None or datos_zona is None:
        raise HTTPException(
            status_code=400,
            detail="El JSON debe incluir 'usuario_prompt' y 'datos_zona'.",
        )
    if not isinstance(datos_zona, dict):
        raise HTTPException(
            status_code=400,
            detail="'datos_zona' debe ser un objeto JSON con uno o más atributos.",
        )
    if ui_type not in {"action_plan", "nom001_report", "public_fact_sheet", "allies_directory"}:
        raise HTTPException(
            status_code=400,
            detail=(
                "'ui_type' debe ser 'action_plan', 'nom001_report', "
                "'public_fact_sheet' o 'allies_directory'."
            ),
        )

    try:
        prompt = build_prompt(usuario_prompt, datos_zona, ui_type, context, previous_outputs)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))

    return StreamingResponse(
        stream_ai_response(prompt),
        media_type="text/plain; charset=utf-8",
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)