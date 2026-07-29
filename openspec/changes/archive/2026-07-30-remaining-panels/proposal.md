## Why

The product sentence has two halves: track which runewords are crafted, and
tell the player **which runes and which socketed bases they still need**. Seven
changes in, only the first half exists — the page can say "37 of 99" but not
"you still need 12 more Ist, and a four-socket polearm would unlock three of
what's left". That second half is the shopping list a player actually farms
against, it is item 4 of the Phase 1 layout, and it is change #8 in the
plan — the last feature standing between this page and a usable tracker.

## What Changes

- **A remaining-runes panel**: every rune still needed across the uncrafted
  runewords, each with its sprite icon and a count, grouped into the three
  tier bands (common / semirare / rare) so a flat list of up to 33 reads as
  three meaningful groups. Across all 99 the counts run `Shael ×20` down to
  `Zod ×3` — 343 rune slots — and the high runes have the lowest counts, so
  the panel is never demotivating.
- **A remaining-bases panel**: the socketed bases still needed, grouped by
  (base category, socket count) — a runeword specifies a category plus a
  socket count and never a specific item, so `(Polearms, 4)` is the finest
  honest grain. Socket count is derived from `runes.length`, as everywhere
  else.
- **Both panels are collapsible, collapsed by default, near the top** —
  between the progress band and the browsing controls, per the Phase 1
  layout. Their expanded state is exposed to assistive technology and the
  toggle is keyboard-operable.
- **Both update immediately when a runeword is toggled**, exactly as the
  progress bar already does — they are derived views of the same crafted set.
- **The aggregation is pure logic in its own module, unit tested** — this is
  the place a silent error would hide longest, and `vitest` was adopted for
  exactly this change.
- **`--color-blood-dark` gets its use site or its deletion.** The token was
  declared ahead of any surface and is on the books as owed to this change;
  after it lands only `--color-link` (owed to `site-header`) may remain
  unrendered.

Out of scope, deliberately: rune inventory (decided out, possibly forever),
any interaction between the panels and the table's filters, persistence of
the panels' open state, and the slot-filter count question
`search-sort-filter` left open — these panels aggregate by category and
socket count, not by slot, so they do not answer it.

## Capabilities

### New Capabilities

- `remaining-needs`: the aggregation of what an uncrafted Chronicle still
  costs — which runes and how many, which (category, socket-count) bases —
  and the two collapsible panels that present it: placement, default state,
  tier grouping, empty states, immediate reaction to a toggle, and disclosure
  semantics.

### Modified Capabilities

- `d2-theme`: the "Named colour tokens" requirement names the remaining
  panels twice — as the example surface that must have _no_ token until its
  change lands, and as the change `--color-blood-dark` is owed to. Both
  scenarios flip: the panels' surfaces become tokens, and the
  declared-ahead-of-use count falls from two to one.

## Impact

- **New code**: an aggregation module (`src/remaining/`) with unit tests; a
  panel component rendering a collapsible block, used twice.
- **Modified code**: `src/App.tsx` mounts the panels between
  `CraftedProgress` and `RunewordControls` and hands them the crafted set;
  `src/i18n/en.ts` grows the panels' copy (titles, tier labels, count and
  socket formats, empty states); `src/index.css` gains the panels' surface
  tokens and works off `--color-blood-dark`.
- **Reused as-is**: `RuneIcon` (decorative mode where the name is text
  beside it), the crafted `Set` and `useCraftedRunewords`, the dataset's
  `runes.json` order and `tier` field.
- **Dependencies**: none added. A native disclosure element needs no
  positioning library.
- **Data**: untouched. Everything both panels present derives from fields
  the dataset already carries.
