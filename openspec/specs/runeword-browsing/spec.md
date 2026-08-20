# runeword-browsing Specification

## Purpose

How a player finds a runeword in a 99-row table — what search matches, which key
each column header sorts on and how a total order is guaranteed for all of them, the
crafted and slot filters and how the three controls combine, the mapping from base
item category to equipment slot, the result count, the empty state and the reset, the
reachability of the sort controls while reading a long table, and the things
narrowing the view may not change: the progress denominator, the crafted set, and the
availability fields no filter is allowed to read.

## Requirements

### Requirement: Search narrows the table by name, category and restriction

The interface SHALL offer a search field that narrows the table to the runewords
matching what has been typed. A runeword SHALL match when the query occurs
anywhere within its name, within any of its base item categories, or within its
item-type restriction — the three pieces of text the row itself renders in the
columns a reader is searching, as projected for the active locale. Under the
Russian locale a Cyrillic query matches the Russian labels, and the English
text of a translated record is not matched, because it is not on screen; a
record rendering its English fallback matches its English text for the same
reason. Matching SHALL ignore case and SHALL ignore surrounding whitespace in
the query, SHALL treat `ё` and `е` as the same letter, and an empty query SHALL
narrow nothing.

Search SHALL NOT match a runeword's runes. The rune relationship on the reference
site is expressed by highlighting driven by a rune inventory, and this project
tracks no inventory, so a rune query has nothing to be relative to.

#### Scenario: A partial name matches

- **WHEN** `lea` is typed into the search field under the English locale
- **THEN** `Leaf` is among the rows presented
- **AND** runewords whose name, categories and restriction all lack that text are
  not

#### Scenario: A category matches by a fragment of its name

- **WHEN** `armor` is typed under the English locale
- **THEN** all 22 runewords naming `Body Armors` are presented, because the query
  matches within a category name rather than only at its start

#### Scenario: A restriction is searchable

- **WHEN** `assassin` is typed under the English locale
- **THEN** `Chaos`, `Pattern`, `Mosaic` and `Treachery` are presented, matched on
  their `Assassin` restriction, because no category contains that word and the
  restriction is nonetheless rendered in the column being searched

#### Scenario: A Cyrillic query matches the Russian labels

- **WHEN** the Russian locale is active and a fragment of a Russian runeword
  name or category is typed
- **THEN** the rows whose projected Russian text contains that fragment are
  presented

#### Scenario: English text is not matched while Russian is shown

- **WHEN** the Russian locale is active and a fragment occurring only in a
  translated record's English name is typed
- **THEN** that record is not presented, because the text being searched is the
  text on screen

#### Scenario: ё and е are interchangeable in the query

- **WHEN** the Russian locale is active and a query writes `е` where the
  projected text has `ё`, or the reverse
- **THEN** the match succeeds, while the presented text keeps its own spelling

#### Scenario: Case is ignored

- **WHEN** a query is typed in upper, lower and mixed case, in either locale's
  script
- **THEN** the same rows are presented in all cases

#### Scenario: Surrounding whitespace in the query is ignored

- **WHEN** a query is typed with leading or trailing spaces
- **THEN** the rows presented are the same as for the query without them

#### Scenario: An empty query presents everything the filters allow

- **WHEN** the search field is emptied
- **THEN** search removes no row, and only the filters still in effect narrow the
  table

#### Scenario: A rune name is not a search term

- **WHEN** the name of a rune, such as `Shael`, is typed
- **THEN** the runewords containing that rune are not presented on account of
  containing it

#### Scenario: A query matching nothing narrows to nothing

- **WHEN** a query that occurs in no name, category or restriction is typed
- **THEN** no runeword row is presented, and the table says so rather than
  appearing empty

### Requirement: Every column header sorts its column

Each of the table's five column headers SHALL be a control that sorts the table by
that column. Each column SHALL sort on the value that column presents: crafted
state, the runeword's name, the number of sockets its rune sequence fills, the
first base item category it names, and the required character level.

Activating the header of a column that is not the sorted one SHALL sort by it.
Activating the header of the sorted column SHALL reverse the direction. There
SHALL be exactly two directions and no unsorted state, because required level
ascending is the default and is reachable by choosing it.

