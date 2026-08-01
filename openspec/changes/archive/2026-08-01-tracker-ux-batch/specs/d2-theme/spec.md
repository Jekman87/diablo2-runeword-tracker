# d2-theme Delta

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
between table rows and the row's hover state, and the detail view's panel — its
ground, its edge and its descriptive text, each a token of its own, because a
panel that floats in front of the page is a different role from the hairline that
separates two rows behind it. They SHALL further cover the surfaces crafted
tracking introduces: the tint of a crafted row and the unfilled track of the
progress indicator. They SHALL further cover the surfaces the browsing controls
introduce: the search field, the resting and selected states of a filter control,
the indicator marking the sorted column, and the message shown when nothing
matches. They SHALL further cover the surface the remaining panels introduce: the
band of each panel's collapse control. The surfaces the site header introduces —
its two links, its help control and its patch line — SHALL be covered by tokens
already declared: the gold display family for the pressable text, the muted text
colour for the patch line. No token SHALL be declared for them, and the token held
for a link colour of its own SHALL be removed, because the header renders the gold
family instead and nothing else renders that colour. The surfaces the page's
closing furniture introduces — the footer's text and links, the donation address
and the control that copies it, and the control that returns the reader to the top
— SHALL likewise be covered by tokens already declared, because each is a role the
palette already names: the muted text colour for a line that states a fact, the
gold pair for pressable text, and the floating panel's ground and edge for a
control that floats over the page.

They SHALL further cover the surfaces the mark/unmark confirmation introduces: a
confirm-action colour (green) for marking a runeword crafted, and a remove-action
colour (red) for unmarking one. The transient undo notice's panel token SHALL be
removed with that notice.

Where the palette copies a source, it SHALL copy the source that owns the surface:
the reference site for the surfaces the reference invented, and the game itself for
a surface that reproduces one of the game's own — the detail panel being a copy of
the item tooltip. Where the source's own value fails the contrast the surface needs,
the palette SHALL take the legible value and record the departure, rather than
inherit an unreadable one for fidelity.

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

A change that alters a surface's colour SHALL alter the value of the token that
names it, and SHALL NOT reach for a different token whose current value happens to
suit — nor brighten a token shared with another surface in order to fix this one.

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

- **WHEN** the row separation, the row hover state and the detail view's panel —
  its ground, its edge and its descriptive text — are inspected
- **THEN** each takes its colour from a named token rather than a literal value

#### Scenario: Crafted tracking's own surfaces are tokens

- **WHEN** the crafted row's tint and the progress indicator's track are inspected
- **THEN** each takes its colour from a named token rather than a literal value
- **AND** the indicator's filled portion reuses the crafted-state accent already
  declared, rather than adding a second token for the same role

#### Scenario: Confirmation action colours are tokens

- **WHEN** the mark confirmation's confirm action and the remove confirmation's
  remove action are inspected
- **THEN** each takes its background from a named role token (confirm / remove)
  rather than a literal colour value

#### Scenario: The undo notice token is gone

- **WHEN** the token set is read after the undo notice is removed
- **THEN** no token exists solely for that notice's panel

### Requirement: One corner radius, applied as a system

The palette SHALL declare a single corner radius token and every surface the
project draws itself SHALL take it, so that a square corner beside a rounded one
is impossible rather than merely unlikely. The value SHALL stay small enough that
the interface still reads as the game's own, which is angular.

Geometry copied from a source SHALL be exempt, and the exemption SHALL be recorded
where the geometry is declared. A radius that arrived as part of a borrowed shape
belongs to that shape, and overruling it for internal consistency would replace a
deliberate copy with an accidental one.

Where a control's rounded surface is drawn by the engine as well as by the
stylesheet, the radius SHALL be declared on every part that paints, so that no
engine renders a square fill inside a rounded frame.

#### Scenario: Every self-drawn surface takes the radius token

- **WHEN** the search field, the filter controls, the progress indicator, the
  table's header band, the detail panel and the mark/unmark confirmation panel are
  inspected
- **THEN** each takes its corner radius from the one declared token rather than from
  a literal length or from nothing

#### Scenario: Borrowed geometry keeps its own radius

- **WHEN** the availability badges are inspected
- **THEN** their radius is the one copied from the reference site rather than the
  project's own token
- **AND** the exemption is recorded beside the declaration, so the difference reads
  as a decision rather than as a surface that was missed

#### Scenario: A composite control is rounded in every part that paints

- **WHEN** the progress indicator is rendered at 0% and at 100% in each supported
  engine
- **THEN** no square corner appears inside the rounded groove
