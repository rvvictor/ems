"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TreePine,
  ClipboardList,
  FileSpreadsheet,
  FileText,
  Users,
  ArrowRight,
  Shield,
  BarChart3,
  ScrollText,
  ChevronDown,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "#chat", label: "Chat" },
  { href: "#funciones", label: "Funciones" },
  { href: "#modelo", label: "Modelo" },
];

const FORMATOS = [
  {
    icono: ClipboardList,
    titulo: "Plan de Acción",
    descripcion:
      "Pasos operativos con niveles de urgencia, responsables, fechas límite y costos estimados para cada acción correctiva.",
    preview: ["Urgencia: crítica, alta, media, baja", "Responsables asignados", "Costos estimados"],
  },
  {
    icono: FileSpreadsheet,
    titulo: "Informe NOM-001",
    descripcion:
      "Tabla de cumplimiento normativo con parámetros vs límites, conclusión legal y referencias, listo para autoridades.",
    preview: ["Parámetros vs límites", "Conclusión legal", "Formato apto para PDF"],
  },
  {
    icono: FileText,
    titulo: "Ficha Pública",
    descripcion:
      "Resumen en lenguaje no técnico para visitantes, con titular, aspectos destacados y etiqueta de seguridad.",
    preview: ["Listo para QR", "Aspectos destacados", "Etiqueta de seguridad"],
  },
  {
    icono: Users,
    titulo: "Directorio de Aliados",
    descripcion:
      "Red de ONGs, fondos y socios de tratamiento organizados por tipo de problema ambiental.",
    preview: ["Socios locales", "Contactos de financiamiento", "Información de contacto"],
  },
];

const SECCIONES_FOOTER = [
  {
    titulo: "Producto",
    enlaces: [
      { label: "Inicio", href: "/" },
      { label: "Chat IA", href: "#chat" },
      { label: "Funciones", href: "#funciones" },
      { label: "Modelo", href: "#modelo" },
    ],
  },
  {
    titulo: "Formatos",
    enlaces: [
      { label: "Plan de Acción", href: "/expediente" },
      { label: "Informe NOM-001", href: "/expediente" },
      { label: "Ficha Pública", href: "/expediente" },
      { label: "Directorio de Aliados", href: "/expediente" },
    ],
  },
  {
    titulo: "Tecnología",
    enlaces: [
      { label: "Azure AI Foundry", href: "#modelo" },
      { label: "Next.js", href: "https://nextjs.org" },
      { label: "CopilotKit", href: "https://copilotkit.ai" },
      { label: "Python FastAPI", href: "https://fastapi.tiangolo.com" },
    ],
  },
  {
    titulo: "Legal",
    enlaces: [
      { label: "Privacidad", href: "#" },
      { label: "Términos", href: "#" },
      { label: "Contacto", href: "#" },
    ],
  },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-dark text-cream">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 text-lg font-semibold tracking-tight">
          <img src="/logo.jpeg" alt="EMS" className="h-8 w-8 rounded-lg object-cover" />
          EMS
        </Link>

        <button
          className="flex md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Abrir menú"
        >
          <ChevronDown size={20} className={`transition ${menuOpen ? "rotate-180" : ""}`} />
        </button>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-cream/70 transition hover:text-cream"
            >
              {item.label}
            </a>
          ))}
          <Link
            href="/home"
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-cream transition hover:bg-primary/80"
          >
            Comenzar
          </Link>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-cream/10 px-6 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-3">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm text-cream/70 transition hover:text-cream"
              >
                {item.label}
              </a>
            ))}
            <Link
              href="/home"
              onClick={() => setMenuOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-cream"
            >
              Comenzar <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="bg-cream px-6 py-20 md:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-dark/10 bg-white px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-primary">
          Sistema de Monitoreo Ambiental con IA
        </div>
        <h1 className="text-4xl font-bold leading-tight text-dark md:text-5xl lg:text-6xl">
          Transforma datos de cenotes en{" "}
          <span className="text-primary">expedientes ambientales</span> completos
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-dark/60 md:text-lg">
          EMS utiliza inteligencia artificial para convertir mediciones de calidad de agua,
          afluencia turística y gestión de residuos en cuatro formatos de reporte listos para usar:
          planes de acción, informes de cumplimiento NOM-001, fichas públicas y directorios de aliados.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#chat"
            className="inline-flex items-center gap-2 rounded-full bg-dark px-6 py-3 text-sm font-medium text-cream transition hover:bg-dark/85"
          >
            Probar el chat <ArrowRight size={16} />
          </a>
          <Link
            href="/expediente"
            className="inline-flex items-center gap-2 rounded-full border border-dark/20 bg-white px-6 py-3 text-sm font-medium text-dark transition hover:border-dark/40"
          >
            Ver expedientes
          </Link>
        </div>
      </div>
    </section>
  );
}

