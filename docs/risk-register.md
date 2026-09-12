# Risk Register — Rirekisho Maker MVP

| # | Risk | Prob | Impact | Mitigation |
|---|---|---|---|---|
| 1 | Print CSS broken in certain browsers | High | High (core feature) | Chrome-first strategy, QA matrix per release |
| 2 | Font JP fails/tofu on Pages | Low | High | `next/font` self-host + test at M0 |
| 3 | IME/normalization breaks input | Medium | Medium | normalize-on-blur only, unit tests |
| 4 | EXIF photo orientation wrong | Medium | Medium | `createImageBitmap` with `imageOrientation: 'from-image'` |
| 5 | `_next` 404 on Pages | Medium | Fatal (blank app) | `.nojekyll` in CI, verify at M0 |
| 6 | localStorage quota (large photos) | Low | Medium | Photo compression + guard + toast |
| 7 | Scope creep (second template, 職務経歴書, i18n) | High | Medium | §2 FEATURE.md out-of-scope, review per PR |

## Browser Support Matrix

| Browser | Print Quality | Notes |
|---|---|---|
| Chrome (Win/Mac) | Excellent (target) | Primary development target |
| Safari (macOS) | Good | Default margins may differ, document settings |
| Firefox | Acceptable | `@page { size }` partial support |
| Mobile browsers | N/A for print | Form UX only |
