## MODIFIED Requirements

### Requirement: Production build

The project SHALL provide a `build` script that type-checks and then produces
a static, deployable bundle, and a `preview` script that serves the result.
The bundle SHALL be built for deployment under the repository sub-path
`/diablo2-runeword-tracker/`, so that asset references in the emitted
`index.html` resolve correctly on GitHub Pages. The configured base path SHALL
be a committed constant rather than an environment-dependent value, so that
`pnpm preview` reproduces production asset resolution exactly.

**The build SHALL also render the application into both entry documents.** That
render is part of `pnpm build` rather than a separate command someone must
remember: a deploy that shipped an unprerendered document would be a silent loss
of everything a crawler is given, and the only reliable guard is that there is no
way to build without it.

The render pass SHALL fail the build when it fails, rather than emitting a
document with an empty root. A missing prerender breaks nothing a reader would
notice, which is exactly why it must break the build.

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

#### Scenario: Both built documents carry rendered content

- **WHEN** `pnpm build` completes
- **THEN** `dist/index.html` and `dist/ru/index.html` each contain the rendered
  list rather than an empty root element

#### Scenario: A failing render fails the build

- **WHEN** the render pass throws — a browser API reached during render, say
- **THEN** `pnpm build` exits non-zero naming the failure, and emits no document
  with an empty root
