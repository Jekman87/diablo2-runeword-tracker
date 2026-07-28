# Diablo II Runeword Tracker

Track which Diablo II: Resurrected runewords you have already crafted, and see
which runes and socketed bases you still need to finish the runeword section of
the in-game Chronicle log.

**Status: pre-alpha.** The toolchain is scaffolded and the app shell runs; no
runeword features are implemented yet.

- [`IDEAS.md`](IDEAS.md) — backlog and phase plan
- [`docs/REFERENCE.md`](docs/REFERENCE.md) — analysis of the reference site
- [`docs/DATA-SOURCES.md`](docs/DATA-SOURCES.md) — data provenance and schema
- [`docs/CODE_RULES.md`](docs/CODE_RULES.md) — code conventions and what enforces them
- [`openspec/`](openspec/) — specifications, managed with [OpenSpec](https://github.com/Fission-AI/OpenSpec)

## Getting started

Prerequisites: **Node.js 20.19+** and **pnpm 10+** (`corepack enable pnpm`).

```bash
pnpm install   # also registers the pre-commit hook
pnpm dev       # http://localhost:5173
```

### Scripts

| Script              | What it does                                        |
| ------------------- | --------------------------------------------------- |
| `pnpm dev`          | Vite dev server with hot module replacement         |
| `pnpm build`        | Type-check, then build a static bundle into `dist/` |
| `pnpm preview`      | Serve the built bundle locally                      |
| `pnpm typecheck`    | `tsc --build` across the app and Node configs       |
| `pnpm lint`         | ESLint over the project                             |
| `pnpm format`       | Prettier, writing changes                           |
| `pnpm format:check` | Prettier, verifying only — the CI-shaped variant    |
| `pnpm test`         | Vitest once                                         |
| `pnpm test:watch`   | Vitest in watch mode                                |

A `pre-commit` hook runs ESLint autofix and Prettier over staged files. Type
checking and tests are not in the hook — run them yourself, or let CI do it.

## Stack

React 19, TypeScript, Vite, Tailwind CSS v4. No backend: runeword data ships as
a static file and progress is kept in `localStorage`. Deployed to GitHub Pages.

## Scope

All 99 runewords tracked by the Chronicle log. Progress is always shown out of
99 — nine of them are ladder-only, and that is surfaced as a badge rather than
by adjusting the total.

## Credits

Runeword data, the rune sprite and the visual language are derived from
[**Runewizard**](https://fabd.github.io/diablo2-runewizard/) by Fabrice Denis
([fabd/diablo2-runewizard](https://github.com/fabd/diablo2-runewizard)), used
under the MIT licence. The vendored files and the original licence text live in
[`vendor/runewizard/`](vendor/runewizard/).

Diablo II and all related artwork are the property of Blizzard Entertainment.
This is an unofficial fan project, not affiliated with or endorsed by Blizzard.

## Licence

To be decided before the first release.
