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
  tan small-caps rune text, serif display font, custom cursor, ornamental
  divider. Granted properties were sketched here as green, copying the reference
  site; `detail-panel-tooltip` made them the game's blue, because the detail panel
  reproduces the game's item tooltip and the game is the authority for that one
  surface
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
- **The third-party rule, as narrowed in the Season 15 round.** It read "the page
  makes no third-party request" until a page-view counter shipped, and a rule
  that a document keeps asserting while the code contradicts it is worse than one
  that admits its exception. What holds now: **no cookies, no consent dialog,
  nothing that reads or transmits the reader's progress, and no third-party
  script beyond one cookieless counter.** That still refuses a tag manager, an
  advertising script, a session recorder, a hosted donation widget and a
  verification script — the last because verification is available as inert
  markup. Assets stay self-hosted: no font service, no CDN, no remote image.
  The counter is Cloudflare Web Analytics; see
  [`docs/SITE.md`](docs/SITE.md) for what its numbers are and are not worth.

---

## Planned changes

The phases below describe _what_ to build. This is the sequence of OpenSpec
changes that builds it. Change names are ours, not an OpenSpec convention —
they are just kebab-case folder names. Capability names, which accumulate in
`openspec/specs/`, are a separate namespace.

The order is dependency order, not preference. Each change should end with the
site still deployable.

| #   | Change                   | Status |
| --- | ------------------------ | ------ |
| 1   | `project-scaffolding`    | done   |
| 2   | `deploy-github-pages`    | done   |
| 3   | `runeword-dataset`       | done   |
| 4   | `d2-theme`               | done   |
| 5   | `runeword-table`         | done   |
| 6   | `crafted-tracking`       | done   |
| 6a  | `detail-view-hover`      | done   |
| 7   | `search-sort-filter`     | done   |
| 8   | `remaining-panels`       | done   |
| 9   | `property-groups`        | done   |
| 10  | `site-header`            | done   |
| 11  | `detail-panel-tooltip`   | done   |
| 12  | `merged-remaining-panel` | done   |
| 13  | `russian-locale`         | done   |
| 14  | `dataset-localisation`   | done   |
| 15  | `csv-import-export`      | done   |
| 16  | `search-indexing`        | done   |
| 17  | `tracker-ux-batch`       | done   |
| 18  | `crafting-advice-batch`  | done   |
| —   | `chronicle-styling`      | partly |

`crafting-advice-batch` is the second batch under that grouping rule, and the
largest: two advice surfaces the owner asked for, the click-through defect they
depend on, two confirm-dialog refinements, a Help revision and an SEO batch —
all named in one request. What is worth carrying forward is not the features but
five things the work taught.

**The market is a data source, and not the one anyone expected.** Traderie has
an open JSON API, and a completed listing advertises the finished item's whole
property set. Subtract what the runeword grants and the remainder is the
**base's** contribution — which is how the advice can say that 44 of 50 sold
Mosaics were built on a claw already rolling +3 Phoenix Strike, or that Void's
advertised +6-8 Abyss is the word's +2 skills and +1-3 Abyss plus a +3 dagger.
Trade velocity — the span of the newest 50 completed trades — ran from Call to
Arms at 8 hours to Radiance at four years, and matched the owner's own sense of
what is worth crafting closely enough to use as the second signal behind the
Maxroll tiers. It is a **one-time offline research input**, never a runtime
integration: the page asks Maxroll and Traderie for nothing at run time, and the
reader's browser never contacts them.

**A dataset field that carries an opinion still has to be decoration.** The
usefulness label and the advice prose are `runeword-dataset`'s newest fields and
sit on exactly the terms `ladderOnly`, `patch` and `note` already set: no filter
reads them, no counter subtracts by them, progress is still out of the whole
list. That is what let two editorial surfaces ship without touching a single
piece of progress logic.

**The authored-module pattern generalised.** `data/advice/` is `data/ru/`'s shape
applied to a second kind of content that has no vendor source — keyed by
canonical name, validated against the vendored records, merged by the generator,
with per-entry `source` notes the emitted JSON never carries. `data/advice/terms.ts`
then does it a third time for the highlighter's vocabulary. The module is
**generated from JSON rather than hand-edited**, which is what made five rounds
of review survivable: a correction is a data edit and a re-emit, not a hunt
through 99 records for a string to replace.

**Highlighting prose is where the subtle bugs were.** Colouring game names in the
advice took five passes, and each failure is worth remembering. A word boundary is defined over
ASCII word characters, so the rune `Ист` matched inside «Историю» and left the word
half-coloured — Unicode boundaries are `(?<![\p{L}\d])` with the `u` flag. A
regex alternation takes the **first** branch that matches, not the longest, so a
one-word name beat the phrase containing it (`Bone` inside `Bone Spirit`); the
fix is to try multi-word names, then the generic phrase, then single words. And
a mechanical name swap into Russian produces the right word in the wrong case —
«с Туман» where the sentence needs «с Туманом» — so the swap is followed by a
proofreading layer rather than trusted.

**The official Russian names live in the dataset, and reading them caught six
errors.** `data/ru/runewords.ts` quotes every skill and aura the client names
(`+3 к умению "Тепло"`, `ауру "Шипы"`). Grepping that before writing Russian
prose settled Zeal as «Истовость», Vengeance as «Возмездие», Werebear as «Облик
медведя», Holy Freeze as «Священный холод» and Concentration as
«Сосредоточенность» — and the in-game Chronicle log as **«История»**, which is
also, confusingly, the runeword Lore's own name. Warlock is «чернокнижник».

Two things it deliberately did not do. **No filter on usefulness**, though it is
the obvious next ask — a control reading these fields is its own proposal. And
**the narrow-viewport table is still deferred**: the 390px overflow was
re-measured at 230px, unchanged by this batch.

