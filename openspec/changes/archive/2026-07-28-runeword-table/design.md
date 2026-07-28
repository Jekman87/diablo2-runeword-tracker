## Context

The dataset is validated and complete, the theme is in place, and `src/App.tsx`
still renders the theme's acceptance surface rather than the product. See
[`proposal.md`](proposal.md) for why the table is the next thing and why it drags
an i18n layer in with it.

Eight facts shape this design. All eight were measured against the committed data
or read from the source, not assumed:

- **Twenty-three required levels are shared, and the largest group holds ten
  runewords.** Levels span 13 to 69. So "sort by required level" is not by itself
  a total order — without a tiebreak, ten rows would sit in whatever order the
  sort happened to leave them, and the answer to "where is Fortitude" would change
  between renders.
- **The dataset's own order is patch-grouped chronological**, which is the
  reference's storage order and means nothing to a player deciding what to craft
  next.
- **There are 975 property lines across the 99 runewords**, and 66 of them contain
  no digit at all. `Fortitude` has the most at 26.
- **The vendored property source is plain text with no markup.**
  `vendor/runewizard/data/runewords-descriptions.ts` holds template literals of
  bare lines; the reference's brighter `.is-mod` numbers are produced by its own
  Vue rendering, which we did not vendor. So the emphasis has to be derived here or
  not exist.
- **290 distinct numeric tokens appear across those lines**, in shapes including
  `+50%`, `43%`, `3-14`, `+8-15%`, `-25%`, `21-110`, `+200` and bare `3`. Ranges
  use a hyphen, and a hyphen also appears as a standalone separator inside
  `Adds 3-14 Cold Damage - Cold Duration 3 Seconds`.
- **Fifteen runewords carry a restriction** — `Not Orbs/Wands` plus the seven
  class names — and 32 name more than one item category, up to three. The
  restriction is stored bare by requirement, with the punctuation left to
  presentation.
- **One runeword carries a note** (`Mosaic`), nine are ladder-only, and the patch
  field takes one of `1.10`, `1.11`, `2.4`, `2.6`, `3.0` or nothing.
- **There is no i18n layer**, and `docs/CODE_RULES.md` already forbids display
  literals in components and points at `AGENTS.md` for a layer that does not exist.

## Goals / Non-Goals

**Goals:**

- All 99 runewords readable on one page, in an order a player can act on.
- Native table semantics, so the 99 rows are navigable by row and column and so
  `search-sort-filter` inherits real `<th>` elements to make interactive.
- Every fact reachable without a pointer. Nothing important lives only in a hover.
- A property line that renders exactly the characters the dataset holds, whatever
  the emphasis does to it.
- One seam for display copy, so Phase 2 edits one file rather than every component.
- Zero new dependencies.

**Non-Goals:**

- Sorting, searching, filtering, and the item-type-to-slot mapping the filter
  needs.
- Crafted state in any form — no column, no toggle, no persistence, no progress
  bar.
- The remaining-runes and remaining-bases panels.
- The site header's patch line and its Help, Feedback and Update Notes links.
- A sticky table header. It earns its keep once the header row is interactive, so
  it belongs to the change that makes it interactive.
- Row-movement animation (Phase 4).
- Windowing or virtualisation.
- Any locale but English.

## Decisions

### A real `<table>`, not a grid of `<div>`s with ARIA roles

Ninety-nine rows of four columns is tabular data, and this is where the semantics
pay: row-and-column navigation, header association, and `<th scope="col">`
elements that `search-sort-filter` can turn into sort controls without inventing
`aria-sort` on something that is not a column header.

_Alternative considered:_ CSS grid with `role="table"`. Its one advantage is that
content can reflow between breakpoints, which is exactly the problem the runes
column has below. Rejected anyway: re-implementing table semantics on divs means
owning them, and the reflow problem has a cheaper answer than giving up the
element. The reference is a `<table>` too, and its responsive collapse works.

### Default order is a tested pure comparator, not a data property

`byRequiredLevel` compares required level ascending and falls back to name.
Twenty-three levels are shared and the largest group holds ten runewords, so
without the tiebreak the position of a row is a property of the sort
implementation rather than of the data. With it, the order is total and the same
dataset renders identically every time — which is also what makes the order
testable at all.

It lives in a plain module and is applied once, at module scope, over the static
dataset. The dataset does not change at runtime; sorting it inside a component
would re-sort 99 records on every render for no reason, and `useMemo` to avoid
that would be ceremony around a constant.

Setting the initial order here is deliberately not the same as owning sorting.
There is no interaction, no state and no `aria-sort`; `search-sort-filter`
replaces the constant with state and this comparator becomes its default.

