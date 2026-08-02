# site-header Delta

## ADDED Requirements

### Requirement: The help panel qualifies the advice surfaces as estimates

The help panel SHALL describe the two advice surfaces — the usefulness label
under a runeword's name and the crafting-advice panel on the item-types cell —
and SHALL state plainly that the judgements are approximate: editorial
estimates assembled from community tier lists and trade data, named with the
ladder season and the collection date they reflect, and liable to drift as the
game's economy moves. The page makes claims about worth nowhere else, so the
one place that explains the page SHALL be the place that bounds those claims.

The existing help content SHALL be revised in the same pass rather than only
appended to, on the disclosure's own standing rule that a feature which ships
is added and a sentence a feature falsifies is corrected. All of it SHALL
resolve through the display-copy layer in both locales.

#### Scenario: The advice surfaces are described with their caveat

- **WHEN** the help disclosure is opened
- **THEN** it explains the usefulness label and the advice panel, states that
  both are approximate estimates, and names the season and date the data
  reflects

#### Scenario: The caveat exists in both languages

- **WHEN** the locale is switched with the help panel open
- **THEN** the advice description and its caveat render in the active locale
  with no string left behind in the other
