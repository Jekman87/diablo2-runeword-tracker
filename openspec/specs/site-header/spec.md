# site-header Specification

## Purpose

TBD - created by archiving change site-header. Update Purpose after archive.

## Requirements

### Requirement: The page identifies itself and the patch it reflects

The page SHALL open with a site header containing the application title and,
beneath it, a patch line stating which game patch the tracked runeword list
reflects. The patch value within that line SHALL be the link to the patch's
official notes, so the sentence naming the patch is also the way to read it —
there SHALL NOT be a second control repeating the same word. The header SHALL be
exposed as a `banner` landmark, which requires it to sit outside the `main`
landmark rather than inside it. The header SHALL remain in normal document flow —
it scrolls away and claims no permanent viewport height, so the sticky progress
and table-header bands and the `--progress-band-height` coupling between them are
untouched. The ornamental divider SHALL close the header, and nothing below the
divider SHALL move.

#### Scenario: The title and patch line open the page

- **WHEN** the page is rendered
- **THEN** the header presents the application title and a patch line naming
  the game patch the list reflects, above the ornamental divider

#### Scenario: The patch value is the patch-notes link

- **WHEN** the patch line is inspected
- **THEN** the patch value itself is the link to the official notes for that
  patch, and no separate link duplicates that destination

#### Scenario: The header is a banner landmark

- **WHEN** the page's landmarks are inspected
- **THEN** the header exposes the `banner` role, and is not a descendant of the
  `main` landmark

#### Scenario: The header scrolls away

- **WHEN** the page is scrolled into the table
- **THEN** the header leaves the viewport while the progress band and the table
  header band stick exactly as they did before this change

#### Scenario: Nothing below the divider moves

- **WHEN** the layout below the ornamental divider is compared with the
  previous build
- **THEN** the progress band, the remaining panels, the controls and the table
  are in the same order at the same widths

### Requirement: The header's links leave the site in a new tab

The header SHALL carry exactly two links: the patch value, pointing at the
official patch notes; and **Feedback**, pointing at the repository's GitHub
Discussions. Both SHALL open in a new browsing context, because the page is a
tracker a reader keeps open while consulting either destination, and both SHALL
be hardened against the destination reaching back into this page or learning
where the reader came from. Opening a new tab SHALL be stated in each link's
accessible name, so the behaviour is known before the link is activated rather
than discovered after. Link labels and accessible names SHALL resolve through the
display-copy layer.

#### Scenario: Two links, two destinations

- **WHEN** the header's links are inspected
- **THEN** there are exactly two: the patch value resolving to the official patch
  notes, and Feedback resolving to the repository's Discussions

#### Scenario: A link opens a new tab and says so

- **WHEN** a header link is inspected
- **THEN** it targets a new browsing context, withholds both the opener
  reference and the referrer from the destination, and its accessible name states
  that it opens in a new tab

#### Scenario: Link labels are copy

- **WHEN** the components rendering the header are inspected
- **THEN** no link label and no accessible name is a literal in the component;
  each resolves through the display-copy layer

#### Scenario: The links are drawn from the palette's display family

- **WHEN** a header link's colour is inspected
- **THEN** it is the same resting and hover pair the page's other interactive
  text already moves between, rather than a colour introduced for links alone

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

### Requirement: The header carries the language switch

The header SHALL offer the language switch on the title's own line, beside the
help control and the feedback link. The switch SHALL be a control and not a
link, so the rule that the header carries exactly two links stands. Each of its
two options SHALL be labelled in its own language, so a reader who cannot read
the active language can still find the way out of it, and the option labels
SHALL resolve through the display-copy layer like all display text. The control
SHALL expose which language is active to assistive technology as state, not
through colour alone. Adding the switch SHALL NOT disturb the header's existing
guarantees: the banner landmark, the two-link rule, and the layout below the
ornamental divider.

#### Scenario: The switch shares the title line

- **WHEN** the header is rendered
- **THEN** the language switch sits on the title's line with the help control
  and the feedback link, and the help panel still opens beneath them

#### Scenario: Each option is legible in its own language

- **WHEN** the switch's options are inspected
- **THEN** each is labelled in the language it selects, and each label resolves
  through the display-copy layer rather than being a component literal

#### Scenario: The active language is reported as state

- **WHEN** the switch is inspected with the interface in Russian
- **THEN** the Russian option exposes its active state to assistive technology,
  and the distinction is not carried by colour alone

#### Scenario: The two-link rule is undisturbed

- **WHEN** the header's links are inspected after the switch is added
- **THEN** there are still exactly two: the patch value and Feedback — the
  switch is a control, not a third link

#### Scenario: Nothing below the divider moves

- **WHEN** the layout below the ornamental divider is compared with the
  previous build, in either language
- **THEN** the progress band, the remaining panels, the controls and the table
  are in the same order at the same widths

### Requirement: The patch value and link targets are application constants

The patch value and the two link targets SHALL be maintained as constants in one
application module, so the patch value and the patch-notes URL that must change
together sit together. The patch value SHALL be passed into the display-copy
layer as a parameter — it is identical in every locale, like a dataset
identifier — and only the sentence around it is copy. The dataset and its
generator SHALL NOT gain a patch-version field, because the vendored source
carries none and a generated field without a source is the defect the dataset
rules exist to prevent.

#### Scenario: One module holds the values

- **WHEN** the source of the patch value and the two URLs is inspected
- **THEN** all three are constants in a single module, and no URL or patch
  value appears in the display-copy layer or as a component literal

#### Scenario: The patch value is a parameter to copy

- **WHEN** the patch line's string is resolved
- **THEN** the copy layer receives the patch value as a parameter and supplies
  only the words around it

#### Scenario: The dataset is unchanged

- **WHEN** the dataset schema and generator are inspected
- **THEN** neither carries a site-level patch-version field

### Requirement: The feedback destination exists before the link ships

GitHub Discussions SHALL be enabled on the repository before the Feedback link
is deployed, so the link never resolves to an error page on the deploy that
introduces it.

#### Scenario: The Feedback link resolves

- **WHEN** the Feedback link's destination is requested after deployment
- **THEN** it resolves to the repository's Discussions page rather than an
  error page
