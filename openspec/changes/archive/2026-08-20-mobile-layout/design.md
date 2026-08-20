## Context

The page is a single desktop layout with three responsive rules in it: the runes
column collapses at `md`, the table drops to `table-auto` below `md`, and the
remaining panel goes to one column. Nothing else in `src/` names a breakpoint.

The numbers this design works from were measured over CDP against the running
page, not estimated.

**Where the width goes.** Minimum content width of each child of `<main>` at a
390px viewport:

| Block           | min-content |
| --------------- | ----------- |
| Progress band   | 22px        |
| Remaining panel | 124px       |
| Control bar     | 102px       |
| **Table**       | **596px**   |

Only the table does not fit. Inside it, at 390px:

`Crafted 84 | Runeword 276 | Runes 0 (collapsed) | Base Items 98 | Required Level 135`

**What each candidate fix buys**, applied to the live page one at a time:

| Applied                               | Document width | Document height | Median row |
| ------------------------------------- | -------------- | --------------- | ---------- |
| nothing (baseline)                    | 620            | 13 406          | 127        |
| rune icons at 24px                    | 524            | 11 864          | 111        |
| rune icons removed, names kept        | 470            | 8 060           | 65         |
| …and headings allowed to wrap         | 430            | 8 208           | —          |
| full candidate, simulated in the page | **390**        | —               | —          |

**The reference at the same width**, for calibration: document 390px wide, 6 130px
tall, 51px rows, three columns (`Runeword 156 | Item Types 171 | Level 63`). Its
whole mobile mechanism is `md:hidden` / `md:table-cell` on the runes column plus
rendering the runes as their names in text.

## Goals / Non-Goals

**Goals:**

- No sideways scroll at 390px and above.
- The recipe stays readable on a phone: the rune names, in order, with repeats.
- The document gets materially shorter, because 13.4m of scroll is the second
  half of the same defect.
- Every adaptation is a stylesheet rule, so nothing depends on script having run
  and there is no flash of the wrong layout.
- **The `md`-and-above layout is byte-for-byte the layout that ships today**, and
  that is checked by measurement rather than by reading the diff.

**Non-Goals:**

- Card layout instead of a table. `runeword-table` requires a real `<table>` for
  its row and column semantics and its header association; nothing here is worth
  that.
- Windowing or pagination. Already settled against, and the height fix here is
  the row, not the row count.
- Support below 390px. The page degrades there; it is not a supported width.
- A rune inventory, a sidebar, or anything else the reference has and this
  project has already declined.
- Reclaiming the page gutter. The arithmetic does not need it and three class
  lists would have to move together.

## Decisions

### 1. The runes below `md` are their names, not their icons

`RuneSequence` gains a variant: the icon form it renders today, and a names form
that draws the projected rune names in order, with repeats, and no sprite. The
row already renders two copies of the sequence — one `md:hidden` in the name cell,
one in the runes `<td>` — so this changes _which form_ the narrow copy takes and
adds no third copy. The wide copy is untouched.

**Why not smaller icons.** 24px icons buy 96px where names buy 150px, and leave
the row at 111px where names leave it at 65px. The artwork is also the thing the
page is proud of; showing it at 60 % of its native cell reads as a broken sprite
rather than as a design. Better to show it at its native size where there is room
and to fall back to the words where there is not — which is also what the
reference does, and it is the only reason its rows are 51px.

**Why not a horizontally scrolling table.** It keeps the icons, and it keeps the
defect: a table that scrolls sideways inside the page hides the level and the
bases behind a gesture nobody is told about, on the two columns a player scans.

**Accessibility is unchanged by this.** The icons are already `decorative` and the
names are already the announced text, so removing the icons below `md` removes
nothing from the accessibility tree.

### 2. The crafted column is withdrawn from view below `md`, and its control is not

**Corrected while building.** This first read "the `<th>` becomes
`hidden md:table-cell`, exactly as the runes column already is". It cannot. The
runes column hides its header _and_ its cells together, which is what a column
may do; this column has to keep its cells, because they hold the only keyboard
path to marking a runeword. A `<thead>` row declaring four cells over `<tbody>`
rows declaring five gives the table five columns and slides every header one
column left of the data it heads.

So **both cells stay and the column collapses instead**. The `<th>` keeps its
place in the column count and gives up its width (`w-0 md:w-[9%]`) and its
control (`[&>button]:hidden md:[&>button]:flex`) — there is no crafted column on
screen to sort, so the sort control goes with the heading. The `<td>` keeps its
place and gives up its padding (`p-0 md:p-2`).

The button inside it is not given up. `display: none` would take it out of the
tab order and out of the accessibility tree, and that is not a phone-only
concern: a desktop browser window narrowed below 768px is the same viewport.
Below `md` it is clipped rather than removed — an absolutely positioned box is
not in the cell's flow, so the cell measures zero either way — and it un-clips
when it takes keyboard focus. One utility in `src/index.css` holds all three
states, because it is one decision about one control at two widths and splitting
it across `className` strings is how it drifts:

```css
@utility crafted-toggle {
  position: absolute;
  inset-block-start: 0.5rem;
  inset-inline-start: -0.75rem;
  clip-path: inset(50%);

  &:focus-visible {
    clip-path: none;
  }

  @media (width >= 48rem) {
    position: static;
    clip-path: none;
  }
}
```

The negative inline offset is the answer to the risk below: the cell it is
positioned against has no width, so at `0.25rem` the focused box sat 16px over
the start of the runeword's name. At `-0.75rem` its far edge lands exactly on the
name cell's — measured at 390px, overlap zero — and it sits in the page's own
gutter, which this change deliberately does not spend.