_Alternative considered:_ render in the dataset's stored order and let
`search-sort-filter` introduce ordering later. Rejected: it ships a table in
patch-grouped order that nobody asked for, and `IDEAS.md` already settled level
ascending as the default. Deferring it would mean deliberately shipping the wrong
order for one change.

### The runes column collapses by rendering twice, in CSS

A row contains two presentations of its rune sequence: one as the runes `<td>`,
hidden below `md`, and one inside the name cell, hidden at `md` and above. The
`<th>` for the column collapses with it.

CSS cannot move content between table cells, so something has to give. The
options were:

- **Render both, hide one per breakpoint.** Chosen. The hidden copy is
  `display: none`, so it is out of the accessibility tree as well as invisible,
  and exactly one sequence is perceivable at any width. Cost: at most 686 icon
  spans in the document instead of 343, half of them not rendered. Against 99 rows
  of table markup that is not the expensive part of the page.
- **A `useMediaQuery` hook driving one copy.** Rejected. It makes layout depend on
  JavaScript having run and on a resize listener staying correct, to save DOM nodes
  on a page whose data is already in the bundle. It also introduces a state
  transition — and therefore a flash — where CSS has none.
- **Abandon `<table>` for grid.** Rejected above, for semantics.

The duplication is the one thing in this change that a reader will look at twice,
so it is called out in the component rather than left to be discovered.

### The detail view is a native `<dialog>`, opened with `showModal()`

One dialog instance for the whole table, driven by state holding the selected
runeword. `showModal()` supplies the focus trap, Escape to close, `::backdrop` for
the dim, inert content behind, and focus restored to the invoking button — all of
which we would otherwise write and test ourselves. Backdrop click-to-dismiss is
the one thing it does not give, and it is three lines against the dialog's own
bounding box.

_Alternatives considered:_

- **The Popover API (`popover="auto"`).** Attractive: light dismiss with no
  script at all. Rejected because it neither traps focus nor blocks the page
  behind, and 26 property lines is a panel to read rather than a tooltip to
  glance at. Its browser support is also newer than `<dialog>`'s for no gain here.
- **Ninety-nine dialogs, one per row.** Rejected: 99 hidden panels holding 975
  property lines in the document, so that a page whose entire content is 99 rows
  carries ten times that in markup nobody is looking at.
- **A hand-rolled overlay.** Rejected. Focus trapping, Escape handling and focus
  restoration are exactly the things a hand-rolled overlay gets subtly wrong, and
  the platform already ships them.

The runeword's name is a real `<button>` inside the cell, not a click handler on
the cell. That is what makes it focusable and operable by Space and Enter, and it
is also the seam `crafted-tracking` needs: when the whole row becomes a toggle,
the name has to be a nested control whose activation does not also toggle the row.

### Property values are emphasised by `split` on a capturing group, never by rewriting

The line is split with a regular expression wrapped in a capture group, so the
returned array alternates plain fragments with the matched values. Concatenating
the array reproduces the input **by construction** — `String.prototype.split` with
a capture group cannot drop, reorder or rewrite a character, because it never
builds a new string.

That property is the whole reason for the choice. The obvious implementations —
`replace` with markup, or walking match indices by hand — both produce a new
string, and both can silently lose a leading `-`. `-33% Extra Gold From Monsters`
rendered as `33% Extra Gold From Monsters` is not a visual bug; it is a bonus
where the game gives a penalty, and it looks entirely correct. So the spec
requires the round-trip and the test asserts it over all 975 lines rather than a
sample.

The pattern matches an optional sign, digits, an optional decimal part, an
optional hyphenated upper bound and an optional percent sign. Two facts from the
data shaped it: ranges are hyphenated (`3-14`, `+8-15%`, `21-110`), and a hyphen
also occurs as a plain separator (`Cold Damage - Cold Duration`), which the
pattern must not treat as a range — requiring digits immediately after the sign is
what separates the two. Sixty-six lines contain no digit at all and must survive
as a single fragment.

_Alternative considered:_ skip the emphasis entirely and render each line in one
colour. Genuinely tempting — it is the zero-risk option, and the in-game property
colour is uniform, so the two-tone treatment is the reference's invention rather
than the game's. Rejected because the theme already declares
`--color-property-value` for precisely this, read from the reference's `.is-mod`
rule, and because the round-trip requirement removes the risk that made skipping
attractive. If the derivation ever cannot satisfy the round-trip, the correct
response is to drop the emphasis, not to loosen the requirement.

### Badges tell the truth to everyone, and repeat themselves in the detail view

Each badge renders its short marker visually — `L`, `2.6`, `Note!` — carries the
full meaning as its accessible name, and carries a `title` for pointer users.

