# code-quality-gates Specification

## Purpose

The checks that keep the codebase consistent: linting, formatting, unit
testing, and the pre-commit hook that enforces them.

## Requirements

### Requirement: Linting

The project SHALL provide a `lint` script running ESLint in flat-config format
over all application source, with rules covering TypeScript, React Hooks and
React Fast Refresh. Linting SHALL exit non-zero on any error.

#### Scenario: Scaffold lints clean

- **WHEN** a developer runs `pnpm lint` on the committed scaffold
- **THEN** the command exits zero with no errors and no warnings

#### Scenario: Hook rule violations are caught

- **WHEN** a component calls a React hook conditionally
- **THEN** `pnpm lint` reports a `react-hooks` error and exits non-zero

#### Scenario: Vendored code is not linted

- **WHEN** `pnpm lint` runs
- **THEN** no reported problem references a file under `vendor/`

### Requirement: Deterministic formatting

The project SHALL use Prettier for all formatting, extended with
`@trivago/prettier-plugin-sort-imports` for import order and
`prettier-plugin-tailwindcss` for class order. It SHALL provide a `format`
script that writes and a `format:check` script that verifies. Formatting SHALL
be the single source of truth for style; ESLint SHALL NOT report formatting
violations.

#### Scenario: Scaffold is already formatted

- **WHEN** a developer runs `pnpm format:check` on the committed scaffold
- **THEN** the command exits zero

#### Scenario: Tailwind classes are reordered canonically

- **WHEN** a file contains Tailwind classes in a non-canonical order
- **THEN** `pnpm format` rewrites them into Tailwind's canonical order

#### Scenario: Imports are grouped and ordered

- **WHEN** a file mixes React, third-party, aliased `@/` and relative imports
- **THEN** `pnpm format` orders them React first, then third-party, then
  `@/`, then relative, separated by blank lines

#### Scenario: Vendored files are not reformatted

- **WHEN** `pnpm format` runs
- **THEN** no file under `vendor/` is modified

### Requirement: Unit testing

The project SHALL provide a `test` script running Vitest in a `jsdom`
environment with React Testing Library available, sharing the bundler's path
alias resolution. The committed scaffold SHALL include at least one passing
test that renders the application shell.

#### Scenario: Test suite passes

- **WHEN** a developer runs `pnpm test`
- **THEN** all tests pass and the command exits zero

#### Scenario: Components can be rendered and queried

- **WHEN** a test renders the app shell via React Testing Library
- **THEN** DOM queries against the rendered output succeed

#### Scenario: A failing assertion fails the run

- **WHEN** any test assertion fails
- **THEN** `pnpm test` exits non-zero

### Requirement: Pre-commit enforcement

A pre-commit hook installed by `simple-git-hooks` SHALL run `lint-staged`
against staged files, applying ESLint autofix and Prettier formatting before
the commit is created. The hook SHALL operate only on staged files and SHALL
NOT run whole-project type-checking or tests.

#### Scenario: Hook is installed by install

- **WHEN** a developer runs `pnpm install` on a fresh clone
- **THEN** a `pre-commit` hook is registered in the repository's git hooks

#### Scenario: Misformatted staged code is fixed before commit

- **WHEN** a developer stages a misformatted `.tsx` file and commits
- **THEN** the file is reformatted and the reformatted content is what gets
  committed

#### Scenario: Unfixable lint errors block the commit

- **WHEN** a staged file contains a lint error that autofix cannot resolve
- **THEN** the commit is aborted and the error is reported

#### Scenario: Unstaged files are left alone

- **WHEN** a commit runs while unrelated misformatted files are unstaged
- **THEN** those files are not modified and do not block the commit

### Requirement: Documented code rules

The project SHALL carry a `docs/CODE_RULES.md` describing the code
conventions, and `AGENTS.md` SHALL link to it so that agents and contributors
reach the same document.

#### Scenario: Code rules are reachable from the agent entry point

- **WHEN** a reader follows the links in `AGENTS.md`
- **THEN** `docs/CODE_RULES.md` is reachable and describes the conventions the
  configured tooling enforces
