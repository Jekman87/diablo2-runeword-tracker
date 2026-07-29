## Context

`runeword-table` is archived and its four capabilities are in `openspec/specs/`.
Everything here is a correction to that work, found by comparing the deployed page
against the reference, so every delta lands on an existing requirement rather than
introducing a capability.

Three of its decisions are reversed or narrowed by this change, and each was
recorded well enough to be reversed deliberately rather than by accident:

- **Task 9.1, "add no dependency"** — correct for a click-opened modal `<dialog>`,
  wrong for a hover-opened panel.
- **The native `<dialog>` with `showModal()`** — chosen for its free focus trap,
  Escape handling and focus restoration. All three are still required; none of
  them survives being opened by hover.
- **`--color-patch`, a single token** — `d2-theme` declared one because
  `runeword-table` rendered one badge shape. The reference colour-codes by era and
  we did not notice.

Two facts about the data bound what follows. The dataset holds exactly five patch
values — 46 records at `1.10`, seven each at `1.11`, `2.4`, `2.6` and `3.0`, 25
with none — and fifteen of the 99 carry an item-type restriction. Both were
counted, not assumed.

## Goals / Non-Goals

**Goals:**

- The detail view opens the way the reference opens it, on hover, without losing
  the keyboard and touch paths that already work.
- A patch badge's colour tells you which era introduced the runeword.
- The rune column can be read by somebody who does not know the runes by
  silhouette.
- A restriction reads as a qualification of its categories rather than as more of
  the same sentence.
- Every colour stays a named token, and no class name is assembled at runtime.

**Non-Goals:**

- Changing what the detail view contains. Same record, same order, same derived
  socket count — with one subtraction: **the close button goes.** It was
  `<dialog>`'s, not the view's. `showModal()` needed a first focusable element and
  focused it, so the panel had to offer one; a panel that appears when the pointer
  rests on a name is left rather than closed, and Escape, an outside press and
  moving the pointer away are the three ways to leave it. Nothing is lost by it:
  the panel holds no other control, so there is no keyboard reach to give up, and
  what tells assistive technology the panel exists is `aria-expanded` and
  `aria-controls` on the name.
- Making the badges legible. The reference's contrast is adopted as-is, by
  decision, with the numbers recorded below.
- Renaming `--color-accent`, whose name is poor by the theme's own rule. Reported,
  not fixed.
- Any tooltip mechanism for the badges. Their `title` attributes are untouched.
- Sorting, filtering or searching.

## Decisions

### The panel is per-row, and the trap is conditional on how it opened

`useHover` binds to a single reference element. There is no version of it that
watches 99 buttons and reports which one the pointer is over, so each row owns its
own `useFloating` context and its own interaction hooks. `RunewordDetails` is
therefore one component holding both the name button and the panel, because the
two have to share that context, and `RunewordTable` gives up the `selected` state
and the single shared dialog it owns today.

The alternative — one instance at table level driven by a virtual reference, with
hover tracked by hand across 99 buttons — is the hand-rolled interaction logic the
dependency exists to avoid, and it would have to reimplement `safePolygon` on top.

**But which panel is open is the table's, and it took a bug to see why.** The
first cut gave each row its own open flag, and "only one panel at a time" then
rested on two accidents: hovering a second name closed the first because
`safePolygon` gave up when the pointer left, and pressing a second name closed the
first because `useDismiss` saw the press land outside. Neither covers a panel
pinned open by a click and then a _hover_ somewhere else — no press, and nothing
for `safePolygon` to reason about — so two panels overlapped. Ninety-nine
independent flags cannot express "one at a time" because each one only knows about
itself, so the flag is one value at table level and the overlap is gone by
construction rather than by luck.

Three consequences, each of which had to be measured rather than assumed:

- **The rows are memoised.** With the flag on the table, every open re-renders it
  — and without `memo`, all 99 rows with it. In Chromium that was 37–50ms from
  click to painted panel and long tasks up to 127ms, for a change affecting two
  rows. Memoised it is 14–35ms with no long tasks at all. This is why the row and
  the panel take a `boolean` rather than the open runeword's name: the name differs
  for all 99 and would defeat the comparison.
- **The replaced panel's returning focus is not a request to reopen.** Closing a
  panel that held focus hands it back to the name that opened it, and `useFocus`
  cannot tell that from a reader tabbing in — so the replaced panel reopened
  immediately and won. Pin a name with Space, hover another, and the pinned one
  stayed.
