## MODIFIED Requirements

### Requirement: Published site

The built application SHALL be published to GitHub Pages at
`https://jekman87.github.io/diablo2-runeword-tracker/` from the `main` branch,
using the GitHub Actions Pages deployment path rather than a committed build
branch. The published page SHALL render the application shell with its styles
applied, including every static asset those styles reference.

Every asset referenced from the project's stylesheet SHALL be emitted as a
separate fingerprinted file, regardless of its size, rather than embedded into
the stylesheet as a data URI. Whether an asset is covered by the sub-path
guarantee below SHALL NOT depend on how large it is.

#### Scenario: Push to main publishes

- **WHEN** a commit is pushed to `main` and the quality gate passes
- **THEN** the built bundle is deployed to GitHub Pages
- **AND** the deployed URL serves the application shell

#### Scenario: Deployed page loads its assets

- **WHEN** the deployed URL is loaded in a browser
- **THEN** the hashed JavaScript and CSS assets are requested from under the
  repository sub-path and return HTTP 200
- **AND** the page renders with Tailwind styles applied and no console errors

#### Scenario: Assets referenced from CSS resolve under the sub-path

- **WHEN** the built stylesheet references a font or an image
- **THEN** that reference is rewritten to a fingerprinted URL carrying the
  repository sub-path prefix
- **AND** the asset returns HTTP 200 from the deployed site, so a reference that
  resolves locally cannot break only once deployed

#### Scenario: Small assets are emitted as files rather than inlined

- **WHEN** the build processes an asset small enough that the bundler would
  otherwise embed it in the stylesheet as a data URI
- **THEN** it is emitted as a separate fingerprinted file like any other
- **AND** its reference carries the sub-path prefix, so the guarantee above
  covers every asset the stylesheet names and not merely the large ones

#### Scenario: Build output is not committed to a branch

- **WHEN** the deployment completes
- **THEN** no build output has been committed to any branch of the repository
