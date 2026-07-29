## Context

The page today is `App` owning one `Set<string>` of crafted names, a progress
bar, and a `<table>` that maps over `orderedRunewords` — a module-scope constant
sorted once by `byRequiredLevel`. Nothing between the dataset and the rows can be
varied at runtime.

Four things about the existing code shape the design more than anything in the
proposal does:

1. **`RunewordRow` is memoised, and it is load-bearing.** Which detail panel is
   open lives on the table, so every open re-renders it; without the memo it
   re-rendered all 99 rows, measured at 37–50ms to painted panel with long tasks
   to 127ms. Every prop it receives today is stable. The rows are about to come
   from a derived array instead of a constant, so keeping them stable becomes
   this change's problem.
2. **`byRequiredLevel` is already exported as a plain function**, commented as
   this change's default comparator. It is the tiebreak, not just the default.
3. **`crafted-tracking` built the crafted column as a real `<th scope="col">`**
   explicitly so `aria-sort` would have somewhere honest to live, and left the
   click inert.
4. **The dataset forbids logic reading availability.** `ladderOnly`, `patch` and
   `note` render badges and nothing else. That rules out two filters and two
   sort keys a reader might expect to find here.

The constraint that shapes the rest is that this project keeps derived state
derived: no store library, no context, `App` owns state and passes props.

## Goals / Non-Goals

**Goals:**

- Reduce a 7 430px table to the rows a player is actually looking for, by
  search, by crafted state, and by equipment slot.
- Make all five column headers sort controls with a guaranteed total order, so a
  row's position is always a property of the data.
- Keep the view a pure function of `(dataset, settings)` so the interesting parts
  — matching, comparing, mapping categories to slots — are testable without a
  DOM.
- Persist how the player is looking at the list, and make the restored state
  legible on arrival rather than mysterious.
- Preserve the row memoisation the previous change paid for.

**Non-Goals:**

- Any filter or sort that reads `ladderOnly`, `patch` or `note`.
- Multi-select slots, rune search, fuzzy search, URL-encoded views, debouncing,
  virtualisation.
- Changing the dataset, its schema or its generator.
- The narrow-viewport table overflow, the remaining panels, the site header.

## Decisions

### The visible rows are one pure function, called from one `useMemo`

`visibleRunewords(runewords, settings, query, crafted)` filters then sorts and
returns a new array. It lives in `src/view/visible.ts`, takes the dataset as a
parameter rather than importing it, and is the single place the three controls
combine. The query is a parameter beside the settings rather than a member of
them, because it is the one control that is not persisted.

The alternative was filtering in the table's JSX and sorting in a hook. That
spreads the AND of three conditions across two files and makes "why is this row
here" a question about render order. One function also means the combination
itself is unit-testable: search ∧ crafted ∧ slot, then sort, in that order,
because filtering first sorts fewer rows and the result is identical either way.

Order of operations inside it is deliberate: filter, then sort. Sorting 99 then
discarding 88 is the same answer for more work.

### Every comparator ends in `byRequiredLevel`

Five sort keys, and four of them are non-injective — 45 runewords share a socket
count of three, 21 share `Body Armors` as their first category, 23 required
levels are shared, and crafted state has two values against 99 rows. So each
comparator returns the key comparison if it separates the rows
and `byRequiredLevel(a, b)` otherwise. Descending negates the _key_ comparison
and leaves the tiebreak ascending, so a descending sort is not the ascending list
reversed and the tiebreak stays alphabetical in both directions.

For the required-level column the comparator _is_ `byRequiredLevel`, which is why
that function stays where it is and gains a second caller rather than being moved
into the new module.

Rejected: `Array.prototype.sort` on a single key and trusting stability.
V8's sort is stable, so it would work today, but it makes the presented order a
property of the input array's order — which for a filtered array is a property of
the filter. `runeword-table` already fixed this class of bug once when it added
the name tiebreak to the default order.

### The five sort keys, and what each column sorts on

