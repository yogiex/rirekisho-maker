# NEXTJS-RULES-CLEAN-CODE.md — Rirekisho Maker Coding Standards

> **Single source of truth** for code style, architecture patterns, and
> craftsmanship rules (Next.js App Router + TypeScript + RHF/Zod + shadcn + pnpm).
>
> **Conflict resolution hierarchy:** product scope → `PRD.md` · functional
> behavior → `FEATURE.md` · visuals → `DESIGN.md` · security → `SECURITY.md`.
> **Code style & structure → this file wins.**
>
> **AI assistants:** before generating ANY file — (1) check §15 hard bans,
> (2) follow the canonical patterns in §8, (3) cite the requirement ID
> (FR-xx/SEC-xx) your change implements (FEATURE §21 protocol).

**Version:** 1.0

---

## 0. The Twelve Commandments (quick reference for AI)

1. **Zod schema is the single source of truth** for all data shapes — types are
   derived (`z.infer`), never hand-written in parallel.
2. **No network. Ever.** No `fetch`/XHR/WebSocket/EventSource (SEC-01).
3. **ONE `useForm`** lives in `wizard-shell`, shared via context. Never create
   a second form instance (§8.1).
4. **Normalize inputs on `onBlur`, never `onChange`** — IME safety (FEATURE §7).
5. **Named exports only.** Default export allowed ONLY in `app/layout.tsx`
   and `app/page.tsx` (Next.js requirement).
6. **No `any`. No type assertions** except at validated boundaries (§2).
7. **No hardcoded user-facing strings** — everything from `strings.ts`.
8. **Logic lives in `lib/` as pure functions.** Components stay presentational.
9. **`'use client'` only in `app/page.tsx`** (and Toaster boundary if needed) —
   never sprinkled on leaf components (§5.1).
10. **`localStorage` accessed ONLY via `lib/storage/`** — never inline elsewhere.
11. **Tailwind scale + DESIGN.md tokens only** — no arbitrary values, no new colors.
12. **No new dependency without a written justification in the PR** (SEC-08).

---

## 1. General Principles

- **Boring code > clever code.** This app is maintained by one human and many
  AI sessions. Predictability is the highest virtue.
- **Docs before code.** New behavior = new/updated FR + doc section first
  (FEATURE §21). Code without a traceable ID gets rejected in review.
- **Stranger test.** Every file should be understandable by a contributor who
  has never seen it, using only the five root docs.
- **One responsibility per module.** A component renders OR orchestrates. A
  util computes. A storage module persists. Never all three.

---

## 2. TypeScript Rules

| Rule | Detail |
|---|---|
| Strictness | `strict: true`, `noUncheckedIndexedAccess: true` |
| `any` | **Banned.** External/untrusted data → `unknown`, narrowed by Zod parse |
| Type derivation | `type RirekishoData = z.infer<typeof rirekishoSchema>` — hand-written parallel types are a bug factory |
| Assertions (`as X`) | Allowed ONLY: (a) `as const` for literal objects, (b) after a type guard/parse has proven shape. `as unknown as X` = always a bug |
| Enums | **Banned.** Use `as const` objects + union types |
| Exported functions | Explicit return types (`function wareki(d: JpDate): WarekiInfo`) |
| Non-null (`!`) | Banned. Use guards |
| Interfaces vs types | `interface` for component props & object shapes; `type` for unions/inferred |
| Discriminated unions | Model UI state machines explicitly, never booleans-in-parallel |

```typescript
// ✅ State machine, not boolean soup
type PhotoState =
  | { status: 'idle' }
  | { status: 'processing'; fileName: string }
  | { status: 'ready'; dataUrl: string }
  | { status: 'error'; reason: 'TOO_LARGE' | 'NOT_IMAGE' };

// ❌ Banned shape
interface Bad { isProcessing: boolean; hasPhoto: boolean; hasError: boolean; }
```

---

## 3. File & Naming Conventions

