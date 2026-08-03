# locale-selection Delta

## MODIFIED Requirements

### Requirement: A first visit is English

Where no language preference is stored, the interface SHALL open in the
language of the entry document: English at the root, Russian at the `/ru/`
entry, read from the static document's own `lang` attribute. There SHALL be no
browser-language detection — the document's language is the publisher's
declaration, not a guess about the reader — so the first paint of a given
entry is the same in every environment. A first visit SHALL NOT write a
preference, and entering through `/ru/` SHALL NOT redirect or rewrite the
address: the two entries are two front doors to one page, not two pages.

#### Scenario: A first visit opens in English

- **WHEN** the application loads at the root entry with no stored preference
- **THEN** the interface renders in English, regardless of the browser's
  reported language

#### Scenario: A first visit at /ru/ opens in Russian

- **WHEN** the application loads at the `/ru/` entry with no stored preference
- **THEN** the interface renders in Russian, regardless of the browser's
  reported language, and the address is not rewritten

#### Scenario: A stored preference outranks the entry

- **WHEN** a player whose stored preference is English opens the `/ru/` entry
- **THEN** the interface renders in English — the explicit choice wins over
  the door it was entered through

#### Scenario: A first visit writes nothing

- **WHEN** the application loads with no stored preference, at either entry
- **THEN** no language preference is written to storage

### Requirement: The document language follows the active locale

The document's language attribute SHALL state the language the interface is
rendered in, both on load and after every switch, so assistive technology
applies the right pronunciation rules. Each static document SHALL declare its
own language as its pre-script default: English at the root entry, Russian at
the `/ru/` entry.

#### Scenario: A Russian interface declares itself

- **WHEN** the interface renders in Russian
- **THEN** the document's root language attribute is `ru`

#### Scenario: A switch updates the attribute

- **WHEN** the player switches language
- **THEN** the document's root language attribute changes with the interface,
  without a reload

#### Scenario: Each entry declares its own language before scripting

- **WHEN** either static document is read without executing scripts
- **THEN** the root entry declares `lang="en"` and the `/ru/` entry declares
  `lang="ru"`
