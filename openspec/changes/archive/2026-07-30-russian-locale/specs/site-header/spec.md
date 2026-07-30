## ADDED Requirements

### Requirement: The header carries the language switch

The header SHALL offer the language switch on the title's own line, beside the
help control and the feedback link. The switch SHALL be a control and not a
link, so the rule that the header carries exactly two links stands. Each of its
two options SHALL be labelled in its own language, so a reader who cannot read
the active language can still find the way out of it, and the option labels
SHALL resolve through the display-copy layer like all display text. The control
SHALL expose which language is active to assistive technology as state, not
through colour alone. Adding the switch SHALL NOT disturb the header's existing
guarantees: the banner landmark, the two-link rule, and the layout below the
ornamental divider.

#### Scenario: The switch shares the title line

- **WHEN** the header is rendered
- **THEN** the language switch sits on the title's line with the help control
  and the feedback link, and the help panel still opens beneath them

#### Scenario: Each option is legible in its own language

- **WHEN** the switch's options are inspected
- **THEN** each is labelled in the language it selects, and each label resolves
  through the display-copy layer rather than being a component literal

#### Scenario: The active language is reported as state

- **WHEN** the switch is inspected with the interface in Russian
- **THEN** the Russian option exposes its active state to assistive technology,
  and the distinction is not carried by colour alone

#### Scenario: The two-link rule is undisturbed

- **WHEN** the header's links are inspected after the switch is added
- **THEN** there are still exactly two: the patch value and Feedback — the
  switch is a control, not a third link

#### Scenario: Nothing below the divider moves

- **WHEN** the layout below the ornamental divider is compared with the
  previous build, in either language
- **THEN** the progress band, the remaining panels, the controls and the table
  are in the same order at the same widths
