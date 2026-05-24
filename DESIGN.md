---
version: alpha
name: EMS-Design-System
description: Design system for EMS (Environmental Monitoring System) — a web application that transforms cenote water quality data into environmental dossiers using Azure AI Foundry. The marketing surface uses a warm cream-and-forest-green palette inspired by nature. The dossier workspace uses a cool teal palette optimized for data density and readability.

colors:
  # ── Marketing Palette (Landing, Home, Nav) ──
  dark: "#20352a"
  primary: "#4e7a5a"
  secondary: "#a9c7b5"
  cream: "#f6f1e8"
  surface: "#ffffff"

  # ── Dossier / Expediente Palette ──
  teal-dark: "#007872"
  teal-primary: "#419e98"
  teal-secondary: "#82c4be"
  teal-light: "#b8dddc"
  teal-surface: "#edf6f9"

  # ── Semantic ──
  danger: "#dc2626"
  danger-bg: "#fef2f2"
  warning: "#ea580c"
  warning-bg: "#fff7ed"
  success: "#16a34a"
  success-bg: "#f0fdf4"
  info: "#2563eb"
  info-bg: "#eff6ff"

typography:
  display-xxl:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 64px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -1.92px
  display-xl:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -1.44px
  display-lg:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.72px
  heading-xl:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: -0.42px
  heading-lg:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0
  heading-md:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  body-lg:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  body-md:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0
  body-sm:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  caption:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: 0
  micro:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.2em
  button:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0
  button-sm:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 0.2em
  code:
    fontFamily: "ui-monospace, Menlo, Monaco, Consolas, 'Liberation Mono', monospace"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0

rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  xxl: 24px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  xxl: 32px
  huge: 48px
  massive: 64px

