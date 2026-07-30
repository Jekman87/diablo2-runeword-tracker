## Why

The tracker's audience plays the game in Russian as well as English, and the
project was built bilingual from the start — every user-facing string already
resolves through the display-copy layer, whose own docblock names this change as
the one that adds the second locale. Today the layer ships English only and the
seam is deliberately nothing more than a seam: no switch, no preference, no
second record. This change fills the seam.

## What Changes

- Add a Russian display-copy record (`ru`) typed against the English one, so an
  omitted key is a typecheck failure rather than a stray English word in a
  Russian interface. Russian plural forms are implemented inside the record's
  own value functions — no machinery is added.
- Make the copy accessor locale-aware: `useStrings()` returns the active
  locale's record, and switching re-renders every consumer without any
  component being edited.
- Add a language switch to the site header, on the title's line beside the
  existing Help and Feedback controls.
- Persist the chosen language in local storage under its own namespaced
  versioned key, with the view-persistence recovery policy: a corrupt value is
  replaced by the default, never preserved. The default is English: a first
  visit with no stored choice opens in English, and Russian is always an
  explicit choice — there is no browser-language detection.
- Keep `<html lang>` truthful: the document language attribute follows the
  active locale, so screen readers pronounce the page in the right language.
- Game-derived vocabulary inside the copy (equipment-slot names, rune-tier
  labels and similar) is taken from the official Russian game client where the
  client has a word for it, never machine-translated.
- Dataset text stays English. Runeword names, rune names, base item
  categories, granted properties, restrictions and notes are canonical
  identifiers and dataset values by the existing `ui-strings` contract; giving
  them official Russian labels is a separate, dataset-shaped change. Search
  and sort therefore continue to operate on ASCII dataset text and are
  unchanged — this change closes the collation question the search module's
  docblock assigns to it, by scoping non-ASCII text to the copy layer that
  neither matching nor ordering reads.

## Capabilities

### New Capabilities

- `locale-selection`: choosing the interface language — the switch control,
  the English default for a first visit, the persisted preference under its
  own versioned key with defaults-on-corrupt recovery, the document language
  attribute following the choice, and graceful degradation when storage is
  unavailable.

### Modified Capabilities

- `ui-strings`: the "One locale ships, and the seam is not more than a seam"
  requirement is replaced — two locales ship, the accessor selects between
  them, Russian grammar lives inside the Russian record's value functions, and
  the prohibition on a third-party internationalisation dependency stays.
- `site-header`: gains a requirement placing the language switch in the
  header, alongside the existing rule that the header carries exactly two
  links (the switch is a control, not a link, and must not disturb that rule
  or the header's landmark and layout guarantees).

### Unchanged (checked)

- `d2-theme`: the self-hosted display font already requires a fallback stack
  "readable for characters the typeface does not cover"; Cyrillic copy renders
  in that stack by design. No requirement changes.
- `runeword-browsing` / `view-persistence` / `runeword-dataset`: search,
  sort, filters and the dataset are untouched because dataset text stays
  English.

## Impact

- `src/i18n/` — new `ru.ts`; `index.ts` gains locale state and selection;
  tests extend to the second record.
- `src/components/SiteHeader.tsx` — the one component that changes: it gains
  the language switch. No copy-consuming component is edited, which is the
  contract this change exists to prove.
- New locale-preference storage module and hook following the `src/view/`
  pattern (own key `diablo2-runeword-tracker:locale:v1`, zod-validated read,
  writes only from the setter).
- `index.html` keeps `lang="en"` as the pre-script default; the attribute is
  set from the active locale at runtime.
- `src/runewords/search.ts` / `sort.ts` — behaviour unchanged; their
  docblocks, which defer the collation question to this change, are updated to
  record the answer.
- No new dependencies.
