## 1. Locale preference storage

- [x] 1.1 Create `src/i18n/storage.ts` following the `src/view/storage.ts` pattern: key `diablo2-runeword-tracker:locale:v1`, zod schema accepting exactly `"en" | "ru"`, `loadLocale()` returning the locale or `null` (no preference) on anything unusable, `saveLocale()` guarding a throwing storage; loading never writes
- [x] 1.2 Create `src/i18n/storage.test.ts` as plain-function tests: valid value loads, malformed JSON → `null`, wrong shape → `null`, unknown language → `null`, throwing read → `null`, throwing write does not throw, load never writes

## 2. Locale store and accessor

- [x] 2.1 Rework `src/i18n/index.ts` into a module store read via `useSyncExternalStore`: lazy initialisation (stored preference, else English — no browser-language detection) so the first paint is already localised, `useStrings()` returns the active record, `setLocale()` updates the store, saves the preference, sets `document.documentElement.lang`, and notifies subscribers; expose a test-only reset
- [x] 2.2 Set `document.documentElement.lang` on store initialisation as well as on switch, so a restored Russian session declares `ru` from first paint
- [x] 2.3 Extend `src/i18n/index.test.ts`: default resolution (stored preference, else English regardless of `navigator.language`), switch notifies subscribers and re-renders a consumer, `lang` attribute follows load and switch, loading writes nothing, unusable stored value falls back to English

## 3. The Russian record

- [x] 3.1 Create `src/i18n/ru.ts` typed as `Strings`, covering every key in `en.ts`; game-derived terms (five slot names, three tier labels, crafted/ladder/socket/runeword/rune/patch vocabulary) taken from the official Russian client with a source note per term, uncertain terms flagged for maintainer review; project-authored prose (help intro and points, hints, empty states, undo, remaining panels) written as natural Russian
- [x] 3.2 Implement Russian plural forms inside the record's own value functions where a count demands them (`controls.count`, `remaining.baseSockets`, `remaining.baseCount`, `progress.count`), using the standard three-form rule as plain code
- [x] 3.3 Add the language-switch option labels and accessible names to both records (`EN`/`RU` visible labels; "English"/"Русский" accessible names — identical values in both records, with a comment saying why a language's name does not translate)
- [x] 3.4 Extend the i18n tests to the Russian record: every key non-empty, no dataset value leaked into it, plural functions return the correct form for 1, 2, 5 and 21

## 4. The switch in the header

- [x] 4.1 Create a `LanguageSwitch` component: two-option pressed-state control styled like the existing filter groups, each option exposing its active state to assistive technology, labels resolved through the copy layer, activation calling `setLocale`
- [x] 4.2 Place the switch on the title's line in `src/components/SiteHeader.tsx` beside Help and Feedback; verify the header still exposes exactly two links and the banner landmark
- [x] 4.3 Component tests: switching re-renders copy in another consumer without that consumer changing, active option reports state, header link count unchanged

## 5. Closing the seams

- [x] 5.1 Update the docblocks in `src/i18n/index.ts`, `src/i18n/en.ts`, `src/runewords/search.ts` and `src/runewords/sort.ts`: the seam is filled, the collation question is answered as "dataset text stays ASCII" and re-assigned to the future dataset-localisation change
- [x] 5.2 Confirm `index.html` keeps `lang="en"` and the static `<title>` untouched; note in `docs/REFERENCE.md` that Cyrillic copy renders in the fallback stack by design
- [x] 5.3 Verify no copy-consuming component was edited (git diff shows only `SiteHeader.tsx`, the new switch, and `src/i18n/`), which is the contract the change proves

## 6. Verification

- [x] 6.1 Run `pnpm typecheck`, `pnpm lint`, `pnpm test` — and prove the completeness guarantee by temporarily deleting a `ru.ts` key and watching typecheck name it
- [x] 6.2 Review every band (header, progress, remaining panels, controls, table, detail panel) in Russian at desktop and the responsive breakpoints; adjust `ru.ts` phrasing where length breaks a line, not the layout
- [x] 6.3 Manual pass: first visit opens in English without writing storage, whatever the browser's language; switching to Russian persists and survives a reload with no English flash; corrupt stored value falls back to English and is overwritten by the next switch; storage disabled still switches for the session
