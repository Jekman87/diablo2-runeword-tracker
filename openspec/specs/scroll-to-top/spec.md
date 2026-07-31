# scroll-to-top Specification

## Purpose

A control that returns the reader to the top of a table thousands of pixels tall.

## Requirements

### Requirement: A control returns the reader to the top of a long page

The page SHALL offer a control that returns the reader to the top of the document.
The table is thousands of pixels tall at every viewport width, so the answer the
page exists to give — the progress band at the top — is otherwise reachable only by
scrolling back through the whole list.

The control SHALL be a real button, operable by pointer, touch and keyboard, and its
accessible name SHALL say what it does. It SHALL NOT be a link to a fragment, which
would put an entry in the reader's history for a scroll.

The control SHALL be absent until the page has scrolled past the header, and present
after. Its appearance SHALL be driven by the header's own position rather than by a
fixed pixel offset, so that a change to the header's height cannot leave the
threshold behind.

The control SHALL NOT obstruct any other control at any supported width. In
particular it SHALL NOT cover the transient undo notice, and it SHALL NOT cover a
row's crafted toggle.

Where the reader has asked for reduced motion, the return SHALL be immediate rather
than animated.

Its copy SHALL resolve through the display-copy layer in both locales.

#### Scenario: The control is absent at the top of the page

- **WHEN** the page is loaded and not scrolled
- **THEN** no back-to-top control is present

#### Scenario: The control appears once the header has gone

- **WHEN** the page is scrolled far enough that the header has left the viewport
- **THEN** the control is present

#### Scenario: The threshold follows the header rather than a number

- **WHEN** the header's height changes, as it does when the help disclosure is opened
  or when a locale's wording wraps to another line
- **THEN** the offset at which the control appears changes with it, because nothing
  restates that height as a constant

#### Scenario: Using it returns to the top

- **WHEN** the control is activated by pointer, by touch or from the keyboard
- **THEN** the document is scrolled to its top
- **AND** no history entry is added

#### Scenario: Reduced motion is honoured

- **WHEN** the reader has asked the platform for reduced motion
- **THEN** the return happens without animation

#### Scenario: It obstructs nothing

- **WHEN** the control is visible at the narrowest supported width, with the undo
  notice also visible
- **THEN** neither covers the other
- **AND** no row's crafted toggle is underneath it

#### Scenario: A reader who opened a panel keeps it in front

- **WHEN** a runeword's detail panel is open and overlaps the control's position
- **THEN** the panel is what is painted, because a panel the reader opened outranks a
  control that returns them somewhere
