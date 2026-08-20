## MODIFIED Requirements

### Requirement: Availability metadata is decoration only

A runeword MAY carry the patch that introduced it and a free-form note. These
fields exist to render badges. No filter, counter or branch in application logic
SHALL read them, because availability changes between ladder seasons and a rule
expressed as logic would silently miscount progress, whereas a stale badge is
only a cosmetic inaccuracy.

The dataset SHALL NOT carry a ladder-only flag. Patch 3.3 released the last
eight ladder-only runewords into Non-Ladder, and the restriction that outlived
it belongs to Lord of Destruction — not to the game mode this tracker mirrors,
whose Chronicle is a Reign of the Warlock feature. A boolean that no record sets
and no badge can render is not decoration but dead weight, so the field leaves
the schema rather than shipping as a uniform `false`. Where a future patch
introduces ladder-only runewords again, the vendor snapshot still carries its
own flag to derive one from.

#### Scenario: No record carries a ladder-only flag

- **WHEN** any runeword record is read
- **THEN** the only availability fields present are the patch and the note
- **AND** the emitted JSON contains no ladder key on any of the 99 records

#### Scenario: Patch is absent on the original runewords

- **WHEN** the patch field is inspected across the dataset
- **THEN** 74 records carry a patch value and the 25 that predate patch tracking
  carry none, which is a property of the data rather than a gap in it

#### Scenario: A season caveat is data, not logic

- **WHEN** the `Mosaic` record is read
- **THEN** it carries patch `2.6` and a note recording that it is disabled on
  ladder and craftable offline non-ladder
- **AND** that note is the only place any ladder restriction is stated anywhere
  in the dataset, as free text rather than as a flag, because a caveat that
  changes between seasons is prose the owner edits and not a field logic reads

#### Scenario: The progress denominator ignores availability

- **WHEN** the total against which progress is measured is derived from the
  dataset
- **THEN** it is 99 — no availability field reduces it