| Column         | Key                           | Ascending means         |
| -------------- | ----------------------------- | ----------------------- |
| Crafted        | `crafted.has(name)`           | not crafted first       |
| Runeword       | `name`, by code point         | A → Z                   |
| Runes          | `runes.length`                | fewest sockets first    |
| Base Items     | `itemTypes[0]`, by code point | A → Z on the first line |
| Required Level | `requiredLevel`               | lowest level first      |

Two of these are judgement calls.

**Crafted ascending puts un-crafted first.** `false < true` is the arithmetic,
and it is also the useful direction: the reason to sort a tracker by crafted
state is to see what is left.

**The runes column sorts by socket count, not by rune.** Sorting the rune
sequence as text orders `Ber Mal Ber Ist` before `El El El` and answers no
question anybody has. Socket count is the readable magnitude of that column — a
two-socket recipe is a cheap one — and it is derived from `runes.length`, which is
the derivation the dataset requires anyway. Sorting by the rarest rune in the
sequence was considered and rejected: it needs the canonical rune index as an
ordinal, which is a second meaning for array position in `runes.json`, and "how
rare is the worst rune" is `remaining-panels`' question, not a column's.

**Base Items sorts on the first category only** — the first line of what the cell
renders, so the order is visibly the column. Sorting on the joined list would
order by an invisible string.

### Search matches name, categories and restriction — and nothing else

Case-insensitive substring over three fields, trimmed, empty query meaning no
filter. Substring rather than prefix, because `Body Armors` should be findable by
typing `armor`.

Including the restriction is a deliberate superset of the reference, whose
placeholder promises "Runeword name or item type". Fifteen runewords carry a
restriction and it renders in the item-types cell as its own line, so a player
typing `assassin` is typing something they can see in the column they are
searching. Excluding it would make a visible word unsearchable.

`toLowerCase()` and `includes()`, no normalisation, no collator: the dataset is
100% ASCII across every name, category and restriction — `index.css` already
depends on that for its font subset — so case folding is the whole of it. This
becomes a real question when `russian-locale` lands, and it will be that change's
question, because it is the change that introduces non-ASCII text.

### The slot mapping is a record in application code, not a dataset field

`src/runewords/slots.ts` holds `Record<string, Slot>` over the 20 category names
and a `slotOf(category)` lookup. A test asserts every category named by any
runeword resolves, so a category added upstream fails the suite instead of
disappearing from every slot filter — which is the failure mode that matters,
because a silently unmapped category makes runewords unreachable rather than
mis-grouped.

The mapping:

| Slot        | Categories                                                                                                                              |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Helm        | Helms                                                                                                                                   |
| Body armour | Body Armors                                                                                                                             |
| Shield      | Shields, Paladin Shields, Grimoire                                                                                                      |
| Weapon      | Axes, Claws, Clubs, Daggers, Hammers, Maces, Melee Weapons, Missile Weapons, Polearms, Scepters, Spears, Staves, Swords, Wands, Weapons |

`Grimoire → shield` is the one call worth defending. It appears on seven
runewords and on every one of them alongside `Shields` — `Ancient's Pledge`,
`Rhyme`, `Sanctuary`, `Splendor`, `Dragon`, `Dream`, `Vigilance` — so a Grimoire
runeword is an off-hand runeword, and any other mapping makes those seven answer
the wrong filter. Leaving it unmapped was the alternative and is worse: it would
need an optional return and a fifth "unslotted" state for one category that
already sits beside `Shields` everywhere it occurs.

It lives outside the dataset because the slot is our grouping, not upstream data.
`item-types.json` is generated from `vendor/`, the generator validates the
vendored shape and fails on a field it does not know, and `vendor/` is read-only.
Adding a `slot` field would mean the generator emitting a value with no source —
which is exactly the "plausible-looking dataset" `runeword-dataset` wrote its
generator rules to prevent.

A runeword matches a slot if **any** of its categories maps to it, so `Fortitude`
(`Weapons`, `Body Armors`) appears under both weapon and body armour. That is not
a compromise; a runeword really can go in either.

### Single-select filters, as two radio groups

