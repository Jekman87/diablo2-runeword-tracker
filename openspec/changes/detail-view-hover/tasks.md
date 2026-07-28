## 1. Dependency and theme tokens

- [ ] 1.1 Add `@floating-ui/react` as a runtime dependency. Record `pnpm build`'s
      JS and gzip size **before** adding it, so the cost is measured rather than
      estimated
- [ ] 1.2 Extend `src/test/dependencies.test.ts` to import and exercise it beside
      the four utilities already there. The requirement enumerates the set; the
      test is what makes the enumeration true
- [ ] 1.3 Update the runtime dependency list in `docs/CODE_RULES.md`, which names
      the five it expects and says adding to the set is a decision a proposal must
      justify
- [ ] 1.4 Replace `--color-patch` in `src/index.css` with four tokens:
      `#513B2C` shared by `1.10` and `1.11`, `#B87333` for `2.4`, `#588425` for
      `2.6`, `#7B3FE4` for `3.0`. Four and not five — the classic pair is one era
      by decision, not by coincidence
- [ ] 1.5 Add a token for the note badge's own red `#7A1F1F`. It stops borrowing
      `--color-danger`: the reference uses a different red, and "the note badge"
      and "danger" are different roles even where the values are close
- [ ] 1.6 Add `--color-item-restriction` at `#BD8547`, named for the role. Do
      **not** reuse `--color-accent`, which holds the same value: "accent" names no
      role and is already the detail view's note colour
- [ ] 1.7 Use `--color-muted` for the item-type categories rather than minting a
      second token. It is already exactly the reference's `#74706C` and "muted" is
      already the role — this is the case where sharing is right
- [ ] 1.8 Remove `--color-backdrop` once the `<dialog>` is gone in group 3. A
      token with no use site is the same defect as a surface with no token, and the
      theme now says so
- [ ] 1.9 Leave `--color-accent` alone. Its name is poor by the theme's own
      role-naming rule and renaming it is not this change's business — report it,
      do not fix it

## 2. Patch badge colours and the badge audit

- [ ] 2.1 Add `src/runewords/patch-colour.ts`: an explicit
      `Record<string, string>` from patch value to a **full literal class string**,
      looked up with an empty-string fallback
- [ ] 2.2 Do **not** build the class from the patch value. A template like
      `` `bg-patch-${patch.replace(".", "-")}` `` never appears in the source, so
      Tailwind never generates the utility — it fails silently, at build time, only
      in production, and only for the patches nobody checked
- [ ] 2.3 Do **not** use `cva` here. Its variants would be keyed by the five
      literals while the dataset types `patch` as `string | undefined`, so every
      call site would need a narrowing cast; a record with a fallback says
      "unknown values are expected" directly
- [ ] 2.4 Make an unrecognised patch render with no colour class — visibly plain
      and obviously unfinished — rather than inheriting another patch's colour
- [ ] 2.5 Test the mapping over **the dataset's actual patch values**, asserting
      the counts the data has: 46 at `1.10`, 7 each at `1.11`, `2.4`, `2.6` and
      `3.0`, 25 with none. A test over invented values would not notice the
      generator emitting a sixth
- [ ] 2.6 Test that `1.10` and `1.11` resolve to the same class and that `3.0` and
      `1.10` do not, and that an unknown value resolves to nothing
- [ ] 2.7 Apply the reference's badge geometry in `AvailabilityBadges.tsx`: patch
      and `Note!` get `2px 4px` and a 4px radius; `L` gets `1px 5px` and a full
      radius. All three are 12px, which they already are
- [ ] 2.8 Give the patch badges black text and `Note!` white, per the reference.
      This is the WCAG decision taken deliberately — 2.01:1 on the classic brown
      and 3.67:1 on the purple both fail AA, and the proposal records why that is
      accepted
- [ ] 2.9 Change nothing about the `L` badge's colours. `#501008` on `#A19999`
      already matches the reference exactly; only its shape was ever wrong
- [ ] 2.10 Keep every badge's accessible name and `title` as they are. The colour
      is an additional channel, never the only one — the meaning still has a path
      that needs no eyes at all

## 3. The detail view opens on hover

- [ ] 3.1 Add `src/components/RunewordDetails.tsx` holding **both** the name button
      and the panel. They must share one floating context, which is why this is one
      component and not two
