# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **Bun** (lockfile: `bun.lock`).

```bash
bun install
bun run dev            # vite dev server
bun run build          # tsc -b && vite build && (postbuild) verify:csp
bun run preview        # vite preview against dist/
bun run lint           # oxlint
bun run lint:fix       # oxlint --fix
bun run format         # oxfmt .
bun run format:check   # oxfmt --check .
bun run audit          # fallow (dead code + duplication)
bun run verify:csp     # standalone CSP hash check; runs auto in postbuild
```

There is no test framework wired up. If asked to add tests, ask which framework before adding.

## Architecture

Repalette is a 100% client-side SPA. No backend, no network calls beyond static asset loads.

### Data flow

```txt
file upload / paste / dropzone
  → createImageBitmap(file)
  → extractPalette(bitmap)            [src/lib/palette.ts]   counts every distinct RGB pixel
  → detectSource(swatches)            [src/lib/remap.ts]     picks closest preset (sum-of-squared-RGB heuristic)
  → store.setImage(…)                 [src/state/store.ts]
user interactions
  → store.edit(from, to)              direct per-swatch override                       → mapping
  → store.preview(preset, map)        speculative preset apply                          → previewMapping
  → store.commitPreview()             merge previewMapping INTO mapping
  → store.revertPreview()             drop previewMapping
  → useEffectiveMapping()             previewMapping ∪ mapping (mapping wins on conflict)
render
  → renderRemapped(imageData, effectiveMapping)   [src/lib/remap.ts]   key = (r<<16|g<<8|b), cache lookup per pixel
  → drawn into <canvas> in Canvas.tsx
export
  → renderRemapped → canvas.toBlob → object URL download
```

The two-layer mapping (`mapping` + `previewMapping`) is the central pattern. `mapping` is committed edits; `previewMapping` is a non-destructive overlay produced by `buildColorMap(source, target)`. `ReviewBand` shows when a preview is live and offers Commit / Revert.

### Color remap algorithm (`src/lib/remap.ts`)

1. Convert each palette hex to OKLCH via `culori`.
2. `classify(hex, preset)`: if chroma < `CHROMA_THRESHOLD` (0.08) treat as **neutral** (pick nearest-lightness from preset.neutrals); else **accent**, bucket by hue range into one of `red|orange|yellow|green|cyan|blue|purple|pink`.
3. `targetFor(cls, src, tgt)`: map src-bucket → nearest available tgt-bucket; fallback to neutrals.
4. Apply a **shade-preserving delta swap**: `out = clampByte(target + (src_pixel - src_match))`. For accents only, additionally desaturate (`opts.desatAccents`) and dim against the base neutral (`opts.dimAccents`). This is what keeps tonal relationships intact across remap.

When changing remap math, check the result on real palettes (PRODUCT.md examples). Numerical drift in OKLCH conversion or hue boundaries can silently shift bucket assignments.

### State (`src/state/store.ts`)

Single zustand store. Notes:

- `theme` bootstraps from `localStorage.theme`; runtime mutations go through `setTheme`, and `app.tsx` writes the `data-theme` attribute + `localStorage` in an effect.
- The inline `<script>` in `index.html` reads `localStorage.theme` synchronously **before paint** to set `colorScheme` and background to prevent FOUC. If you change that script, the CSP sha256 hash in `public/_headers` must be regenerated — `bun run verify:csp` will fail the build otherwise (see Deployment).
- `useEffectiveMapping` is the only reader that merges `previewMapping` and `mapping`. Components consume the merged map, never the raw fields.

### Directory layout

```tree
src/
  app.tsx                       root: file ops, theme effect, hotkeys, export
  main.tsx                      entry: font imports, index.css import
  assets/index.css              Tailwind 4 @theme tokens, OKLCH-tinted neutrals
  components/
    canvas/    canvas.tsx, dropzone.tsx        viewport
    layout/    top-bar.tsx, status-bar.tsx,
               review-band.tsx, theme-toggle.tsx
    palette/   palette-list.tsx (virtualized),
               inspector.tsx, preset-rail.tsx
    ui/        button.tsx, section-label.tsx   primitives
  lib/                          color domain: colors, palette, presets, remap
  state/store.ts                zustand
  utils/cn.ts                   generic clsx+twMerge helper
scripts/
  verify-csp-hashes.ts          postbuild CSP integrity check
public/
  _headers, _redirects          Cloudflare Pages config
  favicon.svg, apple-touch-icon.png, og-image.png,
  manifest.webmanifest, robots.txt, sitemap.xml
```

### Conventions specific to this repo

- **Path alias**: `@/*` → `src/*`. Cross-directory imports use `@/…`; same-directory imports stay relative (`./sibling`).
- **`lib/` vs `utils/`**: `lib/` is color/domain logic; `utils/` is generic, domain-free helpers.
- **File names**: kebab-case lowercase (`palette-list.tsx`). Components themselves are PascalCase named exports.
- **No barrels**: every file is imported directly, never re-exported through an `index.ts`.
- **React Compiler is on** (`babel-plugin-react-compiler` via `@vitejs/plugin-react`). Don't add `useMemo`/`useCallback` to fight re-renders unless you've confirmed the compiler doesn't already handle it. The compiler skips files with broken Rules of Hooks; if a component starts re-rendering more than expected, check there first.
- **Tailwind 4 with OKLCH**: tokens live in `src/assets/index.css` under `@theme`. Themes are switched via `[data-theme="dark"]` attribute + a `@custom-variant dark` declaration. Inline `style={{ color: "oklch(…)" }}` is acceptable only for the active swatch (the canvas/swatch tiles); chrome should pull from tokens.
- **Design constraints in `DESIGN.md` are enforced**: single magenta accent capped at ~5% of any view, no `#000`/`#fff`, list-not-card-grid for palette, no glassmorphism. Read DESIGN.md before changing component visual style.

## Deployment

Static SPA on **Cloudflare Pages** (domain: `repalette.fasu.dev`).

```txt
Framework preset: None
Build:            bun run build
Output:           dist
```

`public/_headers` ships a strict CSP using SHA-256 hashes for the two inline `<script>` blocks in `index.html` (JSON-LD + theme bootstrap). The `postbuild` step (`scripts/verify-csp-hashes.ts`) hashes every inline script in `dist/index.html` and fails the build if the set doesn't exactly match the `'sha256-…'` tokens in `dist/_headers`. If you intentionally change an inline script, recompute its hash and update `_headers`:

```bash
bun -e 'const h=require("crypto").createHash("sha256").update(require("fs").readFileSync("index.html","utf8").match(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)[INDEX].replace(/<\/?script[^>]*>/g,""),"utf8").digest("base64"); console.log("sha256-"+h)'
```

`style-src 'unsafe-inline'` is intentional (React inline `style={}` + base-ui/sonner runtime style injection). Don't tighten it without auditing every inline style in the tree.

## Git workflow

`main` is protected by a GitHub ruleset:

- PR required (no direct push)
- Squash-merge only
- Linear history
- Signed commits required (squash-merge auto-signs via github-web-flow, so local signing is not required)
- Status check `ci` must pass (`.github/workflows/ci.yml`: lint + format:check + build)

Standard cycle:

```bash
git checkout -b feat/<name>      # or fix/, chore/
# work...
git push -u origin feat/<name>
gh pr create
# wait for ci; then squash-merge in GH UI
```
