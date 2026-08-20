## Why

The page has no narrow-viewport layout, and the defect `IDEAS.md` deferred has
kept growing. Measured in Chromium against the current build: at a 390px viewport
the document is **645px wide**, so the whole page — the title, the progress band,
the remaining panel, the control bar and the footer — scrolls sideways, not just
the table. The document is **13 442px tall** against 8 366px at 768px, because a
row below `md` is 127px instead of 75px.

The cause is one block. Measured per child of `<main>`, the minimum content width
is 22px for the progress band, 124px for the remaining panel and 102px for the
control bar; every one of them fits a phone today. The table's is **596px**, and
it sets the page's. Within it: `Crafted 84 | Runeword 276 | Base Items 98 |
Required Level 135`. The 276px is the runes collapsing into the name cell as
40×40 icons — the presentation `runeword-table` requires, drawn at the size that
column was never asked to hold.

The reference site answers the same problem at the same width with no sideways
scroll, a 6 130px document and 51px rows, by rendering the runes below `md` as
their names in text rather than as icons.

## What Changes

- **A stated minimum supported width of 390px.** At that width and above the
  document SHALL NOT scroll sideways. Below it the page degrades rather than
  being supported.
- **Runes render as text below `md`.** The inline sequence under the runeword's
  name drops its icons and keeps its names. Measured: −150px of table width,
  −5 346px of document height, rows from 127px to 65px. The icons are unchanged
  from `md` up and unchanged everywhere in the detail panel.
- **The crafted column is visually withdrawn below `md`.** The left accent border
  and the row tint already state crafted state without colour, and a pointer
  click anywhere on the row already opens the confirmation. The control itself
  stays in the tab order and in the accessibility tree — see **Impact**.
- **A short form for the headings that need one below `md`.** In practice that is
  the required-level heading: `Required Level` is `whitespace-nowrap` and sets its
  own column's width to 135px, at a width where the whole table has 390.
- **The sort indicator is hidden below `md`**, not made conditional. `IDEAS.md`
  records why: conditional reserving made the sorted column 12px wider than its
  neighbours and shifted every row beside it.
- **The desktop layout does not change.** Every rule this change adds is scoped
  below `md`; the `md:` layout, the fixed column percentages, the 40px icons and
  the runes column are untouched. This is the change's primary constraint and it
  gets its own requirement and its own measured check.

## Capabilities

### New Capabilities

- `narrow-viewport-layout`: the width budget the page holds itself to — a stated
  minimum supported viewport, no sideways scroll at or above it, the rule that
  every narrow-viewport adaptation is expressed in the stylesheet rather than by
  measuring the viewport in script, and the guarantee that none of it reaches the
  layout above the breakpoint.

### Modified Capabilities

- `runeword-table`: the runes' narrow-viewport presentation becomes text rather
  than icons, and the column headings gain a short form below `md`.
- `crafted-tracking`: the crafted-state control keeps its own leading column from
  `md` up, and below `md` is withdrawn from view while remaining operable by
  keyboard and present to assistive technology.
- `runeword-browsing`: the sort indicator's reserved space is withdrawn below
  `md`, and the crafted column's header — and so the crafted sort control — is
  not present there. The crafted **filter** in the control bar is unaffected and
  is the narrow viewport's answer to the same question.
- `ui-strings`: the short form of a column heading becomes display copy in both
  locales, beside the full form rather than replacing it.

**Not modified, and checked rather than assumed.** `d2-theme` needs nothing here:
Tailwind 4.3.3 already compiles every `hover:` utility as
`&:hover { @media (hover: hover) { … } }`, so no hover state sticks after a tap.
The committed `dist/` stylesheet shows bare `:hover` and is simply stale — read
the installed compiler, not that file.

## Impact

**Code.** `src/components/RunewordTable.tsx` (headings, the withdrawn column, the
hidden indicator), `src/components/RunewordRow.tsx` (the inline sequence, the
toggle's narrow presentation), `src/components/RuneSequence.tsx` (a text form),
`src/components/SortableHeader.tsx` (the indicator), `src/i18n/en.ts` and
`src/i18n/ru.ts` (the short heading), and `src/index.css` (the one utility the
withdrawn column needs).

**The page gutter is not touched.** `main`'s `p-6` and the matching `px-6` on the
header and footer measure wrappers stay as they are: the arithmetic below shows
the table fits 390px without reclaiming those 48px, and those three class lists
have to agree with each other, so leaving them alone removes a whole class of
regression from this change.

**Accessibility, and the one judgement this change asks for.** `crafted-tracking`
today requires the control to be "a real button ... reachable by Tab and operable
by Space and Enter without a pointer", and `runeword-browsing` requires all five
headers to sort. Withdrawing the column below `md` would, taken literally, remove
the only keyboard path to marking a runeword at a narrow width — which includes a
desktop browser window narrowed below 768px, not only a phone. This change
therefore withdraws the column **visually**, keeping one real button per row in
the tab order with its pressed state, revealed when it takes keyboard focus. The
crafted sort control is genuinely absent below `md`, and the crafted filter
covers the intent there.

**Tests.** `RunewordTable.test.tsx` asserts `md:table-fixed` and all five
`md:w-[…]` classes; `RuneSequence.test.tsx` asserts `md:hidden`. Both are about
the presentation this change edits and both need updating with it.

**Measurement.** The figures above were taken from the running page over CDP at
320/360/390/414/640/768. The same measurement is the check that the change
worked, and that the desktop layout did not move.

**No new dependencies.** Nothing here needs one.
