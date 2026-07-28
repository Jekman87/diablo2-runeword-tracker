## Context

`runeword-table` left the page read-only on purpose and named the two seams this
change has to use. The runeword name is already a real `<button>` inside the
first cell, and its own proposal recorded the collision: _"`crafted-tracking`
wants the whole row clickable while this change makes the name a button inside
it."_ The theme's token requirement already anticipates the toast — its scenario
_A surface with no component still has no token_ names it — and the palette
already carries `--color-crafted`, declared by `d2-theme` for the accent this
change finally applies.

What does not exist yet is any state at all. Everything on the page today is
derived from a static module-scope dataset: `orderedRunewords` is sorted once at
import, `useStrings()` returns a constant, and the only `useState` in the
codebase holds which runeword's dialog is open. This is the first change that
introduces state a user owns and that has to outlive the tab.

Three consumers are already committed to reading that state.
`search-sort-filter` sorts on it and filters by it, `remaining-panels`
aggregates over its complement, and Phase 3's `csv-import-export` reads and
writes the same store. So the shape chosen here is chosen three more times.

Constraints inherited rather than decided here: progress is always out of all 99
([`IDEAS.md`](../../../IDEAS.md), _Availability markers — decided_); the control
is a real button so Tab and Space work; the row is a larger hit target; runeword
names are canonical identifiers; external data is validated with `zod`; and the
dependency list stays minimal.

## Goals / Non-Goals

**Goals:**

- A player can mark and unmark any of the 99 runewords, by pointer anywhere on
  the row and by keyboard on a real control.
- Progress survives closing the tab, and reads out of 99 whatever else the page
  is doing.
- A misclick on the enlarged hit target is recoverable, without the recovery path
  being the only one.
- Storage that is empty, corrupt, stale or unavailable degrades to a tracker that
  still works for the session, never to a blank page and never to silent loss.
- The state's shape is the one `search-sort-filter`, `remaining-panels` and
  `csv-import-export` will want, so none of them has to reshape it.

**Non-Goals:**

- Sorting or filtering by crafted state. The column exists; the interaction is
  `search-sort-filter`.
- Persisting anything other than progress. View settings belong to the change
  that creates them.
- Undo beyond the single most recent toggle. No history stack, no redo.
- Cross-device sync, accounts, or a backend of any kind.
- Animating a row when it is toggled. Phase 4.

## Decisions

### The crafted set is a `Set<string>` of canonical names, held in `App`

Names, not indices and not object references. An index is a property of
`runewords.json`, which is generated — regenerate it against a new patch and
every stored index points at a different runeword, silently. A name is the
identifier `AGENTS.md` already declares canonical, is what `csv-import-export`
already plans to write one per line, and is what a human reading their own
`localStorage` can check.

A `Set` rather than an array because every consumer wants membership: the row
asks "am I crafted", the progress bar asks for a size, and `remaining-panels`
will ask for the complement. An array turns each of the 99 rows' membership test
into a scan. Copy-on-write on each toggle — a new `Set` from the old — because
mutating one in place does not change its identity and React would not
re-render.

The state lives in `App`, which is the nearest common ancestor of the progress
bar, the table and the toast, and reaches the rows as props through
`RunewordTable`. Two levels of prop drilling for one value is not a context, and
it is certainly not a store library. Alternatives rejected: React context (a
provider, a hook and a file to spare two props); Zustand or Jotai (a dependency
for one `Set`); lifting into a module-scope singleton with a subscription (the
`useSyncExternalStore` shape, which is what you build when several unrelated
trees need the value — there is one tree).

The hook `useCraftedRunewords()` owns the set, the toggle, the pending undo and
the persistence calls, so `App` reads as a page and not as a controller.

### Persistence is a pure module, and the hook only calls it

`src/crafted/storage.ts` exports `loadCrafted()` and `saveCrafted()` and knows
nothing about React. This is the project's rule that logic testable without a DOM
lives in plain functions, and here it is the difference between testing the four
failure modes directly and testing them through a rendered component.

### The key is namespaced and versioned; the payload is a bare array of names

`diablo2-runeword-tracker:crafted:v1`.

The namespace is load-bearing, not tidiness. The site is served from
`jekman87.github.io`, and **GitHub Pages serves every project under an account
from one origin**, which means one `localStorage` shared with every other
project the owner deploys there. A key called `crafted` is a collision waiting
for a second project that also tracks something.

The version is in the **key**, not in the payload. A v2 writes a different key,
so v1's data is still sitting there intact if the format has to be rolled back or
migrated — where a `version` field inside one key means a v2 write has already
destroyed the v1 value by the time anyone notices. The payload is therefore just
`["Chains of Honor","Enigma","Spirit"]`, which is also the least surprising thing
for anyone who opens the storage inspector.

