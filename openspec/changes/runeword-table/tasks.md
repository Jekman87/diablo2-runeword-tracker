## 1. Display-copy layer

- [x] 1.1 Add `src/i18n/en.ts` holding a nested object of English strings, and
      derive the `Strings` type from it in `src/i18n/index.ts` so a second locale
      is typed against English rather than declared alongside it
- [x] 1.2 Export a `useStrings()` hook that returns the active locale's record.
      Today it returns English unconditionally — the hook exists so that
      `russian-locale` changes one file instead of every component that renders
      copy
- [x] 1.3 Add **no** provider, context, locale switch, persisted preference,
      plural or gender machinery, interpolation beyond what the interface actually
      renders, or i18n library. The spec forbids each by name; unused mechanism is
      harder to remove than to add
- [x] 1.4 Populate keys only as the components in groups 3 to 7 need them. A key
      with no call site is copy nobody has decided on
- [x] 1.5 Keep dataset values out of the layer — runeword names, rune names, item
      categories, property lines, restrictions and notes are canonical data. Putting
      them in would mean restating 99 records to add a locale
- [x] 1.6 Test that the English record satisfies the `Strings` type and that a
      locale omitting a key fails `pnpm typecheck`. Verify the second half by
      deleting a key and confirming the compiler names it, then restore

## 2. Theme tokens and default order

- [x] 2.1 Add `--color-row-line`, `--color-row-hover`, `--color-panel` and
      `--color-backdrop` to the `@theme` block in `src/index.css`. Name each for
      the surface it styles, per the theme's role-naming rule
- [x] 2.2 Take each value from the existing palette family — muted for the line and
      the hover, blood for the panel, black with alpha for the backdrop — rather
      than introducing a new hue. Four tokens, and nothing for the toast or the
      panels that no component here renders
- [x] 2.3 Add the default comparator: required level ascending, name as tiebreak.
      Keep it a plain exported function in its own module, not a component helper
- [x] 2.4 Apply it once at module scope over the static dataset. Sorting inside a
      component would re-sort 99 records per render, and `useMemo` around a
      constant is ceremony
- [x] 2.5 Test the comparator over the whole dataset: levels never descend, ties
      are in name order, and the result is 99 records with none lost or duplicated
- [x] 2.6 Verify the tiebreak test bites — remove the name fallback and confirm the
      test fails. Ten runewords share one level, so it should. Then restore

## 3. Property line rendering

- [x] 3.1 Split each line with `String.prototype.split` on a **capturing group**,
      so the returned array alternates plain fragments with matched values.
      Concatenation then reproduces the input by construction
- [x] 3.2 Do **not** implement this with `replace`, with injected markup, or by
      walking match indices. All three build a new string, and all three can drop a
      leading `-` — which turns `-33% Extra Gold From Monsters` into a bonus that
      looks entirely correct
- [x] 3.3 Match an optional sign, digits, an optional decimal part, an optional
      hyphenated upper bound and an optional percent sign. Requiring digits
      immediately after the sign is what keeps the standalone hyphen in
      `Adds 3-14 Cold Damage - Cold Duration 3 Seconds` from reading as a range
- [x] 3.4 Render matched fragments in `property-value` and the rest in `property`
- [x] 3.5 Test the round-trip across **all 975 property lines** in the dataset, not
      a sample: concatenating the rendered fragments equals the source line exactly
- [x] 3.6 Assert the named cases explicitly: `+50% Enhanced Defense`;
      `-33% Extra Gold From Monsters` keeping its minus; the `+8-15%` in
      `+8-15% to Cold Skill Damage` emphasised as one range; and
      `Adds 3-14 Cold Damage - Cold Duration 3 Seconds`, where the range and the
      standalone hyphen must not be confused
- [x] 3.7 Assert that a line with no digit renders as one unemphasised fragment.
      Sixty-six lines are in that case
- [x] 3.8 Verify the round-trip test bites: make the pattern consume its match,
      confirm the test fails and names the offending line, then restore
- [x] 3.9 If the derivation ever cannot satisfy the round-trip, drop the emphasis
      rather than loosening the assertion. The emphasis is the reference's
      invention, not the game's — in game a property line is one colour

