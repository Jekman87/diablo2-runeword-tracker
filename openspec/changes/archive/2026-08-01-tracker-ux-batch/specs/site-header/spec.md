# site-header Delta

## MODIFIED Requirements

### Requirement: Help is an in-page disclosure, not a link off the site

The header SHALL offer help as an in-page disclosure that explains how to use the
tracker, rather than as a link to the repository. The disclosure's control SHALL
sit on the title's line with Feedback; its panel SHALL open in the next row of the
header's grid, below the ornamental divider. The control SHALL report expanded
state and identify the panel. Opening help SHALL explain marking (including that a
confirmation stands before a mark or unmark), progress, search and filters, the
remaining panels, detail properties, where progress is kept, and how progress is
carried between browsers as a file. It SHALL NOT promise a transient undo notice
after marking.

#### Scenario: The help disclosure loads closed

- **WHEN** the page loads
- **THEN** the header offers a help control reporting itself as not expanded,
  whose panel is present but not shown, and no help text is displayed until the
  control is activated

#### Scenario: The control shares the title line

- **WHEN** the header is inspected
- **THEN** the help control and the feedback link share the title's line, and the
  help panel takes no room while closed

#### Scenario: The control reports its state

- **WHEN** the help control is inspected
- **THEN** it reports its expanded state and identifies the panel it opens, so a
  reader who cannot see the panel appear is told that it did

#### Scenario: Opening the help explains the page

- **WHEN** the help disclosure is opened
- **THEN** it states what the list is and how the page is used — marking a
  runeword as crafted (with confirmation before the mark or unmark is applied),
  the progress it counts, the search, filters and sorting, the two remaining
  panels, where a runeword's granted properties are, where the reader's progress
  is kept, and how it is carried to another browser as a file
- **AND** it does not describe a transient undo notice for marking

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
- **THEN** the title, the patch line and the feedback link keep the positions they
  had while the disclosure was closed
