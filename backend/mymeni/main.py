import os
from typing import Any

from dotenv import load_dotenv
from fastapi import Body, FastAPI, HTTPException
from fastapi.responses import JSONResponse
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

def build_prompt(usuario_prompt: str, datos_zona: dict[str, Any]) -> str:
    if not datos_zona:
        raise ValueError("El JSON de entrada debe contener al menos un parámetro.")

    datos_list = []
    for key, value in datos_zona.items():
        field_name = normalize_field_name(key)
        formatted_value = format_field_value(value)
        datos_list.append(f"- {field_name}: {formatted_value}")

    datos_text = "\n".join(datos_list)
    usuario_prompt = usuario_prompt or ""

    return f"""
Analiza la siguiente solicitud del usuario y genera una respuesta adecuada.
{usuario_prompt}
Datos de entrada:
{datos_text}
"""

@app.post("/datos-zona")
async def guardar_datos_zona(payload: dict[str, Any] = Body(...)):
    raw_payload = payload.copy()
    usuario_prompt = payload.get("usuario_prompt", "")
    datos_zona = payload.get("datos_zona")

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

    try:
        prompt = build_prompt(usuario_prompt, datos_zona)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))

    conversation = openai.conversations.create()
    response = openai.responses.create(
        conversation=conversation.id,
        extra_body={"agent_reference": {"name": AGENT_NAME, "type": "agent_reference"}},
        input=prompt,
        timeout=12000,
    )

    return JSONResponse(
        status_code=200,
        content={
            "input": raw_payload,
            "prompt": prompt,
            "output": response.output_text,
        },
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)