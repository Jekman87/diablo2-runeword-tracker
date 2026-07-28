## 1. Vendor the two additional reference assets

- [ ] 1.1 Fetch `mouse.png` (1 928 B) and `hr-gold.gif` (3 482 B) from
      `https://raw.githubusercontent.com/fabd/diablo2-runewizard/main/src/assets/images/`
      into `vendor/runewizard/assets/`. Use `--ssl-no-revoke` if `curl` fails with
      schannel error 35 — `docs/DATA-SOURCES.md` documents the TLS interception on
      this machine and its workarounds
- [ ] 1.2 Verify both sizes against the GitHub API tree listing, as the existing
      four vendored files were, and record the byte counts
- [ ] 1.3 Add both to the file table in `vendor/runewizard/README.md`, matching
      the existing rows. This is the **only** permitted edit under `vendor/` —
      it is the manifest of the snapshot, not snapshot content
- [ ] 1.4 Do **not** vendor `logo-rune.png` or `logo-text-runewizard.png`. They
      are the reference project's identity, not a visual technique, and reusing
      them would misrepresent this project as Runewizard
- [ ] 1.5 Confirm nothing already under `vendor/` was modified —
      `git status vendor/` shows only the two additions and the README

## 2. Self-host the display font

- [ ] 2.1 Fetch the Bellefair **latin** subset only, from
      `https://fonts.gstatic.com/s/bellefair/v15/kJExBuYY6AAuhiXUxG1N-Po3.woff2`
      (16 536 B), into `src/assets/fonts/`. Skip latin-ext (11 336 B) and hebrew
      (6 752 B): the dataset is 100 % ASCII, verified across all names, item
      types, properties, restrictions and notes, so latin covers every character
      Phase 1 renders
- [ ] 2.2 Fetch the licence text from
      `https://raw.githubusercontent.com/google/fonts/main/ofl/bellefair/OFL.txt`
      (4 389 B) to `src/assets/fonts/OFL.txt`. The Open Font License requires the
      text to travel with the font
- [ ] 2.3 Declare `@font-face` in `src/index.css` with `font-family: Bellefair`,
      `font-weight: 400`, `font-style: normal`, `font-display: swap` and the
      `unicode-range` from the Google stylesheet, so a later subset can be added
      without touching this rule
- [ ] 2.4 Set the display stack as `Bellefair` followed by a **deliberately
      chosen** serif fallback, not a bare `serif`. The fallback is load-bearing,
      not defensive: Bellefair has no Cyrillic subset, so every Russian glyph in
      Phase 2 will render from it
- [ ] 2.5 Add no `<link>` to `index.html`. The point of self-hosting is that the
      page makes no third-party request

## 3. Colour tokens

- [ ] 3.1 Add one `@theme` block to `src/index.css` declaring the palette read
      from the reference's `_colors.css`: ground `#000`, body text `#aca798`,
      blood `#400000`, blood-dark `#200000`, blood-light `#802000`, gold
      `#8a8062`, gold-mid `#a79663`, gold-light `#bab197`, runeword name
      `#48ac3f`, property text `#5cbd4b`, title `#d5d2d0`, accent `#bd8547`,
      danger `#ae2a1a`, ladder badge `#501008` on `#a19999`, patch tag `#513b2c`,
      muted `#74706c`, muted-dark `#24221c`, link `#39a9f7`, crafted `#44aa44`
- [ ] 3.2 Use `#8a8062` for gold, not `#8a8162`. The reference declares both —
      `#8a8162` in its `@theme` block, `#8a8062` in `:root` — and the unlayered
      `:root` declaration is the one that actually renders, because unlayered
      styles beat layered ones regardless of order
- [ ] 3.3 Name every token for the **role** it plays, not the hue: `property`,
      not `green-light`. Drop the reference's `--color-green` / `--color-green-light`
      pair, which in our application are only ever the runeword name and the
      property text
- [ ] 3.4 Include tokens for the table band, the two badges and the crafted
      accent even though nothing renders them yet — `IDEAS.md` settles all three
      as requirements, and defining them once here is what stops three later
      changes each picking their own dark red. Add nothing for the popover, the
      toast or the panels, where no decision exists yet
- [ ] 3.5 Set the base rules: ground colour on the page, body text colour, the
      display stack on headings. Confirm `pnpm build` emits the tokens and that
      no `tailwind.config.js` appears — Tailwind v4 theme values live in CSS

## 4. Rune sprite and cell geometry

- [ ] 4.1 Copy `vendor/runewizard/assets/runes-sprite.png` (98 434 B, 440×120) to
      `src/assets/images/`. A copy, not a move: `vendor/` is a verbatim snapshot
      whose README forbids editing it, and no module under `src/` may import from
      it, so both files exist by necessity
- [ ] 4.2 Add a test asserting the copy is byte-identical to the vendored
      original. Without it, an edit to either side of a binary file is a silent
      divergence no diff review would catch
- [ ] 4.3 Write the exported pure function that maps a rune name to its cell:
      `col = index % 11`, `row = ⌊index / 11⌋`, where `index` is the rune's
      position in `runes.json`. Build the name-to-index `Map` once
- [ ] 4.4 Keep the lookup in the theme layer, **not** in `src/data`. Sprite
      geometry is presentation; the dataset must not learn about it, and this is
      the answer to the sprite-index question `runeword-dataset` left open
