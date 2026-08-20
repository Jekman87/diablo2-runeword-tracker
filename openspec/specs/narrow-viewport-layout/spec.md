# narrow-viewport-layout Specification

## Purpose

The width budget the page holds itself to: a stated minimum supported
viewport, no sideways scroll at or above it, and the rule that none of what
a narrow viewport needs reaches the layout above the breakpoint.

## Requirements

### Requirement: A stated minimum supported viewport width

The page SHALL support viewports of 390 CSS pixels and wider. At any supported
width the document SHALL NOT scroll sideways: the width of the document SHALL NOT
exceed the width of the viewport, and no element SHALL extend past either edge of
it.

390px is the width of the phone the page is most likely to be opened on, and it is
stated rather than implied so that a later change has a number to measure against
instead of an opinion. Below it the page degrades rather than being supported; no
requirement here covers it.

The page SHALL hold to this at every state a reader can put it in — with the
remaining panel open, with the help panel open, with the table narrowed to nothing
by a search query, and in either locale — because a width budget that only holds
in the first state is not a budget.

#### Scenario: The page fits the minimum supported width

- **WHEN** the page is rendered at a 390px viewport
- **THEN** the document is no wider than the viewport and nothing scrolls sideways

#### Scenario: Every wider viewport also fits

- **WHEN** the page is rendered at viewports between the minimum and the width at
  which the layout is already known to fit
- **THEN** none of them scrolls sideways

#### Scenario: An opened panel does not break the budget

- **WHEN** the remaining panel and the help panel are opened at the minimum
  supported width
- **THEN** the document is still no wider than the viewport

#### Scenario: The budget holds in both locales

- **WHEN** the page is rendered at the minimum supported width under the Russian
  locale
- **THEN** the document is still no wider than the viewport

### Requirement: Narrow-viewport adaptations are expressed in the stylesheet

Every adaptation this capability makes SHALL be expressed as a stylesheet rule
rather than by measuring the viewport in application code, so that the layout does
not depend on script having run and there is no width at which the wrong layout is
painted first and corrected afterwards.

Where an adaptation needs the breakpoint in hand-written CSS rather than as a
utility variant, the breakpoint's value SHALL be stated once, at that one rule,
because there is no configuration file to import it from.

#### Scenario: No component measures the viewport

- **WHEN** the components that change presentation with width are inspected
- **THEN** none of them reads the viewport's width, and each expresses the change
  as a class or a rule the stylesheet resolves

#### Scenario: The breakpoint is not restated across files

- **WHEN** hand-written media queries in the stylesheet are inspected
- **THEN** the breakpoint's value appears in one place, and every other use site
  reaches it through the utility variant

### Requirement: The supported layout above the breakpoint is unchanged

An adaptation made for a narrow viewport SHALL NOT change the layout at or above
the breakpoint. The table's width, its column widths, its row height and the
document's height at a desktop viewport SHALL be the same after such a change as
before it.

This is stated as a requirement because it is the one property of a
narrow-viewport change that cannot be established by reading the diff: a rule
written without its breakpoint guard looks correct and applies everywhere.

#### Scenario: The desktop table does not move

- **WHEN** the table is measured at a desktop viewport before and after a
  narrow-viewport adaptation
- **THEN** its overall width, each of its column widths and its median row height
  are unchanged

#### Scenario: The desktop document does not change length

- **WHEN** the document's height is measured at a desktop viewport before and
  after a narrow-viewport adaptation
- **THEN** it is unchanged
