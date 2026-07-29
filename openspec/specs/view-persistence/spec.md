# view-persistence Specification

## Purpose

The storage contract for how the player is looking at the list — that the sort and
the two filters survive a reload under their own namespaced versioned key, that the
search text deliberately does not, that a stored value is validated rather than
trusted, and that a corrupt one is replaced by the defaults rather than preserved,
which is the opposite of what `progress-persistence` requires of progress and the
reason these are two capabilities rather than one.

## Requirements

### Requirement: How the player is looking at the list survives a reload

The sorted column, its direction, the crafted filter and the slot filter SHALL be
written to the browser's local storage as they change and read back when the
application loads, so that a player returns to the view they left rather than to
the default one. Nothing SHALL be sent anywhere else: there is no account and no
server.

The restored view SHALL be in effect on the first paint rather than replacing an
unfiltered table a moment later.

#### Scenario: A filter is still applied after a reload

- **WHEN** the slot filter is set to the off-hand and the application is reloaded
- **THEN** the slot filter is still set to the off-hand and the table is narrowed to it

#### Scenario: A sort is still applied after a reload

- **WHEN** the table is sorted by name descending and the application is reloaded
- **THEN** the rows are still presented in that order and that column is still
  marked as the sorted one

#### Scenario: A first visit uses the defaults

- **WHEN** the application loads with no stored view settings
- **THEN** the table presents every runeword in ascending required-level order

#### Scenario: The restored view is the first thing rendered

- **WHEN** the application loads with a stored filter
- **THEN** the narrowed table is what renders, with no frame of the full table
  before it

#### Scenario: View settings leave no other trace

- **WHEN** a filter is changed and the application's outbound requests are
  inspected
- **THEN** none carries the view settings, because persistence is local storage
  alone

### Requirement: The search query is deliberately not persisted

The search query SHALL NOT be stored, and the stored record SHALL carry no field
for it. A query restored from an earlier session presents a table narrowed to a
few rows for a reason the player has forgotten, which reads as a broken dataset
rather than as a preference — where a filter's own control shows what it is doing,
and is the honest form of the same idea.

#### Scenario: A query does not come back

- **WHEN** a search query is typed and the application is reloaded
- **THEN** the search field is empty and no row is hidden by search

#### Scenario: The stored record has no room for a query

- **WHEN** the stored value is inspected after searching
- **THEN** it contains no search field at all, rather than an empty one

### Requirement: View settings are stored under their own namespaced versioned key

View settings SHALL be stored under a key that is namespaced to this project,
carries a format version, and is distinct from the key holding crafted progress.
The namespace is load-bearing: the deployment shares one origin and one local
storage with every other project published under the same account. The separate
key is load-bearing too: discarding an unusable view setting must not be able to
take a player's progress with it.

#### Scenario: The key cannot collide on a shared origin

- **WHEN** the storage key is inspected
- **THEN** it is namespaced to this project rather than a bare word such as `view`

#### Scenario: A future format is a new key

- **WHEN** the storage key is inspected
- **THEN** it carries a version segment, so that a later format writes elsewhere
  rather than overwriting this one

#### Scenario: Progress and view settings are separate values

- **WHEN** the stored keys are inspected
- **THEN** crafted progress and view settings occupy different keys
- **AND** writing one never rewrites the other

### Requirement: Stored view settings are validated, never trusted

Data read from local storage SHALL be validated with the project's schema
validator before it is used, exactly as the dataset and stored progress are,
because it is user-editable, is shared with every other page on the origin, and
was written by a version of this application that may not be this one. Each stored
choice SHALL be validated against the choices this version offers, so that a value
naming a column or a filter this version does not have is rejected rather than
producing a view the interface cannot represent.

#### Scenario: A valid stored record loads

- **WHEN** the stored value names a column, a direction and two filters this
  version offers
- **THEN** the table is presented accordingly

#### Scenario: Malformed JSON is survived

- **WHEN** the stored value is not valid JSON
- **THEN** the application loads with the default view and remains fully usable

#### Scenario: A wrong shape is survived

- **WHEN** the stored value is valid JSON of the wrong shape, such as a list or a
  string
- **THEN** the application loads with the default view and remains fully usable

#### Scenario: An unrecognised choice is rejected

- **WHEN** the stored value names a sorted column or a filter this version does
  not offer
- **THEN** the whole record is rejected and the defaults are used, rather than the
  record being accepted field by field into a state the interface cannot produce

#### Scenario: The value is parsed rather than asserted

- **WHEN** the load path is inspected
- **THEN** the value passes through schema validation rather than a type
  assertion

### Requirement: An unusable view setting is replaced, not preserved

Where a stored view setting cannot be used, it SHALL be replaced by the defaults
and overwritten by the next change the player makes. This is deliberately the
opposite of what stored progress requires: progress is the player's work and a
value that failed to parse is left untouched so it can be repaired, whereas a
sorted column is a preference that can be re-expressed in one click and that
nobody will ever recover by hand.

Loading SHALL NOT write. A load that failed SHALL leave the stored value alone
until the player changes a control, so that the write is a consequence of an
interaction and never of the application starting.

#### Scenario: A corrupt setting does not survive the next interaction

- **WHEN** the stored value is unusable and the player then changes a filter
- **THEN** the newly written value is a valid record of the current view, with
  nothing of the old one carried forward

#### Scenario: Loading does not write

- **WHEN** the application loads
- **THEN** the stored value is unchanged, whether the load succeeded or failed

#### Scenario: The first change is the first write

- **WHEN** the player changes a control for the first time in a session
- **THEN** that is when the stored value is written

### Requirement: Unavailable storage degrades to a usable session

Where local storage cannot be read or written — because it is disabled, full, or
throws in a private browsing mode — searching, sorting and filtering SHALL all
continue to work for the session. A storage failure SHALL NOT produce a blank
page, an error dialog or a lost interaction.

#### Scenario: A throwing read does not break the page

- **WHEN** reading from storage throws
- **THEN** the application renders the default view and every control works

#### Scenario: A throwing write does not break a control

- **WHEN** writing to storage throws
- **THEN** the filter still applies, the table still narrows, and no error
  surfaces to the player

#### Scenario: The failure is contained at the boundary

- **WHEN** the persistence module is inspected
- **THEN** storage access is guarded there rather than at each call site, so no
  component knows that storage can fail

### Requirement: One module owns every read and write of view settings

All access to stored view settings SHALL go through a single module, which SHALL be
the only place naming their storage key, and SHALL be plain functions independent
of the interface so its failure modes can be tested without rendering anything.
That module SHALL NOT be the module owning crafted progress: the two hold different
kinds of value under different recovery rules, and one module serving both would
have a write path that has to know which half of its payload may be discarded.

#### Scenario: No component reaches storage directly

- **WHEN** the modules under `src/` are inspected
- **THEN** only this module names the view settings key or calls the storage API
  for it

#### Scenario: The failure modes are testable without a DOM

- **WHEN** the module's tests are inspected
- **THEN** they exercise loading, saving, malformed data, an unrecognised choice
  and a throwing storage without rendering a component

#### Scenario: Progress keeps its own module

- **WHEN** the persistence modules are inspected
- **THEN** crafted progress and view settings are owned by different modules,
  each naming only its own key
