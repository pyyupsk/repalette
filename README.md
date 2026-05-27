# Repalette

Extract every distinct color from an image, inspect pixel counts and frequencies, and remap colors — per-swatch or via preset palettes — with shade-preserving algorithms. Exports recolored PNG and palette JSON/CSS.

Live: <https://repalette.fasu.dev>

## Stack

- **React 19** + **TypeScript** with the React Compiler enabled
- **Vite 8** (Rolldown), **Tailwind 4** with OKLCH-tinted neutrals
- **Zustand** state, **@tanstack/react-virtual** for the palette list, **@base-ui/react** primitives, **culori** for color science
- **Bun** package manager and runtime for scripts
- **oxlint** + **oxfmt** for lint/format; **fallow** for dead-code and duplication audits

## Quick start

```bash
bun install
bun run dev          # http://localhost:5173
bun run build        # type-check, build to dist/, verify CSP hashes
bun run preview      # serve dist/
```

Other scripts:

```bash
bun run lint         # oxlint
bun run format       # oxfmt .
bun run audit        # fallow audit (dead code + duplication)
bun run verify:csp   # validate dist/_headers hashes match dist/index.html
```

## Documentation

- [`PRODUCT.md`](./PRODUCT.md) — who the tool is for, what success looks like, anti-references
- [`DESIGN.md`](./DESIGN.md) — design system (colors, type, elevation, do's and don'ts)
- [`CLAUDE.md`](./CLAUDE.md) — architecture overview and conventions

## Deployment

Static SPA on Cloudflare Pages with a strict CSP enforced by `public/_headers`. Build output is `dist/`. SPA fallback is handled by `public/_redirects`. The `postbuild` step (`scripts/verify-csp-hashes.ts`) fails the build if inline `<script>` hashes in `dist/index.html` diverge from the `'sha256-…'` tokens in `dist/_headers`.

## Contributing

`main` is protected: PR required, squash-merge only, linear history, signed commits, status check `ci` must pass.

```bash
git checkout -b feat/<name>
# ...
git push -u origin feat/<name>
gh pr create
```
