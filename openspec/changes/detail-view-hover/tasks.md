## 1. Dependency and theme tokens

- [x] 1.1 Add `@floating-ui/react` as a runtime dependency. Record `pnpm build`'s
      JS and gzip size **before** adding it, so the cost is measured rather than
      estimated
      — **baseline, measured before the install:** `index.js` 313.20 kB raw /
      90.04 kB gzipped, `index.css` 16.51 kB / 4.58 kB. `@floating-ui/react`
      0.27.20 installed, pulling `@floating-ui/core`, `@floating-ui/dom`,
      `@floating-ui/react-dom`, `@floating-ui/utils` and `tabbable`
- [x] 1.2 Extend `src/test/dependencies.test.ts` to import and exercise it beside
      the four utilities already there. The requirement enumerates the set; the
      test is what makes the enumeration true
- [x] 1.3 Update the runtime dependency list in `docs/CODE_RULES.md`, which names
      the five it expects and says adding to the set is a decision a proposal must
      justify
- [x] 1.4 Replace `--color-patch` in `src/index.css` with four tokens:
      `#513B2C` shared by `1.10` and `1.11`, `#B87333` for `2.4`, `#588425` for
      `2.6`, `#7B3FE4` for `3.0`. Four and not five — the classic pair is one era
      by decision, not by coincidence
      — the shared one is `--color-patch-classic`, named for the era because a
      token covering two values cannot be named after either; the rest are
      `--color-patch-2-4`, `--color-patch-2-6` and `--color-patch-3-0`
- [x] 1.5 Add a token for the note badge's own red `#7A1F1F`. It stops borrowing
      `--color-danger`: the reference uses a different red, and "the note badge"
      and "danger" are different roles even where the values are close
      — `--color-note`, with `--color-note-label` for its white text on the
      `--color-ladder` / `--color-ladder-label` pattern already in the theme.
      `--color-patch-label` carries the patch badges' black for the same reason,
      which is also where the contrast mitigation would land
- [x] 1.6 Add `--color-item-restriction` at `#BD8547`, named for the role. Do
      **not** reuse `--color-accent`, which holds the same value: "accent" names no
      role and is already the detail view's note colour
- [x] 1.7 Use `--color-muted` for the item-type categories rather than minting a
      second token. It is already exactly the reference's `#74706C` and "muted" is
      already the role — this is the case where sharing is right
- [x] 1.8 Remove `--color-backdrop` once the `<dialog>` is gone in group 3. A
      token with no use site is the same defect as a surface with no token, and the
      theme now says so
      — done, and **the same rule took two more with it.** `--color-title` and
      `--color-danger` both had their last use site in the note badge, which now
      takes `--color-note` and `--color-note-label`, so they went for exactly the
      reason the backdrop did. Four tokens remain with no use site —
      `--color-blood-dark`, `--color-blood-light`, `--color-muted-dark`,
      `--color-link` — and this change did not orphan any of them: they were
      declared ahead of a surface, which the same requirement forbids from the other
      direction. Left for `site-header` and `remaining-panels` and recorded in
      `IDEAS.md`, because deleting tokens those changes are about to want is not
      this one's business
- [x] 1.9 Leave `--color-accent` alone. Its name is poor by the theme's own
      role-naming rule and renaming it is not this change's business — report it,
      do not fix it

## 2. Patch badge colours and the badge audit

- [x] 2.1 Add `src/runewords/patch-colour.ts`: an explicit
      `Record<string, string>` from patch value to a **full literal class string**,
      looked up with an empty-string fallback
- [x] 2.2 Do **not** build the class from the patch value. A template like
      `` `bg-patch-${patch.replace(".", "-")}` `` never appears in the source, so
      Tailwind never generates the utility — it fails silently, at build time, only
      in production, and only for the patches nobody checked
