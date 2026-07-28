## Why

Four defects in what `runeword-table` shipped, all found by reviewing the
deployed page against the reference after the change was archived. None is a new
feature; each is the table failing to do what it was supposed to already.

1. **The detail view opens on click only.** The reference opens it on hover —
   confirmed by dispatching pointer events with no click and watching the panel
   appear. Hover is the behaviour the project is copying, and we shipped the
   wrong one.
2. **Every patch badge renders the same brown.** `src/index.css` declares one
   `--color-patch`, so `3.0` and `1.10` are indistinguishable. The reference
   colour-codes them, which is the only thing that makes the badge worth reading
   at a glance.
3. **The rune column is unreadable.** Rows draw 24px icons with no names. At that
   size the artwork is a row of small grey shapes; a reader who does not already
   know the runes by silhouette learns nothing from the column that is supposed
   to carry the recipe.
4. **A base category and its restriction render as one grey run of text.** The
   reference sets the restriction apart — a warmer tan, on its own line. Ours
   reads `Staves (Not Orbs/Wands)` in a single colour, so the exclusion that
   changes which item you go looking for has no more weight than the category it
   qualifies. Fifteen of the 99 carry one.

## What Changes

### The detail view opens on hover, focus or click

- Compose **`useHover` (with a delay and `safePolygon`), `useFocus`, `useClick`
  and `useDismiss`** on one panel — hover for pointer devices, focus for the
  keyboard, tap for touch. Three triggers, one panel.
- **Hover does not become the only trigger.** Touch devices have no hover at all,
  so click stays; the keyboard path stays exactly as `runeword-table` verified it:
  Space opens, Escape closes, focus returns to the name.
- **Focus containment becomes conditional on how the panel opened.** Trapped when
  opened deliberately — by click or by keyboard focus — and not trapped when
  opened by hover. A trap that engaged on hover would seize the keyboard as the
  pointer swept down 99 rows, which is not what the existing requirement was
  protecting.
- Replace the native `<dialog>` with a floating panel. This gives up
  `showModal()`'s free focus trap, Escape and focus restoration;
  `FloatingFocusManager` and `useDismiss` supply all three, and a modal dialog was
  never the right element for something that opens on hover.
- **Add `@floating-ui/react`.** This reverses `runeword-table`'s task 9.1
  decision to add no dependency — see below.

### Patch badges are colour-coded, and all three badges match the reference

- Replace the single `--color-patch` with **four tokens**, taken from the
  reference's own stylesheet: `1.10` and `1.11` share one colour deliberately, as
  one classic era, and `2.4`, `2.6` and `3.0` get their own. Four and not five,
  because the dataset holds exactly those five values — 46 records at `1.10`,
  seven each at `1.11`, `2.4`, `2.6` and `3.0`, and 25 with no patch at all.
- **The patch-to-token mapping is an explicit literal record.** Not
  `` `patch-${patch.replace(".", "-")}` ``: a class name assembled at runtime is
  invisible to Tailwind's build-time scan and gets stripped silently, leaving an
  unstyled badge that looks like a styling bug rather than a missing entry. An
  unrecognised future patch value renders with no colour class, on purpose.
- **Correct the other two badges to the reference**, which an audit found differ
  in eight ways. The `L` badge's background and text already match exactly; its
  round shape and all three badges' padding do not. `Note!` currently borrows the
  shared danger red rather than the reference's own darker red.
- **This is adopted verbatim, WCAG contrast included.** The reference's black
  badge text scores 2.0:1 on the `1.10`/`1.11` brown and 3.7:1 on the `3.0`
  purple; both fail WCAG AA, and the current gold-on-brown scores 4.9:1 and
  passes. Matching the reference is the decision, taken with the numbers in hand.
  Recorded here so it reads as a choice rather than an oversight.

### Rune icons in rows get their names, at native size

- Each rune in a row becomes **an icon with its name directly beneath it**, as the
  reference draws them and as our own detail view already does.
- **40px, the sprite's native cell size.** Rows grow from 41px to 75px and the
  table from roughly 4060px of rows to 7430px — 1.83× the scroll, accepted for a
  column that can actually be read.
- Rune names come **from the dataset**, not the strings layer: they are canonical
  identifiers, and `ui-strings` already forbids the layer holding dataset values.
- The icon becomes **decorative once its name is visible**, so a screen reader
  reads each rune once rather than twice.
- Dataset order and repeats are untouched — `Infinity` is still `Ber Mal Ber Ist`
  with `Ber` drawn twice — and the runes column still collapses under the name
  below `md`, with the sequence perceivable exactly once on each side.

### The item-type restriction is set apart from its categories

- The restriction moves to **its own line beneath the categories**, in a warmer
  tan, at `0.9em` against the categories' 13px — the reference's own values. The
  categories themselves take the muted grey the reference gives them, replacing
  the inherited body colour they render in today.
- **Add one token, named for the role.** The reference's class is
  `rw-ItemTypes-class`, which is a misnomer — the field covers class restrictions
  like `(Assassin)` and item exclusions like `(Not Orbs/Wands)` alike — so the
  name is not copied.
- **Worth reporting rather than fixing:** both reference values are already in our
  palette under generic names. `--color-muted` is exactly the `#74706C` the
  categories want, and the role genuinely is "muted", so it is reused rather than
  duplicated. `--color-accent` is exactly the `#BD8547` the restriction wants —
  but "accent" names no role, and it is already spoken for as the detail view's
  note colour, so the restriction gets its own token rather than borrowing it.
  That `--color-accent` is itself poorly named by the theme's own role-naming rule
  is noted and left alone; renaming it is not this change's business.
