## 1. Vendor the two additional reference assets

- [x] 1.1 Fetch `mouse.png` (1 928 B) and `hr-gold.gif` (3 482 B) from
      `https://raw.githubusercontent.com/fabd/diablo2-runewizard/main/src/assets/images/`
      into `vendor/runewizard/assets/`. Use `--ssl-no-revoke` if `curl` fails with
      schannel error 35 — `docs/DATA-SOURCES.md` documents the TLS interception on
      this machine and its workarounds
- [x] 1.2 Verify both sizes against the GitHub API tree listing, as the existing
      four vendored files were, and record the byte counts
- [x] 1.3 Add both to the file table in `vendor/runewizard/README.md`, matching
      the existing rows. This is the **only** permitted edit under `vendor/` —
      it is the manifest of the snapshot, not snapshot content
- [x] 1.4 Do **not** vendor `logo-rune.png` or `logo-text-runewizard.png`. They
      are the reference project's identity, not a visual technique, and reusing
      them would misrepresent this project as Runewizard
- [x] 1.5 Confirm nothing already under `vendor/` was modified —
      `git status vendor/` shows only the two additions and the README

## 2. Self-host the display font

- [x] 2.1 Fetch the Bellefair **latin** subset only, from
      `https://fonts.gstatic.com/s/bellefair/v15/kJExBuYY6AAuhiXUxG1N-Po3.woff2`
      (16 536 B), into `src/assets/fonts/`. Skip latin-ext (11 336 B) and hebrew
      (6 752 B): the dataset is 100 % ASCII, verified across all names, item
      types, properties, restrictions and notes, so latin covers every character
      Phase 1 renders
- [x] 2.2 Fetch the licence text from
      `https://raw.githubusercontent.com/google/fonts/main/ofl/bellefair/OFL.txt`
      (4 389 B) to `src/assets/fonts/OFL.txt`. The Open Font License requires the
      text to travel with the font
- [x] 2.3 Declare `@font-face` in `src/index.css` with `font-family: Bellefair`,
      `font-weight: 400`, `font-style: normal`, `font-display: swap` and the
      `unicode-range` from the Google stylesheet, so a later subset can be added
      without touching this rule
- [x] 2.4 Set the display stack as `Bellefair` followed by a **deliberately
      chosen** serif fallback, not a bare `serif`. The fallback is load-bearing,
      not defensive: Bellefair has no Cyrillic subset, so every Russian glyph in
      Phase 2 will render from it
- [x] 2.5 Add no `<link>` to `index.html`. The point of self-hosting is that the
      page makes no third-party request

## 3. Colour tokens

- [x] 3.1 Add one `@theme` block to `src/index.css` declaring the palette read
      from the reference's `_colors.css`: ground `#000`, body text `#aca798`,
      blood `#400000`, blood-dark `#200000`, blood-light `#802000`, gold
      `#8a8062`, gold-mid `#a79663`, gold-light `#bab197`, property line
      `#48ac3f`, property value `#5cbd4b`, title `#d5d2d0`, accent `#bd8547`,
      danger `#ae2a1a`, ladder badge `#501008` on `#a19999`, patch tag `#513b2c`,
      muted `#74706c`, muted-dark `#24221c`, link `#39a9f7`, crafted `#44aa44`
- [x] 3.2 Use `#8a8062` for gold, not `#8a8162`. The reference declares both —
      `#8a8162` in its `@theme` block, `#8a8062` in `:root` — and the unlayered
      `:root` declaration is the one that actually renders, because unlayered
      styles beat layered ones regardless of order
- [x] 3.3 Name every token for the **role** it plays, not the hue: `property`,
      not `green-light`. Take the role from the **use site**, not from the
      reference's token name — `--color-runeword-text` is applied to the
      granted-properties list, not to a runeword's name, so it becomes
      `property`, and `--color-runeword-mods` becomes `property-value`
- [x] 3.4 Include tokens for the table band, the two badges and the crafted
      accent even though nothing renders them yet — `IDEAS.md` settles all three
      as requirements, and defining them once here is what stops three later
      changes each picking their own dark red. Add nothing for the popover, the
      toast or the panels, where no decision exists yet
- [x] 3.5 Set the base rules: ground colour on the page, body text colour, the
      display stack on headings. Confirm `pnpm build` emits the tokens and that
      no `tailwind.config.js` appears — Tailwind v4 theme values live in CSS

