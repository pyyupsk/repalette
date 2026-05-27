# Product

## Register

product

## Users

Devs, designers, pixel/game artists, and hobbyist theme tinkerers — anyone who needs to inspect an image's palette and remap it to another. Context: focused craft session at a desk, often on a dark editor screen, comparing source and target side-by-side. Job: upload image → understand its actual color distribution → swap colors (single or by preset palette) → export PNG and/or palette spec.

Skill range is wide: a senior dev porting a Catppuccin-themed screenshot to a custom palette wants keyboard-driven density; a hobbyist recoloring a wallpaper wants the same tool not to feel hostile.

## Product Purpose

Repalette extracts every distinct color from an uploaded image, exposes pixel counts and frequencies, and lets the user remap colors — one-by-one or via preset palettes — with shade-preserving algorithms (delta-preserving swap, accent desaturation against base, warm-slot neutralization). Outputs: recolored PNG and palette JSON/CSS.

Success looks like: a user opens an image, recognizes their palette inside 5 seconds, applies a preset, tweaks one or two off slots, and exports — without having scrolled past a marketing pitch or fought a modal.

## Brand Personality

Precise. Crafted. Quietly confident. The tone of a pro creative app — Figma's panels, Procreate's calm canvas focus, Affinity's no-nonsense density. Three words: **precise, ergonomic, restrained**. The interface should feel like it respects the user's craft rather than performing for them.

## Anti-references

- **Generic SaaS dashboards** — rounded card grids, hero-metric templates, decorative gradient blobs, "Get started" empty states with cartoon mascots.
- **Color-picker tool clichés** — rainbow stripe banners, eyedropper-crosshair hero illustrations, color-wheel-as-decoration, "Pick your perfect palette!" hype copy.
- **Glassmorphic / aurora** — frosted glass cards, blur-heavy chrome, neon aurora backgrounds.
- **Childish / cartoon** — Canva-style purple gradients, emoji UI, mascot illustrations, playful friend-tone copy.
- **Photoshop ribbon clutter** — every tool jammed into a top bar with 12-pixel icons.

## Design Principles

1. **The image is the subject.** Chrome recedes; the canvas dominates. Tools sit at the edges, never on top of the image.
2. **Density without noise.** Panels and lists, not cards. Empty space is a tool; padding is not decoration. Information earns its visual weight by what it tells the user, not by being wrapped in a box.
3. **Honest precision.** Show exact hex, exact pixel counts, exact percentages. Round only when the user wouldn't notice; never approximate to look friendly.
4. **Keyboard first, mouse fluent.** Power users should never have to leave the keyboard. Casual users should never realize they could have used it. Same UI, two paths.
5. **The palette is data, not decoration.** Swatches sit in scannable lists with their stats. They are not big square hero cards. The eye reads the list like a code editor, not a moodboard.

## Accessibility & Inclusion

Best-effort. Target conventional contrast and focus visibility, full keyboard operation, semantic markup. No formal WCAG audit gate. Respect `prefers-reduced-motion`. Color-blind safe in palette identification — show hex text alongside swatches, never rely on hue alone to communicate state.