| Artifact | Convention | Example |
|---|---|---|
| Files/dirs | `kebab-case` | `step-indicator.tsx`, `paper-constants.ts` |
| Components | `PascalCase`, **named export** | `export function StepIndicator() {}` |
| Hooks | `useXxx`, file `use-xxx.ts` | `use-draft-autosave.ts` → `useDraftAutosave()` |
| Types/interfaces | `PascalCase`, no `I` prefix | `HistoryEntry`, `PhotoState` |
| True constants | `SCREAMING_SNAKE` | `DRAFT_VERSION`, `PAPER_BORDER` |
| Pure utils | `camelCase` functions | `formatPostal()`, `getWareki()` |
| Tests | `src/__tests__/` mirroring `src/` | `src/__tests__/utils/wareki.test.ts` |
| Strings keys | dot-namespace per feature | `trust.sharedComputer`, `tips.furigana` |

Component files live beside their concern (`components/wizard/steps/…`),
never in a generic `components/shared/` dumping ground.

---

## 4. Import Order (enforced by ordering + `import type`)

```typescript
// 1. React / Next.js
import { useState } from 'react';
// 2. Third-party
import { useFormContext } from 'react-hook-form';
// 3. Absolute project imports — lib first, then components, then types
import { rirekishoSchema } from '@/lib/schema/rirekisho-schema';
import { strings } from '@/lib/constants/strings';
import { FormField } from '@/components/ui/form';
import type { RirekishoData } from '@/types/rirekisho';
```

- Path alias `@/` always. Relative `../..` climbing beyond ONE level = banned.
- Type-only imports use `import type` (prevents accidental runtime deps).
- No barrel files (`index.ts` re-exports) — import from the real path. Keeps
  tree-shaking honest and AI navigation unambiguous.

---

## 5. React & Next.js Rules

### 5.1 Server/Client split (locked — this is the #1 AI confusion point)

```
app/layout.tsx   → Server Component (metadata, fonts). NO 'use client'.
app/page.tsx     → 'use client' — the ONLY declaration point.
components/**    → Plain modules, NO 'use client' (client by inheritance
                   from page.tsx). Adding it redundantly = review reject.
```

Rationale: static export, single page. One declaration point = zero ambiguity.
Exception: if a component is ever imported directly by a Server Component
(e.g. `layout.tsx`), IT must then declare `'use client'` — this will be an
explicit, reviewed decision, not an accident.

### 5.2 Component rules

| Rule | Limit / Detail |
|---|---|
| File size | ≤200 lines. Over → extract subcomponent or hook |
| JSX nesting | ≤3 levels deep — extract |
| Business logic in JSX | Banned beyond trivial ternary. Extract to util or variable above `return` |
| Props | `interface XxxProps`, destructured in signature |
| Prop drilling | >2 levels → React Context (the form context in §8.1 is the only context expected in MVP) |
| Keys in lists | Stable `id` only. `key={index}` = banned (field-array corruption) |
| Default exports | Banned (except `layout.tsx`/`page.tsx`) |
| `next/image` | Banned — static export (FEATURE §2.2). Plain `<img>` |

### 5.3 Derived state — compute, don't sync

```typescript
// ✅ Derive in render
const age = getFullAge(watchDateOfBirth);

// ❌ Banned: useEffect + setState mirroring
useEffect(() => { setAge(getFullAge(dob)); }, [dob]);
```

`useEffect` is allowed ONLY for: storage sync, DOM event listeners, timers
(idle/autosave), scroll behavior, `beforeprint`/`afterprint`, object-URL
lifecycle. Anything derivable → compute in render or `useMemo`.

---

## 6. shadcn/ui Rules

- `components/ui/` is **generated territory** — never hand-edit. Extend via
  wrapper components in `components/wizard|preview/`.
- Wrap, don't fork: need a consistently-styled destructive icon button?
  Create `<DeleteRowButton/>` once; don't restyle shadcn primitives inline
  at every call site.
- One `variant="default"` Button per view (DESIGN §6.1). All variants/classes
  per call site must match DESIGN.md tables verbatim.

---

## 7. State Management (locked architecture)

