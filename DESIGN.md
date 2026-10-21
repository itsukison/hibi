# Hibi — Design System (v0.1 draft)

Hibi (日々, "days") is a daily photo diary. Every day becomes a sticker; every
month becomes a page of stickers. This system is built fresh and does not
inherit anything from the Keepsake prototype's visual language.

## 1. Concept: "a paper diary on a kitchen table"

- **Paper, not glass.** Warm off-white paper surfaces with a faint grain. No
  gradients, glassmorphism, or neon.
- **Photos become die-cut stickers.** Subject cut out, thick white border, soft
  drop shadow, a slight tilt. Stickers are the only saturated color in the UI.
- **Ink is the accent.** UI chrome is near-black ink on paper. One warm accent
  (kaki / persimmon) is reserved for "today" and live states.
- **Three voices of text.** Handwriting for anything personal (month names,
  notes, annotations), typewriter mono for dates and metadata, a quiet system
  sans for UI and chat.
- **Calm by default, playful on touch.** Layouts are a strict grid; the
  personality comes from sticker tilt, springs, and handwriting.

## 2. Color tokens

| Token | Hex | Use |
|---|---|---|
| `--paper` | `#F3F0E8` | App background (with grain overlay) |
| `--paper-raised` | `#FBFAF6` | Cards, sheets, calendar panel |
| `--paper-sunken` | `#EAE6DC` | Empty day cells, inputs, chips |
| `--line` | `#E0DACD` | Hairlines, dividers (1px) |
| `--ink` | `#1E1C19` | Primary text, primary buttons, selected states |
| `--ink-2` | `#68635A` | Secondary text |
| `--ink-3` | `#A29C90` | Tertiary text, weekday labels, placeholders |
| `--kaki` | `#D2603A` | Today marker, recording dot, unread — sparingly |
| `--sticker-edge` | `#FFFFFF` | Die-cut border |

Folder tints (muted, paper-like; one per folder, cycled):

| Token | Hex |
|---|---|
| `--folder-sage` | `#C8CEB6` |
| `--folder-clay` | `#E2C6B4` |
| `--folder-mist` | `#C3CCD6` |
| `--folder-butter` | `#E8DDB5` |
| `--folder-lilac` | `#D4CADB` |

Rules: no pure white backgrounds, no pure black. Accent covers no more than
about 2% of any screen. Text contrast is at least 4.5:1 (`--ink-2` on `--paper`
passes; `--ink-3` is for non-essential labels only).

## 3. Typography

Fonts are bundled locally (OFL licensed, `.woff2` in `public/fonts/`). No
runtime font requests.

| Role | Family | Use |
|---|---|---|
| Hand | **Caveat** (400/600) | Month names, day titles, user notes, collage annotations, empty-state lines |
| Mono | **IBM Plex Mono** (400/500) | Dates, weekday labels, day numbers, counts, small-caps metadata |
| Sans | System UI (`-apple-system, "SF Pro Text", "Hiragino Sans", sans-serif`) | Buttons, chat text, form text, settings |

Scale (px / line height):

| Token | Font | Size | Use |
|---|---|---|---|
| `display` | Hand 600 | 40 / 1.0 | Screen titles ("October 2026") |
| `title` | Hand 600 | 28 / 1.1 | Day title on the collage, folder names |
| `note` | Hand 400 | 22 / 1.25 | Notes and annotations |
| `body` | Sans 400 | 16 / 1.45 | Chat, inputs |
| `label` | Sans 500 | 14 / 1.3 | Buttons, tabs |
| `meta` | Mono 400 | 11 / 1.2, +0.08em, UPPERCASE | `WED · OCT 16 · DAY 289` |
| `numeral` | Mono 400 | 13 / 1 | Day numbers in the calendar |

## 4. Space, shape, depth

- **Spacing:** 4pt base, scale `4 8 12 16 20 24 32 40 56`. Screen gutter 20.
- **Radius:** `--r-sm 10` (day cells, chips) · `--r-md 16` (cards, inputs) ·
  `--r-lg 28` (sheets, calendar panel) · `--r-pill 999` (nav, buttons).
- **Shadows:**
  - `--shadow-sticker`: `0 1px 1px rgb(40 30 10 / .10), 0 6px 14px rgb(40 30 10 / .12)`
  - `--shadow-card`: `0 1px 0 rgb(40 30 10 / .04), 0 8px 24px rgb(40 30 10 / .06)`
  - `--shadow-float`: `0 12px 32px rgb(40 30 10 / .16)` (nav, capture button)
- **Grain:** inline SVG `feTurbulence` noise at 4–6% opacity over `--paper`.