That still leaves a touch user with no hover and no screen reader, so the detail
view restates patch, ladder status and the note in full words. This is why it is a
requirement rather than a nicety: the reference puts `Mosaic`'s caveat — that a
nominally ladder-only runeword is currently impossible on ladder and possible only
offline — behind a hover, which is the single most actionable sentence in the
dataset and the one a phone cannot read.

The three fields stay decoration. `runeword-dataset` requires that no filter,
counter or branch reads them, and the default order is by level and name, so this
change has nothing that could.

_Alternative considered:_ a styled custom tooltip with `aria-describedby`,
positioned on hover and focus. Rejected for now: it is a component with
positioning, dismissal and collision behaviour of its own, and the detail view
already gives every fact a pointerless path. If the interface later needs real
tooltips, it gets them as their own change.

### Item categories are text, and the presentation supplies the parentheses

`itemTypes.join(", ")` followed by the restriction in parentheses when present.
Thirty-two runewords name more than one category and fifteen carry a restriction,
so both branches are exercised by real data rather than being defensive.

The dataset stores `Not Orbs/Wands`, not `(Not Orbs/Wands)`, by requirement — this
is the change that consumes that decision, and it is worth noting that the
requirement paid off: the parentheses are a rendering choice, and the detail view
is free to present the same restriction differently.

The categories are not links. Four of the twenty have no reference URL, so a
linked cell would be inconsistent by construction, and 99 rows of external links
is noise in the column a reader scans. See Open Questions.

### `rune-bg2.gif` is not adopted

`d2-theme` explicitly left this for the table change to settle: the reference
paints a tile behind its rune cells.

The answer is no. In the reference that tile is the background of an **inventory
stash** — a grid of clickable cells the player toggles — and the tile is what makes
a cell look like a slot. We track no rune inventory, so our rune icons are an
inert sequence rather than slots, and a slot background would suggest they can be
clicked. It would also be a fourth borrowed asset and another request, to make
something look interactive that is not.

### Row separation is a hairline, not zebra striping

Rows are separated by a one-pixel line, with a hover state to hold the eye across
four columns and 99 rows. Alternating row backgrounds on pure black either
disappear or turn muddy, and the reference does not stripe either.

The hover state is also the affordance `crafted-tracking` will make real, which is
a reason to define it here and not to invent a second one there.

### Four tokens are added, valued from the palette rather than from new hues

`--color-row-line`, `--color-row-hover`, `--color-panel` and `--color-backdrop`.
Each is named for the surface it styles, per the theme's role-naming rule, and
each takes its value from the existing palette family rather than introducing a
colour — the muted family for the line and the hover, the blood family for the
panel, and black with alpha for the backdrop.

They have to be tokens rather than literals because `d2-theme` forbids a component
carrying a colour value, and they could not have been declared in `d2-theme`
because it equally forbids declaring a token for a surface no component renders.
The theme change said so in as many words. So the scope sentence in _Named colour
tokens_ has to move for this change to be legal at all, which is why the delta
spec exists and why it also states the general rule: the change that renders a new
surface adds its token.

### The i18n layer is one record and one hook

`src/i18n/en.ts` holds a nested object of English strings. `src/i18n/index.ts`
exports a `useStrings()` hook and a `Strings` type derived from the English record,
so any second locale is typed against it and a missing key is a `tsc` failure
rather than an English word surfacing in a Russian interface.

Today the hook returns the English record unconditionally. That is the point:

- **A hook rather than a direct import**, because Phase 2 adds a language switch,
  and switching has to re-render the components that display copy. With a direct
  import, `russian-locale` edits every component that renders text. With the hook,
  it edits one file. The hook is about five lines; the alternative is a rewrite
  spread across a feature change.
- **No provider, no context, no persisted preference, no plural or gender
  machinery, no interpolation beyond what the interface renders, and no
  library.** None of it is called for yet, and unused mechanism is harder to
  remove than to add. The spec says so explicitly so that a later reader does not
  mistake the restraint for an oversight.

The boundary is that the layer holds only copy the project authors. Runeword
names, rune names, item categories, property lines, restrictions and notes are
dataset values and stay out of it — otherwise adding Russian would mean restating
99 records inside a strings file, and the canonical-identifier rule would have
nothing left to mean. A rune icon's accessible label is the rune's name for the
same reason.

_Alternative considered:_ hardcode English now and let `russian-locale` extract it.
Rejected: it violates a standing rule in `AGENTS.md` and `docs/CODE_RULES.md`, and
the extraction cost grows with every Phase 1 change that adds copy — four of them
are queued behind this one.

### The page shell stays what it is

`src/App.tsx` keeps its title and its divider and gains the table. It loses the
33-rune grid, which was `d2-theme`'s acceptance surface and is comprehensively
replaced by 343 rune icons in real rows.