Ascending on crafted state SHALL present un-crafted runewords first, because
`false` before `true` is the arithmetic and because that ordering answers what is
left.

Choosing a column SHALL adopt that column's own first direction, and for crafted
state that direction SHALL be descending, so that one activation presents the
crafted runewords first. A player pressing the crafted header is asking what they
have made; what is left is the same header pressed twice, and is also what every
other control on the page already offers. Every other column SHALL start ascending.

Each header SHALL be a real button within its column header cell, so that it is
reachable and operable by keyboard, and SHALL NOT be a click handler on the cell.
That button SHALL cover the whole of its cell, so that the target is the header a
player sees rather than only the text within it.

#### Scenario: Sorting by a column that was not sorted

- **WHEN** the `Runeword` header is activated while the table is sorted by
  required level
- **THEN** the rows are presented in ascending name order

#### Scenario: Activating the sorted column reverses it

- **WHEN** the header of the column already sorted ascending is activated
- **THEN** the same rows are presented in descending order of that column

#### Scenario: The runes column sorts by socket count

- **WHEN** the `Runes` header is activated
- **THEN** the rows are ordered by how many runes the sequence holds, so the 14
  two-socket runewords precede the 45 three-socket ones
- **AND** the order is not derived from the rune names as text

#### Scenario: The base items column sorts on its first category

- **WHEN** the `Base Items` header is activated
- **THEN** the rows are ordered by the first category each row presents, so the
  order is visibly the column's own content

#### Scenario: One press of the crafted header shows what is done

- **WHEN** the `Crafted` header is activated with some runewords marked
- **THEN** the crafted runewords are presented before the un-crafted ones, because
  that column starts descending

#### Scenario: A second press shows what is left

- **WHEN** the `Crafted` header is activated again
- **THEN** the un-crafted runewords are presented first, which is that column
  ascending

#### Scenario: A press anywhere in a header sorts it

- **WHEN** a column header is activated away from the heading's own text, within the
  same cell
- **THEN** the table sorts by that column, because the control fills the cell rather
  than only the words in it

#### Scenario: A header is operable by keyboard

- **WHEN** a column header receives keyboard focus and is activated by keyboard
- **THEN** the table sorts by that column, because the header carries a button
  rather than a handler on the cell

#### Scenario: There is no third state

- **WHEN** a column's header is activated three times in succession
- **THEN** the table is sorted by that column each time, alternating direction,
  and never returns to an unsorted presentation

### Requirement: Every sort order is total

Every ordering the table can present SHALL be total: rows the chosen key cannot
separate SHALL be ordered by ascending required level and then by name, the same
ordering that serves as the default. Reversing a direction SHALL reverse the
chosen key's comparison only and SHALL leave the tiebreak ascending, so that a
descending presentation is not the ascending one read backwards.

A textual sort key SHALL be compared with the active locale's collation of the
projected text it presents: English projections by code point, whose premise —
ASCII throughout, so code-point order is alphabetical order — still holds, and
Russian projections by Russian collation, so that `ё` orders between `е` and
`ж` rather than where its code point falls. The universal tiebreak SHALL
compare canonical names and SHALL NOT depend on the locale, so a row's
tiebroken position never shifts with the language.

A sort SHALL be deterministic: the same dataset, the same crafted set, the same
active locale and the same chosen column SHALL always produce the same sequence
of rows, so that a row's position is a property of the data rather than of the
sort implementation or of which rows the filters happened to leave behind.

#### Scenario: Rows sharing a key are broken by level and name

- **WHEN** the table is sorted by socket count
- **THEN** the 45 runewords sharing three sockets are ordered among themselves by
  ascending required level, and those sharing a level by name

#### Scenario: The tiebreak does not reverse with the direction

- **WHEN** the socket-count sort is reversed
- **THEN** the six-socket runewords come first
- **AND** rows sharing a socket count are still ordered by ascending level and
  then by name within their group

#### Scenario: Russian text sorts in Russian alphabetical order