- [ ] 4.5 Make an unknown rune name a surfaced failure rather than a silent
      fallback to cell zero, which would render `El` for a typo
- [ ] 4.6 Add the sprite rule to `src/index.css`, sizing the background to
      eleven by three multiples of `--rune-size` and the element to one multiple,
      with `--rune-size` defaulting to 40px. Expressing every offset in units of
      that one variable is what makes the icon resolution-independent
- [ ] 4.7 Render at **full opacity**. The reference's `opacity: 0.5` fades runes
      the player does not own, and rune inventory is a feature `IDEAS.md`
      explicitly decided against
- [ ] 4.8 Generate no stylesheet of 33 offset rules and store no sprite index.
      The cell is one expression over data already present, and a generated
      artifact would need a drift test to keep it honest

## 5. `RuneIcon` component

- [ ] 5.1 Add `src/components/RuneIcon.tsx`: takes a rune name, renders that
      rune's icon, positioned from the cell function
- [ ] 5.2 Unit-test the cell function across **all 33 runes**, not a sample. A
      wrong offset renders a real rune icon that is simply the wrong rune, so a
      sampled test is the one that lets it through
- [ ] 5.3 Assert the sprite anchors explicitly: `El` is the first cell of the
      first row, `Zod` the last cell of the last row, `Amn` last of the first,
      `Sol` first of the second
- [ ] 5.4 Assert the sprite rows match the tier bands — all 11 `common` runes on
      row 0, `semirare` on row 1, `rare` on row 2
- [ ] 5.5 Assert the component's emitted **style attribute**, not
      `getComputedStyle`. jsdom does not evaluate `calc()`, so a computed pixel
      offset cannot be read back; the pure-function test carries the real
      assertion
- [ ] 5.6 Verify the test bites: swap the column and row in the cell function,
      confirm the 33-rune test fails and names the diverging rune, then restore

## 6. Cursor and divider

- [ ] 6.1 Copy `mouse.png` and `hr-gold.gif` from `vendor/runewizard/assets/`
      into `src/assets/images/`, and cover both with the byte-identity test from
      task 4.2
- [ ] 6.2 Apply the custom pointer once at the document root with its `2 2`
      hotspot and a sensible fallback keyword
- [ ] 6.3 Do **not** copy the reference's `div { cursor: … !important }`, which
      its own source marks with a lint suppression and which makes every division
      of the page claim to be clickable. Interactive elements keep their own
      cursor, so the pointer still tells the truth about what can be clicked
- [ ] 6.4 Add the divider as a `repeat-x` background band at `0 100%`, 16px tall,
      spanning whatever width it is given — not a fixed-width `<img>`. Confirm it
      tiles cleanly at two different container widths with no seam or crop
- [ ] 6.5 Render nothing else yet. The divider's placement in the page header
      belongs to the change that builds the header

## 7. Attribution

- [ ] 7.1 Extend `NOTICE` to name the rune sprite, the pointer and the divider as
      derived from `fabd/diablo2-runewizard` under the MIT licence, alongside the
      existing `src/data/` entry
- [ ] 7.2 Add a section to `NOTICE` for Bellefair and its SIL Open Font License,
      pointing at `src/assets/fonts/OFL.txt`
- [ ] 7.3 Confirm the upstream MIT text is still at `vendor/runewizard/LICENSE`
      and the OFL text is inside `src/assets/fonts/`, each next to what it covers

## 8. Documentation corrections

- [ ] 8.1 Correct three facts in `docs/REFERENCE.md` that this change verified
      against the source: rune opacity is `0.5` not `0.75`; the divider is a
      `repeat-x` band, not a 301×32 image; the runeword name colour is green
      `#48ac3f`, not tan
- [ ] 8.2 Record in `docs/REFERENCE.md` that the reference loads Bellefair from
      Google Fonts and that we deliberately do not, so the difference reads as a
      decision rather than an oversight
- [ ] 8.3 Note that Bellefair has no Cyrillic subset, so the Phase 2 translation
      change inherits the font question rather than rediscovering it
- [ ] 8.4 Update the `IDEAS.md` Planned changes row for `d2-theme` once the
      change lands, and note that the cursor and divider arrived with it

## 9. Acceptance

- [ ] 9.1 Run the full local gate — `pnpm typecheck`, `pnpm lint`,
      `pnpm format:check`, `pnpm test`, `pnpm build` — and confirm all five exit
      zero
- [ ] 9.2 Confirm no module under `src/` imports from `vendor/`, and that
      `git status vendor/` is clean apart from the two additions and the README
- [ ] 9.3 Confirm `dist/` contains the fingerprinted font and the three images,
      and that every `url()` in the built stylesheet carries the
      `/diablo2-runeword-tracker/` prefix. A wrong `base` here passes every local
      check and breaks only once deployed, which is why CI already asserts the
      prefix for JS and CSS
- [ ] 9.4 Confirm the built page requests no third-party origin — no
      `fonts.googleapis.com`, no `fonts.gstatic.com`
- [ ] 9.5 **Look at it.** Run `pnpm dev` and compare a rune from each tier band,
      including both ends of the sprite, against the reference site. Tests prove
      the geometry; they cannot prove it renders the right picture
- [ ] 9.6 Run `openspec validate --changes d2-theme --strict`
- [ ] 9.7 Commit as `feat(theme): add diablo ii visual theme`