## 5. Core components

**Sticker** — the atomic unit. A transparent cutout with a 3–4px white outline
(stacked `drop-shadow` filters) and `--shadow-sticker`. Each sticker gets a
stable pseudo-random tilt of −5° to +5° from its id. Photos without a cutout
fall back to a white-bordered polaroid square at the same tilt.
Press: scale to 0.94; release: spring back with a slight overshoot.

**Day cell** — a square on a 7-column grid.
- Empty past day: mono numeral only, no fill.
- Future day: numeral in `--ink-3`.
- Day with memories: the sticker sits inside the cell at 96% (no overflow), numeral hidden.
- Multiple memories: the top sticker, plus a count badge — an ink pill with the number in Hand 600 / 15, tilted −6°.
- Every month grid is padded to 6 weeks, so months (and year-view mini months) all share one height. The padding cells show the neighbouring months' dates in faint `--ink-3` (dots in the year view), like a paper calendar.
- Today: a `--kaki` dot under the numeral or sticker.

**Folder** — a paper folder in a tint color: a back panel with a tab, 2–3
photo stickers peeking out at varied tilts, and a front flap that overlaps
them. Label in Hand `title`, count in `meta`. On press, the photos lift by 6px.

**Bottom nav** — on the left, a small translucent paper pill (1px `--line` border, light blur) holding two 40px tabs, Diary and Ask; on the right, a separate 46px ink circle with a hand-drawn plus for Capture. The icons are custom hand-drawn strokes (diary page with a star, speech bubble with a sparkle, uneven plus). The active tab is shown by ink color and a small `--kaki` dot. Nothing important sits in the bottom 100px of Home: the month stats live in the `meta` line above the month name.

**Segmented toggle** — Calendar / Folders on Home. A sunken track with an ink
thumb that slides on a spring.

**Buttons** — Primary: ink pill, paper text. Secondary: `--paper-sunken`
pill, ink text. Ghost: text-only ink. Minimum height 44.

**Chat bubbles** — User: ink bubble, paper text, right-aligned. Hibi: no
bubble; sans text on paper, with referenced memories shown as a horizontal row
of small stickers with mono dates below them. A "Sample answers" note stays
visible (demo honesty).

**Sheet** — `--paper-raised`, top radius 28, grab handle, used for the
capture note and the day picker.

## 6. Screen patterns

1. **Home: Calendar.** `meta` line (`2026 · 11 DAYS KEPT · 24 MEMORIES`), then a `display` month name, then
   a weekday row in mono and a sticker grid. **Pinch out** (or ctrl+scroll
   on desktop, plus a "Year" button for accessibility) zooms to a 3×4 year grid
   of mini-months, where days become tiny stickers or dots. **Pinch in** on a
   month to return. Stickers share a `layoutId` so they fly between levels.
2. **Home: Folders.** A 2-column folder grid using the same header, switched
   with the segmented toggle.
3. **Capture.** A full-bleed viewfinder (simulated with a demo photo), a
   large shutter, and a "cut out" moment where the photo animates into a
   sticker. Then a sheet with an optional handwritten-style note field and
   Save.
4. **Chat.** A paper background, suggestion chips in Hand, and answers that
   cite memory stickers. Tapping a sticker opens that day.
5. **Day (collage).** A `meta` header (`SUN · JUN 21 · DAY 172`), then a day title
   in Hand. Stickers are placed by hand-tuned layouts (`src/collage.ts`): 2–3 variants
   each for 1–4 stickers, picked from the date, with a zigzag fallback for 5+.
   Each note sits in free space with an ink arrow pointing at its sticker, plus
   one small doodle (star, sparkle, heart, or squiggle). A bottom date strip of 5 day chips
   (selected = ink) moves through the days.

## 7. Motion

- Springs only (Motion): `snappy {stiffness 500, damping 32}` for presses and
  toggles; `soft {stiffness 260, damping 26}` for layout and zoom.
- A sticker landing uses a 1.08 → 1.0 scale with tilt settling: the signature
  moment, used on capture save and collage entry.
- Collage entry staggers stickers at 40ms intervals.
- `prefers-reduced-motion`: replace springs with 150ms fades and disable
  tilt animation (static tilt stays).

## 8. Accessibility and demo rules

- Every sticker has `alt` set to its memory title, and day cells read as "October 16, 2 memories".
- The pinch zoom always has a button equivalent, and focus rings are 2px `--ink` with a 2px offset.
- All demo constraints from `/AGENTS.md` apply: local only, simulated
  camera/chat, the fixed demo date of October 16, 2026, and no persistence.
