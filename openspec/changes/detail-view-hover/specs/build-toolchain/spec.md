## MODIFIED Requirements

### Requirement: Declared utility dependencies are usable

The utility libraries the project's code rules depend on — `clsx`,
`tailwind-merge`, `class-variance-authority`, `zod` and `@floating-ui/react` —
SHALL be installed as runtime dependencies and SHALL be importable and functional.

The set SHALL stay small enough to enumerate, and this requirement is where the
enumeration lives: a change that adds a runtime dependency SHALL add it here and
SHALL state in its proposal what the dependency buys that hand-written code would
not. Adding one is a decision to be argued rather than a detail to be noticed in a
lockfile diff.

#### Scenario: Each utility imports and executes

- **WHEN** the test suite imports `clsx`, `tailwind-merge`,
  `class-variance-authority`, `zod` and `@floating-ui/react` and exercises each
- **THEN** every assertion passes

#### Scenario: No utility dependency is absent from the list

- **WHEN** the runtime dependencies in `package.json` are read, setting aside the
  framework itself
- **THEN** every one of them is named by this requirement, so a utility cannot
  arrive without the requirement being updated to admit it