Names are sorted on write. Toggling A then B produces byte-identical storage to
toggling B then A, which makes the stored value diffable and makes a test able to
assert on it exactly.

### Stored data is parsed with `zod` and filtered against the dataset

`localStorage` is external input by every meaningful definition: it is
user-editable in two clicks, it is shared with every other page on the origin,
and the only thing that wrote it is a previous version of this application. The
project already refuses to trust `runewords.json`, which is generated and
committed; trusting this instead would be exactly backwards.

`z.array(z.string())` over the parsed JSON, then split against the dataset:

- Names **in** the dataset become the crafted set the interface renders.
- Names **not** in the dataset are kept aside and written back out unchanged on
  every save.

Preserving unknown names is the deliberate half. A name can be absent because the
player edited storage, or because a runeword was renamed or removed between game
patches and the dataset was regenerated — and in the second case, dropping it
means the next patch that restores the runeword restores it unmarked. Carrying it
costs one array on the hook and prevents a class of silent loss that the player
has no way to detect. The counterpart is that unknown names are invisible to the
interface and can never be counted, so a hand-edited storage full of nonsense
still shows a truthful `n / 99`.

Alternative rejected: dropping unknown names on load. Simpler by three lines, and
its failure mode is progress disappearing for a reason the player cannot see —
the same failure `IDEAS.md` already ruled out for CSV import, where it requires
unmatched names to be reported rather than skipped quietly.

### Writes happen on the toggle, not in an effect

An effect that saves whenever the set changes fires once on mount, which means a
load that failed — corrupt JSON, a thrown read — is immediately followed by
writing the resulting empty set over the data that failed to parse. The player
loses everything to a transient error, and the evidence with it.

Saving from the toggle handler makes the write a consequence of the user's
action, so **a failed read never overwrites what it failed to read**. The
recovery path stays open: fix the value by hand, reload, and it is there.

### The control is a `<button aria-pressed>`, not a checkbox

`IDEAS.md` settles that it is a button, and `aria-pressed` is the state a toggle
button carries. A native checkbox would be the other defensible answer, but it
would need `appearance: none` and a rebuild of its box to look like a socket
anyway, so the platform affordance being given up is smaller than it looks. The
button also composes with the row-level handler below without the label/click
interaction a checkbox brings.

Its accessible name states which runeword and which direction — the copy is a
function of the name, as `patchMeaning(patch)` already is — so the control is
unambiguous when a screen reader reaches it out of row context.

### The row is a pointer target only, and never a second tab stop

A click handler on the `<tr>`, and no `role="button"`, no `tabindex`. Making 99
rows focusable would double every tab stop on the page and cost the table the row
and column semantics `runeword-table` chose a real `<table>` to get. The keyboard
path is the button in the first cell, which is already in the tab order and
already the right control.

The handler ignores two kinds of click:

- Anything whose target sits inside a nested interactive element — found with
  `closest()` rather than by comparing against the button, so the name button,
  the toggle itself and anything a later change nests all work without this
  handler being edited. Without it, opening the detail view would also mark the
  runeword crafted.
- A click that ends a text selection, checked with `getSelection()`. Dragging
  across a property list to copy it should not toggle the row underneath.

### Progress is a native `<progress>`, and its denominator is `runewords.length`

The element carries the `progressbar` role, its value and its maximum without any
of it being restated in ARIA, which is the same reasoning that made the detail
view a `<dialog>`. Styling it needs `::-webkit-progress-bar`,
`::-webkit-progress-value` and `::-moz-progress-bar` in `src/index.css` — three
rules next to the two utilities already there, against a `div` with
`role="progressbar"` and four `aria-*` attributes hand-maintained. The bar is
paired with the count in words, because a bar alone does not say `37`.

The maximum is read from the dataset's own length. Not a literal `99`, which goes
stale on the patch that adds a runeword, and **not** a count taken from the
table, which every later change gives a new reason to shrink: a filter, a search,
a slot selection. Reading the dataset directly is what makes it impossible for
`search-sort-filter` to move the denominator by accident.

### The toast is a live region that outlives its own timer when focused

One toast, showing the most recent toggle. `role="status"` — polite, so it is
announced at the next pause rather than interrupting — inside a container that is
in the document from first render, because a live region injected at the moment
its content appears is unreliably announced.

It auto-dismisses after six seconds, **unless focus is inside it**, in which case
the timer is cleared and restarted on blur. This is the failure the proposal
names: a focusable control that removes itself drops focus to `<body>`, and a
keyboard reader loses their place in a 99-row table with no way back but Tab
from the top.