## 4. Availability badges

- [x] 4.1 Render a badge per field the runeword carries: the patch value, `L` for
      ladder-only, `Note!` where a note exists. A runeword carrying none renders
      nothing — no placeholder, no empty slot
- [x] 4.2 Give each badge its full meaning as its accessible name, not the letter
      drawn on screen, and a `title` for pointer users
- [x] 4.3 Use `class-variance-authority` for the three badge variants rather than a
      hand-rolled conditional class string, and the `ladder` and `patch` tokens the
      theme already declares
- [x] 4.4 Read no availability field anywhere but here. No ordering, counting or
      conditional behaviour may branch on `ladderOnly`, `patch` or `note` —
      `runeword-dataset` requires it and this change is the first that could
      violate it
- [x] 4.5 Test that `Mosaic` renders all three, that a pre-2.4 non-ladder runeword
      renders none, and that exactly 9 rows carry the ladder marker

## 5. Row and table

- [x] 5.1 Build the table as a real `<table>` with `<th scope="col">` headers, so
      the 99 rows are navigable by row and column and `search-sort-filter` inherits
      real headers to make interactive
- [x] 5.2 Add a visually hidden `<caption>` from the strings layer
- [x] 5.3 Render the four read-only columns — name, runes, item categories,
      required level — and **no crafted-state column**. The toggle and its column
      are `crafted-tracking`
- [x] 5.4 Render the rune sequence in dataset order with repeats intact, one icon
      per socketed rune, each carrying its canonical name as its accessible label.
      `Infinity` shows four icons with `Ber` twice
- [x] 5.5 Set a smaller `--rune-size` at the row's use site. Do not restate a
      sprite offset and do not add a second icon implementation — this is the first
      real exercise of the theme's single-size-value requirement
- [x] 5.6 Join item categories as a list and add the restriction **in parentheses**
      when present. The dataset stores it bare by requirement; supplying the
      punctuation is this layer's job. 32 runewords name more than one category and
      15 carry a restriction, so both branches meet real data
- [x] 5.7 Render no parentheses at all — not an empty pair — for a runeword with no
      restriction
- [x] 5.8 Do not link item categories to their reference URL. Four of the twenty
      have none, so linking is partial by construction, and 99 rows of external
      links is noise in a column readers scan
- [x] 5.9 Separate rows with a hairline and add a hover state. No zebra striping —
      alternating backgrounds on pure black either vanish or turn muddy, and the
      reference does not stripe
- [x] 5.10 Add no sticky header. It earns its place once the headers are sort
      controls, so it belongs to the change that makes them interactive
- [x] 5.11 Do **not** adopt `rune-bg2.gif`, the question `d2-theme` left for this
      change. In the reference that tile is the background of a clickable inventory
      slot; our rune icons are an inert sequence, so a slot background would suggest
      they can be clicked
- [x] 5.12 Test that all 99 rows render, that every runeword appears exactly once,
      and that the table exposes 99 rows and its column headers by role

## 6. Responsive collapse of the runes column

- [x] 6.1 Render the rune sequence twice per row: once as the runes `<td>`, hidden
      below `md`, and once inside the name cell, hidden at `md` and above. Collapse
      the column's `<th>` with it
- [x] 6.2 Drive it from the stylesheet with Tailwind's responsive utilities. No
      `useMediaQuery`, no resize listener, no viewport measurement in application
      code — layout must not depend on script having run, and CSS has no state
      transition to flash
- [x] 6.3 Hide with `display: none` rather than visual hiding, so the inactive copy
      leaves the accessibility tree too and exactly one sequence is perceivable at
      any width
- [x] 6.4 Comment the duplication at the use site. CSS cannot move content between
      table cells, so it is a decision rather than an oversight — and it is the one
      thing in this change a reader will look at twice
- [x] 6.5 Accept the cost explicitly: up to 686 icon spans instead of 343, half of
      them not rendered

## 7. Detail view

- [x] 7.1 Make the runeword's name a real `<button>` inside its cell, not a click
      handler on the cell, so it is focusable and operable by Space and Enter
