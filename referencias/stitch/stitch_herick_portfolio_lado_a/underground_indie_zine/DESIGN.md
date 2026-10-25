---
name: Underground Indie Zine
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#e4beb7'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#ab8983'
  outline-variant: '#5b403c'
  surface-tint: '#ffb4a7'
  primary: '#ffb4a7'
  on-primary: '#680300'
  primary-container: '#ff553e'
  on-primary-container: '#5b0300'
  inverse-primary: '#b81f10'
  secondary: '#d4bbff'
  on-secondary: '#3b2069'
  secondary-container: '#523882'
  on-secondary-container: '#c4a7f9'
  tertiary: '#d1bcff'
  on-tertiary: '#391d73'
  tertiary-container: '#9c82dc'
  on-tertiary-container: '#32146c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad4'
  primary-fixed-dim: '#ffb4a7'
  on-primary-fixed: '#400100'
  on-primary-fixed-variant: '#920700'
  secondary-fixed: '#ebdcff'
  secondary-fixed-dim: '#d4bbff'
  on-secondary-fixed: '#260454'
  on-secondary-fixed-variant: '#523882'
  tertiary-fixed: '#e9ddff'
  tertiary-fixed-dim: '#d1bcff'
  on-tertiary-fixed: '#23005b'
  on-tertiary-fixed-variant: '#50368b'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-xl:
    fontFamily: Anton
    fontSize: 112px
    fontWeight: '400'
    lineHeight: 100px
    letterSpacing: -0.02em
  display-xl-mobile:
    fontFamily: Anton
    fontSize: 56px
    fontWeight: '400'
    lineHeight: 54px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Anton
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 52px
    letterSpacing: 0.02em
  headline-lg-mobile:
    fontFamily: Anton
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 36px
    letterSpacing: 0.01em
  headline-md:
    fontFamily: Anton
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 36px
    letterSpacing: 0.04em
  body-lg:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 28px
  body-md:
    fontFamily: Space Grotesk
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  label-code:
    fontFamily: Space Mono
    fontSize: 13px
    fontWeight: '700'
    lineHeight: 18px
    letterSpacing: 0.06em
  label-tag:
    fontFamily: Space Mono
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.1em
spacing:
  gutter: 1.5rem
  margin: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.75rem
  space-xl: 3rem
---

## Brand & Style

This design system channels the rebellious, tactile, and raw energy of 90s punk/indie-rock fanzines blended with a brutalist digital mindset. Created for a full-stack developer who cut their teeth in noisy server rooms, it breaks away from polished, sanitized tech portfolios in favor of analog warmth, screen-printed texture, and deliberate DIY imperfections.

The target audience includes tech leads, indie hackers, product founders, and engineering teams tired of homogenous corporate templates. The experience should evoke physical tactile nostalgia, underground gig posters, sharp technical competence, and unpolished authenticity.

Key stylistic pillars:
- **Neo-Brutalist Zine Layouts:** High contrast paper collages, cut-out magazine typography, ripped borders, and masking tape joints.
- **Physical Hardware Metaphor:** The tactile presence of cables, vinyl record tracklists ("Setlist"), and photocopied paper substrates.
- **Micro-chaos within structure:** Scribbled annotations, halftone dots, and sticker tags layered over clean, functional monospaced data structures.

## Colors

The palette balances intense gig-poster saturation against analog newsprint tones:

- **Preto (`#141414`):** The deep basement black. Used for high-impact backgrounds, harsh stroke borders, solid retro drop shadows, and display titles.
- **Creme (`#EFE9DA`):** The photocopied zine paper stock. Acts as the primary readable surface for cut-outs, tear-sheets, and card surfaces against the dark backdrop.
- **Vermelho (`#E8432E`):** Pure punk-rock red. Reserved for critical callouts, tape labels, highlight markers, primary interaction states, and spray-paint style marks.
- **Roxo (`#765BA7`) & Lavanda (`#A68BE6`):** The melodic indie accents. Used for badge tags, setlist accents, secondary buttons, and playful cut-out letter blocks.
- **Branco (`#FFFFFF`):** High-contrast contrast punch for sticker rims, cut-out contours, and raw terminal texts.

Surfaces should switch between dark carbon wash (`#141414`) and paper stock patches (`#EFE9DA`) using ripped SVG clip-paths rather than conventional soft gradient transitions.

## Typography

Typography plays a theatrical role, combining structured developer monospaces with abrasive display faces and informal marginalia:

- **Display Titles (`Anton`):** Heavy, condensed, and architectural. Used in all-caps for mastheads, major section titles, and ransom-note letter cards.
- **Narrative Body (`Space Grotesk`):** Clean, slightly quirky geometric grotesque that maintains supreme legibility across torn paper cards and dense paragraphs.
- **Technical Readouts (`Space Mono`):** Fixed-pitch precision for track numbers, timestamps, tech stack stickers, and server logs.
- **Handwritten Accents (`Caveat Brush` or `Permanent Marker`):** Marginal scribbles, directional arrows, witty asides, and sticky tape captions angled between -4deg and 4deg.

