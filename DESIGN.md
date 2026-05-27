---
name: Repalette
description: Inspect an image's palette. Remap one color at a time, or by preset. Export.
---

<!-- SEED: re-run /impeccable document once there's code to capture the actual tokens and components. -->

# Design System: Repalette

## 1. Overview

**Creative North Star: "The Light Table."**

The interface is a darkroom: dim, hushed chrome at the edges, and a lit canvas in the middle holding the user's image. Tools sit at the perimeter like instruments on a workbench, never crossing onto the canvas. The only loud thing on the screen is whichever swatch the user is operating on right now, which glows a single specific magenta. Everything else holds its breath.

The system honors two viewing conditions, dim-room dark and bright-room light, with the same dignity. The default lands on the user's system preference; the toggle lives in the chrome, not in a dialog. In both themes the canvas is the source of light, and chrome recedes by lowering chroma rather than by going flat gray. The neutrals are tinted toward the accent hue (chroma 0.006 toward 350°), so the surface feels of-a-piece with the magenta rather than gray-against-pink.

This system explicitly rejects: rounded card grids, hero-metric templates, decorative gradient blobs, rainbow stripe banners, eyedropper crosshair hero illustrations, color-wheel-as-decoration, frosted-glass anything, Canva-style purple gradients with cartoon mascots, and Photoshop ribbon clutter. The palette is data, not decoration; the canvas is the subject, not a thumbnail.

**Key Characteristics:**

- Chrome recedes by lowering chroma, not by going flat
- Single accent ≤5% of any view, used only on active state
- Numbers and hex codes live in monospace; UI lives in sans
- Panels and lists, never card grids
- Image dominates; tools sit at the edges

## 2. Colors: The Light Table Palette

A nearly-monochrome chrome with one assertive accent. Neutrals are tinted toward the magenta accent so the surface reads as one continuous material in both themes.

### Primary

- **Cursor Magenta** (`oklch(70% 0.25 350)`): The single accent. Active swatch glow, primary button background, focus ring, "this is the thing you're editing right now" signal. Cap visible area at 5% of any screen.

### Neutral (Dark Theme)

- **Vellum Ink** (`oklch(15% 0.006 350)`): Page background. The dimmest tone in the system, a near-black with a magenta-leaning warmth.
- **Bench Surface** (`oklch(18% 0.008 350)`): Panel and sidebar background. Sits one step up from Vellum Ink.
- **Inset Raised** (`oklch(22% 0.008 350)`): Inputs, raised tool slots, hover state on rows.
- **Hairline** (`oklch(28% 0.008 350)`): 1px borders. Visible but never assertive.
- **Lamp Light** (`oklch(94% 0.005 350)`): Primary text. Off-white, magenta-leaning.
- **Mid Graphite** (`oklch(70% 0.006 350)`): Secondary text, hex values, counts.
- **Dim Graphite** (`oklch(50% 0.006 350)`): Tertiary text, captions, disabled controls.

### Neutral (Light Theme)

- **Tracing Paper** (`oklch(98% 0.004 350)`): Page background. Warm off-white, magenta-leaning.
- **Vellum Light** (`oklch(96% 0.005 350)`): Panel and sidebar background.
- **Inset Light** (`oklch(93% 0.006 350)`): Inputs, raised tool slots, hover state on rows.
- **Hairline Light** (`oklch(88% 0.008 350)`): 1px borders.
- **Deep Ink** (`oklch(20% 0.01 350)`): Primary text.
- **Mid Ink** (`oklch(45% 0.008 350)`): Secondary text, hex values, counts.
- **Dim Ink** (`oklch(65% 0.006 350)`): Tertiary text, captions, disabled controls.

### Named Rules

**The One Cursor Rule.** Cursor Magenta is the only color in the system that signals "active." It must never appear on more than one element at a time within a panel. If two things look active, the user does not know what they are editing. Disabled states drop chroma, never hue; never use magenta for warnings, errors, or counts.

**The Tinted Neutral Rule.** Every neutral carries chroma 0.004 to 0.01 toward hue 350. No `#000`, no `#fff`, no untinted hex. The surface should never look gray; it should look like the same material across both themes.

## 3. Typography

**Display:** sans-display family (pairing TBD at implementation). Tight tracking, large weights, used for the app title and the empty-state hero copy only.

**Body:** geometric sans (pairing TBD at implementation). UI chrome, button text, panel labels.

**Mono:** code-style monospace (pairing TBD at implementation). All hex values, all pixel counts, all percentages, all raw numeric metadata.

**Character:** Three voices serving three jobs. Display speaks when the app introduces itself, never again. Body is the workhorse of the interface and never raises its voice. Mono is the voice of data, and it is the most-seen typeface in the app.