No header is built. `IDEAS.md` lists a patch line and Help, Feedback and Update
Notes links in the Phase 1 layout, but no change in its list builds them, and
inventing a header inside the table change is how a change stops being one
feature. The gap is recorded in `IDEAS.md` instead, so the next proposal finds it.

## Risks / Trade-offs

- **A regex over game text can silently corrupt what the player reads** → A
  dropped sign inverts a property's meaning and still looks correct. Mitigated
  structurally rather than carefully: `split` on a capture group cannot rewrite the
  string, and the round-trip is asserted over all 975 lines. If it ever fails, the
  emphasis goes, not the assertion.
- **The runes markup exists twice per row** → Up to 686 icon spans, half of them
  `display: none`. Accepted because CSS cannot relocate a table cell's content and
  the alternative makes layout depend on script. Called out in the component so it
  reads as a decision.
- **Two nested click targets are coming** → The name is a button inside a row that
  `crafted-tracking` wants clickable. Left as a real `<button>` with its own
  accessible name so the later change has something to stop propagation on, and
  recorded in that change's direction rather than discovered by it.
- **`<dialog>` behaviour is the platform's, so the tests are partly jsdom's** →
  jsdom implements `showModal` but not layout, so backdrop geometry and the visual
  dim cannot be asserted there. Open, close, focus return and content are testable;
  the appearance is a browser check in the migration plan, as `d2-theme`'s sprite
  was.
- **99 rows render at once** → No windowing, deliberately. It is 99 rows of four
  cells; windowing would cost the table semantics chosen above and buy nothing
  measurable.
- **An i18n seam introduced one change before it is needed** → Judged worth it:
  four Phase 1 changes queue behind this one, each adding copy, and a rule already
  on the books forbids the alternative. Bounded by the spec to exactly one locale
  and no mechanism.
- **Emphasis is the reference's invention, not the game's** → In game a property
  line is a single colour. We follow the reference because the theme already
  declares the token for it and the visual language is what makes the page read as
  Diablo II. Named so it is not later mistaken for fidelity to the game.
- **Acceptance is partly visual again** → Rune icons at a smaller size, the
  collapse at the breakpoint, and the dialog's dim all need looking at. The
  migration plan makes each an explicit step rather than an assumption.

## Migration Plan

No runtime migration. Nothing is persisted, nothing is stored, and the dataset is
read-only, so there is no state to convert.

1. Add `src/i18n/en.ts`, `src/i18n/index.ts` and the hook's test. Populate keys as
   the components below need them, not speculatively.
2. Add the four tokens to `src/index.css`.
3. Add the default comparator and its test. Confirm the test fails if the name
   tiebreak is removed — with ten runewords at one level, it should.
4. Add the property-line component and its test. Assert the round-trip across all
   975 lines, then verify the test bites: make the pattern consume its match and
   confirm the round-trip fails and names the line.
5. Add the badges, the row, the table and the dialog. Wire the name button to the
   single dialog instance.
6. Replace the rune grid in `src/App.tsx` with the table.
7. Run the full local gate — `pnpm typecheck`, `pnpm lint`, `pnpm format:check`,
   `pnpm test`, `pnpm build`.
8. **Look at it.** `pnpm dev`, then: rune icons legible at row size, the collapse
   crossing the `md` breakpoint in both directions with the sequence appearing
   exactly once on each side, a badge tooltip, the dialog for `Fortitude` (26
   property lines) and for `Mosaic` (all three badges and the note), Escape and
   backdrop dismissal, and focus landing back on the name.
9. Check the keyboard path with no pointer at all: Tab to a name, Space to open,
   Tab within the dialog, Escape to close.

**Rollback:** revert the commit. The only pre-existing files touched are
`src/App.tsx`, its test, `src/index.css` and two documents; everything else is new
and nothing else imports it.

## Open Questions

None blocking. Four left open deliberately, three of them with an owner:

- **Whether item categories should link to their reference URL.** Four of twenty
  have none, so any linking is partial. The detail view is the better home if it
  is wanted at all, and this change leaves the field unread. Whoever wants it
  proposes it; nothing here forecloses it.
- **Where the site header lives.** The patch line and the Help, Feedback and
  Update Notes links are in `IDEAS.md`'s Phase 1 layout and in no change. Recorded
  in `IDEAS.md` by this change so the next proposal picks it up.
- **How `crafted-tracking` reconciles a clickable row with the name button.** The
  markup this change ships is the constraint it inherits: a nested button that must
  not toggle the row. Its change decides how.
- **Whether the table header becomes sticky.** It matters most once the headers are
  sort controls, so `search-sort-filter` decides.
