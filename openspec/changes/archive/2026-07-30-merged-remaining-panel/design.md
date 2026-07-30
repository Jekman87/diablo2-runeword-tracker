# Design: merged-remaining-panel

## Context

`App.tsx` mounts two `RemainingPanel` shells, each with a title and one content
component:

```tsx
<RemainingPanel title={strings.remaining.runesTitle}>
  <RemainingRunes runes={stillNeededRunes} />
</RemainingPanel>

<RemainingPanel title={strings.remaining.basesTitle}>
  <RemainingBases bases={stillNeededBases} />
</RemainingPanel>
```

`RemainingPanel` is a native `<details>` with the title as an `<h2>` in its
summary. `RemainingRunes` renders three tier bands with `<h3>` labels and drops a
band whose runes are all satisfied; `RemainingBases` renders a flat list of
`(category, sockets)` rows. Each returns a completion sentence instead of its list
when its aggregation is empty.

Measured on the built page, closed: each band 44px, three 24px gaps, **160px**
between the progress band and the controls; first table row at y=554 (1280×900)
and y=722 (390×900).

Standing constraints this change inherits:

- `remaining-needs`: collapsed by default, open state not persisted, keyboard
  operable with the expanded state exposed, placed between the progress indicator
  and the browsing controls, an empty aggregation says so rather than vanishing.
- The panels are in normal flow on purpose. The progress band and the table header
  band are sticky and coupled by `--progress-band-height`; reference material
  closed by default has no claim on permanent viewport height.
- Every display string goes through `src/i18n/`; rune names and base categories
  are dataset identifiers and do not.
- Copy with nothing rendering it is a defect this project removes rather than
  leaves — the reason `detail.close` went out with the close button.

## Goals / Non-Goals

**Goals:**

- One band closed instead of two, with nothing else about the panels' conduct
  changing.
- An open state no taller than it needs to be at desktop widths.
- A heading order that still reads `h1` → `h2` → `h3` → `h4`.

**Non-Goals:**

- No change to either aggregation, its order, its per-entry copy or its
  completion message.
- No change to `RemainingPanel`, the disclosure shell.
- No counts in the closed band, no popover, no sidebar, no sticky placement —
  each was considered (see Decisions) and each is a different change.
- No change to where the panel sits in the page.

## Decisions

### 1. One panel with two sections, not two panels and not a tab strip

The merge is the whole change: `RemainingPanel` is mounted once, and its content
is a new `RemainingNeeds` holding both lists behind their own headings.

A tab strip inside the panel was the alternative — one visible list at a time,
even shorter. Rejected: tabs are a new interactive surface with their own keyboard
contract (arrow keys, `aria-selected`, a tablist role) bought to hide one of two
lists that the reader opened the panel to consult _together_, and the two-column
layout below already makes showing both cheap.

### 2. The sections live in `RemainingNeeds`, not in `App.tsx`

`App.tsx` stays a shell that owns state and mounts children; a second heading
level and a responsive column rule inside it would be presentation living in the
page. `RemainingNeeds` takes the two aggregation results and owns the structure,
which also gives the section headings and the heading order a test file of their
own.

It takes the results rather than deriving them, exactly as the two content
components do — the memoised aggregates stay in `App.tsx` beside the crafted set
they depend on.

### 3. Two columns from `md`, stacked below it

`grid gap-6 md:grid-cols-2`. Measured at 1280px with nothing crafted, in two 528px
columns: the runes list is 440px of content and the bases list is **55 rows at
1680px**, so the panel is 1680px side by side against **2144px** stacked. The rows
do not wrap at 528px — a base row is a category, a socket count and a sentence, and
it fits — which is why halving the width costs the bases list nothing.

Below `md` they stack, because a rune entry is a 40px icon with its name and count
beside it and two columns of those do not fit in 342px.

