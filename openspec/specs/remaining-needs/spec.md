# remaining-needs Specification

## Purpose

What an uncrafted Chronicle still costs, and how the page presents it — the
aggregation of the runes still required with their counts, the aggregation of
the socketed bases by (category, socket count), the two collapsible panels
that carry them: their placement, default state, tier grouping, empty states,
disclosure semantics, and their immediate reaction to any change in the
crafted set.

## Requirements

### Requirement: Remaining runes are aggregated from the uncrafted runewords

The interface SHALL derive, from the dataset and the crafted set, how many of
each rune the uncrafted runewords still require. Every occurrence of a rune
SHALL count, including repeats within one runeword's sequence. A runeword
marked crafted SHALL contribute nothing, and a rune no uncrafted runeword
requires SHALL be absent from the result rather than present with a count of
zero. The aggregation SHALL be pure logic operating on the dataset and the
crafted set as inputs, so that it is unit-testable without rendering
anything.

#### Scenario: Nothing crafted needs everything

- **WHEN** the remaining runes are derived with no runeword crafted
- **THEN** all 33 runes are present and their counts sum to 343
- **AND** `Shael` counts 20 and `Zod` counts 3, matching the dataset's known
  totals

#### Scenario: Crafting a runeword subtracts its runes

- **WHEN** one runeword is marked crafted
- **THEN** each rune in its sequence counts exactly one less than before,
  and no other rune's count changes

#### Scenario: A repeated rune counts each occurrence

- **WHEN** the remaining runes are derived while `Infinity` — `Ber Mal Ber
Ist` — is uncrafted
- **THEN** that runeword contributes two to `Ber`'s count, not one

#### Scenario: A satisfied rune is absent, not zero

- **WHEN** every runeword requiring some rune is crafted
- **THEN** that rune does not appear in the result

#### Scenario: Everything crafted needs nothing

- **WHEN** all 99 runewords are marked crafted
- **THEN** the result is empty

### Requirement: Remaining runes are presented in tier bands

The remaining-runes panel SHALL group its runes into the three rarity tiers
carried by the rune reference data, presented in tier order with each rune in
canonical rune order within its band. Each entry SHALL present the rune's
sprite icon, its canonical name as text, and its count. Because the name is
visible text beside the icon, the icon SHALL be decorative rather than
labelled, so the rune is announced once. A band none of whose runes are
needed SHALL be omitted. Tier labels are display copy and SHALL resolve
through the display-copy layer; rune names are canonical identifiers and
SHALL NOT.

#### Scenario: Three bands in tier order

- **WHEN** the panel is rendered while runes of all three tiers are needed
- **THEN** three labelled bands are present — common, then semirare, then
  rare — each listing only runes of its tier in canonical rune order

#### Scenario: An entry carries icon, name and count

- **WHEN** a remaining rune's entry is inspected
- **THEN** it presents that rune's sprite icon, its canonical name as text,
  and how many are still needed

#### Scenario: The rune is announced once

- **WHEN** a remaining rune's entry is read by assistive technology
- **THEN** the rune's name is announced from the visible text and the icon
  adds no second announcement

#### Scenario: A satisfied tier disappears with its runes

- **WHEN** every rune of one tier is satisfied while others are not
- **THEN** that tier's band and label are absent and the other bands are
  unaffected

### Requirement: Remaining bases are aggregated by category and socket count

The interface SHALL derive, from the dataset and the crafted set, which
socketed bases the uncrafted runewords still require, grouped by base item
category and socket count — a runeword specifies a category and a socket
count, never a specific item, so `(category, sockets)` is the finest grain
the data supports. The socket count SHALL be derived from the length of the
runeword's rune sequence. Each group's count SHALL be the number of uncrafted
runewords that can be made in that base; a runeword allowing several
categories SHALL count in each, because they are alternatives the player can
farm toward, not fractions of a need. Groups SHALL be ordered by the
category's position in the base-category reference data and then by socket
count ascending, and a group no uncrafted runeword requires SHALL be absent.
The aggregation SHALL be pure logic operating on its inputs, unit-testable
without rendering anything.

#### Scenario: A group counts the runewords it would serve

- **WHEN** the remaining bases are derived while three uncrafted runewords
  of four runes each allow the same category
- **THEN** that category appears with a four-socket group counting three

