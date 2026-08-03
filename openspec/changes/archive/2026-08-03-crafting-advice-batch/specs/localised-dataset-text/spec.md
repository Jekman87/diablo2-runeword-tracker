# localised-dataset-text Delta

## ADDED Requirements

### Requirement: Advice text renders in the active locale on relaxed sourcing terms

Advice paragraphs SHALL render in the active locale through the same
whole-record projection the rest of the dataset text uses: a record whose
Russian variant carries advice renders Russian advice, and a record that falls
back to English falls back as a whole, so no panel mixes the two languages.

The sourcing rule for advice prose is deliberately looser than for game
vocabulary, and the boundary SHALL be kept: the _prose_ is this project's own
editorial text, authored freely with fan sites (build guides, trade sites) as
references — machine translation remains forbidden — while any _game term_
inside it (a base item's name, a rune's name, a class name) SHALL use the same
official wording the rest of the page uses for that term. A base item named in
Russian advice reads as the game names it, not as a translator would.

#### Scenario: Advice follows the locale switch

- **WHEN** an advice panel is open and the language is switched
- **THEN** its paragraphs render in the other locale, with no line of the
  first locale remaining

#### Scenario: Game terms inside advice match the game's words

- **WHEN** Russian advice names a base item the game's Russian client also
  names
- **THEN** the advice uses the client's wording for it, even though the
  sentence around it is the project's own prose

#### Scenario: Sources are shared, not translated

- **WHEN** a record's advice sources are read under both locales
- **THEN** the same links with the same labels appear under each
