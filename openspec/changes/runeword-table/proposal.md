## Why

The dataset and the theme are both in place, and nothing renders either of them.
`src/App.tsx` is still the theme's acceptance surface — 33 rune icons in an 11×3
grid — so the deployed site shows the sprite working and not one runeword. This
change is the first that puts the product on screen: all 99 runewords, readable,
with their runes, bases, level and granted properties.

It also has to answer a question every later Phase 1 change inherits. This is the
first change with **user-facing copy** in it — column headers, badge labels, the
popover's headings — and both [`AGENTS.md`](../../../AGENTS.md) and
[`docs/CODE_RULES.md`](../../../docs/CODE_RULES.md) forbid hardcoded display text
in components. There is no i18n layer yet to route it through, so either this
change creates the seam or four later changes each scatter English literals that
the Phase 2 translation has to hunt down.

## What Changes

- Render a **real `<table>`** of all 99 runewords with the four read-only columns
  the backlog settles: name, runes, item types, required level. Not a grid of
  `<div>`s with ARIA roles — this is tabular data with 99 rows, header-click
  sorting is already committed for `search-sort-filter`, and native table
  semantics give screen-reader row and column navigation that a re-implementation
  would owe.
- **No crafted-state column.** The toggle, its column and its sortability belong
  to `crafted-tracking`. This change is read-only.
- Render the table in the **default order the backlog already settles** —
  required level ascending — rather than the dataset's patch-grouped order.
  Choosing the initial order is not the same as building sorting: there is no
  interaction here, and `search-sort-filter` replaces the fixed order with state.
  Name breaks ties, so the order is total and the rendering deterministic.
- Item types read as their category list with the restriction in parentheses —
  `Staves (Not Orbs/Wands)`, `Body Armors (Barbarian)`. The dataset stores the
  restriction bare, by requirement; **this change is where the punctuation it
  deferred to the presentation layer actually gets added.** Thirty-two of the 99
  name more than one category.
- Badges beside the name for the three decoration-only fields: the patch that
  introduced the runeword, an `L` for ladder-only, and `Note!` where a caveat
  exists. No filter, counter or branch reads them — that constraint is already a
  requirement of `runeword-dataset` and this change is its first opportunity to
  be violated.
- **Nothing is hover-only.** The reference puts the badge meanings in tooltips,
  which a touch user cannot reach and a keyboard user cannot focus. Each badge
  carries its full text for assistive technology as well as a pointer tooltip,
  **and** the popover repeats patch, ladder status and note in full, so every fact
  a badge encodes has a path that does not require a pointer.
- Clicking a runeword's name opens a **detail popover** built on the native
  `<dialog>` element: the name, the rune sequence with labels, the derived socket
  count, the item types, and the granted properties in the property green. One
  dialog instance for the whole table, not 99 in the document.
- Within each property line, **numeric values are picked out in the brighter
  `property-value`** the theme already declares for exactly that. The reference
  does this from markup we do not have — the vendored source is plain text — so we
  derive it, and the derivation is held to reproducing the original line
  character for character when the fragments are concatenated. A decoration that
  can silently drop a `-` from `-25% Target Defense` is worse than no decoration.
- The **runes column collapses below `md`** and the sequence renders inline under
  the name instead, as the reference does. Rune icons in a row are drawn at a
  smaller `--rune-size` than in the popover, which is the first real exercise of
  the theme's single-size-value requirement.
- Add a **minimal i18n layer**: one English string record and a `useStrings()`
  hook that components read. No library, no provider, no locale switch — Phase 2's
  `russian-locale` adds the second record and wires the hook to state. The hook
  rather than a direct import is the whole point: it makes Phase 2 a change to one
  file instead of a change to every component.
- Extend the theme's token set to the **popover surface and the table's row
  separation**, which `d2-theme` deliberately left undefined because no component
  needed them yet. This change is that component.
- Replace `src/App.tsx`'s rune-grid acceptance surface with the actual page: the
  title, the divider, the table. The 343 rune icons the table renders are a
  strictly better visual check on the sprite than the 33-icon grid they replace.

Explicitly **not** in this change:

- Sorting, searching and filtering. Header-click sorting, the name and item-type
  search, and the slot filter are `search-sort-filter`, which also owes the
  item-type-to-slot mapping this change does not need.
