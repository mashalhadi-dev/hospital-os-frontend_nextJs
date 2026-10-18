---
name: DocNode Interface
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1b1b1d'
  surface-container: '#201f21'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#c8c4d7'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#303032'
  outline: '#918fa0'
  outline-variant: '#464554'
  surface-tint: '#c4c0ff'
  primary: '#c4c0ff'
  on-primary: '#2100a4'
  primary-container: '#6b62f2'
  on-primary-container: '#ffffff'
  inverse-primary: '#5247d8'
  secondary: '#c4c0ff'
  on-secondary: '#251690'
  secondary-container: '#4037a9'
  on-secondary-container: '#b4b0ff'
  tertiary: '#35dfae'
  on-tertiary: '#003829'
  tertiary-container: '#008767'
  on-tertiary-container: '#ffffff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e3dfff'
  primary-fixed-dim: '#c4c0ff'
  on-primary-fixed: '#110068'
  on-primary-fixed-variant: '#3929c0'
  secondary-fixed: '#e3dfff'
  secondary-fixed-dim: '#c4c0ff'
  on-secondary-fixed: '#120068'
  on-secondary-fixed-variant: '#3d34a6'
  tertiary-fixed: '#5dfcc9'
  tertiary-fixed-dim: '#35dfae'
  on-tertiary-fixed: '#002116'
  on-tertiary-fixed-variant: '#00513c'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  display-lg:
    fontFamily: DM Sans
    fontSize: 44px
    fontWeight: '600'
    lineHeight: 52px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: DM Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: DM Sans
    fontSize: 30px
    fontWeight: '500'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: DM Sans
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: DM Sans
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: -0.002em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  mono-metric:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-sm: 0.75rem
  gutter-lg: 1.5rem
  margin: 1.5rem
  margin-sm: 1rem
  margin-lg: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.875rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system defines a high-precision, dusk-lit medical intelligence environment. It merges the surgical discipline of clinical diagnostic tools with the refined, tactile minimalism of high-end engineering platforms like Linear and Raycast, underpinned by translucent liquid-glass surfaces reminiscent of modern OS design.

### Aesthetic Persona
- **Surgical Restraint & Clarity**: High-density operational space stripped of visual noise. Deep matte obsidian surfaces allow complex patient diagnostic models, telemetry, and neural synthesis layers to emerge cleanly without eye fatigue during prolonged shifts.
- **Dusk Atmosphere**: A controlled palette of deep charcoal, obsidian, and luminous dusk-violet accents evokes high-focus, nocturnal laboratory environments.
- **Glassmorphic Precision**: Frosted liquid overlays soften structural density, providing spatial hierarchy through translucent layering, backdrop blurs, and luminous micro-hairlines.

### Design Principles
1. **Density with Legibility**: Information layout must prioritize swift cognitive parsing. Use crisp hairline divisions, precise geometric badges, and generous micro-spacing rather than heavy ornamental chrome.
2. **Illuminated Significance**: Color is never purely decorative. The dusk-violet seed color serves as the cognitive anchor, denoting dynamic computation, selected states, and diagnostic synthesis.
3. **Subtle Tactility**: Micro-interactions rely on optical light-bleed, soft luminous outer halos, and hairline border shifts rather than abrupt mechanical drop shadows.

## Colors

The system uses a strictly controlled dark chromatic scale built to emphasize focus, reduce optical glare in low-light clinical settings, and establish rapid visual hierarchy.

### Surface Tiers
- **Void Canvas (`#0A0A0A`)**: The absolute background foundation. Completely matte, grounding all floating elements and panels.
- **Panel Base (`#161616`)**: First structural elevation for static toolbars, sidebars, and base grid cards.
- **Elevated Graphite (`#1E1E22`)**: Intermediate cards, modal dialogs, and persistent contextual docks.
- **Liquid Overlay (`rgba(255, 255, 255, 0.04)` to `rgba(255, 255, 255, 0.08)`)**: Applied across floating sheets and elevated drawers in conjunction with backdrop filters.

