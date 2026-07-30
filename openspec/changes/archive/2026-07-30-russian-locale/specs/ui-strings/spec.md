## ADDED Requirements

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
tiers, sockets, runewords, runes, ladder, patch and their kin — SHALL match the
official Russian game client's terms where the client has one, and SHALL NOT be
machine-translated. Copy the project itself authored, such as help prose and
empty-state messages, is project-authored Russian. Each game-derived term SHALL
carry a note of its source in the Russian record, so the sourcing is reviewable
rather than asserted.

#### Scenario: A game term matches the client

- **WHEN** a Russian string naming a game concept is reviewed against the
  official Russian client
- **THEN** the term is the client's own, or is explicitly flagged as having no
  client equivalent

#### Scenario: The sourcing is recorded

- **WHEN** the Russian record is inspected
- **THEN** game-derived terms carry source notes identifying where in the client
  the term appears

## REMOVED Requirements

### Requirement: One locale ships, and the seam is not more than a seam

**Reason**: This requirement existed to keep the seam empty "until a change
introduces another" locale. This is that change: the second locale, the switch
and the persisted preference it forbade are now required behaviour.

**Migration**: The two-locale contract is defined by "Two locales ship, and the
accessor selects between them" above. The switch control and the persisted
language preference are specified by the new `locale-selection` capability. The
prohibition on a third-party internationalisation dependency is carried forward
into the new requirement rather than dropped.