- **That has to be arbitrated on the table, not in the row.** A flag passed down
  arrives one commit too late: React unmounts the panel _before_ it updates the
  sibling name button's props, so the focus event is delivered under the old props.
  This was built the other way first and the timeline showed the reopen landing
  between the two requests. The table sees both requests in order, in one tick, and
  declines the second — a focus-reason open from the row whose panel it has just
  replaced.

Only the open panel is ever rendered (`{isOpen && …}`), so the guarantee that the
document holds no per-row detail markup survives unchanged. What does not survive
is the cost profile: 99 rows each running `useFloating` plus four interaction hooks
is real per-render work the single `<dialog>` did not have. It is bounded and
measurable, and it is called out in the tasks as something to measure rather than
assume.

**The trap is conditional, and on three cases rather than two.** This is the one
place where the existing requirement had to be interpreted rather than preserved
literally. It says "while it is open, keyboard focus SHALL remain within it",
written when the only way to open the panel was to activate a button on purpose.
Applied to a hover-opened panel it would seize the keyboard as the pointer swept
the table, which is not what the requirement was protecting.

The first draft of this decision split that two ways — deliberate or not — and put
keyboard focus on the deliberate side beside a click. **Using it in a browser
showed that to be wrong, and wrong in a way that made the page unusable.** Focus
reaching a name is what opens that name's panel, so a trap closes over the keyboard
on the very first row: Tab reaches row 1's name, the panel opens, focus is pulled
onto the panel, and every subsequent Tab cycles there. Escape hands focus
back to the name and the next Tab walks straight back in. Rows 2 to 99 cannot be
reached at all. The design's own argument against trapping on hover — that a
passing pointer must not seize the keyboard — applies verbatim to focus sweeping
99 rows, and the first draft simply did not notice it.

So there are three cases, and `FloatingFocusManager` gets different props for each:

| Opened by                   | Focus manager                 | Behaviour                                     |
| --------------------------- | ----------------------------- | --------------------------------------------- |
| Activated — click, tap, key | `modal`, `initialFocus: 0`    | Focus enters, is contained, and is given back |
| Focus reaching the name     | non-modal, `initialFocus: -1` | Focus is not moved; Tab flows in, then onward |
| Hover                       | `disabled`                    | No focus management at all                    |

`disabled` rather than `modal={false}` for hover because a non-modal manager still
moves focus into the panel on open, which is the one thing a hover-opened panel
must never do. And `initialFocus: -1` on the focused case for the same reason: the
panel appears beside the name the reader is already on, and pulling focus off it is
what the dead end above was made of.

The non-modal case is what makes a keyboard reader's path through the table read
sensibly: socket, name — panel opens — into the panel, out the far side to the next
row's socket, and the panel closes behind them. Measured in Chromium, all 99 rows
are reachable, and a clicked panel still contains focus and still returns it.

Which trigger fired is tracked in state alongside the open flag, because
`onOpenChange` reports the event that caused the change and that is the only moment
the distinction is available. Activating a panel that hover or focus already opened
promotes it to the activated case, which is right: the reader has now asked to be
there.

### `useDismiss` and `FloatingFocusManager` replace what `<dialog>` gave for free

`showModal()` supplied four things: the focus trap, Escape to close, `::backdrop`,
and focus returned to the invoking element. The replacements are
`FloatingFocusManager` (trap, and `returnFocus`) and `useDismiss` (Escape, and
outside-press). The backdrop goes away entirely, which is correct — a hover panel
has no business dimming the page — and `--color-backdrop` loses its only use site.
It is therefore deleted rather than left declared: `d2-theme` requires a token to
have a component that renders it, and a token nothing renders is the same defect as
a surface with no token. The requirement is extended to say so outright, since it
previously only forbade declaring a token too early and not keeping one too long.

The jsdom `showModal` shim in `src/test/setup.ts` exists only for the `<dialog>`
and can go with it, which is a small win: the tests stop asserting against a
stand-in for the platform and start asserting against the library's real behaviour.

### The patch-to-colour mapping is an explicit record, not a computed class

```
1.10, 1.11   #513B2C   one classic era, deliberately one colour
2.4          #B87333
2.6          #588425
3.0          #7B3FE4
```

Four tokens for five values. The mapping is a literal `Record<string, string>` of
full class strings, looked up by the patch value with an empty-string fallback:

- **Tailwind scans source text.** `` `bg-patch-${patch.replace(".", "-")}` `` never
  appears in the source as `bg-patch-3-0`, so the utility is never generated and
  the badge renders unstyled. It fails silently, at build time, only in production,
  and only for the patches nobody checked.
