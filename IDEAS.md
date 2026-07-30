# Ideas & Backlog

Raw idea dump from the project owner, grouped and sliced into phases.
Input for OpenSpec change proposals. Nothing here is binding until it lands
in `openspec/specs/`.

Reference site analysis: [`docs/REFERENCE.md`](docs/REFERENCE.md)
Runeword data extract: [`docs/runewords-raw.md`](docs/runewords-raw.md)

---

## Product in one sentence

A single-page site that tracks which Diablo II: Resurrected runewords the
player has already crafted, so they can complete the runeword section of the
in-game Chronicle log, and that tells them which runes and which socketed
bases they still need.

---

## Decided

- Repository and project name: **`diablo2-runeword-tracker`**
- React + TypeScript, Vite, Tailwind CSS, ESLint, Prettier
- Progress and view settings stored in `localStorage`
- Deployed to GitHub Pages under the personal account `Jekman87` — live at
  <https://jekman87.github.io/diablo2-runeword-tracker/>, published by GitHub
  Actions on every push to `main` that clears the quality gate
- Phase 1 ships English only; Russian in Phase 2
- Visual style reads as Diablo II: black background, dark red table header,
  tan small-caps rune text, green property text, serif display font, custom
  cursor, ornamental divider
- **Rune inventory is out of scope.** The reference site is built around
  "which runes do I own"; we deliberately do not track that. It may never be
  added. Nothing in the data model needs to reserve space for it.
- Sorting is done by clicking column headers, as on the reference site
- Search covers runeword name and item type. **Rune search is dropped** —
  on the reference the rune relationship is expressed by highlighting driven
  by the inventory, and without an inventory a tracker does not need it.
- Borrowed from the reference, which is MIT licensed and therefore reusable
  with attribution: the serif font, the black theme, the custom cursor, the
  rune sprite, and the property-list styling. Everything else — table layout,
  panels, controls — is ours, as long as it still reads as Diablo II.

---

## Planned changes

The phases below describe _what_ to build. This is the sequence of OpenSpec
changes that builds it. Change names are ours, not an OpenSpec convention —
they are just kebab-case folder names. Capability names, which accumulate in
`openspec/specs/`, are a separate namespace.

The order is dependency order, not preference. Each change should end with the
site still deployable.

| #   | Change                | Status |
| --- | --------------------- | ------ |
| 1   | `project-scaffolding` | done   |
| 2   | `deploy-github-pages` | done   |
| 3   | `runeword-dataset`    | done   |
| 4   | `d2-theme`            | done   |
| 5   | `runeword-table`      | done   |
| 6   | `crafted-tracking`    | done   |
| 6a  | `detail-view-hover`   | done   |
| 7   | `search-sort-filter`  | done   |
| 8   | `remaining-panels`    | done   |
| 9   | `property-groups`     | done   |
| 10  | `site-header`         | next   |

`detail-view-hover` is numbered `6a` because it is not a step in the sequence:
it corrects four defects in what `runeword-table` shipped, found by comparing the
deployed page against the reference. Kept in the table so the order changes
actually landed in is readable.

Changes 9 and 10 were missing from the original breakdown. Both were found by
`runeword-table` rather than planned, which is the sequence working as intended —
a change that renders the data is the first thing able to notice the data is
wrong, and a change that refuses to invent a feature is the thing that reveals
nobody owns it.

- **`property-groups`** — fixes the six `#### …` lines. Three runewords grant
  different properties per base type, and the vendored source expresses that with
  Markdown sub-headings the generator carried through verbatim. Model it as one
  uniform shape for all 99 records — a list of property groups, each with an
  optional `itemTypes` label — rather than an optional extra field, so the detail
  view has a single code path. **Gotcha:** the heading reads `#### Body Armor`
  singular while `itemTypes` holds `Body Armors` plural, so matching group labels
  to item types by string equality fails on `Fortitude`.
  Not urgent: nothing reads `properties` except the detail view, and the
  Chronicle counts a runeword once regardless of the base it went into, so no
  progress logic depends on this.

  Landed as sketched: `propertyGroups` replaced `properties` outright — 96
  records carry one unlabelled group, the three varying ones two labelled
  groups each. The singular/plural gotcha is resolved by an explicit
  `HEADING_CATEGORIES` mapping in the generator (`Body Armor` → `Body Armors`);
  an unknown heading, a heading outside the record's categories, or lines
  before the first heading all fail the build naming the runeword. The
  per-record invariants — a single group carries no label, several groups
  partition the record's `itemTypes` exactly — live in a schema `superRefine`,
  so a hand-edit that breaks them blanks the page pointing at the record.
  One count worth knowing: the dataset is now 969 property lines (975 minus
  the six headings), and the six headings were also digitless, so the
  emphasis test's digitless-line count dropped from 66 to 60.

- **`site-header`** — items 1 and 2 of the Phase 1 layout: the patch line, and
  the Help, Feedback and Update Notes links. Feedback points at the repository's
  GitHub Discussions, which has to be enabled in the repository settings first.

- **`d2-theme`** — Tailwind colour tokens (black ground, dark red table band,
  tan rune text, green property text), the Bellefair display font, the custom
  cursor, and the rune sprite moved out of `vendor/` into `src/assets`.
  Verifiable by rendering a single rune and getting the right icon. Theme lands
  before components so no component gets built and then repainted.

  Landed with the **ornamental divider** alongside the cursor, both vendored
  from the reference as new assets. Two things went differently from the sketch
  above: there are **no generated CSS offsets** — a rune's sprite cell is
  `(index % 11, ⌊index / 11⌋)` over its position in `runes.json`, derived at the
  use site, so no 33-rule stylesheet and no stored sprite index exist to drift
  (this also closes the question `runeword-dataset` left open). And the font is
  **self-hosted**, not loaded from Google Fonts as the reference does, so the
  page makes no third-party request. Bellefair has no Cyrillic subset, so Phase
  2's Russian text inherits a font question — see `docs/REFERENCE.md`.

