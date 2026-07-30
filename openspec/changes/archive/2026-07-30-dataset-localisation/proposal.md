# Dataset Localisation

## Why

The `russian-locale` change (merged 2026-07-30) localised the display-copy half of Phase 2: UI chrome speaks Russian, but every piece of dataset text — runeword names, rune names, base categories, property lines, restrictions, notes — still renders in English inside the Russian page. This change completes Phase 2 by giving that dataset text Russian labels, so the Russian locale shows strictly one language on screen.

## What Changes

- The dataset gains Russian labels for every localisable text field: runeword names, rune names, item-type category names, item-type restrictions, property lines, and notes. Translations enter through `scripts/generate-dataset.ts` from a repo-maintained translation source, are zod-validated, and ship in the generated JSON.
- **Sourcing rule kept, and its reach widened**: the official Russian localisation turned out to be reachable after all, in two forms — noob-club.ru transcribes the client's runeword and rune text in full, and a reader with the game open settles what the transcription leaves doubtful. The client wins where they disagree; it caught a transcription typo on `Shael`. Community sites (diablo2-resurrected.ru, duskworld.ru, landofgames.ru) are cross-checks for what neither covers — chiefly the Reign of the Warlock records the transcription predates. Machine translation remains forbidden; each entry carries a source note. The `ui-strings` requirement is therefore modified rather than removed: it still asks for the game's own terms, and now says how the game is read.
- **Strictly one language on screen**: with the Russian locale active, dataset text renders in Russian only — never English alongside, and not one Latin letter. A runeword record either carries a complete Russian variant or is flagged untranslated and falls back to English as a whole record, so no half-translated rows appear. This requirement outranks quoting the game verbatim in the one case where the two conflict: the client's per-level formulas leave the character-level variable in Latin (`+(2*clvl)`), and these render it as `+2*ур`.
- **Search follows the selected language**: the query matches against the active locale's text for name, categories and restriction — a Cyrillic query matches Russian labels under the Russian locale; English text is not matched while Russian is active.
- **Sort follows the selected language**: the Cyrillic-collation question deferred by the `search.ts`/`sort.ts` docblocks is answered — name and category ordering under the Russian locale uses proper Russian collation instead of code-point order.
- **Canonical English names stay the identifiers**: crafted-progress storage keeps English names, and the future CSV export/import (Phase 3) is specified as English-only and locale-independent. No storage format changes.
- The `[REVIEW]`-flagged terms in `src/i18n/ru.ts` (slot names «Ближний бой», «Дальний бой», «Левая рука», «Броня»; «патч» vs «обновление»; «Основы»; «ладдер»/`L` marker) are verified against the official localisation and unflagged as part of this change. Three were wrong: «Основы» is nobody's word for a base item, the ladder marker's Latin `L` abbreviated a loanword every source does use, and «Броня» became the client's own «Доспех». Two — the off-hand and missile-weapon slot names — turned out to have no source at all, and are now documented as this project's own.

## Capabilities

### New Capabilities

- `localised-dataset-text`: how dataset text renders under each locale — one language on screen, whole-record English fallback for untranslated entries, canonical names retained for identity-keyed behaviour (sprites, storage, progress).

### Modified Capabilities

- `runeword-dataset`: the data contract gains Russian label fields with validation — a record's Russian variant is complete or absent, sourced from the official localisation with per-entry source notes.
- `runeword-browsing`: search matches the selected locale's text; sorting collates Russian text with Russian collation rather than by code point.
- `locale-selection`: the switch's contract drops the clause that froze dataset text in canonical English in both languages, and states instead that a switch reaches dataset text as immediately as it reaches copy.
- `ui-strings`: the game-vocabulary sourcing requirement keeps asking for the game's own terms and now says how the client is read — a full transcription of its text, with a reading of the running client settling anything doubtful — and adds that a concept the game does not name is project-authored and says so. The `[REVIEW]`-flagged terms are resolved under that rule; the "dataset text stays English inside the Russian page" boundary is removed.

## Impact

- **Data layer**: `src/data/schema.ts` (Russian fields + completeness validation), `scripts/generate-dataset.ts` (merge translation source, validate), new translation source file(s), regenerated `src/data/*.json`, drift test.
- **Browsing logic**: `src/runewords/search.ts` (locale-aware field access), `src/runewords/sort.ts` (Russian collator alongside `byCodePoint`).
- **Components rendering dataset text**: `RunewordRow`, `RunewordDetails`, `RunewordDialog`, `ItemTypes`, `RuneSequence`/`RuneIcon` (localised label, canonical sprite key and lookup), `AvailabilityBadges`, `PropertyLine` (value-emphasis regex must hold for Russian lines), `RemainingRunes`, `RemainingBases`.
- **i18n layer**: `src/i18n/ru.ts` `[REVIEW]` terms verified and unflagged; the "dataset text never appears here" boundary comment updated to describe the new split.
- **Explicitly unchanged**: `src/crafted/storage.ts` format (canonical English names, code-point sort), locale selection/persistence, patch-colour keying by raw patch value.
- **Docs/config**: the sourcing amendment recorded where the rule lives (`ui-strings` spec; `docs/CODE_RULES.md` / `openspec/config.yaml` context if they restate it).