- **The fallback is the point.** A future `3.1` that nobody has picked a colour for
  renders with no colour class — visibly plain, obviously unfinished — rather than
  inheriting whichever colour happened to be last or defaulting to a wrong one.
- **Not `cva`.** Its variants would have to be keyed by the five literals, and the
  dataset types `patch` as `string | undefined` rather than an enum, so every call
  site would need a narrowing cast. A plain record with a fallback expresses
  "unknown values are expected" directly.

### The reference's contrast is adopted with the numbers on the table

Measured against WCAG 2.1 AA for normal text (4.5:1):

| Patch         | Background | Black text | Verdict               |
| ------------- | ---------- | ---------- | --------------------- |
| `1.10`/`1.11` | `#513B2C`  | 2.01:1     | fails                 |
| `2.4`         | `#B87333`  | 5.54:1     | passes                |
| `2.6`         | `#588425`  | 4.74:1     | passes                |
| `3.0`         | `#7B3FE4`  | 3.67:1     | fails (AA-large only) |

The current gold-on-brown scores 4.88:1 and passes. Matching the reference makes
the most common badge in the dataset — 46 of 74 that carry one — less legible than
what it replaces. That is the decision, taken knowingly, and the mitigation if it
is ever revisited is one foreground per token and nothing else.

The badge's meaning does not depend on its contrast: every badge carries its full
text as its accessible name and the detail view restates patch, ladder status and
note in full words. What is lost is the ability to read `1.10` at a glance, not the
information.

### The badge audit, in full

Eight differences from the reference. All are corrected.

| Badge   | Property      | Ours                    | Reference           |
| ------- | ------------- | ----------------------- | ------------------- |
| Patch   | text          | `#BAB197` gold-light    | black               |
| Patch   | padding       | `4px 0`                 | `2px 4px`           |
| `L`     | background    | `#501008`               | `#501008` — matches |
| `L`     | text          | `#A19999`               | `#A19999` — matches |
| `L`     | border-radius | `4px`                   | `100%`              |
| `L`     | padding       | `4px 0`                 | `1px 5px`           |
| `Note!` | background    | `#AE2A1A` shared danger | `#7A1F1F`           |
| `Note!` | text          | `#D5D2D0` title         | white               |

Two observations worth recording. The `L` badge's colours were already exactly
right, so only its shape was ever wrong — the round marker was not a deliberate
departure, it was never implemented. And `Note!` scores 4.44:1 today, marginally
under AA; the reference's darker red with white scores 10.3:1, so this is the one
badge the change makes _more_ legible.

`Note!` gets its own token rather than continuing to borrow `--color-danger`. The
original comment reasoned that a marker one runeword carries did not deserve a
fifth token; the reference disagrees by using a different red, and a token that
means "the note badge" cannot be the same token that means "danger".

### Rune icons render at 40px with their names beneath

40px is the sprite's native cell. Rows go from 41px to 75px:

| Icon                   | Row  | 99 rows | vs today |
| ---------------------- | ---- | ------- | -------- |
| 24px (today, no label) | 41px | ~4060px | —        |
| 28px                   | 63px | ~6240px | 1.54×    |
| 32px                   | 67px | ~6630px | 1.63×    |
| 40px                   | 75px | ~7430px | 1.83×    |

Row height is `size + 35px`: the icon, a 2px gap, a 16px line-box for the 12px
label, 16px of cell padding and the 1px separator. The widest cell — six runes at
40px with 4px gaps — is about 260px against roughly 154px today.

Below about 28–30px the label `Shael` rather than the icon sets the cell width, so
shrinking past that point costs legibility and saves nothing horizontally. That
argues for the larger end of the range, and 40px is the ceiling: the sprite is
40×40 and anything above it upscales.

**The consequence is a spec deletion.** `Rune icon size is set by the use site`
requires a row icon to be _strictly smaller_ than the detail view's, and the detail
view already renders at the 40px default. At native size in the row the two are
equal, so that requirement cannot survive. It is removed and replaced by
`Rune icon size and its native ceiling`, which keeps the part that was actually
load-bearing — one sprite, one derivation, one size value set by the use site, no
restated offsets — and replaces "the row is smaller" with "40px is the ceiling".

Renaming rather than editing is forced by the tooling and is also more honest: the
archiver refuses to let a `MODIFIED` block drop a scenario, precisely so that a
deletion cannot hide inside an edit. This deletion is deliberate and gets to be
visible.