## 4. Rune sprite and cell geometry

- [x] 4.1 Copy `vendor/runewizard/assets/runes-sprite.png` (98 434 B, 440×120) to
      `src/assets/images/`. A copy, not a move: `vendor/` is a verbatim snapshot
      whose README forbids editing it, and no module under `src/` may import from
      it, so both files exist by necessity
- [x] 4.2 Add a test asserting the copy is byte-identical to the vendored
      original. Without it, an edit to either side of a binary file is a silent
      divergence no diff review would catch
- [x] 4.3 Write the exported pure function that maps a rune name to its cell:
      `col = index % 11`, `row = ⌊index / 11⌋`, where `index` is the rune's
      position in `runes.json`. Build the name-to-index `Map` once
- [x] 4.4 Keep the lookup in the theme layer, **not** in `src/data`. Sprite
      geometry is presentation; the dataset must not learn about it, and this is
      the answer to the sprite-index question `runeword-dataset` left open
- [x] 4.5 Make an unknown rune name a surfaced failure rather than a silent
      fallback to cell zero, which would render `El` for a typo
- [x] 4.6 Add the sprite rule to `src/index.css`, sizing the background to
      eleven by three multiples of `--rune-size` and the element to one multiple,
      with `--rune-size` defaulting to 40px. Expressing every offset in units of
      that one variable is what makes the icon resolution-independent
- [x] 4.7 Render at **full opacity**. The reference's `opacity: 0.5` fades runes
      the player does not own, and rune inventory is a feature `IDEAS.md`
      explicitly decided against
- [x] 4.8 Generate no stylesheet of 33 offset rules and store no sprite index.
      The cell is one expression over data already present, and a generated
      artifact would need a drift test to keep it honest

## 5. `RuneIcon` component

- [x] 5.1 Add `src/components/RuneIcon.tsx`: takes a rune name, renders that
      rune's icon, positioned from the cell function
- [x] 5.2 Unit-test the cell function across **all 33 runes**, not a sample. A
      wrong offset renders a real rune icon that is simply the wrong rune, so a
      sampled test is the one that lets it through
- [x] 5.3 Assert the sprite anchors explicitly: `El` is the first cell of the
      first row, `Zod` the last cell of the last row, `Amn` last of the first,
      `Sol` first of the second
- [x] 5.4 Assert the sprite rows match the tier bands — all 11 `common` runes on
      row 0, `semirare` on row 1, `rare` on row 2
- [x] 5.5 Assert the component's emitted **style attribute**, not
      `getComputedStyle`. jsdom does not evaluate `calc()`, so a computed pixel
      offset cannot be read back; the pure-function test carries the real
      assertion
- [x] 5.6 Verify the test bites: swap the column and row in the cell function,
      confirm the 33-rune test fails and names the diverging rune, then restore

## 6. Cursor and divider

- [x] 6.1 Copy `mouse.png` and `hr-gold.gif` from `vendor/runewizard/assets/`
      into `src/assets/images/`, and cover both with the byte-identity test from
      task 4.2
- [x] 6.2 Apply the custom pointer once at the document root with its `2 2`
      hotspot and a sensible fallback keyword
- [x] 6.3 Do **not** copy the reference's `div { cursor: … !important }`, which
      its own source marks with a lint suppression and which makes every division
      of the page claim to be clickable. Interactive elements keep their own
      cursor, so the pointer still tells the truth about what can be clicked
- [x] 6.4 Add the divider as a `repeat-x` background band at `0 100%`, 16px tall,
      spanning whatever width it is given — not a fixed-width `<img>`. Confirm it
      tiles cleanly at two different container widths with no seam or crop
- [x] 6.5 Render nothing else yet. The divider's placement in the page header
      belongs to the change that builds the header

## 7. Attribution

- [x] 7.1 Extend `NOTICE` to name the rune sprite, the pointer and the divider as
      derived from `fabd/diablo2-runewizard` under the MIT licence, alongside the
      existing `src/data/` entry
- [x] 7.2 Add a section to `NOTICE` for Bellefair and its SIL Open Font License,
      pointing at `src/assets/fonts/OFL.txt`
- [x] 7.3 Confirm the upstream MIT text is still at `vendor/runewizard/LICENSE`
      and the OFL text is inside `src/assets/fonts/`, each next to what it covers

## 8. Documentation corrections

