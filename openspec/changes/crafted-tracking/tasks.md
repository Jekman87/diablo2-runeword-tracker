## 1. Theme tokens and display copy

- [ ] 1.1 Add `--color-crafted-row`, `--color-progress-track` and `--color-toast`
      to the `@theme` block in `src/index.css`, each named for the surface it
      styles per the theme's role-naming rule
- [ ] 1.2 Value them from the existing palette rather than a new hue — the tint is
      `--color-crafted` at low alpha, the track comes from the muted family the row
      hairline uses, the toast from the blood family's dark end as the detail panel
      does
- [ ] 1.3 Add **no** token for the progress bar's filled portion. `--color-crafted`
      was declared by `d2-theme` for exactly this and has had no use site until now;
      a second token for the same role is the drift the palette rule prevents
- [ ] 1.4 Add **no** token for the collapsible panels. They belong to
      `remaining-panels`, and the theme spec's scenario now names them as the
      surfaces that still have none
- [ ] 1.5 Add the `<progress>` pseudo-element rules to `src/index.css` —
      `::-webkit-progress-bar`, `::-webkit-progress-value` and `::-moz-progress-bar`
      — beside the two existing utilities. An engine supporting none of them still
      renders a working native bar
- [ ] 1.6 Add the new copy to `src/i18n/en.ts`: the crafted column header, the
      toggle's two accessible names as functions of the runeword's name, the
      progress text as a function of count and total, and the toast's message and
      undo label
- [ ] 1.7 Keep the runeword name out of the layer and pass it in, exactly as
      `patchMeaning(patch)` already does. The name is a dataset identifier; the
      sentence around it is copy

## 2. Persistence module

- [ ] 2.1 Create `src/crafted/storage.ts` exporting `loadCrafted()` and
      `saveCrafted()`. Plain functions, no React import — the four failure modes
      below are testable without rendering anything
- [ ] 2.2 Use the key `diablo2-runeword-tracker:crafted:v1`. The namespace is
      load-bearing: GitHub Pages serves every project under the account from one
      origin with one `localStorage`, so a key called `crafted` is a collision
      waiting for a sibling project
- [ ] 2.3 Put the version in the **key**, not in the payload, so a future v2 writes
      elsewhere and leaves v1 recoverable instead of destroying it in place. The
      payload is a bare JSON array of names
- [ ] 2.4 Validate what comes back with a `zod` schema, not a cast. `localStorage`
      is user-editable, shared with every page on the origin, and written by a
      version of this application that may not be this one
- [ ] 2.5 Return two things from the load: the names present in the dataset, and
      the remainder. Collapse duplicates through a `Set` on the way
- [ ] 2.6 Write the union of the crafted set and the preserved remainder, **sorted**,
      so the same marks always produce the same stored bytes regardless of the order
      they were made in
- [ ] 2.7 Guard every storage access inside this module. A disabled or private-mode
      store throws on read and on write, and no component may have to know that
- [ ] 2.8 Test loading and saving a round trip; malformed JSON; valid JSON of the
      wrong shape; duplicates collapsing; an unknown name being excluded from the
      set and still present in the next write; and a throwing storage on both paths
- [ ] 2.9 Test that the stored value is byte-identical for the same set marked in
      two different sequences

## 3. Crafted state hook

- [ ] 3.1 Create `src/crafted/useCraftedRunewords.ts` owning the crafted
      `Set<string>`, the preserved unknown names, the toggle and the pending undo
- [ ] 3.2 Initialise from `loadCrafted()` once, in a lazy `useState` initialiser
      rather than an effect, so the first render already has the player's progress
      and no empty frame renders before it
- [ ] 3.3 Copy-on-write on every toggle — a new `Set` from the old. Mutating in
      place does not change identity and React will not re-render
- [ ] 3.4 Call `saveCrafted()` from the toggle, **never from an effect**. An effect
      fires on mount, which would write an empty set over the data that failed to
      parse and take the evidence with it
- [ ] 3.5 Key the set by canonical runeword name. Not an index — the dataset is
      generated, and an index points at a different runeword after a regeneration