Both filters are `<fieldset>` + `<legend>` + radio inputs styled as chips, not
buttons with `aria-pressed`. Radio semantics say "one of these" without a
sentence explaining it, arrow keys move between options for free, and the legend
gives the group a name for a screen reader arriving at it out of context.

Multi-select slots were rejected in the proposal for predictability; the
mechanism follows the decision rather than hedging it. If it is ever revisited,
the change is checkboxes and a `Set`, and `visibleRunewords` gains an `any`
instead of an equality — the persisted shape is where it would hurt, which is why
the stored value is a named slot rather than an array of one.

### Sort state is `{ key, direction }`, and the header owns no state

`SortableHeader` renders a `<button>` inside the `<th>`, receives whether it is
the active column and in which direction, and calls one callback. The table holds
no sort state of its own; `App` does. `aria-sort` goes on the `<th>` of the active
column only, and is absent — not `"none"` — on the other four, so assistive
technology reports one sorted column rather than five columns with opinions.

Clicking the active column flips the direction. Clicking an inactive one adopts
its natural first direction: ascending for name, base items, level and sockets;
ascending for crafted too, which surfaces what is left. Two states, not three —
there is no "unsorted", because required-level ascending _is_ the default and is
reachable by choosing it or by resetting.

### Sticky header

`position: sticky; top: 0` on the `<thead>`, which the blood band already makes
opaque. This is `runeword-table`'s deferred half: it declined a sticky header
because the header row was inert, and a sort control 7 000px above the row you
are reading is not a control.

The one thing that needs care is stacking against the detail panel, which is
floating and rendered in place rather than in a portal. The panel must paint over
the sticky band, not under it — a panel opened on a row near the top of the
viewport otherwise slides beneath the header as the page scrolls, and the reason
is a `z-index` nobody set.

### View settings persist in their own module, under their own key

`src/view/storage.ts`, key `diablo2-runeword-tracker:view:v1`, payload
`{ sortKey, sortDirection, craftedFilter, slotFilter }`, validated by `zod`
enums. A separate module and a separate key from progress, for three reasons that
are all the same reason: the failure semantics are opposite.

`progress-persistence` requires that a corrupt value is left untouched so it can
be repaired by hand, and that a name the dataset does not know is carried
forward, because that data is the player's work and cannot be reconstructed. A
sort direction is not the player's work. A corrupt view setting is discarded, the
defaults are used, and the next change of a control overwrites it — recovering a
stale `sortKey` is worth nothing and nobody will ever hand-repair one.

Sharing progress's module would have meant one schema with two halves and two
policies, and one write path that has to know which half it is writing. Sharing
the key would mean clearing a bad sort could take progress with it.

The write happens from the settings-changed handler, never from an effect — the
same rule and the same reason as progress: an effect fires on mount and would
overwrite a value that failed to parse before the player touched anything.

An unknown enum member — a `sortKey` this version does not have — fails
validation, so the whole record falls back to defaults rather than being merged
field by field. Merging would leave the view in a state no version of the code
can produce.

### Search is not persisted, and that is the point

Sort and filters are how a player has chosen to look at the list; a search string
is a lookup in progress. A page that reloads into `zeal` showing one row looks
broken, and the mitigation would be an explanation. So the stored record has no
search field at all, rather than an empty one.

### `App` owns the settings; the control bar and the table are siblings

`useViewSettings()` returns the settings, the four setters and a reset, and loads
its initial value from storage in a lazy `useState` initialiser — first paint is
already the restored view, with no frame of unfiltered table before it.

`App` derives the rows in one memo over the settings, the query and the crafted
set, and passes the array down:

```ts
const visible = useMemo(
  () => visibleRunewords(runewords, settings, query, crafted),
  [settings, query, crafted],
);
```

The memo is not what saves the rows — the `runeword` objects inside the array are
the dataset's own and their identities never change, so `RunewordRow`'s
comparison holds whether the array is fresh or not. What the memo saves is the
filtering and the sort itself on every render that had nothing to do with either,
and it keeps the array identity stable so the table's own reconciliation is a
no-op when `App` re-renders for another reason.

