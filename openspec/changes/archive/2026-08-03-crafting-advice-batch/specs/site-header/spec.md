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
controls. Opening help SHALL explain marking (including that a confirmation stands
before a mark or unmark), progress, search and filters, the remaining panels,
detail properties, where progress is kept, and how progress is carried between
browsers as a file. It SHALL NOT promise a transient undo notice after marking.
The panel SHALL remain in the document while closed, and SHALL be hidden by a means that holds even where the stylesheet has not loaded. Nothing
about the disclosure SHALL be persisted. Every word of it SHALL resolve through
the display-copy layer.

The panel SHALL open **below** the divider rather than above it. The divider is
the header's own bottom edge, and prose inserted above it pushes that edge down
and presents itself as part of the title block; below it, the help reads as an
explanation opened over the top of the page rather than as more header.

The disclosure SHALL describe every feature the page offers, and a feature that
ships SHALL be added to it. That obligation is not only additive: where a new
feature makes an existing sentence untrue, that sentence SHALL be corrected in
the same change. It is also not unbounded — an explanation of something the
player already knows from the game itself is noise in the one place a reader
goes when lost, and SHALL be dropped. Moving progress in and out as a file is
described for both reasons: it is a feature, and it ends the claim that
progress never travels between devices.

Where help describes importing, it SHALL state the two things a reader cannot
discover without risking their progress: that a file may name runewords in
either language, and that importing an empty file is how every mark is cleared.

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
  runeword as crafted (with confirmation before the mark or unmark is applied),
  the progress it counts, the search, filters and sorting, the two remaining
  panels, where a runeword's granted properties are, where the reader's
  progress is kept, and how it is carried to another browser as a file
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

#### Scenario: Both languages are accepted in a file

- **WHEN** the help disclosure's import description is read
- **THEN** it states that a file may name runewords in Russian as well as in
  English

#### Scenario: Starting over is documented

- **WHEN** the help disclosure's import description is read
- **THEN** it states that importing an empty file clears every mark

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

## ADDED Requirements

### Requirement: The help panel qualifies the advice surfaces as estimates

The help panel SHALL describe the two advice surfaces — the usefulness label
under a runeword's name and the crafting-advice panel on the item-types cell —
and SHALL state plainly that the judgements are approximate: editorial
estimates assembled from community tier lists and trade data, named with the
ladder season and the collection date they reflect, and liable to drift as the
game's economy moves. The page makes claims about worth nowhere else, so the
one place that explains the page SHALL be the place that bounds those claims.

The existing help content SHALL be revised in the same pass rather than only
appended to, on the disclosure's own standing rule that a feature which ships
is added and a sentence a feature falsifies is corrected. All of it SHALL
resolve through the display-copy layer in both locales.

#### Scenario: The advice surfaces are described with their caveat

- **WHEN** the help disclosure is opened
- **THEN** it explains the usefulness label and the advice panel, states that
  both are approximate estimates, and names the season and date the data
  reflects

#### Scenario: The caveat exists in both languages

- **WHEN** the locale is switched with the help panel open
- **THEN** the advice description and its caveat render in the active locale
  with no string left behind in the other

## REMOVED Requirements

### Requirement: The help panel explains the badges and the rune tiers

**Reason**: The badge half is kept and re-stated below as its own requirement; the
rune-tier half is dropped. It explained that the remaining-runes tiers follow the
Horadric Cube's upgrade ratios — which a player far enough along to be farming
runes already knows from the game, and which the panel's three common-to-rare
bands convey without prose. Help is where a reader goes when lost, and an
explanation nobody was lost about crowds out the ones they came for.

**Migration**: None for a reader. `helpRuneTiers` leaves both copy records and
the paragraph leaves `SiteHeader`; the remaining-runes panel keeps its tier
bands and their labels, which are `remaining-needs`' own requirement.

## ADDED Requirements

### Requirement: The help panel explains the badges

The help panel SHALL explain what the availability badges mean, in a legend that
shows each badge as the table draws it beside the words for what it is. Nothing
else on the page says that a badge's colour carries meaning at all: there is one
colour per era of the game, fewer colours than there are patch values because two
patches are treated as one era, and no reader can infer that mapping from the
table.

The legend SHALL cover every distinct colour a patch badge can take, including the
one for the era before the remaster — a reader who meets that colour has nowhere
else to learn what it means — together with the ladder marker and the note marker.

The legend SHALL render its samples from the same component the table's rows render,
rather than reproducing their shape, so that a badge cannot look one way in the
table and another in the explanation of the table.

**A sample in the legend SHALL NOT be announced to assistive technology.** In a row a
badge carries its full meaning as its accessible name because nothing beside it says
what it is; in the legend the words beside it say exactly that, and announcing both
reads the same fact twice. This is the one place the panel's "every word resolves
through the display-copy layer" rule needs qualifying: the words are copy, the
samples are components, and no meaning SHALL exist only as a sample.

All of it SHALL resolve through the display-copy layer in both locales, and the
Russian wording for anything the game names SHALL come from the same official source
the existing terms do.

#### Scenario: The legend shows each badge and says what it means

- **WHEN** the help disclosure is opened
- **THEN** a legend presents the ladder marker, the note marker and one patch badge
  per era, each beside the words for what it means

#### Scenario: The era before the remaster is included

- **WHEN** the legend's patch samples are counted
- **THEN** there is one for every distinct colour a patch badge can take, the
  pre-remaster era among them

#### Scenario: The samples are the table's own component

- **WHEN** a badge in the legend is compared with the same badge in a row
- **THEN** both are rendered by the same component, so their shape, size and colour
  cannot drift apart

#### Scenario: A sample is not announced twice

- **WHEN** the legend is read with a screen reader
- **THEN** each meaning is heard once, from the words
- **AND** the sample beside them is not announced, because it is decoration there

#### Scenario: No meaning lives only in a sample

- **WHEN** the legend is read with images or colours unavailable
- **THEN** every meaning it conveys is still present as words

#### Scenario: The rune tiers are not explained

- **WHEN** the help panel is read
- **THEN** it contains no paragraph about the rune tiers or the Horadric Cube's
  upgrade ratios

#### Scenario: The legend exists in both languages

- **WHEN** the locale is switched with the panel open
- **THEN** every word of the legend changes with it, and no string is a component
  literal
