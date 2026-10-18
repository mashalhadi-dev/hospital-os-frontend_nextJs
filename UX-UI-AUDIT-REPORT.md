# Hospital OS — UX/UI Audit & Improvement Report

**Application:** DocNode / HealthNode (Next.js 16 App Router · React 19 · Tailwind v4 · TanStack Query v5 · Zustand)
**Scope audited:** `src/app/**` (11 routes), `src/components/**` (15 components), `src/hooks`, `src/store`, `src/services`, `src/types`, `globals.css` design tokens
**Date:** 2026-10-17 · **Auditor role:** Principal Product Designer / UX Auditor / Accessibility Specialist

---

## 1. Executive Summary

### Overall UI/UX Maturity: **5.0 / 10**

DocNode has an **ambitious, high-craft visual layer** — a real token system (`--hn-*` → Tailwind v4 `@theme inline`), a consistent glassmorphism language, dark/light theming with a FOUC guard script, skeleton loaders, an error-banner primitive, and a toast system wired to every mutation. Visually it reads like a polished concept.

But underneath the glass it is **not yet a safe, fast clinical tool**:

| Area | Score | Verdict |
|---|---|---|
| Design system & tokens | 6.5/10 | Real token layer, undermined by dead classes, duplicate variants, hardcoded `white/5` that breaks light mode |
| Visual consistency | 6.5/10 | Cohesive glass aesthetic; inconsistent stat sizes, status-color semantics, type scale down to 9px |
| Information architecture | 4.0/10 | One screen per role; no detail pages/sidebar/pagination; home route is an internal component showcase |
| Interaction UX & workflows | 3.5/10 | Multi-drug Rx impossible; walk-in registration missing; free-text dosing; no slot picker |
| Feedback & system states | 5.5/10 | Skeletons/toasts exist — but zero confirmation dialogs, no double-submit guards, 4s error toasts |
| Accessibility (WCAG 2.2 AA) | 2.5/10 | Zero label associations, no focus traps, no Escape handling, dead interactive `<div>`s, 9px text, no aria-live |
| Responsiveness | 5.0/10 | Grids collapse; dense tables and 6-field vitals forms hostile on tablet/mobile |
| Performance | 5.5/10 | All-client rendering, duplicate font loading, GPU-heavy blur everywhere, no reduced-motion |

**The 80/20:** the visual shell is ~80% done; the **interaction layer is ~30% done**. A receptionist at a busy desk, a doctor with 14 waiting patients, or a nurse on a tablet will hit friction, ambiguity, or safety risk in their first five minutes. Fixing the **P0 items in §5** would move this app to ~7/10 with modest effort.

---

## 2. Component & Feature Matrix (What Exists vs. What's Missing)

### 2.1 Present Inventory

