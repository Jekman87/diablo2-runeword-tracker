# runeword-browsing Delta

## MODIFIED Requirements

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
