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
| 7   | `search-sort-filter`  | next   |
| 8   | `remaining-panels`    |        |
| 9   | `property-groups`     |        |
| 10  | `site-header`         |        |

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
  change and overflows by 152px after, because below `md` the runes collapse into
  the name cell and that cell goes from 170px to 276px. So this change makes an
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
  sorting, the slot filter, view settings persisted. Needs the item-type to
  slot mapping, which `runeword-dataset` deliberately left out. **Now carries
  more weight than it did:** labelled 40px rune icons take the table from roughly
  4060px of rows to 7430px, and the filters are what make a page that long
  navigable.
- **`remaining-panels`** — the two collapsible blocks. Pure aggregation logic,
  unit tested.

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
- Every column header sortable; default sort by required level
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

- Control in the first column, styled as an empty vs filled socket
- Whole row clickable for a larger hit target, but the control stays a real
  button so Tab and Space work
- A crafted row gets a green tint and a left accent border
- Toggling updates the progress bar and both remaining panels immediately
- Undo affordance for misclicks — short-lived toast with an undo action

### Filters

- Crafted / remaining / all
- **By slot: helm, weapon, shield, body armour.** This is the only category
  filter. Everything finer grained is handled by search instead.

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

### Remaining bases block

- Collapsible, near the top, collapsed by default
- The bases still needed, with required socket count
- Data caveat: a runeword specifies a base _category_ plus a socket count,
  never a specific item. "3 axes with 4 sockets" is really "3 four-socket
  melee weapons". Group by (category, sockets).
- Placement and grouping still to be designed

### Persistence

- Crafted runewords in `localStorage`
- Filter and sort settings in `localStorage`

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
