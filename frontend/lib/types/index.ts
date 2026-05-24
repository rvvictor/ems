export interface Indicador {
  id: string;
  nombre: string;
  valor: number;
  unidad: string;
  categoria: "aire" | "agua" | "suelo" | "ruido";
  fecha: string;
  estado: "normal" | "advertencia" | "critico";
}

export interface Alerta {
  id: string;
  titulo: string;
  descripcion: string;
  severidad: "baja" | "media" | "alta" | "critica";
  fecha: string;
  resuelta: boolean;
  indicadorId?: string;
}

export interface Reporte {
  id: string;
  titulo: string;
  periodo: string;
  fechaGenerado: string;
  tipo: "mensual" | "trimestral" | "anual";
  estado: "borrador" | "publicado";
}

export interface PuntoMapa {
  id: string;
  nombre: string;
  lat: number;
  lng: number;
  tipo: "estacion" | "zona_critica" | "monitoreo";
  indicadores: string[];
}