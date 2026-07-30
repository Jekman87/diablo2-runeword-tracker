# progress-transfer Delta

## ADDED Requirements

### Requirement: Crafted progress can be written out as a file

The interface SHALL offer a control that writes the player's crafted runewords to
a file the browser downloads, so that progress held in one browser's local storage
can be carried to another. The file SHALL be plain text: one canonical English
runeword name per line, in a stable order, and **nothing else**. It SHALL contain
no timestamp, no counts, no header line and no other field, because none of them
is anything the player or the import needs.

There SHALL be no format-and-version line. One was specified and built —
`# diablo2-runeword-tracker export v1`, on the argument that a future format needs
a way to announce itself — and it was removed before shipping because nothing read
it and nothing would until a second format existed. A v2 can introduce its own
marker and treat an unmarked file as v1, which is what this is. The import SHALL
nevertheless continue to ignore `#` lines, so that a file exported while the
header was being written still imports whole.

The names written SHALL be every crafted runeword, and SHALL NOT be the runewords
the table is currently presenting. Search, the two filters and the sort order have
no bearing on what a backup contains, for the same reason they have no bearing on
the progress denominator: a file that silently held only the visible rows would
erase the rest on the next import.

The file SHALL be pure ASCII and SHALL NOT be prefixed with a byte-order mark,
because canonical runeword names are ASCII and a BOM is a thing the reader would
then have to strip. Its name SHALL be fixed and SHALL NOT vary with the active
locale, so the same file is recognisable wherever it is opened.

#### Scenario: The file lists the crafted runewords

- **WHEN** three runewords are marked crafted and the export control is activated
- **THEN** the downloaded file's lines are exactly those three canonical English
  names, one per line, with no header line above them and nothing else in the file

#### Scenario: Filters do not narrow the export

- **WHEN** the table is narrowed by a search query and a filter so that most
  crafted runewords are not presented, and the export control is activated
- **THEN** the file still lists every crafted runeword, not the presented ones

#### Scenario: Nothing crafted still exports

- **WHEN** no runeword is marked crafted and the export control is activated
- **THEN** an empty file is produced, rather than the control doing nothing

#### Scenario: The order is stable

- **WHEN** the same set of runewords is marked in two different sequences and each
  is exported
- **THEN** the two files are byte-identical

#### Scenario: The file carries no byte-order mark

- **WHEN** the exported bytes are inspected
- **THEN** they begin with the first letter of the first name, and every byte in
  the file is ASCII

### Requirement: An imported file replaces stored progress outright

The interface SHALL offer a control that reads a file the player chooses and makes
its contents the whole of their progress. What the file lists SHALL become the
crafted set; every mark held before the import SHALL be gone, whether or not the
file mentions it. Import SHALL NOT merge, SHALL NOT add to what is already there,
and SHALL NOT be selective.

The replacement SHALL be written through the same module that owns every other read
and write of stored progress, so that an import is a second caller and not a second
definition of the stored format.

#### Scenario: Marks the file does not list are removed

- **WHEN** ten runewords are marked crafted and a file listing two of them is
  imported and confirmed
- **THEN** exactly those two are marked, and the other eight are not

#### Scenario: Marks the file lists are added

- **WHEN** nothing is marked and a file listing twelve runewords is imported and
  confirmed
- **THEN** exactly those twelve are marked

#### Scenario: An empty file clears progress

- **WHEN** an empty file, or one carrying only comment lines, is imported and
  confirmed
- **THEN** no runeword is marked, because the file is the whole of the progress

#### Scenario: The replacement survives a reload

- **WHEN** an import is confirmed and the application is reloaded
- **THEN** the imported set is what loads, because the replacement was written to
  storage and not only to the session

#### Scenario: The write goes through the persistence module

- **WHEN** the import path is inspected
- **THEN** it writes through the persistence module rather than naming the storage
  key or calling the storage API itself

### Requirement: Nothing is replaced until the player confirms it

Choosing a file SHALL NOT change anything. It SHALL raise a modal confirmation
that states that current progress will be erased and replaced, states how many
runewords the chosen file will mark, and offers both to proceed and to cancel.
Progress SHALL be written only when the player proceeds.

The count offered SHALL be the number of runewords the file will actually mark —
the lines that match the dataset — because that is the number a player can check
against the file they meant to bring, and a file that yields none announces itself
by offering to import none.

Cancelling SHALL leave progress exactly as it was. There SHALL be no undo for a
confirmed import: this confirmation is the safety mechanism, and the transient
undo notice is not extended to cover a bulk replacement.

#### Scenario: Choosing a file changes nothing on its own

- **WHEN** a file is chosen and the confirmation is on screen
- **THEN** the crafted set, the progress indicator and stored progress are all
  unchanged

