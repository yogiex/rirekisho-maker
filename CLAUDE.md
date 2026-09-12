# CLAUDE.md — Agent Context for Rirekisho Maker

@AGENTS.md

## Documentation Hierarchy (read in order on first session)

| # | File | Purpose | Authority |
|---|---|---|---|
| 1 | `PRD.md` | Why it exists, who it's for, success metrics | Product scope wins |
| 2 | `FEATURE.md` | What to build, data model, acceptance criteria | Functional behavior wins |
| 3 | `DESIGN.md` | Visual tokens, paper spec, component patterns | Visuals win |
| 4 | `SECURITY.md` | Threat model, SEC-01→08 requirements, disclosure | Security always wins |
| 5 | `NEXTJS-RULES-CLEAN-CODE.md` | Code style, architecture patterns, hard bans | Code structure wins |
| 6 | `README.md` | User-facing docs, launch checklist | Public contract |

**Conflict resolution:** product → PRD · feature → FEATURE · visual → DESIGN · security → SECURITY · code → NEXTJS-RULES-CLEAN-CODE.

## Quick Rules

- **Zero network.** No `fetch`, no `XHR`, no `WebSocket`. CSP `connect-src 'none'` (SEC-01).
- **One `useForm`** in `wizard-shell.tsx`, shared via context. Never create a second (§8.1).
- **Hydrate before autosave.** `loadDraft()` → `form.reset()` → `setIsReady(true)` → then arm autosave. Never overwrite draft with defaults (§7).
- **All strings in `strings.ts`** — no hardcoded user-facing text.
- **All localStorage via `lib/storage/`** — never inline.
- **Pure utils in `lib/`** — no React imports, no side effects.
- **Named exports only** — default exports banned except `layout.tsx`/`page.tsx`.
- **No `any`** — Zod parses untrusted data; types derived via `z.infer`.
- **No date libraries** — custom pure functions only (wareki, age, format).
- **Cite FR-xx/SEC-xx** in every change.

## Current State

- **MVP in progress.** Step 1 implemented; Steps 2–5 are stubs.
- Deploy: GitHub Pages via Actions (`deploy.yml`).
- `NEXT_PUBLIC_BASE_PATH=/rirekisho-maker` in `.env.production` — must match repo name.
- Tests: Vitest (not yet written — gap flagged in SECURITY.md).
