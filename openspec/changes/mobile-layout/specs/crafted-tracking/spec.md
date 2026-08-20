## MODIFIED Requirements

### Requirement: Every runeword can be marked crafted

The table SHALL present a crafted-state control on every runeword's row. From the
narrow-viewport breakpoint up, that control SHALL occupy its own leading column
with its own column header, so that the state is a property of the row that later
changes can sort on rather than an ornament attached to the name. The control
SHALL be a real button carrying its pressed state, so that it is reachable by Tab
and operable by Space and Enter without a pointer. Activating the control SHALL
open the mark or unmark confirmation rather than applying the change immediately;
confirming that dialog SHALL change the crafted state.

Below the breakpoint the leading column SHALL be withdrawn from view, because the
row already states its crafted state without it — by its accent border and its
tint, which `A crafted row is distinguishable without colour` requires — and a
pointer press anywhere on the row already opens the confirmation. The column is
worth more as width to the columns a player reads than as a third statement of
something already said twice.

**The control itself SHALL survive that withdrawal.** Each row SHALL still carry
one crafted-state button, in the tab order, with its pressed state and its
accessible name intact, because it is the only path to marking a runeword without
a pointer and a narrow viewport is not only a phone — a desktop window narrowed
below the breakpoint is the same viewport. A control withdrawn from view SHALL
become visible when it takes keyboard focus, and SHALL take no width from the row
while it is not focused.

#### Scenario: Every row carries a control

- **WHEN** the table is rendered
- **THEN** each of the 99 rows presents one crafted-state control

#### Scenario: The control is a button with a pressed state

- **WHEN** a row's crafted-state control is inspected
- **THEN** it is a button whose pressed state states whether the runeword is
  crafted

#### Scenario: The control is operable by keyboard alone

- **WHEN** a crafted-state control receives keyboard focus and is activated by
  keyboard, and the resulting confirmation is accepted
- **THEN** the runeword's crafted state changes

#### Scenario: The state is its own column above the breakpoint

- **WHEN** the table's columns are inspected at or above the breakpoint
- **THEN** crafted state occupies a leading column with a column header of its
  own, so that a later change can make that header a sort control

#### Scenario: The column is withdrawn below the breakpoint

- **WHEN** the table is rendered on a narrow viewport
- **THEN** the crafted column's header is not perceivable and the column takes no
  width from the row

#### Scenario: The keyboard path survives the withdrawal

- **WHEN** the page is traversed by Tab on a narrow viewport
- **THEN** each row's crafted-state button is still reachable, still reports its
  pressed state, and still opens the confirmation when activated

#### Scenario: A withdrawn control is visible while focused

- **WHEN** a crafted-state control on a narrow viewport receives keyboard focus
- **THEN** it is visible

#### Scenario: Confirming mark then confirming remove returns to the starting state

- **WHEN** an uncrafted runeword is confirmed marked and then confirmed unmarked
- **THEN** the runeword is back in the state it started in
