# remaining-needs Delta Specification

Expressed as removals and additions rather than as `MODIFIED` blocks, because all
three requirements are **renamed**: they were written around two panels, and their
scenarios were named after them ("Both panels load collapsed", "A toggle updates
both panels"). A `MODIFIED` block may not drop a scenario the main spec has, and
renaming one counts as dropping it — correctly, since that guard is what stops a
scenario disappearing by accident. Here the disappearance is the point, so it is
stated as such: each old requirement is removed with its reason, and its
replacement carries every rule it had under a name that describes one panel.

## REMOVED Requirements

### Requirement: The panels are collapsible and collapsed by default

**Reason**: Written around two panels, down to the scenario named "Both panels
load collapsed". The runes and the bases are two sections of one panel now, so
neither the requirement's wording nor its scenarios describe anything the page
has. Every rule it carried — collapsed by default, state not persisted, keyboard
operable, expanded state exposed, placed between the progress indicator and the
browsing controls — is carried by "The remaining-needs panel is collapsible and
collapsed by default" below.

**Migration**: None. The reader gets one control where there were two, opening
both lists; nothing is stored about either, so there is no state to migrate.

### Requirement: The panels update immediately when crafted state changes

**Reason**: Same rename. What updates immediately is two lists inside one panel,
not two panels, and the scenarios were named for the panels. Replaced by "The
remaining-needs panel updates immediately when crafted state changes", which keeps
the rule that both lists and the progress indicator read one crafted set.

**Migration**: None — the aggregations, their inputs and their timing are
unchanged.

### Requirement: A panel with nothing left says so

**Reason**: The completion message is now a property of a section rather than of a
panel: either list can run out while the other has entries, and the panel itself
stays whatever happens. Replaced by "A list with nothing left says so".

**Migration**: None. Both completion messages are the same copy they were.

## ADDED Requirements

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