- `itemTypesLabel` returns a string today and cannot carry two colours, so it
  becomes a component. The parentheses stay in the strings layer — punctuation is
  copy — and the restriction text stays dataset content.

Explicitly **not** in this change:

- **Sorting, filtering and searching.** Still `search-sort-filter`.
- **Changing what the detail view contains.** Same record, same property lines,
  same derived socket count; only how it opens and what element it is.
- **A tooltip library for the badges.** Their `title` attributes stay as they are.
- **Enlarging the detail view's rune icons.** 40px is the sprite's native cell and
  rendering above it upscales and softens the artwork.
- **Fixing the reference's contrast.** Decided against above, deliberately.

## Capabilities

### New Capabilities

None. Every change here is a correction to behaviour an existing capability
already claims.

### Modified Capabilities

- `runeword-table`: six requirement-level deltas. _Runeword detail view_ gains
  hover and focus as triggers alongside the click it already had. _Detail view
  dismissal and focus_ makes containment conditional on how the panel opened.
  _Availability badges_ gains the patch colour-coding — and has to narrow its
  "no logic reads an availability field" prohibition, which as written forbids
  the very branch that picks a badge colour. _Dataset columns_ gains the visible
  rune names and stops requiring the icon itself to carry the accessible label.
  _Rune icon size is set by the use site_ is **removed and replaced**: it requires
  a row icon to be strictly smaller than the detail view's, and at native 40px
  both are the same size. _Item categories render with their restriction_ says the
  restriction renders "alongside" the categories; it now renders beneath them, in
  its own colour.
- `d2-theme`: _Named colour tokens_ replaces `--color-patch` with the four patch
  tokens, and adds the note badge's own red and the item-type restriction's tan,
  so neither the badge component nor the item-types component holds a literal
  colour.
- `build-toolchain`: _Declared utility dependencies are usable_ enumerates the
  four runtime utilities by name. `@floating-ui/react` becomes the fifth.

## Impact

- **New**: `src/components/RunewordDetails.tsx` — the name button and its floating
  panel, which must share one floating context and therefore one component;
  `src/runewords/patch-colour.ts` and its test — the explicit patch-to-class
  record; `src/components/ItemTypes.tsx` and its test — the two-colour, two-line
  replacement for `itemTypesLabel`; `src/components/RuneSequence.tsx` and its test
  — the labelled sequence, lifted out of `RunewordRow` now that it is more than a
  row of icons.
- **Modified**: `src/components/RunewordDialog.tsx` (becomes the panel body, no
  longer a `<dialog>`) and its test; `src/components/RunewordRow.tsx` (rune labels,
  and the name cell delegates to `RunewordDetails`);
  `src/components/RunewordTable.tsx` (loses the shared `selected` state and the
  single dialog); `src/components/RuneIcon.tsx` (an option to render decoratively);
  `src/components/AvailabilityBadges.tsx` (patch colours, geometry);
  `src/runewords/format.ts` (`itemTypesLabel` gives way to the component);
  `src/i18n/en.ts` (the restriction's parentheses become their own entry);
  `src/index.css` (six tokens replace one); `src/test/dependencies.test.ts`;
  `docs/CODE_RULES.md` (the runtime dependency list); `IDEAS.md`.
- **Dependencies**: **`@floating-ui/react` is added**, reversing
  `runeword-table`'s explicit decision to add none. The reason that decision no
  longer holds: a panel of up to 26 property lines has to flip above the pointer
  for rows near the bottom of 99 and shift inward at the viewport edges, and
  `safePolygon` is what stops it closing as the pointer travels toward it.
  Hand-rolled positioning is precisely where this breaks, and it breaks at the
  bottom of the page where it is least likely to be noticed in review. The old
  decision was correct for a click-opened modal `<dialog>`; it is not correct for
  a hover-opened panel.
- **Bundle**: the first runtime dependency added since the dataset. Expect
  something in the region of 10–15 kB gzipped on top of the current 90 kB —
  to be measured, not assumed, and reported in the tasks.
- **Risk worth naming — 99 floating instances.** `useHover` binds to one reference
  element by design, so each row owns its floating context rather than the table
  sharing one. Only the open panel is ever in the document, so the "no per-row
  detail markup" guarantee survives, but 99 rows each holding `useFloating` plus
  four interaction hooks is real per-render cost that the single shared `<dialog>`
  did not have. The alternative — one instance driven by a virtual reference —
  means hand-rolling hover tracking across 99 buttons, which is the thing the
  dependency was added to avoid.
- **Risk worth naming — the rune markup doubles again.** The responsive collapse
  already renders each sequence twice, one copy hidden. Each copy now carries a
  label as well as an icon, so the table's rune markup roughly doubles in nodes on
  top of the duplication that already exists.
- **Risk worth naming — badge contrast.** Two of the four patch colours will carry
  text below WCAG AA, by explicit decision. If the badges later need to be
  readable rather than faithful, the fix is a foreground per token and nothing
  else changes.
- **Recorded for Phase 2, not solved here**: the restriction strings are dataset
  content in English — `(Assassin)`, `(Barbarian)`, `(Not Orbs/Wands)` — so
  `russian-locale` has to source their Russian equivalents from the game client
  like every other dataset value. Giving them their own colour and their own line
  makes them visibly their own field, which is what makes the omission easy to
  miss until late. Noted in `IDEAS.md` so it is found early instead.
- **Untouched**: `vendor/`, the dataset and its schema, the deployment workflow,
  `crafted-tracking`, `progress-persistence`, `ui-strings`,
  `static-site-deployment`, `continuous-integration`, `code-quality-gates`.