| State | Owner | Notes |
|---|---|---|
| Draft (all form data) | RHF `useForm` in wizard-shell | Single source (§8.1) |
| Current step | `useState` in wizard-shell | Mirrored to `?step=N` via `history.replaceState` — NOT `router.push` (no history spam, no re-render storm) |
| Photo pipeline state | `useState` in `photo-upload.tsx` | `PhotoState` machine (§2) |
| Persisted draft | `localStorage` via `lib/storage/draft.ts` ONLY | Public API: `loadDraft()`, `saveDraftDebounced()`, `clearAllDraftData()`, `exportDraft()`, `importDraftFile()` |
| Global state libs | **Banned** (no Redux/Zustand/Jotai) | RHF + React state is sufficient; a state lib would be the largest dependency for zero benefit |

**Hydration gate (P0 pattern — classic data-loss bug prevention):**

```typescript
// wizard-shell.tsx
const [isReady, setIsReady] = useState(false);
useEffect(() => {
  const draft = loadDraft();          // lib/storage only
  form.reset(draft ?? defaultValues); // hydrate ONCE
  setIsReady(true);                   // THEN autosave may arm
}, []);

// Autosave hook must no-op until isReady — otherwise an empty-default
// save can overwrite the stored draft before hydration. THE classic bug.
```

---

## 8. Form Patterns (RHF + Zod) — canonical architecture

### 8.1 One form to rule them all

```typescript
// wizard-shell.tsx — the ONLY useForm instance in the app
type FormSchema = z.infer<typeof rirekishoSchema>;
const form = useForm<FormSchema>({
  resolver: zodResolver(rirekishoSchema),
  mode: 'onBlur',
  defaultValues: defaultDraftValues,   // replaced by hydration (§7)
});

<DraftFormContext.Provider value={form}>   // typed context, no `any`
```

Steps receive the form via context. **Per-step validation gating** uses
picked schemas + field lists — never a second form:

```typescript
// steps/step2-history.tsx
const STEP2_FIELDS = ['history', 'historyCurrent'] as const;
const step2Schema = rirekishoSchema.pick({ history: true, historyCurrent: true });

async function goNext() {
  const values = form.getValues();
  const result = step2Schema.safeParse({ history: values.history, historyCurrent: values.historyCurrent });
  if (!result.success) return focusFirstError(result.error, form);
  // chronology soft warning (non-blocking) → toast
  goStep(3);
}
```

### 8.2 Registration rules

| Input type | Method |
|---|---|
| `Input`, `Textarea` | `register()` + spread |
| `Select`, `RadioGroup`, `Checkbox`, `Switch` | `Controller` (Radix value semantics differ from native) |
| Dynamic rows | `useFieldArray` with `key={field.id}` |

### 8.3 Normalize-on-blur pattern (IME-safe, FEATURE §7)

```typescript
<Input
  {...form.register('postalCode', {
    onBlur: (e) => {
      const normalized = formatPostal(normalizeWidth(e.target.value));
      form.setValue('postalCode', normalized, { shouldValidate: true });
    },
  })}
  inputMode="numeric"
/>
```

Never mutate `e.target.value` directly; always round-trip through RHF.

---

## 9. Pure Functions & Utilities (`lib/utils/`)

Contract for every file here: **no React imports, no side effects, no `Date.now()`
inside logic (inject `today` as a parameter), deterministic, JSDoc'd.**

```typescript
/**
 * Convert a Gregorian date to its Japanese era (和暦) representation.
 * Month-level precision; boundary approximation documented in FEATURE §8.
 * @example getWareki({ year: 2019, month: 5 }) // → { era: '令和', eraYear: 1, label: '令和元年' }
 */
export function getWareki(date: JpDate): WarekiInfo { … }
```

Every util ships with its co-located test file before merge (FEATURE §16).
Date libraries (`date-fns`, `dayjs`, `moment`) are **banned** — all date logic
is custom pure functions; the app needs exactly wareki + age + formatting.

---

## 10. Error Handling

- **No silent `catch {}`.** Every catch either recovers visibly (toast/inline)
  or rethrows a typed error.