#### Scenario: The confirmation states the count

- **WHEN** a file whose lines match twelve runewords in the dataset is chosen
- **THEN** the confirmation states that twelve runewords will be marked

#### Scenario: A file that matches nothing says so

- **WHEN** a file whose lines match no runeword in the dataset is chosen
- **THEN** the confirmation states that none will be marked, and proceeding would
  clear the player's progress

#### Scenario: Cancelling leaves progress alone

- **WHEN** the confirmation is cancelled
- **THEN** the crafted set and stored progress are what they were before the file
  was chosen

#### Scenario: Proceeding applies the replacement

- **WHEN** the confirmation is accepted
- **THEN** the imported set is marked, the progress indicator follows it, and
  storage holds it

#### Scenario: There is no undo afterwards

- **WHEN** an import has been confirmed
- **THEN** no notice offering to reverse it appears, and the previous progress is
  not recoverable from the interface

### Requirement: The confirmation behaves as a modal dialog

The confirmation SHALL be a modal dialog: it SHALL be named by its own heading, it
SHALL hold keyboard focus while it is open, and the page behind it SHALL not be
reachable by pointer or by Tab. Escape SHALL cancel it, as SHALL its cancel action.
When it closes, by any route, focus SHALL return to the import control that opened
it rather than falling to the document body.

Focus on opening SHALL rest on the cancelling action rather than the proceeding
one, because a keyboard reader who presses Enter on reflex should keep their
progress rather than lose it.

#### Scenario: The dialog traps focus

- **WHEN** the confirmation is open and Tab is pressed repeatedly
- **THEN** focus moves only between the dialog's own controls

#### Scenario: Escape cancels

- **WHEN** Escape is pressed while the confirmation is open
- **THEN** the dialog closes and progress is unchanged

#### Scenario: Focus comes back to the control

- **WHEN** the confirmation closes, whether cancelled or accepted
- **THEN** focus is on the import control

#### Scenario: The reflex keypress is the safe one

- **WHEN** the confirmation opens
- **THEN** the focused control is the one that cancels

#### Scenario: The dialog is named

- **WHEN** the dialog is inspected by role
- **THEN** it exposes a dialog whose accessible name is its heading

### Requirement: Import parses text, and does not read spreadsheets

Import SHALL accept `.csv`, `.tsv` and `.txt` files and any single-column list of
names in a text file, and SHALL parse them itself with no added dependency. A
spreadsheet parser would become the largest dependency in the project in order to
read a list of names; a player holding a spreadsheet saves it as CSV instead.

Parsing SHALL: strip a leading byte-order mark; treat CRLF, LF and CR alike as line
endings; ignore a line whose first non-blank character is `#`, which keeps a file
exported while this format had a header line readable and lets a hand-written
list carry comments; ignore a
blank line; take the first cell of each remaining line, where a cell ends at the
first comma or tab; unwrap a cell wrapped in double quotes, including one that
contains a comma or a doubled quote; and trim surrounding whitespace from the
result. A name that survives all of that SHALL be a candidate; a line that yields
nothing SHALL be skipped. The same name appearing twice SHALL be one mark, not two.

A file that is not text SHALL degrade rather than fail: it is parsed as text like
any other, yields candidates that match nothing, and reaches the confirmation
stating that no runeword will be marked. A file that cannot be read at all SHALL
leave progress untouched and SHALL NOT raise the confirmation.

#### Scenario: The exported file imports

- **WHEN** a file this application exported is imported
- **THEN** exactly the runewords it lists are marked

#### Scenario: Windows line endings and a byte-order mark are tolerated

- **WHEN** a file saved with a leading byte-order mark and CRLF line endings is
  imported
- **THEN** its names are read exactly as they would be from a bare LF file

#### Scenario: A spreadsheet's CSV imports

- **WHEN** a file whose lines carry several comma-separated columns is imported
- **THEN** the first column is what is read, and the other columns are ignored

#### Scenario: A tab-separated file imports

- **WHEN** a file whose cells are separated by tabs is imported
- **THEN** the first cell of each line is what is read

#### Scenario: A quoted cell is unwrapped

- **WHEN** a line's first cell is wrapped in double quotes and contains a comma
- **THEN** the whole quoted text is the candidate, and the comma inside it does not
  end the cell

#### Scenario: Blank lines and comments are skipped

- **WHEN** a file mixes blank lines and `#` lines among its names
- **THEN** neither kind contributes a candidate

#### Scenario: A repeated name marks once

- **WHEN** a file lists the same runeword three times
- **THEN** the confirmation counts it once and it is marked once

#### Scenario: A spreadsheet workbook degrades to nothing

