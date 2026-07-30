## Context

The display-copy layer was built for this change. `src/i18n/en.ts` holds every
user-facing string, deliberately widened to `string` so a second record is
typed against its shape; `useStrings()` is a hook precisely so that locale
selection becomes a change to `src/i18n/index.ts` and not to its fourteen
consumers. The `ui-strings` spec forbids a switch, a persisted preference and a
second locale "until a change introduces another" — this is that change.

What exists to build on:

- `src/view/` is the model for a preference: namespaced versioned key,
  zod-validated read, defaults on corrupt data, lazy initialisation so the
  first paint is already restored, writes only from setters.
- `d2-theme` already requires a fallback font stack "readable for characters
  the typeface does not cover", and the stack (Cambria, Georgia, Noto Serif,
  Liberation Serif) was chosen for Cyrillic coverage. Bellefair ships
  Latin-only.
- `src/runewords/search.ts` and `sort.ts` operate on dataset text only and
  defer "the collation question" to this change.

Constraints: no i18n library (dependency minimalism is a spec requirement),
no machine translation of game vocabulary (`openspec/config.yaml`,
`docs/CODE_RULES.md`), dataset text stays canonical English (`ui-strings`).

## Goals / Non-Goals

**Goals:**

- A complete Russian record for every copy key, typecheck-enforced.
- A language switch in the header; the choice survives a reload; a first
  visit opens in English.
- The first paint is already in the restored language — no English flash.
- `<html lang>` always states the rendered language.
- No copy-consuming component is edited — the seam pays for itself.

**Non-Goals:**

- Russian dataset labels (runeword names, rune names, categories, property
  lines, restrictions, notes). That is the other half of Phase 2 — a
  dataset-shaped change requiring sourcing from the official Russian client,
  with its own search/sort implications. Until then search and sort read
  English text only and are untouched here.
- The browser tab title. `app.title` is the site's name; the `<title>` in
  `index.html` stays as it is.
- A Cyrillic display font. Russian copy renders in the existing fallback
  stack, as `d2-theme` already provides for. A second family can be its own
  change if the fallback proves ugly in practice.
- URL-carried locale (`?lang=ru`), locale routing, or per-locale builds — a
  static single-page tracker does not need them.
- Browser-language detection. The default is English, always; Russian is
  only ever entered through the switch.

## Decisions

### 1. Locale state is a module store read through `useSyncExternalStore`

`src/i18n/index.ts` keeps the active locale in module state with a subscriber
set; `useStrings()` subscribes via `useSyncExternalStore` and returns the
active record; `setLocale()` updates the store, persists, and sets
`document.documentElement.lang`. The switch component imports `setLocale`
directly.

- **Why not props drilling (the repo's default)?** Fourteen components call
  `useStrings()`. Threading a locale prop through them is exactly the edit the
  `ui-strings` spec forbids: "a second locale is added without touching a
  component".
- **Why not React context?** A provider would wrap the app to deliver one
  value that changes a few times per player lifetime, and the repo has no
  providers today. `useSyncExternalStore` keeps the `useStrings()` signature
  unchanged, needs no wrapper, and the switch reaches the setter by import
  rather than by hook.
- **Testability:** the store exposes an internal reset for tests
  (`beforeEach`), the same way storage modules are tested as plain functions.

### 2. The preference is its own storage module under its own key

`src/i18n/storage.ts` (mirroring `src/view/storage.ts`): key
`diablo2-runeword-tracker:locale:v1`, zod schema accepting exactly
`"en" | "ru"`, read validated, anything else rejected to "no preference".
Defaults-on-corrupt, because a language choice is a preference re-expressed in
one click, not the player's work — the view-persistence policy, not the
progress one. Loading never writes; the first explicit switch is the first
write. One module owns the key, per the established one-module-one-key rule.

- **Why not extend the view record?** The view spec's own rationale: one
  capability per fallback policy _and_ per kind of value. The view record is
  "how the player is looking at the list"; the language is how the whole
  interface speaks. A version bump of one must not disturb the other.

### 3. The default is English, with no browser detection

Initial locale = stored preference, else English. `navigator.language` is
deliberately not consulted: the site's canonical language is English (the
dataset text, the tab title and the pre-script document are all English), so
the first paint is the same in every environment, is trivially testable, and
never guesses wrong — Russian is always the reader's explicit choice, one
click away in the header. Loading never writes; the first switch is the first
write. The store initialises lazily on first read, so a stored `ru` still
means the first paint is already Russian — the same reason the view hook uses
a lazy initialiser.

