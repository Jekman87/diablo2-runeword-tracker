## MODIFIED Requirements

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

**The layer SHALL work where there is no browser.** The accessor SHALL be usable
in a render that has no `document`, no storage and no reader — the build's
prerender pass — and SHALL resolve to a locale stated by the caller rather than
detected. Detection stays the browser's path: stored preference first, then the
entry document's declared language. Where neither exists, the layer SHALL neither
throw nor guess.

Reading or writing a document attribute SHALL happen only where a document
exists, so the store's initialisation cannot be what breaks a render outside a
browser.

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

#### Scenario: The accessor resolves a stated locale outside a browser

- **WHEN** the layer is asked for the Russian record in a render with no
  `document` and no storage, having been told the locale is Russian
- **THEN** it returns the Russian record without touching a document attribute
  and without throwing

#### Scenario: The browser's own resolution is unchanged

- **WHEN** a reader loads either entry document
- **THEN** the locale is still their stored preference if they have one, else the
  document's declared language, else English
