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
under `openspec/changes/`.

**Grouping.** Related features the owner asks for together SHOULD be one OpenSpec
change with one propose–apply–archive cycle — not one change per bullet. Split
only when the pieces have no shared surface, would ship on different timelines,
or one is blocked on an unsettled decision the others do not need. A whole
backlog phase still does not become one change by default; a coherent batch the
owner named in one request does. `phase-5-polish` is the precedent for a
finishing batch; a request that lists toggle confirmation, a completion message
and bilingual import in one breath is the same shape.

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