- **WHEN** the table is sorted by name or by base items under the Russian locale
- **THEN** the rows follow Russian collation of the projected text, with a word
  containing `ё` ordered between `е` and `ж` rather than after `я`

#### Scenario: The tiebreak is the same in both locales

- **WHEN** rows sharing a key value and a required level are ordered under each
  locale
- **THEN** their relative order is the same, because the final tiebreak compares
  canonical names

#### Scenario: A sort is repeatable

- **WHEN** the same column is sorted twice with no other change
- **THEN** the sequence of rows is identical

#### Scenario: The filters do not influence the order

- **WHEN** a filter is applied and then removed while the sort is unchanged
- **THEN** every row still present is in the position that sort gives it,
  unaffected by which rows were removed in between

### Requirement: Rows are filtered by crafted state

The interface SHALL offer a filter over crafted state with three choices — every
runeword, the crafted ones, and the remaining ones — presenting all of them by
default. The filter SHALL read the crafted set and SHALL NOT alter it: filtering
is a way of looking at progress and never a way of changing it.

A runeword whose crafted state changes while the filter excludes its new state
SHALL leave the presented rows immediately, so that what is shown continues to
answer the question that was asked.

#### Scenario: Remaining presents only the unmarked

- **WHEN** the filter is set to the remaining runewords with three marked crafted
- **THEN** 96 rows are presented and none of them is marked

#### Scenario: Crafted presents only the marked

- **WHEN** the filter is set to the crafted runewords with three marked
- **THEN** exactly those three rows are presented

#### Scenario: All is the default

- **WHEN** the page is opened with no stored view settings
- **THEN** the crafted filter presents every runeword

#### Scenario: A row leaves when it no longer matches

- **WHEN** a runeword is marked crafted while the filter is showing the remaining
  ones
- **THEN** that row is no longer presented

#### Scenario: Filtering does not change what is crafted

- **WHEN** the filter is changed in either direction
- **THEN** the crafted set is unchanged and nothing is written to storage on
  account of it

### Requirement: Rows are filtered by equipment slot

The interface SHALL offer a filter over equipment slot with six choices — every
slot, helm, melee, missile, offhand and body armour — presenting all of them by
default. A runeword SHALL match a slot when any of its base item categories belongs
to that slot, so that a runeword which can go into more than one slot is presented
under each of them.

The slots SHALL be named as the game names them where the game has a name for them,
and SHALL follow its distinctions. The off-hand slot is the off-hand rather than the
shield, which is what makes `Grimoire` belonging there a fact rather than an
exception; and melee and missile weapons are separate slots rather than one, because
a bow runeword and a sword runeword are not alternatives to one another and a player
planning what to craft is choosing between them.

This SHALL be the only category filter. Narrower intent than a slot is served by
search rather than by a further control, so no filter over individual categories
exists.

#### Scenario: A slot presents the runewords that fit it

- **WHEN** the helm slot is selected
- **THEN** the 14 runewords naming `Helms` are presented and no others

#### Scenario: A runeword spanning several slots appears under each

- **WHEN** the melee slot is selected, then the missile slot, then the body armour
  slot
- **THEN** `Fortitude` is presented in all three cases, because it names `Weapons`
  — which is any weapon — and `Body Armors`

#### Scenario: A bow runeword is not a melee runeword

- **WHEN** the missile slot is selected and then the melee slot
- **THEN** `Faith`, which names `Missile Weapons` alone, is presented only under
  missile, because the two weapon slots are the distinction the split exists for

#### Scenario: Every slot is the default

- **WHEN** the page is opened with no stored view settings
- **THEN** the slot filter presents every runeword

#### Scenario: One slot at a time

- **WHEN** a slot is selected while another is already selected
- **THEN** the newly selected slot replaces it, because the control offers one
  choice rather than a combination

#### Scenario: No finer category filter exists

- **WHEN** the filter controls are inspected
- **THEN** there is no control for an individual base item category such as
  `Swords`, because search covers that intent

### Requirement: Base item categories map onto equipment slots

The project SHALL declare a mapping from every base item category the dataset
names to one or more of the equipment slots, and the slot filter SHALL read
it. The mapping SHALL be total over the categories the dataset uses, proven by
test rather than asserted in a comment, so that a category the project has not
mapped fails the suite instead of making its runewords unreachable by every slot.