**The icon becomes decorative when its name is visible.** `RuneIcon` carries
`role="img"` with the rune's name as its accessible label, which was right when the
icon was alone in a row. With the name rendered beside it, a screen reader would
announce every rune twice — 686 announcements for a table of 343 runes. The icon
takes an option to render `aria-hidden` instead, and the visible text carries the
name. The label is still the dataset's canonical rune name and still does not pass
through the strings layer.

### The item-type restriction becomes a component, because a string cannot carry two colours

`itemTypesLabel` returns `string`. Two colours on two lines cannot come out of a
function with that signature, so it becomes `<ItemTypes runeword={runeword} />`,
used by both the row and the panel exactly as the function was.

The split of responsibility does not move: the categories are canonical
identifiers joined by a separator from the strings layer, and the parentheses are
punctuation and therefore copy. What changes is that
`strings.itemTypes.withRestriction(categories, restriction)` — which built one
string from both halves — becomes `strings.itemTypes.restriction(text)`, which
brackets the restriction alone, because the two halves are now two elements.

Colours: the categories take `--color-muted`, which is already exactly the
reference's `#74706C` and whose name already states the role. The restriction gets
a new `--color-item-restriction` at `#BD8547` — a value `--color-accent` already
holds, but "accent" names no role and is already the detail view's note colour.
Two roles sharing a hex is fine; one token serving two unrelated roles is what the
theme's naming rule exists to prevent.

The reference calls its class `rw-ItemTypes-class`, which is wrong — the field
holds `(Not Orbs/Wands)` as readily as `(Assassin)` — so the name is not copied.

### One dependency, and what it is buying

`@floating-ui/react`, added as a runtime dependency and enumerated in
`build-toolchain`'s list beside `clsx`, `tailwind-merge`,
`class-variance-authority` and `zod`, with `docs/CODE_RULES.md` updated to match.

What it buys that would otherwise be hand-written: flipping the panel above the
pointer for rows near the bottom of a 7400px table, shifting it inward at the
viewport edges, keeping it positioned as the page scrolls, and `safePolygon` — the
one that is genuinely hard, which keeps the panel open while the pointer travels
across the gap toward it instead of closing the moment it leaves the name.

## Risks / Trade-offs

- **99 floating contexts** → Bounded and measurable. Only one panel is ever in the
  document; the cost is hook setup per row, not DOM. Measured in the tasks against
  the current build rather than assumed to be fine.
- **Two patch badges below AA** → Accepted by explicit decision, numbers recorded
  above. Reversible with one foreground per token.
- **A 1.83× longer page** → Accepted. The runes column is the recipe, and a recipe
  that cannot be read costs more than scrolling does. `search-sort-filter` adds the
  filters that make a long table navigable, and it is the next change.
- **Losing the `<dialog>` loses the platform's focus behaviour** → Replaced by
  `FloatingFocusManager`, which is the library's purpose-built equivalent. The
  keyboard path is the one thing this change must not regress, so it gets explicit
  scenarios and explicit tasks rather than being assumed to still work.
- **Hover has no keyboard or touch equivalent** → Which is exactly why it is not
  the only trigger. Focus covers the keyboard, click covers touch, and every one of
  the three opens the same panel.
- **The jsdom shim goes away** → Tests that asserted against a hand-written
  `showModal` now assert against `@floating-ui/react` in jsdom. Hover is testable
  with `pointer` events; `safePolygon` geometry is not, and joins the browser
  checks.
- **Rune markup roughly doubles** → The responsive collapse already renders each
  sequence twice with one copy hidden; each copy now carries labels too. Still
  cheaper than a `useMediaQuery` hook that makes layout depend on script.

## Migration Plan

No data migration and no persisted state is touched. `crafted-tracking`'s
`localStorage` key, the crafted set and the progress denominator are all
untouched — this change never reads them.

Deployment is the existing path: merge to `main`, the gate runs, Pages publishes.
The one new thing in the bundle is `@floating-ui/react`, so `pnpm build` output
size is worth recording before and after.

Rollback is reverting the commit. Nothing outside the bundle changes, so a revert
restores the previous behaviour completely.

## Open Questions

- **Does `safePolygon` need tuning for a 75px row?** The default polygon is
  generous, and rows are now tall enough that adjacent names are far apart. If the
  panel proves hard to reach or too sticky, the delay and the `buffer` are the two
  dials. Not decidable without using it — a browser check, not a design decision.
- **Should the detail view survive at all once the row is this legible?** A row now
  carries the runes with their names at the same size the panel draws them, so the
  panel's remaining unique content is the property list and the availability
  sentences. That is still most of its value, so it stays — but if a later change
  finds the panel is only ever used for properties, it has a smaller job than it
  was given.