### Key Functional Accents
- **Dusk Violet (`#6B62F2`)**: Primary interactive and synthesis identity. Drives primary actions, progressive analysis rings, active navigation indicators, and keyboard focus states.
- **Ether Iris (`#8A84F8`)**: Secondary accent; used for interactive hover states, active tags, and supplementary data traces.
- **Vital Emerald (`#38E1B0`)**: Tertiary diagnostic token; signals stable clinical telemetry, complete scans, and optimal vitals.
- **Critical Crimson (`#F43F5E`)**: Critical telemetry drops, contraindications, and system warnings.

### Typography & Border Colors
- **Bone (`#EDEDED`)**: Dominant typography token for primary titles, critical metrics, and highlighted patient data.
- **Ash (`#A1A1AA`)**: Secondary descriptive labels, timecodes, metadata, and structural headers.
- **Muted Steel (`#71717A`)**: Inactive states, placeholder values, and non-actionable timestamps.
- **Hairline Border (`rgba(255, 255, 255, 0.08)`)**: Structural division lines across graphite panels and cards.
- **Luminous Hairline (`rgba(107, 98, 242, 0.35)`)**: Boundary definition for selected or active focus states.

## Typography

The typographic hierarchy pairs the geometric clarity of **DM Sans** for displays and structural headings with the utilitarian legibility of **Inter** for dense metadata and clinical readouts.

### Hierarchy & Composition Rules
- **Display & Section Headers**: Rendered in `DM Sans` with medium-to-semibold weights and tight negative tracking (`-0.02em` to `-0.03em`). This produces a condensed, modern silhouette suited for executive summary panels and diagnostic module titles.
- **Operational Data & Body Text**: Rendered in `Inter` with neutral letter spacing. `Inter` ensures high legibility across fine-grained patient records, multi-column vitals, and diagnostic histories.
- **Telemetry & Metric Labels**: Micro-indicators and diagnostic timestamps utilize `label-sm` and `mono-metric` styling with slight positive letter spacing and uppercase treatment for immediate, error-free parsing under high cognitive load.

## Layout & Spacing

The spatial architecture leverages a high-density, modular grid modeled on advanced desktop command interfaces (Linear, Raycast) adjusted for medical telemetry workflows.

### Grid & Canvas Structure
- **Base Canvas**: A fluid 12-column structural grid for desktop environments (`≥1280px`) with fixed 64px left utility navigation, `gutter-lg` (24px) gutters, and a maximum canvas width of 1920px.
- **Tablet Workspaces (`768px - 1279px`)**: 8-column layout with 16px (`gutter`) gutters, collapsing secondary analytics panels into modal sheets or slide-over liquid drawers.
- **Mobile Handheld (`<768px`)**: Single-column vertical flow with 12px gutters and 16px margins, preserving fixed pill action bars at the bottom viewport boundary.

### Rhythm & Gap Rules
- **Structural Modules**: Separate major panels and analytical dashboards using `space-lg` and `space-xl`.
- **Intra-Component Spacing**: Use `space-sm` (8px) and `space-md` (14px) for internal padding within metric cards, status rows, and data tables to preserve informational density without crowding.

## Elevation & Depth

Visual hierarchy is communicated through translucent liquid glassmorphism, tonal graphite layering, and crisp hairline luminous perimeters rather than opaque drop shadows.

### Elevation Planes

1. **Canvas Substrate (Void Level)**
   - Background: Pure matte `#0A0A0A`.
   - Treatment: Deep non-reflective backdrop. Serves as the negative space framework.

2. **Panel Elevation (Base Tiers)**
   - Background: Solid `#161616`.
   - Border: 1px hairline border using `rgba(255, 255, 255, 0.08)`.
   - Shadow: Flat; relies on perimeter contrast.

3. **Liquid Glass Overlays (Floating Sheets & Flyouts)**
   - Background: Translucent blend `rgba(22, 22, 26, 0.72)`.
   - Backdrop Filter: Blur `16px` to `24px` with saturation boost (`saturate(180%)`).
   - Border: Top and outer hairline `rgba(255, 255, 255, 0.12)`; bottom boundary `rgba(255, 255, 255, 0.04)`.
   - Shadow: Ambient diffused dusk glow `0 16px 40px -12px rgba(0, 0, 0, 0.65)`, with subtle light spill around active nodes using `rgba(107, 98, 242, 0.08)`.