The framing that keeps this proportionate: **the toast is not the undo path, it
is the misclick path.** The undo path is pressing the control again — it is a
toggle, focus is still on it, and Space reverts. The toast exists because the
enlarged row hit target creates a way to toggle something without meaning to, and
that is a pointer gesture. So its Undo button being several tab stops away from
where a keyboard user is standing is a real limitation and not a broken feature.

Activating Undo returns focus to the toggle it reverted, using the element the
row handed over when the toggle happened, so a pointer user who did reach for the
toast is left somewhere deliberate.

### Crafted state is carried by three things, only one of which is colour

The row gets a green tint and a left accent border, as `IDEAS.md` specifies.
Neither is the state: `aria-pressed` on the control is, the socket renders filled
rather than empty, and the accessible name says which direction the next press
goes. A player with a red-green deficiency reads the socket, and a screen reader
reads the button.

### Three tokens, valued from the existing palette

`--color-crafted-row` (the tint), `--color-progress-track` (the bar's unfilled
groove) and `--color-toast` (the toast's panel). Each is a surface a component in
this change actually renders, which is the theme's rule for when a token may
exist.

No new hue. The tint is `--color-crafted` at low alpha so the row reads as the
accent rather than as a fourth green; the track is the muted family the row
hairline already comes from; the toast is the blood family's dark end, as the
detail panel is. The bar's filled portion needs no token — it is
`--color-crafted`, declared by `d2-theme` for exactly this and unused until now.

## Risks / Trade-offs

- **A stored element reference can outlive its row** → The pending-undo record
  holds the toggle's DOM node so focus can return to it. Today no row ever
  unmounts, so it is always live. When `search-sort-filter` lands, a row filtered
  out between the toggle and the undo leaves a detached node — calling `focus()`
  on which is a no-op, not a throw. Degrades to "focus does not move", which is
  the behaviour we would have had anyway. Named here so the change that
  introduces filtering knows to look.
- **`aria-pressed` on a button is less familiar than a checkbox** → Screen reader
  support for toggle buttons is good and the pattern is standard, but a checkbox
  is what many users expect for a boolean in a table. Mitigated by the accessible
  name stating both the runeword and the direction of the next press, so the
  control is self-describing even if its role is not what was expected.
- **Six seconds is a guess** → Too short and the toast is gone before a misclick
  is noticed; too long and it covers the page. The focus rule removes the only
  case where the wrong number causes actual harm, and the toggle-again path makes
  the toast recoverable-from either way.
- **Preserved unknown names accumulate invisibly** → Storage can grow entries the
  interface never shows and the player cannot clear from the page. Bounded in
  practice — they only appear when the dataset loses a name it once had — and the
  alternative is deleting data the player cannot see either. `csv-import-export`
  is the change that gets to surface them, because reporting unmatched names is
  already one of its requirements.
- **Two write paths will exist after Phase 3** → `csv-import-export` writes the
  same key from an import. Confining every read and write to `storage.ts` now is
  what keeps that a second caller rather than a second format.
- **`localStorage` is synchronous and same-tab only** → Two tabs open on the site
  will not see each other's changes and the last write wins. A `storage` event
  listener would fix it in about five lines, and it is deliberately not here: no
  requirement asks for it, and the failure it prevents requires a player to open
  the same tracker twice and toggle in both. Recorded so the omission is a
  decision rather than an oversight.
- **The progress element needs vendor pseudo-elements** → Three rules, one of
  them prefixed per engine, and a browser that supports none of them still shows
  a working native bar. Cheaper than the ARIA a `div` would owe, and the count is
  in text beside it regardless.

## Migration Plan

There is no data to migrate: no version of this application has ever written to
`localStorage`, so every existing visitor loads with the key absent and gets an
empty set, which is the correct state for someone who has marked nothing.

Deployment is the project's existing path — merge to `main`, the quality gate
runs, GitHub Pages publishes. No configuration, no assets, no build change.

Rollback is reverting the commit. Progress written under
`diablo2-runeword-tracker:crafted:v1` stays in the visitor's browser untouched
and is picked up again when the change is re-deployed, because the key is
versioned and nothing else reads it.

## Open Questions

- **Should the toast confirm marking as well as unmarking, or only unmarking?**
  Every toggle raises it in this design, which is the simpler rule and treats a
  misclick in either direction the same. If the confirmations turn out to be
  noise in use — 99 rows means a burst of them on a first sitting — narrowing it
  to one direction is a change to one condition. Not worth deciding before the
  feature has been used once.
- **Where does the progress bar sit relative to the header that does not exist?**
  `IDEAS.md` puts it third in the Phase 1 layout, below the title and the Help
  and Feedback links, and `site-header` has not been built. It goes below the
  divider for now, and `site-header` slots its rows above it without moving it.
