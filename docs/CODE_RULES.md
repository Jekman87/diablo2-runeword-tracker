# Code rules

The conventions this project writes code by. Most of them are enforced by the
toolchain rather than by review — where that is the case, the enforcing tool is
named, so you know whether breaking a rule produces a red build or just a
conversation.

Run `pnpm typecheck && pnpm lint && pnpm format:check && pnpm test` to check
everything at once. The pre-commit hook runs a staged-files subset of it.

## Components

- React function components only. No class components.
- Keep components presentational where you can; put logic that can be tested
  without a DOM in plain functions.
- No hardcoded user-facing text in components. Every display string goes
  through the i18n layer in `src/i18n/`: components call `useStrings()`, and the
  English copy lives in `src/i18n/en.ts`. Accessible names and tooltip text are
  display copy too — a screen reader's reading of the page is part of the
  interface, not an exception to it. Prefer themed Floating UI tips over the
  browser's native `title` when the surface is part of the D2 chrome (availability
  badges already do this).

  Runeword names, rune names and item categories are canonical identifiers in
  English and come from the dataset, not from the layer. So is the game text the
  dataset carries — properties, restrictions and notes. Punctuation _around_
  those values is copy, which is why the item-type separator and its parentheses
  are in `en.ts` and the categories are not.

  Dataset text is localised, and not here. Russian labels for names, categories,
  property lines, restrictions and notes are authored under `data/ru/`, merged
  into the generated JSON by `scripts/generate-dataset.ts`, and rendered through
  `src/runewords/display.ts` — the one projection that rendering, search and sort
  all read, so what is matched and ordered is what is shown. A component
  presenting dataset text calls `useLocale()` and projects; it never looks a
  runeword up in the strings layer.

  Russian game vocabulary — in the strings layer and in `data/ru/` alike — is the
  game's own official Russian localisation, in two forms. noob-club.ru
  transcribes the client's runeword and rune text in full (forum topics 70236,
  70237, 73463); where that transcription is doubtful, a reader with the game
  open settles it, and the client wins. Community sites
  (diablo2-resurrected.ru, duskworld.ru, landofgames.ru) are cross-checks for
  what neither covers — chiefly the Reign of the Warlock records, which the
  transcription predates. Every entry carries a note of where its wording was
  verified, and where sources disagree the note records the disagreement and the
  choice made. Machine translation is forbidden.

  A term the client genuinely does not have is project copy and says so rather
  than claiming a source: the off-hand and missile-weapon slot names are ours,
  because the slots are this project's grouping and the game has no collective
  word for either.

  **One language on screen outranks quoting the game.** The client leaves the
  character-level variable in Latin in its per-level formulas (`+(2*clvl)`); the
  Russian dataset text writes `+2*ур` instead, because a single Latin token on an
  otherwise Russian page is the failure the locale exists to prevent. That is the
  only such departure, and it is documented at the point it is made rather than
  passed off as the game's wording.

  A hook rather than an import so that Phase 2's language switch is a change to
  one file. `Strings` is derived from the English record, so a locale missing a
  key fails `pnpm typecheck` and names it.

## TypeScript

`tsconfig.app.json`, checked by `pnpm typecheck` (`tsc --build`).

- `strict` is on. So are `noUnusedLocals`, `noUnusedParameters` and
  `noFallthroughCasesInSwitch` — an unused import is a build failure, not a
  warning.
- `verbatimModuleSyntax` is on, so **type-only imports must say so**:

  <!-- prettier-ignore -->
  ```ts
  import type { Runeword } from "@/types/runeword";
  import { parseRunewords } from "@/data/runewords";
  ```

  Writing `import { Runeword }` for a type is an error. The point is that the
  type/value boundary stays visible at the import site.

- `include` is `["src"]`, deliberately. The compiler never sees `vendor/`.
- Validate external data with `zod` rather than asserting a type onto it. A
  cast tells the compiler what you hope is true; a schema checks.

## Imports

- Use the `@/` alias for anything under `src/`; reserve relative paths for
  siblings within the same folder. The alias is declared in both
  `tsconfig.app.json` and `vite.config.ts` — change one and you must change the
  other, or the editor and the build will disagree.
