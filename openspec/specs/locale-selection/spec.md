# locale-selection Specification

## Purpose

The language-selection contract — that the interface offers exactly two
languages, English and Russian; that a switch takes effect immediately in
display copy and dataset text alike, without a reload; that English is the
default and the only way into Russian is the switch; that an explicitly chosen
language persists under its own namespaced versioned key, is validated on the
way back in, and degrades to a session choice when storage is unavailable; and
that one module owns the preference's read and write.

## Requirements

### Requirement: The interface language can be switched between Russian and English

The interface SHALL offer exactly two languages, Russian and English, and
switching SHALL take effect immediately without a page reload — in every piece of
display copy and in dataset text alike. Dataset text — runeword names, rune
names, base item categories, granted properties, restrictions and notes — SHALL
render in the active language, which is what `localised-dataset-text` specifies
in full; this requirement's part is only that a switch reaches it as immediately
as it reaches copy.

#### Scenario: Switching to Russian localises the copy

- **WHEN** the player activates the Russian option
- **THEN** every label, heading, control name, message and accessible name that
  is display copy renders in Russian, without a page reload

#### Scenario: Switching to Russian localises the dataset text too

- **WHEN** the interface is in Russian
- **THEN** runeword names, rune names, base item categories, granted properties,
  restrictions and notes render in Russian, without a page reload

#### Scenario: Switching back restores English

- **WHEN** the player activates the English option from a Russian interface
- **THEN** every piece of display copy and every piece of dataset text renders in
  English again

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

### Requirement: The chosen language survives a reload under its own namespaced versioned key

An explicitly chosen language SHALL be written to the browser's local storage
when the player switches, and read back when the application loads, under a key
that is namespaced to this project, carries a format version, and is distinct
from the keys holding crafted progress and view settings. The restored language
SHALL be in effect on the first paint, with no frame of the other language
before it. Nothing SHALL be sent anywhere else.

#### Scenario: The choice survives a reload

- **WHEN** the player switches to Russian and reloads the application
- **THEN** the interface renders in Russian

#### Scenario: The restored language is the first thing rendered

- **WHEN** the application loads with a stored preference
- **THEN** the first paint is already in that language, with no flash of the
  default

#### Scenario: The key stands alone

- **WHEN** the storage keys are inspected
- **THEN** the language preference occupies its own project-namespaced,
  versioned key, distinct from the crafted-progress and view-settings keys, and
  writing it never rewrites the others

### Requirement: A stored preference is validated, and an unusable one is replaced

The stored value SHALL be validated with the project's schema validator before
use, accepting only a language this version offers. A value that is malformed,
of the wrong shape, or naming an unknown language SHALL be treated as no
preference — the English default applies — and SHALL be overwritten by the
player's next explicit switch. Loading SHALL NOT write: a failed load
leaves the stored value alone until the player switches, so a write is always
the consequence of an interaction.

#### Scenario: Malformed JSON is survived

- **WHEN** the stored value is not valid JSON
- **THEN** the application loads in English and remains fully usable

#### Scenario: An unknown language is rejected

- **WHEN** the stored value names a language this version does not offer
- **THEN** the whole value is rejected and the English default applies

#### Scenario: Loading does not write

- **WHEN** the application loads
- **THEN** the stored value is unchanged, whether the load succeeded or failed

#### Scenario: The next switch overwrites the wreckage

- **WHEN** the stored value is unusable and the player then switches language
- **THEN** the newly written value is a valid record of the chosen language,
  with nothing of the old one carried forward

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

### Requirement: Unavailable storage degrades to a session choice

Where local storage cannot be read or written, the language switch SHALL keep
working for the session: the interface changes language, no error surfaces, and
the choice is simply not remembered. A storage failure SHALL NOT produce a
blank page, an error dialog or a lost interaction, and SHALL be contained in
the persistence module rather than handled at call sites.

#### Scenario: A throwing read does not break the page

- **WHEN** reading the preference from storage throws
- **THEN** the application renders in English and the switch works

#### Scenario: A throwing write does not break the switch

- **WHEN** writing the preference to storage throws
- **THEN** the interface still changes language and no error surfaces to the
  player

### Requirement: One module owns the read and write of the language preference

All access to the stored language preference SHALL go through a single module,
which SHALL be the only place naming its storage key, and whose load and save
paths SHALL be plain functions testable without rendering anything. That module
SHALL NOT be the module owning crafted progress or the one owning view
settings, for the reason those two are already separate: different kinds of
value, different keys, no write path that has to know which half of a payload
may be discarded.

#### Scenario: No component reaches storage directly

- **WHEN** the modules under `src/` are inspected
- **THEN** only this module names the language-preference key or calls the
  storage API for it

#### Scenario: The failure modes are testable without a DOM

- **WHEN** the module's tests are inspected
- **THEN** they exercise loading, saving, malformed data, an unknown language
  and a throwing storage without rendering a component