| Category | Component / Pattern | File | Status |
|---|---|---|---|
| Layout | Floating capsule navbar (brand, RBAC badge, search, theme, avatar, logout) | `layout/DashboardLayout.tsx` | ✅ Polished |
| Layout | Route guard with role fallback + auth-loading card | `layout/ProtectedRoute.tsx` | ✅ Solid |
| Layout | 5 role page shells + `/dashboard` redirector | `app/*/page.tsx` | ✅ Works |
| Cards | FrostedGlassCard — 6 variants, 5 paddings | `ui/FrostedGlassCard.tsx` | ⚠ Duplicate `glow`/`glowing` |
| Buttons | PillButton — 6 variants, 3 sizes, isLoading, glow | `ui/PillButton.tsx` | ✅ Good primitive |
| Tags | PillTag — 9 variants, removable, interactive | `ui/PillTag.tsx` | ⚠ Duplicate `amber`/`warning`, `crimson`/`error`; clickable `div` |
| Toggles | LiquidGlassToggle — segmented tabs **and** switch in one | `ui/LiquidGlassToggle.tsx` | ⚠ Two responsibilities; dead animation classes |
| Frame | CanvasFrame — macOS-style window chrome | `ui/CanvasFrame.tsx` | ⚠ Built but **unused** outside showcase |
| Feedback | Toast system (Zustand, 5 types, auto-dismiss) | `store/toast-store.ts`, `ui/ToastContainer.tsx` | ⚠ No aria-live; errors vanish in 4s |
| Feedback | Skeleton / SkeletonCard / SkeletonTable / ApiErrorBanner | `ui/Skeleton.tsx` | ⚠ `bg-white/10` invisible in light mode |
| Theming | Dark/light store + FOUC script + animated switcher | `store/theme-store.ts`, `providers/ThemeProvider.tsx` | ✅ Above average |
| Dashboards | Admin: stats, patient table, user table, client filters | `AdminDashboard.tsx` | ⚠ No pagination/sort; dead filter |
| Dashboards | Doctor: OPD queue, patient panel, Rx modal, AI drawer | `DoctorDashboard.tsx` | ⚠ Rx = 1 drug only; no cancel |
| Dashboards | Nurse: vitals form, history, MAR list | `NurseDashboard.tsx` | ⚠ No abnormal flagging; one-click MAR |
| Dashboards | Receptionist: appointments + check-in, invoices, 2 modals, AI | `ReceptionistDashboard.tsx` | ⚠ No walk-in patient creation |
| Dashboards | Patient: book modal, Rx list, invoice table | `PatientDashboard.tsx` | ⚠ No pay/download/cancel |
| AI | Co-pilot drawer: doctor (3 tabs+chat), nurse chat, receptionist templates | `ai/AiCoPilotDrawer.tsx` | ⚠ No Escape/backdrop close/focus trap |
| Auth | Login + role-conditional register (11→15 fields) | `app/login`, `app/register` | ⚠ 2 dead controls; 1 mega-form |
| Data | React Query hooks: 13 queries, 6 mutations, key invalidation | `hooks/useApi.ts` | ✅ Good foundation |

### 2.2 Missing Essential UX Elements

| Missing element | Severity | Where it hurts |
|---|---|---|
| **Confirmation dialogs for consequential actions** (logout, "Record Medication Administration", Complete Appointment, Issue Invoice) | 🔴 Critical | Clinical safety + irreversible billing |
| **Cancel-appointment action** (enum `CANCELLED` exists in `types/appointment.ts`, but **no UI anywhere can set it**) | 🔴 Critical | No-shows & mistakes can't be stopped |
| **Inline form validation** (zero `htmlFor`/`id` pairs app-wide; validation = toast after failed submit) | 🔴 Critical | Every form in the app |
| **Walk-in patient registration by receptionist** (no "Add Patient" form exists) | 🔴 Critical | Front desk cannot register a new patient |
| **Multi-item prescription builder** (Rx modal hardcodes a single-item `items` array) | 🔴 High | Real prescriptions have 3–6 drugs |
| **Abnormal-vitals flagging** (no reference ranges, no red/amber highlight) | 🔴 High | Nurse portal's core safety job |
| **Time-slot / availability picker** (`datetime-local` free text → 3 AM bookings) | 🔴 High | Both booking flows |
| **Working global search** (navbar `searchQuery` state is written but never read) | 🔴 High | Misleading UI — typing does nothing |
| **Pagination, sorting, debounced search, export** on admin/receptionist tables | 🟠 Medium | Degrades at 100+ records |
| **Route-level `loading.tsx` / `error.tsx` / `not-found.tsx`** (none exist) | 🟠 Medium | Raw framework error dumps |
| **Skip-to-content, `<nav>` landmark labels, per-page `<h1>`, heading order** | 🟠 Medium | Screen-reader navigation |
| **`prefers-reduced-motion` support** (8 continuous animations, none gated) | 🟠 Medium | Vestibular-sensitive users |
| **Print/PDF invoice & prescription views; currency + locale formatting** (`$ USD` hardcoded) | 🟠 Medium | Patient portal |
| **Patient-initiated cancellation; "Pay now" on DUE invoices** | 🟠 Medium | Patient self-service |
| **Notifications, profile/settings, breadcrumbs, patient detail page** | 🟡 Low | IA completeness |
| **Admin role filter** buttons (both branches of the predicate always evaluate true) | 🟠 Medium | Fake affordance |

