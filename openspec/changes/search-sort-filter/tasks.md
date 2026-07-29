## 1. The slot mapping

- [ ] 1.1 Create `src/runewords/slots.ts` declaring the four slots and a
      `Record<string, Slot>` over all 20 base item categories, plus a
      `slotOf(category)` lookup
- [ ] 1.2 Map `Grimoire` to the shield slot. It occurs on seven runewords and on
      every one of them beside `Shields`, so an off-hand runeword is a shield-slot
      runeword and any other mapping answers the wrong filter
- [ ] 1.3 Map `Weapons`, `Melee Weapons` and `Missile Weapons` to the weapon slot
      along with the twelve specific weapon categories, `Helms` to helm,
      `Body Armors` to body armour, and `Shields` and `Paladin Shields` to shield
- [ ] 1.4 Put nothing in `src/data/`, `item-types.json` or the generator. The slot
      is this project's grouping of vendored categories, `vendor/` is read-only, and
      a generator emitting a field with no source is the defect its own rules exist
      to prevent
- [ ] 1.5 Export `slotsOf(runeword)` returning the distinct slots a runeword
      occupies, so `Fortitude` yields weapon and body armour
- [ ] 1.6 Test that every category named by any of the 99 runewords resolves, so a
      category new to us fails the suite instead of making its runewords unreachable
      by every slot
- [ ] 1.7 Test the per-slot totals against the dataset — 14 helm, 22 body armour,
      10 shield, 58 weapon — and that the five multi-slot runewords (`Dragon`,
      `Dream`, `Fortitude`, `Phoenix`, `Spirit`) appear under each slot they name

## 2. Search and sort as pure functions

- [ ] 2.1 Create `src/runewords/search.ts` with `matchesQuery(runeword, query)` —
      case-insensitive substring over the name, every item category and the
      restriction, with a trimmed empty query matching everything
- [ ] 2.2 Match no rune. `IDEAS.md` settles that rune search is dropped, because the
      reference expresses the rune relationship through an inventory we do not track
- [ ] 2.3 Use `toLowerCase()` and `includes()`, with no normalisation and no
      collator. The dataset is ASCII throughout and the build already depends on
      that for its font subset; `russian-locale` introduces the text that makes
      collation a real question and owns it then
- [ ] 2.4 Test the three fields separately: `lea` finding `Leaf`, `armor` finding
      all 22 `Body Armors` runewords by a fragment mid-word, and `assassin` finding
      `Chaos`, `Pattern`, `Mosaic` and `Treachery` through the restriction alone
- [ ] 2.5 Test that a rune name matches nothing on account of being a rune, that
      case is ignored, that a padded query behaves as its trimmed form, and that an
      empty query removes no row
- [ ] 2.6 Create `src/runewords/sort.ts` with the five sort keys — crafted state,
      name, `runes.length`, `itemTypes[0]`, `requiredLevel` — and a comparator
      factory taking the key, the direction and the crafted set
- [ ] 2.7 End every comparator in `byRequiredLevel` from `src/runewords/order.ts`
      rather than a second copy of level-then-name. That function was exported and
      commented as this change's default comparator; this is the second caller it
      was written for
- [ ] 2.8 Negate the key comparison only when descending, leaving the tiebreak
      ascending, so a descending presentation is not the ascending one reversed
- [ ] 2.9 Make crafted ascending put un-crafted rows first — `false` before `true`,
      which is both the arithmetic and the useful direction for a tracker
- [ ] 2.10 Test each key in both directions, that the 45 three-socket runewords fall
      into level-then-name order among themselves, that the tiebreak stays ascending
      when the key reverses, and that the same inputs always produce the same
      sequence
- [ ] 2.11 Test that the rune column's order comes from socket count and not from
      the rune names as text, and that no comparator reads `ladderOnly`, `patch` or
      `note`

## 3. The visible rows

- [ ] 3.1 Create `src/view/types.ts` declaring the settings shape — the sort key,
      the direction, the crafted filter and the slot filter — and the default value
      of each. No search field: the query is session state and is never stored
- [ ] 3.2 Create `src/view/visible.ts` with
      `visibleRunewords(runewords, settings, query, crafted)` — filter by search ∧
      crafted ∧ slot, then sort — returning a new array and taking the dataset as a
      parameter rather than importing it
- [ ] 3.3 Filter before sorting. Sorting 99 rows and discarding 88 is the same
      answer for more work
