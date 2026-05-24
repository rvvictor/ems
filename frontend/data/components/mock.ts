import { Indicador, Alerta, Reporte, PuntoMapa } from "@/lib/types";

export const indicadoresMock: Indicador[] = [
  { id: "1", nombre: "CO2", valor: 420, unidad: "ppm", categoria: "aire", fecha: "2026-05-23", estado: "advertencia" },
  { id: "2", nombre: "PM2.5", valor: 18, unidad: "µg/m³", categoria: "aire", fecha: "2026-05-23", estado: "normal" },
  { id: "3", nombre: "pH Agua", valor: 7.2, unidad: "pH", categoria: "agua", fecha: "2026-05-23", estado: "normal" },
  { id: "4", nombre: "Ruido", valor: 72, unidad: "dB", categoria: "ruido", fecha: "2026-05-23", estado: "critico" },
  { id: "5", nombre: "Temperatura Suelo", valor: 24, unidad: "°C", categoria: "suelo", fecha: "2026-05-23", estado: "normal" },
];

export const alertasMock: Alerta[] = [
  { id: "1", titulo: "Nivel de ruido crítico", descripcion: "Zona industrial superó los 70dB", severidad: "critica", fecha: "2026-05-23", resuelta: false, indicadorId: "4" },
  { id: "2", titulo: "CO2 elevado", descripcion: "Concentración de CO2 por encima del umbral", severidad: "media", fecha: "2026-05-22", resuelta: false, indicadorId: "1" },
  { id: "3", titulo: "pH normalizado", descripcion: "Niveles de pH estabilizados", severidad: "baja", fecha: "2026-05-21", resuelta: true, indicadorId: "3" },
];

export const reportesMock: Reporte[] = [
  { id: "1", titulo: "Reporte Mayo 2026", periodo: "Mayo 2026", fechaGenerado: "2026-05-23", tipo: "mensual", estado: "borrador" },
  { id: "2", titulo: "Reporte Q1 2026", periodo: "Ene–Mar 2026", fechaGenerado: "2026-04-01", tipo: "trimestral", estado: "publicado" },
];

export const puntosMock: PuntoMapa[] = [
  { id: "1", nombre: "Estación Norte", lat: 19.4326, lng: -99.1332, tipo: "estacion", indicadores: ["1", "2"] },
  { id: "2", nombre: "Zona Industrial", lat: 19.4200, lng: -99.1500, tipo: "zona_critica", indicadores: ["4"] },
  { id: "3", nombre: "Monitoreo Lago", lat: 19.4450, lng: -99.1200, tipo: "monitoreo", indicadores: ["3"] },
];