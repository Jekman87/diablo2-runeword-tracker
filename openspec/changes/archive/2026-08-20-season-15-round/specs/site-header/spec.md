## MODIFIED Requirements

### Requirement: The help panel explains the badges

The help panel SHALL explain what the availability badges mean, in a legend that
shows each badge as the table draws it beside the words for what it is. Nothing
else on the page says that a badge's colour carries meaning at all: there is one
colour per era of the game, fewer colours than there are patch values because two
patches are treated as one era, and no reader can infer that mapping from the
table.

The legend SHALL cover every distinct colour a patch badge can take, including the
one for the era before the remaster — a reader who meets that colour has nowhere
else to learn what it means — together with the note marker.

The legend SHALL NOT carry an entry for the ladder marker. The marker is gone
from the table, and a legend that explains a badge the reader will never meet
sends them looking for it. The legend's obligation is symmetrical: a badge that
ships is added to it, and a badge that goes is removed from it in the same
change.

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
- **THEN** a legend presents the note marker and one patch badge per era, each
  beside the words for what it means
- **AND** it presents no ladder marker and no words explaining one

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

## ADDED Requirements

### Requirement: The help panel states how the advice can be wrong

The help panel SHALL carry a caveat about the usefulness labels and the crafting
advice, and that caveat SHALL state four things: that the judgements are
approximate editorial estimates rather than measurements, the date the trade data
behind them was collected, that prices move from one ladder season to the next,
and that they differ between ladder and non-ladder. It SHALL further direct the
reader to the auction sites each advice card already links, as the place to check
what a thing sells for now.

The caveat SHALL be one statement rather than several. Help is where a reader
goes when lost, and a warning split across paragraphs is read as several
different warnings, each weaker than the one it was divided from.

The collection date SHALL be stated rather than described. A reader a year later
can judge staleness from a date and cannot judge it from a phrase, and a date
cannot quietly become untrue the way "recent" can.

#### Scenario: The caveat carries all four claims

- **WHEN** the help disclosure is opened and the advice caveat is read
- **THEN** it states that the judgements are approximate, names the date the
  trade data was collected, says that prices move between seasons, and says that
  ladder and non-ladder prices differ

#### Scenario: The reader is told where to check

- **WHEN** the advice caveat is read
- **THEN** it names the auction sites linked in each advice card as the place to
  check current prices

#### Scenario: The caveat is one statement

- **WHEN** the help panel is read
- **THEN** the caveat about the advice appears once, and no second paragraph
  repeats or qualifies it

#### Scenario: The caveat exists in both languages

- **WHEN** the locale is switched with the panel open
- **THEN** the caveat changes with it, and no part of it is a component literal

### Requirement: The help panel states that page views are counted

The help panel SHALL state that the page counts anonymous page views and sets no
cookies. A page that reports anything about its readers to anyone SHALL say so in
the one place it explains itself, whether or not the law where the reader sits
requires a dialog.

The statement SHALL NOT weaken the panel's existing promise about progress.
Progress stays in the reader's browser, the counter reads none of it, and the
sentence about where progress lives SHALL remain true and unedited.

#### Scenario: The counter is disclosed

- **WHEN** the help disclosure is opened
- **THEN** it states that the page counts anonymous page views and sets no
  cookies

#### Scenario: The progress promise is untouched

- **WHEN** the help panel's statement about where progress is kept is read
- **THEN** it still says that progress is kept in this browser and travels
  nowhere on its own

#### Scenario: The disclosure exists in both languages

- **WHEN** the locale is switched with the panel open
- **THEN** the statement changes with it, and no part of it is a component
  literal
