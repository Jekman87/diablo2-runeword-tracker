## ADDED Requirements

### Requirement: Published site

The built application SHALL be published to GitHub Pages at
`https://jekman87.github.io/diablo2-runeword-tracker/` from the `main` branch,
using the GitHub Actions Pages deployment path rather than a committed build
branch. The published page SHALL render the application shell with its styles
applied.

#### Scenario: Push to main publishes

- **WHEN** a commit is pushed to `main` and the quality gate passes
- **THEN** the built bundle is deployed to GitHub Pages
- **AND** the deployed URL serves the application shell

#### Scenario: Deployed page loads its assets

- **WHEN** the deployed URL is loaded in a browser
- **THEN** the hashed JavaScript and CSS assets are requested from under the
  repository sub-path and return HTTP 200
- **AND** the page renders with Tailwind styles applied and no console errors

#### Scenario: Build output is not committed to a branch

- **WHEN** the deployment completes
- **THEN** no build output has been committed to any branch of the repository

### Requirement: Deployment is gated on the quality gate

Deployment SHALL occur only after the quality gate has passed for the same
commit. A failing gate SHALL prevent deployment, leaving the previously
published site in place.

#### Scenario: Failing gate blocks deployment

- **WHEN** a commit is pushed to `main` and any gate check fails
- **THEN** no deployment occurs
- **AND** the previously published site remains available and unchanged

#### Scenario: Pull requests do not deploy

- **WHEN** the workflow runs for a pull request
- **THEN** the gate runs but no deployment occurs

#### Scenario: Only main deploys

- **WHEN** a commit is pushed to a branch other than `main`
- **THEN** no deployment occurs

### Requirement: Deployments do not overlap

Concurrent deployments SHALL be serialised rather than run in parallel or
cancelled mid-flight, so that a deployment cannot be interrupted partway
through.

#### Scenario: A second push queues behind the first

- **WHEN** a second commit is pushed to `main` while a deployment is in progress
- **THEN** the second deployment waits for the first to finish
- **AND** the in-progress deployment is not cancelled

### Requirement: Deployment is traceable

Each deployment SHALL be attributable to the commit it was built from, and the
live URL SHALL be discoverable from the repository's documentation.

#### Scenario: Deployment records its commit

- **WHEN** a deployment completes
- **THEN** the deployment is recorded against the commit that triggered it

#### Scenario: The live URL is documented

- **WHEN** a reader opens `README.md`
- **THEN** the live site URL is present
- **AND** the current workflow status is visible as a badge
