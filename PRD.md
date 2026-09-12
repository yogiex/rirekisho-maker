# PRD.md — Rirekisho Maker (履歴書メーカー)

| | |
|---|---|
| **Product** | Rirekisho Maker — free, private-by-design Japanese resume builder |
| **Version** | 1.1 (MVP, consolidated) |
| **Status** | Locked for build |
| **Owner** | @yogiex |
| **Repo** | `rirekisho-maker` → `https://yogiex.github.io/rirekisho-maker/` |
| **Supersedes** | PRD v1.0 — integrates security posture, verifiable privacy, full decision log |
| **Doc hierarchy** | PRD (why/who/success) → FEATURE.md (what/how) → DESIGN.md (visual) → SECURITY.md (what must never happen). |
> On conflict: product scope → PRD wins · technical detail → FEATURE wins · visuals → DESIGN wins · security → SECURITY wins.

---

## 1. Vision

**Every Indonesian job seeker can produce a correct, professional, JIS-standard
Japanese resume (履歴書) in under 20 minutes — for free, without an account, and
with verifiable proof that their personal data never leaves their device.**

Product thesis: existing rirekisho tools are Japanese-only or account-gated and
upload sensitive data (face photo, address) to unknown servers; Indonesian
applicants fall back to Word templates with zero guidance. The gap is not
"another form builder" — it is **guided resume creation for a specific
non-Japanese audience, with privacy as an enforced guarantee, not a marketing
line**.

---

## 2. Problem Statement

Indonesians applying to Japanese companies (new grads, skilled workers, job
switchers inside Japan) must submit a rirekisho. Today they face:

1. **Language barrier** — labels (ふりがな, 志望動機, 扶養家族) are opaque;
   mistakes signal carelessness to Japanese recruiters.
2. **Unfamiliar conventions** — photo etiquette, hiragana furigana, wareki
   dates, the merged chronological education/work table, 「現在に至る/以上」.
3. **Tooling friction & privacy fear** — popular web makers require signup and
   upload photo + PII to servers; Word/Excel templates break and teach nothing.
4. **Cost** — quality tools monetize via watermarks or paywalled PDF export.

**Consequence:** mis-formatted applications, abandoned applications, or
reluctant surrender of personal data. Manual template time-to-submit:
1–3 hours with high error rate.

---

## 3. Goals & Non-Goals

### 3.1 MVP Goals

| # | Goal | Measure |
|---|---|---|
| G-1 | User completes a valid rirekisho unaided | ≥80% task success in 5 moderated usability tests |
| G-2 | Fast: fill → PDF in one session | Median time-to-PDF ≤ 20 min (observed) |
| G-3 | Print output is recruiter-acceptable | 100% pass on print QA matrix (Chrome) |
| G-4 | Privacy is **verifiable**, not just claimed | CSP `connect-src 'none'` in production HTML + zero outbound requests in DevTools audit (SEC-01) |
| G-5 | Guidance differentiates vs. competitors | Field tips on all high-error-rate fields + sample-data mode shipped |

### 3.2 Non-Goals (MVP)

- 職務経歴書 builder (companion work-history document) — P2
- Accounts, cloud sync, multiple resume profiles
- Direct application submission (job boards / ATS)
- Multi-language UI (i18n-ready architecture; only ID+JP ships)
- Client-side encryption of drafts (see Decision D-9)
- AI-generated 志望動機 via external LLM API (breaks privacy guarantee)

---

## 4. Target Users & Personas

**Primary market:** Indonesians in the Japan employment pipeline.

### Persona 1 — "Rina", 22, new graduate (primary)
- Fresh IT graduate, JLPT N3, applying to an Osaka engineering program via a
  hiring agent that requests rirekisho + 職務経歴書.
- **Needs:** hand-holding for every JP label, 志望動機 examples, correct photo
  crop; does not know what "JIS" means.
- **Frustrations:** Google-Images templates with broken layouts; unsure if
  gender is mandatory; afraid of hiragana/katakana mixups.
- **Success:** first-ever rirekisho, correct, exported to PDF from her phone.