## Layout & Spacing

Layout follows an asymmetric zine spread logic anchored to a structural 12-column grid.

- **Canvas & Margin Structure:** Generous desktop margins with an asymmetric visual anchor: the rightmost gutter reserves space for a stylized continuous black RJ-45 Ethernet network cable running vertically down the browser viewport.
- **Collage Layering:** Content cards break strict orthogonal alignments using micro-rotations (`-2deg` to `+2.5deg`), overlapping margins, and simulated masking tape anchor points at their corners.
- **Breakpoints:**
  - **Desktop (>= 1024px):** 12-column fluid grid. Network cable pinned fixed to right edge. Overlapping visual collages and side-by-side sticker badges.
  - **Tablet (768px - 1023px):** 8-column layout. Redundant decorative tape reduced; setlist and cards align more tightly while maintaining torn paper dividers.
  - **Mobile (< 768px):** 4-column fluid stack. Cable stays anchored to the extreme right edge (6px wide). Titles scale down via mobile headline tokens. Overlaps convert to sequential stacked cards with hard drop shadows.

## Elevation & Depth

Soft, blurred blurs and natural lighting physics are rejected. Depth is strictly physical and graphic:

- **Hard Solid Drop Shadows:** Surface depth is communicated entirely via solid `#141414` offsets: `box-shadow: 4px 4px 0px #141414`. For elevated hero items, increase to `6px 6px 0px #141414`.
- **Masking Tape Overlays:** Semi-translucent neutral rectangles (`rgba(239, 233, 218, 0.7)`) with jagged edges placed over top borders simulate physical scotch/masking tape holding elements onto the background.
- **Torn Paper Edges:** Section dividers and card bottoms utilize ragged, torn-paper SVG silhouettes and halftone dot overlays rather than conventional border-radii or divider lines.
- **Stickers & Badges:** Rounded tech chips feature thick, punchy solid borders (`2px solid #141414`) with a white inner border stroke (`outline: 2px solid #FFFFFF`) replicating vinyl die-cut stickers.

## Shapes

The primary shape philosophy is brutalist: `roundedness: 0` for all structural panels, rectangular tabs, and torn-sheet layouts. 

Exceptions are made solely for figurative elements:
- **Die-cut tech badges:** Fully circular or oval pill tags (`rounded-full`) mimicking physical laptop stickers.
- **Ransom note letters:** Rigid, sharp rectangular blocks each cut at slightly varied dimensions.
- **Ripped sheets:** Irregular bottom edges produced by clip-path polygon masks simulating torn notebook and printer paper.

## Components

### Buttons & Interactive Links
- **Primary CTA:** Heavy background (`#E8432E` or `#141414`), white uppercase `Space Mono` or `Anton` text, hard drop shadow `3px 3px 0px #141414`. On hover: translate `2px 2px` and shrink shadow to `1px 1px 0px #141414`. On active: snap flat `0 0 0`.
- **Text Links:** Monospaced with a solid underlines that shift to a thick red marker stroke on hover (`text-decoration-thickness: 3px`).

### Badges & Tech Chips (Stickers)
- Rendered as die-cut stickers: circular or pill shapes with high-contrast background (`#141414`, `#765BA7`, or `#E8432E`), crisp white bold labels, hard outer stroke (`2px solid #141414`), and an offset drop shadow. Hover triggers slight rotational wiggle (`transform: rotate(3deg)`).

### Cards (Zine Tear-Sheets)
- Background `#EFE9DA` with faint grain/halftone texture.
- Ruled notebook lines for content lists or tracklists.
- Fastened at corners or top centers with simulated masking tape strips (`width: 60px`, `height: 18px`, angled slightly).
- Solid border (`2px solid #141414`) and rigid drop shadow (`5px 5px 0px #141414`).

### The "Setlist" Accordion / Career Tracklist
- Modeled as an authentic gig setlist on lined paper.
- Track numbers (`01`, `02`) set in colorful handwritten marker (`Caveat Brush` or `Permanent Marker`) in `#765BA7` or `#E8432E`.
- Song titles set in bold uppercase `Anton`, with dashed leader lines connecting to venue/company metadata in `Space Mono`.

### Input Fields & Controls
- **Inputs:** Thick solid border (`2px solid #141414`), paper cream background (`#EFE9DA`), monospaced placeholder font, no rounded corners. Solid offset shadow on focus.
- **Checkboxes & Radios:** Hand-drawn aesthetic or crisp square brutalist boxes filled with a solid cross mark (`X`) in Vermelho (`#E8432E`).