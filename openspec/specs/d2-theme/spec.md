# d2-theme Specification

## Purpose

The visual contract every component renders against — the named colour tokens
and what each is for, the self-hosted display font, how a rune name becomes the
correct sprite cell, the cursor and divider decorations, and the attribution the
borrowed assets require.

## Requirements

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
panel and the dimmed backdrop behind it. They SHALL further cover the surfaces
crafted tracking introduces: the tint of a crafted row, the unfilled track of the
progress indicator, and the panel of the transient undo notice.

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

#### Scenario: Crafted tracking's own surfaces are tokens

- **WHEN** the crafted row's tint, the progress indicator's track and the undo
  notice's panel are inspected
- **THEN** each takes its colour from a named token rather than a literal value
- **AND** the indicator's filled portion reuses the crafted-state accent already
  declared, rather than adding a second token for the same role

#### Scenario: A surface with no component still has no token

- **WHEN** the token set is read for surfaces no component renders yet, such as
  the collapsible remaining-runes and remaining-bases panels
- **THEN** no token exists for them, because the change that builds each one adds
  its own

### Requirement: Self-hosted display font

The display typeface SHALL be served from the project's own assets rather than a
third-party font service, so that the deployed page makes no external request and
renders without network access beyond its own origin. It SHALL be declared with a
fallback stack that remains readable for characters the typeface does not cover.

#### Scenario: The page requests no third-party font

- **WHEN** the deployed page is loaded and its network requests are inspected
- **THEN** every font request resolves to the project's own origin
- **AND** no request is made to a font content-delivery network

#### Scenario: Text remains visible while the font loads

- **WHEN** the display font has not yet loaded
- **THEN** text renders in the fallback rather than staying invisible

#### Scenario: Uncovered characters fall back readably

- **WHEN** text contains characters the display typeface does not include
- **THEN** those characters render in the declared fallback stack rather than as
  missing glyphs

### Requirement: Rune icons render from a sprite

A rune SHALL be rendered as an icon addressed by its name, drawn from the single
sprite sheet holding all 33 rune images. The icon's position within the sprite
SHALL be derived from the rune's position in the rune reference data and SHALL NOT
be stored as a field or precomputed into a stylesheet, so that no second
representation of the same fact can drift from the first. Icon dimensions SHALL be
driven by a single size value so the sprite scales without restating any offset.

#### Scenario: Every rune resolves to its own cell

- **WHEN** an icon is requested for each of the 33 runes in turn
- **THEN** each resolves to a distinct cell of the sprite
- **AND** the cell matches that rune's position in the rune reference data

#### Scenario: The first and last runes anchor the sprite

- **WHEN** icons are requested for `El` and for `Zod`
- **THEN** `El` resolves to the first cell of the first row
- **AND** `Zod` resolves to the last cell of the last row

#### Scenario: Sprite rows correspond to tier bands

- **WHEN** the sprite row of every rune is compared with its rarity tier
- **THEN** all `common` runes share the first row, all `semirare` the second and
  all `rare` the third

#### Scenario: No sprite position is stored

- **WHEN** a rune record is inspected
- **THEN** it exposes no sprite index or offset field

#### Scenario: Icon size is driven by one value

- **WHEN** the rune icon size is changed
- **THEN** every rune still renders its own correct cell, with no offset restated

#### Scenario: Icons render at full strength

- **WHEN** a rune icon is rendered
- **THEN** it is not dimmed, because the project tracks no rune inventory that a
  dimmed state could represent

#### Scenario: An unknown rune name does not render a wrong rune

- **WHEN** an icon is requested for a name that is not one of the 33 runes
- **THEN** the failure is surfaced rather than resolving to an arbitrary cell

### Requirement: Borrowed assets are copied, not referenced in place

Assets taken from the vendored snapshot SHALL be copied under `src/` and consumed
from there, leaving the snapshot unmodified and unimported. A copy SHALL remain
byte-identical to the vendored original it was taken from, so that an edit to
either is detected rather than silently diverging inside a binary file.

#### Scenario: The copy matches its origin

- **WHEN** an asset copied from the snapshot is compared with the vendored
  original
- **THEN** the two are byte-identical
- **AND** the test suite fails if either is changed without the other

#### Scenario: The snapshot keeps its own copy

- **WHEN** the vendored directory is inspected after the copy is made
- **THEN** the original asset is still present and unmodified

### Requirement: Interface decorations

The interface SHALL carry the game's custom pointer and its ornamental divider.
The pointer SHALL be applied from a single root-level rule and SHALL NOT declare
every element interactive, so that cursor appearance continues to indicate what
can actually be clicked. The divider SHALL be a repeating horizontal band that
spans whatever width it is given rather than a fixed-width image.

#### Scenario: The pointer applies document-wide from one rule

- **WHEN** the stylesheet is inspected
- **THEN** the custom pointer is declared once at the document root
- **AND** no rule forces it onto every element regardless of interactivity

#### Scenario: Interactive elements still read as interactive

- **WHEN** the pointer is over a control rather than over inert page area
- **THEN** the cursor still distinguishes the two

#### Scenario: The divider spans any width

- **WHEN** the divider is rendered in containers of differing widths
- **THEN** it fills each one by repeating horizontally, with no seam or crop at a
  fixed width

### Requirement: Attribution for borrowed assets and fonts

The rune sprite, the pointer and the divider derive from the MIT-licensed
`fabd/diablo2-runewizard` project, and the display font carries the SIL Open Font
License. The repository SHALL name each borrowed asset and its licence, and each
licence text SHALL remain alongside the asset it covers. The reference project's
own branding SHALL NOT be reused.

#### Scenario: Each borrowed asset is attributed

- **WHEN** the attribution is read
- **THEN** it names the rune sprite, the pointer and the divider as derived from
  the upstream project under the MIT licence
- **AND** it names the display font and its Open Font License

#### Scenario: The font licence travels with the font

- **WHEN** the font directory is inspected
- **THEN** the Open Font License text is present within it

#### Scenario: Reference branding is not reused

- **WHEN** the project's assets are inspected
- **THEN** none is a logo or wordmark of the reference project, because reusing
  its identity would misrepresent this project as that one
