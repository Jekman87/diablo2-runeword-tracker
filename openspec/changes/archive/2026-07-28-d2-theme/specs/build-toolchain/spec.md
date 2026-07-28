## MODIFIED Requirements

### Requirement: Vendored reference data is excluded from the build

The `vendor/` directory is a read-only third-party snapshot. It SHALL be
excluded from TypeScript compilation, from linting and from formatting, and no
module under `src/` SHALL import from it. Content **taken** from that snapshot MAY
ship in the bundle, provided it has been committed under `src/` — either
transformed into the project's own schema, as data is, or copied byte-for-byte,
as a binary asset is, since an image has no schema to transform into. That reuse
is the project's purpose, and what this requirement protects is the snapshot's
read-only status and its absence from the type-checked, linted and bundled module
graph, not the content itself. Build-time tooling outside `src/` MAY read the
snapshot's files, as text rather than as modules, so that reading it cannot pull
it into compilation.

#### Scenario: Vendored TypeScript is not compiled

- **WHEN** `pnpm typecheck` runs
- **THEN** no diagnostic references a file under `vendor/`

#### Scenario: Vendored files are not linted or reformatted

- **WHEN** `pnpm lint` and `pnpm format` run
- **THEN** no problem is reported against a file under `vendor/`
- **AND** no file under `vendor/` is modified

#### Scenario: Application code does not import the snapshot

- **WHEN** the imports of every module under `src/` are inspected
- **THEN** none resolves into `vendor/`

#### Scenario: The snapshot itself is not bundled

- **WHEN** `pnpm build` completes
- **THEN** no file under `vendor/` has been included as a module in `dist/`

#### Scenario: Derived data may be bundled

- **WHEN** data derived from the snapshot has been transformed into the project's
  own schema and committed under `src/`
- **THEN** importing it from application code is permitted
- **AND** it appears in `dist/` like any other application asset

#### Scenario: Copied assets may be bundled

- **WHEN** a binary asset from the snapshot has been copied byte-for-byte under
  `src/` and is referenced from application code or from the project's stylesheet
- **THEN** bundling it is permitted
- **AND** the vendored original remains in place, unmodified and unimported