- [x] 7.2 Use **one** native `<dialog>` for the whole table, driven by state
      holding the selected runeword. Not 99 hidden panels — that would put 975
      property lines in the document for a page whose content is 99 rows
- [x] 7.3 Open with `showModal()`, which supplies the focus trap, Escape to close,
      `::backdrop`, inert content behind and focus restored to the invoking button.
      Do not hand-roll any of them
- [x] 7.4 Add backdrop click-to-dismiss against the dialog's own bounding box — the
      one dismissal `<dialog>` does not provide
- [x] 7.5 Present the name, the rune sequence with each rune's name as a label at
      full icon size, the socket count, the item categories with any restriction,
      and every property line in dataset order
- [x] 7.6 Derive the socket count from `runes.length` at the point of display.
      There is no socket field to read and none may be added — `Infinity` shows 4
- [x] 7.7 Restate patch, ladder status and the note in **full words**, so every
      fact a badge encodes has a path that needs no pointer. `Mosaic`'s caveat is
      the most actionable sentence in the dataset and the reference hides it behind
      a hover
- [x] 7.8 Test opening, Escape dismissal, focus returning to the invoking name, and
      that activating a second name replaces the first rather than showing both
- [x] 7.9 Test that `Fortitude` shows all 26 property lines in order, and that no
      detail markup is in the document while nothing is open
- [x] 7.10 Do not assert backdrop geometry or the visual dim in jsdom — it
      implements `showModal` but not layout. Those belong to the browser check in
      task 9.5

## 8. Page shell and documentation

- [x] 8.1 Replace the 33-rune grid in `src/App.tsx` with the table, keeping the
      title and the divider. The grid was `d2-theme`'s acceptance surface and 343
      rune icons in real rows replace it comprehensively
- [x] 8.2 Update `src/App.test.tsx` accordingly
- [x] 8.3 Build **no** site header. The patch line and the Help, Feedback and
      Update Notes links are in `IDEAS.md`'s Phase 1 layout and in no change;
      inventing one here is how a change stops being one feature
- [x] 8.4 Record in `IDEAS.md` that the header has no change that builds it, and
      mark the `runeword-table` row done
- [x] 8.5 Point `docs/CODE_RULES.md` at the i18n layer's actual location — its
      components rule already forbids display literals and refers to a layer that
      until now did not exist
- [x] 8.6 Note in `IDEAS.md` that `rune-bg2.gif` was settled against, so the
      question `d2-theme` left open does not get reopened by inspection

## 9. Acceptance

- [x] 9.1 Add no dependency. `clsx` and `class-variance-authority` cover the
      variants and the dialog is a platform element; a headless-UI or table library
      is the obvious reach and earns nothing at four columns and no interaction
- [x] 9.2 Confirm nothing under `src/` displays a literal string to the reader, and
      that the strings layer holds no dataset value
- [x] 9.3 Confirm no component carries a literal colour value, and that the four
      new tokens are the only ones added
- [x] 9.4 Run the full local gate — `pnpm typecheck`, `pnpm lint`,
      `pnpm format:check`, `pnpm test`, `pnpm build` — and confirm all five exit
      zero
- [x] 9.5 **Look at it.** `pnpm dev`, then check: rune icons legible at row size,
      the collapse crossing `md` in both directions with the sequence appearing
      exactly once on each side, a badge tooltip, the dialog for `Fortitude` (26
      lines) and `Mosaic` (three badges and the note), Escape and backdrop
      dismissal, and the dim actually rendering
- [x] 9.6 Check the keyboard path with no pointer at all: Tab to a name, Space to
      open, Tab within the dialog and confirm focus does not reach a row behind it,
      Escape to close, focus back on the name
- [x] 9.7 Confirm `Fortitude`'s 26 property lines and every emphasised value read
      exactly as the dataset holds them — the round-trip test proves the characters,
      not that the right ones are emphasised
- [x] 9.8 Run `openspec validate --changes runeword-table --strict`
- [x] 9.9 Commit as `feat(table): add read-only runeword table`