#### Scenario: A multi-category runeword appears under each alternative

- **WHEN** an uncrafted runeword allows more than one base category
- **THEN** a group exists for each of those categories at that runeword's
  socket count, and each counts it

#### Scenario: Crafting a runeword leaves every group it was counted in

- **WHEN** a runeword is marked crafted
- **THEN** every group that counted it counts one less, and a group it
  brought to zero is absent

#### Scenario: Groups are ordered by category, then sockets

- **WHEN** the derived groups are read
- **THEN** they follow the base-category reference order, with a category's
  groups in ascending socket order

#### Scenario: Everything crafted needs no bases

- **WHEN** all 99 runewords are marked crafted
- **THEN** the result is empty

### Requirement: The remaining-needs panel is collapsible and collapsed by default

The remaining runes and remaining bases SHALL be presented together in **one**
collapsible panel placed between the overall progress indicator and the browsing
controls, each list under its own heading within it. One panel rather than two,
because the two lists answer one question from two sides and are consulted
together, and because two closed bands cost twice the vertical space above the
table for the same one press. The panel SHALL load collapsed, and its open state
SHALL NOT be persisted — it is reference material consulted on demand, not a view
setting. The control that opens and closes it SHALL be reachable by Tab and
operable by keyboard, and SHALL expose its expanded or collapsed state to
assistive technology. The panel's title and its two section headings are display
copy and SHALL resolve through the display-copy layer, and the headings SHALL sit
one level below the panel's own so that a reader navigating by heading meets the
panel, then the list.

From the width at which two columns of rune entries fit, the two lists SHALL be
presented side by side, so an open panel is as tall as its taller list rather than
as tall as both; below that width they SHALL stack.

#### Scenario: One panel loads collapsed

- **WHEN** the page loads
- **THEN** one panel is present between the progress indicator and the browsing
  controls, showing its title and hiding both lists

#### Scenario: The panel opens and closes by keyboard

- **WHEN** the panel's control receives keyboard focus and is activated
- **THEN** the panel's content is revealed
- **AND** activating it again hides the content

#### Scenario: The state is exposed to assistive technology

- **WHEN** the panel's control is inspected by assistive technology
- **THEN** it reports whether the panel is expanded or collapsed

#### Scenario: The open state does not survive a reload

- **WHEN** the panel is opened and the page is reloaded
- **THEN** the panel is collapsed again, and nothing about it was written to
  storage

#### Scenario: Both lists are reachable under their own headings

- **WHEN** the panel is opened
- **THEN** the runes and the bases are each under a heading naming that list, one
  level below the panel's title, in that order

#### Scenario: The open panel is as tall as its taller list

- **WHEN** the panel is opened at a width that fits two columns of rune entries
- **THEN** the two lists are presented side by side rather than stacked

### Requirement: The remaining-needs panel updates immediately when crafted state changes

Both lists SHALL reflect the crafted set as it is now: toggling a runeword —
including reversing one through the undo affordance — SHALL update both lists
immediately, without a reload and regardless of whether the panel is open. They
SHALL derive from the same crafted set the progress indicator reads, so the three
cannot disagree.

#### Scenario: A toggle updates both lists

- **WHEN** a runeword is marked crafted while the panel is open
- **THEN** its runes leave or decrease in the runes list and its base groups
  leave or decrease in the bases list, without a reload

#### Scenario: An undo restores both lists

- **WHEN** a toggle is reversed from the transient notice
- **THEN** both lists present what they presented before the toggle

#### Scenario: The lists and progress agree

- **WHEN** the crafted set changes by any means
- **THEN** the lists and the progress indicator all reflect the same set

### Requirement: A list with nothing left says so

A list whose aggregation is empty SHALL remain present under its heading and
SHALL present a completion message from the display-copy layer rather than an
empty body or no section at all, because an absent block reads as a defect where a
present one with an answer reads as done. The panel itself SHALL remain present
whether either list is empty or both are.

#### Scenario: Full completion leaves both sections standing

- **WHEN** all 99 runewords are crafted and the panel is opened
- **THEN** each list's heading is present and each presents a message stating
  nothing is needed, resolved from the display-copy layer

#### Scenario: One empty list leaves the other alone

- **WHEN** one aggregation is empty and the other is not
- **THEN** the empty list presents its completion message under its heading and
  the other presents its entries
