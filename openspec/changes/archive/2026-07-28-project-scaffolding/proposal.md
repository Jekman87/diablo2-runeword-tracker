## Why

The repository currently holds only specifications, research and vendored
reference data — there is no `package.json`, no build, no way to run or test
anything. Every feature change that follows (data layer, runeword table,
progress tracking) needs a working toolchain to land in, and the toolchain
choices are already settled in [`IDEAS.md`](../../../IDEAS.md). Doing the setup
once, as its own change, keeps the first feature change from silently carrying
a hundred lines of unrelated config.

## What Changes

- Introduce a pnpm-managed Vite + React + TypeScript application at the
  repository root, with a minimal app shell that renders and nothing more.
- Add Tailwind CSS v4 via `@tailwindcss/vite`, wired to a single stylesheet
  entry point. No design tokens for the Diablo II theme yet — that is a
  presentation change, not scaffolding.
- Add the quality toolchain agreed in `IDEAS.md`: ESLint, Prettier with
  `prettier-plugin-tailwindcss` and `@trivago/prettier-plugin-sort-imports`,
  TypeScript in strict mode, and Vitest.
- Add `simple-git-hooks` + `lint-staged` so formatting and linting run on
  commit rather than in review.
- Install the runtime utility dependencies the code rules already assume —
  `clsx`, `tailwind-merge`, `class-variance-authority`, `zod` — and prove each
  is importable. No dataset schema, no `cn()` design system, no components.
- Add `docs/CODE_RULES.md` and point [`AGENTS.md`](../../../AGENTS.md) at it,
  closing the last open item in the `IDEAS.md` Tooling list.
- Correct two stale facts in `openspec/config.yaml`: it says React 18 and
  "~89" runewords, while the settled figures are React 19 and 99.

Explicitly **not** in this change: any runeword feature, the Diablo II visual
theme, the i18n layer, GitHub Pages deployment and CI. Deployment needs a
build to deploy, so it follows this change rather than joining it.

## Capabilities

### New Capabilities

- `build-toolchain`: the application builds, runs and type-checks — package
  manager, Vite, React, TypeScript, Tailwind, the module path alias, and the
  npm scripts that expose all of it.
- `code-quality-gates`: the checks that keep the codebase consistent —
  linting, formatting, unit testing, and the pre-commit hook that enforces
  them.

### Modified Capabilities

None. `openspec/specs/` is empty; this is the first change in the project.

## Impact

- **New at the repository root**: `package.json`, `pnpm-lock.yaml`,
  `pnpm-workspace.yaml` (Tailwind v4 requires no config file, but pnpm needs
  build-script approval declared somewhere), `vite.config.ts`,
  `tsconfig.json` + `tsconfig.app.json` + `tsconfig.node.json`,
  `eslint.config.js`, `.prettierrc`, `.prettierignore`, `index.html`,
  `src/`, `public/`.
- **Modified**: `AGENTS.md` (link to code rules), `README.md` (replace
  "nothing is built yet" with real setup instructions),
  `openspec/config.yaml` (stale stack facts), `.gitignore` if any new tool
  cache needs ignoring.
- **Untouched**: `vendor/` stays read-only, `docs/` research files, `local/`.
- **Dependencies**: roughly a dozen devDependencies and four runtime
  dependencies. This is the whole dependency budget for Phase 1 — later
  changes should add to it only when a spec calls for it.
- **Environment risk**: `docs/DATA-SOURCES.md` records TLS interception on
  this machine breaking tools that carry their own CA bundle. `pnpm install`
  is the next tool in that category and may fail with
  `UNABLE_TO_GET_ISSUER_CERT_LOCALLY`; the fix is already written down there.