---

## 3. Top Critical Design Mistakes & Usability Issues

Severity: 🔴 High · 🟠 Medium · 🟡 Low. Evidence paths relative to `healthnode-frontend/src/`.

### 3.1 Safety & Destructive Actions

| # | Sev | Screen | Problem | Impact |
|---|---|---|---|---|
| C1 | 🔴 | Nurse MAR (`NurseDashboard.tsx:342-351`) | "Record Medication Administration" fires on **single click** — no confirm step, no time/dose entry, no undo | **Patient-safety risk:** an accidental tap records a false legal medication event |
| C2 | 🔴 | All modals + logout (`DoctorDashboard.tsx:328`, `ReceptionistDashboard.tsx:411,469`, `PatientDashboard.tsx:345`, `DashboardLayout.tsx:105-116`) | No `ConfirmDialog` anywhere; logout, invoice issue, appointment complete execute instantly | Mis-clicks become irreversible records; billing disputes |
| C3 | 🔴 | Doctor/Receptionist queues | **No cancel action exists** despite `CANCELLED` status in the type system | No-shows permanently pollute the queue; workflow dead-end |
| C4 | 🟠 | Nurse vitals submit (`NurseDashboard.tsx:250-252`) | Submit button lacks `disabled={createVitalSign.isPending}` (every other mutation has it) | Double-submits → duplicate vitals in the legal record |
| C5 | 🟠 | Doctor Rx save (`DoctorDashboard.tsx:453-461`) | PillButton's `isLoading` prop exists but isn't passed — no spinner during save | Doctor may click again believing it failed |

### 3.2 Accessibility (WCAG 2.2 AA Failures)

| # | Sev | Screen | Problem | Impact |
|---|---|---|---|---|
| A1 | 🔴 | Every form (login, register, 4 modals, vitals) | **Zero `htmlFor`/`id` associations** — labels are visual siblings only (verified: no `htmlFor` in codebase) | Screen readers announce "edit text, blank"; SR users cannot complete any form |
| A2 | 🔴 | All 4 modals + AI drawer | No `role="dialog"`, no `aria-modal`, no focus trap, no Escape handler, backdrop click doesn't close, no scroll lock | Focus escapes behind overlay; keyboard users trapped or lost |
| A3 | 🔴 | Icon-only close buttons (Rx modal `:337-342`, billing modal `:475-477`, book modal `:351-353`, AI drawer `:170-175`, toast dismiss `ToastContainer.tsx:46-51`) | No `aria-label` — only 9 aria-labels exist app-wide, all on refresh/toggles | SR users hear only "button" |
| A4 | 🔴 | Toasts (`ToastContainer.tsx:29`) | Container has no `role="status"`/`aria-live` — toasts are the **only** feedback channel for validation & API errors | SR users get zero confirmation or error feedback on any action |
| A5 | 🔴 | Typography (`DashboardLayout.tsx:55,100`; tables at `text-[10px]`) | 9–10px text for role/metadata/table headers; `text-muted` `#71717a` on `#080d1a` ≈ 3.9:1 (fails AA 4.5:1) | Illegible for low-vision users; fails contrast audits |
| A6 | 🟠 | PillTag interactive (`PillTag.tsx:74-87`) | Clickable `<div>` — no `role="button"`, no `tabIndex`, no key handler | Keyboard users cannot operate filter chips |
| A7 | 🟠 | Tables (4 instances) | No `<caption>`, no `scope="col"` on `<th>`; placeholder-only labels on navbar search (`DashboardLayout.tsx:77-83`) and admin search (`:161-167`) | SR table navigation unusable |
| A8 | 🟠 | Login (`login/page.tsx:154`) | "Forgot password?" is a `<span>` — not focusable, no href | Dead control; also an a11y failure |
| A9 | 🟠 | App-wide | No skip-link; dashboards start at `<h2>` with no `<h1>`; segmented toggles lack `aria-pressed`/roving tabindex | Poor SR/keyboard orientation |
| A10 | 🟠 | Animations | No `prefers-reduced-motion` media query anywhere; pulsing dots, shimmer, stagger loops run for everyone | Vestibular discomfort; attention fatigue |

