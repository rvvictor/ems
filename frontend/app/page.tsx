"use client"

import { useRef, useState } from "react"
import Link from "next/dist/client/link"

export default function Page() {
  const [output, setOutput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string>("Listo para probar el stream")
  const controllerRef = useRef<AbortController | null>(null)

  const handleRunStream = async () => {
    setError(null)
    setOutput("")
    setStatus("Iniciando petición...")
    setLoading(true)

    try {
      const controller = new AbortController()
      controllerRef.current = controller

      const payload = {
        "usuario_prompt": "Quiero saber que parametros son mas urgentes de atender.",
        "datos_zona": {
          "nombre_cenote": "Cenote Azul",
          "fecha_medicion": "2004-05 a 2005-04",
          "temporada": "anual",
          "profundidad_muestra_m": "0-65",
          "pH": 7.8,
          "temperatura_C": 29.2,
          "oxigeno_disuelto_mgL": 6.1,
          "DQO_mgL": null,
          "SST_mgL": null,
          "nitrogeno_total_mgL": null,
          "fosforo_total_mgL": null,
          "grasas_aceites_mgL": null,
          "E_coli_NMP_100mL": null,
          "enterococos_fecales_NMP_100mL": null,
          "clorofila_a_mgm3": 0.9,
          "visibilidad_secchi_m": 11.1,
          "oxibenzona_ugL": 1.2,
          "octinoxato_ugL": 0.9,
          "turistas_por_dia": 10,
          "uso_bloqueadores_ecologicos_pct": 12,
          "gestion_residuos_pct": 60,
          "educacion_ambiental_score": 1,
          "cumplimiento_normativo_score": 2,
          "participacion_comunitaria": false
        }
      }

      const response = await fetch("http://localhost:8000/datos-zona-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(`Error ${response.status}: ${text}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error("El navegador no puede leer la respuesta en streaming.")
      }

      const decoder = new TextDecoder()
      setStatus("Recibiendo stream...")

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          break
        }

        const chunk = decoder.decode(value, { stream: true })
        setOutput((prev) => prev + chunk)
      }

      setStatus("Stream completado")
    } catch (err) {
      if ((err as any)?.name === "AbortError") {
        setStatus("Stream cancelado")
      } else {
        setError((err as Error).message)
        setStatus("Error en la petición")
      }
    } finally {
      setLoading(false)
      controllerRef.current = null
    }
  }

  const handleCancel = () => {
    controllerRef.current?.abort()
  }

  return (
    <main style={{ padding: "24px", fontFamily: "system-ui, sans-serif" }}>
      <h1>Prueba de Stream</h1>
      <p>{status}</p>

      <div style={{ marginBottom: "16px" }}>
        <button onClick={handleRunStream} disabled={loading} style={{ marginRight: "8px" }}>
          {loading ? "Ejecutando..." : "Probar /datos-zona-stream"}
        </button>
        <button onClick={handleCancel} disabled={!loading}>
          Cancelar
        </button>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <strong>Salida incremental:</strong>
        <pre style={{ whiteSpace: "pre-wrap", background: "#f5f5f5", padding: "16px", minHeight: "180px", borderRadius: "8px" }}>
          {output || "Aquí aparecerán los chunks de texto conforme lleguen."}
        </pre>
      </div>

      {error ? (
        <div style={{ color: "red", marginBottom: "16px" }}>
          <strong>Error:</strong> {error}
        </div>
      ) : null}

      <Link href="/home">Ir a Home</Link>
    </main>
  )
}
