# site-footer Specification

## Purpose

The page's closing furniture: copyright, a donation route the author can receive,
and the ornamental divider that mirrors the header.

## Requirements

### Requirement: The page closes with a footer

The page SHALL end with a footer that states who made it and in what year. The
footer SHALL be a `contentinfo` landmark, which means it SHALL be a sibling of the
main landmark rather than a descendant of it, since an element nested inside `main`
exposes no such landmark.

The footer SHALL be separated from the content above it by the same ornamental
divider the header closes with, so the page opens and closes on the same
decoration. The divider SHALL span the viewport as the header's does.

Every word of the footer SHALL resolve through the display-copy layer in both
locales. The site's own name and any URL the footer links to SHALL be application
constants rather than copy, because a name is the same string in every language and
a link's destination is not a translation.

The year SHALL be stated in a way that cannot silently go stale: either it is read
at load from the clock, or it is a constant that the quality gate can see. A year
hardcoded in copy, where a translator or a locale record can hold a different one
from its sibling, SHALL NOT be used.

#### Scenario: The footer is a landmark of its own

- **WHEN** the page's landmarks are inspected
- **THEN** a `contentinfo` landmark is present
- **AND** it is a sibling of the main landmark rather than inside it

#### Scenario: The page opens and closes on the same decoration

- **WHEN** the footer is compared with the header
- **THEN** both carry the ornamental divider, and both span the viewport with it

#### Scenario: The footer speaks the active language

- **WHEN** the locale is switched
- **THEN** every word of the footer changes with it
- **AND** the site's name and the year do not, because neither is a translation

#### Scenario: The year cannot disagree with itself between locales

- **WHEN** the footer's year is traced to its source
- **THEN** it comes from one place shared by both locales rather than from each
  locale's copy record

### Requirement: The footer offers a donation route the author can actually receive

The footer SHALL offer a way to send the author money, and the instrument SHALL be
one that reaches him where he is: a cryptocurrency receive address, because the card
processors and the hosted donation services this kind of page normally uses do not
operate for him.

The address SHALL be reachable as selectable text once the reader opens the
donation control, so it is reachable by selection alone. A control that copies it
to the clipboard MAY be offered in addition and SHALL be an accelerator rather than
the only route, since the clipboard is a permission that can be refused and an API
that can be absent.

Where a copy control is offered, its outcome SHALL be announced rather than shown
only by the control changing its own appearance, so that a reader who cannot see the
change still learns whether the copy happened.

The coin and network the address belongs to SHALL be stated beside it. An address
alone is ambiguous between networks, and a reader who sends on the wrong one loses
the money.

No third-party script, widget, iframe or image loaded from another origin SHALL be
used for this. The page makes no third-party requests by an existing requirement,
and a donation button is not a reason to start.

The value committed SHALL be a receive address and SHALL NOT be any form of secret.

#### Scenario: The address is reachable without the clipboard

- **WHEN** the donation dialog is open with clipboard access unavailable
- **THEN** the address is present as selectable text
- **AND** it states which coin and which network it is for

#### Scenario: Copying reports what happened

- **WHEN** the copy control is used
- **THEN** the outcome is announced to assistive technology
- **AND** the announcement does not depend on the control's own label changing

#### Scenario: Nothing is loaded from another origin

- **WHEN** the network requests the page makes are inspected
- **THEN** the footer has added none

#### Scenario: The committed value is not a secret

- **WHEN** the constant holding the donation value is read
- **THEN** it is a receive address, and no key or seed is present in the repository