`detail-view-hover` is numbered `6a` because it is not a step in the sequence:
it corrects four defects in what `runeword-table` shipped, found by comparing the
deployed page against the reference. Kept in the table so the order changes
actually landed in is readable.

Changes 13 to 15 are Phases 2 and 3, which are shipped — see those sections
below for what landed. `chronicle-styling` carries no number because it is not an
OpenSpec change: part of it went straight onto `main`, and the rest was reviewed
on 2026-07-31 and dropped. [Phase 5](#phase-5--polish-shipped) is shipped;
[Not this phase](#not-this-phase) is what was declined or deferred;
nothing else in this document is a to-do list.

`tracker-ux-batch` is three small things in one change, under the same grouping
rule `phase-5-polish` set: a confirmation dialog in front of every mark and
unmark (which replaces the undo toast outright), a congratulation on the progress
line at 99 of 99, and import matching a runeword by its Russian label as well as
its English name. Each is a handful of lines, all three touch the crafted set and
the display-copy layer, and three propose–apply–archive cycles for them would
have been ceremony rather than review. Beside that batch, availability-badge
hover tips left the browser's native `title` for Floating UI panels styled like
the detail view — recorded in `runeword-table` rather than as its own change.

`search-indexing` comes after the phases rather than inside one: the product was
finished and the page still told a crawler nothing. It added a meta description,
Open Graph, a canonical link and a `<noscript>` paragraph to `index.html`, plus
`robots.txt` and `sitemap.xml` from `public/`, with the site's address pinned as
`SITE_URL` in `src/header/site.ts` and a test holding the four copies of it
together. Two things learned there are worth keeping. **`robots.txt` on a project
page is advisory** — crawlers read `jekman87.github.io/robots.txt`, which belongs
to the account and not to this repository, so ours states intent and names the
sitemap while the sitemap itself has to be submitted in Search Console by hand.
And **the last step is not a code step**: verifying the property and submitting
the sitemap are account actions, documented in [`docs/SITE.md`](docs/SITE.md)
rather than automated, because automating them would mean a third-party script on
a page that refuses to carry one.

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

  Landed, then revised on looking at the built page — the four reversals are the
  part worth carrying forward, because each was decided the other way first with
  reasons that read well and did not survive the page.

  **Help is an in-page disclosure with real usage prose**, not a link
  to the README. The link was justified as avoiding a new interactive surface; what
  it actually offered a player was a repository written for whoever maintains the
  project. Six strings in `src/i18n/en.ts` now answer "how do I use this" in the
  header. In flow rather than the reference's overlay dropdown: an overlay needs a
  `z-index` argued against two sticky bands, an outside-press dismissal, and an
  answer at 390px. **It is the one disclosure in this project that is not a native
  `<details>`**, and the reason is worth knowing: its control belongs on the
  title's line beside Feedback while its panel belongs in the next row of the
  header's grid, and a `<summary>` must be the first child of the element it
  opens. So it is a button with `aria-expanded`, `aria-controls` and three lines
  of state, and the price is Chromium's hidden-until-found — find-in-page cannot
  open this panel the way it opens the remaining ones. **Both links open in a new
  tab** with `rel="noopener noreferrer"` and the new-tab behaviour in each
  accessible name — the tracker is a page a player keeps open while reading patch
  notes, which is the case where the earlier "no `target=_blank`" rule was wrong.
  **The patch notes hang off the patch value itself**, as the reference does, so
  there is no separate Update Notes link and no single-link `nav` landmark left to
  label. **The links are gold, not blue** — `text-gold-mid` → `text-gold-light`,
  the pair a runeword's name already moves between.

  Two things that did not change. **The patch value and the URLs are constants in
  `src/header/site.ts`**, not dataset fields and not copy: the vendored source
  carries no site-level patch version, so a generated field would have no source
  behind it, and `3.1.1` is the same string in every locale, so the copy layer
  takes it as a parameter. The patch constant and the patch-notes URL sit on
  adjacent lines because they move together. **The `<header>` is a sibling of
  `<main>`, not a grid item inside it** — inside `main` the element exposes no
  `banner` landmark at all — which is why the width and gutter classes appear on
  two elements with a comment on each naming the other.

  **`--color-link` was rendered here and then deleted**, which is the other way a
  token declared ahead of its use site is worked off. That takes the ahead-of-use
  count to zero: three rendered, one removed. The class-list diff against the
  previous build is every utility the header uses and nothing else — no prose
  leakage, which is the check that mattered most on the change that put six
  paragraphs of prose inside a component.

- **`detail-panel-tooltip`** — the detail panel restyled to read as the game's own
  item tooltip, which is what it is a copy of. Palette only: no positioning, no
  content, no markup beyond one class list.

  The interesting part is **which source owns a surface**. Most of this palette was
  read off the reference site, and for this one surface the reference was the wrong
  authority: it draws granted properties green, and in the game an item's magic
  properties are blue. So `--color-property` and `--color-property-value` moved from
  the reference's greens to `#7f7fff` and `#b0b0ff` — one step brighter than the
  game's own `#6969ff`, which lands at about 4.0:1 on the new ground and is under AA
  for the densest text in the panel. The two-step relationship stayed, because
  "values brighter than the words" is `runeword-table`'s requirement rather than a
  decoration.

  Three more values. **The ground left the blood family** (`#200000` → `#17171a`):
  a near-black panel on a black page has no edge, and every red on this page is a
  _band_, so a floating box borrowing one would read as a band that came loose.
  `--color-toast` and `--color-blood-dark` kept `#200000` — three tokens at one
  value is exactly what lets one of them change its mind alone. **The edge became
  `--color-panel-edge`** instead of borrowing the row hairline, because brightening
  `--color-row-line` would have brightened every separator in a 99-row table to
  sharpen one floating box. **The text became `--color-panel-text` at white**, as
  the requirement lines in the tooltip are; the runeword's name and the labels
  stayed gold, since those are structure this panel adds and the tooltip has no
  equivalent for.

  Worth knowing for the next palette change: **this one is invisible to the test
  suite by design.** Tests assert token references, not colours, so the check is the
  built stylesheet's values plus reading an open panel in a browser — which is also
  what caught that the untouched tokens were genuinely untouched.

- **`merged-remaining-panel`** — the remaining-runes and remaining-bases panels
  became one panel with two sections, because two closed bands spent **160px above
  the table to say two titles**, and a closed band carries no information beyond
  its own name. Now one band: 120px, and the first runeword row moved up 68px at
  both 1280px and 390px (y=554→486 and y=722→654 of a 900px viewport).

  Open, the two lists sit **side by side from `md`**, which is where the bigger
  number turned out to be: the bases list is 55 rows and 1680px with nothing
  crafted, the rune list 440px, so stacking made 2144px of panel and two columns
  make 1680px. Below `md` they stack, because two columns of 40px rune icons with
  their names do not fit in 342px.

  Two things this change is a good record of. **The estimate in its own design doc
  was wrong by more than double** — it guessed the bases list at 25 rows and the
  stacked height at 830px — and the conclusion survived the measurement while none
  of the numbers did, which is the case for measuring even when the answer will not
  change. And **`RemainingPanel` did not change at all**: it was written as one
  shell used twice, so using it once was a change to `App.tsx` and a new
  `RemainingNeeds` holding the two sections. The tier labels inside the runes list
  dropped from `h3` to `h4` so the outline still reads `h1` → `h2` → `h3` → `h4`.

  Three placements were considered and deliberately left: **counts in the closed
  band** ("23 runes · 14 base types still needed"), which is the bigger win because
  the closed state would then answer something rather than label itself;
  **popovers from the browsing controls**, which frees all 160px and adds a floating
  surface to arbitrate against two sticky bands; and **a sidebar at wide widths**,
  the reference site's shape. Folding the counts into the sticky progress band was
  rejected outright rather than deferred — it re-opens the
  `--progress-band-height` arithmetic, whose failure mode shows at one scroll
  offset only.

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
  page requests no third-party font. Bellefair has no Cyrillic subset, so Phase
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
  have no way to be cleared from the page.

  This used to say that is what `csv-import-export`'s unmatched-name report is
  for. That report was withdrawn on 2026-07-31 and the gap is closed the other
  way: an import **replaces** the whole stored value rather than editing it, so
  the names it brings become the unknown list and the ones held before it are
  gone. That is the one save that does not carry them forward, and it is the only
  way one can ever be cleared. `progress-persistence` records the exception.

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

  All four are rendered now: `remaining-panels` took the dark blood,
  `search-sort-filter` the muted dark and the light blood, and `site-header` the
  link colour. The count is zero and stays there by the rule that the change
  rendering a surface declares its token.

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

Phase 2 shipped as two changes rather than one — `russian-locale` for the copy
layer, `dataset-localisation` for the dataset text inside it — and Phase 3 as
`csv-import-export`. Phase 4's `row-animations` has not been proposed and is
carried into [Phase 5](#phase-5--the-current-phase), where its row-movement half
is kept and its "further visual flourishes" half is dropped.

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
- Undo affordance for misclicks — short-lived toast with an undo action.
  **Superseded by `tracker-ux-batch`**: the page asks before it marks, and the
  toast is gone. The protection is the same one and it arrives before the change
  rather than after it, which is what import already did.

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

**Shipped** as two changes, and the split is the part worth knowing:
`russian-locale` gave the copy layer a second record, a switch in the header and
a persisted preference, while every runeword name, rune name, category, property
line and restriction on the page stayed English. `dataset-localisation` then
localised that dataset text. What follows is the requirement they were built
against, kept for the record, and then the four things that landed which it did
not ask for.

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

**The sourcing rule survived contact with the sources, and got stricter rather
than looser.** The official localisation turned out to be reachable in two
forms — noob-club.ru transcribes the client's runeword and rune text in full,
and a reader with the game open settles whatever the transcription leaves
doubtful, the client winning where they disagree. It caught a transcription typo
on `Shael`. Community sites are cross-checks for what neither covers. Machine
translation stayed forbidden and each entry carries a source note, so the
`ui-strings` requirement was modified rather than dropped: it still asks for the
game's own terms, and now says how the game is read. Two terms turned out to have
no source at all — the off-hand and missile-weapon slot names — and are
documented as this project's own words.

Reading the sources changed three terms that had shipped as guesses: «Основы» is
nobody's word for a base item, «Броня» became the client's own «Доспех», and the
**ladder badge is not a Latin `L` in Russian** — it abbreviated a loanword every
source does use. Worth knowing because the availability-marker section below
still describes the badge as `L`, which is now the English locale's letter rather
than the badge's definition.

**Strictly one language on screen**, which is stronger than "translated". A
record either carries a complete Russian variant or falls back to English as a
whole record, so no row is half-translated, and not one Latin letter appears in
Russian dataset text. That outranks quoting the client verbatim in the one place
they conflict: its per-level formulas leave the character-level variable in Latin
(`+(2*clvl)`), and these render `+2*ур`.

**Search and sort follow the selected language.** This is the collation question
`search-sort-filter` left open, and it was answered twice — `russian-locale`
answered it by scoping non-ASCII text to the copy layer that neither matching nor
ordering reads, and `dataset-localisation` then had to answer it properly:
matching folds case and `ё`/`е` on both sides, and ordering uses
`Intl.Collator("ru")` for Russian projections with `byCodePoint` kept for
English. The tiebreak stays required level then canonical name, so it is
locale-independent.

**Canonical English names stayed the identifiers**, which is what kept the blast
radius small: crafted-progress storage, the CSV format, rune sprite lookup and
the progress count are all keyed on them, so none of them changed shape. A locale
switch does not touch stored progress.

---

## Phase 3 — CSV import / export

**Shipped** as `csv-import-export`. What follows is the requirement it was built
against, kept for the record, with the two places the shipped behaviour departs
from it marked.

- Purpose: move progress between devices without a backend
- Export: one crafted runeword name per line. No timestamp — agreed, it
  carries no information the user needs.
- Import: parse, match by name, mark matches as crafted
- Two additions that cost almost nothing and prevent silent data loss:
  - ~~a first line marking format and version, e.g.
    `# diablo2-runeword-tracker export v1`. Import ignores `#` lines. Without
    it, a future format change has no way to announce itself.~~ **Built, then
    removed before shipping.** Nothing read the line and nothing would until a
    second format existed, so it was ceremony at the top of every file the player
    opens, paid for by a version that may never arrive. A v2 can introduce its own
    marker and read an unmarked file as v1. Import still skips `#` lines — that
    keeps files exported while the header existed readable, and lets a
    hand-written list carry a comment.
  - ~~import must **report unmatched names** rather than skip them quietly. A
    typo or a renamed runeword otherwise looks like a successful import that
    lost entries.~~ **Superseded 2026-07-31.** There is no report. An import
    replaces everything, so it is preceded by a confirmation stating how many
    runewords the file will actually mark — and that count is the signal the
    report was for: a file of typos offers to import nothing and says so, in the
    one place the player is already reading. Unmatched names are still not lost;
    they are preserved in storage on the terms `progress-persistence` already
    sets, uncounted and unrendered.

Decided on 2026-07-31 and shipped:

- **Import replaces, it does not merge.** What the file lists becomes the crafted
  set; everything held before it is gone. A confirmation dialog states that, gives
  the count, and offers to cancel — and **there is no undo**, because that dialog
  is the safety mechanism and the toggle notice stays one toggle deep.
- **Text is parsed, `.xlsx` is refused.** `.csv`, `.tsv`, `.txt` and any
  single-column list: BOM stripped, CRLF tolerated, `#` lines skipped, first cell
  of each line taken, quotes unwrapped. A workbook parser would be the largest
  dependency in the project, added to read a list of names; a workbook chosen
  anyway degrades to a confirmation counting zero. Whoever has a spreadsheet saves
  it as CSV in two clicks.
- **Matching folds case**, and nothing beyond that — no fuzzy distance, no
  matching a locale's translated labels. Without the unmatched-name report, case
  was the one near-miss worth absorbing, and the 99 canonical names are distinct
  case-insensitively so it cannot make a match ambiguous.
- **The two controls sit at the far end of the result-count row**, not among the
  filters as first sketched: that row is a search field and nine chips wide, and
  two more controls on it wrap into a third bar in all but name.

---

## Phase 4 — polish

**Not shipped**, and folded into Phase 5 rather than kept as its own phase — one
item and a placeholder is not a phase, and the item is now one entry in a longer
list. Kept here so the numbering does not lie.

- Row movement animation. Sorting by crafted state and toggling a row
  animates it to its new position; a filter that hides it fades it out.
- Further visual flourishes

---

## Phase 5 — polish (shipped)

**Shipped** as one OpenSpec change, `phase-5-polish` — a finishing batch under
the grouping rule in `AGENTS.md` (related items in one propose–apply–archive
cycle).

### What landed

- **Centred property lines** in the detail panel (name / labelled values stay
  left-aligned; grouped headings centre with their groups).
- **Full-width ornamental divider** in the header (content keeps the page measure;
  no `100vw`, no sideways scroll from the band).
- **Help badge legend** (all four patch colours, ladder, note) plus a line on
  Remaining Runes tiers / Horadric Cube ratios — the mitigation claimed for the
  badge contrast decision is now on the page.
- **Footer** with copyright (site name + year from the clock), a donation control
  that opens a dialog for **USDT on TON** (selectable address + copy), and a
  copyright easter egg (six random act-boss / Chronicle lines; restores after 5s).
- **Back-to-top** circular control, revealed when the header leaves the viewport.
- **`--radius-xs`** on every self-drawn surface (badges keep borrowed geometry);
  **`--color-accent` → `--color-note-text`**; stable `toggle` via `useCallback`.

### Tried and reverted

- **Grey ground / translucent panel** — grey was measured from diablo2.io then
  reverted to black `#000`; translucent only made sense on grey, so the panel
  stays opaque `#17171a`.
- **Row View Transitions** — glitched when scrolling mid-animation and fought the
  sticky header; removed. Scroll position on toggle is still frozen in `App.tsx`.

### Settled while building

- Donation: USDT on TON (not TRC-20, not on-chain BTC). Details in
  [`docs/SITE.md`](docs/SITE.md).
- Copyright: site name + dynamic year.
- Legend: all four patch colours, classic era included.

### Not this phase (unchanged)

Narrow-viewport table overflow was **deferred** here and is shipped in
[Phase 6](#phase-6--the-narrow-viewport-layout-shipped) below. Items dropped on
2026-07-31 stay dropped — see [Not this phase](#not-this-phase).

---

## Phase 6 — the narrow-viewport layout (shipped)

**Shipped** as one OpenSpec change, `mobile-layout`. It is the entry Phase 5
deferred, and the reason it got a change of its own rather than a corner of a
mixed one: it was a layout decision, not a bug with one fix.

### The defect, measured rather than described

At a 390px viewport the **whole page** scrolled sideways, not only the table: the
document was 620px wide in English and 701px in Russian, so the title, the
progress band, the controls and the footer all ran off the screen with it. The
document stood at 13 406px against 8 366px at 768px, because a row below `md` was
127px instead of 75px.

Only one block was responsible. Minimum content width per child of `<main>` at
390px: progress band 22px, remaining panel 124px, control bar 102px — and the
table 596px, which set the page's. Inside it: `Crafted 84 | Runeword 276 |
Base Items 98 | Required Level 135`.

**Russian was the harder case by 81px**, and worth recording because the English
figures hid it: its table bottomed out at 677px and it still overflowed at 625px,
one step below the breakpoint. So this was never only a phone defect — a desktop
window at 640px scrolled sideways in Russian.

### What landed

- **The runes render as their names below `md`**, not as icons. That is the
  reference's own answer and the single largest win: the name column falls from
  276px to 126px and the row from 127px to 65px. Nothing leaves the accessibility
  tree with the icons — they were already `decorative` and the names were already
  the announced text.
- **The crafted column is withdrawn below `md`.** The accent border and the row
  tint already state the crafted state without colour, and a click anywhere on the
  row already opens the confirmation, so a third statement of it was not worth
  84px. **Both cells stay in the table** and collapse instead: a `<thead>` row
  declaring fewer cells than the rows beneath it slides every header one column
  off its data.
- **The control does not go with the column.** It is the only way to mark a
  runeword without a pointer, so below `md` it is clipped rather than hidden —
  still in the tab order, still carrying `aria-pressed` — and un-clips when it
  takes keyboard focus. `crafted-toggle` in `src/index.css` holds all three
  states.
- **A short form of the required-level heading**, in both locales. It is
  `whitespace-nowrap` and so sets its own column: 135px in English, 180px in
  Russian. The other four headings fit and did not get one.
- **The sort arrow is withdrawn below `md`** — by width, never by state. Phase 5
  named that constraint and it held.
- **A wrapped runeword name is left-aligned.** A `<button>` centres its text, which
  only showed once the name column reached 140px and Russian names began to wrap.

### The result

|                                    | before          | after         |
| ---------------------------------- | --------------- | ------------- |
| Document width at 390px (en / ru)  | 620 / 701       | **390 / 390** |
| Overflow at 320px (en / ru)        | +300 / +381     | **0 / 0**     |
| Document height at 390px (en / ru) | 13 406 / 13 426 | 9 700 / 9 884 |
| Median row below `md`              | 127px           | 85px          |

Checked in every state the reader can reach — remaining panel open, help panel
open, a query that matches nothing — in both locales, at 390px and at 320px.

**The desktop layout did not move**, and that was checked by measurement rather
than by reading the diff: table width, all five column widths, median row height
and document height at 768px and 1280px are identical to the figures taken before
the change. The built stylesheet gained exactly the seven classes the change
renders and nothing else.

The reference, for calibration, is 390px wide and 6 130px tall with 51px rows at
the same viewport. It carries no crafted column and no usefulness badge, which is
most of the remaining difference.

### Found in review, and fixed here

Two defects the owner hit reading the mobile view. Both are in the change.

- **The back-to-top control sat in the middle of the reading area.** `bottom-40`
  was chosen so it would clear the last row's crafted toggle at 390px — and a
  narrow row has no toggle to clear any more, so the number was holding the button
  over the rows for a reason that had gone. In the corner below `md`
  (`bottom-8 right-4`), unchanged above it.
- **A tap on a dialog's dim went through to the page.** `useDismiss` closes on
  `pointerdown` by default, which unmounts the dim between the press and the
  release; the browser then hit-tests the release against whatever the dim was
  covering. Traced at 390px with touch: `pointerdown → div.z-20`, then
  `mousedown / mouseup / click → button [in row]` — one tap closed the
  confirmation and opened that row's advice panel, or a few pixels over raised the
  crafted question again for a different runeword. Fixed by dismissing on the
  completed press (`outsidePressEvent: "click"`) in all three dialogs that dim the
  page. **It was never a narrow-viewport defect** — it needs a touch device, not a
  narrow one — but a phone is where it is met.

- **Headings painted over their neighbours between `md` and `lg`.** Reported at
  860px, worst in Russian. One set of column percentages served every width from
  `md` up, and at 768 the five columns have 705px against a content minimum of
  more than that — so `Создано` ran +23px into `Рунное слово`, `Требуемый уровень`
  +46px over `Предметные базы`, and a six-rune recipe +64px over the bases beside
  it. All three predate this change and all three were invisible to a probe that
  sampled 390, 768 and 1280 only. Fixed with a second set of percentages for the
  `md`-to-`lg` band (13/19/37/22/9 against 9/20/29/24/18), by running the short
  level heading to `lg`, and by letting the wide rune sequence wrap so the next
  person to change a percentage gets a taller row rather than overlapping text.
  1280 is byte-for-byte what it was.

### Settled while building

- 390px is the **stated minimum supported width**. Below it the page degrades and
  no requirement covers it — though as it turns out nothing overflows at 320px
  either.
- The page gutter was **not** reclaimed. The arithmetic did not need it, and
  `<main>`, the header wrapper and the footer wrapper carry the same width classes
  and would all have had to move together.
- Smaller rune icons were the other candidate and buy a third of what dropping
  them buys, at the cost of showing the sprite at 60 % of the size it was drawn
  for.

---

## Phase 5 — planning record (superseded by the shipped section above)

The work in flight. Everything above this line is a record of what landed;
everything below it is either this phase or explicitly out of it.

**Reviewed and cut down on 2026-07-31.** The list this section carried was every
loose end the first four phases left, which is not a phase — it is an inventory. Of
that inventory the owner kept the row animation and three small fixes, deferred the
narrow-viewport layout, and dropped everything else; the dropped ones are named in
[Not this phase](#not-this-phase) rather than deleted, because a loose end that was
looked at and declined is worth more as a record than as an absence. **Seven new
ideas came in with that review**: the grey ground, the transparent tooltip that
depends on it, centred property lines, a full-width divider, a footer carrying a
donation control, a back-to-top button, and a badge legend in the help panel.

**It is one OpenSpec change**, `phase-5-polish`, under `AGENTS.md`'s grouping
rule: a coherent finishing batch is one propose–apply–archive cycle. The
groups below are the task groups inside it, not separate proposals.

### The grey ground, and the game's own tooltip

The page is pure black today. The idea is the ground of
[diablo2.io](https://diablo2.io/) — a dark textured grey — and then the detail
panel becomes **transparent black over it, as the game's item tooltip is**.

Measured on that site rather than guessed at, because what reads as "grey" there is
not a colour:

- The ground is a **590×590 tiled stone texture** (`bgtile.webp`) on `<main>`,
  averaging `rgb(38,38,38)` with per-pixel luminance from 12 to 79, over a
  `#111111` body. A second tile (`bgtile2.webp`, 590×295, averaging
  `rgb(48,48,48)`) repeats along the x axis at the top, which is what makes the
  head of the page lighter than its foot.
- Their panels are **`rgba(0,0,0,0.5)`** over that texture, and the sidebar
  `rgba(15,11,8,0.52)`. So the effect being asked for is exactly theirs: a
  semi-transparent black box that lets the texture read through it.

**The asset cannot be copied, and the effect can.** Every borrowed asset in this
project comes from the reference site, which is MIT licensed and credited;
diablo2.io publishes no such licence, its theme is its own work, and the texture is
plausibly derived from Blizzard artwork besides. A tiled dark texture is not an
idea anyone owns, so this ships with a texture of our own — generated, or a CSS
gradient-and-noise ground with no image at all — and diablo2.io is named as the
inspiration, not as a source. Whoever proposes this decides which, and the
no-image version is worth costing first: `d2-theme`'s self-hosting rule exists so
the page fetches no asset from anyone else, and a ground that is pure CSS also
makes no request of its own.

**It reopens `detail-panel-tooltip`, and the reason inverts cleanly.** That change
moved the panel's ground from `#200000` to an opaque `#17171a` because "a
near-black panel on a black page has no edge". On a textured grey ground the
opposite holds: transparent black now has an edge, and the game's own tooltip is
what it looks like. So this is not a reversal of the reasoning, it is the same
reasoning under a changed page.

**The sticky progress band is the trap.** `--color-ground` is `#000` and exactly
two things paint it: `body`, and the progress band — which is opaque precisely so
that rows scrolling under it are hidden. Give the body a texture and that band
paints a flat black stripe over it at every scroll offset but the top. It cannot
simply inherit the texture either: a `position: sticky` element moves relative to
the page, so a tile inside it slides against the tile behind it unless the
attachment is fixed. So the band needs its own answer, and "make it transparent" is
not one — the rows would read through it.

Open questions a proposal has to answer. **Every contrast ratio on the page is
measured against black and has to be re-measured** — the palette was built on
`#000`, and the panel text, the property blues, the badges and the row hairlines
all sit on a lighter ground now. **What the table's rows sit on**, since a
transparent tooltip over a transparent row over a texture is three layers of
translucency stacked. And **whether the ornamental divider and the blood-red bands
still read** against grey; they were chosen against black.

### Centred properties in the tooltip

The game centres the text in an item tooltip. **Only the blue property lines get
centred**, and the descriptive text above them stays as it is — left-aligned — so
this is a change to one block inside the panel rather than to the panel.

Worth knowing before it is proposed: three runewords carry two labelled property
groups (`Fortitude`, `Phoenix`, `Spirit`), so "the properties" is a list of groups
with optional headings, not a flat run of lines, and centring has to look right
with a heading above a centred group. The 26-line panels are the ones to check.

### The ornamental divider goes full width

It currently ends where the content does. The divider is a row of the `<header>`'s
own grid, and that grid is `mx-auto max-w-6xl px-6`, so the band is 1104px wide and
centred at any viewport past about 1152px. Edge to edge is what the idea asks for.

**No theme requirement changes**, which is the pleasant part: `d2-theme` already
says the divider "SHALL be a repeating horizontal band that spans whatever width it
is given rather than a fixed-width image", and the asset is an 800×16 tile drawn
with `repeat-x`. What changes is which container it is given, so this lands in
`site-header`'s layout requirement rather than in the theme's.

Two things it has to get right. **`100vw` is the wrong tool here** — `html` carries
`scrollbar-gutter: stable`, so a viewport-width band overflows by the gutter's width
and re-introduces the sideways scroll that the deferred narrow-viewport entry is
about. A full-width element wrapping a constrained inner block is the shape that
does not lie about the available width. And **that inner block is where the header's
duplicated measure classes go**, so the comment pair in `SiteHeader.tsx` and
`App.tsx` that names each other has to move with them; the `<header>` also has to
keep closing with the divider and keep the help panel opening below it at the
page's own measure, both of which are stated requirements.

### A badge legend in the help panel

Taken from the reference site's own help, which our help never looked at. Theirs has
a **Runewords** section that renders each badge inline in the prose and says what it
is: the ladder `L`, the coloured patch tags, and `Note!` with "pay special attention
to this". Ours explains how to use the page in six points and **says nothing about
the badges at all**.

Two reasons it matters more here than there. **The patch colours are a system
nobody can infer** — four colours for the dataset's five values, because `1.10` and
`1.11` are treated as one classic era, and the only place that is written down is a
comment in `src/index.css`. And **this is the mitigation the project already claims**
for adopting the reference's badge contrast knowingly at 2.01:1: the defence was
that no badge's meaning depends on seeing it, which is true of the tooltips and the
accessible names and was never true of the page as a whole.

The other thing worth taking from their help is **what the rune tiers mean**. They
explain that their rune order follows the Horadric Cube's upgrade ratios — three Tal
make one Ral — which is why rarity runs the way it does. Remaining Runes groups by
those same three tiers and says nothing about them, and it is also the answer to why
the rarest runes carry the smallest counts, an observation that has sat in this
document since the first draft without ever reaching the page.

**Settled on 2026-07-31**: the legend shows all four patch colours, the
pre-remaster era included, where the reference shows only its three new ones. A
reader meeting the brown tag has nowhere else to learn what it means.

One consequence for whoever builds it: a legend rendering real badges makes the
header the first consumer of the table's badge component, and that component
currently needs a runeword behind it. The words stay in the copy layer; the samples
are components, which is a distinction the help panel's "every word resolves through
the display-copy layer" requirement does not currently draw.

### A footer, and a donation control

Neither exists today. The page ends at the table.

The reference's footer is worth knowing before ours is designed: it is centred, in
the gold display colour, and holds two links — the author's other site and the
GitHub repository, the latter with an inline GitHub mark — over the same ornamental
divider drawn at half opacity. So the shape "divider, then two centred lines" is
already the house style, and a donation control is the one thing ours adds that
theirs has no equivalent for.

**Settled on 2026-07-31.** The instrument is **USDT on TON** — chosen over TRC-20
for fees, and over on-chain BTC, where the fee can exceed the donation. The footer
names the coin and the network beside the address, because an address alone is
ambiguous between chains and a sender who picks the wrong one loses the money. The
copyright line is the site's name and the year read from the clock at load: a fixed
year goes stale on a page that is otherwise entirely static.

- **A footer line with the copyright sign, the year, and probably the site's name.**
  The wording is to be settled while it is built. One real question in it: a fixed
  year goes stale and a year from `new Date()` is the one piece of text on this
  static page that depends on when it is read — which is fine, but it should be a
  decision rather than a habit. The name and any URL belong beside the patch
  constants in `src/header/site.ts`, and the words themselves go through the copy
  layer in both locales like everything else.
- **A donation control beside it.** The author is in Belarus, so the card
  processors and the usual "buy me a coffee" services are out, and a **crypto
  address is the only instrument that reaches him**. What is not settled: which
  coin, which network, and how it is presented — a selectable address, a copy
  button, a QR image, or a link out. Each has a cost worth naming: an address in
  the repository is public and permanent, a QR is a new asset, a copy button is a
  new interactive surface with a clipboard permission story, and the address must
  stay selectable text either way so it is reachable without the clipboard. To be
  settled while it is built.

### A back-to-top button

Bottom right, appearing once the page has scrolled past the header. The table is
about 7400px at a wide viewport and 10200px at a narrow one, so the top is a long
way up.

Three constraints this inherits, all of them already written down. **It is a fourth
thing in the stacking order** — the progress band is `z-index: 2`, the table's
header band `1`, the detail panel `z-10` — and those numbers are eight apart on
purpose. **The scroll offset that reveals it wants to be the header's own height**
rather than a magic number, and `--progress-band-height` is the precedent for how
this project holds a height that CSS cannot ask for. And **it must not cover the
last row's crafted toggle at 390px**, which is the width where a floating control
has the least room to be out of the way. Smooth scrolling has to respect
`prefers-reduced-motion`.

### Row movement — carried from Phase 4

A decision already taken rather than an open question. `search-sort-filter` shipped
sorting by crafted state, which is the first control on this page that can move a
row out from under the pointer, and deliberately added no animation; the undo
notice is the existing answer to the misclick that causes.

- **Toggling a row while sorted by crafted state animates it to its new position.**
- **A filter that hides a row fades it out.**

Two things whoever proposes this should know. The rows are **memoised, and the memo
is load-bearing** — unmemoised, opening a detail panel cost long tasks to 127ms
against none — so an animation that gives every row a changing prop each frame
undoes a measured win. And the table is `table-fixed` with a **sticky header**, so
a transform-based reorder has to be checked against both rather than reasoned
about.

Phase 4's other line, "further visual flourishes", is **dropped**: nothing was ever
behind it.

### Three small fixes

One tidying change, taken together because each is a few lines.

- **The 2px radius is a system, and that answers the open question.** The search
  field, the filter chips, the progress bar and the table's header band have it;
  the detail panel and the undo notice get it too. `--radius-xs` is the token, and
  2px is the value because Diablo II's interface is angular and more stops reading
  as the game.
- **`--color-accent` is renamed `--color-note-text`.** It holds `#BD8547` for the
  detail view's note text and nothing else, so the current name says nothing true
  about it. Reported by `detail-view-hover`, fixed here.
- **`useCraftedRunewords`' `toggle` gets a stable identity.** It is a fresh closure
  per render today, so typing in the search field re-renders every presented row —
  the one prop standing between the table and a fully stable set.

---

## Not this phase

### Dropped on 2026-07-31

Reviewed and declined. Kept as a record so none of them is proposed again as if it
were new ground, and so the reasoning that produced them is not mistaken for
oversight. The detail behind each is in the change records above.

- **Every item from the in-game Chronicle window** that `chronicle-styling` left:
  letter-spaced small caps for the labels, filters as a vertical list with diamond
  bullets, the percentage centred over the bar, and charcoal panels in bevelled gold
  frames. The parts of that pass which had already landed stay; nothing further is
  taken from the screenshot. **The missing change folder is dropped with them** — the
  requirements were written into `crafted-tracking` and `runeword-browsing` after the
  fact, so the specs are current and only the folder is absent.
- **Everything the remaining panel and the filters had pending**: counts in the
  closed band, popovers from the browsing controls, a sidebar at wide widths, a
  count per slot-filter option (`Shield (10)`), and defaulting the crafted filter to
  "remaining" once anything is crafted. Folding the counts into the sticky progress
  band was already rejected outright rather than deferred, and stays rejected.
- **Two tabs observing each other.** No `storage` event listener; the same tracker
  open twice keeps having the last write win.
- **A Cyrillic display font.** Bellefair is Latin-only, so under the Russian locale
  nearly every glyph comes from the fallback stack — Cambria, Georgia, Noto Serif,
  Liberation Serif — which was chosen for exactly that and is judged good enough.
  Worth knowing that this is now a bigger surface than when `russian-locale`
  deferred it: it accepted the mixed typography on the grounds that only interface
  copy was Russian, and `dataset-localisation` then localised the dataset text too.
- **The badge contrast.** Black on the classic brown is 2.01:1 and black on the
  `3.0` purple 3.67:1, against 4.5:1 for AA. Fidelity to the reference was the
  decision, taken with the numbers in hand, and no badge's meaning depends on it —
  each carries its full text as its accessible name. If it is ever revisited the fix
  is one foreground per token in `--color-patch-label`. **Phase 5 touches this
  indirectly**: those ratios were measured against black, and the grey ground
  changes them.
- **Find-in-page opening the Help panel.** It is the one disclosure here that is not
  a native `<details>`, because its control belongs on the title's line while its
  panel belongs in the next grid row, and a `<summary>` must be the first child of
  what it opens. Chromium's hidden-until-found is the price.

### Not work at all

**The Tailwind source-scan defect cannot be fixed, only managed**, so it is a method
rather than a task. Prose in TypeScript comments generates utilities and the scanner
cannot tell a comment from markup. Diff the generated class list between builds;
`pnpm build` alone does not show it. Every change should expect to find its own —
and this phase writes a footer, a donation control and a page of new colour, so it
should expect several.

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

Availability is **presentation only**. The fields below exist to render a badge
with a tooltip and nothing else — no filter reads them, no counter subtracts
them, no logic branches on them. They are optional, and a row with none of them
set simply shows no badges.

| Field   | Meaning                                          |
| ------- | ------------------------------------------------ |
| `patch` | version that introduced it, e.g. `2.6`, `3.0`    |
| `note`  | free-form caveat, for season-specific exceptions |

**`ladderOnly` was the third, and patch 3.3 ended it** (Season 15, August 2026).
The eight it applied to — Bulwark, Cure, Ground, Hearth, Temper, Metamorphosis,
Mania, Hysteria — were released into Non-Ladder, and the restriction that
outlived the patch is a Lord of Destruction one, which is not the mode this
tracker mirrors. The field, the badge, its copy and its palette tokens all went;
the vendor snapshot keeps its own flag for the day a patch needs one again. See
[`docs/DATA-SOURCES.md`](docs/DATA-SOURCES.md).

The removal is worth reading as a vindication rather than a loss. Because
availability was decoration from the first proposal, a patch that invalidated a
third of it cost a data regeneration, a badge and twenty-four sentences of prose
— and touched no filter, no counter and no denominator. Had any of it been logic,
this would have been a bug hunt instead of an edit.

### Why `note` has to be a data field and not hardcoded logic

**Mosaic** is the case that proves it. The vendor marks it patch 2.6 and adds a
note that it is disabled on ladder and craftable only offline / non-ladder — a
restriction that has now outlasted three seasons and the removal of the ladder
flag itself. It survives because it is prose in a data field: the one place a
season-shaped fact can live without turning into a rule.

Availability flips between seasons, so it is information for the player to
read, not a rule for the app to enforce. Keeping it purely decorative is what
makes it safe: edit the data when a badge goes stale; do not encode season
rules in application logic that would silently miscount progress. The same rule
now covers the advice prose, which stated ladder availability in two languages
and went stale exactly as a badge would have: prose may restate a restriction
only where the record's own note carries it.

Badges carry a tooltip with the full text, as the reference does — the patch
number, and `Note!` with the caveat.

## Open questions

**About the data, none.** The vendored source is in place and verified — see
[`docs/DATA-SOURCES.md`](docs/DATA-SOURCES.md) for the confirmed schema — and it
has since been generated, validated, corrected for property groups and given
Russian labels. This section said "none outstanding" for the whole project, which
was true when the first proposal had not been written and stopped being true
somewhere around change 7.

**About the interface, they are inside [Phase 5](#phase-5--the-current-phase)** —
each group names the questions its proposal has to answer, and the footer's wording
and the donation instrument are settled while they are built rather than here.

### Parked, deliberately

**Whether prerendering moved anything in search.** The entries have carried the
rendered list since the `prerendered-entries` round (August 2026), and the
baseline to compare against is what Search Console reported before it: two
indexed pages and impressions in the low tens. Indexing the content is a
precondition for ranking on long-tail per-runeword queries, not a guarantee of
it — for a fan tool, inbound links from communities remain the dominant factor.
Worth a look once the deploy has been crawled for a few weeks, and worth
comparing against that stated baseline rather than a memory. Not a gate on
anything.

Neither is a defect, and both were investigated far enough to stop. Recorded so
the next round does not rediscover them from scratch.

**An account-root repository (`jekman87.github.io`).** `https://jekman87.github.io/`
serves nothing — GitHub returns "Site not found" — which is why Google shows no
favicon for a result on this sub-path, and why a Search Console property where
`/sitemap.xml` means what the submit field implies cannot exist. One small
repository with a `favicon.ico`, a `robots.txt` and perhaps a card page would
close both. Costed and parked by the owner on 2026-08-20; the favicon is
cosmetic and the sitemap status is ignorable, so neither justifies a second
repository yet.

**The Search Console sitemap status.** «Couldn't fetch», against a sitemap
verified sound from outside — 200, `application/xml`, well-formed, nothing
disallowed, both entry URLs indexed. There is nothing in this repository to fix,
and the fix that exists is the root repository above. The verification and what
not to do about it are in [`docs/SITE.md`](docs/SITE.md).
