## Context

The tracker can say how many runewords are crafted but not what the rest
cost. `IDEAS.md` settled the shape long ago: two collapsible blocks near the
top, collapsed by default — remaining runes with counts and sprite icons,
grouped by tier; remaining bases grouped by (category, socket count), whose
"placement and grouping still to be designed" note this document discharges.

What exists to build on: crafted state is a `Set<string>` owned by `App` and
already feeding two derived siblings (the progress band and the filtered
table), `RuneIcon` renders any rune from the sprite by name, `runes.json`
carries canonical order and a `tier` on all 33, `item-types.json` carries the
20 base categories in dataset order, and socket count is `runes.length`
everywhere by decision. `vitest` was adopted with this change named as the
reason: the aggregation is pure logic and the place a silent error hides
longest.

One debt falls due here: `--color-blood-dark` (`#200000`) has been declared
with nothing rendering it since `d2-theme`, and both `IDEAS.md` and the theme
spec record it as owed to this change — render it or delete it.

## Goals / Non-Goals

**Goals:**

- Pure, unit-tested aggregation: crafted set in, "what is still needed" out,
  for both runes and bases.
- Two collapsible panels between the progress band and the browsing
  controls, collapsed by default, updating immediately on a toggle.
- Work off `--color-blood-dark`, leaving `--color-link` as the only token
  without a use site.

**Non-Goals:**

- No rune inventory, and nothing that reserves space for one — decided out,
  possibly forever.
- No interaction with search, sort or the filters. The panels answer "what
  does the whole Chronicle still cost", not "what does the current view
  cost"; a shopping list that changed when a filter chip was pressed would
  be a different and more confusing feature.
- No persistence of the panels' open state, and no change to
  `view-persistence`.
- Not the slot-filter count question `search-sort-filter` left open. These
  panels aggregate by category, not by slot, so they do not answer it; it
  stays open.
- No re-styling of the table, header or controls.

## Decisions

### Native `<details>`/`<summary>`, not a hand-rolled disclosure

The collapse semantics, the keyboard operation (Enter and Space on the
summary), the expanded/collapsed state exposure and the no-JS default all
come free from the platform, and — unlike the detail view's hover panel —
nothing here needs positioning, so no library and no ARIA wiring is
justified. The default marker is replaced with the project's own indicator
(`list-none` plus a glyph that rotates with `[open]`), because the
platform's triangle is drawn in no token and varies by engine — the same
reasoning as the search field's clear button. Collapsed by default is the
absence of the `open` attribute, which is also what makes "collapsed unless
the player opens it this visit" true without any state at all.

**Alternative rejected:** a button with `aria-expanded` and a conditional
render. It is more code to reach parity with the element that already does
this, and conditional rendering would unmount the panel body, discarding
find-in-page into closed panels that Chromium supports for `<details>`.

### One `RemainingPanel` shell, two content components

A shared shell owns the `<details>` element, the summary band and the title;
`RemainingRunes` and `RemainingBases` render only their lists. The two
panels must look and behave identically — same band, same marker, same
default state — and a shared shell makes that one implementation rather
than a convention.

### Aggregation lives in `src/remaining/`, pure and synchronous

Two functions, mirroring how `src/runewords/` and `src/view/` are organised:

- `remainingRunes(runewords, runes, crafted)` returns
  `{ name, tier, count }[]` in canonical rune order — the order of
  `runes.json`, which is also tier order because the sprite's rows are the
  tiers. Repeats count: `Infinity` is `Ber Mal Ber Ist` and contributes two
  Ber. A rune whose count is zero is absent from the result, because "every
  rune still needed" is the contract and a `×0` row is noise.
- `remainingBases(runewords, itemTypes, crafted)` returns
  `{ category, sockets, count }[]` grouped by (category, socket count),
  ordered by the category's position in `item-types.json` and then by
  socket count ascending. `sockets` is `runeword.runes.length`, derived at
  the use site as everywhere else. The count is the number of uncrafted
  runewords that can go into that base — a runeword listing three
  categories appears under all three, because they are alternatives the
  player can farm toward, exactly as the slot filter already counts
  memberships. Zero-count groups are absent.

Both take the crafted set as an argument rather than reading a hook, which
is what makes them unit-testable without rendering anything and keeps them
indifferent to where crafted state lives.

