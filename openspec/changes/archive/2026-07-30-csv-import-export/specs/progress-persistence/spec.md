# progress-persistence Delta

## MODIFIED Requirements

### Requirement: A name the dataset does not know is kept, not counted

A stored name that matches no runeword in the dataset SHALL NOT be marked, SHALL
NOT be counted towards progress, and SHALL NOT be discarded. It SHALL be written
back unchanged on every save that carries prior progress forward, so that a
runeword renamed or removed between game patches does not silently lose the player
the mark they made, while a stored value full of nonsense still reports a truthful
count out of the real total.

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

- **WHEN** the stored list contains a name that is in no runeword record
- **THEN** no row is marked for it and the progress count does not include it

#### Scenario: An unknown name is preserved across a save

- **WHEN** the stored list contains an unknown name and the player then toggles a
  real runeword
- **THEN** the newly written value still contains the unknown name

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

- **WHEN** an imported file lists names the dataset does not know
- **THEN** the newly written value contains them, unmarked and uncounted, exactly
  as any other unknown stored name