- The crafted toggle, `localStorage`, the progress bar and the undo toast.
- The two remaining-* panels.
- The site header's patch line and its Help, Feedback and Update Notes links.
  Nothing in the backlog's change list builds a header; this change keeps the page
  shell to the title and divider it already has and does not invent one.
- Row-movement animation, which `IDEAS.md` places in Phase 4.
- Row virtualisation. Ninety-nine rows is not a windowing problem, and windowing
  would break the native table semantics chosen above.
- Linking item types to their reference URL. Four of the twenty categories have
  none, and a table cell of external links is noise. See Open Questions in
  [`design.md`](design.md).
- Any second locale's strings. The layer is created; only English is populated.

## Capabilities

### New Capabilities

- `runeword-table`: the read-only presentation of the dataset — the table's
  columns and their content, the default row order, how item-type restrictions
  and availability badges render, the detail popover and what it contains, how a
  property line's values are emphasised without altering the line, and the
  responsive collapse of the runes column.
- `ui-strings`: the display-copy contract — that every user-facing string
  resolves through one layer rather than being written into a component, that
  canonical runeword and rune names are identifiers and not display copy, and
  that adding a second locale does not require editing the components that read
  the first.

### Modified Capabilities

- `d2-theme`: the requirement _Named colour tokens_ bounds the token set to the
  surfaces `IDEAS.md` had already settled and states outright that nothing is
  added "for the popover, the toast or the panels, where no decision exists to
  encode yet". This change makes the decision for the popover and for the table's
  row separation, so the scope sentence has to admit them — otherwise the change
  either violates the requirement it depends on or hardcodes the colours the
  requirement exists to prevent.

## Impact

- **New**: `src/components/RunewordTable.tsx` and its test;
  `src/components/RunewordRow.tsx`; `src/components/RunewordDialog.tsx` and its
  test; `src/components/AvailabilityBadges.tsx`;
  `src/components/PropertyLine.tsx` and its test;
  `src/runewords/order.ts` (the default comparator) and its test;
  `src/i18n/en.ts`, `src/i18n/index.ts` and its test.
- **Modified**: `src/App.tsx` (the rune grid gives way to the page);
  `src/App.test.tsx`; `src/index.css` (the popover and row tokens, and any
  table-specific utility); `IDEAS.md` (the Planned changes row, plus a note that
  the header still has no change that builds it);
  [`docs/CODE_RULES.md`](../../../docs/CODE_RULES.md) (the i18n layer it already
  points at now exists and has a location).
- **Dependencies**: none added. `clsx` and `class-variance-authority` are already
  present and are what the badges and the row variants use; the dialog is a
  platform element. A headless-UI or table library would be the obvious thing to
  reach for and neither earns its place at four columns and no interaction.
- **Bundle**: JavaScript only, no new assets. The 99 rows render from data already
  in the bundle.
- **Reads, never writes, the dataset.** `src/data/` and its schema are untouched.
  Socket count is derived in the popover from `runes.length`, which is the rule
  the dataset's requirement states and the first place it is exercised.
- **Risk worth naming**: the property-value emphasis is a regex over game text.
  Applied wrongly it silently corrupts what the player reads — a dropped minus
  sign turns a penalty into a bonus. The mitigation is a spec-level requirement
  that the rendered fragments concatenate back to the source line exactly, tested
  across every property line in the dataset rather than a sample.
- **Risk worth naming**: `crafted-tracking` wants the whole row clickable while
  this change makes the name a button inside it. Two nested click targets with
  different effects is a real collision, so the name stays a real `<button>` with
  its own accessible label and the row-level handler that arrives later must not
  fire for clicks on it. Recorded now, because the change that hits it will be
  reading this one's markup.
- **Risk worth naming**: the runes column is rendered twice — once as its own cell
  for wide viewports, once inside the name cell for narrow ones — because CSS
  cannot move content between table cells. At most 686 icon spans exist with half
  of them `display: none`, which is cheap, but it is duplication and the
  alternative (a JavaScript media-query hook driving one copy) trades it for
  layout that depends on script. Named so the choice is visible rather than
  discovered.
- **Untouched**: `vendor/`, the data generator, the deployment workflow, the
  quality gate. No spec of `runeword-dataset`, `build-toolchain`,
  `static-site-deployment`, `continuous-integration` or `code-quality-gates`
  changes.