- **`runeword-table`** — the table: columns, badges with tooltips, the
  properties popover, the responsive collapse of the runes column. Read-only.

  Landed with three things worth carrying forward. It **created the i18n layer**
  a change ahead of Phase 2 needing one, because it was the first change with
  user-facing copy in it and the code rules already forbade the alternative — one
  English record and a `useStrings()` hook in `src/i18n/`, no library and no
  switch, so `russian-locale` adds a second record rather than editing every
  component. It settled **`rune-bg2.gif` against adoption**, the question
  `d2-theme` left for it: in the reference that tile is the background of a
  clickable inventory slot, and our rune icons are an inert sequence, so the tile
  would advertise a click that does nothing. And nothing here is **hover-only** —
  each badge carries its full meaning as its accessible name as well as a
  tooltip, and the popover restates patch, ladder status and the note in full
  words, which is the path a phone takes.

  **Still nothing builds the site header.** Items 1 and 2 of the Phase 1 layout
  below — the patch line, and the Help, Feedback and Update Notes links — appear
  in no change in the table above. `runeword-table` deliberately did not invent
  one, so the next proposal picks this up or it never ships.

  **It also surfaced a dataset defect, which it did not fix.** Three runewords —
  `Fortitude`, `Phoenix` and `Spirit` — grant different properties depending on
  which base they are socketed into, and the vendored source expresses that with
  Markdown sub-headings inside the property list. The generator carried them
  through verbatim, so `Fortitude`'s first property line is the literal text
  `#### Weapons` and its fourteenth is `#### Body Armor`. The table renders the
  dataset faithfully, which is exactly why this is visible: six of the 975 lines
  are section headers masquerading as properties.

  `runeword-table` reads and never writes `src/data/`, and no requirement of
  either capability covers per-base property groups, so fixing it here would have
  meant either editing the dataset out of scope or inventing a feature. It wants
  its own change, and it is a real modelling question rather than a typo: either
  the generator strips the headings and the three records lose information, or the
  schema grows a notion of per-base property groups and the detail view learns to
  present them.

- **`crafted-tracking`** — the socket toggle, `localStorage` persistence, the
  progress bar out of 99, the undo toast.

  Landed with four things worth carrying forward. **Every read and write of
  stored progress goes through `src/crafted/storage.ts`**, which is the only
  module that names the key — `csv-import-export` must write through it rather
  than reach for the key itself, or the format has two definitions. The key is
  namespaced and versioned (`diablo2-runeword-tracker:crafted:v1`) because
  GitHub Pages serves every project under the account from **one origin with one
  `localStorage`**, so a bare key would collide with a sibling project.

  **A stored name the dataset does not know is kept, not dropped.** It is
  excluded from the crafted set and from the count, and written back out on
  every save, so a runeword renamed between patches does not silently lose the
  player their mark. Those preserved names are invisible in the interface and
  have no way to be cleared from the page — which makes them exactly what
  `csv-import-export`'s unmatched-name report is for, since that change already
  owes the player a way to see them.

  **Progress is written from the toggle and never from an effect.** An effect
  fires on mount, so a value that failed to parse would be overwritten with an
  empty set before the player did anything. As it stands, corrupt storage is
  still there to be repaired by hand.

  **Two tabs do not observe each other.** No `storage` event listener is
  installed, deliberately: `localStorage` is same-tab only, so the same tracker
  open twice will have the last write win. It is about five lines to fix and no
  requirement asks for it. Recorded so the omission reads as a decision rather
  than an oversight.