- Import order is enforced by `@trivago/prettier-plugin-sort-imports` and
  applied by `pnpm format`. Do not hand-sort; four groups, blank line between
  each:

  <!-- prettier-ignore -->
  ```ts
  import { useState } from "react";   // 1. react

  import { z } from "zod";            // 2. third-party

  import { App } from "@/App";        // 3. @/ aliased

  import { helper } from "./helper";  // 4. relative
  ```

## Styling

- Tailwind CSS v4, configured in `src/index.css` via `@import "tailwindcss"`.
  There is no `tailwind.config.js` and there should not be one — theme values
  go in CSS with `@theme`.
- **The source scan is scoped to `src/`**, with `source(none)` and one `@source`.
  Left on its default v4 scans the whole repository, which makes the stylesheet a
  function of every Markdown file in it: the words "focus ring" in a change
  document generated `.ring` and 1.5 kB of CSS nothing rendered. A class that ever
  needs to live outside `src/` must be added to that `@source` list, or it will
  silently not be generated — which is the same failure mode as building a class
  name at runtime, and is why both are called out here.
- Compose conditional classes with `clsx`; resolve conflicting utilities with
  `tailwind-merge`. Use `class-variance-authority` for component variants
  rather than hand-rolled conditional strings.
- Class order inside `className` is enforced by `prettier-plugin-tailwindcss`.
  It is set to read the v4 theme through `tailwindStylesheet`, so it sorts
  custom theme utilities correctly too. Do not fight it.

## File structure

Structure every file top-to-bottom, **public exports and high-level entry
points first, file-private helpers and low-level details last**. A reader
should meet the thing the file is for before meeting the machinery that
supports it.

## Linting

`eslint.config.js`, flat config, run by `pnpm lint`.

- Covers `@eslint/js` recommended, `typescript-eslint` recommended, the React
  Hooks rules and React Fast Refresh.
- `dist` and `vendor` are globally ignored.
- Type-aware linting is deliberately off for now; it earns its cost once there
  is real aggregation logic to check.
- ESLint does **not** report formatting. Formatting is Prettier's job alone, so
  that a formatting failure reads as one.

## Testing

`pnpm test` runs Vitest in `jsdom` with React Testing Library, sharing the
bundler's alias resolution. Globals are enabled — no need to import `describe`
or `expect`.

- The remaining-runes and remaining-bases aggregation is pure logic and gets
  unit tests.
- Test files live next to what they test (`src/App.test.tsx`), or under
  `src/test/` when they are about the project rather than a module.

## Dependencies

Keep the list minimal; prefer plain React over adding a library unless a spec
calls for one. The runtime dependencies are `react`, `react-dom`, `clsx`,
`tailwind-merge`, `class-variance-authority`, `zod` and `@floating-ui/react` —
adding to that set is a decision a change proposal should justify.

`@floating-ui/react` is the one added against that rule rather than with it, and
what justified it is worth keeping: the detail view opens on hover, so it has to
flip above the pointer near the bottom of a long table, shift inward at the
viewport edges, stay positioned as the page scrolls, and hold itself open while
the pointer travels the gap toward it. That last one — `safePolygon` — is the
part hand-rolled positioning gets wrong, and it gets it wrong at the bottom of
the page where review is least likely to look.

## Data

- `vendor/` is a read-only third-party snapshot. Never edit it. It is invisible
  to the compiler, to ESLint and to Prettier, and nothing in `src/` imports
  from it directly.
- Socket count is derived — it equals `runes.length`. Do not store it.
- Rune order is significant and repeats are real (`Infinity` is
  `Ber Mal Ber Ist`).
- `ladder`, `version` and `note` are decoration only: they render badges. No
  filter reads them, no counter subtracts them, no logic branches on them.
- Progress is always out of all 99 runewords.

## Commits

Conventional commits, one line: `type(scope): subject`. In English.

## Attribution

Only the repository owner is credited. No code, comment, commit, PR, or other
artifact may name an AI tool (Cursor, Claude, Copilot, ChatGPT, or similar) as
author, co-author, or helper. No `Co-authored-by:` trailers for AI accounts.
Strip any such trailer a tool tries to append.
