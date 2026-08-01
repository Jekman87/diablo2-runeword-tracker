# ui-strings Delta

## ADDED Requirements

### Requirement: Mark and unmark confirmation copy lives in the display-copy layer

The mark and unmark confirmation dialogs SHALL take every visible and accessible
string from the display-copy layer in the active locale: titles, body text naming
the runeword, Cancel, the confirm action label, and the remove action label. The
runeword's name inside those sentences SHALL be supplied as a parameter (the
locale projection), not authored as a fixed English name inside the layer. Undo
notice strings SHALL be removed with the undo notice.

#### Scenario: Both directions have localised copy

- **WHEN** the confirmation for marking and the confirmation for removing are
  rendered under English and under Russian
- **THEN** every word of each dialog comes from the active locale's record

#### Scenario: No undo strings remain

- **WHEN** the display-copy layer is inspected after the undo notice is removed
- **THEN** it defines no keys solely for that notice

### Requirement: Progress completion copy lives in the display-copy layer

The sentence shown when every runeword is crafted SHALL be resolved from the
display-copy layer in the active locale. It SHALL NOT be hardcoded in the progress
component. Russian wording for this sentence is project-authored (the game has no
equivalent UI line) and SHALL be noted as such in the Russian record.

#### Scenario: Both locales define the completion sentence

- **WHEN** progress is complete under English and under Russian
- **THEN** the completion sentence on the progress line comes from the active
  locale's record
