## MODIFIED Requirements

### Requirement: Named colour tokens

The project SHALL declare its palette once as named theme tokens usable as
utility classes throughout the application, so that no component carries a
literal colour value. Token names SHALL describe the role a colour plays rather
than the colour itself, and SHALL cover the surfaces the backlog has already
settled: the page ground, body text, the table header band, the gold display
family a runeword's name is drawn from, the granted-property line and the
emphasised values within it, the ladder badge, and the crafted-state accent. They
SHALL further cover the surfaces the runeword table introduces: the separation
between table rows and the row's hover state, and the detail view's panel. They
SHALL further cover the surfaces crafted tracking introduces: the tint of a
crafted row, the unfilled track of the progress indicator, and the panel of the
transient undo notice. They SHALL further cover the surfaces the browsing controls
introduce: the search field, the resting and selected states of a filter control,
the indicator marking the sorted column, and the message shown when nothing
matches. They SHALL further cover the surface the remaining panels introduce: the
band of each panel's collapse control.

Where one badge is coloured by the value it carries, the palette SHALL declare one
token per distinct colour that value can take, so that the mapping lives in the
palette and the component holds none of it. Values the project has decided are one
era MAY share one token; a token SHALL NOT be declared for a value the project has
chosen no colour for.

A token SHALL be declared when a component exists that renders the surface it
names, and SHALL NOT be declared speculatively for a surface no decision has been
made about. A token whose last use site is removed SHALL be removed with it, for
the same reason. A change that renders a new surface SHALL add its token here
rather than write a colour into the component, which is what makes the palette a
single source rather than a starting point. Where a token is already declared
whose role is the one a new surface needs, the change rendering that surface SHALL
use it rather than declare a second token for the same role — which is also how a
token declared ahead of any use site is worked off rather than explained again.

Two roles MAY hold the same colour value where they are genuinely different roles;
one token SHALL NOT be made to serve two unrelated roles on the grounds that the
value matches, because the name would then describe neither.

Where a borrowed token's own name misdescribes what it is applied to, the role
SHALL be taken from the use site rather than from the name. A borrowed name that
misdescribes its own subject SHALL NOT be copied.

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

- **WHEN** the row separation, the row hover state and the detail view's panel are
  inspected
- **THEN** each takes its colour from a named token rather than a literal value

#### Scenario: Crafted tracking's own surfaces are tokens

- **WHEN** the crafted row's tint, the progress indicator's track and the undo
  notice's panel are inspected
- **THEN** each takes its colour from a named token rather than a literal value
- **AND** the indicator's filled portion reuses the crafted-state accent already
  declared, rather than adding a second token for the same role

#### Scenario: The browsing controls' surfaces are tokens already declared

- **WHEN** the search field, the filter controls, the sorted column's indicator and
  the empty-result message are inspected
- **THEN** each takes its colour from a named token rather than a literal value
- **AND** no token was declared for them, because the muted-dark and light-blood
  tokens already held exactly those roles with no use site

#### Scenario: The remaining panels' band is a token already declared

- **WHEN** the collapse control's band on the remaining-runes and remaining-bases
  panels is inspected
- **THEN** it takes its colour from the dark blood token rather than a literal
  value or a new declaration, because that token already held exactly this role
  with no use site
- **AND** the panels' bodies render on the page ground rather than borrowing the
  detail view's panel token, because those are different roles even where a value
  might suit both

#### Scenario: A surface with no component still has no token

- **WHEN** the token set is read for surfaces no component renders yet, such as
  the site header's patch line and links
- **THEN** no token exists for them beyond what is already declared, because the
  change that builds each one adds its own

#### Scenario: A token declared ahead of its use site is worked off, not explained

- **WHEN** the tokens declared with nothing rendering them are counted
- **THEN** one remains — the link colour — rather than the two before the
  remaining panels rendered the dark blood band
- **AND** that one is owed to `site-header`, so the count falls to zero when it
  lands

#### Scenario: A patch badge has one token per era

- **WHEN** the tokens backing the patch badge are read
- **THEN** there is one for each distinct colour a patch badge can take, and none
  for a patch value with no colour decided

#### Scenario: One era, one token

- **WHEN** the tokens for `1.10` and `1.11` are compared
- **THEN** they are one token, because the project treats those two patches as a
  single era rather than two

#### Scenario: The note badge stops borrowing the danger colour

- **WHEN** the note badge's background is inspected
- **THEN** it takes a token of its own rather than the token named for danger,
  because "the note badge" and "danger" are different roles even when their values
  are close

#### Scenario: A token with no remaining use site is removed

- **WHEN** a surface stops being rendered, as the detail view's dimmed backdrop
  does when the view stops being a modal dialog
- **THEN** its token is removed from the palette, because a token nothing renders
  is the same defect as a surface with no token

#### Scenario: Two roles may share a value without sharing a token

- **WHEN** the item-type restriction's colour and the detail view's note colour are
  compared
- **THEN** they may hold the same value under two names, because one is the colour
  of a restriction and the other is the colour of a note, and a single token would
  describe neither