components:
  button-primary:
    backgroundColor: "{colors.dark}"
    textColor: "{colors.cream}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: 12px 24px
  button-primary-hover:
    backgroundColor: "#1a2a21"
    textColor: "{colors.cream}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: 12px 24px
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.dark}"
    border: "1px solid {colors.dark}20"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: 12px 24px
  button-secondary-hover:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.dark}"
    border: "1px solid {colors.dark}66"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: 12px 24px
  button-accent:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.cream}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: 12px 24px
  button-accent-hover:
    backgroundColor: "#3d664b"
    textColor: "{colors.cream}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: 12px 24px
  button-dossier-primary:
    backgroundColor: "{colors.teal-dark}"
    textColor: "#ffffff"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: 10px 20px
  button-dossier-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.teal-dark}99"
    typography: "{typography.button-sm}"
    rounded: "{rounded.full}"
    padding: 8px 16px
    border: "1px solid {colors.teal-secondary}"
  card-feature:
    backgroundColor: "{colors.surface}"
    border: "1px solid {colors.secondary}66"
    rounded: "{rounded.xl}"
    padding: 24px
  card-dossier:
    backgroundColor: "{colors.surface}"
    border: "1px solid {colors.teal-light}"
    rounded: "{rounded.xl}"
    padding: 24px
  card-urgency-critical:
    backgroundColor: "{colors.danger-bg}"
    borderLeft: "4px solid {colors.danger}"
    rounded: "{rounded.lg}"
    padding: 16px
  card-urgency-high:
    backgroundColor: "{colors.warning-bg}"
    borderLeft: "4px solid {colors.warning}"
    rounded: "{rounded.lg}"
    padding: 16px
  card-urgency-medium:
    backgroundColor: "{colors.warning-bg}"
    borderLeft: "4px solid #facc15"
    rounded: "{rounded.lg}"
    padding: 16px
  card-urgency-low:
    backgroundColor: "{colors.teal-surface}"
    borderLeft: "4px solid {colors.teal-primary}"
    rounded: "{rounded.lg}"
    padding: 16px
  nav-bar:
    backgroundColor: "{colors.dark}"
    textColor: "{colors.cream}"
    typography: "{typography.body-sm}"
    padding: 16px 24px
    maxWidth: 1280px
  nav-bar-dossier:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.teal-dark}"
    typography: "{typography.caption}"
    padding: 16px
    border: "1px solid {colors.teal-light}"
  sidebar-dossier:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.teal-dark}"
    border: "1px solid {colors.teal-light}"
    width: "256px"
  sidebar-item-active:
    backgroundColor: "{colors.teal-dark}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  sidebar-item-inactive:
    backgroundColor: "transparent"
    textColor: "{colors.teal-dark}99"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  input-chat:
    backgroundColor: "{colors.cream}"
    border: "1px solid {colors.secondary}"
    rounded: "{rounded.lg}"
    padding: "8px 12px"
    typography: "{typography.body-md}"
  input-chat-focus:
    backgroundColor: "{colors.cream}"
    border: "1px solid {colors.primary}"
    rounded: "{rounded.lg}"
    padding: "8px 12px"
  badge-ok:
    backgroundColor: "{colors.success-bg}"
    textColor: "{colors.success}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  badge-exceeds:
    backgroundColor: "{colors.warning-bg}"
    textColor: "{colors.warning}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  badge-missing:
    backgroundColor: "{colors.danger-bg}"
    textColor: "{colors.danger}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  badge-category-ngo:
    backgroundColor: "#eff6ff"
    textColor: "#1d4ed8"
    typography: "{typography.micro}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  badge-category-fund:
    backgroundColor: "#f0fdf4"
    textColor: "#15803d"
    typography: "{typography.micro}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  badge-category-treatment:
    backgroundColor: "#faf5ff"
    textColor: "#7e22ce"
    typography: "{typography.micro}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  badge-category-research:
    backgroundColor: "#ecfeff"
    textColor: "#0e7490"
    typography: "{typography.micro}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  badge-category-government:
    backgroundColor: "#fff7ed"
    textColor: "#c2410c"
    typography: "{typography.micro}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  badge-safety-safe:
    backgroundColor: "{colors.success-bg}"
    textColor: "{colors.success}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.full}"
    padding: "6px 16px"
  badge-safety-caution:
    backgroundColor: "{colors.warning-bg}"
    textColor: "{colors.warning}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.full}"
    padding: "6px 16px"
  badge-safety-restricted:
    backgroundColor: "{colors.danger-bg}"
    textColor: "{colors.danger}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.full}"
    padding: "6px 16px"
  table:
    backgroundColor: "{colors.surface}"
    border: "1px solid {colors.teal-light}"
    rounded: "{rounded.lg}"
  table-header:
    backgroundColor: "{colors.teal-surface}"
    textColor: "{colors.teal-dark}99"
    typography: "{typography.micro}"
    padding: "12px 16px"
  table-row-ok:
    borderLeft: "4px solid {colors.success}"
    backgroundColor: "{colors.success-bg}"
  table-row-exceeds:
    borderLeft: "4px solid {colors.warning}"
    backgroundColor: "{colors.warning-bg}"
  table-row-missing:
    borderLeft: "4px solid {colors.danger}"
    backgroundColor: "{colors.danger-bg}"
  footer:
    backgroundColor: "{colors.dark}"
    textColor: "{colors.cream}99"
    typography: "{typography.body-sm}"
    padding: "64px 24px"
  dossier-next-steps:
    backgroundColor: "{colors.teal-surface}"
    border: "2px solid {colors.teal-primary}4D"
    rounded: "{rounded.lg}"
    padding: 20px
---

## Descripción General

EMS (Environmental Monitoring System / Sistema de Monitoreo Ambiental) es una aplicación web que convierte datos de calidad de agua de cenotes en expedientes ambientales completos usando inteligencia artificial de Azure AI Foundry.

