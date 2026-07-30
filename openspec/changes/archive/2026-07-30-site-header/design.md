# Design: site-header

## Context

The page opens with an `<h1>` and the ornamental divider, both direct children
of the one `<main>` grid in `App.tsx`. Everything the Phase 1 layout puts above
the progress bar besides the title — the patch line and the Help, Feedback and
Update Notes links — does not exist. The reference site's header is the model:
title with a patch line beneath it on the left, links on the right, the divider
closing the band (`docs/REFERENCE.md`).

Standing constraints this change inherits:

- `--color-link` (`#39a9f7`) is the last token declared with nothing rendering
  it, explicitly owed to this change by `d2-theme`'s scenarios. Owed does not mean
  it has to be worn: `d2-theme` accepts either rendering it or removing it, and
  Decision 6 ends up doing both in that order.
- Every display string goes through `src/i18n/`; dataset-like identifiers do
  not. The patch number is the same in both locales, so it is a value the copy
  layer receives, not copy it owns.
- The progress band is `position: sticky; top: 0` inside the `<main>` grid, and
  `--progress-band-height` couples it to the table header band. Nothing above
  the divider may become sticky without re-opening that arithmetic.
- The vendored dataset carries per-runeword `version` fields but no
  dataset-level patch version, so "which patch is this list" has no machine
  source — it was read off the reference site's own header on 2026-07-28.

## Goals / Non-Goals

**Goals:**

- The header band: title, patch line, the feedback link and the help disclosure,
  above the divider, with nothing below the divider moving.
- A proper `banner` landmark; every label and accessible name through the copy
  layer, including the fact that a link opens a new tab.
- An in-page explanation of how the page is used, on the platform's own
  disclosure semantics and with no state stored anywhere.
- The ahead-of-use token count reaches zero.
- The Feedback link pointing at a Discussions page that actually exists.

**Non-Goals:**

- No overlay dropdown for the help (the reference has one; see Decisions).
- No footer, no language switch, no sticky behaviour for the header.
- No dataset or generator change — the patch value is application code.
- No restyling of anything below the divider.

## Decisions

### 1. `<header>` as a sibling before `<main>`, not a grid item inside it

A `<header>` only exposes the `banner` role when it is not a descendant of
`main`, so the component mounts as `<header>` immediately before the existing
`<main>` in `App.tsx`. The `<h1>` and the divider move into it; `<main>` then
starts at the progress band, which is also the honest reading of what the main
content is.

The cost is that the centring constraint (`mx-auto max-w-6xl` and the gutter
padding) now appears on two elements instead of one. Accepted: a wrapper `<div>`
carrying the grid around both landmarks would fix the duplication by demoting
the page's two landmarks to children of a presentational box, and the sticky
progress band inside a re-parented grid is exactly the kind of thing that
breaks at one scroll offset. Two class lists that must match, stated in a
comment on each, is the smaller risk.

Sticky is unaffected either way: the band is sticky within `<main>`'s grid and
the header scrolls away above it, which is the intent — the header has no claim
on permanent viewport height.

### 2. Layout: title block left, Feedback right, help below both

Flex row with `justify-between`: the title with the patch line under it on the
left, Feedback on the right, aligned to the baseline area of the title block as
the reference does. At narrow widths the link wraps beneath the title block
rather than compressing it, and nothing here needs a breakpoint more precise than
"let flex wrap".

**Help sits on the title's line beside Feedback**, in the reference's own order
(Help, then Feedback), and its panel opens as the next row of the header's grid —
across the width, keeping the left rule everything else on the page is aligned to
(title, divider, controls, table) and the full measure.

Two intermediate versions are worth recording because they are what the layout
argument actually is. A trigger on its own row right-aligned under Feedback spends
a whole empty line on a closed control. The same trigger left-aligned groups it
with its panel but takes it out of the header's cluster of controls. Sitting it
beside Feedback costs neither, and it is what forces the disclosure to be a button
rather than a `<details>` — see Decision 4.

