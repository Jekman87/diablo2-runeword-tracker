# locale-selection Delta

## MODIFIED Requirements

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
