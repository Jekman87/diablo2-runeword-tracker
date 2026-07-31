# runeword-table Delta Specification

## ADDED Requirements

### Requirement: The detail panel centres the properties it lists

The granted-property lines in the detail panel SHALL be centred, as the game centres
them in the item tooltip this panel reproduces.

Centring SHALL apply to the property lines alone. The runeword's name, the labelled
values beside it — its runes, its sockets, the level it requires — and its note SHALL
stay left-aligned, because those are the structure this panel adds and the game's
tooltip has no equivalent for them.

Where a runeword's properties are divided into labelled groups, a group's heading
SHALL be centred with the lines it introduces, so that a heading never sits at one
edge above centred text.

#### Scenario: Property lines are centred

- **WHEN** a runeword's detail panel is opened
- **THEN** its granted-property lines are centred within the panel

#### Scenario: The panel's own structure stays left-aligned

- **WHEN** the same panel's name, labelled values and note are inspected
- **THEN** each is still left-aligned

#### Scenario: A group heading follows its group

- **WHEN** a runeword whose properties are split into two labelled groups is opened
- **THEN** each heading is centred with the lines beneath it