- [x] 2.3 Do **not** use `cva` here. Its variants would be keyed by the five
      literals while the dataset types `patch` as `string | undefined`, so every
      call site would need a narrowing cast; a record with a fallback says
      "unknown values are expected" directly
- [x] 2.4 Make an unrecognised patch render with no colour class — visibly plain
      and obviously unfinished — rather than inheriting another patch's colour
- [x] 2.5 Test the mapping over **the dataset's actual patch values**, asserting
      the counts the data has: 46 at `1.10`, 7 each at `1.11`, `2.4`, `2.6` and
      `3.0`, 25 with none. A test over invented values would not notice the
      generator emitting a sixth
- [x] 2.6 Test that `1.10` and `1.11` resolve to the same class and that `3.0` and
      `1.10` do not, and that an unknown value resolves to nothing
- [x] 2.7 Apply the reference's badge geometry in `AvailabilityBadges.tsx`: patch
      and `Note!` get `2px 4px` and a 4px radius; `L` gets `1px 5px` and a full
      radius. All three are 12px, which they already are
- [x] 2.8 Give the patch badges black text and `Note!` white, per the reference.
      This is the WCAG decision taken deliberately — 2.01:1 on the classic brown
      and 3.67:1 on the purple both fail AA, and the proposal records why that is
      accepted
- [x] 2.9 Change nothing about the `L` badge's colours. `#501008` on `#A19999`
      already matches the reference exactly; only its shape was ever wrong
- [x] 2.10 Keep every badge's accessible name and `title` as they are. The colour
      is an additional channel, never the only one — the meaning still has a path
      that needs no eyes at all

## 3. The detail view opens on hover

- [x] 3.1 Add `src/components/RunewordDetails.tsx` holding **both** the name button
      and the panel. They must share one floating context, which is why this is one
      component and not two
- [x] 3.2 Compose `useHover` (with a delay and `safePolygon`), `useFocus`,
      `useClick` and `useDismiss` through `useInteractions` on that context
- [x] 3.3 Give each row its own floating instance. `useHover` binds to a single
      reference element by design; one shared instance driven by a virtual
      reference means hand-rolling hover tracking across 99 buttons and
      reimplementing `safePolygon`, which is what the dependency was added to avoid
- [x] 3.4 Render the panel only while open, so the document still holds no per-row
      detail markup. That guarantee is an existing requirement and this change must
      not spend it
- [x] 3.5 Track **which trigger opened the panel** in state beside the open flag.
      `onOpenChange` reports the causing event, and that is the only moment the
      distinction exists
- [x] 3.6 Wrap the panel in `FloatingFocusManager` with `modal={true}` when it was
      opened by click, tap or keyboard focus, and `modal={false}` when opened by
      hover
      — **done as three cases, not two, because two did not work.** Written as
      specified — keyboard focus trapping alongside click — the table becomes
      impossible to tab through: focus reaching a name opens that name's panel, so
      the trap closes over the keyboard on row 1 and rows 2 to 99 are unreachable.
      Measured in Chromium before changing anything: Tab 1 the socket, Tab 2 the
      close button, Tabs 3–8 the close button again. The trap now engages on
      **activation** (click, tap, keypress) with `modal` and `initialFocus: 0`;
      keyboard focus gets a **non-modal** manager with `initialFocus: -1`; hover
      gets `disabled`. Verified: Tab now walks socket → name (panel opens, focus
      stays) → into the panel → next row's socket, all 99 reachable, and a clicked
      panel still contains focus and still returns it. `spec.md`, `design.md` and
      `proposal.md` updated to match
- [x] 3.7 Confirm a hover-opened panel **never moves focus**. A trap that engaged
      on hover would seize the keyboard as the pointer swept 99 rows
- [x] 3.8 Keep `returnFocus` so a deliberately-opened panel puts focus back on the
      name. This is the behaviour `runeword-table` verified and the one thing here
      that must not regress