- [ ] 3.4 Return a new array rather than sorting in place. `@/data` hands out the
      dataset in the vendor's order and other consumers are entitled to find it
      that way
- [ ] 3.5 Test the conjunction: all three narrowing at once, each control
      independent of the others, and the same settings reached by two different
      interaction sequences producing the same rows
- [ ] 3.6 Test that a filter does not influence the order — that a row present under
      a filter is in the position the sort gives it with the filter cleared

## 4. View persistence

- [ ] 4.1 Create `src/view/storage.ts` exporting `loadViewSettings()` and
      `saveViewSettings()`. Plain functions, no React import, so the failure modes
      are testable without rendering anything
- [ ] 4.2 Use the key `diablo2-runeword-tracker:view:v1` — namespaced because
      GitHub Pages serves every project under the account from one origin with one
      `localStorage`, versioned in the key so a v2 writes elsewhere
- [ ] 4.3 Keep it a **separate key and a separate module** from
      `src/crafted/storage.ts`. Discarding an unusable sort setting must not be able
      to take a player's progress with it, and one write path would have to know
      which half of its payload may be discarded
- [ ] 4.4 Validate with a `zod` schema of four enums, not a cast, and reject the
      **whole record** when any member is unrecognised. Merging field by field would
      leave the view in a state no version of the interface can produce
- [ ] 4.5 Fall back to the defaults on absent, malformed or rejected data, and
      overwrite on the next change — the opposite of `progress-persistence`, and for
      the stated reason: a sorted column is not the player's work and nobody will
      hand-repair one
- [ ] 4.6 Guard every storage access inside this module, on both the read and the
      write path, so no component knows that storage can fail
- [ ] 4.7 Test a round trip; malformed JSON; valid JSON of the wrong shape; an
      unrecognised sort key or filter falling back whole; and a throwing storage on
      both paths
- [ ] 4.8 Test that loading writes nothing, whether it succeeded or failed

## 5. The view settings hook

- [ ] 5.1 Create `src/view/useViewSettings.ts` owning the settings, the search
      query, a setter per control, and a reset
- [ ] 5.2 Initialise from `loadViewSettings()` in a lazy `useState` initialiser
      rather than an effect, so the first paint is already the restored view with no
      frame of the full table before it
- [ ] 5.3 Initialise the query to empty always. It is deliberately not persisted
- [ ] 5.4 Call `saveViewSettings()` from the setters, **never from an effect**. An
      effect fires on mount and would write over a value that failed to parse before
      the player touched anything
- [ ] 5.5 Make the sort setter take the key as an argument and flip the direction
      when it is already the sorted column, adopting ascending when it is not
- [ ] 5.6 Have the reset clear the query and return both filters to presenting
      everything, and leave the sort alone — resetting is about what is hidden, not
      about the order
- [ ] 5.7 Expose whether the view is narrowed, so the reset control can be present
      only when it would do something
- [ ] 5.8 Test the setters, the two-state direction flip, the reset, that the query
      does not survive a remount while the filters do, and that mounting performs no
      write

## 6. The control bar

- [ ] 6.1 Create `src/components/RunewordControls.tsx` — the search field, the two
      filter groups, the result count and the reset — taking the settings, the query
      and the setters as props
- [ ] 6.2 Make the search field a labelled `<input type="search">` with its label
      from the copy layer, not a placeholder standing in for one
- [ ] 6.3 Render each filter as a `<fieldset>` with a `<legend>` and radio inputs
      styled as chips. Radio semantics say "one of these" without a sentence
      explaining it, arrow-key movement comes for free, and the legend names the
      group for a reader arriving out of context
- [ ] 6.4 Add no debounce. Filtering 99 records already in memory is one pass, and a
      debounce would add latency to every keystroke to save work that does not exist
- [ ] 6.5 State the count as presented-of-total in a polite live region, so a reader
      who cannot see 99 rows become eleven is told that they did, without focus
      moving
- [ ] 6.6 Render the reset control only while the view is narrowed. A permanent
      "Clear filters" on an unfiltered page is a control that does nothing, which is
      the same defect as a token with no use site
- [ ] 6.7 Let the bar wrap on a narrow viewport. The table's sideways scroll below
      about 542px is a pre-existing defect recorded in `IDEAS.md`; this must not add
      to it
- [ ] 6.8 Test the search field, both filter groups by role, the count's text and
      its live region, and that the reset appears and disappears with the view's
      narrowed state

## 7. Sortable headers and the table

