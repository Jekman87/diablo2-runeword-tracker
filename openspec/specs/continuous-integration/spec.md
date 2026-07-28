# continuous-integration Specification

## Purpose

The automated quality gate: which checks run, on which events, how a failure is
surfaced, and the guarantee that CI and a developer machine run the same
toolchain versions.

## Requirements

### Requirement: Automated quality gate

A GitHub Actions workflow SHALL run the project's full quality gate —
type-checking, linting, format verification, unit tests and a production build —
on every push to `main` and on every pull request targeting `main`. Each check
SHALL be reported as a distinct step so that a failure identifies which check
failed. Any failing check SHALL fail the workflow run.

#### Scenario: Gate passes on a healthy commit

- **WHEN** a commit that passes all five local commands is pushed to `main`
- **THEN** the workflow run completes successfully
- **AND** the type-check, lint, format, test and build steps each report success
  individually

#### Scenario: A lint error fails the run

- **WHEN** a pushed commit contains a lint error
- **THEN** the workflow run fails
- **AND** the failing step is the lint step, not a combined step

#### Scenario: A failing test fails the run

- **WHEN** a pushed commit contains a failing unit test
- **THEN** the workflow run fails and reports the failing test

#### Scenario: Pull requests are gated

- **WHEN** a pull request targeting `main` is opened or updated
- **THEN** the same gate runs against the pull request's head commit
- **AND** its result is reported on the pull request

### Requirement: Reproducible toolchain in CI

The workflow SHALL resolve its Node.js and pnpm versions from files committed to
the repository rather than from values written inline in the workflow, so that a
developer machine and CI cannot drift apart. Dependencies SHALL be installed
from the committed lockfile without modifying it.

#### Scenario: pnpm version comes from the manifest

- **WHEN** the workflow sets up pnpm
- **THEN** the version used is the one declared in `package.json`'s
  `packageManager` field

#### Scenario: Node version comes from a committed file

- **WHEN** the workflow sets up Node.js
- **THEN** the version used is the one declared in the repository's Node version
  file

#### Scenario: Install does not alter the lockfile

- **WHEN** the workflow installs dependencies
- **THEN** the install is frozen against `pnpm-lock.yaml`
- **AND** the run fails if the lockfile and `package.json` disagree

#### Scenario: Dependency cache is reused

- **WHEN** the workflow runs with an unchanged lockfile after a previous run
- **THEN** the pnpm store is restored from cache rather than downloaded again
