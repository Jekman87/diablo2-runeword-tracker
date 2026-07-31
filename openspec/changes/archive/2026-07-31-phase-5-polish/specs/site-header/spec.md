# site-header Delta Specification

## ADDED Requirements

### Requirement: The help panel explains the badges and the rune tiers

The help panel SHALL explain what the availability badges mean, in a legend that
shows each badge as the table draws it beside the words for what it is. Until now
nothing on the page has said that a badge's colour carries meaning at all: there is
one colour per era of the game, fewer colours than there are patch values because
two patches are treated as one era, and no reader can infer that mapping from the
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

The panel SHALL also say what the three rune tiers in the remaining-runes panel are
— that they run from common to rare and follow the Horadric Cube's upgrade ratios —
so that a reader can tell why the rarest runes carry the smallest counts. This is
the reference site's own explanation of its rune ordering, which our grouping shares
and has never explained.

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

#### Scenario: The rune tiers are explained

- **WHEN** the help panel is read
- **THEN** it states what the three tiers of the remaining-runes panel are and that
  their order follows the Horadric Cube's upgrade ratios

#### Scenario: The explanation exists in both languages

- **WHEN** the locale is switched with the panel open
- **THEN** every word of the legend and the tier explanation changes with it, and no
  string is a component literal

## MODIFIED Requirements

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

**The divider SHALL span the viewport**, while the header's own content — the title
block, the controls beside it and the help panel — SHALL keep the page's measure and
stay aligned with the content below. The decoration is the page's edge-to-edge band;
the words are a column. This means the header's measure SHALL be applied by a
wrapper inside it rather than by the header element itself, since the header now has
a child that must escape that measure.

The divider SHALL reach full width without introducing horizontal scrolling. A width
stated relative to the viewport is not equivalent, because the document reserves a
stable scrollbar gutter, and a band as wide as the viewport is therefore wider than
the space available to it.

#### Scenario: The title and patch line open the page

- **WHEN** the page is rendered
- **THEN** the header presents the application title and a patch line naming
  the game patch the list reflects, above the ornamental divider

#### Scenario: The divider spans the viewport

- **WHEN** the ornamental divider is measured
- **THEN** it reaches both edges of the page
- **AND** the header's title block and controls remain at the page's measure,
  aligned with the content below the divider

#### Scenario: Full width introduces no sideways scroll

- **WHEN** the document's scrollable width is compared with the viewport at every
  supported width, with the scrollbar gutter reserved
- **THEN** the divider has added no horizontal overflow

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
