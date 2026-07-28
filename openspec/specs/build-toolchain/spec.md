# build-toolchain Specification

## Purpose

The application builds, runs and type-checks: package manager, Vite, React,
TypeScript, Tailwind, the module path alias, and the npm scripts that expose
all of it.

## Requirements

### Requirement: Reproducible dependency installation

The project SHALL use pnpm as its package manager, with a committed lockfile
so that every checkout resolves to identical dependency versions. Dependency
build scripts that the project relies on SHALL be explicitly approved in
`pnpm-workspace.yaml`.

#### Scenario: Clean checkout installs

- **WHEN** a developer clones the repository and runs `pnpm install`
- **THEN** installation completes without error
- **AND** `pnpm-lock.yaml` is unchanged afterwards

#### Scenario: Required build scripts are approved

- **WHEN** `pnpm install` runs on a clean checkout
- **THEN** the `simple-git-hooks` postinstall script executes
- **AND** pnpm emits no "ignored build scripts" warning for it

### Requirement: Development server

The project SHALL provide a `dev` script that starts the Vite development
server with hot module replacement.

#### Scenario: Dev server serves the app shell

- **WHEN** a developer runs `pnpm dev` and opens the printed local URL
- **THEN** the application shell renders without console errors

#### Scenario: Edits are hot-reloaded

- **WHEN** a source file under `src/` is saved while `pnpm dev` is running
- **THEN** the browser reflects the change without a full page reload

### Requirement: Production build

The project SHALL provide a `build` script that type-checks and then produces
a static, deployable bundle, and a `preview` script that serves the result.
The bundle SHALL be built for deployment under the repository sub-path
`/diablo2-runeword-tracker/`, so that asset references in the emitted
`index.html` resolve correctly on GitHub Pages. The configured base path SHALL
be a committed constant rather than an environment-dependent value, so that
`pnpm preview` reproduces production asset resolution exactly.

#### Scenario: Build succeeds

- **WHEN** a developer runs `pnpm build`
- **THEN** the command exits zero
- **AND** `dist/` contains `index.html` plus hashed JS and CSS assets

#### Scenario: Type errors block the build

- **WHEN** a type error exists anywhere under `src/`
- **THEN** `pnpm build` exits non-zero and reports the error

#### Scenario: Built output is servable

- **WHEN** a developer runs `pnpm preview` after a successful build
- **THEN** the served page renders identically to the dev server output

#### Scenario: Asset references carry the base path

- **WHEN** `pnpm build` completes
- **THEN** every script and stylesheet reference in `dist/index.html` is
  prefixed with `/diablo2-runeword-tracker/`

#### Scenario: A wrong base path fails the pipeline

- **WHEN** the configured base path does not match the deployment sub-path
- **THEN** the continuous integration run fails and reports the mismatch,
  rather than producing a bundle that only breaks once deployed

### Requirement: TypeScript strict mode

TypeScript SHALL be configured in strict mode for all application code, with
unused locals and unused parameters reported as errors. A `typecheck` script
SHALL expose this independently of the build.

#### Scenario: Typecheck passes on the scaffold

- **WHEN** a developer runs `pnpm typecheck` on the committed scaffold
- **THEN** the command exits zero with no diagnostics

#### Scenario: Implicit any is rejected

- **WHEN** application code declares a parameter with an inferred `any` type
- **THEN** `pnpm typecheck` exits non-zero

### Requirement: Tailwind CSS styling pipeline

Tailwind CSS v4 SHALL be integrated through its Vite plugin, with a single
stylesheet entry point imported by the application entry module.

#### Scenario: Utility classes are applied

- **WHEN** an element in the app shell carries a Tailwind utility class
- **THEN** the corresponding style is present in both dev and built output

#### Scenario: No legacy Tailwind config files exist

- **WHEN** the repository root is inspected
- **THEN** neither `tailwind.config.js` nor `postcss.config.js` is present

### Requirement: Module path alias

The project SHALL resolve `@/*` to `src/*` in both the TypeScript compiler and
the Vite bundler, so that a single import specifier works at check time, dev
time, build time and test time.

#### Scenario: Aliased import resolves everywhere

- **WHEN** a module imports another via `@/…`
- **THEN** `pnpm typecheck`, `pnpm build` and `pnpm test` all resolve it
  successfully

### Requirement: Vendored reference data is excluded from the build

The `vendor/` directory is a read-only third-party snapshot. It SHALL be
excluded from TypeScript compilation, from linting and from formatting, and
SHALL NOT be reachable from the application bundle.

#### Scenario: Vendored TypeScript is not compiled

- **WHEN** `pnpm typecheck` runs
- **THEN** no diagnostic references a file under `vendor/`

#### Scenario: Vendored files are not bundled

- **WHEN** `pnpm build` completes
- **THEN** no content originating from `vendor/` appears in `dist/`

### Requirement: Declared utility dependencies are usable

The utility libraries the project's code rules depend on — `clsx`,
`tailwind-merge`, `class-variance-authority` and `zod` — SHALL be installed as
runtime dependencies and SHALL be importable and functional.

#### Scenario: Each utility imports and executes

- **WHEN** the test suite imports `clsx`, `tailwind-merge`,
  `class-variance-authority` and `zod` and exercises each
- **THEN** every assertion passes