- **`detail-view-hover`** — not a feature. Four defects in what `runeword-table`
  shipped, all found by comparing the deployed page against the reference after
  the change was archived: the detail view opened on click where the reference
  opens on hover, every patch badge rendered the same brown, the rune column was
  a row of unlabelled 24px sprites, and a base category and its restriction read
  as one grey run of text.

  **It reversed `runeword-table`'s "add no dependency" decision, deliberately.**
  `@floating-ui/react` is the first runtime dependency added since the dataset.
  The old decision was correct for what it was deciding about — a click-opened
  modal `<dialog>` needs no positioning at all — and it stopped being correct the
  moment the panel opened on hover: a panel of up to 26 property lines has to flip
  above the pointer for rows near the bottom of a 7400px table, shift inward at
  the viewport edges, stay positioned as the page scrolls, and hold itself open
  while the pointer crosses the gap toward it. That last one, `safePolygon`, is
  the part hand-rolled code gets wrong, and it gets it wrong at the bottom of the
  page where review is least likely to look. Recorded here so the next change
  reads it as a decision that was revisited rather than one that was forgotten.

  **Tailwind's source scan is now scoped to `src/`, and the reason is worth
  keeping.** v4 scans the whole project root by default, so the stylesheet was a
  function of every file in the repository rather than of the application. That is
  not theoretical: writing the words "focus ring" in a sentence in a change's
  `tasks.md` generated `.ring` and its `@property` block and put 1.5 kB of unused
  CSS into the build. Prose about an interface is full of words that look like
  utilities — ring, grid, table, block, hidden, transition — so the default
  guarantees a stylesheet that grows quietly as the documentation does. Scoped with
  `@import "tailwindcss" source(none)` and one `@source`, which removed eighteen
  such rules and took the built CSS from 17.20 kB to 14.14 kB. If a class ever
  needs to live outside `src/` — in `index.html`, say — it has to be added to that
  `@source` list, and that is the trade.

  **"Only one panel open" is a property of the set, not of a panel.** Per-row
  floating contexts are right — `useHover` binds to one reference element — but
  per-row _open flags_ were not: each knows only about itself, so a panel pinned by
  a click sat under a second opened by hover. It looked correct until then only
  because `safePolygon` and `useDismiss` happened to cover the other orderings.
  The flag is one value on the table now, which forced two more things worth
  remembering: the rows have to be memoised or every open re-renders all 99 (long
  tasks to 127ms in Chromium, none after), and the focus a replaced panel hands
  back on its way out must be declined rather than treated as a request to reopen —
  arbitrated on the table, because React unmounts the panel before it updates the
  row's props, so anything passed down arrives a commit too late. Any future
  one-of-many control on this page inherits all three.

  **A focus trap on a panel that opens on focus is a dead end, and only using it
  shows that.** The change was designed to split focus containment two ways —
  trapped when opened deliberately, loose when opened by hover — with keyboard focus
  counted as deliberate. That is unusable: focus reaching a name is what opens that
  name's panel, so the trap closes over the keyboard on row 1 and no later row can
  be tabbed to. It shipped as three cases instead. **Activation** — click, tap or
  keypress — traps focus and gives it back. **Focus reaching the name** does not
  trap and moves nothing, so Tab flows name → panel → next row. **Hover** installs
  no focus management at all. Worth remembering as a shape rather than as a bug: any
  future control that reveals something on focus has the same trap available to it
  and the same reason not to take it.

  **Item-type restrictions are dataset content in English.** `(Assassin)`,
  `(Barbarian)`, `(Not Orbs/Wands)` — fifteen of the 99 carry one, and they are
  the **second dataset field after runeword names** that `russian-locale` has to
  source from the game client rather than translate. Only the parentheses are
  copy. Giving the restriction its own colour and its own line makes it visibly
  its own field, which is exactly what makes the omission easy to miss until late.

  **The reference's badge contrast was adopted knowingly, and it fails AA.** Black
  on the classic brown scores 2.01:1 and black on the `3.0` purple 3.67:1, against
  4.5:1 for WCAG 2.1 AA normal text. The gold-on-brown it replaced scored 4.88:1
  and passed, so the most common badge in the dataset — 46 of the 74 that carry
  one — is now less legible than it was. Fidelity to the reference was the
  decision, taken with the numbers in hand. Nothing about the badge's _meaning_
  depends on it: every badge carries its full text as its accessible name and the
  detail view restates all three fields in full words. If it is ever revisited,
  the fix is one foreground per token and nothing else changes —
  `--color-patch-label` is where it would land. `Note!` went the other way and is
  the one badge the change made more legible, from 4.44:1 to 10.3:1.

  **`--color-accent` is poorly named by the theme's own rule** and was left alone
  on purpose. It holds `#BD8547`, the same value as the new
  `--color-item-restriction`, for an unrelated role — it is the detail view's note
  text and nothing else, so `--color-note-text` is what it should be called. Two
  roles sharing a value is fine and is why they do not share a token; the name is
  the defect, and renaming it was not this change's business. Reported, not fixed.

  **The table scrolls sideways below about 542px, and always did.** Measured
  against the previous build: at a 390px viewport it overflowed by 74px before this
  change and by 198px after — 152px of that from the runes collapsing into the name
  cell below `md`, which takes that cell from 170px to 276px, and the rest from the
  required-level column now being wide enough to keep its header on one line. So this change makes an
  existing defect worse rather than introducing one, and no requirement in it
  covers the table's narrow-width layout — which is why it is here and not fixed
  there. Rows below `md` are also taller than the design's figures, which only
  cover the wide layout: 103px against 69px, and 10197px of `tbody` against 7103px.
  Whoever picks this up should decide whether the phone layout wants a smaller rune
  size, a horizontally scrolling table by intent, or fewer columns — it is a layout
  decision, not a bug with one obvious fix.

  **Four tokens are declared with nothing rendering them**, and this change did
  not orphan them: `--color-blood-dark`, `--color-blood-light`,
  `--color-muted-dark` and `--color-link` were all declared ahead of any surface.
  `d2-theme` forbids both halves of that — no token without a use site, and none
  declared speculatively — so this is one defect seen from two directions. The
  three tokens _this_ change orphaned were removed with their use sites
  (`--color-backdrop` with the dialog's dim, `--color-title` and `--color-danger`
  with the note badge's old colours). The remaining four are left for the changes
  that will plausibly want them: `site-header` for the link colour,
  `remaining-panels` for the rest. Whoever gets there first should either render
  them or delete them.

- **`search-sort-filter`** — search over name and item type, header-click
  sorting, the slot filter, view settings persisted. Needed the item-type to
  slot mapping, which `runeword-dataset` deliberately left out. **Carried more
  weight than it looked:** labelled 40px rune icons take the table from roughly
  4060px of rows to 7430px, and the filters are what make a page that long
  navigable.

  Landed with seven things worth carrying forward.

  **Two of the four orphaned tokens are worked off; two remain.**
  `--color-muted-dark` now draws the search field and a filter chip at rest, and
  `--color-blood-light` the selected chip and the sorted column's band. That
  leaves `--color-blood-dark` and `--color-link`, owed to `remaining-panels` and
  `site-header`. Whichever gets there first should render its token or delete it —
  the count has to keep falling.

  **The sorted column is marked by its band, not by a tinted arrow, and the
  reason is a contrast measurement.** The design said to draw the direction
  indicator "from the light-blood token", which read most naturally as tinting the
  glyph. `#802000` text on the `#400000` header band scores **1.74:1** — a glyph
  nobody can see. So the token renders the surface it is genuinely right for (the
  sorted `<th>`'s background, a visible step between two adjacent blood shades)
  and the arrow stays in the band's own `--color-gold-light`, which is 4.6:1 on
  it. The direction is carried three times over regardless: `aria-sort`, the
  button's accessible name in words, and the arrow. Worth remembering as a shape:
  a token named for a role can be right about the role and wrong about which
  property renders it.

  **The arrow costs about 21px of the table's narrow-viewport overflow, and the
  control bar costs nothing.** Measured at a 390px viewport: the bar needs 90px at
  min-content, never scrolls internally, and wraps below `md` — it is only ever as
  wide as the grid track the table already stretched. The document's overflow went
  from 198px to 620−390 = 230px, and all of that is the arrow's reserved space in the
  five headers.

  It was worse before it was fixed. Drawn only on the sorted column, the arrow made
  that column 12px wider than the other four — and since Required Level is
  `whitespace-nowrap` by an earlier decision and is the default sorted column, its
  header sets its own column's width, so **sorting by it resized the column and
  shifted every row beside it**. The space is reserved in all five headers now and
  nothing moves; the price is that the reservation is permanent rather than paid only
  while sorted. Verified in Chromium: the five header widths are byte-identical under
  the default sort, sorted by name, and sorted by level.

  Whoever picks up the phone layout should know the reserved arrows are in the
  measurement, and that reclaiming them means hiding the indicator below `md` rather
  than making it conditional again.

  **The sticky bands and the detail panel are one stacking decision, and it lives
  in `src/index.css`.** The progress band is `z-index: 2`, the header band
  `z-index: 1`, the portalled panel `z-10`.
  Verified in Chromium the only way it can be — open a panel on a row just below
  the band, scroll until the two overlap, and read `elementFromPoint` at the
  overlap: the panel is what is painted. The two numbers are eight apart on
  purpose, and changing either without reading the other is how that defect comes
  back at one specific scroll offset.

  **The row memoisation survived the rows becoming a derived array**, which was
  the risk the change was most likely to fail on. Measured in Chromium after:
  20–35ms from click to painted panel and **no long tasks at all**, against 37–50ms
  and long tasks to 127ms unmemoised. What holds it up is that the `runeword`
  objects inside the derived array are the dataset's own and their identities never
  change, so the memo's comparison passes whether the array is fresh or not — plus
  one `useMemo` in `App` and five `useCallback` setters, without which every
  keystroke in the search field would rebuild 99 rows.

  **`useCraftedRunewords`' `toggle` is still a fresh closure per render**, and
  this change deliberately did not touch it. It means typing in the search field
  re-renders every presented row, since `App` re-renders and hands the rows a new
  callback. Harmless today — the presented set is changing anyway on those renders
  — but it is the one prop standing between the table and a fully stable set, and
  it is about three lines to fix if a later change needs it.

  **A rune name can still match a runeword, and that is the name column
  working.** Rune search is dropped, but ten of the 33 rune names occur _inside_
  other text — `El` within `Delirium`, `Mal` within `Malice` — so those queries
  match as substrings of a visible name. The twenty-three that occur nowhere are
  what the test suite uses to prove no rune is a search term.

  **The ASCII matcher is `russian-locale`'s problem now.** Search is
  `toLowerCase()` and `includes()`, with no normalisation and no collator, because
  every name, category and restriction in the dataset is ASCII and
  `src/index.css`'s font subset already depends on that. Sorting is code-point
  order for the same reason. `russian-locale` is the change that introduces
  non-ASCII display text, so it owns the collation question — and it inherits it
  in two places, not one.

  **Two questions were left open on purpose.** Whether the slot filter wants a
  count per option — `Shield (10)` — which is cheap to derive but is four more
  numbers on a bar that already carries one, and which interacts with whether
  those numbers respect the other filters; `remaining-panels` is about to render
  per-slot aggregates and may answer it better. And whether the crafted filter's
  "remaining" should become the default once anything is crafted, which is what a
  returning player wants and is also a control changing itself — the persisted
  setting is the honest version of the same idea.

  **Sorting by crafted state is the first control that can move a row out from
  under the pointer.** Toggling a row while sorted by that column relocates it
  immediately, which is a misclick generator. The undo notice is the existing
  answer and this change added no re-sort animation; `row-animations` in Phase 4 is
  where that gets looked at, and it is the first thing on this page that needs it.

  **The search field's clear button is restyled, and the first attempt to leave it
  native was wrong.** Chromium draws that glyph in its own blue and gives it the
  document cursor, which made it the one thing on the page whose colour came from no
  token and which did not admit that it could be pressed — the palette rule and the
  pointer rule this project keeps everywhere else. "The platform draws it" turned
  out not to be a reason to break either. The replacement is a **mask rather than a
  background image**, and that is the whole trick: an inline SVG carrying its own
  `fill` would be a literal colour inside a URL, invisible to the token rule and
  unreachable by a hover state, where a mask holds only geometry and takes its
  colour from `background-color`. So the glyph is `--color-muted` at rest and
  `--color-gold-light` under the pointer, the same pair the crafted socket and the
  runeword's own name already move between. Any future control that has to restyle a
  platform-drawn glyph has the same shape available.

  **Everything square gained a 2px radius**, which was a request rather than a
  requirement and is recorded because it now applies to four surfaces and the next
  one should match: the search field, the filter chips, the progress bar and the
  table's header band. Two pixels — `--radius-xs` — because Diablo II's own
  interface is angular and anything larger stops reading as the game. Two details
  are worth knowing. The progress bar needs the radius on the groove **and** on both
  engines' fill pseudo-elements, or a square fill shows the corner it was meant to
  soften, at 0% and 100% where the bar spends its first and last day. And the header
  band's two outer `<th>` cells carry matching corners, because the sorted column's
  lighter background would otherwise paint a square corner over the rounded one —
  visible only when Crafted or Required Level is the sorted column. `border-radius`
  does apply to a `table-header-group` box in Chromium; that was checked rather than
  assumed. The detail panel and the undo notice are still square, deliberately left
  for whoever decides whether the radius is a system or four use sites.

  **The Tailwind source-scan defect is not fixed, and this change met all three of
  its faces.** `detail-view-hover` scoped the scan to `src/` and thought that was
  the end of it. It was not — comments in TypeScript are prose too, and the scanner
  cannot tell them from markup. Caught by diffing the generated class list against
  the previous build, which is now the only way to see it:

  - **A word in a doc comment.** The four-letter word for what focus draws around a
    control appeared in one sentence in `RunewordControls.tsx` and cost 1.65 kB —
    the utility plus its `@property` block. It came back twice while being fixed:
    once from the comment explaining not to write it, and again from writing it with
    a leading dot. Two component comments are now worded around the scanner, and
    both say so.
  - **A parameter name.** `filter` is a Tailwind utility and the natural name for
    a parameter holding one, so `(filter: CraftedFilter)` in three signatures
    generated `.filter` and nine custom properties, 643 B. No amount of scoping
    reaches an identifier, and renaming it would be the scanner dictating the code.
    Blocked by name instead: `@source not inline("filter")`.
  - **Test files.** The densest prose in the project, rendering no markup that
    ships. Excluded with `@source not`, which removed thirteen classes nothing
    rendered — `.invisible`, `.text-lg`, `.mr-1`, `.text-red-500` and the numeric
    fragments a `@floating-ui` assertion generated. That is a defect the baseline
    was already carrying.

  Net: the stylesheet went from 14.17 kB to 14.67 kB for a whole feature's worth of
  new utilities, all eighteen of which a component actually renders. **The
  generalisable part is the method, not the three fixes:** a class list diffed
  between builds is the only thing that shows this, `pnpm build` alone does not, and
  the next change should expect to find its own.

- **`remaining-panels`** — the two collapsible blocks. Pure aggregation logic,
  unit tested.

  Landed as two native `<details>` panels between the progress band and the
  controls, in normal flow rather than a third sticky layer — reference
  material closed by default has no claim on permanent viewport height. The
  aggregation is two pure functions in `src/remaining/` taking the crafted set
  as a parameter, tested against the dataset's own anchors: 343 rune slots,
  `Shael ×20` and `Zod ×3`; 144 category memberships in 55 (category, sockets)
  groups. Four things are worth carrying forward.

  **The bases block's "placement and grouping still to be designed" note is
  discharged.** Grouped by (category, sockets) as the caveat below settled, and
  presented as a flat list in dataset category order with sockets ascending —
  per-category sub-headings inside a panel inside a page were judged more
  structure than the content earns, and regrouping later is presentation-only.
  A multi-category runeword counts under every alternative, on the slot
  filter's precedent, so the counts deliberately do not sum to the uncrafted
  total — which is why the row's copy names what its count is: `serves N
runewords`, never a bare number.

  **The declared-ahead-of-use token count fell to one.** `--color-blood-dark`
  now renders as the summary band of both panels, one step below the table
  header's band, exactly the surface it was held for. `--color-link` remains,
  owed to `site-header`, and the count has to reach zero there.

  **The slot-filter count question stays open, and these panels did not answer
  it.** `search-sort-filter` guessed they might; they aggregate by base
  category, not by slot, so `Shield (10)` remains its own decision for whoever
  wants it.

  **The class-list diff came back clean** — fifteen new utilities, every one
  rendered by a new component, no prose leakage — the first change since the
  method was established to add none, which does not retire the method. The
  panels were also checked in Firefox, not just Chromium: the native disclosure
  marker is fully replaced, the band and glyph render from tokens, Tab reaches
  the summary and Enter and Space toggle it. One thing learned there: Tailwind
  v4's `rotate-90` writes the CSS `rotate` property, not `transform`, so a
  check that reads `getComputedStyle(...).transform` sees `none` and reports a
  false failure.

- **`chronicle-styling`** — not a feature, and not yet a proposal. A pass over the
  interface against a screenshot of the **in-game Chronicle window itself**, which
  is the screen this whole project is a tracker for and which nobody had compared
  the page against until now. `docs/REFERENCE.md` analyses the _reference site_;
  this is the game. Landed so far, directly on `main` rather than through a change,
  which is worth admitting rather than tidying away:

  **The crafted accent is the Chronicle's gold, not green.** `--color-crafted` went
  from `#44aa44` to `#a79663` — the value `--color-gold-mid` already holds, kept as
  its own token because "the gold display family" and "crafted state" are different
  roles that happen to share a hex, which is the case `d2-theme`'s naming rule
  explicitly permits. The Chronicle's own progress bar fills pale gold and there is
  no saturated green anywhere on that screen; the green pip was the one element on
  our page that looked like it came from a different application. This reverses a
  line in the Phase 1 layout above.

  **The control is a square box with a check mark, not a filled socket.** Same
  reason, and it reverses the same section. `crafted-tracking`'s requirement was
  worded around a socket rendering filled or hollow, and has been reworded: what it
  guarantees is that **a mark is present or absent**, so colour is never the only
  difference between the two states — not which mark it is. The check is an inline
  SVG stroked in `currentColor` with the token on the button, so no colour value
  lands in the component.

  **Progress states a percentage as well as the counts, and it sticks.**
  `37% (37 of 99)`: the percentage is the form the Chronicle uses, the counts stay
  because the goal is a number of runewords and a percentage alone cannot be checked
  against a list of 99. The rounding lives in the copy layer, where formatting
  belongs. And the band is `position: sticky` at the top of the viewport above the
  table's own band — the question the page exists to answer, scrolled 7 000px above
  the rows being read, is an answer nobody can see. Both requirements are now in
  `crafted-tracking`.

  **Three stacked sticky things now share one number.** The progress band is
  `z-index: 2` at `top: 0`, the table header `z-index: 1` at
  `top: var(--progress-band-height)`, the detail panel `z-10`. That variable exists
  because nothing in CSS can ask an element how tall its sibling ended up: if the
  band grew and the header's `top` did not, a strip of runeword row would show
  between them, and only while scrolling. Also worth knowing that **sticky works on
  a grid item here** — usually it does not, since a grid item's containing block is
  its one-row grid area — checked in Chromium rather than reasoned about.

  **The title stopped jumping on reload, and the cause was `font-display: swap`.**
  Swap paints the heading in the fallback serif and then re-lays it out when
  Bellefair arrives, and Cambria and Bellefair are different enough widths that the
  shift is obvious on a page whose first element is a large heading. Two changes, and
  they are one decision: `font-display: optional`, which gives the font a short
  window and then commits for the whole page load so the text is laid out once; and a
  `<link rel="preload">` in `index.html`, so the 16.5 kB request starts with the
  document instead of after the stylesheet is parsed. Measured in Chromium against
  the built site on a cold profile: **CLS 0, Bellefair loaded, one font request** —
  the `crossorigin` attribute is what keeps it one rather than two, because font
  requests are made in CORS mode and a preload without it is an unused download.
  `block` was the alternative and is worse: it hides the heading instead of moving
  it. Vite rewrites the preload's `href` to the same hashed file the stylesheet
  points at, so nothing is duplicated. No spec pinned `swap`, so nothing there
  changed.

  **The slot filter took the game's vocabulary, and its split.** Five slots instead
  of four: `shield` became **offhand**, and `weapon` split into **melee** and
  **missile**. Both are the player's own words and the second is a distinction they
  plan around — a bow runeword and a sword runeword are not alternatives to each
  other. `Helm` and `Body Armour` stayed as we wrote them: the Chronicle says
  `Helmet` and `Body Armor`, and the second is one letter from the dataset's own
  `Body Armors`, which is the confusion the British spelling avoids.

  Three consequences worth carrying forward.

  **A category can now belong to two slots, which changed the mapping's shape.**
  `Weapons` means _any_ weapon, so it maps to melee **and** missile; collapsing it to
  either would hide nine runewords from a filter they belong in. `slotOf` returning
  one slot became `slotsOfCategory` returning a list, and `runeword-browsing`'s
  "exactly one of the four" became "one or more". Every other category still maps to
  exactly one, so the change is a shape rather than a free-for-all.

  **The multi-slot count went from five runewords to thirteen, and `Fortitude` now
  spans three.** Per-slot totals are 14 helm, 49 melee, 19 missile, 10 offhand, 22
  body armour — 114 memberships across 99 runewords. That excess is the point of the
  filter rather than double counting, and nothing about it reaches the progress
  denominator. The eight new spanners were always craftable in either kind of weapon;
  one `weapon` slot simply had no way to say so.

  **A stored `slotFilter` of `shield` or `weapon` no longer validates, and that is
  handled.** `view-persistence` already requires the whole record to be rejected on
  an unrecognised choice, so those sessions open with the defaults and the next change
  of a control overwrites them. The key stays at `v1`: the _shape_ did not change,
  only the enum members, and bumping it would have thrown away the player's sort
  setting for nothing.

  **The crafted header starts descending, alone among the five.** One press shows
  what you have made, because that is what a player pressing it is asking; what is
  left is the same header pressed twice. The arithmetic underneath did not move —
  ascending still puts the un-crafted first — so this is only which direction one
  press lands on, and it lives in `firstDirectionFor` beside the comparators.

  **A column header is the whole cell now, not the words in it.** The padding moved
  from the `<th>` to the `<button>`, which fills it. Still a real button, which is
  what keeps it in the tab order and operable by Space and Enter — the two halves used
  to pull against each other, because a handler on the cell would have given the hit
  target and cost the keyboard. One knock-on: a full-width flex control does not
  honour its parent's `text-align`, so the right-aligned Required Level column needed
  an `align` prop rather than a class on the cell.

  **The columns are declared from `md` up, and three separate things were making the
  page move.** Auto layout sizes a column by the widest thing in it, so the columns
  were a function of whichever rows the filters happened to leave. Measured at 1280px
  going from all 99 rows to the empty state: `[101,227,334,276,164]` became
  `[183,227,163,235,296]` — the crafted column nearly doubled, because its 99
  checkboxes stopped being there to size it. Fixed by `table-fixed` plus five declared
  percentages on the header cells, verified sub-pixel identical across 99 rows, a
  22-row filter and the empty state at 768, 1152 and 1280.

  Two smaller causes were hiding behind that one, and both are the kind that only
  show on a transition:

  - **The scrollbar.** Filter down far enough and the page stops scrolling, the
    viewport gains the scrollbar's width, and `mx-auto` re-centres every element
    including the heading. `scrollbar-gutter: stable` on `html` reserves the space
    always. A no-op where the platform draws overlay scrollbars, which is also why it
    could not be reproduced in headless Chromium and had to be reasoned about.
  - **The empty state's row had no borders.** A data row carries `border-l-4` for the
    crafted accent; the message row did not, which made the collapsed table 2px
    narrower on that edge and moved every column. It carries the same borders,
    transparent, now.

  **Fixed widths stop at `md`, deliberately.** Below it the runes collapse into the
  name cell, and at 390px percentages clipped the `Crafted` heading by 37px and spilled
  name cells over their neighbours — six 40px icons do not fit in about 124px. Auto
  layout there keeps doing what it always did: the table gets as wide as it needs and
  the page scrolls sideways. That is the pre-existing defect nobody owns, and buying
  stability at a width where nothing was complaining by making the layout worse is the
  wrong trade. The phone layout gets fixed by deciding what to do about the icon size,
  not by five percentages.

  **Still on the table from that screenshot, and not done:** the window uses
  **letter-spaced small caps** for every label, lays its filters out as a **vertical
  list with diamond bullets** rather than chips, centres the **percentage over the
  bar** instead of beneath it, and draws its panels in **charcoal with bevelled gold
  frames** rather than on pure black. None of those is obviously right for a web page
  that has to work at 390px, which is why they are a list here rather than a commit.

Phases 2 to 4 become their own changes later: `russian-locale`,
`csv-import-export`, `row-animations`.

---

## Phase 1 — usable tracker (MVP)

### Layout, top to bottom

1. Site title and patch line
2. Help and Feedback links, link to official patch notes
3. Overall progress bar — crafted runewords out of total
4. Collapsible blocks, near the top, collapsed by default: remaining runes,
   remaining bases
5. Search
6. Filters
7. Runeword table

### Runeword table

- One row per runeword, 99 on the current patch
- Columns: crafted state, name, runes, item types, required level
- Every column header sortable; default sort by required level.
  **Shipped** by `search-sort-filter`: five keys, two directions and no third
  state, with the header row sticky so a sort control is reachable from the row
  being read. Every ordering falls back to level-then-name, because four of the
  five keys cannot separate the dataset on their own — 45 runewords share three
  sockets — and reversing a direction reverses the key only, leaving that tiebreak
  ascending, so a descending presentation is not the ascending one read backwards.
  The runes column sorts on **socket count**, not the rune sequence as text, which
  would order `Ber Mal Ber Ist` before `El El El`.
- Crafted state is its own column so it can be sorted on
- Item types display as category plus restriction, e.g.
  `Staves (Not Orbs/Wands)`, `Body Armors (Barbarian)`. **Shipped as two lines**
  by `detail-view-hover`: the restriction sits beneath its categories in a warmer
  tan, because an exclusion that changes which item to go looking for should not
  read as more of the category list.
- Badges next to the name: patch of introduction, ladder-only marker.
  **The patch badge is colour-coded by era**, so which patch introduced a runeword
  is readable without reading the number — four colours for the dataset's five
  patch values, `1.10` and `1.11` sharing one as a single classic era.
- Clicking the name opens a popover with the granted properties in green.
  **Hovering it does too**, as the reference does, and so does keyboard focus —
  three triggers on one panel, because a touch device has no hover and a keyboard
  has neither hover nor tap.
- Runes column collapses on mobile and moves inline under the name.
  **Each rune is drawn at the sprite's native 40px with its name beneath it**;
  unlabelled sprites told a reader who does not know the runes by silhouette
  nothing, and the column is the recipe.

### Marking a runeword as crafted

- Control in the first column. **Shipped as a square box with a check mark, not
  the empty-vs-filled socket this line first called for** — see the note below.
- Whole row clickable for a larger hit target, but the control stays a real
  button so Tab and Space work
- A crafted row gets a tint and a left accent border. **The tint is the
  Chronicle's gold, not the green this line first called for** — same note.
- Toggling updates the progress bar and both remaining panels immediately
- Undo affordance for misclicks — short-lived toast with an undo action

### Filters

- Crafted / remaining / all
- **By slot: helm, weapon, shield, body armour.** This is the only category
  filter. Everything finer grained is handled by search instead.

**Shipped** by `search-sort-filter`, as two radio groups rather than toggle
buttons — radio semantics say "one of these" without a sentence explaining it and
arrow-key movement comes free. Both are single-select: a runeword belongs to
several slots at once (`Fortitude` is a weapon and a body armour, and appears
under both), so a union of two produces a presented set that is hard to predict
from the controls.

The 20 base item categories map onto the four slots in `src/runewords/slots.ts`,
in application code rather than in the dataset — a slot is our grouping of the
vendored categories, and a generator emitting a field with no source is the defect
its own rules exist to prevent. The mapping's totality is a test over the dataset,
not a comment, because a category new to us would otherwise make its runewords
vanish from every slot at once and silently. `Grimoire → shield` is the one call
worth remembering: it occurs on seven runewords and beside `Shields` on all of
them. Per-slot totals are 14 helm, 58 weapon, 10 shield, 22 body armour.

### Remaining runes block

- Collapsible, near the top, collapsed by default
- Every rune still needed, with a count and its sprite icon
- Counts are small enough to show in full. Across all 99 runewords the
  totals run from `Shael ×20` down to `Zod ×3`, 343 rune slots in total.
  Note that the _high_ runes have the _lowest_ counts, so nothing here is
  demotivating.
- The source data carries a rune `tier` field (common / semirare / rare,
  eleven each). Grouping the panel by tier turns a flat list of 33 into three
  meaningful bands — worth doing.

**Shipped** by `remaining-panels` with the tier bands, each band disappearing
as its runes are satisfied, and a completion message — not an absent panel —
when nothing is left.

### Remaining bases block

- Collapsible, near the top, collapsed by default
- The bases still needed, with required socket count
- Data caveat: a runeword specifies a base _category_ plus a socket count,
  never a specific item. "3 axes with 4 sockets" is really "3 four-socket
  melee weapons". Group by (category, sockets).
- ~~Placement and grouping still to be designed~~ **Shipped** by
  `remaining-panels`: placed with the runes block between the progress band
  and the browsing controls, and grouped as a flat (category, sockets) list in
  dataset category order with sockets ascending — sub-headings inside a closed
  panel were judged more structure than the content earns, and regrouping
  later touches presentation only.

### Persistence

- Crafted runewords in `localStorage`
- Filter and sort settings in `localStorage`

**Two keys, two modules, two opposite recovery rules**, which is why
`view-persistence` is its own capability rather than half of
`progress-persistence`. Progress is the player's work: a value that failed to parse
is left untouched so it can be repaired by hand, and a name the dataset does not
know is carried forward. A sort direction is not the player's work — a corrupt view
setting is discarded, the defaults are used, and the next change of a control
overwrites it. One module serving both would have a write path that has to know
which half of its payload may be thrown away.

**The search query is deliberately not persisted**, and the stored record has no
field for it rather than an empty one. A page reloading into `zeal` showing one row
reads as a broken dataset, not as a preference — where a filter's own control shows
what it is doing, which is the honest form of the same idea.

---

## Phase 2 — Russian localisation

- Bilingual UI with a language switch
- Runeword names, rune names and item properties must match the official
  Russian game client exactly. Taken from official sources, never
  machine-translated.
- **Item-type restrictions too.** `(Assassin)`, `(Barbarian)`,
  `(Not Orbs/Wands)` — fifteen of the 99 carry one, and the words inside the
  brackets are dataset content in English, not copy. They are the second dataset
  field after runeword names that has to be sourced from the game client rather
  than translated. Only the parentheses live in the strings layer.
- English names remain the canonical identifiers in the data layer

---

## Phase 3 — CSV import / export

- Purpose: move progress between devices without a backend
- Export: one crafted runeword name per line. No timestamp — agreed, it
  carries no information the user needs.
- Import: parse, match by name, mark matches as crafted
- Two additions that cost almost nothing and prevent silent data loss:
  - a first line marking format and version, e.g.
    `# diablo2-runeword-tracker export v1`. Import ignores `#` lines. Without
    it, a future format change has no way to announce itself.
  - import must **report unmatched names** rather than skip them quietly. A
    typo or a renamed runeword otherwise looks like a successful import that
    lost entries.

---

## Phase 4 — polish

- Row movement animation. Sorting by crafted state and toggling a row
  animates it to its new position; a filter that hides it fades it out.
- Further visual flourishes

---

## Data

- Scope: the runewords tracked by the D2R Chronicle log. The reference site
  lists **99** on patch 3.1.1 — note this contradicts the "~89" figure found
  in secondary sources, which is why a second source is required.
- **Shipped.** The dataset now lives in `src/data/`, generated from
  `vendor/runewizard/` by `pnpm data:build` and validated with `zod` when it
  loads. See [`docs/DATA-SOURCES.md`](docs/DATA-SOURCES.md) for the field
  mapping. What follows is the requirement it was built against, kept for the
  record.
- A runeword record needs: name, ordered rune sequence, allowed base categories
  with restrictions, required level, granted properties, patch of introduction,
  ladder-only flag. Socket count is **not** a field — it equals `runes.length`
  and is derived at each use site.
- Rune order matters and must be preserved
- 33 runes total, in the canonical in-game order
- Rune icons: the reference packs all 33 into a single 440×120 sprite at
  40×40 each, offsets driven by a CSS variable. Worth copying as a technique.
  Licensing of both that repository and the underlying Blizzard artwork needs
  checking before any asset is reused.

---

## Tooling

Borrowed from the owner's `kwp-app`, already proven there:

- `prettier-plugin-tailwindcss` — deterministic Tailwind class order
- `@trivago/prettier-plugin-sort-imports` — import order
- `clsx` + `tailwind-merge` — conditional classes without conflicts
- `class-variance-authority` — typed style variants
- `zod` — validate the runeword dataset rather than trusting it
- `simple-git-hooks` + `lint-staged` — lightweight pre-commit hooks
- `vitest` — the remaining-runes and remaining-bases aggregation is pure
  logic and the place where a silent error would hide longest
- `docs/CODE_RULES.md` pointed at from `AGENTS.md`

Deliberately not borrowed: monorepo, Turborepo, Next.js, tRPC.

---

## Availability markers — decided

**The progress bar always shows all 99.** No toggle, no shifting denominator.
The Chronicle goal is 99, so that is the number.

Availability is **presentation only**. The three fields below exist to render
a badge with a tooltip and nothing else — no filter reads them, no counter
subtracts them, no logic branches on them. They are optional, and a row with
none of them set simply shows no badges.

| Field        | Meaning                                          |
| ------------ | ------------------------------------------------ |
| `ladderOnly` | craftable on ladder only — 9 runewords           |
| `patch`      | version that introduced it, e.g. `2.6`, `3.0`    |
| `note`       | free-form caveat, for season-specific exceptions |

The nine ladder-only ones: Bulwark, Cure, Ground, Hearth, Temper, Mosaic,
Metamorphosis, Mania, Hysteria.

### Why `note` has to be a data field and not hardcoded logic

**Mosaic** is the case that proves it. The reference marks it ladder-only,
patch 2.6, and then adds a note: _disabled in Season 13, can be crafted
offline non-ladder_. So a runeword that is nominally ladder-only is currently
impossible to craft on ladder, and possible only outside it.

Availability flips between seasons, so it is information for the player to
read, not a rule for the app to enforce. Keeping it purely decorative is what
makes it safe: a stale badge is a cosmetic inaccuracy, whereas stale logic
would silently miscount progress.

Badges carry a tooltip with the full text, exactly as the reference does —
`L` with "Ladder Only", the patch number, and `Note!` with the caveat.

## Open questions

None outstanding. Vendored data is in place and verified — see
[`docs/DATA-SOURCES.md`](docs/DATA-SOURCES.md) for the confirmed schema.
Ready for the first OpenSpec proposal.