Almost every category SHALL belong to exactly one slot. A category that genuinely
denotes more than one SHALL map to all of them rather than being collapsed into one:
`Weapons` means any weapon, so a runeword carrying it can be made in a bow as
readily as in a sword, and assigning it to either weapon slot alone would hide those
runewords from a filter they belong in.

The mapping SHALL live in application code and SHALL NOT be added to the dataset
or its reference data, because a slot is this project's grouping of the vendored
categories rather than a value the vendored source carries, and the dataset's
generator may not emit a field with no source.

#### Scenario: Every category the dataset names has a slot

- **WHEN** every base item category named by any of the 99 runewords is looked up
- **THEN** each resolves to at least one slot

#### Scenario: An unmapped category fails the suite

- **WHEN** the dataset names a category the mapping does not cover
- **THEN** the test suite fails and identifies the category, rather than the
  runewords carrying it disappearing from every slot

#### Scenario: An off-hand category is an off-hand

- **WHEN** the slot of `Grimoire` is looked up
- **THEN** it is the off-hand slot, which is the slot every one of its seven
  runewords already occupies through `Shields`

#### Scenario: The general weapon category is both weapon slots

- **WHEN** the slots of `Weapons` are looked up
- **THEN** they are melee and missile together, because the category means any
  weapon

#### Scenario: The specific weapon categories are one slot each

- **WHEN** the slots of `Melee Weapons` and `Missile Weapons` are looked up
- **THEN** the first is melee alone and the second is missile alone
- **AND** a caster base such as `Wands`, `Staves` or `Scepters` is melee, because
  what the class carrying it does with it does not make it a missile weapon

#### Scenario: The dataset carries no slot

- **WHEN** the dataset and its item-type reference data are inspected
- **THEN** neither holds a slot field, because the mapping is the application's
  and the generator has no source for one

### Requirement: Search and the two filters combine as a conjunction

A runeword SHALL be presented only when it satisfies the search query, the crafted
filter and the slot filter together. The three SHALL be independent — changing one
SHALL NOT reset another — and the narrowing SHALL be computed as a pure function
of the dataset, the crafted set and the current settings, so that the reason a row
is present or absent is answerable without reference to the order the controls
were used in.

#### Scenario: All three narrow at once

- **WHEN** the slot is set to the off-hand, the crafted filter to the remaining
  ones, and `spirit` is typed
- **THEN** only runewords satisfying all three are presented

#### Scenario: Changing one control leaves the others alone

- **WHEN** the slot filter is changed
- **THEN** the search query and the crafted filter are unchanged, and still apply

#### Scenario: The order the controls were used in does not matter

- **WHEN** the same three settings are reached by two different sequences of
  interaction
- **THEN** the same rows are presented in both cases

#### Scenario: The narrowing is testable without a DOM

- **WHEN** the code that produces the presented rows is inspected
- **THEN** it is a function of the dataset, the crafted set and the settings,
  callable without rendering a component

### Requirement: The narrowed view states its size and explains an empty result

Whenever rows can be hidden, the interface SHALL state how many runewords are
presented out of the dataset's total, and SHALL announce that statement politely
to assistive technology when it changes, so that a reader who cannot see 99 rows
become eleven is told that they did.

Where the settings match no runeword, the table SHALL present an explanation in
place of rows rather than an empty body, and that explanation SHALL sit within the
table so that navigating the table by row reaches it.

#### Scenario: The count states both numbers

- **WHEN** a filter leaves eleven runewords presented
- **THEN** the interface states that eleven of 99 are shown

#### Scenario: The count is announced when it changes

- **WHEN** a filter is changed
- **THEN** the new count is announced politely, without moving keyboard focus

#### Scenario: An empty result explains itself

- **WHEN** the settings match no runeword
- **THEN** the table presents a message saying that nothing matches
- **AND** the message is within the table rather than beside it, so a reader
  navigating rows arrives at it

#### Scenario: An empty result is not an empty table

- **WHEN** the settings match no runeword
- **THEN** the column headers remain present and the table is not replaced