El diseño combina dos paletas distintas:
- **Marketing** (landing, home, navegación): Fondo `{colors.cream}` (#f6f1e8) con acentos en `{colors.dark}` (#20352a) y `{colors.primary}` (#4e7a5a). Una paleta natural, cálida y orgánica que evoca el entorno selvático de los cenotes.
- **Expediente** (dossier workspace): Fondo `{colors.teal-surface}` (#edf6f9) con acentos en `{colors.teal-dark}` (#007872) y `{colors.teal-primary}` (#419e98). Una paleta fría, técnica y legible optimizada para densidad de datos y tablas.

### Principios de Diseño
- **Sin degradados.** La profundidad viene de bordes sutiles y sombras, no de gradientes.
- **Colores oscuros para contenedores estructurales** (navbar, footer, sidebar), claros para fondos de página.
- **Cards blancas con bordes** en lugar de fondos de color.
- **Badges semánticos** con iconos representativos para estados (urgencia, cumplimiento, seguridad).
- **Tipografía Inter** en todos los pesos — limpia, moderna, legible.

## Colores

### Marketing (Landing, Home, Navegación)

| Token | Hex | Uso |
|---|---|---|
| `{colors.dark}` | `#20352a` | Navbar, footer, headings, botones primarios, sidebar |
| `{colors.primary}` | `#4e7a5a` | Acentos, badges, bordes decorativos, texto secundario |
| `{colors.secondary}` | `#a9c7b5` | Bordes de cards, inputs, separadores |
| `{colors.cream}` | `#f6f1e8` | Fondo principal de página |
| `{colors.surface}` | `#ffffff` | Cards, contenedores blancos |

### Expediente / Dossier

| Token | Hex | Uso |
|---|---|---|
| `{colors.teal-dark}` | `#007872` | Headers, botones, sidebar activo, títulos |
| `{colors.teal-primary}` | `#419e98` | Badges, iconos, acentos secundarios |
| `{colors.teal-secondary}` | `#82c4be` | Bordes de elementos |
| `{colors.teal-light}` | `#b8dddc` | Bordes suaves, separadores |
| `{colors.teal-surface}` | `#edf6f9` | Fondo principal del expediente |

### Estados Semánticos

| Estado | Fondo | Texto | Uso |
|---|---|---|---|
| OK / Seguro | `{colors.success-bg}` `#f0fdf4` | `{colors.success}` `#16a34a` | Cumplimiento normativo |
| Excede / Precaución | `{colors.warning-bg}` `#fff7ed` | `{colors.warning}` `#ea580c` | Parámetros fuera de límite |
| Faltante / Restringido | `{colors.danger-bg}` `#fef2f2` | `{colors.danger}` `#dc2626` | Datos faltantes, riesgo crítico |

## Tipografía

**Familia principal:** Inter (Google Fonts). Fallback: `system-ui, sans-serif`.
**Familia mono:** `ui-monospace, Menlo, Monaco, Consolas, 'Liberation Mono'`.

| Token | Tamaño | Peso | Leading | Tracking | Uso |
|---|---|---|---|---|---|
| `display-xxl` | 64px | 700 | 1.1 | -1.92px | Hero headline (landing) |
| `display-xl` | 48px | 700 | 1.15 | -1.44px | Section opener |
| `display-lg` | 36px | 700 | 1.2 | -0.72px | Sub-section |
| `heading-xl` | 28px | 700 | 1.25 | -0.42px | Card title |
| `heading-lg` | 22px | 600 | 1.3 | 0 | Section heading |
| `heading-md` | 18px | 600 | 1.4 | 0 | Sub-heading |
| `body-lg` | 18px | 400 | 1.6 | 0 | Lead paragraph |
| `body-md` | 16px | 400 | 1.55 | 0 | Default body |
| `body-sm` | 14px | 400 | 1.5 | 0 | Secondary text |
| `caption` | 13px | 400 | 1.45 | 0 | Helper, footnote |
| `micro` | 12px | 500 | 1.4 | 0.2em | Badge, pill, uppercase label |
| `button` | 14px | 500 | 1 | 0 | Button label |
| `button-sm` | 12px | 600 | 1 | 0.2em | Small button, tab |
| `code` | 14px | 400 | 1.5 | 0 | Code blocks |

## Componentes

### Botones

- **`button-primary`**: Fondo `{colors.dark}`, texto `{colors.cream}`, border-radius completo. Usado en CTAs principales (landing, home).
- **`button-secondary`**: Fondo blanco, borde sutil `{colors.dark}20`. Usado para acciones secundarias.
- **`button-accent`**: Fondo `{colors.primary}`, texto `{colors.cream}`. Usado para "Comenzar" en navbar.
- **`button-dossier-primary`**: Fondo `{colors.teal-dark}`, texto blanco. Usado en la sección de expediente.
- **`button-dossier-ghost`**: Borde `{colors.teal-secondary}`, texto semitransparente. Usado para tabs inactivos en expediente.

### Cards

- **`card-feature`**: Fondo blanco, borde `{colors.secondary}`, border-radius 16px. Cards de características en landing.
- **`card-dossier`**: Fondo blanco, borde `{colors.teal-light}`, border-radius 16px. Cards en expediente.
- **`card-urgency-{critical,high,medium,low}`**: Borde lateral izquierdo de 4px con color semántico y fondo tintado. Usado en Plan de Acción.

### Sidebar (Expediente)

- **`sidebar-dossier`**: Ancho fijo 256px, fondo blanco, borde derecho `{colors.teal-light}`.
- **`sidebar-item-active`**: Fondo `{colors.teal-dark}`, texto blanco, border-radius 8px.
- **`sidebar-item-inactive`**: Fondo transparente, texto semitransparente, hover con fondo `{colors.teal-surface}`.

### Tabla NOM-001

- **`table`**: Fondo blanco, borde `{colors.teal-light}`, border-radius 12px.
- **`table-header`**: Fondo `{colors.teal-surface}`, texto `{colors.teal-dark}99`, tracking 0.2em.
- **`table-row-{ok,exceeds,missing}`**: Borde lateral izquierdo de 4px con color semántico y fondo tintado.

### Badges

- **Urgencia**: `badge-{ok,exceeds,missing}` con icono + texto + color semántico.
- **Categoría de aliado**: `badge-category-{ngo,fund,treatment,research,government}` con colores distintivos por tipo.
- **Seguridad**: `badge-safety-{safe,caution,restricted}` con icono grande + texto bold.

### Input de Chat

El input de CopilotKit se estiliza con `input-chat`: fondo `{colors.cream}`, borde `{colors.secondary}`, border-radius 12px. Al enfocar, el borde cambia a `{colors.primary}`. El historial de mensajes se oculta con CSS.

## Layout

- **Contenedor máximo**: 1280px centrado con `mx-auto`.
- **Padding de sección**: 80px vertical (py-20).
- **Grid de formatos**: 4 columnas en xl, 2 en md, 1 en sm.
- **Grid de aliados**: 3 columnas en xl, 2 en md, 1 en sm.
- **Grid de acciones (plan)**: 2 columnas en md, 1 en sm.

## Sombras y Elevación

| Nivel | Uso |
|---|---|
| Sin sombra | Cards por defecto, solo borde |
| `0 1px 3px rgba(0,0,0,0.06)` | Hover sutil en cards |
| `0 12px 28px rgba(32,53,42,0.12)` | Hover en cards de formato (landing) |
| `0 20px 60px -40px rgba(0,0,0,0.7)` | Sombra decorativa en cards de feature |

## Do's and Don'ts

### Do
- Usar `{colors.dark}` para todos los contenedores estructurales (navbar, footer, sidebar).
- Mantener el fondo de página en `{colors.cream}` para marketing y `{colors.teal-surface}` para expediente.
- Usar las cards con borde lateral de 4px para mostrar niveles de urgencia.
- Incluir iconos semánticos en todos los badges (CheckCircle, AlertTriangle, Skull).
- Ocultar el historial de mensajes en el chat — solo mostrar el input.
- Usar tracking 0.2em para textos en mayúsculas (badges, tabs, etiquetas).

### Don't
- No usar degradados lineales ni de fondo.
- No mezclar la paleta marketing con la paleta teal en una misma página.
- No usar texto blanco sobre el botón primario verde (`{colors.primary}`) — usar `{colors.cream}`.
- No mostrar el historial de mensajes del chat en la interfaz pública.
- No usar radios de borde menores a 4px — el mínimo es `{rounded.xs}`.
- No introducir colores adicionales fuera de las paletas definidas.

## Responsive

| Breakpoint | Cambios clave |
|---|---|
| ≥ 1280px | Layout completo, grids de 4 columnas |
| 1024–1279px | Grids de 2 columnas, sidebar dosier visible |
| 768–1023px | Grids de 2 columnas, menú hamburguesa en landing |
| < 768px | Grids de 1 columna, display-xxl → 36px, sidebar ocultable |
