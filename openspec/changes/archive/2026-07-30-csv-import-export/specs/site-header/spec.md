# site-header Delta

## MODIFIED Requirements

### Requirement: Help is an in-page disclosure, not a link off the site

The header SHALL explain how the page is used through a disclosure that opens in
place, closed by default. It SHALL NOT send the reader to the project's
repository for that explanation: a reader asking how a page works is not asking
for the documentation of whoever maintains it. Its control SHALL sit on the
title's own line beside the feedback link, and its panel SHALL open beneath the
header's ornamental divider at the page's own measure — which is what makes the
control a button reporting its expanded state rather than the native disclosure
element used elsewhere in the project, since that element requires its control to
be its own first child and therefore cannot straddle two rows of the header. The
control SHALL report whether it is expanded and SHALL name the element it
controls. The panel SHALL remain in the document while closed, and SHALL be
hidden by a means that holds even where the stylesheet has not loaded. Nothing
about the disclosure SHALL be persisted. Every word of it SHALL resolve through
the display-copy layer.

The panel SHALL open **below** the divider rather than above it. The divider is
the header's own bottom edge, and prose inserted above it pushes that edge down
and presents itself as part of the title block; below it, the help reads as an
explanation opened over the top of the page rather than as more header.

The disclosure SHALL describe every feature the page offers, and a feature that
ships SHALL be added to it. That obligation is not only additive: where a new
feature makes an existing sentence untrue, that sentence SHALL be corrected in
the same change. Moving progress in and out as a file is described there for both
reasons — it is a feature, and it ends the claim that progress never travels
between devices.

#### Scenario: The help disclosure loads closed

- **WHEN** the page is rendered
- **THEN** the header offers a help control reporting itself as not expanded,
  whose panel is present but not shown, and no help text is displayed until the
  reader opens it

#### Scenario: The control sits beside the feedback link

- **WHEN** the header's controls are inspected
- **THEN** the help control and the feedback link share the title's line, and the
  help panel takes no room while closed

#### Scenario: The control names what it opens

- **WHEN** the help control is inspected
- **THEN** it reports its expanded state and identifies the panel it opens, so a
  reader who cannot see the panel appear is told that it did

#### Scenario: Opening the help explains the page

- **WHEN** the help disclosure is opened
- **THEN** it states what the list is and how the page is used — marking a
  runeword as crafted, the progress it counts, the search, filters and sorting,
  the two remaining panels, where a runeword's granted properties are, where the
  reader's progress is kept, and how it is carried to another browser as a file

#### Scenario: The panel opens beneath the divider

- **WHEN** the help disclosure is opened
- **THEN** its panel follows the header's ornamental divider in the document
  rather than preceding it, so opening it does not push the header's own bottom
  edge down the page

#### Scenario: The transfer feature is described

- **WHEN** the help disclosure is opened
- **THEN** it names the export and import controls, states that importing
  replaces what is already marked rather than adding to it, and states that the
  replacement cannot be undone

#### Scenario: A claim a new feature invalidates is corrected

- **WHEN** the help's statement about where progress is kept is read after
  import and export have shipped
- **THEN** it no longer claims that progress never travels between devices, and
  says instead that nothing leaves the browser on its own

#### Scenario: The closed panel is mounted but hidden

- **WHEN** the closed disclosure is inspected in the document
- **THEN** its panel is present, so the control's reference to it always resolves,
  and it is hidden by a means that does not depend on the stylesheet having loaded

#### Scenario: The state glyph carries nothing

- **WHEN** the help control's accessible name is read
- **THEN** it is the control's label alone: the glyph drawing open or closed is out
  of the accessibility tree, because the control already reports that state

#### Scenario: No link leads to the repository for help

- **WHEN** the header's links are inspected
- **THEN** none of them is a help link to the project's repository

#### Scenario: Opening the help moves nothing that was already read

- **WHEN** the help disclosure is opened
- **THEN** it expands in normal flow within the header, and the sticky progress
  and table-header bands continue to behave exactly as before