- Typed error unions for domain failures, mapped to `strings.ts`:

```typescript
type ImportError = 'FILE_TOO_LARGE' | 'INVALID_JSON' | 'VERSION_MISMATCH' | 'INVALID_FIELDS';
```

- Guard clauses / early returns over nested `if`.
- Error boundary scope: wizard shell ONLY (FEATURE §15) — fallback Card +
  reload button. Never per-step boundaries (masks bugs).
- Raw Zod/engine error text is NEVER shown to users (SEC-03).

---

## 11. Performance Rules

Scale-appropriate discipline (NFR-02), no premature optimization:

- Budgets: LCP < 2.5s, initial JS < 200KB gz — verify with Lighthouse at M4.
- Photo processing: async pipeline + `PhotoState` machine; never block input.
- Paper scaling: measure container via `ResizeObserver` + rAF throttle; never
  read layout in a render pass.
- No `dynamic()` imports in MVP — single bundle is a feature (simplicity).
- `useMemo`/`useCallback`: **default OFF.** Add only for measured need or
  handlers passed to memoized children. AI: do not "optimize" speculatively.

---

## 12. Testing Rules

| Rule | Detail |
|---|---|
| Location | `src/__tests__/` mirroring `src/` |
| Mandatory | Every `lib/utils` function 100% branch-covered; security suites (FEATURE §16) are release gates |
| Style | AAA (Arrange-Act-Assert); `describe` = unit name; `it` = behavior sentence: `it('converts full-width digits to half-width')` |
| Test data | From `sample-draft.ts` fixture — never inline JSON blobs per test |
| Snapshots | Banned (brittle, AI-noise). Assert semantics |
| Skipped tests | Banned in `main`. Delete or fix |

---

## 13. Comments & Documentation

- Comments explain **WHY**, never WHAT: `// normalize on blur only — mutating
  mid-IME-composition drops characters (FEATURE §7)`.
- JSDoc with `@example` on every exported pure function.
- **Commented-out code is banned** — delete it; git remembers.
- TODO format: `// TODO(username): extract crop dialog when P1 ships`.
- No docstrings narrating the obvious (`/** button component */` = noise).

---

## 14. Tooling Configuration (locked)

```jsonc
// eslint.config.mjs — extends next/core-web-vitals + typescript
{
  "rules": {
    // Security (SEC-05 — authority: SECURITY.md)
    "react/no-danger": "error",
    "no-eval": "error",
    "no-new-func": "error",
    // Craft (this file)
    "no-console": "error",                 // no console.* in committed code
    "eqeqeq": ["error", "always"],
    "prefer-const": "error",
    "no-console": "error",
    "react-hooks/exhaustive-deps": "error" // NEVER disabled per-line
  }
}
```

- **Prettier** (dev-only) + `prettier-plugin-tailwindcss` for class sorting —
  formatting is decided by the tool, never in review.
- `no-restricted-imports`: ban `next/image`; ban imports of `localStorage`
  patterns is not lintable → enforced by review convention (§7).
- TypeScript `strict` + `noUncheckedIndexedAccess` on; `any` triggers build
  failure via `@typescript-eslint/no-explicit-any: error`.

---

## 15. Hard Bans — Consolidated (the one table AI must re-read)

| # | Banned | Authority |
|---|---|---|
| 1 | `fetch`/XHR/WebSocket/EventSource | SEC-01 |
| 2 | `any` / non-null `!` / `as unknown as` | §2 |
| 3 | `dangerouslySetInnerHTML`, `innerHTML`, `insertAdjacentHTML`, `document.write`, `eval`, `new Function` | SEC-05 |
| 4 | `next/image` | FEATURE §2.2 |
| 5 | Default exports (except `layout.tsx`, `page.tsx`) | §5.2 |
| 6 | `key={index}` on dynamic lists | §5.2 |
| 7 | Direct `localStorage` access outside `lib/storage/` | §7 |
| 8 | Hex colors / font sizes outside `paper-constants.ts` (paper) | DESIGN §2.2 |
| 9 | Arbitrary Tailwind values (`p-[13px]`) | DESIGN §12 |
| 10 | Hardcoded user-facing strings | DESIGN §14 |
| 11 | Date libraries (`date-fns`, `dayjs`, `moment`) | §9 |
| 12 | Global state libraries | §7 |
| 13 | `console.*` in committed code | §14 |
| 14 | Commented-out code, skipped tests | §12, §13 |
| 15 | New dependency without PR justification | SEC-08 |
| 16 | Hand-editing `components/ui/` | §6 |
| 17 | `useEffect` for derived state | §5.3 |
| 18 | Enzyme-style over-mocking; snapshot tests | §12 |

