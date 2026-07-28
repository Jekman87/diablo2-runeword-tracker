## Why

The site renders all 99 runewords and the player cannot mark a single one. The
product sentence in [`IDEAS.md`](../../../IDEAS.md) is _"tracks which runewords
the player has already crafted"_, and everything shipped so far is the list they
are tracked against. This change is the one that makes the page a tracker: a
socket control per row, progress out of 99, and the state surviving a reload.

It is also the change every remaining Phase 1 change is waiting on.
`search-sort-filter` needs a crafted column to sort on and a crafted/remaining
filter to read; `remaining-panels` aggregates over exactly the set this change
owns; Phase 3's `csv-import-export` reads and writes the same store. Getting the
state's shape and its persistence boundary right here is cheaper than getting it
wrong three times.

## What Changes

- Add a **crafted-state column** as the table's first column, one real `<button>`
  per row carrying `aria-pressed`, drawn as an empty versus a filled socket.
  A column rather than a control floated into the name cell, because
  `IDEAS.md` settles that crafted state is sortable and `search-sort-filter`
  needs a `<th scope="col">` to hang `aria-sort` on.
- Make the **whole row a pointer hit target** for the toggle, as `IDEAS.md`
  calls for, without adding a second keyboard stop. The row is not given
  `role="button"` or a `tabindex`: 99 rows would double the tab stops on the page
  and cost the table the row semantics `runeword-table` chose it for. The name
  button already inside the cell keeps opening the detail view and must not also
  toggle the row.
- **Persist the crafted set to `localStorage`** as the runewords' canonical
  names, under a namespaced, versioned key. Names rather than indices, because an
  index is a property of the dataset file and the dataset is regenerated.
- **Validate what comes back out of storage with `zod`**, the same rule
  `runeword-dataset` applies to the JSON. `localStorage` is untrusted external
  input: it is user-editable, it is shared with every other page on the origin,
  and it is the one input to this application a future version of this
  application wrote.
- **Tolerate storage that is absent, corrupt or unavailable.** Private-mode
  Safari throws on write; a hand-edited value parses to nonsense; a name that no
  longer exists in the dataset is a runeword renamed between patches. None of the
  three may blank the page, and none may silently discard progress that is still
  valid.
- Add an **overall progress indicator** — crafted out of all 99, as a native
  `<progress>` element with the count stated in words beside it. The denominator
  is the dataset's length and never the filtered, visible or available count;
  `IDEAS.md` settles that outright, and it is the single most tempting thing in
  this change to make clever.
- Give a **crafted row a green tint and a left accent border**, and never let
  colour be the only carrier: the socket control's pressed state and its
  accessible name say the same thing.
- Add a short-lived **undo toast** with an Undo action, announced through a live
  region. It is a misclick affordance for the enlarged row hit target, not the
  only way back — pressing the toggle again always reverts, which is the keyboard
  path and needs no toast at all.
- Add the **three theme tokens** these surfaces need: the crafted row's tint, the
  progress track, and the toast's panel. `d2-theme` requires the change that
  renders a surface to add its token rather than write a colour into a component,
  and names the toast as an example of a surface that has none yet.
- Add the **display copy** for all of the above to the English record — the
  column header, the toggle's two accessible names, the progress text and the
  toast. No component gains a literal.

Explicitly **not** in this change:

- **Sorting the crafted column.** The column and its header exist; clicking it
  does nothing until `search-sort-filter`.
- **The crafted / remaining / all filter and the slot filter.** Same change.
- **Persisting view settings.** This change persists progress only.
- **The remaining-runes and remaining-bases panels.** They aggregate over the set
  this change creates, and they are `remaining-panels`.
- **CSV import and export.** Phase 3. This change owes it a store it can read and
  write, and nothing more.
- **Row-movement animation** when a row is toggled. Phase 4.
- **Any server, account or cross-device sync.** There is no backend and Phase 3's
  answer to moving progress between devices is a CSV file.
- **A state-management library, or React context.** The crafted set is one piece
  of state read by two siblings; it lives in `App` and reaches them as props.

## Capabilities

### New Capabilities

- `crafted-tracking`: what it means for a runeword to be marked crafted — the
  per-row toggle and its states, the enlarged row hit target and the nested
  controls it must not swallow, how a crafted row is distinguished by more than
  colour, the progress indicator and its fixed denominator of all 99, and the
  undo affordance and what it may not do to keyboard focus.