- [ ] 3.6 Record the pending undo as the runeword, the direction, and the DOM node
      to return focus to. One record, replaced by the next toggle — no history stack
- [ ] 3.7 Test the toggle both ways, that undo reverses exactly the last toggle,
      that a second toggle replaces the pending undo rather than queueing it, and
      that a load failure still yields a working in-memory tracker
- [ ] 3.8 Test that mounting the hook performs no write

## 4. The toggle control

- [ ] 4.1 Create `src/components/CraftedToggle.tsx` — a real `<button>` with
      `aria-pressed`, drawn as an empty versus a filled socket
- [ ] 4.2 Build it as a button and not a checkbox. `IDEAS.md` settles this, and a
      checkbox would need `appearance: none` and a rebuilt box to look like a socket
      anyway, so the platform affordance given up is smaller than it looks
- [ ] 4.3 Give it an accessible name naming both the runeword and what the next
      activation does, from the layer, so it is unambiguous reached out of row
      context
- [ ] 4.4 Make the filled versus empty rendering carry the state, not the colour.
      A player with a red-green deficiency reads the socket
- [ ] 4.5 Compose the two states with `clsx` or a `cva` variant rather than a
      hand-rolled conditional string, per the styling rules
- [ ] 4.6 Test both pressed states, the accessible name in each direction, and
      activation by Space and by Enter

## 5. Row integration

- [ ] 5.1 Add the toggle cell as the row's first `<td>` in
      `src/components/RunewordRow.tsx`, and its `<th scope="col">` as the table's
      first header in `src/components/RunewordTable.tsx`
- [ ] 5.2 Thread the crafted set and the toggle from `App` through `RunewordTable`
      to the rows as props. No context and no store library — one value, two
      levels, one tree
- [ ] 5.3 Add the row-level `onClick` for the enlarged pointer target. Do **not**
      add `role="button"` or `tabindex`: 99 focusable rows would double the page's
      tab stops and cost the table the row and column semantics it is built on
- [ ] 5.4 Ignore clicks whose target sits inside a nested interactive element,
      found with `closest()` on a selector rather than by comparing against the
      specific buttons, so a control added later is excluded without this handler
      being revisited
- [ ] 5.5 Confirm the name button still opens the detail view and does **not** mark
      the runeword crafted. This is the collision `runeword-table` recorded when it
      made the name a button
- [ ] 5.6 Ignore a click that ends a text selection, checked with `getSelection()`.
      Dragging across a row to copy it should not toggle it
- [ ] 5.7 Apply the crafted row's tint and left accent border from the tokens in
      group 1
- [ ] 5.8 Hold a ref to the row's own toggle button and pass it on both paths, so
      a row-level click and a control activation record the same focus target
- [ ] 5.9 Test that clicking the row toggles, that clicking the name does not, that
      clicking the control toggles exactly once rather than twice, and that no row
      is focusable by Tab
- [ ] 5.10 Test that the table still exposes 99 rows with column headers after the
      column is added, so `runeword-table`'s semantics requirement still holds

## 6. Progress indicator

- [ ] 6.1 Create `src/components/CraftedProgress.tsx` using a native `<progress>`,
      which carries the role, the value and the maximum without any of it restated
      in ARIA — the same reasoning that made the detail view a `<dialog>`
- [ ] 6.2 Take the maximum from the dataset's own length. Not a literal `99`, which
      goes stale on the patch that adds a runeword
- [ ] 6.3 Take the maximum from the dataset **directly**, never from a count of
      rendered rows. Every later change gives the visible count a new reason to
      shrink, and this is what stops `search-sort-filter` moving the denominator by
      accident
- [ ] 6.4 State the count in text beside the bar, from the layer. A bar alone does
      not say `37`
- [ ] 6.5 Test that the value tracks toggles immediately, that the maximum is 99,
      that zero crafted renders `0 of 99` rather than nothing, and that the maximum
      does not change when the rendered row count would

## 7. Undo notice

- [ ] 7.1 Create `src/components/UndoToast.tsx` — one notice, describing the most
      recent toggle, with an undo action
