## MODIFIED Requirements

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
