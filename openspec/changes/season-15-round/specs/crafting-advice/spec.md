## ADDED Requirements

### Requirement: Advice prose states no availability the record does not carry

Authored advice prose SHALL NOT claim that a runeword is ladder-only,
non-ladder, seasonal or otherwise restricted by game mode unless that runeword's
own note states the same restriction. This holds for the English paragraphs, the
Russian paragraphs and the entry's review note alike.

Availability is dataset decoration precisely because it flips between seasons. A
sentence of prose that asserts a restriction with no field behind it acquires
exactly the staleness the badge design exists to avoid — in two languages, in a
place no test can see — which is what happened to eight runewords between the
season the advice was written in and the season after it. Where the restriction
does live in the record's note, prose and note move together when the owner
edits the record, so restating it there is safe and often useful: a crafter
reading `Mosaic`'s market advice needs to know where it may legally be made.

Prose that would otherwise reach for availability SHALL speak about the craft,
the base and the market instead.

#### Scenario: No entry invents a restriction

- **WHEN** every authored advice entry whose runeword carries no note is
  searched — in English, in Russian and in its review note — for a claim that
  the runeword is ladder-only or needs a ladder character
- **THEN** none is found

#### Scenario: A restriction the note carries may be restated

- **WHEN** the advice for `Mosaic` is read beside `Mosaic`'s note
- **THEN** the prose may state the same restriction the note states, because the
  two are edited as one record and cannot drift apart

#### Scenario: The rule survives the next season

- **WHEN** a patch changes which runewords are ladder-only
- **THEN** correcting the dataset's notes is sufficient, and no advice paragraph
  in either language is left asserting the old availability