- [ ] 7.2 Render the `role="status"` container from first render and put the notice
      inside it. A live region injected at the moment its content appears is
      unreliably announced
- [ ] 7.3 Use `status` rather than `alert`. A confirmation of the player's own
      action should not interrupt what a screen reader is reading
- [ ] 7.4 Dismiss after six seconds, and **do not dismiss while focus is inside
      it**. Clear the timer on focus and restart it on blur — a focusable control
      that removes itself drops focus to `<body>` and loses a keyboard reader their
      place in a 99-row table
- [ ] 7.5 Do not move focus when the notice appears
- [ ] 7.6 On undo, reverse that one toggle, dismiss the notice, and return focus to
      the toggle it reverted using the node recorded in task 3.6
- [ ] 7.7 Replace the notice on a further toggle rather than stacking a second one
- [ ] 7.8 Test appearance, the undo reversing exactly one toggle, replacement by a
      second toggle, auto-dismissal on fake timers, the timer not running while
      focused, and focus returning to the reverted control
- [ ] 7.9 Do not build a history stack, a redo, or a queue. The notice is the
      misclick affordance for the enlarged pointer target; the reversal mechanism is
      pressing the toggle again

## 8. Page shell and documentation

- [ ] 8.1 Wire the hook in `src/App.tsx` and render the progress indicator below
      the divider and the notice at the end of the page
- [ ] 8.2 Build **no** site header. The patch line and the Help, Feedback and
      Update Notes links are still `site-header`'s, and `IDEAS.md` puts the progress
      bar below them — placing it under the divider now lets `site-header` slot its
      rows above without moving it
- [ ] 8.3 Update `src/App.test.tsx` for the progress indicator and the live region
- [ ] 8.4 Mark the `crafted-tracking` row done in `IDEAS.md`, and record there that
      two tabs do not observe each other's changes — no `storage` event listener is
      installed, deliberately, so the omission reads as a decision
- [ ] 8.5 Record in `IDEAS.md` that `csv-import-export` must write through
      `src/crafted/storage.ts` rather than the key directly, and that unknown stored
      names are preserved and are the thing its unmatched-name report can surface

## 9. Acceptance

- [ ] 9.1 Add no dependency. `zod` already validates external data, `clsx` composes
      the row variant, and `<progress>` and `localStorage` are platform. A state
      library, a toast library or a `localStorage` hook package would each be more
      to configure than the code it replaces
- [ ] 9.2 Confirm nothing under `src/` displays a literal string to the reader, and
      that the strings layer still holds no dataset value
- [ ] 9.3 Confirm no component carries a literal colour value, and that the three
      new tokens are the only ones added
- [ ] 9.4 Confirm no module outside `src/crafted/storage.ts` names the storage key
      or calls the storage API
- [ ] 9.5 Run the full local gate — `pnpm typecheck`, `pnpm lint`,
      `pnpm format:check`, `pnpm test`, `pnpm build` — and confirm all five exit
      zero
- [ ] 9.6 **Look at it.** `pnpm dev`, then: toggle by clicking a row and by
      clicking the socket, check the tint and the accent border, watch the bar move,
      let the notice time out, undo one, reload and confirm the marks are still
      there
- [ ] 9.7 Check the keyboard path with no pointer: Tab to a socket, Space to
      toggle, Space again to revert, Tab to a name and Space to open the dialog and
      confirm it did not also toggle
- [ ] 9.8 Check the three storage failures by hand in devtools: delete the key, set
      it to `not json`, set it to `{"a":1}`. The page must load and work in all
      three, and the unparseable value must still be there after a load with no
      toggle
- [ ] 9.9 Set the key to `["Enigma","Nonexistent Runeword"]` and confirm `Enigma`
      is marked, progress reads `1 of 99`, and toggling something else writes
      `Nonexistent Runeword` back out
- [ ] 9.10 Run `openspec validate --changes crafted-tracking --strict`
- [ ] 9.11 Commit as `feat(tracking): add crafted state, persistence and progress`
