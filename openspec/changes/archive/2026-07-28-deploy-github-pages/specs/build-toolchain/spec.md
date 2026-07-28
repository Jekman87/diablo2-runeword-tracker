## MODIFIED Requirements

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