**Alternative rejected for bases — deduplicating a multi-category runeword
into one group:** any rule that picks one category ("the first", "the
narrowest") hides real options from the player and invents a preference the
dataset does not express. The precedent is settled: 114 slot memberships
across 99 runewords is the filter working, not double counting. The panel's
copy must simply not imply the counts sum to the uncrafted total.

### Presentation: tier bands for runes, a flat grouped list for bases

The runes panel renders three bands — common, semirare, rare — each a
heading from the strings layer over its runes in canonical order, each rune
as its sprite icon, its name as text, and a count. The icon passes
`decorative`, because the name is text beside it and announcing both says
every rune twice — the exact case `RuneIcon`'s decorative mode was built
for. A band whose runes are all satisfied disappears with them. Tier labels
are our copy (the dataset's `common`/`semirare`/`rare` are identifiers) and
resolve through the layer; rune names are canonical identifiers and do not.

The bases panel is a flat list of `(category, sockets)` rows — category
name, socket count, count of runewords it serves — in dataset category
order. Grouping rows under per-category sub-headings was considered and
rejected: the list is bounded (well under the 99-row table this page
already asks the reader to scan), it lives behind a collapsed disclosure,
and a second heading level inside a panel inside a page is more structure
than the content earns. If usage shows the flat list is hard to scan, a
later change can regroup it without touching the aggregation.

Empty states do not remove a panel: a panel with nothing left renders its
title and a completion message from the strings layer, for the same reason
progress shows `0 of 99` rather than nothing — an absent block reads as a
defect, a present one with an answer reads as done.

### Placement and data flow: derived in `App`, like everything else

The two panels mount between `CraftedProgress` and `RunewordControls` —
item 4 of the Phase 1 layout, and the same ownership argument as the
existing siblings: they read the crafted set that `App` already owns. Each
aggregate is a `useMemo` keyed on `crafted`, so a toggle — including an
undo — re-derives both immediately, and a render caused by typing in the
search field re-derives neither. No effects, no storage, no subscription:
the panels are as derived as the progress bar.

The panels are **not** sticky and take no part in the
`--progress-band-height` stacking arrangement. They sit in normal flow
below the sticky progress band and scroll away with the page; adding a
third sticky layer for reference material that is collapsed by default
would spend viewport height on the thing the player looks at least often.

### `--color-blood-dark` becomes the summary band

The summary band of both panels renders `--color-blood-dark` — a band one
step darker than the table header's `--color-blood`, which is the visual
rank the panels want: related to the header band, subordinate to it. This
is the theme spec's own rule doing its work: a token already declared whose
role fits is used rather than a new one declared, and the
declared-ahead-of-use count falls from two to one (`--color-link` remains,
owed to `site-header`). The panel body renders on the page ground with no
surface token of its own — `--color-panel` belongs to the detail view and
reusing it here would be one token serving two unrelated roles.

The summary's title text takes the gold display family, and the open/closed
glyph takes the muted-to-gold hover pair the page's other controls already
move between. Counts render as body text; no new colour roles are
introduced, so the d2-theme delta is about working a token off, not adding
one.

## Risks / Trade-offs

- **[Bases counts can be misread as summing to the uncrafted total]** → The
  panel's copy names the count for what it is (runewords this base would
  serve), and the spec pins the multi-category behaviour with a scenario so
  a "fix" that deduplicates it fails a test.
- **[The bases list length is unmeasured until built]** — bounded by
  distinct (category, sockets) pairs in the dataset, but the exact row
  count for a fresh player is only known once the aggregation runs. → It
  sits behind a collapsed disclosure, so a long list costs nothing until
  opened; if it scans poorly, regrouping is presentation-only and does not
  touch the aggregation or its tests.
- **[`<details>` styling varies by engine]** — the marker replacement and
  summary band must be checked in more than Chromium. → The marker is
  hidden by the standard `list-none` plus the WebKit pseudo-element, both
  long-supported; behaviour (open/close, keyboard) is platform-native
  either way, which is the point of the choice.
- **[Prose in this change's comments and tests can leak into the
  stylesheet]** — the Tailwind scanner defect met three times by
  `search-sort-filter`. → Test files are already excluded; the class list
  is diffed between builds as that change established, and comment wording
  is checked against utility names before merge.
- **[Two more `useMemo`s on the crafted set]** — every toggle now
  re-derives the visible rows and both aggregates. → All three are linear
  scans over 99 records; the heavy row memoisation already absorbs the
  render, and the aggregates' arrays are small. No measurement is expected
  to be needed, and the toggle path already has a measured baseline to
  compare against if it is.

## Open Questions

- None blocking. The one deferred judgement is whether the flat bases list
  wants per-category grouping once real data is on screen — deliberately
  left as a presentation-only follow-up.
