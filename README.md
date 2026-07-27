# Diablo II Runeword Tracker

Track which Diablo II: Resurrected runewords you have already crafted, and see
which runes and socketed bases you still need to finish the runeword section of
the in-game Chronicle log.

**Status: pre-alpha.** Nothing is built yet — this repository currently holds
the specifications, research and vendored source data.

- [`IDEAS.md`](IDEAS.md) — backlog and phase plan
- [`docs/REFERENCE.md`](docs/REFERENCE.md) — analysis of the reference site
- [`docs/DATA-SOURCES.md`](docs/DATA-SOURCES.md) — data provenance and schema
- [`openspec/`](openspec/) — specifications, managed with [OpenSpec](https://github.com/Fission-AI/OpenSpec)

## Planned stack

React, TypeScript, Vite, Tailwind CSS. No backend: runeword data ships as a
static file and progress is kept in `localStorage`. Deployed to GitHub Pages.

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
