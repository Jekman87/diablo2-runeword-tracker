# ui-strings Delta

## MODIFIED Requirements

### Requirement: Canonical names are identifiers, not display copy

Runeword names, rune names and base item category names SHALL be treated as
canonical English identifiers taken from the dataset, and SHALL NOT pass through
the display-copy layer. Game text carried by the dataset — granted properties,
restrictions and notes — is likewise data rather than copy. Localised forms of
dataset text SHALL live in the dataset as labels beside the canonical text and
SHALL render through the dataset's own locale projection, never through the
display-copy layer. This boundary keeps the layer to strings the project itself
authors, so that neither locale requires restating the dataset inside it.

#### Scenario: A runeword name is rendered from the dataset

- **WHEN** a runeword's name is rendered under either locale
- **THEN** the value came from the dataset record — the canonical name or its
  Russian label — not from the display-copy layer

#### Scenario: The layer holds no game data

- **WHEN** the display-copy layer is inspected
- **THEN** it contains no runeword name, rune name, item category, property line,
  restriction or note, in either language

#### Scenario: A rune's accessible label comes from the dataset

- **WHEN** a rune icon's accessible label is inspected
- **THEN** it is the rune's projected label from the dataset — canonical under
  English, the Russian label under Russian — which is why it does not go
  through the layer

### Requirement: Game vocabulary in Russian copy comes from the game

Words in the Russian copy that name game concepts — equipment slots, rune
tiers, sockets, runewords, runes, ladder, patch and their kin — SHALL be the
official Russian localisation's own terms, and SHALL NOT be machine-translated.

The client's text is reachable in two forms and both count as the game: a
community transcription of it, and a reading of the running client. Where the
two disagree the client's reading SHALL win, because a transcription can carry
a typo and one does. Where neither covers a term — records newer than the
transcription — other Russian community sources MAY be used, and the entry
SHALL say so.

A concept the game does not name at all SHALL be project-authored Russian and
SHALL say so rather than claim a source: this project's own groupings, such as
the off-hand slot and the missile-weapon slot, have no term in the client to
take. Copy the project itself authored, such as help prose and empty-state
messages, is project-authored Russian for the same reason.

Each game-derived term SHALL carry a note of where its wording was verified, so
the sourcing is reviewable rather than asserted, and a term whose sources
disagree SHALL record the disagreement and the choice made. No term SHALL
remain flagged for review: the terms the Russian record marked `[REVIEW]` at its
introduction — the slot names, «патч», «Основы» and the ladder marker among them
— are verified under this rule, corrected where the sources contradict them, and
unflagged.

#### Scenario: A game term is the game's own

- **WHEN** a Russian string naming a game concept is reviewed against the
  client's text
- **THEN** the term is the client's own, or its note records why it is not and
  what was used instead

#### Scenario: The client outranks a transcription of it

- **WHEN** a transcription of the client's text and a reading of the client
  disagree on a term
- **THEN** the reading of the client is what ships, and the note records the
  transcription's differing wording

#### Scenario: A concept the game does not name is authored and says so

- **WHEN** a Russian string names one of this project's own groupings, for which
  the client has no term
- **THEN** it is project-authored Russian and its note says so, rather than
  citing a source that does not carry it

#### Scenario: The sourcing is recorded

- **WHEN** the Russian record is inspected
- **THEN** game-derived terms carry source notes identifying where the term was
  verified

#### Scenario: No review flag survives

- **WHEN** the Russian record is inspected
- **THEN** no string carries a `[REVIEW]` flag, because every flagged term has
  been verified, corrected where needed, and unflagged