### Hierarchy

- **Display** (500, clamp(2rem, 4vw, 3rem), 1.05): App title in chrome corner, empty-state hero, one big number in export confirmations. Nowhere else.
- **Headline** (500, 1.25rem, 1.3): Section heads inside panels ("Palette," "Inspector," "Presets"). Sans, not Display.
- **Title** (500, 0.875rem, 1.4): Tool labels, panel titles in the workbench bar.
- **Body** (400, 0.875rem, 1.5): All UI chrome text. Max 65ch where prose appears (rare, mostly empty-state copy).
- **Mono Label** (450, 0.75rem, 1.4, letter-spacing 0): Hex codes, pixel counts, percentages, image dimensions. Tabular figures on.
- **Caption** (400, 0.75rem, 1.35): Secondary metadata, file names, status bar.

### Named Rules

**The Data Is Monospace Rule.** Hex codes, pixel counts, percentages, image dimensions, RGB triplets: monospace, every time, tabular figures on. This is non-negotiable. Mixing proportional and tabular numbers in a list of stats makes alignment break and the eye work harder.

**The Display Earns Its Seat Rule.** Display type appears at most once per screen. Twice is decoration. Never use Display for section heads or marketing-style "Get started!" copy; that's Body or Headline.

## 4. Elevation

Flat by default. Repalette does not stack surfaces on top of each other; it places them next to each other. The visual depth comes from chroma steps in the neutral ramp (Vellum Ink → Bench Surface → Inset Raised), not from drop shadows.

Shadows appear in exactly two places: (1) under the canvas image, as a soft 0 24px 60px shadow at 30% opacity of Vellum Ink, to lift the image off the workbench and signal that the canvas is the subject. (2) On the magenta active-state focus ring, as a 0 0 0 3px outset of `oklch(70% 0.25 350 / 0.3)` for `:focus-visible`. That is the entire shadow vocabulary.

### Named Rules

**The Flat Chrome Rule.** Panels, sidebars, lists, buttons, inputs: zero shadow at rest. Hover state may shift background one step in the neutral ramp; it may not add a shadow.

**The Image Glows Rule.** Only the canvas image carries a real shadow. That shadow is the cue that the image is the subject of the screen. Removing it would flatten the relationship between chrome and content.

## 5. Components

_Omitted. No components have been built yet. This section will be populated on the next `/impeccable document` pass after the first canvas, palette list, inspector, and toolbar primitives ship._

## 6. Do's and Don'ts

### Do

- **Do** keep all neutrals tinted toward hue 350 with chroma 0.004 to 0.01. The surface should never look untinted gray.
- **Do** use Cursor Magenta on exactly one element per panel at a time: the active swatch, the active tool, the focused input ring.
- **Do** render every hex code, count, and percentage in monospace with tabular figures.
- **Do** lift the canvas image with a soft shadow. It is the only shadow in the system.
- **Do** lay swatches out as a dense scannable list with their stats (hex, count, percent), aligned columns, hover row-highlight only.
- **Do** honor `prefers-reduced-motion`. Disable all transitions when the user requests it.
- **Do** keep both dark and light themes on-brand. Both must satisfy The Tinted Neutral Rule.

### Don't

- **Don't** use `#000` or `#fff` anywhere. Tinted neutrals only.
- **Don't** wrap palette swatches in rounded cards with icon-plus-heading-plus-caption layouts. The palette is a list, not a card grid.
- **Don't** use a hero-metric template ("BIG NUMBER," "Total Colors," supporting stats) for the image's color count. Numbers belong in the status bar.
- **Don't** decorate with rainbow stripes, eyedropper crosshair illustrations, or color-wheel hero graphics. Those are the color-picker tool clichés the product rejects.
- **Don't** use `background-clip: text` with a gradient for headings, ever. Single solid color; emphasis via weight or size.
- **Don't** apply glassmorphism, `backdrop-filter: blur(…)`, or aurora gradients to any chrome. Frosted glass is forbidden.
- **Don't** use cartoon mascots, friendly purple gradients, or Canva-style empty-state illustrations. The empty state is one Display line and a single primary action.
- **Don't** reach for a modal first. Color editing is inline, in the inspector panel, never in a popup.
- **Don't** use `border-left` or `border-right` greater than 1px as a colored stripe accent on any element. Side-stripe borders are forbidden across the system.
- **Don't** introduce a second accent color "just for variety." The system has one accent. Disabled states reduce chroma; warnings are tinted neutral plus a hex prefix, not a second hue.
- **Don't** animate layout properties. Cross-fade or color-shift only; no width/height/translate transitions on chrome.
