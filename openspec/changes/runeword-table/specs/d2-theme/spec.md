## MODIFIED Requirements

### Requirement: Named colour tokens

The project SHALL declare its palette once as named theme tokens usable as
utility classes throughout the application, so that no component carries a
literal colour value. Token names SHALL describe the role a colour plays rather
than the colour itself, and SHALL cover the surfaces the backlog has already
settled: the page ground, body text, the table header band, the gold display
family a runeword's name is drawn from, the granted-property line and the
emphasised values within it, the patch and ladder badges, and the crafted-state
accent. They SHALL further cover the surfaces the runeword table introduces: the
separation between table rows and the row's hover state, and the detail view's
panel and the dimmed backdrop behind it.

A token SHALL be declared when a component exists that renders the surface it
names, and SHALL NOT be declared speculatively for a surface no decision has been
made about. A change that renders a new surface SHALL add its token here rather
than write a colour into the component, which is what makes the palette a single
source rather than a starting point.

Where a borrowed token's own name misdescribes what it is applied to, the role
SHALL be taken from the use site rather than from the name.

#### Scenario: Tokens are available as utilities

- **WHEN** a component applies a theme token through a utility class
- **THEN** the declared colour is present in both the dev server and the built
  stylesheet

#### Scenario: No component hardcodes a colour

- **WHEN** the styles of every module under `src/` are inspected
- **THEN** none carries a literal colour value in place of a token

#### Scenario: Token names state their role

- **WHEN** the token set is read
- **THEN** each name identifies what the colour is for, so a component reading it
  states its intent rather than a coincidence of hue

#### Scenario: A role is taken from the use site, not from a borrowed name

- **WHEN** a colour is adopted from the reference whose declared name does not
  match the element it is applied to
- **THEN** the token is named for what it actually styles
- **AND** no token implies a role the reference never renders, so a component
  cannot apply the wrong one and have it look deliberate

#### Scenario: The table's own surfaces are tokens

- **WHEN** the row separation, the row hover state, the detail view's panel and
  its backdrop are inspected
- **THEN** each takes its colour from a named token rather than a literal value

#### Scenario: A surface with no component still has no token

- **WHEN** the token set is read for surfaces no component renders yet, such as
  the undo toast or the collapsible panels
- **THEN** no token exists for them, because the change that builds each one adds
  its own