### 3.3 Design-System & Visual Errors

| # | Sev | Screen | Problem | Impact |
|---|---|---|---|---|
| D1 | 🔴 | All dashboards' inputs/tables (e.g. `NurseDashboard.tsx:170-246`, `AdminDashboard.tsx:270,275,286`, every modal) | Hardcoded dark-only `bg-white/5 border-white/10`; tokens support light mode but components bypass them | **Light mode broken:** white-on-white inputs, invisible borders, unreadable tables |
| D2 | 🟠 | `DoctorDashboard.tsx:379` | `text-warning` — no `--color-warning` token in `@theme inline`; class silently no-ops | Empty-inventory warning renders in default color |
| D3 | 🟠 | `ToastContainer.tsx:33`, `LiquidGlassToggle.tsx:136` | `animate-in …` classes require `tailwindcss-animate`/`tw-animate-css` — **not installed** | Toasts/highlights pop in with no animation |
| D4 | 🟠 | Status semantics | Doctor: `COMPLETED` → purple accent; Invoices: `PENDING` → purple accent; Appointments: `PENDING` → amber. Three systems for the same words | Color stops communicating status |
| D5 | 🟠 | Stat cards | Admin `text-2xl font-mono`; Nurse `text-3xl font-extrabold`; Patient `text-2xl font-bold` — 3 metric styles | Cross-portal incoherence |
| D6 | 🟡 | `FrostedGlassCard.tsx:7,44-47` / `PillTag.tsx:8,56-63` | Duplicate API: `glow`≡`glowing`, `amber`≡`warning`, `crimson`≡`error` | Contributor confusion; inconsistent picks |
| D7 | 🟡 | `page.tsx:71` vs `DashboardLayout.tsx:62` | Version drift "V4.2" vs "V4.8"; `docnode-frontend` package in `healthnode` repo; footer claims "HIPAA & GDPR Compliant … Neural Network" | Erodes trust; UI compliance claims are a legal liability |
| D8 | 🟠 | `register/page.tsx:162` | `grid-cols-5` for **4** role buttons | Dead 5th column; lopsided layout |
| D9 | 🟠 | `app/page.tsx` (home) | Route `/` renders an internal "Step 3 Component Library Verified Clean" showcase to end users | Unprofessional first impression; leaks internals |

### 3.4 Form Usability & Responsiveness

| # | Sev | Screen | Problem | Impact |
|---|---|---|---|---|
| F1 | 🔴 | All forms | Validation only **after** submit via toast (`login:31-39`, `register:46-59`, `DoctorDashboard:61-64`); no inline errors, no touched-state, no `aria-invalid`/`aria-describedby` | Users discover errors late; SR users get no field-level signal |
| F2 | 🟠 | Login (`login/page.tsx:150-153`) | "Remember session" checkbox is decorative — token is always persisted regardless | The control lies |
| F3 | 🟠 | Register (`register/page.tsx`) | 15-field mega-form; role switch swaps blocks mid-form causing layout jump; "Staff Registration Secret" has no hint on where to obtain it | High abandonment; staff stuck |
| F4 | 🟠 | Nurse vitals (`NurseDashboard.tsx:47-79`) | All 6 vitals `required` — a nurse taking only BP cannot submit without fabricating temp/glucose | **Data integrity risk** |
| F5 | 🟠 | Nurse vitals (`:60,286-289`) | Label says °F, value silently converted to °C, history renders °C | Unit confusion → chart-reading errors |
| F6 | 🟠 | Modals / tables on tablet | Fixed `max-w-md/lg` panels; dense tables rely on `overflow-x-auto` | Horizontal scrolling on reception tablets |
| F7 | 🟠 | Number inputs | No `inputMode="numeric"/"decimal"`, no length cap on invoice amount | Poor mobile keyboards; oversized entries |
| F8 | 🟡 | Search inputs (navbar, admin, receptionist) | No debounce; filters run per keystroke over full lists | Jank on large datasets |

