## ADDED Requirements

### Requirement: Progress survives a reload

Crafted progress SHALL be written to the browser's local storage as it changes and
read back when the application loads, so that a player who closes the tab returns
to the marks they made. No progress SHALL be sent anywhere else: there is no
account, no server and no request.

#### Scenario: Marks are still there after a reload

- **WHEN** several runewords are marked crafted and the application is reloaded
- **THEN** exactly those runewords are marked, and no others

#### Scenario: Unmarking persists too

- **WHEN** a crafted runeword is unmarked and the application is reloaded
- **THEN** it is not marked

#### Scenario: A first visit starts empty

- **WHEN** the application loads with no stored progress
- **THEN** no runeword is marked and the interface reports zero progress

#### Scenario: Progress leaves no other trace

- **WHEN** a runeword is toggled and the application's outbound requests are
  inspected
- **THEN** none carries the crafted state, because persistence is local storage
  alone

### Requirement: Progress is stored by canonical name, under a namespaced versioned key

Stored progress SHALL identify runewords by their canonical name and SHALL NOT
identify them by position in the dataset, because the dataset is generated and a
position is a property of the file rather than of the runeword. The storage key
SHALL be namespaced to this project and SHALL carry a format version, so that it
cannot collide with another application sharing the origin and so that a future
format is a different key rather than an overwrite of this one. The stored value
SHALL be a list of names in a stable order, so that the same set of marks always
produces the same stored value.

#### Scenario: Names are stored, not positions

- **WHEN** the stored value is inspected after marking a runeword
- **THEN** it contains that runeword's canonical name

#### Scenario: Regenerating the dataset does not move progress

- **WHEN** the dataset's record order changes but the names do not
- **THEN** the same runewords are still marked, because nothing stored referred to
  a position

#### Scenario: The key cannot collide on a shared origin

- **WHEN** the storage key is inspected
- **THEN** it is namespaced to this project rather than a bare word such as
  `crafted`, because the deployment shares one origin and one local storage with
  every other project published under the same account

#### Scenario: A future format is a new key

- **WHEN** the storage key is inspected
- **THEN** it carries a version segment, so that a later format writes a different
  key and leaves this one readable rather than destroying it in place

#### Scenario: The stored order is stable

- **WHEN** the same set of runewords is marked in two different sequences
- **THEN** the stored value is identical in both cases

### Requirement: Stored progress is validated, never trusted

Data read from local storage SHALL be validated with the project's schema
validator before it is used, exactly as the dataset is, because it is
user-editable, is shared with every other page on the origin, and was written by a
version of this application that may not be this one. A stored value that is
absent, is not valid JSON, or does not match the expected shape SHALL be treated as
no progress rather than crashing the application or being used unchecked.

#### Scenario: A valid stored list loads

- **WHEN** the stored value is a list of names that are in the dataset
- **THEN** exactly those runewords are marked

#### Scenario: Malformed JSON is survived

- **WHEN** the stored value is not valid JSON
- **THEN** the application loads with no progress and remains fully usable

#### Scenario: A wrong shape is survived

- **WHEN** the stored value is valid JSON of the wrong shape, such as an object or
  a list of numbers
- **THEN** the application loads with no progress and remains fully usable

#### Scenario: Duplicates collapse

- **WHEN** the stored list names the same runeword more than once
- **THEN** it is marked once, and the progress count is not inflated

#### Scenario: The value is parsed rather than asserted

- **WHEN** the load path is inspected
- **THEN** the value passes through schema validation rather than a type assertion,
  because a cast states a hope and a schema performs a check

### Requirement: A name the dataset does not know is kept, not counted

A stored name that matches no runeword in the dataset SHALL NOT be marked, SHALL
NOT be counted towards progress, and SHALL NOT be discarded. It SHALL be written
back unchanged on every save, so that a runeword renamed or removed between game
patches does not silently lose the player the mark they made, while a stored value
full of nonsense still reports a truthful count out of the real total.

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

### Requirement: A failed read never overwrites what it failed to read

Progress SHALL be written in response to the player changing it, and SHALL NOT be
written as a consequence of the application starting. A load that failed SHALL
leave the stored value untouched, so that a value that could not be parsed can
still be recovered by hand rather than being replaced with an empty one before the
player has done anything.

#### Scenario: Loading does not write

- **WHEN** the application loads
- **THEN** the stored value is unchanged, whether the load succeeded or failed

#### Scenario: Corrupt data survives until the player acts

- **WHEN** the stored value cannot be parsed and the application is loaded and
  then closed with no toggle made
- **THEN** the unparseable value is still there to be inspected or repaired

#### Scenario: The first toggle is the first write

- **WHEN** the player toggles a runeword for the first time in a session
- **THEN** that is when the stored value is written

### Requirement: Unavailable storage degrades to a usable session

Where local storage cannot be read or written — because it is disabled, full, or
throws in a private browsing mode — the application SHALL remain fully usable for
the session, with marking, progress and undo all working in memory. A storage
failure SHALL NOT produce a blank page, an error dialog or a lost interaction.

#### Scenario: A throwing read does not break the page

- **WHEN** reading from storage throws
- **THEN** the application renders with no progress and every control works

#### Scenario: A throwing write does not break the toggle

- **WHEN** writing to storage throws
- **THEN** the runeword is still marked, the progress indicator still updates, and
  no error surfaces to the player

#### Scenario: The failure is contained at the boundary

- **WHEN** the persistence module is inspected
- **THEN** storage access is guarded there rather than at each call site, so no
  component knows that storage can fail

### Requirement: One module owns every read and write

All access to stored progress SHALL go through a single module, so that a later
change that also reads or writes it — importing a list of crafted runewords from a
file, for example — becomes a second caller rather than a second definition of the
format. That module SHALL be plain functions independent of the interface, so the
failure modes above can be tested without rendering anything.

#### Scenario: No component reaches storage directly

- **WHEN** the modules under `src/` are inspected
- **THEN** only the persistence module names the storage key or calls the storage
  API

#### Scenario: The failure modes are testable without a DOM

- **WHEN** the persistence module's tests are inspected
- **THEN** they exercise loading, saving, malformed data, unknown names and a
  throwing storage without rendering a component
