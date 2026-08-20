## MODIFIED Requirements

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
used for this. That prohibition SHALL stand on its own terms rather than resting on
a claim about the whole page: the page now carries one cookieless counter, and a
donation control is a different proposition entirely — it would load an identified
third party's interface into the page, on the one surface where a reader is about
to move money and has to be able to see who is asking.

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
- **THEN** the footer has added none, and the only cross-origin request the page
  makes at all is the page-view counter declared elsewhere

#### Scenario: The committed value is not a secret

- **WHEN** the constant holding the donation value is read
- **THEN** it is a receive address, and no key or seed is present in the repository
