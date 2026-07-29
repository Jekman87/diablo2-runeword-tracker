## Why

The table is 7 430px tall and has one way through it: scroll. Every runeword is
on the page, in required-level order, and a player who wants "the shield
runewords I have not made yet" reads all 99 rows to find ten. `IDEAS.md`
records that the labelled 40px rune icons roughly doubled the table's height —
from about 4 060px to 7 430px — and concludes that the filters are what make a
page that long navigable. This is that change.

It is also the change that finishes what two earlier ones deliberately left
half-built. `crafted-tracking` made crafted state a real column with a real
`<th scope="col">` so that something could hang `aria-sort` on it, and left
clicking it inert. `runeword-table` exported `byRequiredLevel` as a plain
function and commented it as "`search-sort-filter`'s default comparator", and
declined a sticky header on the grounds that it earns its keep once the header
row is interactive. Both hand-offs come due here.

## What Changes

- Add a **search box** matching, case-insensitively, on a runeword's name, its
  base item categories and its item-type restriction — the three things the row
  actually shows in the columns a player reads. `IDEAS.md` settles that **rune
  search is dropped**: on the reference the rune relationship is expressed by
  highlighting driven by the rune inventory, and we track no inventory.
- Make **every column header a sort control**, as the reference does and as
  `IDEAS.md` calls for: header-click sorting, no dropdown. Five columns, five
  sort keys — crafted state, name, socket count, first base category, required
  level — each with an ascending and a descending direction, `aria-sort` on the
  active column only, and a real `<button>` inside the `<th>` rather than a
  click handler on the cell.
- Keep **every sort total** by falling back to `byRequiredLevel` — level, then
  name — for rows the chosen key cannot separate. Forty-five runewords share a
  socket count of three; without a tiebreak their order would be a property of
  the sort implementation rather than of the data, which is the defect
  `runeword-table` already fixed once for the default order.
- Add a **crafted filter** — all, crafted, remaining — the three states
  `IDEAS.md` lists.
- Add a **slot filter** — all, helm, weapon, shield, body armour. `IDEAS.md`
  settles that this is the _only_ category filter and that everything finer
  grained is handled by search instead.
- Add the **item-type-to-slot mapping** the slot filter reads, which
  `runeword-dataset` deliberately left out. It maps all 20 declared categories
  onto the four slots, is total by test rather than by intent, and lives in
  application code rather than in the dataset — the slot is our editorial
  grouping of upstream categories, not a field the vendored source carries, so
  putting it in `item-types.json` would mean the generator inventing data.
- Add a **result count and an empty state**. A filtered table with no rows must
  say that nothing matches rather than render an empty `<tbody>`, and the count
  is announced politely so that a reader who cannot see 99 rows shrink to eleven
  is told they did.
- Add a **reset control**, shown whenever the view is narrowed, so that a
  restored filter that hides everything is one press from recoverable.
- **Persist the sort and both filters** to `localStorage`, as `IDEAS.md` calls
  for, under their own namespaced versioned key and validated with `zod` on the
  way back in. **The search text is not persisted**: a query restored from last
  week reads as a broken dataset, not as a preference.
- Make the **header row sticky**, which is the deferred half of
  `runeword-table`'s decision — a sort control 7 000px above the row being read
  is a control that cannot be used.
- Add the **display copy** for all of the above, and **no new theme token**: the
  control bar's surfaces are drawn from `--color-muted-dark` and
  `--color-blood-light`, two of the four tokens `IDEAS.md` records as declared
  with nothing rendering them. Rendering a declared token is the fix that spec
  asks for; declaring a sixth family beside it would be the defect.

Explicitly **not** in this change:

- **A ladder filter or a patch filter.** `runeword-dataset` forbids them
  outright: availability fields render badges and no filter, counter or branch
  may read them, because availability changes between ladder seasons and a stale
  badge is cosmetic where stale logic miscounts. Sorting is logic, so no column
  sorts on them either.
- **Multi-select slots.** One choice plus "all". A runeword already belongs to
  several slots — `Fortitude` is a weapon and a body armour — so a union of two
  slots produces a set that is hard to predict from the controls, and search
  covers the finer intent that would want it.
- **Rune search**, per above. **Fuzzy matching** too: 99 names, one substring
  pass, and a fuzzy matcher's false positives on a list this small are worse
  than its recall is good.
- **Sharing a view by URL.** There is no router and a query-string view is a
  feature nobody asked for.
- **Debouncing the search input.** Filtering and sorting 99 records is a single
  pass over an array that is already in memory; a debounce would add latency to
  every keystroke to save work that does not exist.
- **Pagination, windowing or virtualisation.** Still 99 rows, still not a
  windowing problem, and `runeword-table` forbids all three.
- **Fixing the table's sideways scroll below ~542px.** `IDEAS.md` records it as
  a pre-existing layout decision nobody owns yet. The control bar this change
  adds wraps and does not make it worse.
- **The remaining-runes and remaining-bases panels** (`remaining-panels`) and
  **the site header** (`site-header`). Neither is a filter.

## Capabilities

### New Capabilities