`48rem` is Tailwind's `md`, restated here because there is no `tailwind.config.js`
to import it from and a CSS media query cannot read a variant. It is stated once,
in this one place, and the components use `md:` everywhere else.

Alternatives considered:

- **A 34px crafted column** (checkbox, no heading). Measured to fit at 390px. The
  owner declined it: the left accent border and the row tint already state the
  crafted state without colour — `crafted-tracking` requires exactly that — and a
  third statement of it costs a column.
- **A second toggle in the name cell**, the way the rune sequence has two copies.
  Rejected: the row hands the dialog the control's `ref` so focus can come home,
  and two copies means two refs and a runtime choice between them, which is
  script deciding a thing the stylesheet should decide.
- **`sr-only` / `focus-visible:not-sr-only`.** Rejected because `not-sr-only`
  returns the button to flow, which widens the cell and shifts the whole row
  while focus rests on it.

### 3. Only the heading that needs a short form gets one

`Required Level` is `whitespace-nowrap` — deliberately, so it does not wrap into
two lines in either locale — and therefore sets its column to 135px. It is the
only heading whose full form does not fit; `Runeword` (126px) and `Base Items`
(98px) do.

The short form is rendered beside the full one, each hidden on the other side of
`md`, so the collapse is a stylesheet rule and exactly one of them is in the
accessibility tree at any width. Same mechanism as the rune sequence, and the
comment there already justifies the duplicated markup.

The arithmetic that says this is enough, at a 390px viewport with a 48px gutter:

```
after text runes                    84 + 126 + 98 + 135 = 443  → 491 > 390
after withdrawing the crafted column     126 + 98 + 135 = 359  → 407 > 390
after the short level heading            126 + 98 + ~46 = 270  → 318 < 390
```

### 4. The sort indicator is withdrawn below `md`, not made conditional

`hidden md:block` on the indicator span in `SortableHeader`. Reserving the space
stays exactly as it is from `md` up — which is the whole reason it exists, and
`IDEAS.md` records what happened when it was conditional: the sorted column came
out 12px wider than its four neighbours and every row beside it moved.

Below `md` the arrow carries nothing that is lost: `aria-sort` states the sorted
column and the button's accessible name states the direction in words. The glyph
was always the third carrier, never the only one.

### 5. The accessible name of a header stays the full heading

`accessibleName()` keeps building its sentence from the full heading, so a screen
reader hears "sort by required level, ascending" at every width rather than "sort
by lvl". The visible text below `md` is then the short form while the accessible
name names the long one, which is a mismatch WCAG 2.5.3 (Label in Name) cares
about for voice control. Taken deliberately: the alternative tells a screen-reader
user less in order to serve a voice-control user on a viewport where voice control
is driving a phone that has no visible label problem to begin with. Recorded as an
open question rather than buried.

### 6. The check is a measurement, not a reading

The same CDP probe that produced the numbers above is the acceptance check, run at
320 / 360 / 390 / 414 / 640 / 768 / 1280 before and after. The narrow widths prove
the fix; **768 and 1280 prove the desktop layout did not move** — same table width,
same five column widths, same median row height, same document height. A diff that
only adds `md:`-guarded rules should produce identical numbers there, and if it
does not, something leaked.

## Risks / Trade-offs

- **A rule leaks above `md` and the desktop layout moves.** → Every rule this
  change adds is either inside a `md:`-guarded utility or inside the one
  `@media (width >= 48rem)` block above. The 768/1280 measurement is the check,
  and it is a task, not a suggestion.
- **The crafted sort control is genuinely absent below `md`.** → The crafted
  filter in the control bar answers the same question there, and a sort chosen at
  a wide width survives the resize because the setting is persisted and the table
  keeps sorting by it. `runeword-browsing` gets a delta saying so rather than
  quietly contradicting its "each of the table's five column headers" wording.
- **A keyboard user at a narrow width meets a control that is invisible until it
  is focused.** → It becomes visible on `:focus-visible`, which is the moment it
  matters. It may overlap the first characters of the runeword's name while
  focused, since the cell it lives in has no width; checked visually as a task,
  and nudged with an offset if it reads badly.
- **The rune names run together and stop being a recipe.** → The names form keeps
  the gap and the order and repeats a rune as many times as the sequence does; the
  check is `Infinity` reading `Ber Mal Ber Ist` at 390px, not a spot check on a
  two-rune word.
- **Two tests assert the classes being edited.** → `RunewordTable.test.tsx`
  (`md:table-fixed`, five `md:w-[…]`) and `RuneSequence.test.tsx` (`md:hidden`)
  are updated with the change, and gain assertions for the new narrow forms rather
  than losing the old ones.
- **Stale `dist/`.** The committed build shows unguarded `:hover`, which reads as
  a defect this change should fix. It is not: Tailwind 4.3.3 wraps `hover:` in
  `@media (hover: hover)` itself. Nothing to do; recorded so it is not
  rediscovered as a bug.

## Open Questions

1. **The short heading's wording, in both locales.** English `Lvl` is the
   reference's own choice; Russian needs the game's own abbreviation if it has
   one, and `ui-strings` forbids inventing it — the same rule that made the
   off-hand slot name project copy and say so.
2. **The Label-in-Name trade-off in decision 5.** Accept it, or name the control
   after what is on screen at that width?
3. **Whether the usefulness badge keeps its own line below `md`.** It costs about
   20px per row — roughly 2 000px of document — and it is the one remaining
   difference between our 65px row and the reference's 51px. Out of scope unless
   the owner wants it in.
