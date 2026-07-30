# Proposal: merged-remaining-panel

## Why

Two closed disclosures cost **160px of vertical space** between the progress band
and the browsing controls — two full-width bands of 44px and the three 24px gaps
that separate them from their neighbours — and a closed band carries no
information beyond its own title. Measured on the built page: the first table row
starts at y=554 on a 1280×900 viewport and at y=722 on a 390×900 one, where the
whole first screen is chrome and about 180px of table.

The two panels are also the same _kind_ of thing said twice. They answer one
question — what does the rest of the Chronicle still cost — from two sides, they
are consulted together, and `remaining-needs` already treats them as one
capability. Two identical bands stacked is the interface admitting it has two
components rather than telling the reader they have one job.

Open, they are worse than they need to be too. The bases list is **55 rows** with
nothing crafted — 1680px — and stacking the 440px rune list above it makes 2144px
of panel at desktop, where the two side by side are as tall as the taller one and
nothing else.

## What Changes

- **One collapsible panel** where there were two, titled for both lists, holding
  the runes and the bases as two labelled sections. The collapsed state becomes
  one band instead of two — **68px saved** — and the panel is still one press
  from the reader.
- **Two columns from the `md` breakpoint**, runes beside bases, so the open panel
  is as tall as its taller half rather than as tall as both — 1680px against
  2144px, measured. Below `md` they stack, which is the only thing that fits at
  390px.
- The section headings become the copy the two panel titles were, shortened to
  what a section inside a named panel needs; the panel's own title names both.
  The tier headings inside the runes list drop one level, so the page's heading
  order stays `h1` → panel `h2` → section `h3` → tier `h4`.
- **Unchanged:** both aggregations, their order, their per-entry copy, their
  completion messages, the collapsed-by-default rule, the not-persisted rule, the
  keyboard path, and the position between the progress indicator and the browsing
  controls. Nothing about the two lists' content moves.

## Capabilities

### Modified Capabilities

- `remaining-needs`: the presentation requirement changes from "each in its own
  collapsible panel" to one panel with a labelled section per list, and the
  completion message moves from being a property of a panel to being a property
  of a section. Everything the capability says about the two aggregations
  themselves is untouched.

## Impact

- **Code**: new `src/components/RemainingNeeds.tsx` holding the two sections and
  the two-column layout; `src/App.tsx` mounts one panel instead of two;
  `src/i18n/en.ts` gains the panel's title and two section labels and loses the
  two panel titles; `RemainingRunes` tier headings become `h4`. `RemainingPanel`
  itself — the disclosure shell — does not change at all, which is the point of
  it having been one shell used twice.
- **Tests**: `App.test.tsx`'s panel helpers now find one panel; new
  `RemainingNeeds.test.tsx` for the sections and the heading order;
  `RemainingRunes.test.tsx` for the heading level.
- **Specs**: `remaining-needs` delta only.
- **Not touched**: the sticky progress band and table header band and the
  `--progress-band-height` coupling between them — this change removes space above
  the table without going anywhere near that arithmetic, which is why it is this
  change and not the one that folds the counts into the sticky band.