- [ ] 3.2 Compose `useHover` (with a delay and `safePolygon`), `useFocus`,
      `useClick` and `useDismiss` through `useInteractions` on that context
- [ ] 3.3 Give each row its own floating instance. `useHover` binds to a single
      reference element by design; one shared instance driven by a virtual
      reference means hand-rolling hover tracking across 99 buttons and
      reimplementing `safePolygon`, which is what the dependency was added to avoid
- [ ] 3.4 Render the panel only while open, so the document still holds no per-row
      detail markup. That guarantee is an existing requirement and this change must
      not spend it
- [ ] 3.5 Track **which trigger opened the panel** in state beside the open flag.
      `onOpenChange` reports the causing event, and that is the only moment the
      distinction exists
- [ ] 3.6 Wrap the panel in `FloatingFocusManager` with `modal={true}` when it was
      opened by click, tap or keyboard focus, and `modal={false}` when opened by
      hover
- [ ] 3.7 Confirm a hover-opened panel **never moves focus**. A trap that engaged
      on hover would seize the keyboard as the pointer swept 99 rows
- [ ] 3.8 Keep `returnFocus` so a deliberately-opened panel puts focus back on the
      name. This is the behaviour `runeword-table` verified and the one thing here
      that must not regress
- [ ] 3.9 Convert `RunewordDialog.tsx` into the panel's body — same record, same
      order, same derived socket count. Nothing about its **content** changes
- [ ] 3.10 Drop the `<dialog>`, `showModal()` and the backdrop. A hover panel has
      no business dimming the page
- [ ] 3.11 Remove the jsdom `showModal` shim from `src/test/setup.ts`. It existed
      only for the `<dialog>`, and the tests stop asserting against a stand-in for
      the platform
- [ ] 3.12 Remove `selected` state and the shared dialog from `RunewordTable.tsx`,
      and `onSelect` from `RunewordRow.tsx`
- [ ] 3.13 Test all three triggers open the same panel: hover with pointer events
      and no click, focus alone, and click
- [ ] 3.14 Test Escape closes, focus returns to the name, and focus is contained
      for a deliberately-opened panel and **not** contained for a hover-opened one
- [ ] 3.15 Test that hovering a second name replaces the first panel rather than
      showing both
- [ ] 3.16 Leave `safePolygon` geometry and the open delay to the browser checks.
      jsdom has no layout, so asserting them here would assert nothing

## 4. Rune icons get their names

- [ ] 4.1 Extract `src/components/RuneSequence.tsx` from `RunewordRow.tsx`. It is
      no longer a row of icons and has earned its own file and its own test
- [ ] 4.2 Render each rune as its icon with its canonical name directly beneath,
      the way the detail view already draws them
- [ ] 4.3 Draw row icons at **40px**, the sprite's native cell. Set it through the
      one size value the theme exposes — no restated offset, no second icon
      implementation
- [ ] 4.4 Draw nothing above 40px anywhere. The sprite is 40×40 and upscaling
      softens the artwork; this is now a requirement, not a preference
- [ ] 4.5 Add an option to `RuneIcon.tsx` to render decoratively — `aria-hidden`
      instead of `role="img"` with a label. Without it a screen reader announces
      686 names for a table of 343 runes
- [ ] 4.6 Take rune names from the dataset, never the strings layer. They are
      canonical identifiers and `ui-strings` already forbids the layer holding
      dataset values
- [ ] 4.7 Keep dataset order and repeats. `Infinity` is `Ber Mal Ber Ist` with
      `Ber` drawn twice, and it has a test already — make sure the test still reads
      the sequence rather than the labels only
- [ ] 4.8 Keep the responsive collapse working: the runes move under the name below
      `md`, and the sequence is perceivable exactly once on each side of the
      breakpoint. Both copies now carry labels, so the duplication costs more than
      it did
- [ ] 4.9 Test that each rune's name is present as text in the row, and that the
      icon beside it is not separately announced
- [ ] 4.10 Record the measured row height and total table height after the change,
      against the ~41px and ~4060px they are now. The estimate is 75px and ~7430px

## 5. The item-type restriction

- [ ] 5.1 Replace `itemTypesLabel` with `src/components/ItemTypes.tsx`. A function
      returning `string` cannot carry two colours on two lines