- [x] 3.9 Convert `RunewordDialog.tsx` into the panel's body — same record, same
      order, same derived socket count. Nothing about its **content** changes
      — **one thing did, and the project owner is right that it should have.** The
      close button went. It was `<dialog>`'s rather than the view's: `showModal()`
      needed a first focusable element and focused it, which is what the old comment
      beside it said outright. A panel that appears when a pointer rests on a name
      is left, not closed — Escape, a press outside, or moving the pointer away.
      Nothing was lost: the panel holds no other control, so no keyboard reach went
      with it, and `aria-expanded` / `aria-controls` on the name is what announces
      the panel either way. Verified after removing it — a clicked panel focuses the
      panel itself and still contains focus, Escape still returns focus to the name,
      Tab still walks the whole table, and the focus ring appears only for keyboard
      because `:focus-visible` already draws that line. `strings.detail.close` went
      too: copy nothing renders is the same defect as a token nothing renders
- [x] 3.10 Drop the `<dialog>`, `showModal()` and the backdrop. A hover panel has
      no business dimming the page
- [x] 3.11 Remove the jsdom `showModal` shim from `src/test/setup.ts`. It existed
      only for the `<dialog>`, and the tests stop asserting against a stand-in for
      the platform
- [x] 3.12 Remove `selected` state and the shared dialog from `RunewordTable.tsx`,
      and `onSelect` from `RunewordRow.tsx`
- [x] 3.13 Test all three triggers open the same panel: hover with pointer events
      and no click, focus alone, and click
- [x] 3.14 Test Escape closes, focus returns to the name, and focus is contained
      for a deliberately-opened panel and **not** contained for a hover-opened one
      — and, following 3.6, not contained for a focus-opened one either: two tests
      cover that a focus-opened panel leaves focus on the name and does not hide the
      table behind it. Where focus lands _past_ the panel is left to 7.9, because
      jsdom has no layout for the focus manager's boundary guards
- [x] 3.15 Test that hovering a second name replaces the first panel rather than
      showing both
- [x] 3.16 Leave `safePolygon` geometry and the open delay to the browser checks.
      jsdom has no layout, so asserting them here would assert nothing

## 4. Rune icons get their names

- [x] 4.1 Extract `src/components/RuneSequence.tsx` from `RunewordRow.tsx`. It is
      no longer a row of icons and has earned its own file and its own test
- [x] 4.2 Render each rune as its icon with its canonical name directly beneath,
      the way the detail view already draws them
- [x] 4.3 Draw row icons at **40px**, the sprite's native cell. Set it through the
      one size value the theme exposes — no restated offset, no second icon
      implementation
- [x] 4.4 Draw nothing above 40px anywhere. The sprite is 40×40 and upscaling
      softens the artwork; this is now a requirement, not a preference
- [x] 4.5 Add an option to `RuneIcon.tsx` to render decoratively — `aria-hidden`
      instead of `role="img"` with a label. Without it a screen reader announces
      686 names for a table of 343 runes
- [x] 4.6 Take rune names from the dataset, never the strings layer. They are
      canonical identifiers and `ui-strings` already forbids the layer holding
      dataset values
- [x] 4.7 Keep dataset order and repeats. `Infinity` is `Ber Mal Ber Ist` with
      `Ber` drawn twice, and it has a test already — make sure the test still reads
      the sequence rather than the labels only
- [x] 4.8 Keep the responsive collapse working: the runes move under the name below
      `md`, and the sequence is perceivable exactly once on each side of the
      breakpoint. Both copies now carry labels, so the duplication costs more than
      it did
- [x] 4.9 Test that each rune's name is present as text in the row, and that the
      icon beside it is not separately announced
