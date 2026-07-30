# Proposal: site-header

## Why

Items 1 and 2 of the Phase 1 layout — the patch line and the Help, Feedback and
Update Notes links — appear in no shipped change: `runeword-table` deliberately
declined to invent a header inside a table change, and every change since has
recorded the gap rather than picked it up. The page currently states a title and
nothing else about itself: not which game patch the 99-runeword list reflects,
not where to ask a question, not where to report that the list is wrong.

The header is also where the last declared-ahead-of-use theme token comes due:
`--color-link` has been held for `site-header` since `detail-view-hover`, and
`d2-theme`'s own scenario says the count falls to zero when this change lands.

## What Changes

- A site header at the top of the page, above the ornamental divider: the
  existing title, a patch line beneath it stating the game patch the tracked
  runeword list reflects (currently 3.1.1), and the ways out of the page.
  Everything below the divider stays exactly where it is.
- Two links, both opening in a new tab and both saying so in their accessible
  name: **the patch value itself**, pointing at the official patch notes for that
  patch — the sentence already names the patch, so the name of the patch is the
  thing to press — and **Feedback**, pointing at the repository's GitHub
  Discussions. Link labels and names are display copy through the strings layer;
  link targets are project-maintained constants, not copy.
- **Help as an in-page disclosure**, not a link off the site: a closed-by-default
  `<details>` holding the whole of how the page is used — marking a runeword,
  the progress bar, search, filters and sorting, the two remaining panels, the
  hover detail view, and where the reader's progress is kept. A reader asking how
  a page works is not asking for the repository of whoever maintains it.
- The header's pressable text renders the gold display family — the same resting
  and hover pair the page's other interactive text uses. `--color-link`, the last
  token declared ahead of any surface, is **removed**: the header was the surface
  it was held for, and a blue link on a page whose palette is gold on black read
  as borrowed from another site. A token nothing renders goes out, which is
  `d2-theme`'s own rule.
- **Prerequisite outside the codebase:** GitHub Discussions must be enabled in
  the repository settings — it is off by default — or the Feedback link points
  at a 404.

## Capabilities

### New Capabilities

- `site-header`: the header band — the title and patch line as the page's own
  identification, the patch value as the way to its notes, the feedback link, the
  in-page help disclosure, and the accessibility of all of it (the banner
  landmark, the new-tab behaviour stated in each link's own name, every word
  through the copy layer).

### Modified Capabilities

- `d2-theme`: the ahead-of-use token accounting changes — the count reaches zero,
  three tokens by being rendered and the link colour by being removed, so the
  "one remains, owed to `site-header`" scenario becomes "none remain", and the
  header's surfaces are recorded as taking the gold display family and the muted
  text colour rather than any token of their own.

## Impact

- **Code**: new header component under `src/components/`; `src/App.tsx` mounts
  it as a sibling before `<main>` (the `<h1>` and the divider move inside it);
  new strings in `src/i18n/en.ts`, including the whole of the help prose; a small
  module holding the patch value and the two link targets; `--color-link` deleted
  from `src/index.css`. No new dependency, no new persistence, no change to the
  dataset or its generator — the vendored source carries no dataset-level patch
  version, so the patch line's value is a project-maintained constant sourced
  from the reference's own header (see `docs/REFERENCE.md`).
- **Specs**: `specs/site-header/spec.md` created; `d2-theme` delta for the
  token-accounting scenarios.
- **External**: repository settings change to enable GitHub Discussions.
- **Not touched**: the sticky progress band and table header band, the
  `--progress-band-height` coupling, the layout below the divider.