### 3.5 Role-Specific UX Flaws

**Doctor Portal** — Queue lists **all** appointments incl. COMPLETED/CANCELLED (a queue should show who's waiting now); no search/sort/date grouping. `selectedAppointment ?? appointments?.[0]` silently re-binds selection to row 1 after every refetch — doctors lose their place mid-consult. Rx desk supports exactly **one drug** with free-text dosing. Patient context is only `symptoms` + `notes` — no vitals, no prior Rx, no allergies (field absent from model). No "call next patient", no consult timer, no writable consult notes.

**Nurse Portal** — Patient picker is a raw `<select>` of every patient (unusable past ~30). No abnormal-range highlighting (180/120 renders like 118/76). MAR flattens all prescriptions into one stream; no "due now" grouping, no scheduled times; one-click administration (C1). History capped at 5 rows; no trends despite "Telemetry" branding.

**Receptionist Portal** — **Cannot register a walk-in patient** (modals only select existing patients). No search-first "find patient" step. Free `datetime-local` booking: no availability, no slot duration, no conflicts. Invoice requires manual amount — no link to appointment fee or itemized services.

**Patient Portal** — Invoice table uses three color systems for the same statuses (D4); no amount-due summary, no Pay, no PDF. No cancellation/rescheduling; no doctor info; no post-visit summary. "PHR" branding promises a record — delivers 3 tables. Copy assumes health literacy.

**Admin Portal** — Read-only user directory (no create/deactivate/reset). Patient filter chips are a no-op; no patient edit. Revenue is an unformatted sum with no date range or collected-vs-pending split.

## 4. Complex UI Elements Analysis

### 4.1 E-Prescription Desk (DoctorDashboard) — Complexity: 🔴 Highest

**Current:** 1 modal · 6 fields · supports **1 drug** · free-text dosage · flat medicine `<select>` · no save spinner (C5).

**Why it fails:** Prescribing is the doctor's most frequent, highest-stakes task. Flow today: open modal → scroll a flat inventory list → re-type dosing as prose → submit → repeat per drug, creating **separate prescription records** that fragment the clinical trail.

**Redesigned wireframe:**

```
┌─ E-Prescription · Patient: A. Mehta (MRN 1042) ──────────────┐
│ Diagnosis *                                                   │
│ ┌──────────────────────────────────────────────────────────┐ │
│ └──────────────────────────────────────────────────────────┘ │
│ Medications                                                   │
│ ┌─ #1 ────────────────────────────────────────────────────┐  │
│ │ [Drug autocomplete: name + stock + allergy flag      ▾]  │  │
│ │ Strength [select] Frequency [select] Duration [ 7 ] d   │  │
│ │ Route [PO]          Qty [– 10 +]        [× remove]      │  │
│ └──────────────────────────────────────────────────────────┘  │
│ [+ Add medication]              ⚠ Amoxicillin: stock only 3   │
│ Instructions (auto-composed from picks, editable)             │
│ ┌──────────────────────────────────────────────────────────┐ │
│ └──────────────────────────────────────────────────────────┘ │
│                                 [Cancel]  [Save Rx] (spinner) │
└───────────────────────────────────────────────────────────────┘
```

**Implementation steps:**
1. Keep the single `api.prescriptions.create` call; hold `items[]` in reducer state (`{medicineId, dosage, frequency, durationDays, route, quantity}`) and join structured fields into the existing `dosage` string for backward compatibility: `` `${strength} · ${frequency} · ${route} · ${durationDays}d` ``.
2. Replace the medicine `<select>` with a combobox (shadcn `Command` inside `Popover`) filtering by name, showing stock counts and an amber "low stock" tag under 5.
3. Allergy check: compare drug name against a new `patient.allergies[]` field; block with crimson pill.
4. Pass `isLoading={createPrescription.isPending}` to the submit PillButton (prop already exists).

### 4.2 Vitals Entry (NurseDashboard) — Complexity: 🔴 High

**Current:** 6 single-purpose states, all `required`, silent °F→°C conversion, no ranges, no pending guard (C4), submit labeled "Log Telemetry & Transmit to EHR" (theater copy for a POST).

**Redesigned wireframe:**

```
┌─ Vitals · A. Mehta · bed 4B ───────────────────────────────┐
│ BP [ 118 ] / [ 76 ] mmHg     HR [ 72 ] bpm    SpO₂ [ 98 ] % │
│ Temp [ 37.0 ] [°C ▾]         Glucose [ 96 ] mg/dL           │
│ ⚠ Live range feedback: fields tint green/amber/crimson +    │
│   icon + text label ("High BP — review") as you type        │
│ ✱ SpO₂ & Glucose optional — leave blank if not taken        │
│ [ Save vitals ]  (disabled + spinner while pending)         │
└──────────────────────────────────────────────────────────────┘
```

**Implementation steps:**
1. One `vitals` state object; SpO₂/glucose optional — send `undefined`, **never** `Number('')`→`0`.
2. Pure `classifyVital(kind, value)` helper with WHO-style thresholds → `'normal' | 'warn' | 'crit'`; render border tint + `AlertTriangle` + text (never color alone).
3. °C/°F toggle; convert only at the API boundary; echo converted value in the success toast.
4. `disabled={createVitalSign.isPending}` + `isLoading` on submit.

### 4.3 Receptionist Appointment Creation — Complexity: 🟠 Medium-High

**Current:** modal → patient `<select>` (all patients, no search) → doctor `<select>` → free `datetime-local` → symptoms → submit. No walk-in creation, no slots, no conflicts, no fee linkage.

**Redesigned wireframe:**

```
┌─ New Appointment ────────────────────────────────────────┐
│ Patient [ 🔍 search… (typeahead w/ MRN)      ] [+ Walk-in]│
│          + opens inline mini-form (name/phone/age/gender) │
│          → auto-creates patient profile                   │
│ Doctor  [ Dr. S. Rao — Cardiology ▾ ]                     │
│ Date    [ 17 Oct ▾ ]  Slots: 09:00 09:30 ●10:00 10:30 …  │
│         (grey = booked; click to choose)                  │
│ Symptoms [ optional ]      Consultation fee $45 (auto)    │
│                     [Cancel]  [Book & Invoice →]          │
└────────────────────────────────────────────────────────────┘
```

**Implementation steps:**
1. Extract a reusable `PatientCombobox` (also used by billing modal & nurse picker) with debounced client filter.
2. "Walk-in" toggles an inline 4-field sub-form calling `api.patients.create` (backend endpoint exists — surface it in `services/api.ts`).
3. Replace `datetime-local` with date picker + slot grid from doctor availability; grey booked slots by overlap-checking `appointments`.
4. Checkbox "Generate invoice now" chains `useCreateInvoice` after appointment success — kills a second modal trip.

### 4.4 Register Page (mega-form) — Complexity: 🟠 Medium

**Current:** role buttons → up to 15 fields in one column; conditional sections pop in/out; staff secret unexplained; 4 buttons in a 5-column grid (D8).

**Recommendation:** 2-step wizard — **Step 1** role + credentials (name/email/password/phone); **Step 2** role-specific details with a completion checklist. Persist draft to `sessionStorage`. Fix `sm:grid-cols-5` → `sm:grid-cols-4`. Add inline validation (§5.3) and helper text: "Staff registration secret — issued by your hospital administrator."

### 4.5 AI Co-Pilot Drawer — Complexity: 🟠 Medium

**Good:** clear privacy copy for receptionist mode; chat transcript with timestamps; error in `role="alert"`.

**Fixes:** backdrop click + Escape to close; focus in on open / restore on close; `role="dialog"` + `aria-modal`; message list `aria-live="polite"`; replace fixed `h-[380px]` chat canvas with `max-h-[60vh]`; add "Copy" on generated summaries; persist chat per patient in `sessionStorage` so closing mid-consult doesn't lose the thread.

### 4.6 Navbar Search (DashboardLayout) — 🟡 Low effort, 🔴 High trust cost

A centered, always-visible search that **does nothing** (`searchQuery` dead state, `:33,77-83`) is worse than no search. Either wire it to a global patient lookup (debounced `GET /patients?search=` → result dropdown) or remove it. Recommend a ⌘K command palette (shadcn `Command`) as the single global entry point for patients, pages, and actions.

---

## 5. Actionable Solutions & Code/Design Guidelines

### 5.0 Priority Roadmap

| Phase | Items | Outcome |
|---|---|---|
| **P0 — Safety & trust (1–2 weeks)** | ConfirmDialog for MAR/logout/complete/invoice (C1–C3); modal a11y via Radix Dialog (A2, A3); vitals pending guard + optional fields (C4, F4); inline validation + label `id`s (A1, F1); light-mode input tokens (D1); kill dead UI — navbar search, admin filter, remember-me, forgot-pw span, showcase home (F2, D9); toast aria-live + longer error duration (A4) | Trustworthy core loop |
| **P1 — Workflow fitness (2–4 weeks)** | Multi-drug Rx builder (§4.1); vitals ranges + unit toggle (§4.2); walk-in registration + slot picker (§4.3); appointment cancel action (C3); queue status filter + stable selection; `text-warning` token + `tw-animate-css` (D2, D3); route `loading/error/not-found`; table pagination; register wizard (§4.4) | Competitive daily driver |
| **P2 — Polish (ongoing)** | ⌘K palette; invoice PDF + Pay now; patient cancel/reschedule; trends chart; profile/settings; i18n + `Intl` formatting; reduced-motion; brand unification (D7); admin user management | Product maturity |

### 5.1 Tailwind / Token Fixes (drop-in)

**A. Add missing tokens** in `globals.css` `@theme inline` (fixes D2 + one canonical status map):

```css
/* status semantics — one canonical mapping */
--color-success: #38e1b0;   /* alias of emerald  */
--color-warning: #f59e0b;   /* fixes text-warning */
--color-danger:  #f43f5e;   /* alias of crimson  */
--color-info:    #38bdf8;
```

Then `npm i -D tw-animate-css` + `@import "tw-animate-css";` — revives the dead `animate-in fade-in slide-in-from-bottom-3` classes in `ToastContainer.tsx:33` and `LiquidGlassToggle.tsx:136` (D3).

**B. Make light mode work** — replace hardcoded dark-only surfaces with tokens (D1), sweep across all dashboards & modals:

```tsx
// BEFORE (invisible in light mode)
className="bg-white/5 border border-white/10 text-xs text-text-primary"
// AFTER
className="bg-surface-low border border-border-input text-sm text-text-primary
           [.light_&]:bg-white focus:border-accent"
```

Same for skeletons: `bg-white/10` → `bg-surface-high` (`Skeleton.tsx:12`).

**C. Reduced motion & legibility floor** (fixes A5, A10):

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Delete all `text-[9px]`/`text-[10px]` (`DashboardLayout.tsx:55,100`; table headers) → floor of `text-[11px]` metadata, `text-xs` table headers; lighten `--hn-text-muted` `#71717a` → `#8b8b93` (≈4.6:1 on `#080d1a`).

**D. One status-color map** (fixes D4) — `lib/status.ts`:

```ts
export const STATUS_VARIANT = {
  PENDING:    'warning',   // needs action  (amber)
  CONFIRMED:  'emerald',   // checked-in    (green)
  COMPLETED:  'secondary', // done          (neutral — NOT purple)
  CANCELLED:  'error',     // stopped       (red)
  PAID:       'emerald',
  DUE:        'warning',
} as const;
```

Use it in Doctor, Receptionist, and Patient dashboards; purple (`accent`) reserved for AI/primary actions. Collapse duplicate variants (`amber`/`warning`, `crimson`/`error`, `glow`/`glowing`) to one name each (D6).

**E. Formatting utilities** — `lib/format.ts`:

```ts
export const fmtCurrency = (v: number) =>
  new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(v);
export const fmtDate = (d: string | Date) =>
  new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(d));
export const fmtDateTime = (d: string | Date) =>
  new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(d));
```

### 5.2 Shadcn/UI Components to Introduce

| Component | Replaces | Fixes |
|---|---|---|
| **Dialog** (Radix) | 4 hand-rolled `fixed inset-0 z-[200]` modals + drawer backdrop | Focus trap, Escape, `aria-modal`, scroll lock, click-outside — **A2 wholesale** |
| **AlertDialog** | Absent | Confirmations: MAR record, logout, Complete, Issue Invoice — **C1, C2** |
| **Label + Form** (`react-hook-form` + `zod`) | Toast-based validation | `htmlFor` wiring, inline errors, `aria-invalid`, touched-state — **A1, F1** |
| **Select / Combobox** (`Command`) | Raw `<select>` for patients/medicines/doctors | Searchable pickers usable at 100+ records |
| **Table** (+ `Pagination`) | Ad-hoc tables ×4 | `<caption>`, `scope`, sticky header, page size, responsive cards |
| **Tabs** | AI drawer hand-rolled tabs | `aria-selected`, roving focus — **A9** |
| **Toast** (Radix) or patch existing | Custom `ToastContainer` | Built-in `aria-live`, per-type duration (errors 8s) — **A4** |
| **Field / InputAddon** | ~10 copies of `relative` + absolute-icon blocks | One validated input primitive with icon/error/hint slots |

> Theme Radix/shadcn tokens onto your `--hn-*` palette (not default shadcn colors) so the glass aesthetic survives.

### 5.3 Layout Refactoring Plan

1. **Extract `<Modal>` shell** (if deferring Radix): one component enforcing `role="dialog" aria-modal="true"`, Escape + backdrop close, focus trap, `max-h-[90dvh] overflow-y-auto` — migrate 4 modals + drawer in one pass.
2. **Extract `<StatCard>`, `<Toolbar>`, `<EmptyState>`, `<DataTable>`** into `components/ui/` — the header/search/filter/table pattern is copy-pasted 4×; collapsing it removes ~400 duplicated lines and fixes D5 by construction.
3. **Doctor queue**: default filter `status ∈ {PENDING, CONFIRMED}` + chips for All/Done/Cancelled; set `selectedAppointmentId` only on explicit click (drop the `?? appointments?.[0]` fallback) — stops selection jumping mid-refetch.
4. **Navbar**: remove or wire the dead search; `<nav aria-label="Primary">`; skip-link `<a href="#main" class="sr-only focus:not-sr-only">Skip to content</a>` + `id="main"` on `<main>`; per-route `<h1>` (promote dashboard `h2`).
5. **Route hygiene**: add `app/loading.tsx` (SkeletonCard grid), `app/error.tsx` (ApiErrorBanner + retry), `app/not-found.tsx`; make `/` redirect to `/login` or the role dashboard; move the showcase to `/dev/ui` behind auth.
6. **Forms**: shared `(auth)` layout for login/register; register wizard (§4.4); wire remember-me to real behavior (persist only when checked) or delete it.
7. **Icon-only button sweep**: codemod — any button whose only child is an icon gets `aria-label` (A3).

### 5.4 Definition of Done (re-audit targets)

- ✅ Every input has an associated label; every icon-only button an `aria-label`
- ✅ Keyboard-only pass: open/close every modal + drawer, submit every form, operate every chip
- ✅ Light + dark render all forms/tables with ≥4.5:1 text contrast; no text below 11px
- ✅ Every mutating action shows pending state; every irreversible action requires confirmation
- ✅ Status colors follow the single map; purple appears only on AI/primary affordances
- ✅ Doctor prescribes 3+ drugs in one save; nurse logs partial vitals with abnormal flags; receptionist registers a walk-in in ≤60s; patient finds amount due in ≤3 taps

---

*Audit based on static code review of 38 source files (no runtime session). Scores reflect production-readiness for a multi-role clinical setting. Re-audit recommended after P0 completion.*