- [ ] 5.2 Use it in both the row and the panel, exactly as the function was used,
      so the two still render from one place
- [ ] 5.3 Render the categories in `--color-muted` at 13px, and the restriction
      beneath them in `--color-item-restriction` at `0.9em` — the reference's own
      values
- [ ] 5.4 Replace `strings.itemTypes.withRestriction(categories, restriction)`
      with an entry that brackets the restriction alone. The two halves are two
      elements now, so a function joining them into one string no longer fits
- [ ] 5.5 Keep the parentheses in the strings layer and the restriction text in the
      dataset. Punctuation is copy; the words are data
- [ ] 5.6 Render no line at all where there is no restriction — no empty
      parentheses and no empty row. Eighty-four of the 99 have none
- [ ] 5.7 Update the tests that assert on `Staves (Not Orbs/Wands)` as one string.
      The text is split across two elements now, so a single `getByText` will stop
      matching
- [ ] 5.8 Do not name anything after the reference's `rw-ItemTypes-class`. The
      field holds `(Not Orbs/Wands)` as readily as `(Assassin)`, so the name
      describes only half of what it holds

## 6. Documentation

- [ ] 6.1 Record in `IDEAS.md` that item-type restrictions are **dataset content in
      English** — `(Assassin)`, `(Barbarian)`, `(Not Orbs/Wands)` — and are the
      second dataset field after runeword names that `russian-locale` must source
      from the game client. Giving them their own colour makes them visibly their
      own field, which is what makes the omission easy to miss late
- [ ] 6.2 Record that `--color-accent` holds the same value as
      `--color-item-restriction` for an unrelated role, and is poorly named by the
      theme's own rule. Reported, deliberately not fixed
- [ ] 6.3 Record the badge contrast decision: the reference's black-on-brown scores
      2.01:1 and black-on-purple 3.67:1, both below AA, adopted knowingly. If it is
      ever revisited the fix is one foreground per token
- [ ] 6.4 Note that `runeword-table`'s "add no dependency" decision was reversed
      here, and why — so the next change reads it as a decision that was revisited
      rather than one that was forgotten

## 7. Acceptance

- [ ] 7.1 Confirm no component carries a literal colour value, and that the badge
      colours and the restriction colour all resolve through tokens
- [ ] 7.2 Confirm no class name anywhere is assembled from a data value. Grep the
      built stylesheet for each of the four patch utilities and confirm all four
      survived the build
- [ ] 7.3 Confirm nothing under `src/` displays a literal string to the reader, and
      that the strings layer still holds no dataset value — rune names and
      restriction text both stayed out of it
- [ ] 7.4 Confirm `--color-backdrop` is gone and no token is left without a use
      site
- [ ] 7.5 Run the full local gate — `pnpm typecheck`, `pnpm lint`,
      `pnpm format:check`, `pnpm test`, `pnpm build` — and confirm all five exit
      zero
- [ ] 7.6 Report the bundle delta from `@floating-ui/react` against the figure
      recorded in task 1.1
- [ ] 7.7 Measure the render cost of 99 floating contexts. If it is visible on
      interaction, say so with a number rather than shipping it quietly
- [ ] 7.8 **Look at it.** `pnpm dev`, then: hover a name and watch the panel open
      after the delay; move the pointer from the name into the panel and confirm it
      does not close; hover a row near the bottom and confirm the panel flips above
      the pointer; hover one at the viewport edge and confirm it shifts inward
- [ ] 7.9 Check the keyboard path with no pointer at all: Tab to a name, confirm
      the panel opens on focus, Tab within it and confirm focus does not reach the
      table behind, Escape, and confirm focus is back on the name
- [ ] 7.10 Check a touch device or emulation: tap opens the panel, and tapping
      outside dismisses it
- [ ] 7.11 Compare all five badge colours and all three badge shapes against the
      reference side by side
- [ ] 7.12 Confirm the rune column is actually readable at 40px with labels, which
      is the entire point of the change and the one thing no test can assert
- [ ] 7.13 Cross the `md` breakpoint in both directions and confirm the rune
      sequence appears exactly once on each side, labels included
- [ ] 7.14 Run `openspec validate --changes detail-view-hover --strict`
- [ ] 7.15 Commit as `fix(table): open details on hover, colour badges, label runes`