- [x] 4.10 Record the measured row height and total table height after the change,
      against the ~41px and ~4060px they are now. The estimate is 75px and ~7430px
      — **measured in Chromium at 1280×800, and the estimate was exact:** row
      **75.0px**, `tbody` **7424.5px**, table 7489px, document 7725px. The icon is
      40×40 with a 12px label in a 16px line-box and a 2px gap, which is the
      arithmetic the design predicted. Against the previous build measured the
      same way — 41px and 4245px — that is 1.83× the row and 1.75× the scroll.
      The widest rune cell is **276px** across six runes, against the ~260px
      estimated and ~154px before.
      — **Below `md` the figures are larger, and were never estimated.** The runes
      collapse into the name cell, so the row carries the sequence's height rather
      than standing beside it: at 390px a row is **103px** and `tbody` **10197px**,
      against 69px and 7103px before — 1.49× the row and 1.44× the scroll.
      Recorded because the design's table covers only the wide layout.

## 5. The item-type restriction

- [x] 5.1 Replace `itemTypesLabel` with `src/components/ItemTypes.tsx`. A function
      returning `string` cannot carry two colours on two lines
- [x] 5.2 Use it in both the row and the panel, exactly as the function was used,
      so the two still render from one place
- [x] 5.3 Render the categories in `--color-muted` at 13px, and the restriction
      beneath them in `--color-item-restriction` at `0.9em` — the reference's own
      values
      — **the `0.9em` needs something to be relative to, and looking at it is what
      showed which.** Written flat, the categories take 13px and the restriction's
      `em` resolves against the cell's inherited 16px, giving **14.4px** — the
      exclusion rendering _larger_ than the category it qualifies, which is not
      what the reference means. The 13px moved onto a wrapper so the `em` nests
      inside it, as the reference's own nesting does, and the restriction now
      measures 11.7px against 13px. Verified in Chromium: categories 13px
      `rgb(116 112 108)`, restriction 11.7px `rgb(189 133 71)`
      — **then the size itself was overruled: 14px, not the reference's 13px.**
      Looked at on the deployed layout, 13px made the base-items column the hardest
      thing on the page to read, and the project owner asked for it a step larger.
      The **ratio** is what was worth copying from the reference and it is
      untouched, so the restriction follows to 12.6px and the two still read as a
      heading and its footnote. Measured after the change: categories **14px**,
      restriction **12.6px**, row height unchanged at 75px — the rune sequence sets
      the row, not this column. The colours are still the reference's exactly
- [x] 5.4 Replace `strings.itemTypes.withRestriction(categories, restriction)`
      with an entry that brackets the restriction alone. The two halves are two
      elements now, so a function joining them into one string no longer fits
- [x] 5.5 Keep the parentheses in the strings layer and the restriction text in the
      dataset. Punctuation is copy; the words are data
- [x] 5.6 Render no line at all where there is no restriction — no empty
      parentheses and no empty row. Eighty-four of the 99 have none
- [x] 5.7 Update the tests that assert on `Staves (Not Orbs/Wands)` as one string.
      The text is split across two elements now, so a single `getByText` will stop
      matching
- [x] 5.8 Do not name anything after the reference's `rw-ItemTypes-class`. The
      field holds `(Not Orbs/Wands)` as readily as `(Assassin)`, so the name
      describes only half of what it holds

## 6. Documentation

- [x] 6.1 Record in `IDEAS.md` that item-type restrictions are **dataset content in
      English** — `(Assassin)`, `(Barbarian)`, `(Not Orbs/Wands)` — and are the
      second dataset field after runeword names that `russian-locale` must source
      from the game client. Giving them their own colour makes them visibly their
      own field, which is what makes the omission easy to miss late
- [x] 6.2 Record that `--color-accent` holds the same value as
      `--color-item-restriction` for an unrelated role, and is poorly named by the
      theme's own rule. Reported, deliberately not fixed
- [x] 6.3 Record the badge contrast decision: the reference's black-on-brown scores
      2.01:1 and black-on-purple 3.67:1, both below AA, adopted knowingly. If it is
      ever revisited the fix is one foreground per token