- [ ] 7.1 Create `src/components/SortableHeader.tsx` — a `<button>` inside the
      `<th scope="col">` it heads, receiving whether it is the sorted column and in
      which direction, and calling one callback with its key
- [ ] 7.2 Put `aria-sort` on the `<th>` of the sorted column only, and leave it
      absent rather than `"none"` on the other four, so assistive technology reports
      one sorted column instead of five with opinions
- [ ] 7.3 Draw the direction indicator on the sorted column only, from the
      light-blood token, and never let it be the only carrier — `aria-sort` and the
      button's accessible name say the same thing
- [ ] 7.4 Change `RunewordTable` to take the rows as a prop instead of reading
      `orderedRunewords`, plus the sort state and one stable sort callback
- [ ] 7.5 Keep the callback stable and keyed by argument, as
      `handleDetailsOpenChange` already is, so all five headers share one function
- [ ] 7.6 Render an empty state inside the `<tbody>` as one full-width cell when no
      row is presented, so the table keeps its shape and row navigation reaches the
      explanation rather than nothing
- [ ] 7.7 Make the `<thead>` sticky at the top of the viewport — the half
      `runeword-table` deferred to this change, on the grounds that a sort control
      7 000px above the row being read is not a control
- [ ] 7.8 Settle the stacking so the detail panel paints **above** the sticky band.
      The panel is floating and rendered in place, so a row near the top of the
      viewport otherwise slides its panel under the header as the page scrolls —
      a defect that only appears at one scroll offset
- [ ] 7.9 Test that each header sorts its column, that activating the sorted one
      reverses it, that three activations never reach an unsorted state, that
      `aria-sort` is on exactly one header, and that the headers are operable by
      keyboard
- [ ] 7.10 Test the empty state: the message is inside the table, the column headers
      remain, and the table is not replaced

## 8. Wiring it up in `App`

- [ ] 8.1 Call `useViewSettings()` beside `useCraftedRunewords()` in `src/App.tsx`
      and render `RunewordControls` between the progress bar and the table, which is
      where `IDEAS.md` puts search and filters in the Phase 1 layout
- [ ] 8.2 Derive the visible rows in one `useMemo` over the settings, the query and
      the crafted set, and pass the array down
- [ ] 8.3 Keep passing the crafted set and the toggle through unchanged. This change
      reads progress and never writes it
- [ ] 8.4 Pass nothing about the visible count to `CraftedProgress`. Its maximum is
      the dataset's length, written that way by `crafted-tracking` specifically so
      that this change could not move it
- [ ] 8.5 Verify in a browser that opening a detail panel still re-renders two rows
      rather than 99. The row memo is load-bearing — 37–50ms to painted panel and
      long tasks to 127ms without it — and the rows now come from a derived array
- [ ] 8.6 Test at the `App` level: a filter narrowing the table while the progress
      bar keeps reporting out of 99, marking a runeword under the remaining filter
      removing its row, a persisted filter applying on load, and the reset restoring
      all 99

## 9. Copy, theme and documentation

- [ ] 9.1 Add the new copy to `src/i18n/en.ts`: the search label, both filter
      legends and every option label, the sort button's accessible name per column,
      the direction announcement, the result count as a function of two numbers, the
      empty-state message and the reset label
- [ ] 9.2 Keep the slot names in the copy layer and out of the data. A slot is this
      project's word, unlike a base item category, which is a dataset identifier
- [ ] 9.3 Add **no theme token**. Render `--color-muted-dark` for the search field
      and the resting chips and `--color-blood-light` for the selected chip and the
      sort indicator — two of the four tokens `IDEAS.md` records as declared with
      nothing rendering them, which is the fix `d2-theme` asks for
- [ ] 9.4 Add the sticky header's stacking and the field's focus treatment to
      `src/index.css` beside the existing utilities, with no literal colour
- [ ] 9.5 Correct the Search section of [`docs/REFERENCE.md`](../../../docs/REFERENCE.md),
      which still calls matching rune names "our plan" — a decision `IDEAS.md` later
      dropped, left standing as a line that reads like a requirement
- [ ] 9.6 Update the Planned changes table in [`IDEAS.md`](../../../IDEAS.md) and
      record what this change hands forward: the two tokens still owed a use site,
      the collation question `russian-locale` inherits from the ASCII matcher, the
      two open questions from the design, and the fact that sorting by crafted state
      is the first control that can move a row out from under the pointer
- [ ] 9.7 Run `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm format:check`,
      then `pnpm build`, and confirm the built stylesheet did not grow by a class
      that only appears in this change's prose
