# progress-transfer Delta

## MODIFIED Requirements

### Requirement: A matched name is matched on the canonical English name or its Russian label

A candidate SHALL be matched against the dataset's canonical English runeword
names **and** against each runeword's Russian label from the dataset, so that a
hand-written or mixed-language list still marks recognised runewords. Matching
SHALL disregard letter case, surrounding whitespace, and the `ё`/`е` distinction
on both sides, for the same reason search does. What is stored for a matched
candidate SHALL be the dataset's canonical English name, whatever form the file
used.

Export SHALL continue to write canonical English names only. The active UI locale
SHALL NOT change which candidates match or what is stored.

Fuzzy matching beyond those folds SHALL NOT be used. A candidate that matches
neither English nor Russian remains unmatched on the terms already set for unknown
names.

#### Scenario: Case does not prevent a match

- **WHEN** a file lists a runeword name in lower case
- **THEN** it is counted and marked, and the canonical name is what is stored

#### Scenario: A Russian label matches

- **WHEN** a file lists a runeword's Russian dataset label
- **THEN** it is counted and marked, and the canonical English name is what is
  stored

#### Scenario: A mixed file marks both languages

- **WHEN** a file lists some runewords by English name and others by Russian label
- **THEN** every recognised line is marked, and the confirmation counts all of them

#### Scenario: ё and е do not prevent a Russian match

- **WHEN** a file lists a Russian label with е where the dataset uses ё, or the
  reverse
- **THEN** it still matches that runeword

#### Scenario: The locale does not change the result

- **WHEN** the same file is imported once under English and once under Russian
- **THEN** the resulting crafted set and stored value are identical

#### Scenario: Exporting under Russian writes English

- **WHEN** the export control is activated with the Russian locale active
- **THEN** the file contains canonical English names
