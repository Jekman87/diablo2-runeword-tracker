# Design: detail-panel-tooltip

## Context

The detail panel is `RunewordDetails`' floating box, `PANEL` in that file:
`border border-row-line bg-panel p-4 text-body`. Inside it, `RunewordDialog`
renders a gold `<h2>`, a label/value list whose labels are `text-gold` and whose
values inherit the panel's text colour, and the property groups as
`<ul className="text-property">` with `PropertyLine` emphasising numeric values in
`text-property-value`.

Four values are in question, and every one of them is in `@theme` already:

| Token                    | Now       | Role as declared                 |
| ------------------------ | --------- | -------------------------------- |
| `--color-panel`          | `#200000` | the detail view's panel          |
| `--color-row-line`       | `#24221c` | the hairline between table rows  |
| `--color-property`       | `#48ac3f` | a granted-property line          |
| `--color-property-value` | `#5cbd4b` | the emphasised values within one |

Standing constraints this change inherits:

- `d2-theme`: tokens name roles, not hues; a change that renders a new surface
  declares its token rather than writing a colour into a component; a token
  already holding the needed role is used rather than joined by a second one; two
  roles may share a value without sharing a token.
- `runeword-table`'s property-emphasis requirement is written as "the brighter
  emphasis the theme declares" — deliberately colour-agnostic, so a change of hue
  is a palette change and nothing else.
- `--color-panel` shares `#200000` with `--color-toast` and `--color-blood-dark`,
  which are the undo notice and the remaining panels' summary band. Those are
  separate tokens precisely so one of them can move without the others.
- The reference site is the source for most of this palette, but the _game_ is the
  source for this particular surface: the panel is a copy of the item tooltip.

## Goals / Non-Goals

**Goals:**

- The panel reads as being in front of the page: a grey ground and an edge
  brighter than a row hairline.
- Granted properties in the game's magic blue, keeping the two-step
  line-and-value relationship.
- The panel's descriptive text white.
- Every value a token, named for the surface it draws.

**Non-Goals:**

- No structural change to the panel: no positioning, focus behaviour, content,
  ordering or markup beyond three class lists.
- No change to the table, the toast, the remaining panels or the header, which is
  why `--color-toast` and `--color-blood-dark` are left where they are even though
  they hold the value `--color-panel` is leaving.
- No change to how item categories and their restriction are coloured — that is
  one presentation shared with the table, and pulling it apart here would make two.
- No new dependency, no copy change, no dataset change.

## Decisions

### 1. The panel's ground leaves the blood family for a neutral grey

`--color-panel` becomes `#17171a` — a dark neutral with a trace of blue in it,
against the page's `#000`. Two reasons for grey over "a lighter red": the game's
tooltip is grey, and the page's reds are all _bands_ (the table header, the panel
summaries, the toast). A floating box that borrowed one of those would read as a
band that came loose.

The token keeps its name and its role; only its value moves. `--color-toast` and
`--color-blood-dark` keep `#200000`, which is what having three tokens at one
value was for — the undo notice is a band at the bottom of the page and has not
changed its mind about anything.

### 2. The panel's edge becomes `--color-panel-edge`, not a brighter row line

The panel currently borrows `--color-row-line`. Brightening that token would
brighten every separator in a 99-row table to fix the edge of a box that floats
over it, which is the exact shape of defect the naming rule exists to prevent. So
the panel's edge gets a token of its own at `#4b4b52`, and `--color-row-line`
keeps its value and its one role.

`#4b4b52` rather than gold: the edge is the tooltip's frame, and a gold frame
would compete with the runeword's own gold name inside it.

### 3. Property lines take the game's blue, one shade brighter than the game's

`--color-property` → `#7f7fff`, `--color-property-value` → `#b0b0ff`.

The game's affix blue is `#6969ff`, which lands at about 4.0:1 on the new ground —
under AA for body text, and property lines are the densest text in the panel.
`#7f7fff` is 5.4:1 and `#b0b0ff` is 9.9:1, both measured against `#17171a`. This
is the same trade `d2-theme` made in the other direction for the patch badges,
where the reference's own colours were adopted at 2:1 knowingly; here the surface
is prose rather than a two-character badge, so it goes the legible way.

Both tokens keep their names and their roles. The two-step relationship is kept
because it is `runeword-table`'s requirement, not a decoration: values brighter
than the words around them.

### 4. The panel's descriptive text becomes `--color-panel-text` at white

The panel currently renders `--color-body` (`#aca798`), the page's tan. In the
tooltip the reader is remembering, the requirement lines are white. `#fff` as its
own token named for the surface: `--color-note-label` already holds `#fff` for the
note badge's label, and two roles sharing a value do not share a token.

What stays gold is the structure this panel adds and the game does not have: the
runeword's name and the labels of the label/value list. What stays as it is: the
note's own colour, and item categories with their restriction.

### 5. Nothing moves in the components except three class lists

`PANEL` in `RunewordDetails` becomes
`… border border-panel-edge bg-panel p-4 text-panel-text`, and `RunewordDialog`
keeps every class it has — `text-property` on the property list is a token
reference, so the blue arrives without touching it. That is the palette rule
paying off: a hue change is a change to `src/index.css` and a border/colour class
on one element.

## Risks / Trade-offs

- **[The grey ground makes the gold heading and gold labels sit differently]** →
  Checked in the browser rather than reasoned about: `#8a8062` labels and
  `#a79663` heading on `#17171a` are 3.9:1 and 5.5:1, both above the 3:1 large-text
  threshold the heading needs and the labels' role as short strings beside their
  values.
- **[Blue property text is a departure from the reference this project copies]** →
  Deliberate, and the reference is not the authority for this surface: the panel
  is a copy of the game's tooltip, and the game's affix colour is blue. Recorded
  here so the next reader does not "restore" the green.
- **[Two more tokens at values other tokens already hold]** → `#fff` is
  `--color-note-label`'s value and `#17171a`/`#4b4b52` are new. The naming rule
  permits shared values under separate names and forbids shared names for separate
  roles; this is the permitted direction.
- **[The change is invisible to the test suite]** → Colour is not asserted in
  tests, by design: the classes are token references and the tests assert those.
  So the check is the built stylesheet's token values plus a screenshot of an open
  panel, which is what the verification tasks do.