### Persona 2 — "Agus", 29, skilled worker in Japan (primary)
- 3 years in manufacturing (Specified Skilled Worker framework), switching
  companies. IME-literate; needs speed + 転職-appropriate entries (history from
  high school, licenses like フォークリフト).
- **Needs:** fast mobile entry, autosave for commute sessions, clean PDF print
  at a convenience store.
- **Frustrations:** existing makers demand account + photo upload to a server.

### Persona 3 — "Sari", 26, applicant inside Japan (secondary)
- Language-school graduate moving from part-time to full-time; needs exact
  住所/電話 formatting and the alternate-contact field for dorm address.
- Extra concern: fills forms on **shared PCs** → values visible reset & privacy copy.

**Anti-persona (not serving):** Japanese HR professionals, job-board
integration users, users needing kanji-name conversion (future value, not MVP).

---

## 5. Competitive Landscape

| Solution | Format | Guidance | Privacy | Cost | Gap we exploit |
|---|---|---|---|---|---|
| Konote / JP web makers | JIS | JP-only UI | account + server upload | freemium | Language + privacy |
| Rikunabi/MyNavi web rirekisho | JIS | JP-only, job-board locked | account required | free w/ signup | Job-board context |
| JIS Word/Excel templates | JIS | none | local | free | Breaks, zero guidance |
| resume.io / Canva | NOT rirekisho | EN/ID | server | paid/watermark | Wrong format entirely |
| **Rirekisho Maker** | **JIS 2019** | **ID guidance + tips** | **100% client-side, CSP-enforced, no signup** | **free, OSS** | — |

**Positioning statement:** *For Indonesian applicants to Japanese companies who
are intimidated by resume conventions and wary of uploading personal data,
Rirekisho Maker is a free builder that guides in Indonesian and proves — via
browser DevTools — that no data ever leaves the device; unlike Japanese-only
or account-gated services.*

---

## 6. User Journey (happy path)