- **WHEN** an `.xlsx` file is chosen
- **THEN** the confirmation opens stating that no runeword will be marked, rather
  than the application failing

#### Scenario: An unreadable file changes nothing

- **WHEN** the chosen file cannot be read
- **THEN** no confirmation appears and progress is unchanged

### Requirement: A matched name is matched on the canonical English name

A candidate SHALL be matched against the dataset's canonical English runeword
names, and SHALL NOT be matched against a locale's translated labels, so that a
file written under one language imports identically under the other. Matching SHALL
disregard letter case and surrounding whitespace, because without an unmatched-name
report, a file that says `fortitude` would otherwise lose a mark for a reason the
player never sees. What is stored for a matched candidate SHALL be the dataset's
canonical name, whatever case the file used.

#### Scenario: Case does not prevent a match

- **WHEN** a file lists a runeword name in lower case
- **THEN** it is counted and marked, and the canonical name is what is stored

#### Scenario: A Russian label is not a match

- **WHEN** a file lists a runeword's Russian label
- **THEN** it does not match, because the transfer format is canonical English
  names only

#### Scenario: The locale does not change the result

- **WHEN** the same file is imported once under English and once under Russian
- **THEN** the resulting crafted set and stored value are identical

#### Scenario: Exporting under Russian writes English

- **WHEN** the export control is activated with the Russian locale active
- **THEN** the file contains canonical English names

### Requirement: An imported name the dataset does not know is kept but not counted

A candidate matching no runeword in the dataset SHALL NOT be marked, SHALL NOT be
counted in the confirmation, and SHALL NOT be reported to the player — but SHALL be
carried into stored progress as an unknown name, on the terms `progress-persistence`
already sets for one. This is the existing behaviour for a name in storage, not a
second rule invented here: a file exported by another version of this dataset must
not silently lose the player marks for runewords this version has not got.

There SHALL be no unmatched-name report. The count in the confirmation is what a
player judges a file by.

#### Scenario: An unrecognised line is not marked and not counted

- **WHEN** a file lists eight known runewords and four names the dataset does not
  have
- **THEN** the confirmation states eight, and after confirming, eight rows are
  marked and progress reads eight

#### Scenario: An unrecognised line is still stored

- **WHEN** that import is confirmed and the stored value is inspected
- **THEN** it contains the four unknown names alongside the eight known ones

#### Scenario: A restored runeword recovers its mark

- **WHEN** a name imported as unknown is later present in the dataset
- **THEN** that runeword loads as marked, because the import stored it rather than
  dropping it

#### Scenario: No report is shown

- **WHEN** an import with unmatched lines is confirmed
- **THEN** nothing lists them, and no notice mentions them

### Requirement: A replacement raises no undo notice and cancels a pending one

An import SHALL NOT raise the transient undo notice, because that notice reverses
one toggle and an import is not one. A notice left over from a toggle made before
the import SHALL be dismissed when the import is applied, so that its undo cannot
be taken against a set it was never about.

#### Scenario: Importing raises no notice

- **WHEN** an import is confirmed
- **THEN** no undo notice appears

#### Scenario: A pending notice does not survive the import

- **WHEN** a runeword is toggled and, while its notice is still on screen, an
  import is confirmed
- **THEN** the notice is gone, and the imported set is what is marked

### Requirement: Both controls sit with the browsing controls and are operable by keyboard

The export and import controls SHALL be presented within the browsing-control bar
rather than in a bar of their own, on the row that states the result count and at
the opposite end of it from that count. They SHALL NOT be placed among the search
field and the two filters: that row is already a search field and nine filter
options, and two more controls on it would wrap and read as a separate bar without
being one.

Each SHALL be a real button reachable by Tab and operable by Space and Enter, and
each SHALL be named from the display-copy layer in the active locale. Their names
SHALL be self-describing, so that no group heading over the pair is required. The
file chooser SHALL be reached through the import button rather than being a bare
file input sitting in the bar.

Choosing the same file twice SHALL raise the confirmation both times, so that a
player who cancels and reconsiders is not left with a control that appears dead.

#### Scenario: The controls are in the control bar

- **WHEN** the browsing controls are inspected
- **THEN** the export and import controls are among them, on the result count's
  row and apart from the count rather than beside the filters

#### Scenario: Both are reachable by keyboard

- **WHEN** the page is traversed by Tab
- **THEN** both controls receive focus and can be activated without a pointer

#### Scenario: The names are localised

- **WHEN** the active locale changes
- **THEN** both control names and every word of the confirmation are presented in
  the new language, without a reload

#### Scenario: The same file can be chosen twice

- **WHEN** a file is chosen, the confirmation is cancelled, and the same file is
  chosen again
- **THEN** the confirmation opens the second time as it did the first