---

## 16. Git & PR Conventions

**Conventional Commits** (English), scoped by area:

```
feat(step2): chronology warning toast on out-of-order rows (FR-03)
fix(paper): furigana overflow shrink on 40-char names (FR-06)
security(import): strip __proto__ payloads + regression tests (SEC-03/04)
docs(design): add T-4 reset dialog spec (FR-17)
chore(ci): pin actions by SHA (SEC-08)
```

- Branches: `feat/<topic>`, `fix/<topic>`, `security/<topic>`.
- PRs: ≤400 changed lines; description MUST cite FR/SEC IDs; UI changes attach
  screenshots (375px + 1280px); behavior changes reference the doc section
  updated FIRST (FEATURE §21 protocol).
- One logical change per PR — no " assorted fixes" commits.

---

## 17. Code Review Checklist (merge gate)

```
[ ] Change cites FR-xx/SEC-xx; docs updated BEFORE code (FEATURE §21)
[ ] §15 hard bans: zero violations
[ ] New logic in lib/ is pure + tested; no logic leaked into components
[ ] Strings from strings.ts; no new hardcoded copy
[ ] Form changes go through the single useForm; no parallel state mirrors
[ ] Effects have complete deps (no eslint-disable) and cleanup where needed
[ ] object URLs revoked; no storage residue on reset paths
[ ] Tailwind classes match DESIGN tokens; one primary button per view
[ ] Works at 375px; keyboard-reachable; labels wired
[ ] Tests green locally; security suites untouched or extended
```

---

## Appendix A — Canonical Component (copy this shape)

```typescript
// components/wizard/wizard-nav.tsx
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { strings } from '@/lib/constants/strings';

interface WizardNavProps {
  step: number;
  isGoingNext: boolean;
  onBack: () => void;
  onNext: () => void;
}

export function WizardNav({ step, isGoingNext, onBack, onNext }: WizardNavProps) {
  const isFirst = step === 1;

  return (
    <nav className="flex gap-3" aria-label={strings.nav.ariaLabel}>
      {!isFirst && (
        <Button type="button" variant="outline" className="flex-1" onClick={onBack}>
          {strings.nav.back}
        </Button>
      )}
      <Button type="button" className="flex-[2]" disabled={isGoingNext} onClick={onNext}>
        {strings.nav.next}
      </Button>
    </nav>
  );
}
```

Checklist of what this example demonstrates: named export · props interface ·
destructuring · zero business logic · strings.ts · DESIGN button variants ·
`aria-label` from strings · no `'use client'` (inherits from page.tsx).

## Appendix B — Canonical Util + Test

```typescript
// lib/utils/format.ts
/** Insert a hyphen into a 7-digit Japanese postal code. Pass-through otherwise. */
export function formatPostal(input: string): string {
  const digits = normalizeWidth(input).replace(/\D/g, '');
  return digits.length === 7 ? `${digits.slice(0, 3)}-${digits.slice(3)}` : input;
}
```

```typescript
// src/__tests__/utils/format.test.ts
import { describe, expect, it } from 'vitest';
import { formatPostal } from '@/lib/utils/format';

describe('formatPostal', () => {
  it('inserts a hyphen into 7 full-width digits (IME input)', () => {
    expect(formatPostal('１２３４５６７')).toBe('123-4567'); // arrange-act-assert
  });
  it('passes through partial input untouched', () => {
    expect(formatPostal('123')).toBe('123');
  });
});
```
