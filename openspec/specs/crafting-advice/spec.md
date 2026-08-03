# crafting-advice Specification

## Purpose

TBD - created by archiving change crafting-advice-batch. Update Purpose after archive.

## Requirements

### Requirement: A usefulness label sits under the runeword's name

Each runeword MAY carry one of exactly three usefulness values — `meta`,
`situational`, `chronicle` — and a runeword that carries one SHALL render it as
a second line under its name in the table's name cell. The words shown SHALL
come from the display-copy layer in the active locale; the value itself is
locale-independent dataset content. The line SHALL be visually subordinate to
the name (smaller, muted) so the name column still reads as a list of names.

The three values SHALL be a closed set: the schema SHALL reject any other
string, because a free-text label would drift into prose that belongs in the
advice field.

#### Scenario: A labelled runeword shows its usefulness under the name

- **WHEN** a runeword carrying a usefulness value is rendered in the table
- **THEN** its name cell shows a second line stating that usefulness in the
  active locale's words

#### Scenario: The label follows the locale

- **WHEN** the interface language is switched
- **THEN** every usefulness line changes to the other locale's words, and no
  value string such as `meta` appears verbatim in the interface

#### Scenario: An unlabelled runeword shows no second line

- **WHEN** a runeword without a usefulness value is rendered
- **THEN** its name cell contains no usefulness line and no empty placeholder

#### Scenario: An unknown value fails validation

- **WHEN** the dataset carries a usefulness value outside the three
- **THEN** dataset validation fails naming the record, rather than the value
  rendering as text

### Requirement: Crafting advice opens from the item-types cell

A runeword that carries advice SHALL offer it in a floating panel anchored to
the table's item-types cell. The panel SHALL open on hover for a pointer, on
click or tap for touch, and on keyboard focus plus activation — the same three
routes the detail panel already answers, because a touch device has no hover
and a keyboard has neither hover nor tap. The hover target SHALL be the cell's
content as a whole, and the tap target the text already in the cell. While the
pointer travels from the cell toward the open panel, the panel SHALL stay open.

The panel SHALL present the advice as its paragraphs in the active locale,
followed by its source links when it has any. Links SHALL be real anchors that
open in a new tab with `rel="noopener noreferrer"`, and text inside the panel
SHALL be selectable and copyable — a reader's whole reason for opening it may
be to copy a base item's name into a trade search.

#### Scenario: Hovering the cell opens the advice

- **WHEN** a pointer rests on the item-types cell of a runeword with advice
- **THEN** the advice panel opens and stays open while the pointer moves into
  it

#### Scenario: A tap opens the same panel

- **WHEN** the cell's content is tapped on a touch device
- **THEN** the advice panel opens without hover being involved

#### Scenario: Links inside the panel work

- **WHEN** a source link inside the open panel is clicked
- **THEN** the linked page opens in a new tab, and the click does nothing else
  on the page beneath

#### Scenario: Text inside the panel can be copied

- **WHEN** a base item's name inside the open panel is selected and copied
- **THEN** the selection succeeds, the panel stays open through the gesture,
  and nothing else on the page reacts

#### Scenario: A runeword without advice offers no panel

- **WHEN** the item-types cell of a runeword without advice is hovered or
  tapped
- **THEN** no advice panel opens and the cell behaves as it did before this
  capability existed

### Requirement: Advice surfaces are decoration on the availability-markers terms

The usefulness and advice fields SHALL be presentation only: no filter SHALL
read them, no counter SHALL subtract by them, no sort SHALL order by them, and
no logic SHALL branch on them. Progress SHALL remain out of all 99 regardless
of what the labels say a runeword is worth. A future control that reads these
fields SHALL be its own proposal.

#### Scenario: No control reads the fields

- **WHEN** the page's filters, sorts and counters are exercised with and
  without the advice fields present in the dataset
- **THEN** every presented set, order and count is identical

#### Scenario: Progress ignores usefulness

- **WHEN** all runewords labelled `chronicle` are marked crafted
- **THEN** the progress count rises by exactly their number, out of the same 99

### Requirement: Only one floating panel is open, whatever its kind

The table SHALL keep at most one floating panel open across both kinds — a
runeword's detail panel and a runeword's advice panel — because "one panel at a
time" is a property of the page, not of a panel. Opening either kind SHALL
close whatever other panel is open, of either kind, on any row.

#### Scenario: Opening advice closes an open detail panel

- **WHEN** a detail panel is open and another runeword's item-types cell is
  hovered until its advice opens
- **THEN** the detail panel closes as the advice panel opens, and the two are
  never presented together

#### Scenario: Opening details closes an open advice panel

- **WHEN** an advice panel is open and a runeword's name is activated
- **THEN** the advice panel closes as the detail panel opens