The estimate this decision was first written with — "about 650px against 830px" —
was wrong by a factor of two and a half in both terms, because it guessed the
bases list at 25 rows. The shape of the conclusion survived the measurement; the
numbers did not, which is the argument for measuring even when the answer is not
going to change.

Runes left, bases right, in the order the two lists have always been in: a
runeword is runes _in_ a base, and the reader collects the runes.

### 4. The panel's title names both lists; the sections take the short words

- Panel: `remaining.title` — "Remaining Runes and Bases".
- Sections: `remaining.runesSection` — "Runes"; `remaining.basesSection` —
  "Bases".

`runesTitle` and `basesTitle` are **deleted**, not left behind: their words move
into the two new strings, and copy nothing renders is the same defect as a colour
token with no use site.

The short section labels are deliberate. "Remaining Runes" inside a panel called
"Remaining Runes and Bases" says "remaining" twice in two lines; the panel has
already established what the reader is looking at, so the section only has to say
which half this is.

### 5. Tier headings drop to `h4`

The sections are `h3`, so `RemainingRunes`' tier labels — `h3` today, directly
under the panel's `h2` — become `h4`. The `@layer base` rule styles `h1` through
`h4` in the display gold and family, so the level change carries its own
appearance; the `text-lg` on the tier label stays, because level and size are
separate decisions and this one is about outline depth.

That is the one edit inside a content component, and it is there because a heading
order that skips or repeats a level is a defect for exactly the reader who
navigates by headings.

### 6. The delta is removals and additions, not `MODIFIED` blocks

All three requirements are renamed — they were written around two panels, and
their scenarios were named after them ("Both panels load collapsed", "A toggle
updates both panels"). A `MODIFIED` block may not drop a scenario the main spec
has, and a rename counts as a drop, which is the right guard: it is what stops a
scenario vanishing because someone pasted a partial requirement.

So the delta says what it means. Each old requirement is `REMOVED` with its
reason and a migration note, and its replacement is `ADDED` under a name that
describes one panel, carrying every rule the old one had. The first attempt used
`MODIFIED` and the archive step refused it, naming the two scenarios that would
have been lost — worth recording, because the fix is not to soften the delta but
to state the rename.

### 7. What was considered and left for another change

- **Counts in the closed band** ("23 runes · 14 base types still needed") — the
  bigger win, because a closed disclosure would then answer something instead of
  labelling itself. It changes what the closed state _is_, not how many bands
  there are, so it is its own change with its own copy and its own spec scenario.
- **Popovers from the browsing controls** — frees all 160px, and adds a floating
  surface whose `z-index` has to be argued against two sticky bands and the detail
  view's panel.
- **A sidebar at wide widths** — the reference site's shape; the biggest change
  and the only one that also has to answer what the table's width becomes.
- **Folding the counts into the sticky progress band** — rejected outright, not
  deferred: it re-opens the `--progress-band-height` arithmetic, and the failure
  mode there is a strip of table row showing between two bands at one scroll
  offset.

## Risks / Trade-offs

- **[One press now opens both lists, where two presses opened them separately]** →
  That is the point of merging them, and the cost is real: a reader who wanted
  only bases gets runes above or beside them. At desktop they are beside, which
  costs nothing; below `md` the bases list is a scroll past the runes. Accepted
  because the two are consulted together and the closed state is what this change
  is about.
- **[The two-column rule assumes the bases list is the taller half]** → It is, by a
  long way: 1680px against 440px with nothing crafted, and the rune list is bounded
  at 33 entries while the bases list is bounded at 55 rows. As the player crafts,
  both shrink; the layout has no opinion about which wins, and the column that runs
  out first simply ends.
- **[Deleting two copy keys touches every locale]** → There is one locale, and
  `Strings` is derived from it, so a second locale that has not caught up fails
  `pnpm typecheck` naming the key. That is the mechanism working.
- **[Heading levels are invisible until someone navigates by them]** → Which is
  why the new component's test asserts the order rather than trusting the review.
