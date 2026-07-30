# Dataset Localisation — Tasks

## 1. Schema and data contract

- [x] 1.1 Extend `src/data/schema.ts`: optional `ru` variant on `Runeword` (name, restriction/note parity with the English fields, property groups mirroring group count and per-group line counts via `superRefine`), required `ru` name on `Rune` and `ItemType`; types stay derived from the schema
- [x] 1.2 Add schema tests for the new invariants: a partial variant fails at load naming the record, restriction/note parity violations fail, mismatched group or line counts fail

## 2. Translation source and generator

- [x] 2.1 Create `data/ru/` authored translation modules (`runes.ts`, `item-types.ts`, `runewords.ts`) with typed entries keyed by canonical English name and a per-entry source note field; document the sourcing rule (diablo2-resurrected.ru primary, cross-checked, no machine translation) in the directory's header comments
- [x] 2.2 Transcribe Russian names for all 33 runes and all 20 item-type categories from the primary source, cross-checked, with source notes
- [x] 2.3 Transcribe Russian variants for all 99 runewords — name, restriction where present, note for `Mosaic`, and all 969 property lines aligned 1:1 with the English lines — with source notes; record any source disagreement and the choice made
- [x] 2.4 Extend `scripts/generate-dataset.ts`: zod-validate the translation source, merge it into the output records, fail the build on a key the vendored data does not define, and keep source notes out of the emitted JSON
- [x] 2.5 Regenerate `src/data/*.json` via `pnpm data:build`; extend the drift test over the merged output and add the 99/33/20 full-coverage assertion

## 3. Display projection

- [x] 3.1 Create `src/runewords/display.ts`: project a runeword (and rune/category labels) for a locale — Russian labels for a translated record, whole-record English fallback otherwise — with unit tests covering both locales and the fallback
- [x] 3.2 Update components to render the projection: `RunewordRow`, `RunewordDetails`, `RunewordDialog`, `ItemTypes` (localised restriction word inside the copy-layer parentheses), `AvailabilityBadges` (note tooltip), `RemainingRunes`, `RemainingBases`
- [x] 3.3 Update `RuneSequence`/`RuneIcon`: projected label as visible text and `aria-label`, canonical name kept as sprite key
- [x] 3.4 Extend the `PropertyLine` round-trip test over all Russian property lines and confirm value emphasis holds on Russian text

## 4. Search and sort

- [x] 4.1 Make `matchesQuery` locale-aware: match the projected name, categories and restriction; fold case and `ё`→`е` on both sides; update the `search.ts` docblock that deferred the question; tests for Cyrillic matching, English-not-matched-under-Russian, and `ё`/`е` interchange
- [x] 4.2 Make the sort comparators locale-aware: `Intl.Collator("ru")` for Russian projections of the name and base-items keys, `byCodePoint` kept for English; tiebreak stays required level then canonical name; update the `sort.ts` docblock; tests for Russian collation (`е` < `ё` < `ж`) and locale-independent tiebreak
- [x] 4.3 Thread the active locale into the narrowing/sorting pipeline and verify identity-keyed behaviour is untouched: crafted storage writes canonical names under the Russian locale, slot filter results identical in both locales, progress unchanged by a locale switch

## 5. Review-flagged terms and sourcing rule

- [x] 5.1 Verify each `[REVIEW]` term in `src/i18n/ru.ts` (slot names, «патч», «Основы», «ладдер»/`L` marker) against diablo2-resurrected.ru plus one cross-check source; correct where sources disagree, update each source note, remove every `[REVIEW]` flag
- [x] 5.2 Update the `ru.ts` boundary comment ("dataset text never appears here") to describe the new split, and update `docs/CODE_RULES.md` / `openspec/config.yaml` context where they restate the old client-only sourcing rule

## 6. Verification

- [x] 6.1 Run the full gate — `pnpm typecheck`, `pnpm lint`, `pnpm format:check`, `pnpm test`, `pnpm data:build` leaving a clean tree — and fix anything it surfaces
- [x] 6.2 Manually verify in the browser: Russian locale shows one language on screen across table, detail panel and remaining panels; search and sort behave per locale; locale switch reaches every string without reload