- [x] 6.4 Note that `runeword-table`'s "add no dependency" decision was reversed
      here, and why — so the next change reads it as a decision that was revisited
      rather than one that was forgotten

## 7. Acceptance

- [x] 7.1 Confirm no component carries a literal colour value, and that the badge
      colours and the restriction colour all resolve through tokens
- [x] 7.2 Confirm no class name anywhere is assembled from a data value. Grep the
      built stylesheet for each of the four patch utilities and confirm all four
      survived the build
      — all four present, resolving through their tokens, and the whole production
      build read in a browser rather than only the dev server: every badge colour,
      both item-type sizes, the 40px icon, the 75px row and the `md` collapse are
      correct from the built CSS
      — **and the same build-time scan turned out to work in the other direction
      too.** Tailwind v4 scans the entire project root, so the words "focus ring"
      in a sentence in _this file_ generated `.ring` and its `@property` block and
      put 1.5 kB into the stylesheet. Prose about an interface is full of words
      that look like utilities — ring, grid, table, block, hidden, transition — so
      the default makes the stylesheet grow with the documentation, silently, with
      nothing rendering any of it. Scoped to `source(none)` plus
      `@source "./**/*.{ts,tsx}"`, which dropped **eighteen** such rules and took
      the CSS from 17.20 kB to **14.14 kB** (4.58 → 4.11 kB gzipped) — smaller than
      before this change started, despite six new tokens. Every utility the
      application actually uses was checked present afterwards, responsive and
      arbitrary-value ones included
- [x] 7.3 Confirm nothing under `src/` displays a literal string to the reader, and
      that the strings layer still holds no dataset value — rune names and
      restriction text both stayed out of it
- [x] 7.4 Confirm `--color-backdrop` is gone and no token is left without a use
      site
- [x] 7.5 Run the full local gate — `pnpm typecheck`, `pnpm lint`,
      `pnpm format:check`, `pnpm test`, `pnpm build` — and confirm all five exit
      zero
- [x] 7.6 Report the bundle delta from `@floating-ui/react` against the figure
      recorded in task 1.1
      — **it costs about twice what the proposal estimated.** JS 313.20 → 398.05 kB
      raw and **90.04 → 118.37 kB gzipped: +28.3 kB**, against the "region of
      10–15 kB" the proposal expected. CSS 16.51 → 17.12 kB (4.58 → 4.71 kB
      gzipped) for the six new tokens. The estimate was wrong by a factor of two,
      and it is worth saying so outright rather than reporting the delta alone:
      `@floating-ui/react` pulls `@floating-ui/dom`, `@floating-ui/core`,
      `@floating-ui/utils` and `tabbable`, and the interaction hooks are the bulk
      of it. It buys `flip`, `shift` and `safePolygon`, all three of which were
      verified working in 7.8 and none of which is decoration
- [x] 7.7 Measure the render cost of 99 floating contexts. If it is visible on
      interaction, say so with a number rather than shipping it quietly
      — **mount cost is real and bounded; interaction cost is not paid at all.**
      Rendering 99 `RunewordDetails` against 99 plain buttons in jsdom, median of
      twelve runs: **3.2ms → 25.0ms, so +21.8ms** for the floating contexts. The
      whole table mounts in ~88ms, so they are roughly a quarter of it, paid once.
      Nothing measurable happens on interaction, and that is structural rather than
      lucky: `open` lives inside `RunewordDetails`, so opening a panel re-renders
      one row's subtree and not the table. (An attempt to time the open itself
      returned ~83ms, which is `userEvent`'s own event simulation in jsdom rather
      than React work, so it is reported as unattributable rather than as a result.)
