# ui-strings Specification

## Purpose

The display-copy contract — that every user-facing string resolves through
one layer rather than being written into a component, that canonical runeword
and rune names are identifiers and not display copy, that dataset text and its
localised forms live in the dataset and render through its own locale
projection rather than through this layer, and that adding a second locale does
not require editing the components that read the first.

## Requirements

### Requirement: Display copy resolves through one layer

Every user-facing string the interface renders SHALL be resolved from a single
display-copy layer rather than written into the component that renders it. A
component SHALL NOT contain a literal it displays to the reader, including the text
of labels, headings, column titles, button names, accessible names and tooltips.

#### Scenario: Components carry no display literals

- **WHEN** the components under `src/` are inspected
- **THEN** none contains a literal string that reaches the reader as display copy

#### Scenario: A component obtains its copy from the layer

- **WHEN** a component renders a label
- **THEN** the text came from the display-copy layer

#### Scenario: Accessible names go through the layer too

- **WHEN** an element's accessible name is display copy rather than a canonical
  identifier
- **THEN** it is resolved from the layer like any visible text, because a screen
  reader's reading of the page is part of the interface and not an exception to it

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

### Requirement: Adding a locale does not require editing components

The layer SHALL be reached through a single accessor that components call, so that
introducing a second locale changes the layer and not its consumers. Every key
present for one locale SHALL be required for every other, enforced by the type
system rather than by review, so that a missing translation is a build failure and
not a stray English word in a Russian interface.

#### Scenario: A second locale is added without touching a component

- **WHEN** a second locale's strings are introduced
- **THEN** no component that renders copy needs to be modified for it to take
  effect

#### Scenario: An incomplete locale fails the build

- **WHEN** a locale omits a key that another locale defines
- **THEN** `pnpm typecheck` fails and names the missing key

#### Scenario: A key with no definition fails the build

- **WHEN** a component asks the layer for a key no locale defines
- **THEN** `pnpm typecheck` fails, rather than the interface rendering the key name
  or an empty string

### Requirement: Two locales ship, and the accessor selects between them

The layer SHALL ship exactly two locales, English and Russian, with the Russian
record typed against the English one so that the completeness guarantee holds in
both directions. The accessor SHALL return the active locale's record, and a
change of active locale SHALL take effect in every rendered string without any
copy-consuming component being edited and without the page reloading. The layer
SHALL still NOT adopt a third-party internationalisation dependency: grammar a
locale requires — Russian plural forms among it — SHALL be implemented inside
that locale's own value functions, so each record carries its own language's
rules and no shared machinery exists for a rule only one of them has.

#### Scenario: Both locales are present and complete

- **WHEN** the layer is inspected
- **THEN** exactly two locale records are defined, English and Russian, and each
  defines every key the other does, enforced by `pnpm typecheck`

#### Scenario: A switch reaches every string without a reload

- **WHEN** the active locale changes from English to Russian
- **THEN** every rendered piece of display copy is presented in Russian, without
  a page reload and without any copy-consuming component having been modified to
  make that possible

#### Scenario: Russian plural forms are correct

- **WHEN** a count-bearing string is rendered in Russian with counts that select
  different Russian plural forms, such as 1, 2 and 5
- **THEN** each count renders with the grammatically correct form, produced by
  the Russian record's own value function rather than by shared plural machinery

#### Scenario: No internationalisation library is added

- **WHEN** the project's dependencies are inspected
- **THEN** none is an internationalisation framework

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