### Requirement: The view can be returned to its defaults

The interface SHALL offer a control that clears the search query and returns both
filters to presenting everything, and that control SHALL be present whenever the
view is narrowed and absent when it is not. A restored setting that hides every
row SHALL therefore be one activation away from a complete table.

Returning the view to its defaults SHALL NOT change the sort, and SHALL NOT change
the crafted set.

#### Scenario: Resetting restores every row

- **WHEN** the reset control is activated while a filter and a query are in effect
- **THEN** all 99 runewords are presented and the search field is empty

#### Scenario: The control is absent when there is nothing to reset

- **WHEN** the view presents every runeword with an empty query
- **THEN** no reset control is offered, because a control that does nothing is
  worse than no control

#### Scenario: Resetting leaves the sort alone

- **WHEN** the view is reset while sorted by name descending
- **THEN** the rows presented are still in that order

#### Scenario: Resetting leaves progress alone

- **WHEN** the view is reset
- **THEN** the crafted set and the progress indicator are unchanged

### Requirement: The sort controls stay reachable while reading the table

The column headers SHALL remain reachable while the table is being read, rather
than scrolling out of the viewport above it, because the table is thousands of
pixels tall and a sort control that cannot be reached from the row being read is
not a control. The header SHALL remain legible over the rows that pass beneath it,
and a runeword's detail view SHALL render above it rather than beneath it.

#### Scenario: The headers stay in view

- **WHEN** the page is scrolled to a row far down the table
- **THEN** the column headers are still on screen and can be activated

#### Scenario: The header does not become transparent over rows

- **WHEN** rows scroll beneath the header
- **THEN** the header's own band conceals them rather than the two texts
  overlapping

#### Scenario: A detail view is not covered by the header

- **WHEN** the detail view of a row near the top of the viewport is open and the
  page is scrolled
- **THEN** the detail view renders above the header band rather than sliding
  beneath it

### Requirement: Narrowing the view changes nothing but which rows are presented

No control in this capability SHALL change what the application counts, stores or
holds. Overall progress SHALL continue to be measured against the whole dataset
and SHALL NOT be measured against the presented rows. The crafted set SHALL be
read and never written. The dataset SHALL be read and never reordered in place, so
that a consumer entitled to find it in its own order still does.

#### Scenario: The progress denominator does not move

- **WHEN** the table is narrowed to eleven rows
- **THEN** the progress indicator still reports its maximum as 99

#### Scenario: The progress value does not move either

- **WHEN** the table is narrowed to rows that exclude a crafted runeword
- **THEN** the crafted count reported by the progress indicator is unchanged,
  because it counts the set and not the rows

#### Scenario: Sorting and filtering write nothing to progress

- **WHEN** any of search, sort or the two filters is used
- **THEN** stored progress is unchanged

#### Scenario: The dataset keeps its own order

- **WHEN** the dataset is read after the table has been sorted
- **THEN** its own order is unchanged, because the presented rows are a new
  sequence rather than a rearrangement of the source

### Requirement: No control reads an availability field

No search, sort, filter or count in this capability SHALL read the patch that
introduced a runeword or its note. Availability changes between ladder seasons,
and where a stale badge is a cosmetic inaccuracy a stale filter would hide
runewords the player can craft and a stale sort would order the table by
something untrue. These fields render badges, and that remains all they do.

The rule SHALL be stated in terms of the fields that exist. The ladder-only flag
it used to name is gone from the dataset, and a prohibition worded around a field
no record carries reads as protection where there is nothing left to protect.

#### Scenario: No filter over availability exists

- **WHEN** the filter controls are inspected
- **THEN** none filters by patch or by note

#### Scenario: No column sorts on availability

- **WHEN** the five sort keys are inspected
- **THEN** none reads the patch or the note

#### Scenario: Search ignores availability

- **WHEN** a patch value such as `2.6` is typed into the search field
- **THEN** runewords are not presented on account of carrying that patch

#### Scenario: The count ignores availability

- **WHEN** the presented count and its total are inspected
- **THEN** neither is reduced by any availability field, and the total is the
  whole dataset
