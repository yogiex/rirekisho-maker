# FEATURE.md — Rirekisho Maker (履歴書メーカー)

| | |
|---|---|
| **Product** | Rirekisho Maker — free, private-by-design Japanese resume builder |
| **Doc role** | Technical specification: data model, validation, flow, acceptance criteria |
| **Authority** | PRD (why/who/success) → **FEATURE.md (what/how)** → DESIGN.md (visual) → SECURITY.md (what must never happen) |
| **Status** | Locked for build — MVP scope |

> On conflict: product scope → PRD wins · technical detail → **FEATURE wins** · visuals → DESIGN wins · security → SECURITY wins.

---

## Daftar Isi

1. [Architecture Overview](#1-architecture-overview)
2. [Data Model](#2-data-model)
3. [Wizard Flow](#3-wizard-flow)
4. [Feature Modules](#4-feature-modules)
5. [Component Inventory](#5-component-inventory)
6. [File Structure Reference](#6-file-structure-reference)
7. [Acceptance Criteria](#7-acceptance-criteria)
8. [Definition of Done per Feature](#8-definition-of-done-per-feature)

---

## 1. Architecture Overview

### 1.1 Deployment Model

**Static Single Page Application (SPA)** — no backend, no server, no API.

| Aspect | Implementation |
|---|---|
| Framework | Next.js 16.3.4 (App Router, `output: 'export'`) |
| Package manager | pnpm 11.7.0 |
| Runtime | Client-side only (`'use client'` on all interactive components) |
| Deployment | GitHub Pages via GitHub Actions (static `.nojekyll`) |
| basePath | `NEXT_PUBLIC_BASE_PATH` env var — matches repo name (`rirekisho-maker`) |
| Data persistence | `localStorage` only — zero network requests |
| CSP policy | `connect-src 'none'` in production (enforced by SECURITY.md SEC-01) |

### 1.2 Tech Stack

| Layer | Technology |
|---|---|
| UI framework | React 19.2.8 |
| Component library | shadcn/ui v4 (`base-nova` style, `@base-ui/react` + Base UI primitives) |
| CSS | Tailwind CSS v4, `tw-animate-css` |
| Form management | react-hook-form 7.87.0 + `@hookform/resolvers` 5.9.1 |
| Validation | Zod 4.6.2 (via `zodResolver`) |
| Icons | lucide-react |
| Toast notifications | sonner |
| Theming | next-themes (light mode only per D-7) |
| Font | Inter (Latin) + Noto Sans JP (Japanese) via `next/font` |
| Type checking | TypeScript 5.x, `strict: true` |
| Linting | ESLint 9 (`eslint-config-next`) |
| Module resolution | `bundler` with `@/*` path alias → `./src/*` |

### 1.3 Privacy Architecture

All user data (form fields, photo as base64 data URL) is stored exclusively in the browser. The app enforces this architecturally:

- **No server endpoints** — static export only
- **No analytics** — no tracking scripts, no beacon requests
- **CSP `connect-src 'none'`** — blocks all outbound network requests even if code is compromised
- **EXIF stripping** — photo processing re-encodes via Canvas, discarding all metadata (including GPS)
- **Verifiable** — user can confirm zero requests in DevTools → Network tab

### 1.4 State Management

| State | Storage | Mechanism |
|---|---|---|
| Form data | Component state (react-hook-form) | `useForm<RirekishoFormData>` with `watch()` subscription |
| Persistence | `localStorage` | Debounced auto-save (800ms) via `saveDraftDebounced()` |
| Wizard navigation | `useState` in `WizardShell` | `currentStep` (0–4) + `visitedSteps` (Set<number>) |
| Photo | Base64 data URL | Stored as `string` in form state, persisted in draft |

---

## 2. Data Model

### 2.1 Zod Schema (`src/lib/schema/rirekisho-schema.ts`)

The canonical data model is defined by `rirekishoSchema` — a Zod object with `superRefine` for cross-field validation.

```
rirekishoSchema
├── fillDate: JpDate { year: 1900–2100, month: 1–12 }
├── photo: string (optional — base64 data URL)
├── furigana: string (regex: hiragana only, max 40)
├── fullName: string (min 1, max 40)
├── dateOfBirth: JpDate
├── gender: enum ['male', 'female', 'none'] (default: 'none')
├── postalCode: string (regex: /^\d{3}-?\d{4}$/)
├── prefecture: string (min 1)
├── address: string (min 1, max 100)
├── addressFurigana: string (optional)
├── phone: string (regex: /^0\d{1,4}-?\d{1,4}-?\d{3,4}$/)
├── email: string (email validation)
├── alternateContactEnabled: boolean (default: false)
├── alternateContact: AlternateContactSchema (optional)
│   ├── relation: string (min 1)
│   ├── name: string (min 1)
│   └── phone: string (regex: phone)
├── history: HistoryEntry[]
│   ├── id: string
│   ├── date: JpDate
│   ├── category: enum ['education', 'work']
│   ├── name: string (min 1, max 60)
│   ├── nameFurigana: string (optional)
│   ├── action: string (min 1)
│   └── detail: string (optional)
├── historyCurrent: boolean (default: false)
├── licenses: LicenseEntry[]
│   ├── id: string
│   ├── date: JpDate
│   ├── name: string (min 1, max 60)
│   └── issuer: string (optional)
├── specialties: string (max 50)
├── hobbies: string (max 50)
├── motivation: string (max 400)
├── commuteHours: number (0–3, default: 0)
├── commuteMinutes: number (0–59, default: 0)
├── spouse: boolean (default: false)
├── dependents: number (0–20, default: 0)
└── requests: string (max 300)
```

**Cross-field validation (superRefine):**
- If `alternateContactEnabled === true` → `alternateContact` must be present (relation, name, phone all required)

### 2.2 TypeScript Types (`src/types/rirekisho.ts`)

```typescript
type Gender = 'male' | 'female' | 'none';
type HistoryCategory = 'education' | 'work';
type EducationAction = '入学' | '転学' | '退学' | '卒業';
type WorkAction = '入社' | '退社' | '異動';

interface JpDate { year: number; month: number; }
interface HistoryEntry { id, date: JpDate, category, name, nameFurigana?, action, detail? }
interface LicenseEntry { id, date: JpDate, name, issuer? }
interface RirekishoData { /* full form fields */ }

const DRAFT_VERSION = 1;
```

**Key distinction:**
- `RirekishoFormData` — Zod-inferred type (from `rirekishoSchema`), used by react-hook-form
- `RirekishoData` — Manual interface, used by sample-draft and export types
- Both should be structurally identical; Zod schema is the source of truth

### 2.3 Default Values (`getDefaultValues()`)

Generated dynamically — `fillDate` set to current year/month, `dateOfBirth` defaults to `1990/01`, all strings empty, booleans false, arrays empty.

### 2.4 Draft Payload Structure

```typescript
interface DraftPayload {
  version: number;      // DRAFT_VERSION (currently 1)
  savedAt: string;      // ISO 8601 timestamp
  data: RirekishoFormData;
}
```

Storage keys:
- `rirekisho-draft` — active draft
- `rirekisho-draft-backup` — backup when version mismatch detected

---

## 3. Wizard Flow

### 3.1 Step Structure

| Step | Component | Title | Validation Fields |
|---|---|---|---|
| 0 | `Step1BasicInfo` | 基本情報 | furigana, fullName, dateOfBirth, postalCode, prefecture, address |
| 1 | `Step2History` | 学歴・職歴 | history |
| 2 | `Step3Licenses` | 免許・資格 | licenses |
| 3 | `Step4Preferences` | 希望欄 | motivation, requests |
| 4 | `Step5Preview` | プレビュー | _(none — read-only)_ |

### 3.2 Navigation Rules

**Forward navigation (`goToNext`):**
1. Validate current step's fields via `form.trigger(fields)` (react-hook-form)
2. If validation fails → block navigation, show inline errors
3. If validation passes → advance to next step, add to `visitedSteps`, scroll to top

**Backward navigation (`goToPrev`):**
- Always allowed — no validation gate
- Simply decrements `currentStep`, scrolls to top

**Direct step access (`goToStep`):**
- Only allowed for steps in `visitedSteps`
- Prevents skipping ahead without completing prerequisites
- Clickable in `StepIndicator` for visited steps only

### 3.3 Step Indicator

**Desktop (md+):** Horizontal stepper with numbered circles, connecting lines, check icon for completed steps, highlighted current step.

**Mobile (<md):** Progress bar (`1/N · Step Name`) with percentage-width fill bar.

States per step:
- **Completed** (visited + before current): Filled primary circle with check icon
- **Current**: Outlined primary circle with number
- **Unvisited**: Muted circle with number, disabled click
- **Visited but not current**: Clickable, navigates on click

### 3.4 Wizard Navigation Bar

**Desktop:** Fixed bottom bar with "← 戻る" (outline) and "次へ"/"プレビュー" (primary) buttons, plus auto-save status text.

**Mobile:** Fixed bottom bar (`h-14`, `z-50`) with full-width buttons, always visible.

Save status display:
- While saving: "保存中..."
- After save: "自動保存済み • HH:MM" (Japanese locale time)

### 3.5 Form State Flow

```
WizardShell
├── useForm<RirekishoFormData> (react-hook-form + zodResolver)
│   ├── watch() → data subscription (triggers auto-save)
│   ├── trigger(fields) → validation on step advance
│   ├── setValue() → updates from child components
│   ├── reset() → restore draft / load sample / reset
│   └── formState.errors → per-step error extraction
├── currentStep (useState)
├── visitedSteps (useState<Set<number>>)
└── renderStep() → switches on currentStep
```

Child components receive:
- `data`: Full form state via `form.watch()`
- `errors`: Filtered `Record<string, string>` for current step's fields
- `onUpdate`: Callback that calls `setValue(field, value)`

---

## 4. Feature Modules

### 4.1 Wizard (F-01)

**Status:** Implemented (Step 1 fully built; Steps 2–5 are stubs)

**Implementation:**
- `WizardShell` orchestrates form state, navigation, auto-save, and step rendering
- `StepIndicator` renders visual progress
- `WizardNav` renders navigation buttons + save status
- Per-step validation gates forward navigation
- `STEP_FIELDS` array maps each step to its required Zod fields

**Key behaviors:**
- Visited steps tracked in `Set<number>` — enables back-navigation and direct step access
- `window.scrollTo({ top: 0, behavior: 'smooth' })` on every step change
- Step 4 "次へ" button is no-op (Step 5 is terminal)
- Sample mode loaded via dynamic import (`import('@/lib/constants/sample-draft')`)

### 4.2 Photo Processing (F-02 partial)

**Status:** Implemented

**File:** `src/lib/utils/photo.ts`

**Algorithm:**
1. Load file via `createImageBitmap()` with `imageOrientation: 'from-image'`
2. Calculate center-crop to 3:4 aspect ratio:
   - If source wider than target → crop width equally from both sides
   - If source taller than target → crop height equally from top/bottom
3. Draw to offscreen `<canvas>` at 600×800 px
4. Export as JPEG with quality stepping:
   - Start at quality 0.85
   - If blob > 500 KB and quality > 0.3 → decrease by 0.15 and retry
   - Repeat until ≤ 500 KB or quality floor reached
5. Convert to base64 data URL via `FileReader.readAsDataURL()`

**Result:** ~3:4 ratio, ≤ 600×800 px, ≤ 500 KB JPEG, no EXIF metadata.

**Upload component (`PhotoUpload`):**
- Accepts `image/*` via file input
- Client-side validation: type check (`file.type.startsWith('image/')`) + 10 MB size limit
- Shows processing spinner overlay during crop/compress
- 3:4 aspect-ratio preview container with placeholder (camera icon)
- Change/Delete buttons
- Data URL stored as `photo` field in form state

### 4.3 Preview (F-06)

**Status:** Stub — `Step5Preview` renders "Coming soon" placeholder

**Planned implementation (per PRD):**
- True-scale A4 rendering (794×1123 px at 96 DPI = 210mm × 297mm)
- JIS-style layout: outer border, section headers with `#f5f5f5` background, photo position
- All form data rendered in correct positions
- Wareki dates for DOB and history entries
- 「現在に至る」/「以上」 closings auto-appended per convention

**Paper constants (`paper-constants.ts`):**

```typescript
PAPER = {
  WIDTH: 794,           // A4 at 96 DPI
  HEIGHT: 1123,
  OUTER_MARGIN: 40,
  BG: '#ffffff',
  BORDER: '#111111',
  HEADER_BG: '#f5f5f5',
  TEXT: '#111111',
  PLACEHOLDER: '#9ca3af',
  PHOTO_BG: '#f3f4f6',
  BASE_FONT_SIZE: 13,
  LINE_HEIGHT: 1.5,
  TITLE_SIZE: 28,
  FURIGANA_SIZE: 10,
  MIN_FONT_SIZE: 10,
  PHOTO_WIDTH_MM: 30,
  PHOTO_HEIGHT_MM: 40,
}
```

### 4.4 PDF Export (F-07)

**Status:** Not yet implemented (planned via browser print dialog)

**Planned approach:**
- `window.print()` with print-specific CSS
- Chrome-first strategy (per D-5)
- Target: A4, margin: None, scale: Default, background graphics enabled
- No watermark, no page limits
- QA matrix per `docs/print-qa.md`

### 4.5 Auto-save (F-08)

**Status:** Implemented

**File:** `src/lib/storage/draft.ts`

**Mechanism:**
1. `WizardShell` subscribes to `watch()` on form state
2. Every change triggers `saveDraftDebounced(data, callback)` — 800ms debounce
3. `saveDraft()` serializes `DraftPayload` to `localStorage` under key `rirekisho-draft`
4. Callback updates UI: `isSaving → false`, `lastSaved → new Date()`
5. On app load: `loadDraft()` reads from `localStorage`, validates via `rirekishoSchema.safeParse()`, resets form

**Version safety:**
- `DRAFT_VERSION` constant (currently `1`) embedded in every draft
- On load: if `parsed.version !== DRAFT_VERSION` → backup to `rirekisho-draft-backup`, remove active draft, return `null`
- On schema parse failure → same backup-and-clear behavior

**Quota handling:**
- `saveDraft()` catches `DOMException` with `name === 'QuotaExceededError'` → throws `QUOTA_EXCEEDED`
- `saveDraftDebounced()` silently catches all errors (prevents UI disruption)
- User sees `storageWarning` string if quota is hit (planned toast integration)

**Draft restore UX:**
- On load, if draft exists → `reset(draft.data)` + `toast.info('下書きが復元されました')`

### 4.6 JSON I/O (F-09)

**Status:** Implemented (data layer); UI not yet wired

**Export:**
```typescript
exportDraft(data: RirekishoData): Blob
```
- Creates JSON with `version`, `exportedAt` (ISO 8601), and `data`
- Returns `Blob` with `application/json` type
- User downloads as file (UI: "JSON をダウンロード")

**Import:**
```typescript
importDraft(file: File): Promise<RirekishoFormData>
```
- Reads file as text, parses JSON
- Validates `parsed.data` against `rirekishoSchema.safeParse()`
- Returns validated `RirekishoFormData` or throws descriptive error
- UI: "JSON をインポート" button → file picker → `reset(importedData)`

### 4.7 Sample Mode (F-11)

**Status:** Implemented (data + load mechanism)

**File:** `src/lib/constants/sample-draft.ts`

**Sample persona:** ブディ サントソ (Budi Santoso) — Indonesian male, engineering background, JLPT N3, 6 history entries, 2 licenses.

**Load mechanism:**
- Dynamic import: `const { SAMPLE_DRAFT } = await import('@/lib/constants/sample-draft')`
- `reset(SAMPLE_DRAFT)` → overwrites entire form
- Confirmation dialog: "現在のデータが上書きされます。よろしいですか？" (planned)
- `toast.success('サンプルデータを読み込みました')`

**PRD requirement:** Overwriting user data requires explicit confirm dialog.

### 4.8 Field Tips (FR-10)

**Status:** Partially implemented — `strings.ts` contains hint text for key fields

**Implemented hints:**
| Field | Hint text |
|---|---|
| furigana | "Hiragana (あ), BUKAN katakana (ア)" |
| fullName | "Tulis sesuai paspor. Warga asing biasanya katakana atau romaji" |
| motivation | "Hindari generik. Sebut nama perusahaan + alasan spesifik. 300-400 字 ideal" |

**Planned tips (per PRD FR-10):**
- Photo etiquette (size, background, formal attire)
- History start point (when to begin listing)
- Address formatting conventions

### 4.9 Wareki Conversion (F-10 partial)

**Status:** Implemented

**File:** `src/lib/utils/wareki.ts`

**Era table:**

| Era | Start Year | Start Month |
|---|---|---|
| 令和 | 2019 | 5 |
| 平成 | 1989 | 1 |
| 昭和 | 1926 | 12 |
| 大正 | 1912 | 7 |
| 明治 | 1868 | 9 |

**Function:** `toWareki(year: number, month: number): string`
- Returns era name + year number (e.g., "令和7年")
- First year of era returns "元" instead of "1" (e.g., "令和元年")
- Fallback: returns `${year}年` if no era matches (pre-Meiji dates)

**Usage:** DOB display in Step 1 (year select shows "2024年 (令和6年)"), preview rendering.

### 4.10 Age Calculator

**Status:** Implemented

**File:** `src/lib/utils/age.ts`

**Function:** `calculateAge(dob: JpDate, today?: Date): number`
- Calculates 満年齢 (age at last birthday)
- Compares year and month only (day-level not needed for rirekisho)

### 4.11 Postal Code Formatter

**Status:** Implemented

**File:** `src/lib/utils/format.ts`

**Function:** `formatPostal(raw: string): string`
- Strips non-digits
- Formats as `XXX-XXXX` (3-digit + 4-digit with hyphen)
- Applied on `onBlur` event for postal code input

### 4.12 Full-Width Normalizer

**Status:** Implemented

**File:** `src/lib/utils/normalize.ts`

**Function:** `normalizeWidth(input: string): string`
- Converts full-width characters (０-９, Ａ-Ｚ, ａ-ｚ, －, ＿) to half-width equivalents
- Unicode range: `0xFEE0` offset from full-width to ASCII
- Usage: IME normalization on blur (planned)

---

## 5. Component Inventory

### 5.1 UI Components (`src/components/ui/`)

| Component | File | shadcn base | Purpose |
|---|---|---|---|
| `AlertDialog` | `alert-dialog.tsx` | Base UI Dialog | Confirmation dialogs (reset, sample overwrite) |
| `Badge` | `badge.tsx` | — | Status indicators |
| `Button` | `button.tsx` | Base UI Button | All interactive actions |
| `Card` | `card.tsx` | Base UI Card | Content containers per step/section |
| `Checkbox` | `checkbox.tsx` | Base UI Checkbox | Multi-select options |
| `Dialog` | `dialog.tsx` | Base UI Dialog | Modal overlays |
| `FormField` | `form-field.tsx` | Custom | Labeled input with error + hint display |
| `Input` | `input.tsx` | Base UI Input | Text input fields |
| `Label` | `label.tsx` | Base UI Label | Form field labels |
| `Progress` | `progress.tsx` | Base UI Progress | Step progress indicator |
| `RadioGroup` | `radio-group.tsx` | Base UI RadioGroup | Gender selection |
| `Select` | `select.tsx` | Base UI Select | Prefecture, year/month selects |
| `Separator` | `separator.tsx` | Base UI Separator | Visual dividers |
| `Sonner` | `sonner.tsx` | sonner | Toast notification provider |
| `Switch` | `switch.tsx` | Base UI Switch | Alternate contact toggle |
| `Textarea` | `textarea.tsx` | Base UI Textarea | Long text (motivation, requests) |
| `Tooltip` | `tooltip.tsx` | Base UI Tooltip | Hover hints |

### 5.2 Wizard Components (`src/components/wizard/`)

| Component | File | Purpose |
|---|---|---|
| `WizardShell` | `wizard-shell.tsx` | Root orchestrator: form state, navigation, step routing, auto-save |
| `WizardNav` | `wizard-nav.tsx` | Prev/Next buttons + save status (desktop & mobile layouts) |
| `StepIndicator` | `step-indicator.tsx` | Step progress visualization (desktop stepper + mobile bar) |
| `PhotoUpload` | `photo-upload.tsx` | Photo upload, crop preview, change/delete controls |

### 5.3 Step Components (`src/components/wizard/steps/`)

| Component | File | Status |
|---|---|---|
| `Step1BasicInfo` | `step1-basic-info.tsx` | **Complete** — photo, identity, DOB, gender, address, contact, alternate contact |
| `Step2History` | `step2-history.tsx` | **Stub** — "Coming soon..." |
| `Step3Licenses` | `step3-licenses.tsx` | **Stub** — "Coming soon..." |
| `Step4Preferences` | `step4-preferences.tsx` | **Stub** — "Coming soon..." |
| `Step5Preview` | `step5-preview.tsx` | **Stub** — reset button only, "Coming soon — Paper preview & PDF export." |

### 5.4 Preview Components (`src/components/preview/`)

| File | Purpose |
|---|---|
| `paper-constants.ts` | Paper dimensions, colors, font sizes, photo dimensions (no React components yet) |

---

## 6. File Structure Reference

```
rirekisho-maker/
├── PRD.md                          # Product requirements (why/who/success)
├── FEATURE.md                      # This document — technical spec (what/how)
├── README.md                       # User-facing docs, FAQ, roadmap
├── AGENTS.md                       # Next.js agent rules (auto-generated)
├── CLAUDE.md                       # → AGENTS.md
├── components.json                 # shadcn/ui config (base-nova style)
├── next.config.ts                  # Next.js config (output: 'export', basePath)
├── package.json                    # Dependencies, scripts, pnpm
├── pnpm-lock.yaml                  # Lockfile
├── tsconfig.json                   # TypeScript config (strict, bundler)
├── eslint.config.mjs               # ESLint config
├── postcss.config.mjs              # PostCSS config
├── .env.local                      # Local env (empty basePath)
├── .env.production                 # Production env (basePath = repo name)
├── .nvmrc                          # Node version
├── docs/
│   ├── print-qa.md                 # Print QA checklist per release
│   ├── deploy-notes.md             # Deploy gotchas (nojekyll, basePath)
│   └── risk-register.md            # Risk matrix + browser support
├── public/                         # Static assets
├── out/                            # Static export output (gitignored)
└── src/
    ├── app/
    │   ├── globals.css             # Tailwind base + CSS variables
    │   ├── layout.tsx              # Root layout: fonts, ThemeProvider, Toaster
    │   └── page.tsx                # Home page: header + WizardShell + footer
    ├── components/
    │   ├── preview/
    │   │   └── paper-constants.ts  # A4 dimensions, colors, font sizes
    │   ├── ui/                     # shadcn/ui components (17 files)
    │   │   ├── alert-dialog.tsx
    │   │   ├── badge.tsx
    │   │   ├── button.tsx
    │   │   ├── card.tsx
    │   │   ├── checkbox.tsx
    │   │   ├── dialog.tsx
    │   │   ├── form-field.tsx      # Custom: labeled input + error + hint
    │   │   ├── input.tsx
    │   │   ├── label.tsx
    │   │   ├── progress.tsx
    │   │   ├── radio-group.tsx
    │   │   ├── select.tsx
    │   │   ├── separator.tsx
    │   │   ├── sonner.tsx
    │   │   ├── switch.tsx
    │   │   ├── textarea.tsx
    │   │   └── tooltip.tsx
    │   └── wizard/
    │       ├── photo-upload.tsx     # Photo upload + crop preview
    │       ├── step-indicator.tsx   # Step progress visualization
    │       ├── steps/
    │       │   ├── step1-basic-info.tsx   # IMPLEMENTED
    │       │   ├── step2-history.tsx      # STUB
    │       │   ├── step3-licenses.tsx     # STUB
    │       │   ├── step4-preferences.tsx  # STUB
    │       │   └── step5-preview.tsx      # STUB (reset only)
    │       ├── wizard-nav.tsx       # Prev/Next + save status
    │       └── wizard-shell.tsx     # Root orchestrator
    ├── lib/
    │   ├── constants/
    │   │   ├── licenses.ts         # COMMON_LICENSES array (23 items)
    │   │   ├── prefectures.ts      # PREFECTURES array (47 prefectures)
    │   │   ├── sample-draft.ts     # SAMPLE_DRAFT persona (Budi Santoso)
    │   │   └── strings.ts          # All user-facing strings (Japanese + Indonesian)
    │   ├── schema/
    │   │   └── rirekisho-schema.ts # Zod schema + getDefaultValues()
    │   ├── storage/
    │   │   └── draft.ts            # Auto-save, load, clear, export/import JSON
    │   ├── utils/
    │   │   ├── age.ts              # calculateAge() — 満年齢
    │   │   ├── format.ts           # formatPostal(), formatPhone()
    │   │   ├── normalize.ts        # normalizeWidth() — full→half-width
    │   │   └── photo.ts            # processPhoto() — 3:4 crop + JPEG compress
    │   │   └── wareki.ts           # toWareki() — 和暦 conversion
    │   └── utils.ts                # cn() utility (re-export)
    └── types/
        └── rirekisho.ts            # TypeScript interfaces + DRAFT_VERSION
```

---

## 7. Acceptance Criteria

> Traceability: each AC links to PRD user story (US-XX) and feature ID (F-XX).

### 7.1 Wizard (F-01 ↔ FR-01)

| AC# | Criterion | PRD Ref |
|---|---|---|
| AC-01 | 5-step wizard renders with correct titles (基本情報, 学歴・職歴, 免許・資格, 希望欄, プレビュー) | US-01 |
| AC-02 | Step 0 validates furigana, fullName, dateOfBirth, postalCode, prefecture, address before advancing | FR-01 |
| AC-03 | Forward navigation blocked if validation fails; errors shown inline on relevant fields | FR-01 |
| AC-04 | Backward navigation always succeeds (no validation gate) | FR-01 |
| AC-05 | Visited steps are clickable in StepIndicator; unvisited steps are disabled | FR-01 |
| AC-06 | Step change scrolls to top of page | US-01 |
| AC-07 | Desktop: horizontal stepper with check marks for completed steps | US-01 |
| AC-08 | Mobile: progress bar with step name and count (e.g., "2/5 · 学歴・職歴") | NFR-05 |

### 7.2 Basic Info / Photo (F-02 ↔ FR-02)

| AC# | Criterion | PRD Ref |
|---|---|---|
| AC-09 | Photo upload accepts image/* files ≤ 10 MB | US-02 |
| AC-10 | Photo is center-cropped to 3:4 ratio, output ≤ 600×800 px, ≤ 500 KB JPEG | US-02 |
| AC-11 | EXIF metadata (including GPS) is stripped during processing | US-07 |
| AC-12 | Photo can be changed or deleted after upload | US-02 |
| AC-13 | Placeholder (camera icon + "写真") shown when no photo uploaded | US-02 |
| AC-14 | Furigana field validates hiragana only (regex: `/^[\u3040-\u309Fー]+$/`) | US-01 |
| AC-15 | DOB year select shows wareki equivalent (e.g., "2024年 (令和6年)") | FR-10 |
| AC-16 | DOB shows 満年齢 (age) in real-time | FR-10 |
| AC-17 | Gender field offers 男/女/指定なし — none is default (JIS-2019 compliant) | D-1 |
| AC-18 | Postal code formats as `XXX-XXXX` on blur | US-05 |
| AC-19 | Prefecture select shows all 47 prefectures in kanji | US-05 |
| AC-20 | Alternate contact toggle shows/hides relation/name/phone fields | US-05 |
| AC-21 | When alternate contact enabled, relation/name/phone are required (superRefine) | US-05 |

### 7.3 History (F-03 ↔ FR-03)

| AC# | Criterion | PRD Ref |
|---|---|---|
| AC-22 | Step 2 provides "Coming soon..." placeholder (stub) | — |
| AC-23 | _(Planned)_ Unified chronological table for education + work entries | US-03 |
| AC-24 | _(Planned)_ Add row in ≤ 15 seconds, no dead-ends | US-03 |
| AC-25 | _(Planned)_ Chronology order warnings (non-blocking) | US-03 |
| AC-26 | _(Planned)_ 「現在に至る」 auto-appended when historyCurrent is true | US-04 |
| AC-27 | _(Planned)_ 「以上」 appended as last row | US-04 |

### 7.4 Licenses (F-04 ↔ FR-04)

| AC# | Criterion | PRD Ref |
|---|---|---|
| AC-28 | Step 3 provides "Coming soon..." placeholder (stub) | — |
| AC-29 | _(Planned)_ Dynamic row addition for license entries | FR-04 |
| AC-30 | _(Planned)_ COMMON_LICENSES autocomplete for common Japanese certifications | FR-04 |

### 7.5 Preferences (F-05 ↔ FR-05)

| AC# | Criterion | PRD Ref |
|---|---|---|
| AC-31 | Step 4 provides "Coming soon..." placeholder (stub) | — |
| AC-32 | _(Planned)_ Specialties, hobbies, motivation fields | FR-05 |
| AC-33 | _(Planned)_ Commute time (hours + minutes), spouse, dependents, requests | FR-05 |

### 7.6 Preview (F-06 ↔ FR-06)

| AC# | Criterion | PRD Ref |
|---|---|---|
| AC-34 | Step 5 shows "Coming soon — Paper preview & PDF export." (stub) | — |
| AC-35 | _(Planned)_ True-scale A4 rendering (794×1123 px) | US-04 |
| AC-36 | _(Planned)_ JIS-2019 layout with outer border, section headers, photo position | US-04 |
| AC-37 | _(Planned)_ All form data rendered in correct positions | US-04 |
| AC-38 | _(Planned)_ Wareki dates for DOB and history entries | FR-10 |
| AC-39 | _(Planned)_ 「現在に至る」/「以上」 closings per convention | US-04 |

### 7.7 PDF Export (F-07 ↔ FR-07)

| AC# | Criterion | PRD Ref |
|---|---|---|
| AC-40 | _(Planned)_ "PDFとして保存 / 印刷" button triggers `window.print()` | FR-07 |
| AC-41 | _(Planned)_ Chrome: PDF is exactly 1 page A4, all text/borders render | US-04 |
| AC-42 | _(Planned)_ Print QA matrix 100% on Chrome Win+Mac | G-3 |

### 7.8 Auto-save (F-08 ↔ FR-08)

| AC# | Criterion | PRD Ref |
|---|---|---|
| AC-43 | Form changes trigger debounced save (800ms) to `localStorage` | US-06 |
| AC-44 | Draft includes `version` (DRAFT_VERSION) and `savedAt` (ISO 8601) | FR-08 |
| AC-45 | On reload, draft is restored and form is populated | US-06 |
| AC-46 | Version mismatch → backup old draft, clear active draft, start fresh | FR-08 |
| AC-47 | Schema validation failure on load → same backup-and-clear behavior | FR-08 |
| AC-48 | Save status shows "保存中..." while saving, "自動保存済み • HH:MM" after | FR-08 |
| AC-49 | Quota exceeded handled gracefully (no crash, silent catch in debounced save) | NFR-06 |

### 7.9 JSON I/O (F-09 ↔ FR-09)

| AC# | Criterion | PRD Ref |
|---|---|---|
| AC-50 | Export produces JSON blob with `version`, `exportedAt`, and `data` | US-09 |
| AC-51 | Import validates file against `rirekishoSchema` — invalid → descriptive error | US-09 |
| AC-52 | Import resets form to imported data | US-09 |
| AC-53 | _(Planned)_ Export warns file contains unencrypted PII | US-09 |

### 7.10 Sample Mode (F-11 ↔ FR-11)

| AC# | Criterion | PRD Ref |
|---|---|---|
| AC-54 | "Coba dengan contoh" button loads SAMPLE_DRAFT into form | US-08 |
| AC-55 | Overwriting existing data requires confirmation dialog | US-08 |
| AC-56 | Sample data is realistic Indonesian persona (Budi Santoso) | US-08 |
| AC-57 | `toast.success('サンプルデータを読み込みました')` shown after load | FR-11 |

### 7.11 Reset (F-17 ↔ FR-17)

| AC# | Criterion | PRD Ref |
|---|---|---|
| AC-58 | "リセット" button clears all form data and localStorage | US-10 |
| AC-59 | Reset requires confirmation dialog ("本当にリセットしますか？") | SEC-07 |
| AC-60 | After reset: form at Step 1, `visitedSteps` reset to `{0}`, `lastSaved` null | US-10 |
| AC-61 | `toast.success('リセットしました')` shown after reset | FR-17 |

### 7.12 Privacy & Security (FR-12 ↔ SEC-01)

| AC# | Criterion | PRD Ref |
|---|---|---|
| AC-62 | Footer shows privacy note: "Semua data (termasuk foto) tersimpan di browser Anda, tidak pernah dikirim ke server" | US-07 |
| AC-63 | DevTools Network tab shows zero outbound requests across full flow | G-4 |
| AC-64 | CSP `connect-src 'none'` present in production HTML | SEC-01 |

---

## 8. Definition of Done per Feature

Each feature is "done" when ALL of these conditions are met:

### 8.1 Universal DoD

- [ ] Code compiles with zero TypeScript errors (`pnpm build` succeeds)
- [ ] Lint passes (`pnpm lint` clean)
- [ ] All strings user-facing are in `src/lib/constants/strings.ts` (no hardcoded text)
- [ ] No new dependencies added without PR justification (PRD C-3)
- [ ] No network requests introduced (PRD NFR-01, SEC-01)
- [ ] Component uses `'use client'` directive if interactive
- [ ] Responsive: works at 375px mobile → desktop (PRD NFR-05)
- [ ] Accessibility: visible labels, keyboard navigable, `aria-describedby` on errors (PRD NFR-03)

### 8.2 Per-Feature DoD

| Feature | Additional DoD Criteria |
|---|---|
| **Wizard (F-01)** | Per-step validation gates forward nav; visited-step tracking works; mobile step indicator renders; scroll-to-top on step change |
| **Photo (F-02)** | 3:4 crop verified visually; output ≤ 500 KB; EXIF stripped; change/delete works; 10 MB guard shows error |
| **History (F-03)** | _(stub)_ "Coming soon..." renders without crash |
| **Licenses (F-04)** | _(stub)_ "Coming soon..." renders without crash |
| **Preferences (F-05)** | _(stub)_ "Coming soon..." renders without crash |
| **Preview (F-06)** | _(stub)_ Reset button works; "Coming soon..." renders |
| **PDF Export (F-07)** | _(planned)_ Print QA matrix 100% on Chrome Win+Mac (per `docs/print-qa.md`) |
| **Auto-save (F-08)** | Debounce fires at 800ms; draft restores on reload; version mismatch backs up; quota error caught |
| **JSON I/O (F-09)** | Export produces valid JSON; import validates schema; invalid file shows descriptive error; form state unchanged on failure |
| **Sample Mode (F-11)** | Loads SAMPLE_DRAFT; confirmation dialog before overwrite; toast shown |
| **Reset (F-17)** | Clears localStorage + form; confirmation dialog; returns to Step 1; toast shown |
| **Wareki (F-10)** | All 5 eras tested; first year shows "元"; pre-Meiji shows raw year |
| **Age calc** | 満年齢 correct across month boundaries; handles leap years implicitly |
| **Postal format** | Formats as `XXX-XXXX`; handles partial input gracefully |

### 8.3 Release Gate DoD (per PRD §10)

All P0 features must pass before calling "launched":
- [ ] All P0 FR acceptance criteria pass
- [ ] All SECURITY.md P0 items pass; security tests green in CI
- [ ] Print QA matrix 100% on Chrome Win+Mac
- [ ] 5 moderated usability tests: ≥80% complete unaided; median ≤20 min
- [ ] DevTools audit: zero outbound network requests with form data

---

## Appendix A: Regex Reference

| Field | Regex | Purpose |
|---|---|---|
| furigana | `/^[\u3040-\u309Fー]+$/` | Hiragana only (including prolonged-sound mark ー) |
| postalCode | `/^\d{3}-?\d{4}$/` | 7 digits with optional hyphen |
| phone | `/^0\d{1,4}-?\d{1,4}-?\d{3,4}$/` | Japanese phone format with optional hyphens |
| email | Zod `.email()` | Standard email validation |

## Appendix B: Constants Reference

| Constant | Value | Location |
|---|---|---|
| `DRAFT_VERSION` | `1` | `src/types/rirekisho.ts` |
| `STORAGE_KEY` | `'rirekisho-draft'` | `src/lib/storage/draft.ts` |
| `BACKUP_KEY` | `'rirekisho-draft-backup'` | `src/lib/storage/draft.ts` |
| Auto-save debounce | `800` ms | `src/lib/storage/draft.ts` |
| Photo target size | `600 × 800` px | `src/lib/utils/photo.ts` |
| Photo aspect ratio | `3:4` | `src/lib/utils/photo.ts` |
| Photo max blob size | `500 × 1024` bytes | `src/lib/utils/photo.ts` |
| Photo initial quality | `0.85` | `src/lib/utils/photo.ts` |
| Photo quality step | `0.15` | `src/lib/utils/photo.ts` |
| Photo quality floor | `0.3` | `src/lib/utils/photo.ts` |
| Photo max upload size | `10 × 1024 × 1024` bytes | `src/components/wizard/photo-upload.tsx` |
| Paper width | `794` px (A4 at 96 DPI) | `src/components/preview/paper-constants.ts` |
| Paper height | `1123` px | `src/components/preview/paper-constants.ts` |
| Outer margin | `40` px | `src/components/preview/paper-constants.ts` |
| Base font size | `13` px | `src/components/preview/paper-constants.ts` |
| Title font size | `28` px | `src/components/preview/paper-constants.ts` |
| Furigana font size | `10` px | `src/components/preview/paper-constants.ts` |
| Photo dimensions (mm) | `30 × 40` mm | `src/components/preview/paper-constants.ts` |
| Max motivation length | `400` chars | `src/lib/schema/rirekisho-schema.ts` |
| Max requests length | `300` chars | `src/lib/schema/rirekisho-schema.ts` |
| Max address length | `100` chars | `src/lib/schema/rirekisho-schema.ts` |
| Max name length | `40` chars | `src/lib/schema/rirekisho-schema.ts` |
| Max furigana length | `40` chars | `src/lib/schema/rirekisho-schema.ts` |
| Max specialties/hobbies | `50` chars | `src/lib/schema/rirekisho-schema.ts` |
| Max history/license name | `60` chars | `src/lib/schema/rirekisho-schema.ts` |
| Prefecture count | `47` | `src/lib/constants/prefectures.ts` |
| Common licenses count | `23` | `src/lib/constants/licenses.ts` |

## Appendix C: ERAS Table (和暦)

| Era | Kanji | Start Year | Start Month | Calculation |
|---|---|---|---|---|
| Reiwa | 令和 | 2019 | May | `year - 2019 + 1` |
| Heisei | 平成 | 1989 | Jan | `year - 1989 + 1` |
| Showa | 昭和 | 1926 | Dec | `year - 1926 + 1` |
| Taisho | 大正 | 1912 | Jul | `year - 1912 + 1` |
| Meiji | 明治 | 1868 | Sep | `year - 1868 + 1` |

First year of each era renders as "元" instead of "1" (e.g., 令和元年 = 2019).

---

> **Next steps:** Steps 2–5 stubs need full implementations. Preview + PDF export (F-06, F-07) are the highest-impact remaining features — they deliver the core promise of "what you see is what you print."