1. **Discover** — link shared in an Indonesian-in-Japan community ("bikin
   rirekisho gratis, tanpa login").
2. **Land** — Step 1 wizard + privacy line + 「Coba dengan contoh」.
3. **Explore** (optional) — loads sample persona → preview → test PDF in ~2 min.
4. **Fill** — Steps 1–4 with inline tips ⓘ; autosave survives commute cuts.
5. **Review** — Step 5 true-scale A4 preview; fixes typo spotted in context.
6. **Export** — print → Save as PDF → email to agent / print at konbini;
   optional JSON backup (with unencrypted-PII warning).
7. **Leave no trace** — on a shared computer: hits Reset; storage verified clean.
8. **Return** — reopens later on personal device; draft restored automatically.

**Key product moments:** the sample-data "aha", the first correct wareki date
rendered (trust), print matching preview exactly (promise kept), and the
DevTools-empty-Network-tab proof (privacy kept).

---

## 7. Requirements

### 7.1 Functional Requirements

| ID | Requirement | Priority | Refs |
|---|---|---|---|
| FR-01 | 5-step wizard, per-step validation gating, visited-step navigation | P0 | FEATURE F-01 |
| FR-02 | Basic info: identity, photo 3:4 crop, address, contact, alternate-contact toggle | P0 | FEATURE F-02 |
| FR-03 | Unified chronological education/work history, dynamic rows | P0 | FEATURE F-03 |
| FR-04 | Licenses/certifications, dynamic rows | P0 | FEATURE F-04 |
| FR-05 | Preferences: skills, motivation, commute, family, requests | P0 | FEATURE F-05 |
| FR-06 | True-scale A4 preview (JIS-2019), wareki dates, 「現在に至る/以上」 | P0 | FEATURE F-06, F-10 |
| FR-07 | PDF export via native print, Chrome-optimized | P0 | FEATURE F-07 |
| FR-08 | Autosave to localStorage (debounced) with restore & version safety | P0 | FEATURE F-08 |
| FR-09 | JSON export/import as portable backup | P1 | FEATURE F-09 |
| FR-10 | Field tips (Indonesian) on high-error fields: 写真, ふりがな, 氏名, history start, 志望動機 | **P0** | DESIGN §6.5 |
| FR-11 | Sample-data mode with realistic Indonesian persona | **P0** | FEATURE sample-draft |
| FR-12 | In-product privacy statement — **verifiable**: backed by CSP `connect-src 'none'`; copy includes shared-computer guidance + EXIF-stripping note | **P0** | SEC-01, SEC-06, SEC-07 |
| FR-13 | Crash safety: error boundary; draft never lost | **P0** | FEATURE error boundary |
| FR-14 | 志望動機 example insertion | P1 | FEATURE F-12 |
| FR-15 | Drag-reorder history | P2 | FEATURE F-13 |
| FR-16 | Multiple profiles | P2 | FEATURE F-14 |
| FR-17 | Full data reset (storage + object URLs) behind confirmation | **P0** | SEC-07 |

### 7.2 Non-Functional Requirements

| ID | Requirement | Target |
|---|---|---|
| NFR-01 | Privacy by architecture | No server; form data + photo never transmitted |
| NFR-02 | Performance | LCP < 2.5s on 4G; initial JS < 200KB gz; JP font slices lazy |
| NFR-03 | Accessibility | WCAG 2.1 AA; full keyboard path; visible labels |
| NFR-04 | Browser support | First-class Chrome; Safari/Firefox/Edge acceptable (documented quirks) |
| NFR-05 | Device support | 375px mobile → desktop; sticky mobile nav |
| NFR-06 | Resilience | Draft survives reload/crash; quota handled gracefully |
| NFR-07 | Deployability | Fully static on GitHub Pages; zero backend |
| NFR-08 | Security posture | All P0 items in SECURITY.md implemented & tested (SEC-01…SEC-07); CI gates active |

---

## 8. User Stories & Acceptance Criteria

> Product-level AC. Engineering AC lives in FEATURE.md §7; security AC in SECURITY.md §5.

**US-01 (Rina) — Understand a foreign field.** Each Japanese field explained in Indonesian.
- [ ] ⓘ tips on 写真, ふりがな, 氏名, 志望動機, 学歴 start point
- [ ] Tips state concrete rules (furigana = hiragana あ, not katakana ア)

**US-02 (Rina) — Correct photo without a studio.**
- [ ] Upload → auto center-crop 3:4 → professional result in preview
- [ ] Placeholder 「写真」 before upload; replace/delete anytime

**US-03 (Agus) — Fast history entry.**
- [ ] Add a work-history row in ≤15s; no dead-ends
- [ ] Chronology mistakes warn (non-blocking) with row numbers

**US-04 (Agus) — Trust the output.**
- [ ] Preview matches printed PDF 1:1 in Chrome; JIS-like proportions
- [ ] 「現在に至る」/「以上」 appear automatically per convention

**US-05 (Sari) — Two addresses.**
- [ ] Alternate-contact toggle reveals relation/name/phone; renders only when enabled

**US-06 (Any) — Nothing is lost.**
- [ ] Reload mid-edit → draft + last step restored
- [ ] Crash in Step 5 → boundary message + draft intact

**US-07 (Any) — Verify the privacy claim.** ← *upgraded in v1.1*
- [ ] CSP `connect-src 'none'` present in production HTML
- [ ] DevTools Network tab: zero outbound requests across full flow
- [ ] Photo processing strips EXIF incl. GPS (stated in-app and tested)

**US-08 (Any) — Evaluate before committing.**
- [ ] Sample mode fills a complete realistic profile; preview/print works;
      overwriting user data requires explicit confirm

**US-09 (Any) — Portable backup, safely.**
- [ ] Export JSON → import elsewhere → identical paper; invalid file → clear
      Indonesian error, state unchanged; export warns file is unencrypted PII

**US-10 (Any) — Shared computer, no residue.** ← *new in v1.1*
- [ ] Footer/shared-PC notice visible on Step 1
- [ ] Reset removes ALL app storage; reload starts empty at Step 1

**US-11 (Any) — First-run guidance.**
- [ ] Empty Steps 2/3 show friendly empty states with add actions

---

## 9. Constraints & Assumptions

**Constraints**
- C-1 Static GitHub Pages deployment → no backend, no API, no server-side anything
- C-2 PDF fidelity depends on browser print engine → Chrome-first strategy (D-5)
- C-3 Solo maintainer → scope discipline via §3.2 + decision log (§13)
- C-4 No analytics in MVP (D-3) → success measured via launch gate + proxies (§10)
- C-5 Repo name = basePath = public URL (`rirekisho-maker`) (D-11)

**Assumptions**
- A-1 Target users own a modern-browser device; most have a photo ready
- A-2 Users can operate an IME or accept romaji/katakana name entry (tips cover passport-name convention)
- A-3 JIS-2019 layout is acceptable to the majority of receiving companies

---

## 10. Success Metrics

MVP ships **without analytics** (D-3). Measurement = launch gate + proxies.

**Launch gate (all must pass to call it "launched"):**
- [ ] All P0 FR acceptance criteria pass (FEATURE.md DoD)
- [ ] All SECURITY.md P0 pass; security tests green in CI (NFR-08)
- [ ] Print QA matrix 100% on Chrome Win+Mac
- [ ] 5 moderated usability tests: ≥80% complete unaided (G-1); median ≤20 min (G-2)
- [ ] DevTools audit: zero outbound network requests with form data (G-4)

**Post-launch proxy indicators:**
| Signal | Healthy |
|---|---|
| GitHub stars (7d / 30d) | 15 / 75+ |
| Community reposts (Line/Discord/Facebook JP-job groups) | ≥3 organic shares |
| Issues with success feedback vs bug ratio | growing, low bug ratio |
| Usability follow-ups (DM/interviews) | ≥3 users/month |

**Post-MVP decision point:** add cookieless analytics (GoatCounter/Umami) with
exactly 3 events (`step_completed`, `print_opened`, `json_exported`) only if
growth warrants; requires privacy-copy update. Note: any analytics must respect
`connect-src` policy decision — shipped builds either stay CSP-'none' (no
analytics) or adopt a documented, disclosed exception (D-3 revisit trigger).

---

## 11. Release Plan

| Release | Scope | Product exit criteria |
|---|---|---|
| **M0** Skeleton live | Scaffold, fonts, CSP meta from day one, deploy pipeline, `.nojekyll` | Public URL renders wizard shell; JP font OK; CSP present in built HTML |
| **M1** Core promise | Step 1 + paper section A + print v1 | A stranger produces a correct 1-page PDF of basic info |
| **M2** Full history | Steps 2–3 + paper tables | Mixed edu/work chronology + licenses render per convention |
| **M3** Complete paper | Step 4 + full paper + print QA | QA matrix passes; G-3 met |
| **M4** Differentiation & hardening | Tips, sample mode, JSON I/O, security P0 set, error boundary, a11y | Launch gate (§10) fully green → announce |

---

## 12. Risks

| # | Risk | Impact | Mitigation |
|---|---|---|---|
| R-1 | Print engine quirks damage core promise | High | Chrome-first + QA matrix + documented fallbacks |
| R-2 | Users don't discover sample mode | Medium | Prominent CTA on empty Step 1; README GIF |
| R-3 | Field tips inaccurate for some industries | Medium | General convention + "konsultasikan ke perekrut" escape line |
| R-4 | Competitor parity (JP tools add EN UI) | Medium | Guidance quality + OSS velocity + trust as moat |
| R-5 | Rirekisho guideline/convention drift | Low | Template versioned; annual review of 厚労省 guidance |
| R-6 | Solo-maintainer scope creep | High | §3.2 + D-log; every addition must name its FR/SEC ID |
| R-7 | Supply chain (npm/Actions compromise) breaks privacy guarantee | High | SEC-08: audit gate, frozen lockfile, SHA-pinned Actions, dep budget |

---

## 13. Decision Log (locked)

| # | Decision | Rationale |
|---|---|---|
| D-1 | JIS-2019 template; gender optional | Modern standard; inclusive default |
| D-2 | Persona: Indonesian → Japan pipeline | Sharpest wedge; drives guidance content |
| D-3 | No analytics in MVP | Privacy stance is a feature; proxies in §10 |
| D-4 | UI: Indonesian + JP labels | Serves personas; EN/JA post-MVP |
| D-5 | Chrome-first print quality | Print-engine reality; documented |
| D-6 | 職務経歴書 → P2 | Different doc structure; protects MVP scope |
| D-7 | Light mode only | Print fidelity + solo-dev budget |
| D-8 | Wareki month-level approximation | Documented; acceptable risk |
| D-9 | **No client-side encryption of drafts in MVP** | Single-point-of-failure; key-storage paradox; doesn't address A1/A2. Revisit as opt-in P2. Honest copy instead ("unencrypted localStorage") |
| D-10 | CSP = **exfiltration blocker** (`connect-src 'none'`); `unsafe-inline` accepted for Next bootstrap | Cannot prevent inline script without breaking Next static export; blocking outbound network delivers the actual guarantee |
| D-11 | Repo `rirekisho-maker` = basePath = URL | SEO keyword; single naming truth |
| D-12 | Stack: Next.js static export · shadcn/ui · RHF+Zod · pnpm · Vitest | Locked in pre-dev checklist; no new deps without PR justification |
| D-13 | Field tips = P0 | Core differentiator, not polish |
| D-14 | Sample-data mode = P0 | Demo, test fixture, QA matrix input — triple duty |

Revisit triggers: user feedback channels (§10), competitor moves, guideline changes, Next.js CSP capabilities change.

---

## 14. Open Questions

| # | Question | Needed by |
|---|---|---|
| Q-1 | Link to photo-studio guidance (証明写真) inside photo tip? | M4 |
| Q-2 | Does sample persona include a 2-page history case (QA fixture)? | M4 |
| Q-3 | License note for template layout reference beyond MIT? | Launch |
| Q-4 | Which communities seed launch (Line/Discord/Facebook groups)? | Launch week |

---

## 15. Glossary

| Term | Meaning |
|---|---|
| 履歴書 (rirekisho) | Standard Japanese resume format |
| 職務経歴書 | Separate detailed work-history document (P2) |
| JIS | Japanese Industrial Standards — de-facto resume layout |
| ふりがな | Hiragana reading written above one's name |
| 和暦 (wareki) | Japanese era calendar (令和, 平成…) |
| 現在に至る / 以上 | Standard closing rows of the history table |
| 特定技能 | Specified Skilled Worker visa framework |
| 志望動機 | Motivation for applying — most scrutinized free-text field |
| 扶養家族 | Dependents (excluding spouse) |
| 就活 (shūkatsu) | Japanese job-hunting season/process |

---

## 16. Post-MVP Roadmap (parked — do not build in MVP)

| Item | Priority | Trigger to pull in |
|---|---|---|
| Auto-lock (idle overlay for shared PCs) | **P1** | Immediately post-launch (SEC-07 extension) |
| Manual photo reposition (drag/zoom crop) | P1 | Complaints about center-crop |
| `wareki` npm package (extract converter; dogfood here) | P1 | After M4 — ecosystem/OSS play |
| EN / 日本語 UI toggle | P2 | Non-Indonesian traffic |
| 職務経歴書 builder | P2 | ≥5 user requests; 転職 persona demand |
| Multi-profile CVs | P2 | Repeat users targeting multiple companies |
| 志望動機 assist (on-device rules only — no LLM API) | P2 | Only if solvable client-side, preserving CSP guarantee |
| Disclosed analytics (3 events) | P2 | Growth justifies instrumentation + copy update |

---

## Changelog

**v1.1 (consolidated)**
- Privacy upgraded from *claimed* → *verifiable*: G-4, FR-12, US-07 rewritten around CSP `connect-src 'none'` + DevTools audit
- Security delegated to SECURITY.md as authority; traceability added (FR-12/17 ↔ SEC-01/06/07; NFR-08)
- FR-10 (tips), FR-11 (sample mode), FR-13 (crash safety), FR-17 (full reset) elevated to P0
- Decision log expanded D-1 → D-14 (integrates all pre-dev + security review decisions)
- Risk R-7 (supply chain) added; release M0 now includes CSP from day one
- Roadmap: auto-lock → P1; `wareki` npm package added to ecosystem play

**v1.0**
- Initial PRD: vision, personas, FR-01–16, metrics, release plan M0–M4