- [x] 7.8 **Look at it.** `pnpm dev`, then: hover a name and watch the panel open
      after the delay; move the pointer from the name into the panel and confirm it
      does not close; hover a row near the bottom and confirm the panel flips above
      the pointer; hover one at the viewport edge and confirm it shifts inward
      — **all four confirmed in Chromium.** Hover: zero panels immediately after
      the pointer arrives, one after the delay. Travelling from the name across the
      8px gap into the panel: still open, so `safePolygon` is doing its job.
      Bottom row (`Void`, name at y=686): panel renders at y=128 with its bottom
      edge at 678, i.e. **flipped above** the name. Narrow viewport (420px): panel
      at x=102, right edge 399 against a 420px viewport, i.e. **shifted inward**.
      Screenshots taken of each
      — **one thing worth recording that is not a regression:** below about 542px
      the page scrolls horizontally. It did before this change too — 390px overflowed
      by 74px on the previous build — and this change widens it to 152px, because
      below `md` the runes collapse into the name cell and that cell goes from 170px
      to 276px. Pre-existing, made worse, and outside what any requirement here
      covers, so it is recorded in `IDEAS.md` rather than fixed
- [x] 7.9 Check the keyboard path with no pointer at all: Tab to a name, confirm
      the panel opens on focus, Tab within it and confirm focus does not reach the
      table behind, Escape, and confirm focus is back on the name
      — **this is the check that found the change's one real defect**, and the task
      as written asks for the behaviour that was wrong. Trapping a focus-opened
      panel made rows 2 to 99 unreachable by keyboard; see 3.6. After the fix,
      measured in Chromium with no pointer involved: Tab 1 row 1's socket, Tab 2 its
      name — **panel opens and focus stays on the name** — Tab 3 the panel's close
      button, Tab 4 row 2's socket with the panel closing behind it, Tab 5 row 2's
      name, and so on down the table. Escape from a name closes the panel and leaves
      focus on that name. A panel opened by **clicking** still contains focus — four
      consecutive Tabs stay on its close button — and Escape still returns focus to
      the name, which is the one behaviour that must not regress and does not
- [x] 7.10 Check a touch device or emulation: tap opens the panel, and tapping
      outside dismisses it
      — both confirmed in an emulated iPhone context (390×844, `hasTouch`). Worth
      noting why it works: `useHover` is `mouseOnly`, so a tap does not open the
      panel by "hover" and then leave it in the state a hover-opened panel is in.
      Touch goes through the click path, where it is a deliberate act
- [x] 7.11 Compare all five badge colours and all three badge shapes against the
      reference side by side
      — **all seven properties match, read from `getComputedStyle`.** Patch badges:
      black text, 4px radius, `2px 4px`, 12px, and `1.10`/`1.11` both
      `rgb(81 59 44)` = `#513B2C`, `2.4` `rgb(184 115 51)` = `#B87333`, `2.6`
      `rgb(88 132 37)` = `#588425`, `3.0` `rgb(123 63 228)` = `#7B3FE4`. `L`:
      `rgb(80 16 8)` on `rgb(161 153 153)`, fully rounded, `1px 5px`. `Note!`:
      `rgb(122 31 31)` = `#7A1F1F` with white text, 4px radius, `2px 4px`
- [x] 7.12 Confirm the rune column is actually readable at 40px with labels, which
      is the entire point of the change and the one thing no test can assert
      — **yes.** Looked at rather than asserted: the icons are large enough to tell
      apart and every one carries its name beneath it, so `Nef Tir`, `Tir El`,
      `Ith El Eth` read off the rows without knowing a single silhouette. This is
      the defect the change existed to fix and it is fixed
- [x] 7.13 Cross the `md` breakpoint in both directions and confirm the rune
      sequence appears exactly once on each side, labels included
      — confirmed by counting icons with a client rect on each side. At 420px the
      name cell shows its sequence and the runes column shows none; at 900px the
      reverse. Exactly one sequence is perceivable at either width, labels included
- [x] 7.14 Run `openspec validate --changes detail-view-hover --strict`
- [x] 7.15 Commit as `fix(table): open details on hover, colour badges, label runes`
