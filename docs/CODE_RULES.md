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
  through the i18n layer — see [`AGENTS.md`](../AGENTS.md). Runeword and rune
  names are canonical identifiers in English, not display copy.

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
`tailwind-merge`, `class-variance-authority` and `zod` — adding to that set is
a decision a change proposal should justify.

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
