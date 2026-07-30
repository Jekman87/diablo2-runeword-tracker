# localised-dataset-text Delta

## ADDED Requirements

### Requirement: Dataset text renders in the active locale

Dataset text — runeword names, rune names, base item category names, item-type
restrictions, property lines and notes — SHALL render in the active locale's
language. With the Russian locale active, a translated record SHALL present its
Russian labels only, with no English shown alongside, so the page shows
strictly one language on screen. Not one Latin letter SHALL render in Russian
dataset text. Switching locale SHALL re-present every piece of dataset text
without a reload, exactly as it already does for display copy.

This requirement outranks quoting the game verbatim, and one case makes the
ranking matter: the client's per-level formulas leave the character-level
variable in Latin (`+(2*clvl) к защите`). Those lines SHALL render it in
Cyrillic instead. It is the only place the Russian dataset text departs from the
official localisation, and it SHALL be recorded as a deliberate departure rather
than presented as the game's wording.

#### Scenario: No Latin letter renders under the Russian locale

- **WHEN** every shipped record's dataset text is read under the Russian locale
- **THEN** none of it contains a Latin letter, property lines included

#### Scenario: A row renders in Russian under the Russian locale

- **WHEN** the Russian locale is active and a translated runeword's row is read
- **THEN** its name, base item categories and restriction are presented in
  Russian, and no English form of them is presented beside the Russian

#### Scenario: The detail view renders in Russian under the Russian locale

- **WHEN** the Russian locale is active and a translated runeword's detail view
  is opened
- **THEN** its name, rune labels, categories, restriction, property lines and
  note are presented in Russian

#### Scenario: Switching back to English restores the canonical text

- **WHEN** the active locale changes from Russian to English
- **THEN** every piece of dataset text is presented in its canonical English
  form, without a page reload

#### Scenario: A Russian property line keeps its value emphasis

- **WHEN** a Russian property line containing a numeric value is rendered
- **THEN** the numeric value carries the same emphasis treatment as in English
  lines, and the rendered characters round-trip the source line exactly

### Requirement: An untranslated record falls back to English as a whole

A runeword record that carries no Russian variant SHALL render entirely in
English under the Russian locale — name, categories, restriction, rune labels,
property lines and note alike — so that no row or detail view mixes the two
languages. The fallback SHALL be per record and SHALL NOT be per field.

#### Scenario: A fallback row is all English

- **WHEN** the Russian locale is active and a record without a Russian variant
  is presented
- **THEN** every piece of that record's dataset text — including its category
  names and rune labels, which are translated in the reference data — is
  presented in English

#### Scenario: No shipped record falls back

- **WHEN** the shipped dataset is rendered under the Russian locale
- **THEN** no row falls back, because every record carries a complete Russian
  variant

### Requirement: One projection feeds rendering, search and sort

The locale's view of a record — its displayed name, categories, restriction and
labels — SHALL be produced by a single projection that rendering, search
matching and sort comparison all read, so that what is matched and what is
ordered is exactly what is shown, by construction rather than by three
implementations agreeing.

#### Scenario: Search and the rows agree

- **WHEN** a query is typed under either locale
- **THEN** the rows presented are exactly those whose projected text matches,
  which is the text those rows render

#### Scenario: Sort and the columns agree

- **WHEN** the table is sorted by name or by base items under either locale
- **THEN** the order follows the text the column presents in that locale

### Requirement: Canonical names remain the identifiers under every locale

Localisation SHALL be presentation only. Crafted progress SHALL continue to be
stored as canonical English runeword names regardless of the active locale;
rune sprite lookup and the category-to-slot mapping SHALL continue to key on
canonical names; and the future CSV export/import format SHALL use canonical
English names, independent of the locale active when it runs. A rune icon's
accessible label SHALL be the projected rune label, because a label read aloud
is presentation, while its sprite key remains the canonical name.

#### Scenario: Crafting under the Russian locale stores the English name

- **WHEN** a runeword is marked crafted while the Russian locale is active
- **THEN** the name written to storage is the canonical English name

#### Scenario: Switching locale changes no progress

- **WHEN** the active locale changes in either direction
- **THEN** the crafted set, the progress indicator and stored progress are
  unchanged

#### Scenario: A rune icon localises its label but not its sprite

- **WHEN** a rune icon is rendered under the Russian locale
- **THEN** its accessible label is the Russian rune label and its sprite is
  resolved by the canonical rune name

#### Scenario: The slot filter is unaffected by locale

- **WHEN** a slot is selected under the Russian locale
- **THEN** the rows presented are the same set as under English, because the
  mapping reads canonical category names
