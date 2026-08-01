# progress-persistence Delta

## MODIFIED Requirements

### Requirement: A name the dataset does not know is kept, not counted

A stored name that matches no runeword in the dataset — neither a canonical
English name nor that runeword's Russian dataset label, under the fold used for
import matching (case, trim, `ё`/`е`) — SHALL NOT be marked, SHALL NOT be counted
towards progress, and SHALL NOT be discarded. It SHALL be written back unchanged
on every save that carries prior progress forward, so that a runeword renamed or
removed between game patches does not silently lose the player the mark they made,
while a stored value full of nonsense still reports a truthful count out of the
real total.

A name that matches a Russian dataset label SHALL be treated as known: it SHALL
be marked under the canonical English name and SHALL NOT remain in the unknown
list.

A wholesale replacement — an imported file becoming the whole of the player's
progress, which `progress-transfer` specifies — is the one save that does not carry
prior progress forward, and it SHALL NOT preserve the unknown names it replaces.
A replacement defines the entire stored value, its unknown names included: the
names the imported file carried that the dataset does not know become the stored
unknown names, on the same terms as any other, and the ones held before it are
gone with everything else the import replaced. This is also what finally gives a
preserved unknown name a way off the page, since nothing rendered in the interface
can reach one.

#### Scenario: An unknown name does not appear in the interface

- **WHEN** the stored list contains a name that matches neither an English
  runeword name nor a Russian dataset label
- **THEN** no row is marked for it and the progress count does not include it

#### Scenario: An unknown name is preserved across a save

- **WHEN** the stored list contains an unknown name and the player then toggles a
  real runeword
- **THEN** the newly written value still contains the unknown name

#### Scenario: A Russian label in storage loads as crafted

- **WHEN** the stored list contains a runeword's Russian dataset label
- **THEN** that runeword loads as crafted under its canonical English name

#### Scenario: Progress cannot exceed the total

- **WHEN** the stored list contains more names than the dataset has runewords
- **THEN** the reported progress is at most the dataset's size, because only names
  the dataset knows are counted

#### Scenario: A restored runeword recovers its mark

- **WHEN** a name that was unknown becomes present in the dataset again
- **THEN** that runeword loads as marked, because the name was carried rather than
  dropped

#### Scenario: A replacement does not carry the old unknown names

- **WHEN** the stored list contains an unknown name and an imported file that does
  not mention it replaces the player's progress
- **THEN** the newly written value does not contain it, because a replacement is
  the whole stored value and not an edit to it

#### Scenario: A replacement's own unrecognised names are kept

- **WHEN** an imported file lists names the dataset does not know in English or
  Russian
- **THEN** the newly written value contains them, unmarked and uncounted, exactly
  as any other unknown stored name

### Requirement: Unavailable storage degrades to a usable session

Where local storage cannot be read or written — because it is disabled, full, or
throws in a private browsing mode — the application SHALL remain fully usable for
the session, with marking and progress all working in memory. A storage failure
SHALL NOT produce a blank page, an error dialog or a lost interaction.

#### Scenario: A throwing read does not break the page

- **WHEN** reading from storage throws
- **THEN** the application renders with no progress and every control works

#### Scenario: A throwing write does not break the mark

- **WHEN** writing to storage throws
- **THEN** the runeword is still marked after confirmation, the progress indicator
  still updates, and no error surfaces to the player

#### Scenario: The failure is contained at the boundary

- **WHEN** the persistence module is inspected
- **THEN** storage access is guarded there rather than at each call site, so no
  component knows that storage can fail