- `runeword-browsing`: how a player finds a runeword in a 99-row table — what
  search matches, which key each column header sorts on and how a total order is
  guaranteed for all of them, the crafted and slot filters and how the three
  controls combine, the mapping from base item category to equipment slot, the
  result count, the empty state and the reset, the reachability of the sort
  controls while reading a long table, and the things narrowing the view may not
  change: the progress denominator, the crafted set, and the availability fields
  no filter is allowed to read.
- `view-persistence`: the storage contract for how the player is looking at the
  list — that the sort and the two filters survive a reload under their own
  namespaced versioned key, that the search text deliberately does not, that a
  stored value is validated rather than trusted, and that a corrupt one is
  replaced by the defaults rather than preserved, which is the opposite of what
  `progress-persistence` requires of progress and the reason these are two
  capabilities rather than one.

### Modified Capabilities

- `runeword-table`: two requirements become false as written. _Every runeword is
  listed in a table_ requires the table to contain exactly 99 rows and forbids a
  row being hidden — aimed at pagination, windowing and truncation, but a filter
  hides rows too, and a persisted filter hides them on load. The prohibition has
  to name the mechanisms it is actually about and admit narrowing the player
  asked for. _Default row order_ requires required-level order outright; it
  becomes the order that holds when no sort has been chosen and after a reset.
- `d2-theme`: the requirement _Named colour tokens_ enumerates the surfaces the
  token set covers and requires a change that renders a new surface to add its
  token here. This change renders four new surfaces — the search field, the
  filter controls, the active sort indicator and the empty state — and adds no
  token, because two declared-but-unrendered tokens are exactly the right
  colours for them. The enumeration must admit the controls, and the scenario
  that records which tokens are still owed a use site has to shrink from four to
  two.

## Impact

- **New**: `src/runewords/slots.ts` and its test (the 20-category mapping,
  total by test); `src/runewords/search.ts` and its test (the matcher);
  `src/runewords/sort.ts` and its test (the five comparators and the direction);
  `src/view/storage.ts` and its test (load, save, the `zod` schema, the failure
  modes — pure logic, no DOM); `src/view/useViewSettings.ts` and its test;
  `src/view/visible.ts` and its test (search ∧ crafted ∧ slot, then sort — pure,
  and the one place the three controls meet);
  `src/components/RunewordControls.tsx` and its test;
  `src/components/SortableHeader.tsx` and its test.
- **Modified**: `src/App.tsx` (owns the view settings beside the crafted set,
  renders the control bar, derives the visible rows); `src/App.test.tsx`;
  `src/components/RunewordTable.tsx` (takes the rows rather than reading
  `orderedRunewords`, sortable headers, the sticky band, the empty state);
  `src/components/RunewordTable.test.tsx`; `src/i18n/en.ts`; `src/index.css`
  (the sticky header's stacking and the field's focus treatment — no new token);
  [`IDEAS.md`](../../../IDEAS.md) (the Planned changes row, and what this change
  hands to the next one);
  [`docs/REFERENCE.md`](../../../docs/REFERENCE.md) (its Search section still
  calls matching rune names "our plan", which `IDEAS.md` later dropped — a stale
  line that reads as a requirement).
- **Dependencies**: none added. `zod` validates the stored settings as it
  already validates the dataset and the crafted set; `clsx` and
  `class-variance-authority` cover the filter control's variants. No table
  library, no query-state library, no fuzzy-search package — each would be more
  configuration than the code it replaces.
- **Reads, never writes, the dataset.** `src/data/`, the generator and `vendor/`
  are untouched, and no requirement of `runeword-dataset` changes. The slot
  mapping is keyed _by_ category names and lives beside them, not in them.
- **Risk worth naming — the memoisation is load-bearing and this change moves
  what it depends on.** `RunewordRow` is memoised because opening one detail
  panel re-rendered all 99 rows and took long tasks to 127ms. The rows now come
  from a derived array rather than a module constant, so that array has to be
  memoised on the settings that produce it, and the sort callback has to be
  stable, or every keystroke in the search box rebuilds 99 rows and the
  measurement that justified the memo is undone.
- **Risk worth naming — a restored filter is invisible state on first paint.**
  Persisting the filters means a player can return to a page showing eleven rows
  out of 99 with no memory of why. The result count, the filter controls showing
  their own state, and the reset control are the whole mitigation, and they are
  requirements rather than polish for that reason.
- **Risk worth naming — the denominator, again.** `crafted-tracking` wrote the
  progress maximum as the dataset's length specifically so that no later change
  could make it move, and named the filter as the thing it was defending
  against. This is that change: nothing here may pass a visible count to the
  progress indicator, and a scenario asserts the bar does not move when the view
  narrows.
- **Risk worth naming — sorting on crafted state moves rows under the pointer.**
  Toggling a row while sorted by crafted state relocates that row immediately,
  which is a misclick generator. The undo notice `crafted-tracking` ships is the
  existing answer and this change adds no re-sort animation; `row-animations` in
  Phase 4 is where that is looked at.
- **Untouched**: `crafted-tracking` and `progress-persistence` gain no
  requirement — the crafted set is read here and never written, and progress
  keeps its own key and its own preservation rules. `ui-strings` does not change
  either: the result count interpolates two numbers, which is the interpolation
  "the interface actually renders" that its scope sentence already permits.
  `build-toolchain`, `static-site-deployment`, `continuous-integration` and
  `code-quality-gates` are all unaffected.
