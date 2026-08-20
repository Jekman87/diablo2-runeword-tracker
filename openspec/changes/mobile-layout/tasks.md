## 1. Baseline

- [x] 1.1 Copy `.claude/skills/run-app/scripts/cdp-driver.mjs` into the scratchpad
      and write one probe script that reports, per viewport width: document width,
      document height, table width, each column's width, and the median row height
- [x] 1.2 Record the baseline at 320 / 360 / 390 / 414 / 640 / 768 / 1280, in
      English and in Russian, into the change folder — the 768 and 1280 rows are
      the desktop numbers every later task is checked against

## 2. The runes render as names below `md`

- [x] 2.1 Give `RuneSequence` a variant: the icon form it renders today, and a
      names form that draws the projected rune names in sequence order with repeats
      and no sprite
- [x] 2.2 Point the row's `md:hidden` copy at the names form; leave the runes
      column's copy on the icon form, untouched
- [x] 2.3 Confirm in the browser at 390px that `Infinity` reads `Ber Mal Ber Ist`
      and that no rune icon is drawn anywhere in the table body

## 3. The crafted column is withdrawn below `md`

- [x] 3.1 Add `hidden md:table-cell` to the crafted column's `<th>`, matching the
      runes column; check that the empty-state row's `colSpan` still counts every
      declared column
- [x] 3.2 Add the `crafted-toggle` utility to `src/index.css` — absolute and
      clipped below `md`, un-clipped on `:focus-visible`, static and unclipped
      inside one `@media (width >= 48rem)` block — with a comment saying why the
      breakpoint value is restated there and nowhere else
- [x] 3.3 Apply it to `CraftedToggle`, and give the leading `<td>` no padding and
      no width below `md` so the cell contributes nothing to the table
- [x] 3.4 Check by keyboard at 390px: Tab reaches each row's toggle, the toggle
      becomes visible when focused, Space opens the confirmation, and confirming
      changes the state
- [x] 3.5 Check that the focused toggle does not obscure the runeword's name; add
      an offset if it does

## 4. The short heading

- [x] 4.1 Settle the Russian short form with the owner — the client's own
      abbreviation if it has one, recorded with where it was verified; project
      copy, recorded as project copy, if it does not
- [x] 4.2 Add the short form of the required-level heading to `src/i18n/en.ts` and
      `src/i18n/ru.ts`, beside the full form rather than replacing it
- [x] 4.3 Render both forms in `SortableHeader`, each hidden on the other side of
      `md`, and leave the accessible name built from the full form
- [x] 4.4 Confirm exactly one form is in the accessibility tree at each width

## 5. The sort indicator

- [x] 5.1 Hide the indicator span below `md` with `hidden md:block`, leaving the
      unconditional reservation above `md` exactly as it is
- [x] 5.2 Confirm at 390px that no header draws or reserves the arrow, and that
      the sorted column still carries `aria-sort` and its spoken direction

## 6. Tests

- [ ] 6.1 Update `RuneSequence.test.tsx` for the two forms: the icon form draws
      icons, the names form draws names and no icon, and both keep order and repeats
- [ ] 6.2 Update `RunewordTable.test.tsx` — the `md:table-fixed` and five
      `md:w-[…]` assertions stay, and the crafted column gains the same
      `hidden md:table-cell` assertion the runes column has
- [ ] 6.3 Add a test that the crafted-state button is present and pressed-state
      bearing on every row regardless of the column's own classes
- [ ] 6.4 Add a test that a heading with a short form renders both forms with one
      hidden on each side of `md`
- [ ] 6.5 `pnpm typecheck && pnpm lint && pnpm format:check && pnpm test`

## 7. Verification against the baseline

- [ ] 7.1 Re-run the probe at every width in both locales
- [ ] 7.2 Assert the budget: no sideways scroll at 390 and above, with the
      remaining panel open, with the help panel open, and with a query that
      matches nothing
- [ ] 7.3 Assert the non-regression: table width, all five column widths, median
      row height and document height at 768 and 1280 are identical to the baseline
- [ ] 7.4 Record the before/after table in the change folder, and screenshot
      390px in both locales
- [ ] 7.5 Check the built stylesheet has not grown a class nothing renders — the
      scan is scoped to `src/` and prose in the new comments is read for candidates

## 8. Records and hand-off

- [ ] 8.1 Move the narrow-viewport entry in `IDEAS.md` out of **Not this phase**
      and into the shipped record, with the measured before/after
- [ ] 8.2 Note in `docs/REFERENCE.md` what was taken from the reference here — the
      runes as text below `md` — and what was not
- [ ] 8.3 Leave the open questions from `design.md` that the owner has not settled
      visible in the change rather than closing them silently
- [ ] 8.4 Stop before committing: the owner reviews the round first