- `progress-persistence`: the storage contract — that progress survives a reload,
  that it is keyed by canonical runeword name under a namespaced versioned key,
  that stored data is validated rather than trusted, that absent, corrupt or
  unavailable storage degrades to a usable in-session tracker instead of a blank
  page, and that a failed read never overwrites what it failed to read.

### Modified Capabilities

- `runeword-table`: the requirement _Columns_ currently ends "No column SHALL
  present crafted state, which is not part of this capability", and carries the
  scenario _No crafted-state column exists_. This change adds that column. The
  requirement has to hand the column's content and behaviour to
  `crafted-tracking` rather than forbid it, while keeping the four read-only
  columns it does own intact.
- `d2-theme`: the requirement _Named colour tokens_ bounds the token set to
  surfaces a component actually renders, and its scenario _A surface with no
  component still has no token_ names the undo toast as one that does not exist
  yet. This change builds the toast, the crafted row tint and the progress track,
  so the scope sentence must admit them — the same move `runeword-table` made for
  the detail panel.

## Impact

- **New**: `src/crafted/storage.ts` and its test (load, save, the `zod` schema
  and the three failure modes — pure logic, no DOM);
  `src/crafted/useCraftedRunewords.ts` and its test (the set, the toggle, the
  pending undo); `src/components/CraftedToggle.tsx` and its test;
  `src/components/CraftedProgress.tsx` and its test;
  `src/components/UndoToast.tsx` and its test.
- **Modified**: `src/App.tsx` (owns the crafted state and renders the progress
  bar and the toast); `src/App.test.tsx`; `src/components/RunewordTable.tsx`
  (the new leading column header, and the state passed through);
  `src/components/RunewordRow.tsx` (the toggle cell, the row click handler, the
  crafted styling); `src/components/RunewordTable.test.tsx`;
  `src/i18n/en.ts`; `src/index.css` (three tokens and the `<progress>`
  pseudo-element rules); [`IDEAS.md`](../../../IDEAS.md) (the Planned changes
  row).
- **Dependencies**: none added. `zod` already validates the dataset and validates
  the stored set here; `clsx` composes the row's crafted variant. No state
  library, no toast library, no `usehooks`-style package for `localStorage` —
  each would be more code to configure than the twenty lines it replaces.
- **Reads, never writes, the dataset.** `src/data/` and the `runeword-dataset`
  spec are untouched. The crafted set is keyed _by_ dataset names and stored
  separately from them.
- **Risk worth naming — the origin is shared.** The site is deployed to
  `jekman87.github.io/diablo2-runeword-tracker/`, and every GitHub Pages project
  under that account is served from **one origin** with **one `localStorage`**.
  A key called `crafted` would collide with any sibling project that picks the
  same obvious word. The key is namespaced with the project name and carries a
  version segment, so a future format change can announce itself instead of
  being read as a corrupt v1.
- **Risk worth naming — two click targets, one row.** `runeword-table` recorded
  this collision when it made the name a `<button>`: the row-level handler this
  change adds must not fire for a click that landed on the name, or opening the
  detail view would silently mark the runeword crafted. It must also not fire for
  a click that ends a text selection.
- **Risk worth naming — a disappearing focusable control.** The undo toast
  removes itself on a timer while containing a button. If focus is inside it when
  it goes, focus falls to `<body>` and a keyboard reader loses their place in a
  99-row table. The toast must not auto-dismiss while it holds focus.
- **Risk worth naming — the denominator.** Every later change adds a reason for
  the visible row count to differ from 99: a filter, a search, a ladder season.
  The progress indicator reads the dataset's length directly and takes no count
  from the table, so that no future change can make the denominator move by
  accident.
- **Untouched**: `vendor/`, the data generator, the deployment workflow, the
  quality gate. No requirement of `runeword-dataset`, `ui-strings`,
  `build-toolchain`, `static-site-deployment`, `continuous-integration` or
  `code-quality-gates` changes. `ui-strings` in particular does not: the progress
  text interpolates a count, which is the interpolation "the interface actually
  renders" that its scope sentence already permits, exactly as
  `patchMeaning(patch)` does today.
