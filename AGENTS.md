# Agent Instructions

## Read first

- [`IDEAS.md`](IDEAS.md) — the backlog and phase plan. Decisions recorded there
  are settled; do not relitigate them in a proposal.
- [`docs/SITE.md`](docs/SITE.md) — site-level constants (patch, URLs, donation)
  and what the deployed page gives search engines.
- [`docs/DATA-SOURCES.md`](docs/DATA-SOURCES.md) — where the runeword data comes
  from and its confirmed schema.
- [`docs/REFERENCE.md`](docs/REFERENCE.md) — analysis of the reference site,
  including the visual details we are deliberately reusing.
- [`docs/CODE_RULES.md`](docs/CODE_RULES.md) — the code conventions in full,
  and which of them the toolchain enforces. The Code section below is the
  summary; that document is the detail.

## Specifications

This project uses OpenSpec. Requirements live in `openspec/`, not in chat
history. Before implementing anything, check that a corresponding change exists
under `openspec/changes/`. Keep changes small — one feature per change, never a
whole phase.

**Exception for a finishing stage.** A polish phase whose items are each a
handful of lines — and that share one palette pass, one layout restructure, or
one set of closing furniture — MAY be one OpenSpec change covering the stage,
with one propose–apply–archive cycle. `phase-5-polish` is the precedent. A
token rename still does not earn its own cycle; a whole new capability still
does.

## Language

- All specs, code, comments and commit messages in **English**.
- The UI is bilingual, Russian and English. Every user-facing string goes
  through the i18n layer; no hardcoded display text in components.
- Runeword and rune names stay in their English form as canonical identifiers.
  Russian names are translations layered on top, taken from official sources
  only — never machine-translated.

## Data rules

- `vendor/` is a read-only reference snapshot. Never edit it.
- Socket count is derived: it equals `runes.length`. Do not store it.
- Rune order is significant and must be preserved. `Infinity` is
  `Ber Mal Ber Ist`, and repeats are real.
- The `ladder`, `version` and `note` fields are **decoration only**. They render
  badges with tooltips. No filter reads them, no counter subtracts them, no
  logic branches on them.
- Progress is always out of all 99 runewords.
- Validate the dataset with `zod` rather than trusting its shape.

## Code

Summarised here; [`docs/CODE_RULES.md`](docs/CODE_RULES.md) has the full set
and names the tool that enforces each one.

- React function components, TypeScript, no class components.
- Tailwind for styling. Compose conditional classes with `clsx` and
  `tailwind-merge`; use `class-variance-authority` for component variants.
- Structure files top-to-bottom: public exports and high-level entry points
  first, file-private helpers and low-level details last.
- Keep dependencies minimal. Prefer plain React over adding a library unless a
  spec calls for one.
- The remaining-runes and remaining-bases aggregation is pure logic — it gets
  unit tests in `vitest`.

## Commits

Conventional commits, one line: `type(scope): subject`.