### 3. The patch value and link targets live in `src/header/site.ts`

A new `src/header/` module (the `src/crafted/`, `src/view/` pattern) exporting
three constants: the game patch string (`"3.1.1"`) and the two URLs. Rationale
per value:

- **Patch**: displayed, but identical in every locale — a dataset-like
  identifier, so it is passed into a copy-layer function
  (`header.patchLine(patch)`) rather than written into the string. Not a
  dataset field: the generator has no source for it (`docs/DATA-SOURCES.md`
  confirms the vendor ships no site-level version), and a generator emitting a
  sourceless field is the defect its rules exist to prevent. A hand-maintained
  constant with a comment naming where it was read from is the honest form.
- **Feedback** → `https://github.com/Jekman87/diablo2-runeword-tracker/discussions`.
- **Patch notes** → the official Blizzard patch-notes article for the stated
  patch, copied from the reference site's own Update Notes href at
  implementation time (the exact article URL is verified then, not guessed
  now). Reached from the patch value in the patch line, so this URL and the patch
  constant are one pair on adjacent lines.
- **No Help URL.** Help is an in-page disclosure (Decision 4), so the project's
  own documentation is not a header destination at all.

URLs are not display copy — nothing in the copy layer holds them — but they are
also not scattered: one module, so the patch constant and the patch-notes URL
that must move together sit on adjacent lines.

### 4. Help is an in-page disclosure, and a `<details>` rather than an overlay

This was first decided the other way — Help as a link to the README, on the
grounds that a disclosure is a new interactive surface bought to duplicate the
README — and reversed on reading what the link actually offers a player: a
repository written for whoever maintains the project, opening with build
commands. A reader asking how the page works is not asking for that, so the
header now answers the question itself.

**A button with `aria-expanded` and `aria-controls`, not a `<details>`** — and
that is a layout constraint rather than a preference. A `<summary>` must be the
first child of the `<details>` it opens, so a native disclosure cannot have its
control on the title's line and its panel in the next row of the header's grid;
one element cannot straddle two rows. Since Decision 2 puts the control beside
Feedback, the native element is off the table.

It was written as a `<details>` first and the trade is worth stating, because
`RemainingPanel` is a real one and the next reader will wonder why this is not.
What the platform would have supplied is supplied by hand: `useState` for the
state, `aria-expanded` on the control, `aria-controls` naming the panel, and the
panel kept mounted so that reference always resolves. What is lost is Chromium's
hidden-until-found, so find-in-page cannot open this panel the way it can open the
remaining panels. Three lines of state and two attributes for the position the
header wants; the loss is one browser affordance on a block of prose.

The panel is hidden by the `hidden` **attribute** with its `display` class applied
only while open. The pairing is deliberate: a `display: grid` class left on
permanently would silently beat `[hidden] { display: none }`, and the attribute
rather than a utility class is what keeps the panel closed where the stylesheet has
not loaded — which is also what lets a jsdom test see it as closed.

**In flow, not the reference's overlay dropdown.** An overlay needs a positioned
ancestor, a `z-index` arbitrated against two sticky bands and the detail view's
panel, an outside-press dismissal, and an answer for what it does at 390px — all
so that opening help does not move a page the reader has just asked to have
explained. Pushing the divider down is the conduct the two remaining panels
already have, and the header scrolls away anyway. The trade is that at 390px the
open panel is taller than the viewport; it is prose the reader opened
deliberately, and closing it is one press on the control they just pressed.

The prose lives in the copy layer as one intro string and five points, in the
order the page presents the features. Not a manual with sections: a tracker whose
whole interface is one screen owes its reader an answer in the first sentence.

### 5. Links open in a new tab, and say so in their accessible names

This was also first decided the other way, on the grounds that a link hijacking
the tab needs `rel` hygiene and an explanation. It needs both, and both are
cheap: `rel="noopener noreferrer"` withholds the opener reference and the
referrer, and the explanation belongs in the link's own accessible name.

