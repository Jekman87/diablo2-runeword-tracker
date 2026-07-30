# Proposal: detail-panel-tooltip

## Why

The detail panel is the one surface on the page that is a copy of something the
player already knows by heart — the game's own item tooltip — and it does not look
like it. Three things are wrong, all of them palette rather than structure:

- **It renders on `--color-panel` (`#200000`), the blood family's dark end, over a
  page whose ground is pure black.** A near-black panel on black has no edge of its
  own; what separates it from the page is a hairline borrowed from the table's row
  separator (`--color-row-line`, `#24221c`), which is as faint as the thing it is
  separating. The game's tooltip is a grey box with a light edge, and the reason it
  is grey is exactly this one: a tooltip that floats over content has to look like
  it is in front of it.
- **The granted properties render green** (`--color-property`, `#48ac3f`). Green is
  the reference site's choice. In the game, an item's magic properties are blue,
  and the tooltip in the player's memory has blue lines in it.
- **Everything else in the panel renders `--color-body`** (`#aca798`, the page's
  tan body text). In the game the descriptive lines — the requirements, the class
  and the speed — are white.

None of this is a defect in what the panel _says_; it is a defect in how much of
the game's own vocabulary the panel gives up.

## What Changes

- The panel's ground becomes a neutral dark grey, so the panel reads as being in
  front of the page rather than cut out of it.
- The panel's edge becomes its own token, brighter than the row hairline it
  currently borrows — the panel's edge and a table's row separator are different
  roles and only ever shared a value by coincidence.
- Granted property lines and their emphasised values move to the game's magic
  blue, in two steps as they are now: the line, and the numeric values within it
  brighter. Slightly brighter than the game's own `#6969ff`, so both clear WCAG AA
  against the new ground.
- The panel's descriptive text — socket count, required level, availability, the
  values in the label/value list — becomes white, as its own token.
- **Unchanged:** the runeword's name and the labels stay in the gold family, the
  note keeps its own colour, and item categories keep exactly the colours the
  table gives them, because that is one presentation rendered in two places.
- **Unchanged:** every structural decision in the panel. No positioning, no focus
  behaviour, no content, no markup beyond the class list on three elements.

## Capabilities

### Modified Capabilities

- `d2-theme`: the panel's ground moves out of the blood family; the panel's edge
  and its descriptive text become tokens of their own; the two property tokens
  change value from the reference's green to the game's blue, keeping their roles
  and their two-step relationship.

## Impact

- **Code**: `src/index.css` (`@theme`: one value changed, two tokens added, two
  values changed); `src/components/RunewordDetails.tsx` (the panel's class list);
  `src/components/RunewordDialog.tsx` if any of its own classes name the old
  tokens. No component gains a literal colour.
- **Specs**: `d2-theme` delta only. The property-emphasis requirement in
  `runeword-table` is deliberately colour-agnostic — "the brighter emphasis the
  theme declares" — so it needs no change, which is that requirement's wording
  earning its keep.
- **Ordering**: this delta is written against the `d2-theme` text as `site-header`
  leaves it, so `site-header` archives first.
- **Not touched**: the table, the toast, the remaining panels, the header, and
  every other use site of the tokens this change leaves alone.
