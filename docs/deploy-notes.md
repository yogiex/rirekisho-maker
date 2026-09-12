# Deploy Notes

## .nojekyll

GitHub Pages runs Jekyll by default, which ignores folders starting with underscore.
Next.js static export outputs `_next/` folder → all JS/CSS will 404 silently.

**Solution:** Add empty `.nojekyll` file to `out/` after build:
```bash
touch out/.nojekyll
```

This is handled automatically in `.github/workflows/deploy.yml`.

## basePath

The `basePath` in `next.config.ts` must match the repository name:
- Repository: `rirekisho-maker` → `basePath: '/rirekisho-maker'`
- Set via `NEXT_PUBLIC_BASE_PATH` env var

## Local Development

```bash
# Dev (no basePath)
NEXT_PUBLIC_BASE_PATH= pnpm dev

# Build preview (with basePath)
pnpm build
touch out/.nojekyll
npx serve out
```
