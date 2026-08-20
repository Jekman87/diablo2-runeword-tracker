## ADDED Requirements

### Requirement: A column heading's short form is display copy

Where a column heading has a short form for narrow viewports, that short form
SHALL live in the display-copy layer beside the full form, in every locale, rather
than being written into a component. Both forms SHALL exist for such a heading:
the short one does not replace the full one, because the full one is still what
the wide layout presents and still what the sort control is named after.

A locale missing a short form SHALL fail the type check and be named by it, which
is the property the strings layer already has and the reason the short form
belongs in it rather than beside the markup.

#### Scenario: Both forms resolve through the copy layer

- **WHEN** a heading with a short form is rendered
- **THEN** both its full and its short text come from the strings layer for the
  active locale, and neither is written into the component

#### Scenario: A missing short form fails the build

- **WHEN** a locale declares the full heading and not its short form
- **THEN** the type check fails and names the missing key

### Requirement: A short heading in Russian comes from the game or says it does not

The Russian short form of a column heading SHALL be the game's own abbreviation
where the client has one, verified the way every other piece of Russian game
vocabulary in this project is verified, with a note of where it was confirmed.
Where the client has no abbreviation for it, the short form is project copy and
SHALL be recorded as project copy rather than presented as the game's wording.
Machine translation is forbidden here as it is everywhere else.

#### Scenario: A short form taken from the client is sourced

- **WHEN** a Russian short heading matching the client's own abbreviation is added
- **THEN** its entry records where the wording was verified

#### Scenario: A short form the client does not have says so

- **WHEN** the client has no abbreviation for a heading and a short form is
  nevertheless needed
- **THEN** the entry states that the wording is this project's own, rather than
  citing a source it does not have