4. **Command Palette & Diagnostic Modals (Top Elevation)**
   - Background: Translucent glass `rgba(18, 18, 22, 0.88)` backed by `24px` blur.
   - Border: Continuous 1px perimeter `rgba(255, 255, 255, 0.14)`.
   - Shadow: Dual-layer shadow: deep drop `0 24px 60px -8px rgba(0, 0, 0, 0.85)` combined with a faint dusk wash `0 0 32px 0 rgba(107, 98, 242, 0.15)`.

## Shapes

The design system employs a deliberate duality: strict pill geometry (`9999px`) for interactive triggers, switcher segments, and telemetry pills, paired with broad, smooth continuous radii (`19px` to `24px`) for outer analytical panels and glass cards.

### Shape Assignment Rules
- **Interactive Controls (Pill Geometry)**: Buttons, search bars, filter chips, radio indicators, and tool status markers strictly use `rounded-full` (`9999px`). This creates clear, touchable and clickable targets that float neatly over dark grids.
- **Panels & Display Cards (`rounded-lg` / `rounded-xl`)**: Primary modular containers, modal sheets, and viewport viewfinders use `20px` to `24px` corner radii, matching high-end hardware displays and liquid-glass aesthetics.
- **Nested Elements**: Ensure nested items follow concentric radius hierarchy (an element inside a `20px` card uses `12px` to `14px` border radius).

## Components

### Buttons
- **Primary Action**: Pill shape (`9999px`). Background `#6B62F2`, text `#FFFFFF`, label weight medium (`500`). Hover: `#7B73F4` with an ambient glow `0 0 20px rgba(107, 98, 242, 0.35)`. Active: `#5C52E5`. Focus: 2px ring offset by 2px matte black using `rgba(107, 98, 242, 0.9)`.
- **Secondary / Ghost**: Pill shape (`9999px`). Background `rgba(255, 255, 255, 0.05)`, border `1px solid rgba(255, 255, 255, 0.08)`, text `#EDEDED`. Hover: Background `rgba(255, 255, 255, 0.09)`, border `rgba(255, 255, 255, 0.15)`.

### Chips & Status Badges
- Pill-form indicators (`height: 24px` to `28px`).
- Composition: Dark tinted fill (`rgba(107, 98, 242, 0.12)` for standard, `rgba(56, 225, 176, 0.12)` for nominal vitals), 1px matched hairline border, leading 6px glowing status dot, and `label-sm` text.

### Form Fields & Command Palette
- **Inputs**: Height `40px` to `44px`, pill geometry. Surface `#161616` or `rgba(255, 255, 255, 0.04)`. Border `1px solid rgba(255, 255, 255, 0.09)`. Text `#EDEDED`, placeholder `#71717A`.
- **Focus State**: Hairline transitions instantly to dusk-violet `#6B62F2` accompanied by a soft 1px outer ring `rgba(107, 98, 242, 0.3)`.

### Cards & Analytical Panels
- Structural cards feature `20px` border radius, `#161616` graphite background, and a sharp hairline border `rgba(255, 255, 255, 0.08)`.
- Header areas feature a subtle divider hairline (`border-b border-white/[0.06]`) and house pill-shaped secondary action filters or temporal range pickers.

### Lists & Telemetry Feeds
- Compact list items separated by hairline micro-dividers (`border-b border-white/[0.04]`).
- Hover states trigger a subtle horizontal background transition to `rgba(255, 255, 255, 0.03)` with an active left edge indicator in `#6B62F2`.

### Checkboxes & Segmented Switchers
- **Checkboxes**: Compact rounded squares (`6px` radius). Unchecked: Border `1px solid rgba(255, 255, 255, 0.18)` on background `#121214`. Checked: Background `#6B62F2`, hairline border `#6B62F2` with white check glyph.
- **Segmented Switcher**: Pill enclosure with `rgba(255, 255, 255, 0.04)` fill and 1px border. Selected segment transitions with an internal sliding pill container `#24242A` bearing an active dusk-violet bottom pip.