The sort callback is `useCallback` and takes the key as an argument rather than
closing over it, so all five headers share one function — the same pattern the
table already uses for `handleDetailsOpenChange` and for the same reason.

Crafted state reaches `visibleRunewords` as a parameter because both the crafted
filter and the crafted sort key read it. Toggling a runeword therefore re-derives
the visible array, which is correct: under a crafted filter or a crafted sort the
row must move or leave.

### The result count and the empty state are requirements, not polish

Persisting filters means the page can open showing eleven rows. Three things make
that legible: the controls show their own state, a count says "Showing 11 of 99",
and a reset control appears whenever the view is narrowed. The count lives in a
polite live region so a change of filter is announced; the empty state is a
single full-width cell inside the `<tbody>`, not a paragraph after the table, so
the table keeps its shape and screen-reader row navigation lands on the
explanation instead of on nothing.

The reset is shown only when something is narrowed. A permanently visible
"Clear filters" on an unfiltered page is a control that does nothing, which is
the same defect as a token with no use site.

### No new theme token

Four new surfaces, and the two colours they want are already declared with
nothing rendering them: `--color-muted-dark` (`#24221c`) for the search field and
the resting filter chips, `--color-blood-light` (`#802000`) for the selected chip
and the active sort indicator. `IDEAS.md` records both as orphans that
`d2-theme`'s own rules forbid, left for whichever change plausibly wants them,
and asks whoever gets there first to render them or delete them.

That leaves `--color-blood-dark` and `--color-link` still owed a use site, for
`remaining-panels` and `site-header`. The `d2-theme` delta shrinks its scenario
from four to two rather than deleting it.

## Risks / Trade-offs

- **A restored filter is invisible state on first paint.** → The count, the
  controls' own state, and the reset. All three are specified requirements, not
  implementation details, so none can be dropped as polish later.
- **Re-deriving the visible array on every keystroke could undo the row
  memo.** → The derivation is one memo keyed on settings and the crafted set;
  `runeword` object identities come from the dataset and never change, so a
  filtered re-render reconciles the table and skips the rows. The existing
  measurement is the guard: a browser check that opening a panel still re-renders
  two rows, not 99.
- **Sorting by crafted state moves a row the moment it is toggled.** → Expected,
  and the undo notice already exists for it. No animation here; `row-animations`
  is Phase 4. Worth remembering that this is the first control that can move a
  row out from under the pointer.
- **The sticky header can be painted over by the detail panel, or paint over
  it.** → One explicit stacking decision, verified in a browser at a row near the
  top of the viewport while scrolling. This is the kind of defect that only
  appears at a specific scroll offset, which is where review does not look.
- **A category added upstream would silently belong to no slot.** → The mapping's
  totality is a test over the dataset's categories, not a comment. The generator
  already fails on an unknown vendored field; this closes the gap for a category
  that is _valid_ upstream and simply new to us.
- **Two storage keys, two schemas, two policies.** → Genuine duplication of about
  fifteen lines of guard code. Accepted, because merging them would mean one
  module whose write path has to know which half of the payload may be
  overwritten and which must be preserved, and that is a worse thing to own.
- **The search matcher's ASCII assumption.** → True today and load-bearing
  already elsewhere in the build. It becomes false with `russian-locale`, which
  is the change that introduces the text and therefore owns the collation
  question. Recorded in `IDEAS.md` rather than pre-solved here.

## Open Questions

- Does the slot filter want a count per option — `Shield (10)` — so the player
  can see what a slot holds before selecting it? Cheap to derive and genuinely
  useful, but it is four more numbers on a control bar that already carries a
  count, and it interacts with whether the numbers respect the other filters.
  Left out; `remaining-panels` is about to render per-slot aggregates anyway and
  may answer this better.
- Should the crafted filter's "remaining" become the default once the player has
  crafted anything? It is what a returning player wants and it is also a control
  changing itself. Not doing it: the persisted setting is the honest version of
  the same idea.