### 4. Russian grammar lives inside `ru.ts` value functions

The copy layer's values are already functions where formatting is needed, and
that is the whole plural mechanism: `baseSockets` in Russian returns
гнездо/гнезда/гнёзд by the standard three-form rule written as plain code in
that one function. No ICU, no message syntax, no library — the grammar is
local to the record that needs it, and English keeps its simple ternary.

### 5. Game vocabulary is sourced, not translated

Words in the Russian copy that name game concepts — the five slot names, the
three rune-tier labels, "crafted", "ladder", "socket", "runeword", "rune",
"patch" — take the official Russian client's terms where the client has one
(the Chronicle log and item tooltips are the reference surfaces). Each such
term gets a source note in `ru.ts` comments; anything uncertain is flagged
for the maintainer's review rather than guessed. Prose the project authored
(help text, hints, empty states) is project-authored Russian.

### 6. The switch is a two-option pressed-state control in the header

It sits on the title's line beside Help and Feedback, matching how the
crafted/slot filter groups already express an active option. Options are
labelled `EN` / `RU` with accessible names in their own language ("English",
"Русский") — a reader who cannot read the active language must still be able
to find the way out of it. The labels route through the copy layer like all
display text; both records carry the same values, because a language's own
name does not translate. It is a control, not a link, so the header's
"exactly two links" requirement stands.

### 7. `<html lang>` is set at runtime; `index.html` keeps `lang="en"`

The static attribute remains the pre-script truth (the loading page is
English-shaped), and the store sets `document.documentElement.lang` on
initialisation and on every switch. This is what makes screen readers switch
pronunciation rules with the interface. Dataset text remains English inside a
Russian page; that is acceptable for `lang` purposes because the payload of
the page's copy is what the attribute describes — per-element `lang` markup on
every dataset value would be markup for its own sake.

### 8. The collation question closes as "no collation"

Search matches and sort orders dataset text, which stays ASCII by the
non-goal above. A Cyrillic query correctly matches nothing, because nothing
Cyrillic is rendered in the searched columns — the search hint (translated)
still tells the reader what the field matches. `toLowerCase()` is
Unicode-correct regardless. The docblocks in `search.ts` and `sort.ts` that
assign this change the question are updated to record this answer and to
re-assign the question to the future dataset-localisation change.

## Risks / Trade-offs

- [Russian copy runs longer than English — typically 20–40% — and the header
  title line, column headers and filter buttons were laid out in English] →
  Review every band at both locales and at the responsive breakpoints; the
  table's existing collapse behaviour is the pressure valve. Wording in
  `ru.ts` may prefer the shorter of two correct phrasings.
- [Mixed typography: Latin dataset names render in Bellefair while Cyrillic
  copy renders in the fallback serif] → Accepted deliberately; the fallback
  stack was chosen for this. If it reads badly, a Cyrillic-capable family is
  a follow-up change, not a blocker here.
- [Module store is shared state across tests] → Expose a test-only reset;
  storage module tested as plain functions like `view/storage`.
- [Translation quality: the maintainer must vet game terms against the
  official client] → Source notes in `ru.ts` make the vetting reviewable;
  uncertain terms are flagged in the PR rather than silently guessed.
- [A stored `"ru"` from a future version that supports more locales] → The
  versioned key already covers format evolution; adding a locale later is
  additive to the schema and needs no key bump.

## Open Questions

- None blocking. The exact Russian phrasing of the seven help strings is
  authoring work reviewed in the PR, not a design unknown.