function ChatSection() {
  return (
    <section id="chat" className="scroll-mt-20 bg-surface px-6 py-20">
      <div className="mx-auto max-w-lg text-center">
        <h2 className="text-2xl font-bold text-dark md:text-3xl">
          Crea tu primer expediente
        </h2>
        <p className="mt-3 text-dark/60">
          Usa el asistente de IA para capturar los datos de tu cenote y generar
          hasta 4 formatos de reporte ambiental.
        </p>
        <Link
          href="/home"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-dark px-7 py-3 text-sm font-medium text-cream transition hover:bg-dark/85"
        >
          Ir al asistente <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="funciones" className="scroll-mt-20 bg-cream px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <h2 className="text-2xl font-bold text-dark md:text-3xl">
            4 formas de visualizar la información
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-dark/60">
            Cada formato transforma los mismos datos de entrada en una perspectiva diferente,
            adaptada a distintos públicos y propósitos.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {FORMATOS.map((f) => {
            const Icono = f.icono;
            return (
              <div
                key={f.titulo}
                className="group rounded-2xl border border-secondary/40 bg-surface p-6 transition hover:border-primary/40 hover:shadow-sm"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-dark/5 text-primary">
                  <Icono size={20} />
                </div>
                <h3 className="text-lg font-semibold text-dark">{f.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-dark/60">{f.descripcion}</p>
                <ul className="mt-4 space-y-1.5 text-xs text-dark/50">
                  {f.preview.map((linea) => (
                    <li key={linea} className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-primary" />
                      {linea}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/expediente"
            className="inline-flex items-center gap-2 rounded-full bg-dark px-6 py-3 text-sm font-medium text-cream transition hover:bg-dark/85"
          >
            Ir al expediente <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ModelSection() {
  return (
    <section id="modelo" className="scroll-mt-20 bg-primary px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-dark/15 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-cream/80">
              Azure AI Foundry
            </div>
            <h2 className="text-2xl font-bold text-cream md:text-3xl">
              Impulsado por inteligencia artificial de Microsoft Azure
            </h2>
            <p className="mt-4 leading-relaxed text-cream/80">
              Cada expediente es generado por un agente de IA alojado en{" "}
              <strong>Azure AI Foundry</strong>. El modelo recibe los datos normalizados del cenote
              y genera JSON estructurado siguiendo esquemas predefinidos para cada formato de
              reporte.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                { icono: Shield, texto: "Datos procesados en infraestructura empresarial Azure" },
                { icono: BarChart3, texto: "Esquemas JSON tipados para cada formato de salida" },
                { icono: ScrollText, texto: "Normalización automática con valores por defecto" },
              ].map(({ icono: Icono, texto }) => (
                <li key={texto} className="flex items-start gap-3 text-sm text-cream/80">
                  <Icono size={16} className="mt-0.5 shrink-0 text-cream/60" />
                  {texto}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-cream/15 bg-dark/10 p-6">
            <div className="mb-3 flex items-center gap-2 text-xs text-cream/50">
              <div className="h-2 w-2 rounded-full bg-green-400" />
              Sistema activo
            </div>
            <div className="space-y-2 text-xs leading-relaxed text-cream/70">
              <p className="font-mono">POST /datos-zona {"{"}</p>
              <p className="font-mono pl-4">&quot;usuario_prompt&quot;: &quot;...&quot;,</p>
              <p className="font-mono pl-4">&quot;datos_zona&quot;: {"{ ... }"},</p>
              <p className="font-mono pl-4">&quot;ui_type&quot;: &quot;action_plan&quot;</p>
              <p className="font-mono">{"}"}</p>
              <p className="pt-2 text-cream/50">→ Agente Azure AI → JSON estructurado</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FooterSection() {
  return (
    <footer className="bg-dark text-cream/60">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          {SECCIONES_FOOTER.map((seccion) => (
            <div key={seccion.titulo}>
              <h4 className="mb-4 text-sm font-semibold text-cream">{seccion.titulo}</h4>
              <ul className="space-y-2.5">
                {seccion.enlaces.map((enlace) => (
                  <li key={enlace.label}>
                    <a
                      href={enlace.href}
                      className="text-sm transition hover:text-cream/80"
                    >
                      {enlace.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-cream/10 px-6 py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-xs md:flex-row">
          <div className="flex items-center gap-2">
            <img src="/logo.jpeg" alt="EMS" className="h-5 w-5 rounded object-cover" />
            <span className="font-medium text-cream/80">EMS</span>
          </div>
          <p>&copy; {new Date().getFullYear()} EMS. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream text-dark">
      <Navbar />
      <HeroSection />
      <ChatSection />
      <FeaturesSection />
      <ModelSection />
      <FooterSection />
    </div>
  );
}
