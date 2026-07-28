# ui-strings Specification

## Purpose

The display-copy contract — that every user-facing string resolves through
one layer rather than being written into a component, that canonical runeword
and rune names are identifiers and not display copy, and that adding a second
locale does not require editing the components that read the first.

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
restrictions and notes — is likewise data rather than copy. This boundary keeps the
layer to strings the project itself authors, so that adding a locale does not
require restating the dataset inside it.

#### Scenario: A runeword name is rendered from the dataset

- **WHEN** a runeword's name is rendered
- **THEN** the value came from the dataset record, not from the display-copy layer

#### Scenario: The layer holds no game data

- **WHEN** the display-copy layer is inspected
- **THEN** it contains no runeword name, rune name, item category, property line,
  restriction or note

#### Scenario: A rune's accessible label is its identifier

- **WHEN** a rune icon's accessible label is inspected
- **THEN** it is the rune's canonical name from the dataset, which is why it does
  not go through the layer

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

### Requirement: One locale ships, and the seam is not more than a seam

The layer SHALL ship exactly one locale, English, until a change introduces
another. It SHALL NOT carry a locale switch, a persisted language preference,
plural or gender machinery, message interpolation beyond what the interface
actually renders, or a third-party internationalisation dependency, because no
requirement calls for any of them yet and unused mechanism is harder to remove than
to add.

#### Scenario: English is the only locale present

- **WHEN** the layer is inspected
- **THEN** exactly one locale is defined

#### Scenario: No language switch exists yet

- **WHEN** the interface is inspected
- **THEN** it offers no control for changing language, and no language preference
  is persisted

#### Scenario: No internationalisation library is added

- **WHEN** the project's dependencies are inspected
- **THEN** none is an internationalisation framework
