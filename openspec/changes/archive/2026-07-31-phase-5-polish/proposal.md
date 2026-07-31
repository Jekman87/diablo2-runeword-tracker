## Why

The tracker does its job: 99 runewords, progress that persists, search, sorting,
filters, two locales and a CSV route between devices. What is left is the finish —
the page reads as pure black rather than as one of the game's own screens, it ends
abruptly at the last table row with no closing furniture, it offers no way back up
a table 7400px tall, and it carries three named pieces of debt that every change
since has stepped around.

These are grouped as **one change covering one stage**, deliberately against the
"one feature per change" rule in `AGENTS.md`: each item here is a handful of lines,
and a token rename does not earn its own propose–apply–archive cycle. The items are
also not independent — the ground colour is what makes the game's translucent
tooltip possible, and the same palette pass touches both.

## What Changes

- **The page ground stops being black.** `--color-ground` moves from `#000` to a
  dark grey, taking the ground of [diablo2.io](https://diablo2.io/) as the
  reference for how dark. That site's ground is a tiled stone texture; **this
  change takes a flat colour instead** — its theme carries no reuse licence, and a
  colour is not an asset.
- **The palette moves with it, and this is the item with reach.** Measured against
  the candidate grounds: the row hairline, the row hover, the search field at rest
  and the progress groove are all defined as steps _above black_ and become steps
  _below_ a grey ground, inverting the relationship they were chosen for.
  `--color-muted` (already 4.28:1 on black, under AA) falls to 3.08:1 and
  `--color-gold` from 5.34:1 to 3.85:1. Every affected token is re-derived so the
  relationships hold; text that was above AA on black stays above it on grey.
- **The detail panel becomes translucent black, as the game's item tooltip is.**
  It is an opaque `#17171a` today, chosen because a near-black panel on a black
  page has no edge. On a grey ground that reasoning inverts and the panel can be
  what it is a copy of. This is contrast-positive rather than a trade: black at
  0.85 over the new ground measures 20.3:1 for the panel's white text against
  17.9:1 today.
- **The panel's property lines are centred**, as the game centres them. Only the
  property lines — the descriptive text above them stays left-aligned.
- **The ornamental divider spans the viewport** instead of ending at the content's
  1104px measure. The theme already requires a band that fills whatever width it is
  given, so what changes is the container, not the decoration.
- **The page gains a footer**: a copyright line, and beside it a donation control.
  The author is in Belarus, where card processors and the usual donation services
  do not reach, so the instrument is a cryptocurrency address. Which coin, which
  network and how the address is presented are settled in design.
- **A back-to-top control appears once the page has scrolled past the header** and
  returns the reader to the top. The table is 7400px at desktop width and 10200px
  at phone width.
- **The help disclosure gains a badge legend and a word about the rune tiers**,
  both taken from the reference site's own help. The legend renders each badge as it
  appears in the table — the ladder marker, one patch tag per era, `Note!` — beside
  a line saying what it means, which is the first place on this page to say that the
  patch colours mean anything at all: there are four of them for the dataset's five
  patch values, and nothing states that `1.10` and `1.11` share one. It is also the
  mitigation this project already claims for adopting the reference's badge
  contrast knowingly at 2.01:1 — that no badge's meaning depends on seeing it —
  made visible rather than only asserted. The tiers line says what the three bands
  in Remaining Runes are, and that they follow the Horadric Cube's upgrade ratios,
  so a reader knows why the rarest runes carry the smallest counts.
- **Toggling a row while sorted by crafted state animates it to its new position,
  and a row a filter hides fades out.** Sorting by crafted state is the one control
  here that can move a row out from under the pointer, and it shipped without
  motion to explain what happened.
- **Three pieces of named debt are paid.** The 2px corner radius becomes a system
  rather than four use sites, so the detail panel and the undo notice take it too;
  `--color-accent` is renamed `--color-note-text`, which is the role it actually
  holds; and `useCraftedRunewords`' `toggle` gains a stable identity, so typing in
  the search field stops re-rendering every presented row.

## Capabilities

### New Capabilities

- `site-footer`: the page's closing furniture — the copyright line, the donation
  control and the address it carries, and the guarantee that the footer is a
  landmark outside `<main>` whose copy resolves through the display layer in both
  locales.
- `scroll-to-top`: a control that appears at a defined scroll offset, returns the
  reader to the top of the document, states itself to assistive technology, honours
  a reduced-motion preference, and obstructs no other control at any width.

### Modified Capabilities

- `d2-theme`: the page ground becomes grey rather than black; the tokens defined
  relative to black are re-derived; the detail panel's ground becomes translucent;
  the corner radius becomes a system with one token; `--color-accent` is renamed
  for its role.
- `runeword-table`: the detail panel's property lines are centred; a row moved by a
  re-sort animates to its position and a row removed by a filter fades out, both
  subject to a reduced-motion preference and to the row memoisation the table
  already depends on.
- `site-header`: the ornamental divider spans the viewport rather than the header's
  measure, while the header keeps its banner landmark, keeps closing with the
  divider, and keeps the help panel opening below it at the page's own measure. The
  help panel gains a badge legend and a rune-tier explanation — which needs the
  panel's "every word resolves through the display-copy layer" requirement to say
  what a rendered badge sample is, since a sample is the interface's own component
  rather than a word.

## Impact

- **Stylesheet.** `src/index.css` — the `@theme` block's page, table, crafted and
  muted families; the progress band, which is the only surface besides `body` that
  paints `--color-ground`; the radius on the detail panel and the undo notice.
- **Components.** A new footer component and a new scroll-to-top control, both
  rendered from `App.tsx` beside `<main>`; `SiteHeader.tsx` for the full-width
  divider, the measure wrapper it needs, and the badge legend — which makes the
  header the first consumer of the table's badge component, so that component has
  to render a sample without a runeword behind it; `RunewordDetails` for the centred
  property lines; the table's rows for the motion.
- **Copy.** New strings in `src/i18n/en.ts` and `src/i18n/ru.ts` for the footer,
  the donation control and the scroll-to-top control. Russian wording for anything
  the game names comes from the official localisation on the existing terms.
- **Constants.** The donation address and any site-level name or URL sit beside the
  patch constants in `src/header/site.ts`, or in a sibling module if the header's
  name stops fitting what the file holds.
- **Tests.** `src/**/*.test.tsx` for the new controls and the centred lines; the
  existing header tests for the divider's new container; no test asserts a colour
  value, so the palette pass is verified against the built stylesheet and in a
  browser instead.
- **No new dependencies.** The motion is CSS transitions and the View Transition
  or FLIP shape decided in design, not an animation library.