- [x] 8.1 Correct three facts in `docs/REFERENCE.md` that this change verified
      against the source: rune opacity is `0.5` not `0.75` (`0.75` is a
      popover-specific override, an owned rune goes to `1`); the divider is an
      800×16 `repeat-x` band, not a 301×32 image; and the green belongs to the
      property list, not the runeword's name — the document's existing rune-text
      and properties-text rows were already right, so record the property
      colours and note that the name comes from the gold family
- [x] 8.2 Record in `docs/REFERENCE.md` that the reference loads Bellefair from
      Google Fonts and that we deliberately do not, so the difference reads as a
      decision rather than an oversight
- [x] 8.3 Note that Bellefair has no Cyrillic subset, so the Phase 2 translation
      change inherits the font question rather than rediscovering it
- [x] 8.4 Update the `IDEAS.md` Planned changes row for `d2-theme` once the
      change lands, and note that the cursor and divider arrived with it

## 9. Acceptance

- [x] 9.1 Run the full local gate — `pnpm typecheck`, `pnpm lint`,
      `pnpm format:check`, `pnpm test`, `pnpm build` — and confirm all five exit
      zero
- [x] 9.2 Confirm no module under `src/` imports from `vendor/`, and that
      `git status vendor/` is clean apart from the two additions and the README
- [x] 9.3 Confirm `dist/` contains the fingerprinted font and the three images,
      and that every `url()` in the built stylesheet carries the
      `/diablo2-runeword-tracker/` prefix. A wrong `base` here passes every local
      check and breaks only once deployed, which is why CI already asserts the
      prefix for JS and CSS
- [x] 9.4 Confirm the built page requests no third-party origin — no
      `fonts.googleapis.com`, no `fonts.gstatic.com`
- [x] 9.5 **Look at it.** Run `pnpm dev` and compare a rune from each tier band,
      including both ends of the sprite, against the reference site. Tests prove
      the geometry; they cannot prove it renders the right picture
- [x] 9.6 Run `openspec validate --changes d2-theme --strict`
- [x] 9.7 Commit as `feat(theme): add d2 visual theme` — `d2` rather than
      `diablo ii`, matching the change name and avoiding a lowercased Roman
      numeral that reads as two letters

## Deviations from the original plan

Three things implementation established that the plan had wrong or left out. All
three are now folded into `proposal.md`, `design.md` and the specs, so what
archives is the verified version. Kept here as the record of what moved and why.

**1. Both greens are property colours; the runeword name is gold.** The plan
described `#48ac3f` as the runeword name and `#5cbd4b` as the property text,
taking the reference's `--color-runeword-text` at face value. `main.css` applies
`#48ac3f` to `.rw-RunewordPopup-body` — the granted-properties list — and
`#5cbd4b` to the `.is-mod` numbers nested inside each line. The name is never
green: `gold-mid` in the popover title, `gray` in the table cell, `gold-light` on
hover.

`src/index.css` ships `--color-property: #48ac3f` and
`--color-property-value: #5cbd4b`. Both values from task 3.1 are present and
unchanged — only their roles moved, which is what naming a token for its role
requires. No new token was needed for the name: `gold-mid` and `muted` cover it.
This also reversed task 8.1's third correction, since the document's original
rows were right.

**2. `assetsInlineLimit: 0` in `vite.config.ts`, now backed by a requirement.**
The proposal claimed no config change was needed because Vite already
base-prefixes CSS-referenced assets. That holds only above 4 KB: the default
inlines the cursor (1 928 B) and the divider (3 482 B) as base64. Left alone, the
new `static-site-deployment` scenario would have been satisfied by the font
alone, and the images it was written for would never have produced a prefixed URL
to assert — a check passing while testing nothing new. `static-site-deployment`
now requires file emission outright, so the setting has a reason behind it rather
than reading as a stray preference.

**3. `src/App.tsx` and `scripts/borrowed-assets.test.ts`, both absent from the
Impact list.** Tasks 6.4 and 9.5 require looking at the rendered result, which
needs a page that renders something, so `App.tsx` became the acceptance surface —
all 33 runes in the sprite's own 11×3 grid, plus the divider at two widths. The
byte-identity test sits in `scripts/` because it reads files off disk and
`tsconfig.app.json` withholds Node's types from `src/`; it is the direct
analogue of the dataset drift test already there. Both are now in the proposal's
Impact list with those reasons.
