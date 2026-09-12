# Print QA Checklist — Rirekisho Maker

Execute before each release. Test with "Save as PDF" in Chrome.

## Chrome (Windows)
- [ ] PDF is exactly 1 page (A4)
- [ ] Japanese fonts render correctly (no tofu □□□)
- [ ] Section header backgrounds (#f5f5f5) appear
- [ ] All table borders visible (1px solid #111)
- [ ] Photo renders if uploaded, placeholder if not
- [ ] Text wraps correctly in cells, no overflow
- [ ] No blank extra page

## Chrome (macOS)
- [ ] Same checklist as Windows

## Safari (macOS)
- [ ] PDF produces reasonable output
- [ ] Document any margin differences
- [ ] Font fallback works (Hiragino/Yu Gothic)

## Firefox
- [ ] PDF produces acceptable output
- [ ] Document any `@page` limitations

## Edge Cases
- [ ] Empty draft (placeholder) → no crash
- [ ] Full draft (20+ history rows) → page 2 if needed, no overflow
- [ ] Long text in motivation → wraps correctly
- [ ] No photo → gray placeholder box renders

## Test Fixtures
Use sample draft from `src/lib/constants/sample-draft.ts` for consistent testing.