What makes the new tab right here is what the page is. The tracker is a thing a
player keeps open while reading patch notes in one hand and ticking runewords
with the other; navigating away to read 3.1.1's notes and coming back through
history is the tab doing the wrong job. The two destinations are also both
off-site, which is the case where a new tab surprises nobody.

So each link carries `target="_blank"`, `rel="noopener noreferrer"`, and an
`aria-label` from the copy layer whose text ends "opens in a new tab" — stated
before activation rather than discovered after it. The whole name is written in
copy rather than stitched together in the component from a label and a shared
suffix, because the comma joining the halves is punctuation and punctuation
around a value is the copy layer's business. Each name contains its own visible
label, so `label-in-name` holds.

### 6. Styling: the gold family, and `--color-link` deleted

The links first rendered `text-link` (`#39a9f7`), the token `d2-theme` had held
for exactly them. Rendered, it was the one colour on the page from outside the
gold family and read as a link borrowed from another site — contrast was never
the problem (~7.9:1 on black), belonging was.

So the header's pressable text — both links and the help trigger — takes
`text-gold-mid` at rest and `text-gold-light` with an underline under the
pointer, the pair a runeword's name in the detail view already moves between, and
`--color-link` is **removed from the palette**. That is `d2-theme`'s own rule
applied to itself: a token whose last use site is gone goes with it, as
`--color-backdrop`, `--color-title` and `--color-danger` did. `#a79663` on black
is ~7.2:1.

The patch line stays `--color-muted` — secondary text beside a gold title, the
role that token already plays in the table — with the patch value inside it drawn
as the one pressable thing in the sentence.

### 7. GitHub Discussions is enabled as a task, before the code merges

`gh repo edit Jekman87/diablo2-runeword-tracker --enable-discussions` (or the
settings UI). Ordered first in tasks so the Feedback link never points at a
404, even on the deploy that ships it.

### 8. d2-theme delta: the count reaches zero, and one token leaves

The "one remains — the link colour" scenario becomes "none remain", and the
"surface with no component still has no token" scenario loses the site header as
its example (the requirement itself stands; the example moves to a generic "a
surface no change has built yet"). No token is added; one is **removed**, and the
delta records that as its own scenario, because "the token was rendered and then
judged wrong" is a different piece of accounting from "the token was rendered"
and the next change reading this file should be able to tell them apart.

## Risks / Trade-offs

- **[The Blizzard article URL rots]** → It is one constant in one module, and
  the failure is a cosmetic dead link, not wrong data. The comment beside it
  names the reference header as the place to re-read.
- **[The patch constant goes stale when the game patches]** → Same shape as a
  stale badge: information for the player, enforced by nothing. The constant
  sits beside the Update Notes URL so the pair updates together; updating it
  is a one-line data correction, not a change.
- **[Two width class lists can drift]** (`<header>` vs `<main>`) → Each carries
  a comment naming the other; a drift is immediately visible as a misaligned
  left edge on a page with a hard vertical rule under it.
- **[Discussions enablement is manual and outside CI]** → First task, verified
  by loading the URL; if it is ever disabled later the link 404s but nothing
  else degrades.
- **[Prose in the new component can leak Tailwind classes]** → The class-list
  diff against the previous build is the established check; run it as the
  change's verification step. This change carries more prose in a component than
  any before it — the help panel is six strings of it — so the check earns its
  place here rather than being a formality.
- **[The help copy goes stale as the page changes]** → It describes six features
  by what they do, not by where they sit, so a restyle does not invalidate it; a
  change that adds or removes a feature updates a string. Nothing enforces that,
  which is the same standing as every other piece of display copy.
- **[The open help panel is taller than a 390px viewport]** → Measured at 688px
  against 900px of viewport minus the header. It is prose the reader asked for,
  the control that closes it is the one they just pressed, and the alternative was
  an overlay with a `z-index` argument against two sticky bands (Decision 4).
