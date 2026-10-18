# DocNode — Frontend Design System & Style Reference
> Dusk-lit workspace with frosted glass panels, subtle gradients, and Apple-style liquid glass interactive states.

**Theme:** Dark Mode (`#0a0a0a` canvas)  
**Inspiration Reference:** Linear, Vercel, Raycast, and Arc Browser aesthetic standards.

---

## 1. Aesthetic Philosophy & Overview
DocNode operates as a high-end, dusk-lit AI medical workspace. It relies on deep matte-black canvases, frosted-glass translucent overlays (`rgba(212, 212, 212, 0.1)` with backdrop blur), pill-shaped interactive controls (`9999px`), and whisper-weight headlines that lean on medium weights (500) rather than heavy bold statements. 

The system is almost entirely achromatic (blacks, grays, and whites), punctuated by a signature warm-to-cool hero gradient (amber/coral to cobalt blue) and a single violet glow (`#6b62f2`) used strictly for accents and gradient washes.

---

## 2. Tokens — Colors & Surfaces

| Name | Hex Value | CSS Variable / Token | Role & Purpose |
|------|-----------|---|---|
| **Void Canvas** | `#0a0a0a` | `--color-void-canvas` | Primary page background, base surface for the dark UI shell. |
| **Graphite** | `#161616` | `--color-graphite` | Elevated surface for floating panels, pill nav bars, modal bodies. |
| **Frosted Glass** | `#d4d4d4` | `--color-frosted-glass` | Translucent fill at 10% opacity over dark surfaces for cards and overlays[cite: 9]. |
| **Ink Black** | `#000000` | `--color-ink-black` | Icon strokes, SVG fills, and deep contrast elements on light surfaces[cite: 9]. |
| **Snow White** | `#ffffff` | `--color-snow-white` | Primary CTA fill, headline text on dark surfaces, card backgrounds[cite: 9]. |
| **Bone** | `#ededed` | `--color-bone` | Primary readable text on dark surfaces (reduces glare compared to pure white)[cite: 9]. |
| **Ash** | `#c2c2c2` | `--color-ash` | Secondary body text, helper copy, de-emphasized labels[cite: 9]. |
| **Slate** | `#686868` | `--color-slate` | Muted text, link text, tertiary metadata, timestamps[cite: 9]. |
| **Hairline** | `#e5e5e5` | `--color-hairline` | 1px borders on dark-surface controls for definition without weight[cite: 9]. |
| **Dusk Violet** | `#6b62f2` | `--color-dusk-violet` | The sole chromatic accent; used in linear gradient washes and radial glows[cite: 9]. |

---

## 3. Typography Rules

### Primary Face: DM Sans (`--font-dm-sans`)
* **Role:** Used for the 72px hero headline (weight 500, tight tracking `-2.52px`) and all 16px body/UI text[cite: 9]. The weight-500 choice achieves authority through restraint[cite: 9].
* **Weights:** 400 (regular), 500 (medium).
* **Sizes:** 13px (caption), 16px (body), 18px (subheading), 72px (display).

### Secondary Face: Geist (`--font-geist`)
* **Role:** Technical product-aware texture for section headings (32px/600, 36px/500, 48px/500) and dense information blocks[cite: 9].
* **Weights:** 400, 500, 600.

---

## 4. Spacing, Layout & Border Radius

* **Page Max Width:** `1200px` centered content column[cite: 9].
* **Section Gap:** `64px` to `80px` vertical spacing between blocks[cite: 9].
* **Border Radii:**
  * UI Controls & Small Elements: `10px` (`--radius-lg`)[cite: 9]
  * Standard Cards: `24px` (`--radius-3xl`)[cite: 9]
  * Large Panels / Mockups: `40px` (`--radius-3xl-2`)[cite: 9]
  * Full Pills (Buttons, Nav items, Badges): `9999px` (`--radius-full-2`)[cite: 9]

---

## 5. Key UI Component Specs

### 1. Floating Frosted Nav (`.floating-nav`)
* **Background:** Graphite (`#161616`) with 4px backdrop blur[cite: 9].
* **Border:** 1px solid Hairline (`#e5e5e5`) with asymmetric border-radius (`19px`)[cite: 9].
* **Placement:** Floats 16–24px from the top or bottom viewport edge with internal links and a white pill CTA[cite: 9].

### 2. Apple-Style Liquid Glass Bubble Toggles
* Active items, tabs, or toggles feature a frosted glass bubble highlight (`rgba(255, 255, 255, 0.08)` to `0.15`) with a soft backdrop blur, making it feel tactile and modern.

### 3. White Pill CTA (`.btn-primary`)
* Solid `#ffffff` background, `#000000` text, `9999px` radius, 8px vertical × 12px horizontal padding[cite: 9]. Inverts the dark canvas to instantly catch the eye.

### 4. Frosted Glass Feature Cards
* Background: `rgba(212, 212, 212, 0.1)` with 4px backdrop blur, 24px border radius, and 1px subtle hairline border. No heavy drop shadows—depth is achieved entirely through translucency and surface contrast[cite: 9].

---

## 6. Tailwind v4 Theme Configuration

Add this directly into your global CSS file (`globals.css`) in your Next.js project:

```css
@import "tailwindcss";

@theme {
  /* Colors */
  --color-void-canvas: #0a0a0a;
  --color-graphite: #161616;
  --color-frosted-glass: #d4d4d4;
  --color-ink-black: #000000;
  --color-snow-white: #ffffff;
  --color-bone: #ededed;
  --color-ash: #c2c2c2;
  --color-slate: #686868;
  --color-smoke: #b2b2b2;
  --color-hairline: #e5e5e5;
  --color-dusk-violet: #6b62f2;

  /* Typography */
  --font-dm-sans: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
  --font-geist: 'Geist', ui-sans-serif, system-ui, sans-serif;

  /* Spacing Scale */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-64: 64px;

  /* Border Radius */
  --radius-ui: 10px;
  --radius-cards: 24px;
  --radius-panels: 42px;
  --radius-pill: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset;
}

/* Base Body Styles */
body {
  background-color: var(--color-void-canvas);
  color: var(--color-bone);
  font-family: var(--font-dm-sans);
  overflow-x: hidden;
}



7. Golden Design Rules (Do's & Don'ts)
DO use 9999px pill radii for all primary buttons, interactive tabs, and navigation links[cite: 9].

DO keep text color to #ededed (Bone) on dark surfaces instead of pure white to prevent eye strain[cite: 9].

DON'T use heavy drop shadows (box-shadow); rely purely on hairline borders (#e5e5e5) and translucent layering[cite: 9].

DON'T use bold weights (700+) for major titles; maintain the weight-500 architectural restraint[cite: 9].